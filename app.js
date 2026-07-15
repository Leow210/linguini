const STORAGE_KEY = "linguini-state-v2";
const LEGACY_STORAGE_KEY = "lumalingua-state-v1";

const LANGUAGES = [
  "Albanian", "Arabic", "Basque", "Bengali", "Bulgarian", "Burmese", "Catalan", "Chinese (Cantonese)", "Chinese (Mandarin)",
  "Croatian", "Czech", "Danish", "Dutch", "English", "Estonian", "Faroese", "Finnish", "French", "German", "Greek",
  "Gujarati", "Hebrew", "Hindi", "Hungarian", "Icelandic", "Indonesian", "Italian", "Japanese", "Kannada", "Kazakh",
  "Korean", "Latvian", "Lithuanian", "Malay", "Malayalam", "Marathi", "Norwegian", "Persian", "Polish", "Portuguese",
  "Punjabi", "Romanian", "Russian", "Serbian", "Slovak", "Slovenian", "Spanish", "Swahili", "Swedish", "Tamil",
  "Telugu", "Thai", "Turkish", "Ukrainian", "Urdu", "Vietnamese", "Welsh"
];

const NON_LATIN_LANGUAGES = new Set([
  "Arabic", "Bengali", "Bulgarian", "Burmese", "Chinese (Cantonese)", "Chinese (Mandarin)",
  "Greek", "Gujarati", "Hebrew", "Hindi", "Japanese", "Kannada", "Kazakh", "Korean",
  "Malayalam", "Marathi", "Persian", "Punjabi", "Russian", "Serbian", "Tamil",
  "Telugu", "Thai", "Ukrainian", "Urdu"
]);

const BEGINNER_LEVELS = new Set(["Absolute beginner", "Beginner"]);

const LOCAL_HOSTS = ["127.0.0.1", "localhost", "::1"];
// The Python dev server and the Android in-app server both live on localhost.
// On a hosted origin (Cloudflare Pages) there is no /api/state endpoint.
const HAS_STATE_SERVER = LOCAL_HOSTS.includes(window.location.hostname);

const LEVEL_TO_DIFFICULTY = {
  "Absolute beginner": "A1 survival",
  "Beginner": "A1 survival",
  "Lower intermediate": "B1 independent",
  "Upper intermediate": "B2 nuanced",
  "Advanced": "C1 natural",
  "Heritage speaker": "C1 natural"
};

const DEFAULT_ENDPOINT = "http://127.0.0.1:1234/v1/chat/completions";

const PROVIDER_PRESETS = [
  { id: "custom", label: "Custom / current" },
  { id: "lmstudio", label: "LM Studio (local)", endpoint: "http://127.0.0.1:1234/v1/chat/completions", model: "gemma-4" },
  { id: "openai", label: "OpenAI", endpoint: "https://api.openai.com/v1/chat/completions", model: "gpt-5" },
  { id: "anthropic", label: "Anthropic Claude", endpoint: "https://api.anthropic.com/v1/messages", model: "claude-opus-4-7" },
  { id: "openrouter", label: "OpenRouter", endpoint: "https://openrouter.ai/api/v1/chat/completions", model: "anthropic/claude-opus-4-7" },
  { id: "google", label: "Google Gemini (OpenAI compat)", endpoint: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", model: "gemini-2.0-pro" },
  { id: "deepseek", label: "DeepSeek", endpoint: "https://api.deepseek.com/v1/chat/completions", model: "deepseek-chat" },
  { id: "kimi", label: "Kimi / Moonshot", endpoint: "https://api.moonshot.ai/v1/chat/completions", model: "moonshot-v1-32k" },
  { id: "zai", label: "Z.ai (GLM)", endpoint: "https://api.z.ai/api/paas/v4/chat/completions", model: "glm-5.2" }
];

const defaultCharacters = [
  {
    id: "coach-mira",
    name: "Mira",
    role: "Warm conversation tutor",
    personality: "Patient, playful, precise, and encouraging. Keeps practice lively without burying the learner in corrections.",
    teaching: "Prompts the learner to answer in the target language, models one natural phrase at a time, and only corrects clear useful errors."
  },
  {
    id: "barista-ren",
    name: "Ren",
    role: "Cafe role-play partner",
    personality: "Friendly, quick, gently teasing, and good at keeping everyday conversations moving.",
    teaching: "Uses concrete daily-life language, asks short follow-up questions, and adapts difficulty to the learner."
  },
  {
    id: "archivist-sana",
    name: "Sana",
    role: "Grammar-focused archivist",
    personality: "Calm, scholarly, and curious. Likes patterns, etymology, and exact examples.",
    teaching: "Explains morphology, IPA, and Leipzig gloss when useful, then immediately asks the learner to produce a sentence."
  }
];

const defaultScenarios = [
  { id: "market", title: "Market errand", details: "The learner is buying ingredients at a busy local market. Practice prices, quantities, politeness, and repairs when misunderstood." },
  { id: "train", title: "Train station", details: "The learner needs to buy a ticket, ask about delays, and find the right platform." },
  { id: "academy", title: "Study partner", details: "The character and learner are classmates reviewing homework, swapping examples, and drilling the lesson concept." },
  { id: "custom", title: "Custom scenario", details: "" }
];

// The UI language is dropped from the target-language dropdown (you already
// speak it); everything else, including English, stays selectable.
const UI_TARGET_EXCLUDE = {
  en: "English",
  ja: "Japanese",
  "zh-Hant": "Chinese (Mandarin)",
  "zh-Hans": "Chinese (Mandarin)",
  ko: "Korean",
  es: "Spanish"
};

// Sample lessons live in samples.js (SAMPLE_PLANS_BY_LOCALE), loaded before this file.
function samplePlans() {
  return SAMPLE_PLANS_BY_LOCALE[state.uiLanguage] || SAMPLE_PLANS_BY_LOCALE.en;
}

const state = loadState();
let activeView = "plansView";
let activeLessonId = state.currentLessonId || "";
let activeCharacterId = state.currentCharacterId || state.characters[0]?.id || "";
let activeLessonMode = state.currentLessonMode === "edit" ? "edit" : "study";
let vocabSearch = "";
// Session-only navigation state: the Home button shows the landing page, and
// sample lessons render as previews without ever entering saved state.
let showLanding = false;
let sampleLessonPreview = null;

function leaveLanding() {
  showLanding = false;
  sampleLessonPreview = null;
}

function goHome() {
  sampleLessonPreview = null;
  showLanding = true;
  switchView("plansView");
  render();
}
const loadingLabels = [];

const els = {
  tabButtons: Array.from(document.querySelectorAll(".tab-btn")),
  languageSelect: document.querySelector("#languageSelect"),
  levelSelect: document.querySelector("#levelSelect"),
  pedagogyStyleSelect: document.querySelector("#pedagogyStyleSelect"),
  planLayout: document.querySelector("#plansView .plan-layout"),
  homeBtn: document.querySelector("#homeBtn"),
  uiLangOptions: Array.from(document.querySelectorAll(".ui-lang-option")),
  accountTopBtn: document.querySelector("#accountTopBtn"),
  authGate: document.querySelector("#authGate"),
  authForm: document.querySelector("#authForm"),
  authEmailInput: document.querySelector("#authEmailInput"),
  authPasswordInput: document.querySelector("#authPasswordInput"),
  authSubmitBtn: document.querySelector("#authSubmitBtn"),
  authModeSignIn: document.querySelector("#authModeSignIn"),
  authModeSignUp: document.querySelector("#authModeSignUp"),
  authStatus: document.querySelector("#authStatus"),
  authSkipBtn: document.querySelector("#authSkipBtn"),
  accountEmailInput: document.querySelector("#accountEmailInput"),
  accountPasswordInput: document.querySelector("#accountPasswordInput"),
  accountSignInBtn: document.querySelector("#accountSignInBtn"),
  accountSignUpBtn: document.querySelector("#accountSignUpBtn"),
  accountSignOutBtn: document.querySelector("#accountSignOutBtn"),
  accountStatus: document.querySelector("#accountStatus"),
  planPromptInput: document.querySelector("#planPromptInput"),
  generatePlanBtn: document.querySelector("#generatePlanBtn"),
  newPlanBtn: document.querySelector("#newPlanBtn"),
  planList: document.querySelector("#planList"),
  planKicker: document.querySelector("#planKicker"),
  planTitle: document.querySelector("#planTitle"),
  addLessonBtn: document.querySelector("#addLessonBtn"),
  generateLessonBtn: document.querySelector("#generateLessonBtn"),
  deletePlanBtn: document.querySelector("#deletePlanBtn"),
  lessonList: document.querySelector("#lessonList"),
  modeStudyBtn: document.querySelector("#modeStudyBtn"),
  modeEditBtn: document.querySelector("#modeEditBtn"),
  lessonStudyContainer: document.querySelector("#lessonStudyContainer"),
  lessonEditContainer: document.querySelector("#lessonEditContainer"),
  planTitleInput: document.querySelector("#planTitleInput"),
  planFocusInput: document.querySelector("#planFocusInput"),
  planNotesInput: document.querySelector("#planNotesInput"),
  lessonTitleInput: document.querySelector("#lessonTitleInput"),
  lessonGrammarInput: document.querySelector("#lessonGrammarInput"),
  lessonDescriptionInput: document.querySelector("#lessonDescriptionInput"),
  lessonSectionsContainer: document.querySelector("#lessonSectionsContainer"),
  addSectionBtn: document.querySelector("#addSectionBtn"),
  lessonVocabRows: document.querySelector("#lessonVocabRows"),
  addVocabRowBtn: document.querySelector("#addVocabRowBtn"),
  lessonExerciseRows: document.querySelector("#lessonExerciseRows"),
  addExerciseBtn: document.querySelector("#addExerciseBtn"),
  saveLessonBtn: document.querySelector("#saveLessonBtn"),
  startLessonPracticeBtn: document.querySelector("#startLessonPracticeBtn"),
  regenerateLessonBtn: document.querySelector("#regenerateLessonBtn"),
  deleteLessonBtn: document.querySelector("#deleteLessonBtn"),
  characterSelect: document.querySelector("#characterSelect"),
  scenarioSelect: document.querySelector("#scenarioSelect"),
  difficultySelect: document.querySelector("#difficultySelect"),
  testFocusInput: document.querySelector("#testFocusInput"),
  scenarioText: document.querySelector("#scenarioText"),
  messages: document.querySelector("#messages"),
  chatForm: document.querySelector("#chatForm"),
  messageInput: document.querySelector("#messageInput"),
  sendBtn: document.querySelector("#sendBtn"),
  chatKicker: document.querySelector("#chatKicker"),
  chatTitle: document.querySelector("#chatTitle"),
  newChatBtn: document.querySelector("#newChatBtn"),
  saveScenarioBtn: document.querySelector("#saveScenarioBtn"),
  chatTabs: document.querySelector("#chatTabs"),
  characterList: document.querySelector("#characterList"),
  newCharacterBtn: document.querySelector("#newCharacterBtn"),
  characterNameInput: document.querySelector("#characterNameInput"),
  characterRoleInput: document.querySelector("#characterRoleInput"),
  characterPersonalityInput: document.querySelector("#characterPersonalityInput"),
  characterTeachingInput: document.querySelector("#characterTeachingInput"),
  saveCharacterBtn: document.querySelector("#saveCharacterBtn"),
  deleteCharacterBtn: document.querySelector("#deleteCharacterBtn"),
  vocabSearchInput: document.querySelector("#vocabSearchInput"),
  vocabBankList: document.querySelector("#vocabBankList"),
  vocabCountLabel: document.querySelector("#vocabCountLabel"),
  vocabAddBtn: document.querySelector("#vocabAddBtn"),
  vocabAddForm: document.querySelector("#vocabAddForm"),
  vocabAddLanguage: document.querySelector("#vocabAddLanguage"),
  vocabAddTerm: document.querySelector("#vocabAddTerm"),
  vocabAddTranslation: document.querySelector("#vocabAddTranslation"),
  vocabAddIpa: document.querySelector("#vocabAddIpa"),
  vocabAddPos: document.querySelector("#vocabAddPos"),
  vocabAddExample: document.querySelector("#vocabAddExample"),
  vocabAddSaveBtn: document.querySelector("#vocabAddSaveBtn"),
  vocabAddCancelBtn: document.querySelector("#vocabAddCancelBtn"),
  plannerEndpointInput: document.querySelector("#plannerEndpointInput"),
  plannerModelInput: document.querySelector("#plannerModelInput"),
  plannerKeyInput: document.querySelector("#plannerKeyInput"),
  lessonEndpointInput: document.querySelector("#lessonEndpointInput"),
  lessonModelInput: document.querySelector("#lessonModelInput"),
  lessonKeyInput: document.querySelector("#lessonKeyInput"),
  practiceEndpointInput: document.querySelector("#practiceEndpointInput"),
  practiceModelInput: document.querySelector("#practiceModelInput"),
  practiceKeyInput: document.querySelector("#practiceKeyInput"),
  chatEndpointInput: document.querySelector("#chatEndpointInput"),
  chatModelInput: document.querySelector("#chatModelInput"),
  chatKeyInput: document.querySelector("#chatKeyInput"),
  correctionEndpointInput: document.querySelector("#correctionEndpointInput"),
  correctionModelInput: document.querySelector("#correctionModelInput"),
  correctionKeyInput: document.querySelector("#correctionKeyInput"),
  testConnectionBtn: document.querySelector("#testConnectionBtn"),
  saveRoutesBtn: document.querySelector("#saveRoutesBtn"),
  saveRoutesStatus: document.querySelector("#saveRoutesStatus"),
  loadingBadge: document.querySelector("#loadingBadge"),
  loadingBadgeText: document.querySelector("#loadingBadgeText")
};

function loadState() {
  let saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) saved = legacy;
  }
  if (saved) {
    try {
      return withDefaults(JSON.parse(saved));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
  return withDefaults({});
}

function withDefaults(saved) {
  let chats = Array.isArray(saved.chats) ? saved.chats.map(normalizeChat) : [];
  if (!chats.length) {
    if ((Array.isArray(saved.messages) && saved.messages.length) || saved.currentCharacterId || saved.testFocus) {
      chats.push(normalizeChat({
        title: "Practice chat",
        language: saved.language || "Russian",
        characterId: saved.currentCharacterId || "coach-mira",
        scenarioId: saved.currentScenarioId || "academy",
        scenarioText: saved.customScenarioText || "",
        testFocus: saved.testFocus || "",
        difficulty: saved.difficulty || "B1 independent",
        messages: Array.isArray(saved.messages) ? saved.messages : []
      }));
    } else {
      chats.push(normalizeChat({
        title: "New chat",
        language: saved.language || "Russian"
      }));
    }
  }
  return {
    language: saved.language || "Russian",
    level: saved.level || "Upper intermediate",
    pedagogyStyle: saved.pedagogyStyle === "layman" ? "layman" : "linguistic",
    uiLanguage: I18N_LOCALES.includes(saved.uiLanguage) ? saved.uiLanguage : "en",
    currentPlanId: saved.currentPlanId || "",
    currentLessonId: saved.currentLessonId || "",
    currentLessonMode: saved.currentLessonMode || "study",
    currentCharacterId: saved.currentCharacterId || "coach-mira",
    plans: Array.isArray(saved.plans) ? saved.plans.map(normalizePlan) : [],
    characters: mergeById(defaultCharacters, saved.characters || []),
    scenarios: mergeById(defaultScenarios, saved.scenarios || []),
    savedWords: Array.isArray(saved.savedWords) ? saved.savedWords.map(normalizeSavedWord) : [],
    chats,
    currentChatId: saved.currentChatId || chats[0]?.id || "",
    routes: {
      planner: normalizeRoute(saved.routes?.planner, "gemma-4"),
      lesson: normalizeRoute(saved.routes?.lesson || saved.routes?.planner, "gemma-4"),
      practice: normalizeRoute(saved.routes?.practice || saved.routes?.planner, "gemma-4"),
      chat: normalizeRoute(saved.routes?.chat, "gemma-4"),
      correction: normalizeRoute(saved.routes?.correction, "qwen-3.6-small")
    },
    providers: saved.providers && typeof saved.providers === "object" ? { ...saved.providers } : {}
  };
}

function normalizeChat(chat = {}) {
  return {
    id: chat.id || cryptoId("chat"),
    title: chat.title || "New chat",
    language: chat.language || "Russian",
    characterId: chat.characterId || "coach-mira",
    scenarioId: chat.scenarioId || "academy",
    scenarioText: chat.scenarioText || "",
    testFocus: chat.testFocus || "",
    difficulty: chat.difficulty || "B1 independent",
    messages: Array.isArray(chat.messages) ? chat.messages : [],
    lessonId: chat.lessonId || "",
    planId: chat.planId || "",
    createdAt: chat.createdAt || Date.now(),
    updatedAt: chat.updatedAt || Date.now()
  };
}

function normalizeRoute(route = {}, model) {
  return {
    endpoint: route.endpoint || DEFAULT_ENDPOINT,
    model: route.model || model,
    apiKey: route.apiKey || ""
  };
}

function mergeById(defaults, saved) {
  const map = new Map(defaults.map((item) => [item.id, item]));
  for (const item of saved) map.set(item.id || cryptoId("item"), { ...map.get(item.id), ...item });
  return Array.from(map.values());
}

function normalizePlan(plan) {
  return {
    id: plan.id || cryptoId("plan"),
    title: plan.title || "Untitled plan",
    language: plan.language || "Russian",
    level: plan.level || "Beginner",
    focus: plan.focus || "",
    notes: plan.notes || "",
    lessons: Array.isArray(plan.lessons) ? plan.lessons.map(normalizeLesson) : []
  };
}

function normalizeLesson(lesson) {
  const base = {
    id: lesson.id || cryptoId("lesson"),
    title: lesson.title || "New lesson",
    grammar: lesson.grammar || lesson.concept || "",
    description: lesson.description || "",
    sound: lesson.sound || "",
    vocabulary: lesson.vocabulary || "",
    explanation: lesson.explanation || "",
    practice: lesson.practice || "",
    intro: lesson.intro || "",
    sections: Array.isArray(lesson.sections) ? lesson.sections.map(normalizeSection) : [],
    alphabet: Array.isArray(lesson.alphabet) ? lesson.alphabet.map(normalizeAlphabetEntry) : [],
    vocab: Array.isArray(lesson.vocab) ? lesson.vocab.map(normalizeVocab) : [],
    exercises: Array.isArray(lesson.exercises) ? lesson.exercises.map(normalizeExercise) : [],
    scenario: lesson.scenario && typeof lesson.scenario === "object"
      ? { title: lesson.scenario.title || "", details: lesson.scenario.details || "" }
      : null,
    qa: Array.isArray(lesson.qa) ? lesson.qa.map(normalizeQa) : [],
    expanded: lesson.expanded !== false
  };
  return migrateLegacyLesson(base);
}

function normalizeSection(section = {}) {
  return {
    id: section.id || cryptoId("sec"),
    heading: section.heading || "Untitled section",
    body: section.body || ""
  };
}

function normalizeAlphabetEntry(entry = {}) {
  return {
    id: entry.id || cryptoId("alpha"),
    character: entry.character || "",
    ipa: entry.ipa || "",
    name: entry.name || "",
    romanization: entry.romanization || "",
    note: entry.note || "",
    group: entry.group || ""
  };
}

function normalizeVocab(entry = {}) {
  return {
    id: entry.id || cryptoId("vocab"),
    term: entry.term || "",
    translation: entry.translation || "",
    ipa: entry.ipa || "",
    pos: entry.pos || "",
    example: entry.example || "",
    notes: entry.notes || ""
  };
}

function normalizeExercise(entry = {}) {
  return {
    id: entry.id || cryptoId("ex"),
    kind: entry.kind || "open",
    prompt: entry.prompt || "",
    answer: entry.answer || "",
    hint: entry.hint || "",
    userAnswer: entry.userAnswer || "",
    feedback: entry.feedback && typeof entry.feedback === "object"
      ? { ok: !!entry.feedback.ok, text: entry.feedback.text || "" }
      : null
  };
}

function normalizeSavedWord(entry = {}) {
  return {
    id: entry.id || cryptoId("saved"),
    term: entry.term || "",
    translation: entry.translation || "",
    ipa: entry.ipa || "",
    pos: entry.pos || "",
    example: entry.example || "",
    notes: entry.notes || "",
    language: entry.language || "",
    addedAt: entry.addedAt || Date.now()
  };
}

function normalizeQa(entry = {}) {
  return {
    role: entry.role === "user" ? "user" : "tutor",
    content: entry.content || "",
    createdAt: entry.createdAt || Date.now()
  };
}

function migrateLegacyLesson(lesson) {
  if (!lesson.sections.length) {
    const parts = [];
    if (lesson.grammar && !lesson.intro?.includes(lesson.grammar)) {
      parts.push({ heading: "Grammar concept", body: lesson.grammar });
    }
    if (lesson.sound) parts.push({ heading: "Sound focus", body: lesson.sound });
    if (lesson.explanation) parts.push({ heading: "Explanation", body: lesson.explanation });
    if (parts.length) lesson.sections = parts.map(normalizeSection);
  }
  if (!lesson.vocab.length && lesson.vocabulary) {
    lesson.vocab = parseLegacyVocab(lesson.vocabulary);
  }
  if (!lesson.exercises.length && lesson.practice) {
    lesson.exercises = parseLegacyExercises(lesson.practice);
  }
  return lesson;
}

function parseLegacyVocab(text) {
  return text
    .split(/\r?\n+/)
    .map((line) => line.replace(/^[-*•\d+.\s]+/, "").trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^(.+?)\s*(?:[-—–=:]|→|->)\s*(.+)$/);
      if (match) return normalizeVocab({ term: match[1].trim(), translation: match[2].trim() });
      return normalizeVocab({ term: line });
    });
}

