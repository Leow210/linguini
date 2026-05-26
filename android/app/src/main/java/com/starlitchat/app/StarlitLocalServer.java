package com.starlitchat.app;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.res.AssetManager;
import android.webkit.MimeTypeMap;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.URL;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

final class StarlitLocalServer {
    private static final String STATE_KEY = "app_state_json";
    private static final String DEFAULT_TARGET = "http://127.0.0.1:1234/v1/chat/completions";

    private final Context context;
    private final SharedPreferences preferences;
    private ServerSocket serverSocket;
    private Thread serverThread;
    private volatile boolean running;
    private int port;

    StarlitLocalServer(Context context) {
        this.context = context.getApplicationContext();
        this.preferences = this.context.getSharedPreferences("starlit-chat", Context.MODE_PRIVATE);
    }

    void start() {
        try {
            serverSocket = new ServerSocket(0, 50, InetAddress.getByName("127.0.0.1"));
            port = serverSocket.getLocalPort();
            running = true;
            serverThread = new Thread(this::serveLoop, "StarlitLocalServer");
            serverThread.start();
        } catch (IOException error) {
            throw new IllegalStateException("Could not start local Starlit server", error);
        }
    }

    void stop() {
        running = false;
        try {
            if (serverSocket != null) serverSocket.close();
        } catch (IOException ignored) {
        }
    }

    String getBaseUrl() {
        return "http://127.0.0.1:" + port;
    }

    private void serveLoop() {
        while (running) {
            try {
                Socket socket = serverSocket.accept();
                new Thread(() -> handle(socket), "StarlitRequest").start();
            } catch (IOException error) {
                if (running) error.printStackTrace();
            }
        }
    }

    private void handle(Socket socket) {
        try (Socket closeableSocket = socket;
             InputStream input = new BufferedInputStream(closeableSocket.getInputStream());
             OutputStream output = new BufferedOutputStream(closeableSocket.getOutputStream())) {
            HttpRequest request = readRequest(input);
            if (request == null) return;
            String path = stripQuery(request.path);
            if ("/api/state".equals(path)) {
                handleState(request, output);
            } else if ("/api/chat".equals(path)) {
                handleChat(request, output);
            } else {
                serveAsset(path, output);
            }
            output.flush();
        } catch (IOException error) {
            error.printStackTrace();
        }
    }

    private void handleState(HttpRequest request, OutputStream output) throws IOException {
        if ("POST".equals(request.method)) {
            preferences.edit().putString(STATE_KEY, new String(request.body, StandardCharsets.UTF_8)).apply();
            writeResponse(output, 200, "application/json", "{\"ok\":true}".getBytes(StandardCharsets.UTF_8));
            return;
        }
        String state = preferences.getString(STATE_KEY, "{}");
        writeResponse(output, 200, "application/json; charset=utf-8", state.getBytes(StandardCharsets.UTF_8));
    }

    private void handleChat(HttpRequest request, OutputStream output) throws IOException {
        String target = queryParams(request.path).get("target");
        if (target == null || target.trim().isEmpty()) target = DEFAULT_TARGET;

        HttpURLConnection connection = null;
        try {
            connection = (HttpURLConnection) new URL(target).openConnection();
            connection.setConnectTimeout(0);
            connection.setReadTimeout(0);
            connection.setRequestMethod("POST");
            connection.setDoOutput(true);
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestProperty("Accept", "application/json");
            String apiKey = request.headers.get("x-llm-api-key");
            String authStyle = request.headers.get("x-llm-auth-style");
            if (authStyle != null && authStyle.trim().equalsIgnoreCase("anthropic")) {
                connection.setRequestProperty("anthropic-version", "2023-06-01");
                if (apiKey != null && !apiKey.trim().isEmpty()) {
                    connection.setRequestProperty("x-api-key", apiKey.trim());
                }
            } else if (apiKey != null && !apiKey.trim().isEmpty()) {
                connection.setRequestProperty("Authorization", "Bearer " + apiKey.trim());
            }
            try (OutputStream proxyBody = connection.getOutputStream()) {
                proxyBody.write(request.body);
            }

            int status = connection.getResponseCode();
            String contentType = connection.getContentType();
            InputStream responseStream = status >= 400 ? connection.getErrorStream() : connection.getInputStream();
            byte[] payload = responseStream == null ? new byte[0] : readAll(responseStream);
            writeResponse(output, status, contentType == null ? "application/json" : contentType, payload);
        } catch (IOException error) {
            String message = "Could not reach " + target + ": " + error.getMessage();
            writeResponse(output, 502, "text/plain; charset=utf-8", message.getBytes(StandardCharsets.UTF_8));
        } finally {
            if (connection != null) connection.disconnect();
        }
    }

