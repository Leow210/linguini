package com.starlitchat.app;

import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

final class StarlitAndroidBridge {
    private final Context context;

    StarlitAndroidBridge(Context context) {
        this.context = context.getApplicationContext();
    }

    @JavascriptInterface
    public boolean saveTextFile(String filename, String mimeType, String content) {
        try {
            writeDownload(filename, mimeType, content);
            Toast.makeText(context, "Saved to Downloads: " + filename, Toast.LENGTH_SHORT).show();
            return true;
        } catch (Exception error) {
            Toast.makeText(context, "Could not save export: " + error.getMessage(), Toast.LENGTH_LONG).show();
            return false;
        }
    }

    private void writeDownload(String filename, String mimeType, String content) throws Exception {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            ContentValues values = new ContentValues();
            values.put(MediaStore.Downloads.DISPLAY_NAME, filename);
            values.put(MediaStore.Downloads.MIME_TYPE, mimeType);
            values.put(MediaStore.Downloads.IS_PENDING, 1);
            ContentResolver resolver = context.getContentResolver();
            Uri uri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
            if (uri == null) throw new IllegalStateException("Downloads provider returned no URI");
            try (OutputStream output = resolver.openOutputStream(uri)) {
                if (output == null) throw new IllegalStateException("Could not open Downloads file");
                output.write(content.getBytes(StandardCharsets.UTF_8));
            }
            values.clear();
            values.put(MediaStore.Downloads.IS_PENDING, 0);
            resolver.update(uri, values, null, null);
            return;
        }

        File downloads = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
        if (!downloads.exists() && !downloads.mkdirs()) {
            throw new IllegalStateException("Could not create Downloads folder");
        }
        try (OutputStream output = new FileOutputStream(new File(downloads, filename))) {
            output.write(content.getBytes(StandardCharsets.UTF_8));
        }
    }
}