function parseLegacyExercises(text) {
  return text
    .split(/\r?\n+/)
    .map((line) => line.replace(/^[-*•\d+.\s)]+/, "").trim())
    .filter(Boolean)
    .map((line) => normalizeExercise({ prompt: line }));
}

function cryptoId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function saveState() {
  state.language = els.languageSelect.value;
  state.level = els.levelSelect.value;
  state.pedagogyStyle = els.pedagogyStyleSelect?.value === "layman" ? "layman" : "linguistic";
  state.currentLessonId = activeLessonId;
  state.currentLessonMode = activeLessonMode;
  state.currentCharacterId = activeCharacterId;
  state.routes.planner = readRoute("planner");
  state.routes.lesson = readRoute("lesson");
  state.routes.practice = readRoute("practice");
  state.routes.chat = readRoute("chat");
  state.routes.correction = readRoute("correction");
  syncProviderProfilesFromRoutes();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (HAS_STATE_SERVER) {
    fetch("/api/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state)
    }).catch(() => {});
  }
  if (LinguiniSync.isSignedIn()) LinguiniSync.schedulePush(state);
}

async function hydrateStateFromServer() {
  if (!HAS_STATE_SERVER) return;
  try {
    const response = await fetch("/api/state", { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    if (!data || !Object.keys(data).length) return;
    Object.assign(state, withDefaults(data));
    activeLessonId = state.currentLessonId;
    activeCharacterId = state.currentCharacterId;
    activeLessonMode = state.currentLessonMode === "edit" ? "edit" : "study";
  } catch {
    // localStorage fallback
  }
}

function applyRemoteState(row) {
  if (!row || !row.state || typeof row.state !== "object") return;
  Object.assign(state, withDefaults(row.state));
  activeLessonId = state.currentLessonId;
  activeCharacterId = state.currentCharacterId;
  activeLessonMode = state.currentLessonMode === "edit" ? "edit" : "study";
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function readRoute(kind) {
  return {
    endpoint: els[`${kind}EndpointInput`].value.trim() || DEFAULT_ENDPOINT,
    model: els[`${kind}ModelInput`].value.trim() || "gemma-4",
    apiKey: els[`${kind}KeyInput`].value.trim()
  };
}

function detectProvider(endpoint) {
  if (!endpoint) return null;
  let host;
  try { host = new URL(endpoint).host; } catch { return null; }
  for (const preset of PROVIDER_PRESETS) {
    if (!preset.endpoint) continue;
    try {
      if (new URL(preset.endpoint).host === host) return preset.id;
    } catch {}
  }
  return null;
}

function syncProviderProfilesFromRoutes() {
  if (!state.providers) state.providers = {};
  for (const kind of ["planner", "lesson", "practice", "chat", "correction"]) {
    const route = state.routes[kind];
    if (!route) continue;
    const provider = detectProvider(route.endpoint);
    if (!provider) continue;
    state.providers[provider] = {
      endpoint: route.endpoint,
      model: route.model,
      apiKey: route.apiKey
    };
  }
}

function currentPlan() {
  return state.plans.find((plan) => plan.id === state.currentPlanId) || state.plans[0] || null;
}

function currentLesson() {
  const plan = currentPlan();
  return plan?.lessons.find((lesson) => lesson.id === activeLessonId) || plan?.lessons[0] || null;
}

function currentCharacter() {
  return state.characters.find((character) => character.id === activeCharacterId) || state.characters[0];
}

function currentScenario() {
  return state.scenarios.find((scenario) => scenario.id === els.scenarioSelect.value) || state.scenarios[0];
}

function currentChat() {
  return state.chats.find((c) => c.id === state.currentChatId) || state.chats[0] || null;
}

function chatCharacter(chat) {
  if (!chat) return state.characters[0];
  return state.characters.find((c) => c.id === chat.characterId) || state.characters[0];
}

function chatScenario(chat) {
  if (!chat) return state.scenarios[0];
  return state.scenarios.find((s) => s.id === chat.scenarioId) || state.scenarios[0];
}

function createChat(options = {}) {
  const fallback = currentChat();
  const chat = normalizeChat({
    title: options.title || "New chat",
    language: options.language || fallback?.language || state.language,
    characterId: options.characterId || fallback?.characterId || state.characters[0]?.id || "coach-mira",
    scenarioId: options.scenarioId || "academy",
    scenarioText: options.scenarioText || "",
    testFocus: options.testFocus || "",
    difficulty: options.difficulty || fallback?.difficulty || "B1 independent",
    messages: [],
    lessonId: options.lessonId || "",
    planId: options.planId || ""
  });
  state.chats.unshift(chat);
  state.currentChatId = chat.id;
  return chat;
}

function deleteChat(id) {
  state.chats = state.chats.filter((c) => c.id !== id);
  if (state.currentChatId === id) {
    state.currentChatId = state.chats[0]?.id || "";
  }
  if (!state.chats.length) {
    const fresh = createChat({});
    state.currentChatId = fresh.id;
  }
}

/* -------------------- loading indicator -------------------- */

function pushLoading(label) {
  loadingLabels.push(label);
  refreshLoadingBadge();
}

function popLoading() {
  loadingLabels.pop();
  refreshLoadingBadge();
}

function refreshLoadingBadge() {
  if (!els.loadingBadge || !els.loadingBadgeText) return;
  if (!loadingLabels.length) {
    els.loadingBadge.hidden = true;
    return;
  }
  els.loadingBadgeText.textContent = loadingLabels[loadingLabels.length - 1];
  els.loadingBadge.hidden = false;
}

async function runWithLoading(buttons, busyLabel, taskLabel, fn) {
  const list = (Array.isArray(buttons) ? buttons : [buttons]).filter(Boolean);
  const originals = list.map((button) => ({
    text: button.textContent,
    disabled: button.disabled
  }));
  for (const button of list) {
    button.textContent = busyLabel;
    button.disabled = true;
    button.classList.add("is-loading");
  }
  pushLoading(taskLabel);
  try {
    return await fn();
  } finally {
    list.forEach((button, i) => {
      button.textContent = originals[i].text;
      button.disabled = originals[i].disabled;
      button.classList.remove("is-loading");
    });
    popLoading();
  }
}

/* -------------------- script policy -------------------- */

function uiLanguageName() {
  return UI_LANGUAGE_NAMES[state.uiLanguage] || "English";
}

// Display name for a target language in the current UI language. Values stored
// in state (and sent to prompts) stay the English names; only labels localize.
function languageLabel(name) {
  const key = `lang.${name}`;
  const label = t(key);
  return label === key ? name : label;
}

// Default characters/scenarios are stored data, so translate them only at
// display time and only while the stored field still matches the shipped
// English text — a user edit always wins over the dictionary.
function defaultText(kind, item, field) {
  const defaults = kind === "character" ? defaultCharacters : defaultScenarios;
  const original = defaults.find((entry) => entry.id === item.id);
  if (!original || original[field] !== item[field]) return item[field];
  const key = `${kind}.${item.id}.${field}`;
  const label = t(key);
  return label === key ? item[field] : label;
}

function characterLabel(character, field = "name") {
  return defaultText("character", character, field);
}

function scenarioLabel(scenario, field = "title") {
  return defaultText("scenario", scenario, field);
}

// Instructional/meta content (explanations, instructions, translations,
// feedback) is generated in the learner's interface language. The taught
// target language and the JSON wire format stay untouched.
function uiLanguageDirective() {
  if (!state.uiLanguage || state.uiLanguage === "en") return "";
  const name = uiLanguageName();
  return [
    `INTERFACE LANGUAGE — the learner's app language is ${name}:`,
    `  - Write ALL explanations, instructions, descriptions, section prose, exercise prompts' instructional wording, translations, glosses, and feedback in ${name}.`,
    `  - The "translation" fields translate target-language material INTO ${name}.`,
    "  - Keep the example words and sentences being taught in the target language exactly as the script policy requires.",
    "  - Keep every JSON key, schema field name, and required structural marker (e.g. CORRECT / WRONG) in English exactly as specified elsewhere in this prompt."
  ].join("\n");
}

function pedagogyPolicy(style) {
  const lang = uiLanguageName();
  if (style === "layman") {
    return [
      "PEDAGOGY — write for a learner with NO linguistics background:",
      `  - Do NOT use IPA. In any field labelled IPA, write a plain ${lang} pronunciation hint instead (e.g. \"kah-ZAH\", \"sounds like 'sh' in 'shoe'\").`,
      `  - Do NOT use Leipzig glosses or interlinear morphological breakdowns. Explain grammar in plain ${lang} next to examples (e.g. \"the -ed ending tells you this happened in the past\").`,
      `  - Avoid linguistic jargon — skip terms like morpheme, allophone, valency, ergativity, agglutinative, aspect marker, accusative, etc. Translate them into everyday phrasing (e.g. say \"the form used when a word is the object\" instead of \"accusative case\").`,
      "  - Friendly teacher voice with practical analogies, not linguist voice. The learner is here to talk, not analyze."
    ].join("\n");
  }
  return [
    "PEDAGOGY — write with linguistic rigor:",
    "  - Use IPA for sounds in vocab tables and pronunciation sections; include allophonic variation where relevant.",
    "  - Use Leipzig glosses for non-trivial morphology in example sentences.",
    "  - Standard linguistic terminology is welcome — name patterns precisely (case, aspect, mood, voicing, etc.).",
    "  - Explain not just what but why: distributional patterns, etymology, comparative notes where they sharpen understanding."
  ].join("\n");
}

function scriptPolicy(language, level) {
  if (!NON_LATIN_LANGUAGES.has(language)) return "";
  if (BEGINNER_LEVELS.has(level)) {
    return `Script policy: present ${language} in its native script with brief romanization in parentheses on first encounter of each new word. After introduction, switch to native script alone.`;
  }
  let extra = "";
  if (language === "Japanese") extra = " Use kanji together with hiragana/katakana — never use romaji.";
  else if (language === "Chinese (Mandarin)") extra = " Use simplified or traditional Chinese characters — do not use pinyin in body text or example sentences. Pinyin is allowed only inside the IPA column of vocab tables when teaching tones.";
  else if (language === "Chinese (Cantonese)") extra = " Use traditional Chinese characters as written for Cantonese — do not use Jyutping or Yale romanization in body text. Jyutping is allowed only inside the IPA column of vocab tables.";
  else if (language === "Korean") extra = " Use Hangul — no Romanized Korean.";
  else if (["Russian", "Ukrainian", "Bulgarian", "Serbian", "Kazakh"].includes(language)) extra = " Use Cyrillic only.";
  else if (language === "Burmese") extra = " Use the Burmese script — no Romanized Burmese (MLCTS).";
  else if (language === "Hebrew" || language === "Arabic" || language === "Persian" || language === "Urdu") extra = " Use the native right-to-left script only.";
  return `Script policy: present ${language} in its native script only.${extra} IPA is allowed in vocab/sound sections for pronunciation teaching, but not in body prose or example sentences.`;
}

/* -------------------- rendering -------------------- */

function render() {
  renderLanguages();
  renderRoutes();
  renderPlans();
  renderPlanEditor();
  renderChatTabs();
  renderRoleplaySetup();
  renderMessages();
  renderCharacters();
  renderVocabBank();
  renderAccountPanel();
}

function renderAccountPanel() {
  if (!els.accountStatus) return;
  const signedIn = LinguiniSync.isSignedIn();
  if (els.accountSignInBtn) els.accountSignInBtn.hidden = signedIn;
  if (els.accountSignUpBtn) els.accountSignUpBtn.hidden = signedIn;
  if (els.accountSignOutBtn) els.accountSignOutBtn.hidden = !signedIn;
  if (els.accountEmailInput) els.accountEmailInput.closest("label").hidden = signedIn;
  if (els.accountPasswordInput) els.accountPasswordInput.closest("label").hidden = signedIn;
  if (!LinguiniSync.isConfigured()) {
    els.accountStatus.textContent = t("account.notConfigured");
  } else if (signedIn) {
    els.accountStatus.textContent = t("account.signedInAs", { email: LinguiniSync.userEmail() });
  } else {
    els.accountStatus.textContent = t("account.signedOut");
  }
}

function refreshLocale() {
  setLocale(state.uiLanguage);
  applyStaticTranslations();
}

async function pullRemoteState() {
  const before = LinguiniSync.lastSyncedAt();
  const row = await LinguiniSync.pull();
  if (row && row.updated_at !== before) {
    applyRemoteState(row);
    refreshLocale();
    render();
  }
  return row;
}

function renderLanguages() {
  // Rebuilt every render: labels follow the UI language, and the UI language
  // itself is dropped from the list (unless it's the current selection).
  const excluded = UI_TARGET_EXCLUDE[state.uiLanguage] || "";
  els.languageSelect.replaceChildren();
  for (const language of LANGUAGES) {
    if (language === excluded && language !== state.language) continue;
    const option = document.createElement("option");
    option.value = language;
    option.textContent = languageLabel(language);
    els.languageSelect.append(option);
  }
  els.languageSelect.value = state.language;
  els.levelSelect.value = state.level;
  if (els.pedagogyStyleSelect) els.pedagogyStyleSelect.value = state.pedagogyStyle || "linguistic";
  for (const button of els.uiLangOptions) {
    button.classList.toggle("active", button.dataset.value === (state.uiLanguage || "en"));
  }
}

function populateRoutePresets() {
  for (const select of document.querySelectorAll(".route-preset")) {
    if (select.options.length) continue;
    for (const preset of PROVIDER_PRESETS) {
      const option = document.createElement("option");
      option.value = preset.id;
      option.textContent = preset.label;
      select.append(option);
    }
    select.value = "custom";
    select.addEventListener("change", () => {
      const preset = PROVIDER_PRESETS.find((p) => p.id === select.value);
      if (!preset) return;
      const kind = select.dataset.kind;
      if (preset.id === "custom") {
        // No-op; let the user edit fields manually
        return;
      }
      const saved = state.providers && state.providers[preset.id];
      if (saved && saved.endpoint) {
        els[`${kind}EndpointInput`].value = saved.endpoint;
        els[`${kind}ModelInput`].value = saved.model || preset.model || "";
        els[`${kind}KeyInput`].value = saved.apiKey || "";
      } else {
        if (preset.endpoint) els[`${kind}EndpointInput`].value = preset.endpoint;
        if (preset.model) els[`${kind}ModelInput`].value = preset.model;
        // First time on this provider: clear the key so a stale key from a
        // different provider doesn't sit in the field.
        els[`${kind}KeyInput`].value = "";
      }
      saveState();
      // Keep the dropdown on the picked preset so the user can see what's active.
    });
  }
}

function syncPresetDropdownForKind(kind) {
  const select = document.querySelector(`.route-preset[data-kind="${kind}"]`);
  if (!select) return;
  const endpointInput = els[`${kind}EndpointInput`];
  if (!endpointInput) return;
  const provider = detectProvider(endpointInput.value.trim());
  select.value = provider || "custom";
}

function syncAllPresetDropdowns() {
  for (const kind of ["planner", "lesson", "practice", "chat", "correction"]) {
    syncPresetDropdownForKind(kind);
  }
}

function renderRoutes() {
  for (const kind of ["planner", "lesson", "practice", "chat", "correction"]) {
    els[`${kind}EndpointInput`].value = state.routes[kind].endpoint;
    els[`${kind}ModelInput`].value = state.routes[kind].model;
    els[`${kind}KeyInput`].value = state.routes[kind].apiKey;
  }
  syncAllPresetDropdowns();
}

function renderPlans() {
  els.planList.replaceChildren();
  const groups = groupBy(state.plans, (plan) => plan.language);
  for (const [language, plans] of Object.entries(groups)) {
    const heading = document.createElement("div");
    heading.className = "muted";
    heading.textContent = languageLabel(language);
    els.planList.append(heading);
    for (const plan of plans) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "list-card";
      button.classList.toggle("active", plan.id === state.currentPlanId);
      button.innerHTML = `<strong></strong><span></span>`;
      button.querySelector("strong").textContent = plan.title;
      button.querySelector("span").textContent = t("plans.cardMeta", { level: levelLabel(plan.level), count: plan.lessons.length });
      button.addEventListener("click", () => {
        leaveLanding();
        state.currentPlanId = plan.id;
        activeLessonId = plan.lessons[0]?.id || "";
        saveState();
        render();
      });
      els.planList.append(button);
    }
  }
}

function groupBy(items, getKey) {
  return items.reduce((groups, item) => {
    const key = getKey(item);
    groups[key] = groups[key] || [];
    groups[key].push(item);
    return groups;
  }, {});
}

function renderPlanEditor() {
  let plan = showLanding ? null : currentPlan();
  let lesson = showLanding ? null : currentLesson();
  if (sampleLessonPreview) {
    plan = sampleLessonPreview;
    lesson = plan.lessons[0];
  }
  els.planKicker.textContent = plan ? `${languageLabel(plan.language)} - ${levelLabel(plan.level)}` : t("plans.kicker");
  els.planTitle.textContent = plan?.title || t("plans.selectOrCreate");
  // Landing page and sample previews hide the (empty or single-entry) lesson bar.
  els.planLayout?.classList.toggle("no-lessons", !plan || !!sampleLessonPreview);
  renderLessons(plan, lesson);
  renderLessonMode(plan, lesson);
}

function renderLessonMode(plan, lesson) {
  els.modeStudyBtn.classList.toggle("active", activeLessonMode === "study");
  els.modeEditBtn.classList.toggle("active", activeLessonMode === "edit");
  els.lessonStudyContainer.style.display = activeLessonMode === "study" ? "" : "none";
  els.lessonEditContainer.style.display = activeLessonMode === "edit" ? "" : "none";
  if (activeLessonMode === "study") renderLessonStudy(plan, lesson);
  else renderLessonEdit(plan, lesson);
}

function buildOnboarding() {
  const wrap = document.createElement("div");
  wrap.className = "onboarding";

  const steps = document.createElement("section");
  steps.className = "onboarding-card";
  const stepsTitle = document.createElement("h3");
  stepsTitle.textContent = t("onboarding.title");
  const list = document.createElement("ol");
  list.className = "onboarding-steps";
  for (const step of ["step1", "step2", "step3", "step4"]) {
    const item = document.createElement("li");
    item.textContent = t(`onboarding.${step}`);
    list.append(item);
  }
  steps.append(stepsTitle, list);

  const samples = document.createElement("section");
  samples.className = "onboarding-samples";
  const samplesTitle = document.createElement("h3");
  samplesTitle.textContent = t("onboarding.samplesTitle");
  const hint = document.createElement("p");
  hint.className = "muted";
  hint.textContent = t("onboarding.samplesHint");
  const grid = document.createElement("div");
  grid.className = "sample-grid";
  for (const sample of samplePlans()) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "sample-card";
    const kicker = document.createElement("span");
    kicker.className = "sample-kicker";
    kicker.textContent = languageLabel(sample.language);
    const title = document.createElement("span");
    title.className = "sample-title";
    title.textContent = sample.lesson.title;
    const desc = document.createElement("span");
    desc.className = "sample-desc";
    desc.textContent = sample.lesson.description;
    card.append(kicker, title, desc);
    card.addEventListener("click", () => openSampleLesson(sample));
    grid.append(card);
  }
  samples.append(samplesTitle, hint, grid);

  wrap.append(steps, samples);
  return wrap;
}

function openSampleLesson(sample) {
  // View-only: build a throwaway plan object that is never pushed into state,
  // never saved, and never synced. Normalized once so exercise feedback
  // survives re-renders within the session.
  sampleLessonPreview = normalizePlan({
    id: sample.id,
    title: t("onboarding.samplePlan", { language: languageLabel(sample.language) }),
    language: sample.language,
    level: sample.level,
    lessons: [sample.lesson]
  });
  activeLessonMode = "study";
  switchView("plansView");
  renderPlanEditor();
}

function renderLessonStudy(plan, lesson) {
  els.lessonStudyContainer.replaceChildren();
  if (!plan) {
    els.lessonStudyContainer.append(buildOnboarding());
    return;
  }
  if (!lesson) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = t("study.emptyNoLesson");
    els.lessonStudyContainer.append(empty);
    return;
  }

  const header = document.createElement("header");
  header.className = "study-header";
  const kicker = document.createElement("p");
  kicker.className = "study-kicker";
  kicker.textContent = lesson.grammar || t("lesson.fallbackTag");
  const title = document.createElement("h3");
  title.className = "study-title";
  title.textContent = lesson.title;
  header.append(kicker, title);
  els.lessonStudyContainer.append(header);

  if (!lesson.expanded) {
    renderStubLessonStudy(plan, lesson);
    return;
  }

  const summary = lesson.description || lesson.intro;
  if (summary) {
    const intro = document.createElement("p");
    intro.className = "study-intro";
    intro.textContent = summary;
    els.lessonStudyContainer.append(intro);
  }

  if (lesson.alphabet && lesson.alphabet.length) {
    els.lessonStudyContainer.append(buildAlphabetTable(lesson.alphabet));
  }

  for (const section of lesson.sections) {
    const article = document.createElement("article");
    article.className = "study-section";
    const heading = document.createElement("h4");
    heading.textContent = section.heading;
    const body = document.createElement("div");
    body.className = "study-body";
    body.append(...renderMarkupBlocks(section.body));
    article.append(heading, body);
    els.lessonStudyContainer.append(article);
  }

  if (lesson.vocab.length) {
    els.lessonStudyContainer.append(buildVocabTable(lesson.vocab, t("study.vocabulary")));
  }

  const buildingPractice = generatingPractice.has(lesson.id);
  if (lesson.exercises.length) {
    const wrap = document.createElement("section");
    wrap.className = "study-exercises";
    const heading = document.createElement("h4");
    heading.textContent = t("study.tryThese");
    wrap.append(heading);
    for (const [index, exercise] of lesson.exercises.entries()) {
      wrap.append(buildExerciseCard(plan, lesson, exercise, index));
    }
    els.lessonStudyContainer.append(wrap);
  } else if (buildingPractice) {
    els.lessonStudyContainer.append(buildPracticePlaceholder(t("study.buildingExercises")));
  }

  if (lesson.scenario && lesson.scenario.details) {
    els.lessonStudyContainer.append(buildScenarioCard(plan, lesson));
  } else if (buildingPractice && !lesson.exercises.length) {
    // single placeholder already covers both
  } else if (buildingPractice) {
    els.lessonStudyContainer.append(buildPracticePlaceholder(t("study.buildingScenario")));
  }

  els.lessonStudyContainer.append(buildLessonChatPanel(plan, lesson));
}