    private void serveAsset(String path, OutputStream output) throws IOException {
        String cleanPath = path.equals("/") ? "/index.html" : path;
        if (cleanPath.contains("..")) {
            writeResponse(output, 403, "text/plain", "Forbidden".getBytes(StandardCharsets.UTF_8));
            return;
        }
        String assetPath = "www" + cleanPath;
        AssetManager assets = context.getAssets();
        try (InputStream asset = assets.open(assetPath)) {
            writeResponse(output, 200, contentTypeFor(cleanPath), readAll(asset));
        } catch (IOException missing) {
            writeResponse(output, 404, "text/plain", "Not found".getBytes(StandardCharsets.UTF_8));
        }
    }

    private static HttpRequest readRequest(InputStream input) throws IOException {
        String headerText = readHeaders(input);
        if (headerText == null || headerText.isEmpty()) return null;
        String[] lines = headerText.split("\\r?\\n");
        String[] requestLine = lines[0].split(" ");
        if (requestLine.length < 2) return null;
        Map<String, String> headers = new HashMap<>();
        for (int index = 1; index < lines.length; index++) {
            int colon = lines[index].indexOf(':');
            if (colon > 0) {
                headers.put(
                        lines[index].substring(0, colon).trim().toLowerCase(Locale.US),
                        lines[index].substring(colon + 1).trim()
                );
            }
        }
        int contentLength = 0;
        if (headers.containsKey("content-length")) {
            contentLength = Integer.parseInt(headers.get("content-length"));
        }
        byte[] body = new byte[contentLength];
        int offset = 0;
        while (offset < contentLength) {
            int count = input.read(body, offset, contentLength - offset);
            if (count < 0) break;
            offset += count;
        }
        return new HttpRequest(requestLine[0], requestLine[1], headers, body);
    }

    private static String readHeaders(InputStream input) throws IOException {
        ByteArrayOutputStream headers = new ByteArrayOutputStream();
        int matched = 0;
        int current;
        byte[] marker = new byte[]{'\r', '\n', '\r', '\n'};
        while ((current = input.read()) != -1) {
            headers.write(current);
            if ((byte) current == marker[matched]) {
                matched++;
                if (matched == marker.length) break;
            } else {
                matched = (byte) current == marker[0] ? 1 : 0;
            }
        }
        return headers.toString("UTF-8").trim();
    }

    private static void writeResponse(OutputStream output, int status, String contentType, byte[] body) throws IOException {
        String reason = reasonPhrase(status);
        String headers = "HTTP/1.1 " + status + " " + reason + "\r\n"
                + "Content-Type: " + contentType + "\r\n"
                + "Content-Length: " + body.length + "\r\n"
                + "Access-Control-Allow-Origin: *\r\n"
                + "Connection: close\r\n\r\n";
        output.write(headers.getBytes(StandardCharsets.UTF_8));
        output.write(body);
    }

    private static byte[] readAll(InputStream input) throws IOException {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        byte[] buffer = new byte[8192];
        int count;
        while ((count = input.read(buffer)) != -1) {
            output.write(buffer, 0, count);
        }
        return output.toByteArray();
    }

    private static String stripQuery(String path) {
        int query = path.indexOf('?');
        return query >= 0 ? path.substring(0, query) : path;
    }

    private static Map<String, String> queryParams(String path) {
        Map<String, String> params = new HashMap<>();
        int query = path.indexOf('?');
        if (query < 0 || query == path.length() - 1) return params;
        String[] pairs = path.substring(query + 1).split("&");
        for (String pair : pairs) {
            int equals = pair.indexOf('=');
            String key = equals >= 0 ? pair.substring(0, equals) : pair;
            String value = equals >= 0 ? pair.substring(equals + 1) : "";
            params.put(urlDecode(key), urlDecode(value));
        }
        return params;
    }

    private static String urlDecode(String value) {
        try {
            return URLDecoder.decode(value, "UTF-8");
        } catch (Exception ignored) {
            return value;
        }
    }

    private static String contentTypeFor(String path) {
        if (path.endsWith(".js")) return "application/javascript; charset=utf-8";
        if (path.endsWith(".css")) return "text/css; charset=utf-8";
        if (path.endsWith(".html")) return "text/html; charset=utf-8";
        String extension = MimeTypeMap.getFileExtensionFromUrl(path);
        String type = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension);
        return type == null ? "application/octet-stream" : type;
    }

    private static String reasonPhrase(int status) {
        if (status == 200) return "OK";
        if (status == 204) return "No Content";
        if (status == 400) return "Bad Request";
        if (status == 403) return "Forbidden";
        if (status == 404) return "Not Found";
        if (status == 502) return "Bad Gateway";
        return status >= 400 ? "Error" : "OK";
    }

    private static final class HttpRequest {
        final String method;
        final String path;
        final Map<String, String> headers;
        final byte[] body;

        HttpRequest(String method, String path, Map<String, String> headers, byte[] body) {
            this.method = method;
            this.path = path;
            this.headers = headers;
            this.body = body;
        }
    }
}