function buildPracticePlaceholder(label) {
  const card = document.createElement("section");
  card.className = "practice-placeholder";
  const dot = document.createElement("span");
  dot.className = "loading-dot";
  const text = document.createElement("span");
  text.textContent = label;
  card.append(dot, text);
  return card;
}

function buildScenarioCard(plan, lesson) {
  const card = document.createElement("section");
  card.className = "scenario-card";
  const kicker = document.createElement("p");
  kicker.className = "scenario-kicker";
  kicker.textContent = t("study.scenarioKicker");
  const heading = document.createElement("h4");
  heading.textContent = lesson.scenario.title || t("study.scenarioKicker");
  const details = document.createElement("p");
  details.className = "scenario-details";
  details.textContent = lesson.scenario.details;
  const action = document.createElement("button");
  action.type = "button";
  action.className = "primary-btn";
  action.textContent = t("study.startRoleplay");
  action.addEventListener("click", () => startLessonPractice());
  card.append(kicker, heading, details, action);
  return card;
}

function renderStubLessonStudy(plan, lesson) {
  if (lesson.description) {
    const wrap = document.createElement("section");
    wrap.className = "stub-description";
    const heading = document.createElement("h4");
    heading.textContent = t("study.covers");
    const body = document.createElement("p");
    body.textContent = lesson.description;
    wrap.append(heading, body);
    els.lessonStudyContainer.append(wrap);
  }
  if (lesson.vocab.length) {
    els.lessonStudyContainer.append(buildVocabTable(lesson.vocab, t("study.starterVocab")));
  }
  const stubCard = document.createElement("section");
  stubCard.className = "stub-cta";
  const text = document.createElement("p");
  text.className = "stub-text";
  text.textContent = t("study.stubText");
  const button = document.createElement("button");
  button.type = "button";
  button.className = "primary-btn stub-generate";
  button.textContent = t("study.generateFull");
  button.addEventListener("click", () => expandLesson(plan, lesson, button));
  stubCard.append(text, button);
  els.lessonStudyContainer.append(stubCard);
}

function buildAlphabetTable(entries) {
  const wrap = document.createElement("section");
  wrap.className = "study-alphabet";
  const heading = document.createElement("h4");
  heading.textContent = t("study.referenceChart");
  wrap.append(heading);

  const groups = {};
  const order = [];
  for (const entry of entries) {
    const key = entry.group || "";
    if (!(key in groups)) {
      groups[key] = [];
      order.push(key);
    }
    groups[key].push(entry);
  }
  const showRomanization = entries.some((e) => e.romanization);

  for (const groupName of order) {
    if (groupName) {
      const subheading = document.createElement("h5");
      subheading.className = "alphabet-group";
      subheading.textContent = groupName;
      wrap.append(subheading);
    }
    const table = document.createElement("table");
    table.className = "alphabet-table";
    table.innerHTML = `<thead><tr><th></th><th></th>${showRomanization ? "<th></th>" : ""}<th></th><th></th></tr></thead>`;
    const headCells = table.querySelectorAll("th");
    const headLabels = showRomanization
      ? ["table.letter", "table.ipa", "table.roman", "table.name", "table.notes"]
      : ["table.letter", "table.ipa", "table.name", "table.notes"];
    headLabels.forEach((key, i) => { headCells[i].textContent = t(key); });
    const tbody = document.createElement("tbody");
    for (const entry of groups[groupName]) {
      const row = document.createElement("tr");
      const cChar = document.createElement("td");
      cChar.className = "alphabet-char";
      cChar.textContent = entry.character;
      const cIpa = document.createElement("td");
      cIpa.textContent = entry.ipa;
      cIpa.className = "alphabet-ipa";
      row.append(cChar, cIpa);
      if (showRomanization) {
        const cRom = document.createElement("td");
        cRom.textContent = entry.romanization;
        cRom.className = "alphabet-roman";
        row.append(cRom);
      }
      const cName = document.createElement("td");
      cName.textContent = entry.name;
      const cNote = document.createElement("td");
      cNote.textContent = entry.note;
      cNote.className = "alphabet-note";
      row.append(cName, cNote);
      tbody.append(row);
    }
    table.append(tbody);
    wrap.append(table);
  }
  return wrap;
}

function buildVocabTable(vocab, headingText) {
  const wrap = document.createElement("section");
  wrap.className = "study-vocab";
  const heading = document.createElement("h4");
  heading.textContent = headingText;
  const table = document.createElement("table");
  table.className = "vocab-table";
  table.innerHTML = `<thead><tr><th></th><th></th><th></th><th></th></tr></thead>`;
  ["table.word", "table.ipa", "table.translation", "table.example"]
    .forEach((key, i) => { table.querySelectorAll("th")[i].textContent = t(key); });
  const tbody = document.createElement("tbody");
  for (const word of vocab) {
    const row = document.createElement("tr");
    row.innerHTML = `<td></td><td></td><td></td><td></td>`;
    const [c1, c2, c3, c4] = row.children;
    c1.innerHTML = `<strong></strong>${word.pos ? `<em></em>` : ""}`;
    c1.querySelector("strong").textContent = word.term;
    if (word.pos) c1.querySelector("em").textContent = word.pos;
    c2.textContent = word.ipa;
    c3.textContent = word.translation;
    c4.textContent = word.example;
    tbody.append(row);
  }
  table.append(tbody);
  wrap.append(heading, table);
  return wrap;
}

function renderMarkupBlocks(text) {
  if (!text) return [];
  const blocks = text.trim().split(/\n{2,}/);
  return blocks.map((block) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = block.replace(/\n+/g, " ");
    return paragraph;
  });
}

function buildExerciseCard(plan, lesson, exercise, index) {
  const card = document.createElement("article");
  card.className = "exercise-card";
  const prompt = document.createElement("div");
  prompt.className = "exercise-prompt";
  const num = document.createElement("span");
  num.className = "exercise-num";
  num.textContent = `${index + 1}.`;
  const text = document.createElement("span");
  text.textContent = exercise.prompt;
  prompt.append(num, text);
  card.append(prompt);

  if (exercise.hint && !BEGINNER_LEVELS.has(plan.level)) {
    const hint = document.createElement("p");
    hint.className = "exercise-hint";
    hint.textContent = exercise.hint;
    card.append(hint);
  }

  const form = document.createElement("form");
  form.className = "exercise-form";
  const input = document.createElement("textarea");
  input.rows = 2;
  input.placeholder = t("ex.answerPh");
  input.value = exercise.userAnswer || "";
  input.addEventListener("input", () => {
    exercise.userAnswer = input.value;
  });
  const actions = document.createElement("div");
  actions.className = "exercise-actions";
  const checkBtn = document.createElement("button");
  checkBtn.type = "submit";
  checkBtn.className = "primary-btn small";
  checkBtn.textContent = t("ex.check");
  actions.append(checkBtn);

  if (exercise.answer) {
    const reveal = document.createElement("button");
    reveal.type = "button";
    reveal.className = "secondary-btn small";
    reveal.textContent = t("ex.showAnswer");
    const answer = document.createElement("p");
    answer.className = "exercise-answer";
    answer.textContent = exercise.answer;
    answer.style.display = "none";
    reveal.addEventListener("click", () => {
      const showing = answer.style.display !== "none";
      answer.style.display = showing ? "none" : "";
      reveal.textContent = showing ? t("ex.showAnswer") : t("ex.hideAnswer");
    });
    actions.append(reveal);
    form.append(input, actions, answer);
  } else {
    form.append(input, actions);
  }

  if (exercise.feedback) {
    const feedback = document.createElement("div");
    feedback.className = `exercise-feedback ${exercise.feedback.ok ? "ok" : "off"}`;
    const label = document.createElement("strong");
    label.textContent = exercise.feedback.ok ? t("ex.nice") : t("ex.notQuite");
    const body = document.createElement("span");
    body.textContent = exercise.feedback.text ? ` ${exercise.feedback.text}` : "";
    feedback.append(label, body);
    form.append(feedback);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) {
      input.focus();
      return;
    }
    exercise.userAnswer = value;
    checkExerciseAnswer(plan, lesson, exercise, checkBtn);
  });

  card.append(form);
  return card;
}

function buildLessonChatPanel(plan, lesson) {
  const panel = document.createElement("section");
  panel.className = "lesson-chat";
  const heading = document.createElement("h4");
  heading.textContent = t("tutor.title");
  panel.append(heading);

  const list = document.createElement("div");
  list.className = "lesson-chat-list";
  if (!lesson.qa.length) {
    const empty = document.createElement("p");
    empty.className = "muted lesson-chat-empty";
    empty.textContent = t("tutor.empty");
    list.append(empty);
  } else {
    for (const message of lesson.qa) {
      const row = document.createElement("div");
      row.className = `lesson-chat-msg ${message.role}`;
      const label = document.createElement("span");
      label.className = "lesson-chat-label";
      label.textContent = message.role === "user" ? t("tutor.you") : t("tutor.label");
      const body = document.createElement("div");
      body.className = "lesson-chat-body";
      body.textContent = message.content;
      row.append(label, body);
      list.append(row);
    }
  }
  panel.append(list);

  const form = document.createElement("form");
  form.className = "lesson-chat-form";
  const input = document.createElement("textarea");
  input.rows = 1;
  input.placeholder = t("tutor.placeholder");
  input.required = true;
  const send = document.createElement("button");
  send.type = "submit";
  send.className = "primary-btn small";
  send.textContent = t("tutor.ask");
  form.append(input, send);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question) return;
    input.value = "";
    askLessonQuestion(plan, lesson, question, send);
  });
  panel.append(form);

  requestAnimationFrame(() => { list.scrollTop = list.scrollHeight; });
  return panel;
}

async function askLessonQuestion(plan, lesson, question, sendBtn) {
  lesson.qa.push(normalizeQa({ role: "user", content: question, createdAt: Date.now() }));
  saveState();
  renderLessonStudy(plan, lesson);
  const newSendBtn = els.lessonStudyContainer.querySelector(".lesson-chat-form button");
  await runWithLoading(newSendBtn || sendBtn, t("tutor.asking"), t("tutor.answering"), async () => {
    try {
      const reply = await askRoute("chat", buildLessonChatMessages(plan, lesson), 0.5);
      lesson.qa.push(normalizeQa({ role: "tutor", content: reply, createdAt: Date.now() }));
    } catch (error) {
      lesson.qa.push(normalizeQa({ role: "tutor", content: t("tutor.error", { message: error.message }), createdAt: Date.now() }));
    } finally {
      saveState();
      renderLessonStudy(plan, lesson);
    }
  });
}

function buildLessonChatMessages(plan, lesson) {
  const lessonText = describeLessonForPrompt(lesson);
  const policy = scriptPolicy(plan.language, plan.level);
  const system = [
    `You are a friendly, precise tutor for a ${plan.language} learner at ${plan.level} level.`,
    `The learner is studying this lesson:`,
    lessonText,
    `Answer questions about THIS lesson clearly. Use ${uiLanguageName()} for explanations unless the learner writes in ${plan.language}.`,
    `Give short, concrete examples in ${plan.language} with translations.`,
    `Keep responses tight: one good explanation beats three. Do not invent extra exercises unless asked.`,
    policy,
    pedagogyPolicy(state.pedagogyStyle)
  ].filter(Boolean).join("\n");
  const history = lesson.qa.slice(-10).map((message) => ({
    role: message.role === "user" ? "user" : "assistant",
    content: message.content
  }));
  return [{ role: "system", content: system }, ...history];
}

function describeLessonForPrompt(lesson) {
  const parts = [`Title: ${lesson.title}`];
  if (lesson.grammar) parts.push(`Grammar concept: ${lesson.grammar}`);
  if (lesson.intro) parts.push(`Intro: ${lesson.intro}`);
  for (const section of lesson.sections) {
    parts.push(`Section "${section.heading}": ${section.body}`);
  }
  if (lesson.vocab.length) {
    parts.push("Vocabulary: " + lesson.vocab.map((w) => `${w.term}=${w.translation}`).join("; "));
  }
  return parts.join("\n");
}

function renderLessonEdit(plan, lesson) {
  if (!plan || !lesson) {
    setPlanFields(plan, null);
    if (els.lessonSectionsContainer) els.lessonSectionsContainer.replaceChildren();
    if (els.lessonVocabRows) els.lessonVocabRows.replaceChildren();
    if (els.lessonExerciseRows) els.lessonExerciseRows.replaceChildren();
    return;
  }
  setPlanFields(plan, lesson);
  renderSectionRows(lesson);
  renderVocabEditRows(lesson);
  renderExerciseRows(lesson);
}

function setPlanFields(plan, lesson) {
  els.planTitleInput.value = plan?.title || "";
  els.planFocusInput.value = plan?.focus || "";
  els.planNotesInput.value = plan?.notes || "";
  els.lessonTitleInput.value = lesson?.title || "";
  els.lessonGrammarInput.value = lesson?.grammar || "";
  if (els.lessonDescriptionInput) els.lessonDescriptionInput.value = lesson?.description || "";
}

function renderSectionRows(lesson) {
  els.lessonSectionsContainer.replaceChildren();
  if (!lesson.sections.length) {
    const empty = document.createElement("p");
    empty.className = "muted small-note";
    empty.textContent = t("edit.noSections");
    els.lessonSectionsContainer.append(empty);
    return;
  }
  for (const section of lesson.sections) {
    const card = document.createElement("div");
    card.className = "edit-row section-edit";
    const heading = document.createElement("input");
    heading.type = "text";
    heading.placeholder = t("edit.sectionHeadingPh");
    heading.value = section.heading;
    heading.addEventListener("input", () => { section.heading = heading.value; });
    const body = document.createElement("textarea");
    body.rows = 4;
    body.placeholder = t("edit.sectionBodyPh");
    body.value = section.body;
    body.addEventListener("input", () => { section.body = body.value; });
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "icon-btn small danger-flat";
    remove.textContent = "×";
    remove.title = t("edit.removeSection");
    remove.addEventListener("click", () => {
      lesson.sections = lesson.sections.filter((s) => s.id !== section.id);
      saveState();
      renderSectionRows(lesson);
    });
    card.append(heading, body, remove);
    els.lessonSectionsContainer.append(card);
  }
}

function renderVocabEditRows(lesson) {
  els.lessonVocabRows.replaceChildren();
  if (!lesson.vocab.length) {
    const empty = document.createElement("p");
    empty.className = "muted small-note";
    empty.textContent = t("edit.noVocab");
    els.lessonVocabRows.append(empty);
    return;
  }
  for (const entry of lesson.vocab) {
    const row = document.createElement("div");
    row.className = "edit-row vocab-edit";
    const fields = [
      { key: "term", placeholder: t("edit.wordPh"), flex: 1 },
      { key: "translation", placeholder: t("edit.translationPh"), flex: 1 },
      { key: "ipa", placeholder: t("edit.ipaPh"), flex: 0.7 },
      { key: "pos", placeholder: t("edit.posPh"), flex: 0.8 },
      { key: "example", placeholder: t("edit.examplePh"), flex: 2 }
    ];
    for (const field of fields) {
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = field.placeholder;
      input.value = entry[field.key];
      input.style.flex = String(field.flex);
      input.addEventListener("input", () => { entry[field.key] = input.value; });
      row.append(input);
    }
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "icon-btn small danger-flat";
    remove.textContent = "×";
    remove.title = t("edit.removeWord");
    remove.addEventListener("click", () => {
      lesson.vocab = lesson.vocab.filter((v) => v.id !== entry.id);
      saveState();
      renderVocabEditRows(lesson);
    });
    row.append(remove);
    els.lessonVocabRows.append(row);
  }
}

function renderExerciseRows(lesson) {
  els.lessonExerciseRows.replaceChildren();
  if (!lesson.exercises.length) {
    const empty = document.createElement("p");
    empty.className = "muted small-note";
    empty.textContent = t("edit.noExercises");
    els.lessonExerciseRows.append(empty);
    return;
  }
  for (const exercise of lesson.exercises) {
    const card = document.createElement("div");
    card.className = "edit-row exercise-edit";
    const prompt = document.createElement("textarea");
    prompt.rows = 2;
    prompt.placeholder = t("edit.exercisePromptPh");
    prompt.value = exercise.prompt;
    prompt.addEventListener("input", () => { exercise.prompt = prompt.value; });
    const answer = document.createElement("textarea");
    answer.rows = 2;
    answer.placeholder = t("edit.exerciseAnswerPh");
    answer.value = exercise.answer;
    answer.addEventListener("input", () => { exercise.answer = answer.value; });
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "icon-btn small danger-flat";
    remove.textContent = "×";
    remove.title = t("edit.removeExercise");
    remove.addEventListener("click", () => {
      lesson.exercises = lesson.exercises.filter((e) => e.id !== exercise.id);
      saveState();
      renderExerciseRows(lesson);
    });
    card.append(prompt, answer, remove);
    els.lessonExerciseRows.append(card);
  }
}

function renderLessons(plan, activeLesson) {
  els.lessonList.replaceChildren();
  if (!plan) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = t("lessons.empty");
    els.lessonList.append(empty);
    return;
  }
  for (const [index, lesson] of plan.lessons.entries()) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "list-card";
    button.classList.toggle("active", lesson.id === activeLesson?.id);
    if (!lesson.expanded) button.classList.add("stub");
    button.innerHTML = `<strong></strong><span></span>`;
    button.querySelector("strong").textContent = `${index + 1}. ${lesson.title}`;
    const tag = lesson.expanded ? (lesson.grammar || t("lesson.fallbackTag")) : t("lesson.outlineTag");
    button.querySelector("span").textContent = tag;
    button.addEventListener("click", () => {
      savePlanEdits();
      activeLessonId = lesson.id;
      saveState();
      renderPlanEditor();
    });
    els.lessonList.append(button);
  }
}

function renderRoleplaySetup() {
  const chat = currentChat();
  fillSelect(els.characterSelect, state.characters.map((c) => ({ ...c, name: characterLabel(c) })), "name", "id", chat?.characterId);
  fillSelect(els.scenarioSelect, state.scenarios.map((s) => ({ ...s, title: scenarioLabel(s) })), "title", "id", chat?.scenarioId);
  els.difficultySelect.value = chat?.difficulty || "B1 independent";
  els.testFocusInput.value = chat?.testFocus || "";
  els.scenarioText.value = chat?.scenarioText || "";
  if (!chat) {
    els.chatKicker.textContent = t("chat.kicker");
    els.chatTitle.textContent = t("chat.choose");
    return;
  }
  const character = chatCharacter(chat);
  const scenario = chatScenario(chat);
  els.chatKicker.textContent = `${languageLabel(chat.language)} - ${difficultyLabel(chat.difficulty)}`;
  const characterName = character ? characterLabel(character) : t("chat.characterFallback");
  els.chatTitle.textContent = chat.title && chat.title !== "New chat"
    ? `${characterName} - ${chat.title}`
    : `${characterName} - ${scenario ? scenarioLabel(scenario) : t("chat.scenarioFallback")}`;
}

function renderChatTabs() {
  if (!els.chatTabs) return;
  els.chatTabs.replaceChildren();

  const newBtn = document.createElement("button");
  newBtn.type = "button";
  newBtn.className = "chat-tab chat-tab-new";
  newBtn.textContent = t("chat.newTab");
  newBtn.addEventListener("click", () => {
    createChat({});
    saveState();
    renderChatTabs();
    renderRoleplaySetup();
    renderMessages();
  });
  els.chatTabs.append(newBtn);

  for (const chat of state.chats) {
    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = "chat-tab";
    if (chat.id === state.currentChatId) tab.classList.add("active");
    const label = document.createElement("span");
    label.className = "chat-tab-label";
    label.textContent = chat.title || t("chat.untitled");
    const meta = document.createElement("em");
    meta.className = "chat-tab-meta";
    meta.textContent = languageLabel(chat.language);
    const del = document.createElement("span");
    del.className = "chat-tab-del";
    del.textContent = "×";
    del.title = t("chat.deleteTitle");
    del.addEventListener("click", (event) => {
      event.stopPropagation();
      if (!confirm(t("confirm.deleteChat", { title: chat.title }))) return;
      deleteChat(chat.id);
      saveState();
      renderChatTabs();
      renderRoleplaySetup();
      renderMessages();
    });
    tab.append(label, meta, del);
    tab.addEventListener("click", () => {
      if (chat.id === state.currentChatId) return;
      state.currentChatId = chat.id;
      saveState();
      renderChatTabs();
      renderRoleplaySetup();
      renderMessages();
    });
    els.chatTabs.append(tab);
  }
}

function fillSelect(select, items, labelKey, valueKey, selectedValue) {
  select.replaceChildren();
  for (const item of items) {
    const option = document.createElement("option");
    option.value = item[valueKey];
    option.textContent = item[labelKey];
    select.append(option);
  }
  select.value = selectedValue;
}

function renderMessages() {
  els.messages.replaceChildren();
  const chat = currentChat();
  const messages = chat?.messages || [];
  if (!messages.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = t("chat.empty");
    els.messages.append(empty);
    return;
  }
  for (const message of messages) {
    const row = document.createElement("article");
    row.className = `message ${message.role}`;
    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = message.role === "user" ? t("chat.you") : message.role === "correction" ? t("chat.tip") : initials(message.name || "Lg");
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    const header = document.createElement("header");
    const name = document.createElement("strong");
    name.textContent = message.role === "user" ? t("chat.you")
      : message.role === "correction" ? t("chat.learningNote")
      : message.role === "system" ? t("chat.system")
      : message.name;
    const time = document.createElement("span");
    time.textContent = new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    header.append(name, time);
    const text = document.createElement("div");
    text.textContent = message.content;
    bubble.append(header, text);
    row.append(avatar, bubble);
    els.messages.append(row);
  }
  els.messages.scrollTop = els.messages.scrollHeight;
}

function initials(name) {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function renderCharacters() {
  els.characterList.replaceChildren();
  for (const character of state.characters) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "list-card";
    button.classList.toggle("active", character.id === activeCharacterId);
    button.innerHTML = `<strong></strong><span></span>`;
    button.querySelector("strong").textContent = characterLabel(character);
    button.querySelector("span").textContent = characterLabel(character, "role");
    button.addEventListener("click", () => {
      activeCharacterId = character.id;
      saveState();
      renderCharacters();
      renderCharacterEditor();
      renderRoleplaySetup();
    });
    els.characterList.append(button);
  }
  renderCharacterEditor();
}

function renderCharacterEditor() {
  const character = currentCharacter();
  els.characterNameInput.value = character?.name || "";
  els.characterRoleInput.value = character?.role || "";
  els.characterPersonalityInput.value = character?.personality || "";
  els.characterTeachingInput.value = character?.teaching || "";
}

function collectVocabBank() {
  const items = [];
  for (const plan of state.plans) {
    for (const lesson of plan.lessons) {
      for (const word of lesson.vocab) {
        if (!word.term) continue;
        items.push({ word, plan, lesson, source: "lesson" });
      }
    }
  }
  for (const word of state.savedWords) {
    if (!word.term) continue;
    items.push({ word, plan: null, lesson: null, source: "saved" });
  }
  return items;
}

function renderVocabBank() {
  if (!els.vocabBankList) return;
  els.vocabBankList.replaceChildren();
  const items = collectVocabBank();
  const filtered = vocabSearch
    ? items.filter(({ word }) => {
        const haystack = `${word.term} ${word.translation} ${word.ipa} ${word.pos}`.toLowerCase();
        return haystack.includes(vocabSearch.toLowerCase());
      })
    : items;

  els.vocabCountLabel.textContent = vocabSearch
    ? t("vocab.countFiltered", { shown: filtered.length, total: items.length })
    : t(state.plans.length === 1 ? "vocab.countOne" : "vocab.countMany", { count: items.length, plans: state.plans.length });

  if (!filtered.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = items.length ? t("vocab.noMatch") : t("vocab.emptyBank");
    els.vocabBankList.append(empty);
    return;
  }

  const groups = {};
  for (const item of filtered) {
    const key = (item.source === "lesson" ? item.plan.language : item.word.language) || t("vocab.other");
    (groups[key] = groups[key] || []).push(item);
  }

  for (const [language, entries] of Object.entries(groups)) {
    const block = document.createElement("section");
    block.className = "vocab-block";
    const heading = document.createElement("h3");
    heading.textContent = languageLabel(language);
    block.append(heading);

    const table = document.createElement("table");
    table.className = "vocab-table";
    table.innerHTML = `<thead><tr><th></th><th></th><th></th><th></th><th></th><th></th></tr></thead>`;
    ["table.word", "table.ipa", "table.translation", "table.example", "table.from"]
      .forEach((key, i) => { table.querySelectorAll("th")[i].textContent = t(key); });
    const tbody = document.createElement("tbody");
    for (const item of entries) {
      const { word, plan, lesson, source } = item;
      const row = document.createElement("tr");
      row.innerHTML = `<td></td><td></td><td></td><td></td><td></td><td></td>`;
      const [c1, c2, c3, c4, c5, c6] = row.children;
      c1.innerHTML = `<strong></strong>${word.pos ? `<em></em>` : ""}`;
      c1.querySelector("strong").textContent = word.term;
      if (word.pos) c1.querySelector("em").textContent = word.pos;
      c2.textContent = word.ipa;
      c3.textContent = word.translation;
      c4.textContent = word.example;
      if (source === "lesson") {
        const link = document.createElement("button");
        link.type = "button";
        link.className = "link-btn";
        link.textContent = `${plan.title} → ${lesson.title}`;
        link.addEventListener("click", () => {
          leaveLanding();
          state.currentPlanId = plan.id;
          activeLessonId = lesson.id;
          activeLessonMode = "study";
          saveState();
          switchView("plansView");
          render();
        });
        c5.append(link);
      } else {
        const tag = document.createElement("span");
        tag.className = "vocab-source-tag";
        tag.textContent = t("vocab.savedTag");
        c5.append(tag);
      }
      const del = document.createElement("button");
      del.type = "button";
      del.className = "icon-btn small danger-flat";
      del.textContent = "×";
      del.title = t("vocab.deleteWord");
      del.addEventListener("click", () => {
        if (!confirm(t("confirm.delete", { title: word.term }))) return;
        if (source === "saved") {
          state.savedWords = state.savedWords.filter((w) => w.id !== word.id);
        } else {
          lesson.vocab = lesson.vocab.filter((w) => w.id !== word.id);
        }
        saveState();
        renderVocabBank();
      });
      c6.append(del);
      tbody.append(row);
    }
    table.append(tbody);
    block.append(table);
    els.vocabBankList.append(block);
  }
}

function toggleVocabAddForm(show) {
  if (!els.vocabAddForm) return;
  const visible = !els.vocabAddForm.hidden;
  const next = typeof show === "boolean" ? show : !visible;
  els.vocabAddForm.hidden = !next;
  if (next) {
    if (els.vocabAddLanguage && !els.vocabAddLanguage.value) {
      els.vocabAddLanguage.value = state.language;
    }
    els.vocabAddTerm?.focus();
  }
}

function populateVocabAddLanguage() {
  if (!els.vocabAddLanguage) return;
  const previous = els.vocabAddLanguage.value;
  els.vocabAddLanguage.replaceChildren();
  for (const language of LANGUAGES) {
    const option = document.createElement("option");
    option.value = language;
    option.textContent = languageLabel(language);
    els.vocabAddLanguage.append(option);
  }
  els.vocabAddLanguage.value = previous || state.language;
}

function submitVocabAdd(event) {
  event?.preventDefault?.();
  const term = els.vocabAddTerm?.value.trim();
  if (!term) {
    els.vocabAddTerm?.focus();
    return;
  }
  const entry = normalizeSavedWord({
    term,
    translation: els.vocabAddTranslation?.value.trim() || "",
    ipa: els.vocabAddIpa?.value.trim() || "",
    pos: els.vocabAddPos?.value.trim() || "",
    example: els.vocabAddExample?.value.trim() || "",
    language: els.vocabAddLanguage?.value || state.language
  });
  state.savedWords.push(entry);
  saveState();
  // Reset form
  if (els.vocabAddTerm) els.vocabAddTerm.value = "";
  if (els.vocabAddTranslation) els.vocabAddTranslation.value = "";
  if (els.vocabAddIpa) els.vocabAddIpa.value = "";
  if (els.vocabAddPos) els.vocabAddPos.value = "";
  if (els.vocabAddExample) els.vocabAddExample.value = "";
  toggleVocabAddForm(false);
  renderVocabBank();
}

function savePlanEdits() {
  // Edit inputs are only populated with the current lesson's data while Edit mode
  // is rendered. In Study mode they're stale/empty — reading them would wipe fields.
  if (activeLessonMode !== "edit") return;
  const plan = currentPlan();
  if (!plan) return;
  plan.title = els.planTitleInput.value.trim() || plan.title;
  plan.focus = els.planFocusInput.value.trim();
  plan.notes = els.planNotesInput.value.trim();
  const lesson = currentLesson();
  if (lesson) {
    lesson.title = els.lessonTitleInput.value.trim() || lesson.title;
    lesson.grammar = els.lessonGrammarInput.value.trim();
    if (els.lessonDescriptionInput) lesson.description = els.lessonDescriptionInput.value.trim();
  }
  saveState();
}

/* -------------------- LLM-driven generation -------------------- */

async function generatePlan() {
  saveState();
  await runWithLoading(els.generatePlanBtn, t("busy.generatingPlan"), t("task.generatingPlan"), async () => {
    try {
      const language = els.languageSelect.value;
      const level = els.levelSelect.value;
      const prompt = els.planPromptInput.value.trim() || `Build a comprehensive ${language} plan for a ${level} learner.`;
      const content = await askRoute("planner", [
        { role: "system", content: planOutlineSystemPrompt(language, level) },
        { role: "user", content: `Language: ${language}\nLevel: ${level}\nLearner request: ${prompt}` }
      ], 0.45);
      const parsed = parseJson(content);
      const lessons = (parsed.lessons || []).map((lesson) => normalizeLesson({
        ...lesson,
        expanded: false
      }));
      const plan = normalizePlan({
        ...parsed,
        id: cryptoId("plan"),
        language,
        level,
        title: parsed.title || `${language} plan`,
        focus: parsed.focus || prompt,
        lessons
      });
      state.plans.unshift(plan);
      leaveLanding();
      state.currentPlanId = plan.id;
      activeLessonId = plan.lessons[0]?.id || "";
      activeLessonMode = "study";
      saveState();
      render();
    } catch (error) {
      alert(t("alert.planFailed", { message: error.message }));
    }
  });
}

function planOutlineSystemPrompt(language, level) {
  return [
    "Return ONLY strict JSON, no preamble or markdown fences.",
    'Schema: {"title": string, "focus": string, "notes": string, "lessons": Lesson[]}.',
    'Lesson schema (outline only): {"title": string, "grammar": string, "description": string, "vocab": VocabEntry[]}.',
    'VocabEntry schema: {"term": string, "translation": string}.',
    `Produce 20 to 30 lessons that form a coherent progression from where a ${level} learner is now to clear competence growth.`,
    "Each lesson is JUST AN OUTLINE — do NOT write full teaching content. Provide ONLY these four fields per lesson:",
    '  - "title": the lesson name (must be descriptive, e.g. "Past tense of motion verbs" not "Lesson 5")',
    '  - "grammar": the single concept (short phrase, e.g. "Perfective vs imperfective")',
    '  - "description": 2-3 sentences EXPLICITLY listing the specific subtopics, morphology, vocab categories, and use cases this lesson will cover. This is the contract for later full generation, so be concrete — name patterns, list specific forms, mention exceptions. If the title is "Advanced causative and passive forms", the description must specify WHICH causative constructions (e.g., -seru/-saseru in Japanese), which passive forms, and the contexts they appear in.',
    '  - "vocab": exactly 3 starter words with translation only',
    "Plan-level fields:",
    '  - "title": a real plan name reflecting the learner request (not "Untitled plan")',
    '  - "focus": one sentence describing the plan\'s arc',
    '  - "notes": optional brief learner-facing notes about the plan',
    "Order lessons so each builds on prior ones. No duplicates. Do not include intros, sections, exercises, or scenarios; those are generated later.",
    "Keep JSON valid. No trailing commas. No code fences.",
    scriptPolicy(language, level),
    uiLanguageDirective()
  ].filter(Boolean).join("\n");
}

const generatingPractice = new Set();

async function expandLesson(plan, lesson, button) {
  await runWithLoading(button, t("busy.writingLesson"), t("task.writingLesson", { title: lesson.title }), async () => {
    try {
      const fresh = await requestLessonContent(plan, lesson);
      applyLessonContent(plan, lesson, fresh);
    } catch (error) {
      alert(t("alert.lessonWriteFailed", { message: error.message }));
      return;
    }
  });
  if (lesson.expanded) generatePracticeForLesson(plan, lesson);
}

async function requestLessonContent(plan, lesson, refinement) {
  const neighbors = plan.lessons
    .map((l, i) => `${i + 1}. ${l.title}${l.id === lesson.id ? " ← THIS ONE" : ""}`)
    .join("\n");
  const reply = await askRoute("lesson", [
    { role: "system", content: lessonContentSystemPrompt(plan.language, plan.level) },
    { role: "user", content: [
      `Language: ${plan.language}`,
      `Level: ${plan.level}`,
      `Plan focus: ${plan.focus}`,
      `Plan notes: ${plan.notes}`,
      `Lesson title: ${lesson.title}`,
      `Lesson concept: ${lesson.grammar}`,
      lesson.description ? `Lesson description (THIS IS THE CONTRACT — cover exactly what is described here):\n${lesson.description}` : "",
      lesson.vocab.length ? `Starter vocabulary to fully include and enrich (each must appear in your vocab[] with IPA, part of speech, and example sentence):\n${lesson.vocab.map((w) => `  - ${w.term} — ${w.translation || "(needs translation)"}`).join("\n")}` : "",
      refinement ? `\nADDITIONAL INSTRUCTION FROM THE LEARNER (apply this while still respecting the description contract):\n${refinement}` : "",
      ``,
      `Full plan outline so you don't duplicate other lessons:`,
      neighbors
    ].filter(Boolean).join("\n") }
  ], 0.45);
  return parseJson(reply);
}

async function regenerateLesson() {
  const plan = currentPlan();
  const lesson = currentLesson();
  if (!plan || !lesson) return;
  if (!lesson.expanded) {
    return expandLesson(plan, lesson, els.regenerateLessonBtn);
  }
  const refinement = prompt(t("prompt.refinement"));
  if (refinement === null) return;
  const refine = refinement.trim();
  // Two-phase regen — lesson route first, then practice route once content is rendered.
  let contentOk = false;
  await runWithLoading(els.regenerateLessonBtn, t("busy.rewriting"), t("task.rewriting", { title: lesson.title }), async () => {
    try {
      const fresh = await requestLessonContent(plan, lesson, refine);
      applyLessonContent(plan, lesson, fresh);
      contentOk = true;
    } catch (error) {
      alert(t("alert.lessonRegenFailed", { message: error.message }));
    }
  });
  if (contentOk) {
    // Wipe previous practice and refresh via the practice route in the background
    lesson.exercises = [];
    lesson.scenario = null;
    saveState();
    if (currentLesson()?.id === lesson.id && activeLessonMode === "study") {
      renderLessonStudy(plan, lesson);
    }
    generatePracticeForLesson(plan, lesson);
  }
}

function applyLessonContent(plan, lesson, parsed) {
  const fresh = normalizeLesson({
    ...parsed,
    id: lesson.id,
    title: parsed.title || lesson.title,
    grammar: parsed.grammar || lesson.grammar,
    description: parsed.description || lesson.description,
    expanded: true
  });
  const byTerm = new Map();
  for (const word of lesson.vocab) {
    if (word.term) byTerm.set(word.term.toLowerCase(), word);
  }
  for (const word of fresh.vocab) {
    if (!word.term) continue;
    const existing = byTerm.get(word.term.toLowerCase());
    if (existing) {
      if (!existing.translation) existing.translation = word.translation;
      if (!existing.ipa) existing.ipa = word.ipa;
      if (!existing.pos) existing.pos = word.pos;
      if (!existing.example) existing.example = word.example;
      if (!existing.notes) existing.notes = word.notes;
    } else {
      lesson.vocab.push(word);
      byTerm.set(word.term.toLowerCase(), word);
    }
  }
  lesson.sections = fresh.sections;
  lesson.alphabet = fresh.alphabet;
  lesson.description = fresh.description;
  if (!lesson.title || lesson.title === "New lesson") lesson.title = fresh.title;
  lesson.expanded = true;
  saveState();
  render();
}

async function generatePracticeForLesson(plan, lesson) {
  if (generatingPractice.has(lesson.id)) return;
  generatingPractice.add(lesson.id);
  pushLoading(t("task.buildingPractice", { title: lesson.title }));
  if (currentLesson()?.id === lesson.id) renderLessonStudy(plan, lesson);
  try {
    const reply = await askRoute("practice", [
      { role: "system", content: lessonPracticeSystemPrompt(plan.language, plan.level) },
      { role: "user", content: [
        `Language: ${plan.language}`,
        `Level: ${plan.level}`,
        `Lesson title: ${lesson.title}`,
        `Grammar concept: ${lesson.grammar}`,
        lesson.description ? `What this lesson covers:\n${lesson.description}` : "",
        `Vocabulary the learner has just studied: ${lesson.vocab.map((w) => w.term).slice(0, 20).join(", ")}`
      ].filter(Boolean).join("\n") }
    ], 0.55);
    const parsed = parseJson(reply);
    lesson.exercises = Array.isArray(parsed.exercises) ? parsed.exercises.map(normalizeExercise) : [];
    if (parsed.scenario && typeof parsed.scenario === "object") {
      lesson.scenario = {
        title: parsed.scenario.title || "Practice scenario",
        details: parsed.scenario.details || ""
      };
    }
    saveState();
  } catch (error) {
    console.error("Practice generation failed:", error);
  } finally {
    generatingPractice.delete(lesson.id);
    popLoading();
    if (currentLesson()?.id === lesson.id) renderLessonStudy(plan, lesson);
  }
}

function lessonContentSystemPrompt(language, level) {
  return [
    "Return ONLY strict JSON for one lesson BODY. No exercises, no scenario, no preamble, no fences.",
    'Schema: {"title": string, "grammar": string, "description": string, "sections": Section[], "alphabet": AlphabetEntry[], "vocab": VocabEntry[]}.',
    'Section: {"heading": string, "body": string} where body is 2-6 paragraphs of teaching prose.',
    'AlphabetEntry: {"character": string, "ipa": string, "name": string, "romanization": string, "note": string, "group": string}.',
    'VocabEntry: {"term","translation","ipa","pos","example"}.',
    "Cover exactly what the lesson description specifies — do not invent unrelated subtopics or omit listed ones.",
    "",
    "DETECT LESSON KIND:",
    "  - If the lesson teaches an alphabet, syllabary, phoneme inventory, or full pronunciation chart, populate `alphabet` with the COMPLETE inventory.",
    "  - For grammar / vocabulary / syntax / usage lessons, leave `alphabet` as [].",
    "",
    "ALPHABET TABLE — completeness is non-negotiable:",
    "  - When alphabet[] is non-empty, it MUST contain the COMPLETE standard inventory of the language's writing system. NOT a sample. NOT 'the most important ones'. ALL of them.",
    "  - Expected counts (use these as a self-check before returning — if your list is shorter, you skipped letters):",
    "    * Latin-alphabet European languages: all 26 base letters PLUS every language-specific letter or digraph.",
    "      - Catalan: a b c ç d e f g h i j k l (l·l as a digraph entry) m n o p q r s t u v w x y z — 26 base + ç + l·l.",
    "      - Spanish: 26 base + ñ.",
    "      - German: 26 base + ä, ö, ü, ß.",
    "      - French: 26 base + ç (accented vowels covered in notes or as separate entries if focal).",
    "      - Polish: a ą b c ć d e ę f g h i j k l ł m n ń o ó p (q is rare) r s ś t u (v rare) w (x rare) y z ź ż.",
    "      - Norwegian / Danish: 26 base + æ, ø, å.",
    "      - Icelandic: a á b d ð e é f g h i í j k l m n o ó p r s t u ú v x y ý þ æ ö.",
    "      - Faroese: a á b d ð e f g h i í j k l m n o ó p r s t u ú v y ý æ ø.",
    "      - Basque, Albanian, Czech, Slovak, Hungarian, Romanian, Lithuanian, Latvian, etc.: include all base letters PLUS every diacritic letter/digraph used in modern orthography.",
    "    * Non-Latin scripts — full inventory:",
    "      - Hangul (Korean): all 14 basic consonants + all 10 basic vowels + all compound vowels + double consonants — at least 24 base entries, ideally including compound jamo.",
    "      - Hiragana / Katakana (Japanese): all 46 base kana, plus dakuten and handakuten variants if focal.",
    "      - Cyrillic (Russian): all 33 letters. (Ukrainian: 33 with different letters. Bulgarian: 30. Serbian: 30. Kazakh: 42.)",
    "      - Greek: all 24 letters.",
    "      - Arabic: all 28 letters.",
    "      - Hebrew: all 22 letters.",
    "      - Burmese: all 33 consonants + vowel signs.",
    "      - Thai: all 44 consonants + vowel signs + tone marks.",
    "      - Devanagari (Hindi, Marathi): 11 vowels + 33 consonants base.",
    "  - Mandarin / Cantonese: do NOT produce an alphabet table — the writing system uses characters, not letters. Use sections + tone tables in body prose instead, and leave alphabet[] empty.",
    "  - Per entry:",
    "    * character: the symbol itself.",
    "    * ipa: IPA with allophonic variation (e.g. \"/k/ ~ /ɡ/\").",
    "    * name: the letter's name if it has one (e.g. \"기역\", \"alif\", \"ce trencada\"). Empty if none.",
    "    * romanization: ONLY for beginner-level lessons in non-Latin scripts. Empty otherwise.",
    "    * note: short usage rule (voicing, position, exceptions). Empty if none.",
    "    * group: \"Vowels\", \"Consonants\", \"Diphthongs\", \"Tones\", etc. for visual grouping.",
    "  - PRE-FLIGHT CHECK before returning: count alphabet[] entries. If you teach a major European language and have fewer than ~25, you've skipped letters — go back and add them.",
    "  - Sections still explain rules, contrasts, and exceptions — the table is the at-a-glance reference, the sections are the teaching.",
    "",
    "EXAMPLES MUST BE INLINE — this is critical:",
    "  - AS SOON AS you introduce a rule, form, distinction, or pattern, IMMEDIATELY (within 1-2 sentences) follow it with a concrete example in the target language plus its English translation.",
    "  - Annotate the example with whatever explanation the pedagogy policy below requires (Leipzig gloss for linguistic mode, plain-English breakdown for layman mode).",
    "  - Do NOT batch examples into a single 'Worked Examples' or 'Examples in Context' section at the end. Every section that teaches a rule must contain its OWN examples inline, next to the rule.",
    "  - A rule without an example next to it is a defect — fix it before returning.",
    "",
    "Structure:",
    "  - 3-5 sections covering, in roughly this order: sound focus, the grammar concept itself (with inline examples), usage notes / register, and contrasts with related forms (each with their own inline examples).",
    "  - description: refined contract sentence(s); you may polish the wording but must cover the same scope.",
    "",
    "Vocabulary — REQUIRED on every lesson (including alphabet/phonetic lessons):",
    "  - Include EVERY starter vocabulary word in your vocab[] array, with pronunciation, part of speech, and a target-language example sentence FULLY filled in. Don't drop a starter or leave its fields blank.",
    "  - Add additional new vocab beyond the starters to reach 8-15 total entries.",
    "  - For alphabet/phonetic lessons specifically: vocab[] should still have 8-15 entries — pick high-frequency example words that USE the letters being taught, so the learner sees the script in real words.",
    "  - Every vocab entry must have all five fields populated.",
    "  - The \"ipa\" field holds pronunciation per the pedagogy policy below (real IPA in linguistic mode, plain English hints in layman mode).",
    "",
    "Section bodies should be genuine teaching prose, not bullet points.",
    "Do not include outline-only placeholders. Every field must be substantive.",
    "Keep JSON valid. No trailing commas.",
    scriptPolicy(language, level),
    pedagogyPolicy(state.pedagogyStyle),
    uiLanguageDirective()
  ].filter(Boolean).join("\n");
}

function lessonPracticeSystemPrompt(language, level) {
  const skipHints = BEGINNER_LEVELS.has(level);
  return [
    "Return ONLY strict JSON. No preamble, no fences.",
    'Schema: {"exercises": Exercise[], "scenario": {"title": string, "details": string}}.',
    'Exercise: {"kind":"translate"|"transform"|"fill"|"open", "prompt", "answer", "hint"}.',
    "Generate 4-8 self-checkable exercises (mix of translation, transformation, fill-in, and short open prompts). ALWAYS include a concrete \"answer\" so the system can check learner replies.",
    skipHints
      ? "DO NOT include hints at this level. Set every exercise's \"hint\" to an empty string. Hints would make the quiz trivial for beginners."
      : "Hints are optional — only include one when it points to a non-obvious form. Otherwise set hint to an empty string.",
    "Scenario: a mini role-play the learner will run in chat to practice this lesson.",
    "  - title: short evocative name (e.g. \"Lost at the train station\").",
    "  - details: 2-3 sentences setting the scene, the character's role, and what the learner needs to accomplish using THIS lesson's grammar concept and at least 3 of its vocabulary words.",
    "Keep JSON valid. No trailing commas.",
    scriptPolicy(language, level),
    pedagogyPolicy(state.pedagogyStyle),
    uiLanguageDirective()
  ].filter(Boolean).join("\n");
}

async function generateLesson() {
  const plan = currentPlan();
  if (!plan) return;
  savePlanEdits();
  const topic = prompt(t("prompt.newLessonTopic"));
  if (topic === null) return;
  const cleanTopic = topic.trim();
  let createdLesson = null;
  await runWithLoading(els.generateLessonBtn, t("busy.writingLesson"), t("task.writingNewLesson"), async () => {
    try {
      const existingTitles = plan.lessons.map((l, i) => `${i + 1}. ${l.title}`).join("\n");
      const userMsg = cleanTopic
        ? `Language: ${plan.language}\nLevel: ${plan.level}\nPlan focus: ${plan.focus}\nNew lesson concept: ${cleanTopic}\n\nExisting lessons in plan (avoid duplication):\n${existingTitles}`
        : `Language: ${plan.language}\nLevel: ${plan.level}\nPlan focus: ${plan.focus}\nChoose the next logical lesson that builds on what's already in the plan. Existing lessons:\n${existingTitles}`;
      const reply = await askRoute("lesson", [
        { role: "system", content: lessonContentSystemPrompt(plan.language, plan.level) },
        { role: "user", content: userMsg }
      ], 0.45);
      const lesson = normalizeLesson({ ...parseJson(reply), expanded: true });
      plan.lessons.push(lesson);
      activeLessonId = lesson.id;
      activeLessonMode = "study";
      createdLesson = lesson;
      saveState();
      render();
    } catch (error) {
      alert(t("alert.lessonGenFailed", { message: error.message }));
    }
  });
  if (createdLesson) generatePracticeForLesson(plan, createdLesson);
}

async function checkExerciseAnswer(plan, lesson, exercise, button) {
  await runWithLoading(button, t("busy.checking"), t("task.checking"), async () => {
    try {
      const reply = await askRoute("correction", [
        { role: "system", content: exerciseCheckSystemPrompt(plan.language, plan.level) },
        { role: "user", content: [
          `Exercise prompt: ${exercise.prompt}`,
          exercise.answer ? `Reference answer: ${exercise.answer}` : `No reference answer provided — judge based on the prompt.`,
          `Learner's answer: ${exercise.userAnswer}`
        ].join("\n") }
      ], 0.1);
      const trimmed = reply.trim();
      const firstLine = trimmed.split(/\r?\n/, 1)[0].trim().toUpperCase();
      if (firstLine.startsWith("CORRECT")) {
        exercise.feedback = { ok: true, text: trimmed.split(/\r?\n/).slice(1).join(" ").trim() };
      } else {
        const body = trimmed.replace(/^WRONG[:\s]*/i, "").trim();
        exercise.feedback = { ok: false, text: body || t("ex.tryAgain") };
      }
      saveState();
      renderLessonStudy(plan, lesson);
    } catch (error) {
      exercise.feedback = { ok: false, text: t("ex.checkerError", { message: error.message }) };
      saveState();
      renderLessonStudy(plan, lesson);
    }
  });
}

function exerciseCheckSystemPrompt(language, level) {
  return [
    `You are checking a ${language} learner's answer to an exercise.`,
    "Reply format — STRICT:",
    "  Line 1: exactly CORRECT or WRONG (uppercase).",
    "  Line 2 (only if WRONG): one or two short sentences explaining what's off and giving the corrected version.",
    "Be charitable: accept any answer that conveys the same meaning, even with stylistic differences. Reject only real errors.",
    "If a reference answer is provided, use it as guidance but allow synonyms and natural variation.",
    "Keep feedback friendly and concrete. No moralising. No extra commentary.",
    scriptPolicy(language, level),
    pedagogyPolicy(state.pedagogyStyle),
    uiLanguageDirective()
  ].filter(Boolean).join("\n");
}

function parseJson(content) {
  const stripped = content.trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "");
  const start = stripped.indexOf("{");
  if (start < 0) throw new Error("The model did not return JSON.");
  const body = stripped.slice(start);

  try { return JSON.parse(body); } catch {}
  try { return JSON.parse(body.replace(/,(\s*[}\]])/g, "$1")); } catch {}

  const repaired = repairTruncatedJson(body);
  if (repaired) {
    try { return JSON.parse(repaired); } catch {}
  }

  throw new Error("The model returned JSON that could not be parsed, even after attempting to recover from truncation. Try a different model or a smaller schema.");
}

// Recover from a truncated or partially-broken JSON object by walking the text,
// truncating at the last syntactically-complete value, and closing any structures
// that were still open. Tries progressively earlier truncation points until one parses.
function repairTruncatedJson(text) {
  const closePositions = [];
  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (escape) { escape = false; continue; }
    if (ch === "\\") { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === "{" || ch === "[") depth++;
    else if (ch === "}" || ch === "]") {
      depth--;
      if (depth >= 0) closePositions.push(i);
    }
  }

  for (let i = closePositions.length - 1; i >= 0; i--) {
    const pos = closePositions[i];
    let candidate = text.slice(0, pos + 1);
    const stack = [];
    let s = false;
    let e = false;
    for (let j = 0; j < candidate.length; j++) {
      const ch = candidate[j];
      if (e) { e = false; continue; }
      if (ch === "\\") { e = true; continue; }
      if (ch === '"') { s = !s; continue; }
      if (s) continue;
      if (ch === "{") stack.push("}");
      else if (ch === "[") stack.push("]");
      else if (ch === "}" || ch === "]") stack.pop();
    }
    candidate = candidate.replace(/,(\s*[}\]])/g, "$1").replace(/,\s*$/, "");
    while (stack.length) candidate += stack.pop();
    try {
      JSON.parse(candidate);
      return candidate;
    } catch {}
  }
  return null;
}

/* -------------------- role-play chat -------------------- */

function findLessonById(planId, lessonId) {
  const plan = state.plans.find((p) => p.id === planId);
  if (!plan) return null;
  return plan.lessons.find((l) => l.id === lessonId) || null;
}

async function sendMessage(event) {
  event.preventDefault();
  const content = els.messageInput.value.trim();
  if (!content) return;
  const chat = currentChat();
  if (!chat) return;
  saveState();
  const character = chatCharacter(chat);
  chat.messages.push({ role: "user", name: "You", content, createdAt: Date.now() });
  chat.updatedAt = Date.now();
  els.messageInput.value = "";
  renderMessages();
  await runWithLoading(els.sendBtn, t("chat.sending"), t("chat.replying", { name: character?.name || t("chat.characterFallback") }), async () => {
    try {
      const reply = await askRoute("chat", [
        { role: "system", content: roleplaySystemPrompt(character, chat) },
        ...chat.messages.slice(-16).filter((message) => message.role !== "correction").map(toChatMessage)
      ], 0.78);
      chat.messages.push({ role: "assistant", name: character.name, content: cleanReply(reply, character.name), createdAt: Date.now() });
      chat.updatedAt = Date.now();
      renderMessages();
      const correction = await askCorrection(content, chat);
      if (correction && !/^no correction/i.test(correction)) {
        chat.messages.push({ role: "correction", name: "Learning note", content: correction, createdAt: Date.now() });
        chat.updatedAt = Date.now();
      }
      saveState();
      renderMessages();
    } catch (error) {
      chat.messages.push({ role: "system", name: "System", content: t("chat.connectionProblem", { message: error.message }), createdAt: Date.now() });
      renderMessages();
    }
  });
}

function roleplaySystemPrompt(character, chat) {
  const lesson = chat.lessonId && chat.planId ? findLessonById(chat.planId, chat.lessonId) : null;
  return [
    `You are ${character.name}, a character chatbot for language learning.`,
    `Role/source: ${character.role}`,
    `Personality: ${character.personality}`,
    `Teaching style: ${character.teaching}`,
    `Target language: ${chat.language}. Learner level/difficulty: ${chat.difficulty}.`,
    `Scenario: ${chat.scenarioText.trim()}`,
    chat.testFocus.trim() ? `Test focus: ${chat.testFocus.trim()}` : "",
    lesson ? `Current lesson concept: ${lesson.grammar}. Vocabulary the learner should be practicing: ${lesson.vocab.map((w) => w.term).slice(0, 12).join(", ")}` : "",
    "Stay in character and keep the conversation fun. The learner should need to answer in the target language.",
    "Do not put grammar correction in the chat reply unless the learner directly asks; a separate checker handles corrections.",
    "Use natural target-language input with just enough scaffolding for the selected level.",
    scriptPolicy(chat.language, els.levelSelect.value),
    pedagogyPolicy(state.pedagogyStyle),
    state.uiLanguage !== "en"
      ? `Stay in ${chat.language} for all in-character dialogue. If you add any parenthetical guidance, translations, or meta commentary, write it in ${uiLanguageName()}.`
      : ""
  ].filter(Boolean).join("\n");
}

function toChatMessage(message) {
  return {
    role: message.role === "user" ? "user" : "assistant",
    content: `${message.name}: ${message.content}`
  };
}

async function askCorrection(userText, chat) {
  return askRoute("correction", [
    { role: "system", content: correctionSystemPrompt(chat) },
    { role: "user", content: userText }
  ], 0.2);
}

function correctionSystemPrompt(chat) {
  const language = chat?.language || els.languageSelect.value;
  const level = els.levelSelect.value;
  return [
    `You are checking a ${language} learner's latest reply.`,
    "Only correct clear, useful errors. Do not over-correct style, creativity, or harmless alternate phrasing.",
    "If there is no important error, reply exactly: No correction needed.",
    "If there is an error, write 1-3 concise bullets: corrected phrase, what was wrong, and a tiny reusable rule.",
    "Do not continue the role-play.",
    scriptPolicy(language, level),
    pedagogyPolicy(state.pedagogyStyle),
    state.uiLanguage !== "en"
      ? `Write the correction bullets in ${uiLanguageName()}, keeping corrected target-language phrases in ${language}. Still reply exactly \"No correction needed.\" in English when there is nothing to correct.`
      : ""
  ].filter(Boolean).join("\n");
}

function isAnthropicEndpoint(endpoint) {
  return /api\.anthropic\.com/.test(endpoint);
}

async function askRoute(kind, messages, temperature, maxTokens) {
  const route = readRoute(kind);
  const anthropic = isAnthropicEndpoint(route.endpoint);
  let body;
  let authStyle = "bearer";
  if (anthropic) {
    const systemParts = messages.filter((m) => m.role === "system").map((m) => m.content).filter(Boolean);
    const turns = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content
      }));
    body = {
      model: route.model,
      max_tokens: maxTokens || 8192,
      temperature: temperature ?? 1.0,
      messages: turns
    };
    if (systemParts.length) body.system = systemParts.join("\n\n");
    authStyle = "anthropic";
  } else {
    body = { model: route.model, temperature, messages };
    if (maxTokens) body.max_tokens = maxTokens;
  }
  const target = proxyEndpointFor(route.endpoint);
  const proxied = target.startsWith("/api/chat");
  const headers = { "Content-Type": "application/json" };
  if (proxied) {
    // A proxy (server.py, the Android local server, or the Cloudflare Function)
    // translates these pseudo-headers into real provider auth headers.
    headers["X-LLM-Auth-Style"] = authStyle;
    if (route.apiKey) headers["X-LLM-API-Key"] = route.apiKey;
  } else if (anthropic) {
    headers["anthropic-version"] = "2023-06-01";
    headers["anthropic-dangerous-direct-browser-access"] = "true";
    if (route.apiKey) headers["x-api-key"] = route.apiKey;
  } else if (route.apiKey) {
    headers["Authorization"] = `Bearer ${route.apiKey}`;
  }
  const response = await fetch(target, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status} ${response.statusText}: ${text.slice(0, 360)}`);
  }
  const data = await response.json();
  let content;
  if (anthropic) {
    if (Array.isArray(data.content)) {
      content = data.content
        .filter((block) => block && block.type === "text")
        .map((block) => block.text)
        .join("");
    }
  } else {
    content = data.choices?.[0]?.message?.content;
  }
  if (!content?.trim()) {
    let host = route.endpoint;
    try { host = new URL(route.endpoint).host; } catch {}
    const provider = anthropic ? "Anthropic" : "OpenAI-compatible";
    throw new Error(t("error.emptyResponse", {
      label: t(`route.${kind}`),
      provider,
      host,
      model: route.model
    }));
  }
  return content.trim();
}

function proxyEndpointFor(endpoint) {
  try {
    const url = new URL(endpoint, window.location.href);
    const isLocalModel = LOCAL_HOSTS.includes(url.hostname);
    if (HAS_STATE_SERVER) {
      // Dev server / Android WebView: the local server proxies anything
      // off-origin (local models AND remote providers).
      if (isLocalModel || url.host !== window.location.host) {
        return `/api/chat?target=${encodeURIComponent(url.toString())}`;
      }
      return endpoint;
    }
    // Hosted (Cloudflare Pages): the Function can't reach the user's own
    // 127.0.0.1, so local model endpoints go direct from the browser
    // (localhost is a trustworthy origin — enable CORS in LM Studio).
    // Remote providers go through the Function to avoid CORS trouble.
    return isLocalModel ? endpoint : `/api/chat?target=${encodeURIComponent(url.toString())}`;
  } catch {
    return endpoint;
  }
}

function cleanReply(text, name) {
  return text.replace(new RegExp(`^\\s*${escapeRegExp(name)}\\s*[:：-]\\s*`, "i"), "").trim();
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* -------------------- plan / lesson / character / scenario helpers -------------------- */

function newPlan() {
  const language = els.languageSelect.value;
  const lesson = normalizeLesson({
    title: "Sound system and first sentence",
    grammar: "Basic word order",
    intro: `A first look at ${language}: how the sounds work and how a basic sentence comes together.`,
    sections: [
      { heading: "Sound focus", body: `Map the ${language} sound inventory with IPA. Start with the highest-frequency vowels and consonants, and one contrast English speakers often miss.` },
      { heading: "Grammar concept", body: "Default word order and how to negate. Include one Leipzig-gloss example." },
      { heading: "Examples", body: "Two or three short sentences with translation and gloss." }
    ]
  });
  const plan = normalizePlan({
    id: cryptoId("plan"),
    title: `${language} custom plan`,
    language,
    level: els.levelSelect.value,
    focus: els.planPromptInput.value.trim(),
    notes: "Edit this plan freely. Add lessons whenever a new concept comes up.",
    lessons: [lesson]
  });
  state.plans.unshift(plan);
  leaveLanding();
  state.currentPlanId = plan.id;
  activeLessonId = lesson.id;
  activeLessonMode = "study";
  saveState();
  render();
}

function addLesson() {
  const plan = currentPlan();
  if (!plan) return newPlan();
  savePlanEdits();
  const lesson = normalizeLesson({ title: "New lesson", grammar: "New concept" });
  plan.lessons.push(lesson);
  activeLessonId = lesson.id;
  activeLessonMode = "edit";
  saveState();
  render();
}

function deleteCurrentPlan() {
  const plan = currentPlan();
  if (!plan || !confirm(t("confirm.delete", { title: plan.title }))) return;
  state.plans = state.plans.filter((item) => item.id !== plan.id);
  leaveLanding();
  state.currentPlanId = state.plans[0]?.id || "";
  activeLessonId = state.plans[0]?.lessons[0]?.id || "";
  saveState();
  render();
}

function deleteCurrentLesson() {
  const plan = currentPlan();
  const lesson = currentLesson();
  if (!plan || !lesson || !confirm(t("confirm.delete", { title: lesson.title }))) return;
  plan.lessons = plan.lessons.filter((item) => item.id !== lesson.id);
  activeLessonId = plan.lessons[0]?.id || "";
  saveState();
  render();
}

function startLessonPractice() {
  const plan = currentPlan();
  const lesson = currentLesson();
  if (!plan || !lesson) return;

  const scenarioText = lesson.scenario && lesson.scenario.details
    ? lesson.scenario.details
    : (() => {
        const vocabList = lesson.vocab.length ? `\n\nVocabulary to use: ${lesson.vocab.map((w) => w.term).join(", ")}` : "";
        const exerciseList = lesson.exercises.length ? `\n\nExercise prompts to weave in:\n${lesson.exercises.map((e) => `- ${e.prompt}`).join("\n")}` : "";
        return `Practice this lesson through a short role-play. Concept: ${lesson.grammar}${vocabList}${exerciseList}`;
      })();

  const title = lesson.scenario?.title
    ? `${lesson.title}: ${lesson.scenario.title}`
    : `Practice: ${lesson.title}`;

  createChat({
    title,
    language: plan.language,
    scenarioId: "custom",
    scenarioText,
    testFocus: lesson.grammar,
    difficulty: LEVEL_TO_DIFFICULTY[plan.level] || "B1 independent",
    lessonId: lesson.id,
    planId: plan.id
  });

  saveState();
  switchView("roleplayView");
  renderChatTabs();
  renderRoleplaySetup();
  renderMessages();
}

function saveCharacter() {
  const character = currentCharacter();
  if (!character) return;
  character.name = els.characterNameInput.value.trim() || character.name;
  character.role = els.characterRoleInput.value.trim();
  character.personality = els.characterPersonalityInput.value.trim();
  character.teaching = els.characterTeachingInput.value.trim();
  saveState();
  render();
}

function newCharacter() {
  const character = {
    id: cryptoId("character"),
    name: "New tutor",
    role: "Custom practice partner",
    personality: "Friendly, curious, and responsive.",
    teaching: "Keeps practice in the target language and gives gentle scaffolding."
  };
  state.characters.push(character);
  activeCharacterId = character.id;
  saveState();
  render();
}

function deleteCharacter() {
  const character = currentCharacter();
  if (!character || state.characters.length <= 1 || !confirm(t("confirm.delete", { title: character.name }))) return;
  state.characters = state.characters.filter((item) => item.id !== character.id);
  activeCharacterId = state.characters[0].id;
  saveState();
  render();
}

function saveScenario() {
  const current = currentScenario();
  const title = prompt(t("prompt.scenarioName"), current?.id === "custom" ? "" : current?.title);
  if (!title) return;
  const scenario = {
    id: current?.id === "custom" ? cryptoId("scenario") : current.id,
    title,
    details: els.scenarioText.value.trim()
  };
  const index = state.scenarios.findIndex((item) => item.id === scenario.id);
  if (index >= 0) state.scenarios[index] = scenario;
  else state.scenarios.push(scenario);
  const chat = currentChat();
  if (chat) chat.scenarioId = scenario.id;
  saveState();
  renderRoleplaySetup();
}

async function testConnection() {
  await runWithLoading(els.testConnectionBtn, t("busy.testing"), t("task.testing"), async () => {
    try {
      await askRoute("chat", [
        { role: "system", content: "Reply with exactly: connection ok" },
        { role: "user", content: "test" }
      ], 0);
      alert(t("alert.connectionOk"));
    } catch (error) {
      alert(t("alert.connectionFailed", { message: error.message }));
    }
  });
}

async function performAuth(mode, email, password) {
  if (mode === "signup") {
    const gotSession = await LinguiniSync.signUp(email, password);
    if (!gotSession) await LinguiniSync.signIn(email, password);
  } else {
    await LinguiniSync.signIn(email, password);
  }
  // First-login merge: an existing remote row wins; otherwise push local up.
  const row = await pullRemoteState();
  if (!row) LinguiniSync.push(state);
}

async function accountAuth(mode) {
  if (!LinguiniSync.isConfigured()) {
    renderAccountPanel();
    return;
  }
  const email = els.accountEmailInput?.value.trim();
  const password = els.accountPasswordInput?.value;
  if (!email || !password) {
    els.accountEmailInput?.focus();
    return;
  }
  els.accountStatus.textContent = t("account.working");
  try {
    await performAuth(mode, email, password);
    els.accountPasswordInput.value = "";
    render();
  } catch (error) {
    els.accountStatus.textContent = error.message;
  }
}

const AUTH_GATE_SEEN_KEY = "linguini-auth-gate-seen-v1";
let authMode = "signin";

function setAuthMode(mode) {
  authMode = mode;
  renderAuthGate();
}

function renderAuthGate() {
  if (!els.authGate) return;
  els.authModeSignIn.classList.toggle("active", authMode === "signin");
  els.authModeSignUp.classList.toggle("active", authMode === "signup");
  const submitKey = authMode === "signup" ? "account.signUp" : "account.signIn";
  els.authSubmitBtn.dataset.i18n = submitKey;
  els.authSubmitBtn.textContent = t(submitKey);
  els.authPasswordInput.autocomplete = authMode === "signup" ? "new-password" : "current-password";
}

function openAuthGate() {
  if (!els.authGate) return;
  els.authStatus.textContent = LinguiniSync.isConfigured() ? "" : t("account.notConfigured");
  renderAuthGate();
  els.authGate.hidden = false;
  els.authEmailInput?.focus();
}

function closeAuthGate() {
  if (!els.authGate) return;
  els.authGate.hidden = true;
  localStorage.setItem(AUTH_GATE_SEEN_KEY, "1");
}

function shouldShowAuthGate() {
  return LinguiniSync.isConfigured() && !LinguiniSync.isSignedIn() && !localStorage.getItem(AUTH_GATE_SEEN_KEY);
}

function switchView(viewId) {
  activeView = viewId;
  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === viewId));
  els.tabButtons.forEach((button) => button.classList.toggle("active", button.dataset.view === viewId));
}

function addSection() {
  const lesson = currentLesson();
  if (!lesson) return;
  lesson.sections.push(normalizeSection({ heading: "New section", body: "" }));
  saveState();
  renderSectionRows(lesson);
}

function addVocabRow() {
  const lesson = currentLesson();
  if (!lesson) return;
  lesson.vocab.push(normalizeVocab({}));
  saveState();
  renderVocabEditRows(lesson);
}

function addExercise() {
  const lesson = currentLesson();
  if (!lesson) return;
  lesson.exercises.push(normalizeExercise({ kind: "open" }));
  saveState();
  renderExerciseRows(lesson);
}

function setLessonMode(mode) {
  if (activeLessonMode === "edit" && mode === "study") savePlanEdits();
  activeLessonMode = mode;
  saveState();
  renderPlanEditor();
}

function bindEvents() {
  els.tabButtons.forEach((button) => button.addEventListener("click", () => switchView(button.dataset.view)));
  els.languageSelect.addEventListener("change", saveState);
  els.levelSelect.addEventListener("change", saveState);
  els.pedagogyStyleSelect?.addEventListener("change", saveState);
  for (const button of els.uiLangOptions) {
    button.addEventListener("click", () => {
      state.uiLanguage = I18N_LOCALES.includes(button.dataset.value) ? button.dataset.value : "en";
      button.blur(); // collapse the menu on touch/keyboard (focus-within)
      saveState();
      refreshLocale();
      render();
    });
  }
  els.homeBtn?.addEventListener("click", goHome);
  for (const el of document.querySelectorAll(".sidebar .brand-mark, .sidebar .brand h1")) {
    el.addEventListener("click", goHome);
  }
  els.accountTopBtn?.addEventListener("click", () => {
    if (LinguiniSync.isSignedIn()) switchView("settingsView");
    else openAuthGate();
  });
  els.authModeSignIn?.addEventListener("click", () => setAuthMode("signin"));
  els.authModeSignUp?.addEventListener("click", () => setAuthMode("signup"));
  els.authSkipBtn?.addEventListener("click", closeAuthGate);
  els.authForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!LinguiniSync.isConfigured()) {
      els.authStatus.textContent = t("account.notConfigured");
      return;
    }
    const email = els.authEmailInput.value.trim();
    const password = els.authPasswordInput.value;
    if (!email || !password) return;
    els.authStatus.textContent = t("account.working");
    try {
      await performAuth(authMode, email, password);
      els.authPasswordInput.value = "";
      els.authStatus.textContent = "";
      closeAuthGate();
      refreshLocale();
      render();
    } catch (error) {
      els.authStatus.textContent = error.message;
    }
  });
  els.accountSignInBtn?.addEventListener("click", () => accountAuth("signin"));
  els.accountSignUpBtn?.addEventListener("click", () => accountAuth("signup"));
  els.accountSignOutBtn?.addEventListener("click", async () => {
    await LinguiniSync.signOut();
    renderAccountPanel();
  });
  document.addEventListener("visibilitychange", () => {
    if (!LinguiniSync.isSignedIn()) return;
    if (document.visibilityState === "hidden") {
      LinguiniSync.flushPush(state);
    } else if (Date.now() - LinguiniSync.lastPullAt() > 60000) {
      pullRemoteState().catch(() => {});
    }
  });
  els.generatePlanBtn.addEventListener("click", generatePlan);
  els.newPlanBtn.addEventListener("click", newPlan);
  els.addLessonBtn.addEventListener("click", addLesson);
  els.generateLessonBtn.addEventListener("click", generateLesson);
  els.deletePlanBtn.addEventListener("click", deleteCurrentPlan);
  els.saveLessonBtn.addEventListener("click", () => {
    savePlanEdits();
    render();
  });
  els.deleteLessonBtn.addEventListener("click", deleteCurrentLesson);
  els.startLessonPracticeBtn.addEventListener("click", startLessonPractice);
  els.regenerateLessonBtn?.addEventListener("click", regenerateLesson);
  els.modeStudyBtn.addEventListener("click", () => setLessonMode("study"));
  els.modeEditBtn.addEventListener("click", () => setLessonMode("edit"));
  els.addSectionBtn.addEventListener("click", addSection);
  els.addVocabRowBtn.addEventListener("click", addVocabRow);
  els.addExerciseBtn.addEventListener("click", addExercise);
  [els.planTitleInput, els.planFocusInput, els.planNotesInput, els.lessonTitleInput, els.lessonGrammarInput, els.lessonDescriptionInput]
    .forEach((input) => input && input.addEventListener("change", savePlanEdits));
  els.characterSelect.addEventListener("change", () => {
    const chat = currentChat();
    if (chat) chat.characterId = els.characterSelect.value;
    saveState();
    renderRoleplaySetup();
  });
  els.scenarioSelect.addEventListener("change", () => {
    const chat = currentChat();
    if (chat) {
      chat.scenarioId = els.scenarioSelect.value;
      const scenario = state.scenarios.find((s) => s.id === chat.scenarioId);
      if (scenario && scenario.details) chat.scenarioText = scenarioLabel(scenario, "details");
    }
    saveState();
    renderRoleplaySetup();
  });
  els.difficultySelect.addEventListener("change", () => {
    const chat = currentChat();
    if (chat) chat.difficulty = els.difficultySelect.value;
    saveState();
    renderRoleplaySetup();
  });
  els.testFocusInput.addEventListener("change", () => {
    const chat = currentChat();
    if (chat) chat.testFocus = els.testFocusInput.value.trim();
    saveState();
  });
  els.scenarioText.addEventListener("change", () => {
    const chat = currentChat();
    if (chat) chat.scenarioText = els.scenarioText.value;
    saveState();
  });
  els.chatForm.addEventListener("submit", sendMessage);
  els.newChatBtn.addEventListener("click", () => {
    createChat({});
    saveState();
    renderChatTabs();
    renderRoleplaySetup();
    renderMessages();
  });
  els.saveScenarioBtn.addEventListener("click", saveScenario);
  els.newCharacterBtn.addEventListener("click", newCharacter);
  els.saveCharacterBtn.addEventListener("click", saveCharacter);
  els.deleteCharacterBtn.addEventListener("click", deleteCharacter);
  els.testConnectionBtn.addEventListener("click", testConnection);
  els.saveRoutesBtn?.addEventListener("click", () => {
    saveState();
    if (els.saveRoutesStatus) {
      els.saveRoutesStatus.textContent = t("models.saved");
      setTimeout(() => { if (els.saveRoutesStatus) els.saveRoutesStatus.textContent = ""; }, 1800);
    }
  });
  if (els.vocabSearchInput) {
    els.vocabSearchInput.addEventListener("input", () => {
      vocabSearch = els.vocabSearchInput.value;
      renderVocabBank();
    });
  }
  if (els.vocabAddBtn) els.vocabAddBtn.addEventListener("click", () => toggleVocabAddForm());
  if (els.vocabAddCancelBtn) els.vocabAddCancelBtn.addEventListener("click", () => toggleVocabAddForm(false));
  if (els.vocabAddForm) els.vocabAddForm.addEventListener("submit", submitVocabAdd);
  populateVocabAddLanguage();
  ["planner", "lesson", "practice", "chat", "correction"].forEach((kind) => {
    els[`${kind}EndpointInput`].addEventListener("change", () => {
      saveState();
      syncPresetDropdownForKind(kind);
    });
    els[`${kind}ModelInput`].addEventListener("change", saveState);
    els[`${kind}KeyInput`].addEventListener("change", saveState);
  });
}

(async function init() {
  bindEvents();
  populateRoutePresets();
  refreshLocale();
  await hydrateStateFromServer();
  if (LinguiniSync.isSignedIn()) {
    try {
      const row = await LinguiniSync.pull();
      if (row) applyRemoteState(row);
    } catch {
      // Offline or Supabase unreachable — localStorage state stands.
    }
  }
  // The hydrate/pull overlay may have brought a different UI language.
  refreshLocale();
  render();
  if (shouldShowAuthGate()) openAuthGate();
})();
