const STORAGE_KEY = "messenlead.messenger.workspace.v2";
const APP_LOGIN_SESSION_KEY = "messenlead.app.login.v1";
const ACTIVE_VIEW_KEY = "messenlead.active.view.v1";
const SELECTED_META_PAGE_KEY = "messenlead.selected.meta.page.v1";
const APP_LOGIN_EMAIL = "teste@facebook.com";
const APP_LOGIN_PASSWORD = "facebook";
const DASHBOARD_CACHE_KEY = "messenlead.dashboard.cache.v1";
const SIDEBAR_COLLAPSED_KEY = "messenlead.sidebar.collapsed";
const DEFAULT_FLOW_PAGE_ID = "__global__";
const CONVERSATION_READ_KEY = "messenlead.messenger.conversation.read.v1";
const DEFAULT_TAG_FOLDER_ID = "default";
const DEFAULT_TAG_FOLDER_NAME = "Tags";
const DEFAULT_CUSTOM_FIELD_FOLDER = "Campos";
const AD_TEST_CONTACT_TAG = "tester";
const PIXEL_HEARTBEAT_STALE_MS = 90000;
const META_THREAD_REFRESH_MS = 45000;
const CACHE_PROFILE_TTL_MS = 6 * 60 * 60 * 1000;
const CACHE_PAGES_TTL_MS = 24 * 60 * 60 * 1000;
const CACHE_FLOWS_TTL_MS = 10 * 60 * 1000;
const CACHE_CONVERSATIONS_TTL_MS = 15 * 60 * 1000;
const CACHE_MESSAGES_TTL_MS = 10 * 60 * 1000;

const navItems = [
  { id: "dashboard", label: "Painel", icon: "dashboard" },
  { id: "pages", label: "Conversas", icon: "inbox" },
  { id: "flows", label: "Fluxos", icon: "workflow" },
  { id: "subscribers", label: "Assinantes", icon: "users" },
  { id: "broadcasts", label: "Disparos", icon: "send" },
  { id: "json_templates", label: "JSON Template", icon: "pages" },
  { id: "origins", label: "Origens", icon: "pixel" },
  { id: "pixel", label: "Pixel", icon: "pixel" },
  { id: "media", label: "Mídia", icon: "upload" },
  { id: "image", label: "Imagem", icon: "image" },
  { id: "video", label: "Vídeo", icon: "video" },
  { id: "setup", label: "Messenger", icon: "plug" },
  { id: "settings", label: "Ajustes", icon: "settings" }
];

const nodeLabels = {
  trigger: "Gatilho",
  message: "Mensagem",
  condition: "Condição",
  delay: "Espera",
  user_input: "Aguardar resposta",
  link_click_wait: "Aguardar clique no link",
  jump: "Selecionar passo",
  randomizer: "Randomizador",
  action: "Ação",
  comment: "Comentário"
};

const canvasAddOptions = [
  { type: "message", label: "Messenger" },
  { type: "trigger", label: "Iniciar a automação" },
  { type: "action", label: "Ações" },
  { type: "condition", label: "Condição" },
  { type: "user_input", label: "Aguardar resposta" },
  { type: "link_click_wait", label: "Aguardar clique no link" },
  { type: "jump", label: "Selecionar passo existente" },
  { type: "randomizer", label: "Randomizador" },
  { type: "delay", label: "Atraso Inteligente" },
  { type: "comment", label: "Comentar" }
];

const triggerOptions = [
  {
    id: "facebook_ad",
    group: "Messenger",
    source: "Facebook Ad JSON",
    title: "O usuario interage com o template JSON do anuncio",
    description: "Dispara somente quando a Meta envia uma interacao com o template JSON de um anuncio Click-to-Messenger."
  },
  {
    id: "facebook_comment",
    group: "Messenger",
    source: "Comentários do Facebook",
    title: "O usuário deixa um comentário em sua publicação",
    description: "Depende de eventos de comentários/private replies configurados na Meta."
  },
  {
    id: "messenger_message",
    group: "Messenger",
    source: "Mensagem do Messenger",
    title: "O usuário envia uma mensagem",
    description: "Dispara por texto recebido, postback ou primeira mensagem."
  },
  {
    id: "referral_link",
    group: "Messenger",
    source: "URL de Referência do Messenger",
    title: "O usuário clica em um link de referência",
    description: "Usa o parâmetro ref de links m.me e referências do Messenger."
  },
  {
    id: "qr_code",
    group: "Messenger",
    source: "Código QR",
    title: "O usuário escaneia o código QR",
    description: "Funciona quando o QR aponta para um link m.me com parâmetro ref."
  },
  {
    id: "facebook_shop_message",
    group: "Messenger",
    source: "Mensagem da Loja Facebook",
    title: "O usuário escreve uma mensagem na sua loja do Facebook",
    description: "Dispara quando a referência da conversa indicar origem de loja."
  },
  {
    id: "get_started",
    group: "Messenger",
    source: "Botão Começar",
    title: "O usuário toca em Começar",
    description: "Dispara quando o Messenger envia o postback GET_STARTED."
  },
  {
    id: "messenger_postback",
    group: "Messenger",
    source: "Botão ou resposta rápida",
    title: "O usuário clica em um botão da conversa",
    description: "Dispara por postback de botão ou resposta rápida do Messenger."
  },
  {
    id: "messenger_optin",
    group: "Messenger",
    source: "Opt-in do Messenger",
    title: "O usuário aceita receber contato",
    description: "Dispara quando a Meta envia um evento de opt-in para a Página."
  },
  {
    id: "message_contains_keyword",
    group: "Messenger",
    source: "Palavra-chave",
    title: "A mensagem contém uma palavra-chave",
    description: "Use as palavras-chave do gatilho para iniciar o fluxo."
  }
];

const actionOptions = [
  {
    id: "add_tag",
    category: "contact",
    categoryLabel: "Dados do contato",
    title: "Adicionar Tag",
    description: "Rotule seus contatos para facilitar a organizacao e segmentacao."
  },
  {
    id: "remove_tag",
    category: "contact",
    categoryLabel: "Dados do contato",
    title: "Remover Tag",
    description: "Remova tags atribuidas quando elas nao forem mais necessarias."
  },
  {
    id: "set_user_field",
    category: "contact",
    categoryLabel: "Dados do contato",
    title: "Definir campo do usuario",
    description: "Salve uma informacao personalizada no contato."
  },
  {
    id: "clear_custom_field",
    category: "contact",
    categoryLabel: "Dados do contato",
    title: "Limpar campo personalizado",
    description: "Remova o valor de um campo salvo no contato."
  },
  {
    id: "delete_contact",
    category: "contact",
    categoryLabel: "Dados do contato",
    title: "Excluir contato",
    description: "Marque o contato como removido da automacao."
  },
  {
    id: "open_inbox",
    category: "inbox",
    categoryLabel: "Caixa de Entrada",
    title: "Abrir conversa",
    description: "Mantem o contato visivel para atendimento humano."
  }
];

const customFieldTypes = [
  { id: "text", label: "Texto" },
  { id: "number", label: "Numero" },
  { id: "date", label: "Data" },
  { id: "datetime", label: "Data e hora" },
  { id: "boolean", label: "Verdadeiro / falso" }
];

const messageContentBlockTypes = [
  { type: "text", label: "Texto", icon: "message" },
  { type: "image", label: "Imagem", icon: "image" },
  { type: "audio", label: "Audio", icon: "send" },
  { type: "video", label: "Video", icon: "play" },
  { type: "file", label: "Arquivo", icon: "pages" },
  { type: "card", label: "Cartao", icon: "image" },
  { type: "gallery", label: "Galeria", icon: "workflow" },
  { type: "data_collection", label: "Coleta de dados", icon: "users" },
  { type: "dynamic", label: "Dinamico", icon: "plug" }
];

const conditionPickerCategories = [
  { id: "recommended", label: "Recomendados" },
  { id: "general", label: "Filtros Gerais" },
  { id: "system", label: "Campos do Sistema" }
];

const conditionOptions = [
  { id: "tag", category: "recommended", label: "Tag", icon: "tag", conditionType: "tag", operator: "contains_any", placeholder: "lead-quente" },
  { id: "email", category: "recommended", label: "E-mail", icon: "text", conditionType: "field", fieldName: "email", operator: "contains_any", placeholder: "email@dominio.com" },
  { id: "message_contains", category: "general", label: "Mensagem contém", icon: "message", conditionType: "message_contains", operator: "contains_any", placeholder: "preço, orçamento" },
  { id: "custom_field", category: "general", label: "Campo personalizado", icon: "text", conditionType: "field", operator: "equals", placeholder: "valor esperado" },
  { id: "phone", category: "system", label: "Telefone", icon: "text", conditionType: "field", fieldName: "phone", operator: "contains_any", placeholder: "+5511999999999" },
  { id: "first_name", category: "system", label: "Primeiro nome", icon: "text", conditionType: "field", fieldName: "first_name", operator: "contains_any", placeholder: "Maria" },
  { id: "entry_source", category: "system", label: "Origem da entrada", icon: "text", conditionType: "entry", fieldName: "source", operator: "equals", placeholder: "ads ou organic" },
  { id: "entry_ad_id", category: "system", label: "Ad ID da entrada", icon: "text", conditionType: "entry", fieldName: "ad_id", operator: "equals", placeholder: "123456789" },
  { id: "entry_source_key", category: "system", label: "Chave curta da entrada", icon: "text", conditionType: "entry", fieldName: "source_key", operator: "equals", placeholder: "src_abc123" }
];

const CANVAS_WIDTH = 8000;
const CANVAS_HEIGHT = 6000;
const CANVAS_ORIGIN_X = 3600;
const CANVAS_ORIGIN_Y = 2600;
const NODE_WIDTH = 260;
const NODE_CENTER_Y = 70;
const NODE_CONNECT_Y = 112;
const NODE_INPUT_Y = 54;
const MESSAGE_OUTPUT_START_Y = 106;
const MESSAGE_OUTPUT_GAP_Y = 31;
const CANVAS_MIN_X = -CANVAS_ORIGIN_X + 80;
const CANVAS_MAX_X = CANVAS_WIDTH - CANVAS_ORIGIN_X - NODE_WIDTH - 80;
const CANVAS_MIN_Y = -CANVAS_ORIGIN_Y + 80;
const CANVAS_MAX_Y = CANVAS_HEIGHT - CANVAS_ORIGIN_Y - 190;
const MINIMAP_WIDTH = 160;
const MINIMAP_HEIGHT = 110;
const ZOOM_MIN = 0.45;
const ZOOM_MAX = 1.15;
const MESSENGER_REPLY_WINDOW_MS = 24 * 60 * 60 * 1000;
const FLOW_UNDO_LIMIT = 80;

const icons = {
  dashboard: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13h7V4H4v9Zm9 7h7V4h-7v16ZM4 20h7v-5H4v5Z"/></svg>`,
  pages: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21V5a2 2 0 0 1 2-2h10l4 4v14H4Z"/><path d="M14 3v5h5"/><path d="M8 13h8M8 17h6"/></svg>`,
  workflow: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6h.01M18 6h.01M6 18h.01M7 6h10M6 7v10m1 1h10m1-11v10"/><path d="M4 4h4v4H4V4Zm12 0h4v4h-4V4ZM4 16h4v4H4v-4Zm12 0h4v4h-4v-4Z"/></svg>`,
  jump: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h7a4 4 0 0 1 4 4v1"/><path d="M4 17h7a4 4 0 0 0 4-4v-1"/><path d="M15 7h5v5"/><path d="m14 13 6-6"/></svg>`,
  inbox: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M3 15h5l2 3h4l2-3h5L18 4H6L3 15Z"/></svg>`,
  users: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  send: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4 20-7Z"/><path d="M22 2 11 13"/></svg>`,
  image: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4V5Z"/><path d="m8 15 3-3 2 2 3-4 4 5"/><circle cx="8.5" cy="9.5" r="1.5"/></svg>`,
  video: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h11a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4V6Z"/><path d="m17 10 4-3v10l-4-3"/></svg>`,
  plug: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22v-5"/><path d="M9 8V2m6 6V2M6 8h12v5a6 6 0 0 1-12 0V8Z"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3.05V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.1.36.66 1 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1Z"/></svg>`,
  pixel: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/></svg>`,
  play: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7V5Z"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2m-1 5v6M9 11v6M5 6l1 15h12l1-15"/></svg>`,
  copy: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8h12v12H8V8Z"/><path d="M4 16V4h12"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"/></svg>`,
  search: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></svg>`,
  move_vertical: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18"/><path d="m8 7 4-4 4 4"/><path d="m8 17 4 4 4-4"/></svg>`,
  upload: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21V9m0 0-4 4m4-4 4 4"/><path d="M4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"/></svg>`,
  download: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>`,
  check: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m20 6-11 11-5-5"/></svg>`,
  more: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h.01M12 12h.01M19 12h.01"/></svg>`,
  refresh: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6v6h-6"/><path d="M4 18v-6h6"/><path d="M19 12a7 7 0 0 0-12-5l-3 3"/><path d="M5 12a7 7 0 0 0 12 5l3-3"/></svg>`,
  message: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"/></svg>`,
  condition: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 9 9-9 9-9-9 9-9Z"/><path d="M12 8v4l3 3"/></svg>`,
  delay: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
  user_input: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"/><path d="M8 9h8M8 13h5"/><path d="M17 21v-4h4"/></svg>`,
  link_click_wait: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.07 0l2.12-2.12a5 5 0 0 0-7.07-7.07L11 4.93"/><path d="M14 11a5 5 0 0 0-7.07 0L4.81 13.12a5 5 0 0 0 7.07 7.07L13 19.07"/><path d="M12 8v8"/></svg>`,
  action: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 3 14h8l-1 8 11-13h-8l1-7Z"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.28-1.28a2 2 0 0 1 2.11-.45c.9.33 1.84.56 2.8.69A2 2 0 0 1 22 16.92Z"/></svg>`,
  randomizer: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 3h5v5"/><path d="m4 20 17-17"/><path d="M21 16v5h-5"/><path d="m15 15 6 6"/><path d="m4 4 5 5"/></svg>`,
  trigger: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13a8 8 0 0 1 16 0"/><path d="M12 13V5m0 8 4-4m-4 4-4-4"/><path d="M5 19h14"/></svg>`,
  comment: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"/><path d="M8 9h8M8 13h5"/></svg>`
};

const loginRoot = document.querySelector("#loginRoot");
const appShell = document.querySelector(".app-shell");
const workspace = document.querySelector("#workspace");
const mainNav = document.querySelector("#mainNav");
const pageSwitcher = document.querySelector("#pageSwitcher");
const pageTitle = document.querySelector("#pageTitle");
const pageEyebrow = document.querySelector("#pageEyebrow");
const globalSearch = document.querySelector("#globalSearch");
const exportButton = document.querySelector("#exportButton");
const importButton = document.querySelector("#importButton");
const importFile = document.querySelector("#importFile");
const appLogoutButton = document.querySelector("#appLogoutButton");
const sidebarToggle = document.querySelector("#sidebarToggle");
const toast = document.querySelector("#toast");
const modalRoot = document.querySelector("#modalRoot");

let appAuthenticated = localStorage.getItem(APP_LOGIN_SESSION_KEY) === "true";
let appLoginError = "";
let state = loadState();
const persistedSelectedMetaPage = readPersistedSelectedMetaPage();
if (persistedSelectedMetaPage?.pageId) {
  state.settings.pageId = persistedSelectedMetaPage.pageId;
  if (persistedSelectedMetaPage.pageName) state.settings.pageName = persistedSelectedMetaPage.pageName;
}
let dashboardCache = loadDashboardCache();
let activeView = getInitialView();
let selectedFlowId = state.flows[0]?.id;
let selectedNodeId = state.flows[0]?.nodes[0]?.id;
let selectedContactId = state.contacts[0]?.id;
let searchQuery = "";
let simLog = [];
let modalState = null;
let conversationReadState = loadConversationReadState();
let imageToolState = {
  original: null,
  cleaned: null,
  processing: false,
  error: ""
};
let videoToolState = {
  video: null,
  audio: null,
  output: null,
  mode: "replace",
  originalVolume: 0.45,
  audioVolume: 1,
  loopAudio: true,
  processing: false,
  progress: 0,
  error: ""
};
const storedCanvasZoom = localStorage.getItem("messenlead.canvas.zoom");
let canvasZoom = Number(storedCanvasZoom) || 0.78;
let shouldAutoFitCanvas = !storedCanvasZoom;
let flowCanvasOpen = false;
let flowCanvasMode = "edit";
let showFlowList = false;
let showInspector = false;
let canvasScrollState = null;
let canvasGeometryFrame = 0;
let renderingCanvasMarkup = false;
let inspectorScrollState = null;
let triggerPickerNodeId = "";
let nextStepPickerNodeId = "";
let actionPickerNodeId = "";
let actionPickerCategory = "contact";
let actionTagPickerStepId = "";
let actionFieldPickerStepId = "";
let actionFieldPickerExpanded = false;
let actionFieldPickerQuery = "";
let contactTagPickerContactId = "";
let conditionPickerNodeId = "";
let conditionPickerCategory = "recommended";
let conditionPickerQuery = "";
let messageButtonEditorOptionId = "";
let messageBlockFocusId = "";
let messageImageUrlEditorBlockId = "";
let messageImageUrlPopoverPosition = null;
let messageCardUrlEditorBlockId = "";
let messageCardUrlPopoverPosition = null;
let messageMorePanelOpen = false;
let messageMorePanelPosition = null;
let messageBlockDragId = "";
const MESSAGE_BLOCK_DRAG_TYPE = "application/x-messenlead-message-block";
let canvasAddMenu = null;
let suppressedNodeClickId = "";
let subscriberTagFilter = "";
let flowStore = {
  pageId: "",
  loading: false,
  serverAvailable: null,
  status: "Local",
  saveTimer: null
};
let flowUndoState = {
  key: "",
  lastSnapshot: "",
  undoStack: [],
  applying: false
};
let contactStore = {
  pageId: "",
  loading: false,
  serverAvailable: null,
  status: "Local"
};
let customFieldStore = {
  pageId: "",
  loading: false,
  serverAvailable: null,
  status: "Local"
};
let flowLogState = {
  pageId: "",
  scope: "current",
  filter: "all",
  loading: false,
  logs: [],
  error: ""
};
let flowMetricState = {
  pageId: "",
  flowId: "",
  loading: false,
  metrics: null,
  error: ""
};
let flowAdTestState = {
  loading: false,
  channel: "",
  referralLocation: "message.referral",
  flowId: "",
  testVersion: "published",
  psid: "",
  tag: "",
  tagMode: "has",
  result: null,
  logs: [],
  error: ""
};
let webhookDiagState = {
  pageId: "",
  loading: false,
  data: null,
  error: ""
};
let pixelState = {
  pageId: "",
  loading: false,
  rangeDays: 7,
  summary: null,
  events: [],
  error: ""
};
let attributionState = {
  pageId: "",
  loading: false,
  events: [],
  error: ""
};
let attributionSourceState = {
  initialized: false,
  loading: false,
  query: "",
  sources: [],
  error: ""
};
let attributionSourceSearchTimer = null;
let jsonTemplateState = {
  pageId: "",
  loading: false,
  templates: [],
  error: ""
};
let mediaState = {
  pageId: "",
  loading: false,
  uploading: false,
  assets: [],
  error: ""
};
let metaState = {
  authChecked: false,
  loadingProfile: false,
  profile: null,
  profileFromCache: false,
  loadingPages: false,
  pages: null,
  pagesFromCache: false,
  pageDebug: null,
  selectedPageId: state.settings.pageId || "",
  conversations: null,
  conversationsPageId: "",
  conversationsFromCachePageId: "",
  loadingConversationsPageId: "",
  selectedConversationId: "",
  messages: null,
  pixelEvents: null,
  attributionEvents: null,
  unreadAnchorId: "",
  loadingMessages: false,
  error: oauthErrorFromHash()
};
let broadcastState = {
  pageConversations: {},
  missingTag: "NovoUsuario",
  flowId: "",
  limit: "25",
  running: false,
  result: null,
  error: ""
};

mainNav.addEventListener("click", (event) => {
  const button = event.target.closest("[data-view]");
  if (!button) return;
  activeView = button.dataset.view;
  persistActiveView(activeView);
  if (activeView === "pages") {
    metaState.selectedConversationId = "";
    metaState.messages = null;
    metaState.pixelEvents = null;
    metaState.attributionEvents = null;
    metaState.unreadAnchorId = "";
  }
  if (activeView === "flows") {
    flowCanvasOpen = false;
    flowCanvasMode = "edit";
    showInspector = false;
    triggerPickerNodeId = "";
    nextStepPickerNodeId = "";
    actionPickerNodeId = "";
  }
  history.replaceState(null, "", `#${activeView}`);
  render();
});

loginRoot?.addEventListener("submit", handleAppLoginSubmit);
appLogoutButton?.addEventListener("click", logoutApp);

window.setInterval(() => {
  if (activeView !== "pages" || document.hidden || metaState.loadingMessages) return;
  const pageId = metaState.selectedPageId || state.settings.pageId;
  const conversationId = metaState.selectedConversationId;
  if (!pageId || !conversationId) return;
  if (dashboardCacheAgeMs("messagesByConversation", conversationCacheKey(pageId, conversationId)) < META_THREAD_REFRESH_MS) return;
  loadMetaMessages(pageId, conversationId, { silent: true });
}, META_THREAD_REFRESH_MS);

pageSwitcher?.addEventListener("change", (event) => {
  if (event.target.id === "sidebarPageSelect") selectSidebarPage(event.target.value);
});

pageSwitcher?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (button?.dataset.action === "go-pages") navigate("pages");
});

workspace.addEventListener("click", handleWorkspaceClick);
workspace.addEventListener("input", handleWorkspaceInput);
workspace.addEventListener("change", handleWorkspaceChange);
workspace.addEventListener("keydown", handleWorkspaceKeydown);
workspace.addEventListener("dragstart", handleWorkspaceDragStart);
workspace.addEventListener("dragover", handleWorkspaceDragOver);
workspace.addEventListener("drop", handleWorkspaceDrop);
workspace.addEventListener("dragend", handleWorkspaceDragEnd);
modalRoot.addEventListener("click", handleModalClick);
modalRoot.addEventListener("submit", handleModalSubmit);

globalSearch.addEventListener("input", (event) => {
  searchQuery = event.target.value.trim().toLowerCase();
  render();
  if (activeView === "origins") {
    window.clearTimeout(attributionSourceSearchTimer);
    attributionSourceSearchTimer = window.setTimeout(() => loadAttributionSources({ query: searchQuery, silent: true }), 260);
  }
});

exportButton.addEventListener("click", exportWorkspace);
importButton.addEventListener("click", () => importFile.click());
importFile.addEventListener("change", importWorkspace);
initSidebarToggle();
window.addEventListener("hashchange", () => {
  activeView = getInitialView();
  persistActiveView(activeView);
  if (activeView === "flows") {
    flowCanvasOpen = false;
    flowCanvasMode = "edit";
    showInspector = false;
    triggerPickerNodeId = "";
    nextStepPickerNodeId = "";
    actionPickerNodeId = "";
  }
  render();
});
document.addEventListener("keydown", handleGlobalKeydown);

hydrateDashboardCache();
render();

function initSidebarToggle() {
  const collapsed = localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
  applySidebarState(collapsed);

  sidebarToggle?.addEventListener("click", () => {
    const nextCollapsed = !appShell?.classList.contains("sidebar-collapsed");
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(nextCollapsed));
    applySidebarState(nextCollapsed);
  });
}

function applySidebarState(collapsed) {
  if (!appShell || !sidebarToggle) return;
  appShell.classList.toggle("sidebar-collapsed", collapsed);
  sidebarToggle.setAttribute("aria-expanded", String(!collapsed));
  sidebarToggle.setAttribute("aria-label", collapsed ? "Expandir menu" : "Encolher menu");
  sidebarToggle.setAttribute("title", collapsed ? "Expandir menu" : "Encolher menu");
}

function openFormModal(config) {
  modalState = { type: "form", ...config };
  renderModal();
}

function openConfirmModal(config) {
  modalState = { type: "confirm", ...config };
  renderModal();
}

function closeModal() {
  modalState = null;
  modalRoot.innerHTML = "";
}

function renderModal() {
  if (!modalState) {
    modalRoot.innerHTML = "";
    return;
  }

  const dangerClass = modalState.danger ? " danger-button" : " primary-button";
  const submitLabel = modalState.submitLabel || (modalState.danger ? "Confirmar" : "Salvar");

  modalRoot.innerHTML = `
    <div class="modal-backdrop" data-modal-backdrop>
      <section class="app-modal ${attr(modalState.className || "")}" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <div class="modal-header">
          <div>
            <h2 id="modalTitle">${escapeHtml(modalState.title || "Acao")}</h2>
            ${modalState.description ? `<span>${escapeHtml(modalState.description)}</span>` : ""}
          </div>
          <button class="icon-button" type="button" data-modal-action="cancel" title="Fechar">&times;</button>
        </div>
        ${
          modalState.type === "confirm"
            ? `
              <div class="modal-body">
                <p>${escapeHtml(modalState.message || "")}</p>
                <div class="modal-actions">
                  <button class="secondary-button" type="button" data-modal-action="cancel">Cancelar</button>
                  <button class="${dangerClass}" type="button" data-modal-action="confirm">${escapeHtml(submitLabel)}</button>
                </div>
              </div>
            `
            : `
              <form class="app-modal-form">
                <div class="modal-body modal-fields">
                  ${modalState.intro ? `<p class="modal-intro">${escapeHtml(modalState.intro)}</p>` : ""}
                  ${(modalState.fields || []).map(renderModalField).join("")}
                  <p class="modal-error" id="modalError" hidden></p>
                </div>
                <div class="modal-actions">
                  <button class="secondary-button" type="button" data-modal-action="cancel">Cancelar</button>
                  <button class="${dangerClass}" type="submit">${escapeHtml(submitLabel)}</button>
                </div>
              </form>
            `
        }
      </section>
    </div>
  `;

  requestAnimationFrame(() => {
    const focusable = modalRoot.querySelector(".app-modal-form input, .app-modal-form textarea, [data-modal-action='confirm'], [data-modal-action='cancel']");
    focusable?.focus();
    if (focusable?.select) focusable.select();
  });
}

function renderModalField(field) {
  const value = attr(field.value || "");
  const hint = field.hint ? `<span>${escapeHtml(field.hint)}</span>` : "";

  return `
    <label class="field modal-field">
      <span>${escapeHtml(field.label)}</span>
      ${
        field.type === "textarea"
          ? `<textarea name="${attr(field.name)}" rows="${field.rows || 4}">${escapeHtml(field.value || "")}</textarea>`
          : field.type === "select"
            ? `<select name="${attr(field.name)}">${(field.options || []).map((option) => `<option value="${attr(option.value)}" ${option.value === field.value ? "selected" : ""}>${escapeHtml(option.label)}</option>`).join("")}</select>`
          : `<input name="${attr(field.name)}" type="${attr(field.type || "text")}" value="${value}" placeholder="${attr(field.placeholder || "")}" />`
      }
      ${hint}
    </label>
  `;
}

function handleModalClick(event) {
  if (!modalState) return;

  if (event.target.matches("[data-modal-backdrop]")) {
    closeModal();
    return;
  }

  const button = event.target.closest("[data-modal-action]");
  if (!button) return;

  const action = button.dataset.modalAction;
  if (action === "cancel") {
    closeModal();
    return;
  }

  if (action === "confirm" && modalState.type === "confirm") {
    const onConfirm = modalState.onConfirm;
    closeModal();
    onConfirm?.();
  }
}

async function handleModalSubmit(event) {
  if (!modalState || modalState.type !== "form") return;
  event.preventDefault();

  const form = event.target;
  const values = {};
  for (const field of modalState.fields || []) {
    values[field.name] = form.elements[field.name]?.value || "";
    if (field.required && !values[field.name].trim()) {
      setModalError(`${field.label} e obrigatorio.`);
      return;
    }
  }

  try {
    const result = await modalState.onSubmit?.(values);
    if (result === false) return;
    closeModal();
  } catch (error) {
    setModalError(error.message || "Nao foi possivel concluir.");
  }
}

function setModalError(message) {
  const error = modalRoot.querySelector("#modalError");
  if (!error) return;
  error.textContent = message;
  error.hidden = !message;
}

function seedWorkspace() {
  const now = new Date().toISOString();

  const workspace = {
    settings: {
      pageName: "",
      pageId: "",
      greeting: "Oi {{first_name}}, posso te ajudar pelo Messenger?",
      defaultReply: "Recebi sua mensagem. Um atendente vai assumir a conversa se a automação não resolver.",
      verifyToken: "messenlead-verify-token",
      operatorToken: "troque-por-um-token-forte",
      businessHours: "Segunda a sexta, 09:00-18:00",
      timezone: "America/Sao_Paulo",
      pixelSiteId: ""
    },
    flows: [
      {
        id: makeId("flow"),
        name: "Boas-vindas da Página",
        status: "active",
        trigger: "GET_STARTED",
        goal: "Receber novos assinantes do Messenger e separar intenção comercial.",
        updatedAt: now,
        nodes: [
          {
            id: makeId("node"),
            type: "trigger",
            title: "Começar conversa",
            message: "Botão Começar, postback GET_STARTED ou primeira mensagem.",
            keyword: "oi",
            triggerEvents: ["messenger_message"],
            next: "welcome_message",
            x: 70,
            y: 105
          },
          {
            id: "welcome_message",
            type: "message",
            title: "Saudação",
            message: "Oi {{first_name}}! Sou o assistente da página. Você quer uma proposta, tirar uma dúvida ou falar com uma pessoa?",
            quickReplies: [],
            next: "qualify_intent",
            x: 370,
            y: 105
          },
          {
            id: "qualify_intent",
            type: "condition",
            title: "Detectar proposta",
            message: "Se a resposta contém proposta, orçamento, preço ou plano, seguir para lead quente.",
            keyword: "proposta, orçamento, preço, plano",
            next: "hot_lead",
            x: 670,
            y: 105
          },
          {
            id: "hot_lead",
            type: "action",
            title: "Marcar lead quente",
            message: "Aplicar tag lead-quente, abrir conversa e avisar atendimento.",
            tag: "lead-quente",
            actions: [{ id: makeId("act"), type: "add_tag", tag: "lead-quente" }],
            next: "human_handoff",
            x: 970,
            y: 105
          },
          {
            id: "human_handoff",
            type: "message",
            title: "Transferência",
            message: "Perfeito. Vou chamar uma pessoa do time para continuar por aqui.",
            quickReplies: [],
            next: null,
            x: 970,
            y: 315
          }
        ]
      },
      {
        id: makeId("flow"),
        name: "Qualificação rápida",
        status: "active",
        trigger: "mensagem contém orçamento",
        goal: "Coletar necessidade e urgência antes do atendimento humano.",
        updatedAt: now,
        nodes: [
          {
            id: makeId("node"),
            type: "trigger",
            title: "Pedido de orçamento",
            message: "Qualquer mensagem com orçamento, preço ou cotação.",
            keyword: "orçamento, preço, cotação",
            triggerEvents: ["messenger_message"],
            next: "ask_need",
            x: 80,
            y: 145
          },
          {
            id: "ask_need",
            type: "message",
            title: "Perguntar necessidade",
            message: "Claro. Para eu te direcionar melhor, qual é o serviço ou produto que você procura?",
            quickReplies: [],
            next: "short_delay",
            x: 380,
            y: 145
          },
          {
            id: "short_delay",
            type: "delay",
            title: "Aguardar resposta",
            message: "Esperar até 20 minutos antes de lembrar.",
            delayMinutes: 20,
            next: "reminder",
            x: 680,
            y: 145
          },
          {
            id: "reminder",
            type: "message",
            title: "Lembrete",
            message: "Ainda estou por aqui. Quer que eu chame alguém para te ajudar?",
            quickReplies: [],
            next: null,
            x: 980,
            y: 145
          }
        ]
      },
      {
        id: makeId("flow"),
        name: "Reativação 24h",
        status: "draft",
        trigger: "tag lead-frio",
        goal: "Reengajar conversas abertas dentro da janela permitida do Messenger.",
        updatedAt: now,
        nodes: [
          {
            id: makeId("node"),
            type: "trigger",
            title: "Lead sem resposta",
            message: "Contato marcado como lead-frio dentro da janela de 24 horas.",
            keyword: "lead-frio",
            triggerEvents: ["messenger_message"],
            next: "reactivation_message",
            x: 90,
            y: 180
          },
          {
            id: "reactivation_message",
            type: "message",
            title: "Retomada",
            message: "Passando para saber se você ainda quer ajuda. Posso te enviar as opções por aqui?",
            quickReplies: [],
            next: null,
            x: 395,
            y: 180
          }
        ]
      }
    ],
    contacts: [],
    campaigns: [],
    tagLibraryByPage: {},
    customFieldsByPage: {}
  };

  workspace.flowsByPage = {
    [DEFAULT_FLOW_PAGE_ID]: workspace.flows
  };
  return workspace;
}

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return seedWorkspace();
    const parsed = JSON.parse(stored);
    if (!parsed.flows || !parsed.contacts || !parsed.campaigns) return seedWorkspace();
    return normalizeWorkspaceState(parsed);
  } catch {
    return seedWorkspace();
  }
}

function loadDashboardCache() {
  try {
    const stored = localStorage.getItem(DASHBOARD_CACHE_KEY);
    if (!stored) return emptyDashboardCache();
    const parsed = JSON.parse(stored);
    return normalizeDashboardCache(parsed);
  } catch {
    return emptyDashboardCache();
  }
}

function emptyDashboardCache() {
  return {
    profile: null,
    pages: null,
    flowsByPage: {},
    conversationsByPage: {},
    messagesByConversation: {}
  };
}

function normalizeDashboardCache(cache = {}) {
  return {
    profile: cacheEntryOrNull(cache.profile),
    pages: cacheEntryOrNull(cache.pages),
    flowsByPage: cacheMapEntries(cache.flowsByPage),
    conversationsByPage: cacheMapEntries(cache.conversationsByPage),
    messagesByConversation: cacheMapEntries(cache.messagesByConversation)
  };
}

function cacheEntryOrNull(entry) {
  if (!entry || typeof entry !== "object") return null;
  return {
    ts: Number(entry.ts || 0),
    data: entry.data
  };
}

function cacheMapEntries(map) {
  if (!map || typeof map !== "object" || Array.isArray(map)) return {};
  return Object.fromEntries(
    Object.entries(map)
      .map(([key, entry]) => [key, cacheEntryOrNull(entry)])
      .filter(([, entry]) => entry)
  );
}

function readPersistedSelectedMetaPage() {
  try {
    const raw = localStorage.getItem(SELECTED_META_PAGE_KEY);
    if (!raw) return null;
    const trimmed = raw.trim();
    if (!trimmed.startsWith("{")) return { pageId: trimmed, pageName: "" };
    const parsed = JSON.parse(trimmed);
    if (parsed && typeof parsed === "object") {
      const pageId = String(parsed.pageId || "").trim();
      if (!pageId) return null;
      return {
        pageId,
        pageName: String(parsed.pageName || "").trim()
      };
    }
    return null;
  } catch {
    return null;
  }
}

function persistSelectedMetaPage(pageId, pageName = "") {
  try {
    localStorage.setItem(
      SELECTED_META_PAGE_KEY,
      JSON.stringify({
        pageId: String(pageId || "").trim(),
        pageName: String(pageName || "").trim()
      })
    );
  } catch {
    // The workspace state still carries the same selection as fallback.
  }
}

function getDashboardCache(section, key = "", ttl = 0) {
  const entry = dashboardCacheEntry(section, key);
  if (!entry || typeof entry !== "object") return null;
  if (ttl && Date.now() - Number(entry.ts || 0) > ttl) return null;
  return entry.data ?? null;
}

function dashboardCacheEntry(section, key = "") {
  const bucket = dashboardCache[section];
  return key ? bucket?.[key] : bucket;
}

function dashboardCacheAgeMs(section, key = "") {
  const entry = dashboardCacheEntry(section, key);
  if (!entry?.ts) return Infinity;
  return Date.now() - Number(entry.ts || 0);
}

function setDashboardCache(section, key, data) {
  const entry = {
    ts: Date.now(),
    data
  };
  if (key) {
    dashboardCache[section] = dashboardCache[section] && typeof dashboardCache[section] === "object" ? dashboardCache[section] : {};
    dashboardCache[section][key] = entry;
  } else {
    dashboardCache[section] = entry;
  }
  persistDashboardCache();
}

function removeDashboardCache(section, key) {
  if (!key || !dashboardCache[section] || typeof dashboardCache[section] !== "object") return;
  delete dashboardCache[section][key];
  persistDashboardCache();
}

function persistDashboardCache() {
  try {
    pruneDashboardCache();
    localStorage.setItem(DASHBOARD_CACHE_KEY, JSON.stringify(dashboardCache));
  } catch {
    try {
      dashboardCache.messagesByConversation = {};
      localStorage.setItem(DASHBOARD_CACHE_KEY, JSON.stringify(dashboardCache));
    } catch {
      // Cache is optional; UI must keep working if localStorage quota is full.
    }
  }
}

function clearDashboardCache() {
  dashboardCache = emptyDashboardCache();
  try {
    localStorage.removeItem(DASHBOARD_CACHE_KEY);
  } catch {
    // Cache cleanup is best effort.
  }
}

function pruneDashboardCache() {
  pruneCacheMap(dashboardCache.flowsByPage, CACHE_FLOWS_TTL_MS * 6, 12);
  pruneCacheMap(dashboardCache.conversationsByPage, CACHE_CONVERSATIONS_TTL_MS * 12, 10);
  pruneCacheMap(dashboardCache.messagesByConversation, CACHE_MESSAGES_TTL_MS * 12, 24);
}

function pruneCacheMap(map, maxAge, maxItems) {
  if (!map || typeof map !== "object") return;
  const entries = Object.entries(map)
    .filter(([, entry]) => entry && Date.now() - Number(entry.ts || 0) <= maxAge)
    .sort((left, right) => Number(right[1].ts || 0) - Number(left[1].ts || 0))
    .slice(0, maxItems);
  Object.keys(map).forEach((key) => delete map[key]);
  entries.forEach(([key, entry]) => {
    map[key] = entry;
  });
}

function hydrateDashboardCache() {
  const profile = getDashboardCache("profile", "", CACHE_PROFILE_TTL_MS);
  if (profile?.id || profile?.name) {
    metaState.profile = profile;
    metaState.profileFromCache = true;
    metaState.authChecked = true;
  }

  const pagesCache = getDashboardCache("pages", "", CACHE_PAGES_TTL_MS);
  if (pagesCache && Array.isArray(pagesCache.pages)) {
    metaState.pages = pagesCache.pages;
    metaState.pagesFromCache = true;
    metaState.pageDebug = pagesCache.debug || null;
    const selectedPage = selectedMetaPageFrom(metaState.pages, { preferSaved: true });
    if (selectedPage) {
      const previousPageId = currentFlowPageId();
      const selectedPageId = normalizeFlowPageId(selectedPage.id);
      const pageChanged = normalizeFlowPageId(previousPageId) !== selectedPageId;
      if (pageChanged) cacheCurrentPageFlows(previousPageId);
      const selectionChanged = applySelectedMetaPage(selectedPage);
      if (pageChanged) setActiveFlowsForPage(selectedPageId);
      if (selectionChanged || pageChanged) persistLocalState();
    }
  }

  const pageId = normalizeFlowPageId(metaState.selectedPageId || state.settings.pageId);
  hydrateCachedFlowsForPage(pageId);
  hydrateCachedConversationsForPage(pageId);
}

function hydrateCachedFlowsForPage(pageId) {
  const normalizedPageId = normalizeFlowPageId(pageId);
  if (!normalizedPageId) return false;
  const flows = getDashboardCache("flowsByPage", normalizedPageId, CACHE_FLOWS_TTL_MS);
  if (!Array.isArray(flows)) return false;
  setActiveFlowsForPage(normalizedPageId, flows);
  flowStore = {
    ...flowStore,
    pageId: normalizedPageId,
    loading: false,
    serverAvailable: true,
    status: "Cache local"
  };
  return true;
}

function hydrateCachedConversationsForPage(pageId) {
  const normalizedPageId = normalizeFlowPageId(pageId);
  if (!normalizedPageId) return false;
  const conversations = getDashboardCache("conversationsByPage", normalizedPageId, CACHE_CONVERSATIONS_TTL_MS);
  if (!Array.isArray(conversations)) return false;
  metaState.conversations = conversations;
  metaState.conversationsPageId = normalizedPageId;
  metaState.conversationsFromCachePageId = normalizedPageId;
  mergeConversationsAsContacts(normalizedPageId, selectedPageName(normalizedPageId), conversations);
  return true;
}

function hydrateCachedMessagesForConversation(pageId, conversationId) {
  const key = conversationCacheKey(pageId, conversationId);
  const cached = getDashboardCache("messagesByConversation", key, CACHE_MESSAGES_TTL_MS);
  if (!cached || !Array.isArray(cached.messages)) return false;
  metaState.messages = cached.messages;
  metaState.pixelEvents = Array.isArray(cached.pixelEvents) ? cached.pixelEvents : [];
  metaState.attributionEvents = Array.isArray(cached.attributionEvents) ? cached.attributionEvents : [];
  metaState.unreadAnchorId = "";
  return true;
}

function conversationCacheKey(pageId, conversationId) {
  return `${normalizeFlowPageId(pageId)}:${String(conversationId || "").trim()}`;
}

function selectedMetaPageFrom(pages = metaState.pages || [], options = {}) {
  const list = Array.isArray(pages) ? pages : [];
  if (!list.length) return null;

  const persistedPage = readPersistedSelectedMetaPage();
  const persistedId = normalizeFlowPageId(persistedPage?.pageId);
  const selectedId = normalizeFlowPageId(metaState.selectedPageId);
  const savedId = normalizeFlowPageId(state.settings.pageId);
  const persistedMatch = list.find((page) => normalizeFlowPageId(page.id) === persistedId) || null;
  const selectedPage = list.find((page) => normalizeFlowPageId(page.id) === selectedId) || null;
  const savedPage = list.find((page) => normalizeFlowPageId(page.id) === savedId) || null;

  return options.preferSelected
    ? selectedPage || persistedMatch || savedPage || list[0]
    : persistedMatch || savedPage || selectedPage || list[0];
}

function applySelectedMetaPage(page) {
  if (!page?.id) return false;
  const pageId = normalizeFlowPageId(page.id);
  const pageName = String(page.name || selectedPageName(pageId) || state.settings.pageName || pageId).trim();
  const changed =
    normalizeFlowPageId(metaState.selectedPageId) !== pageId ||
    normalizeFlowPageId(state.settings.pageId) !== pageId ||
    Boolean(pageName && state.settings.pageName !== pageName);

  metaState.selectedPageId = pageId;
  state.settings.pageId = pageId;
  if (pageName) state.settings.pageName = pageName;
  persistSelectedMetaPage(pageId, pageName);
  return changed;
}

function clearSelectedMetaConversation() {
  metaState.conversations = null;
  metaState.conversationsPageId = "";
  metaState.conversationsFromCachePageId = "";
  metaState.loadingConversationsPageId = "";
  metaState.selectedConversationId = "";
  metaState.messages = null;
  metaState.pixelEvents = null;
  metaState.attributionEvents = null;
  metaState.unreadAnchorId = "";
}

function normalizeWorkspaceState(workspace) {
  const activePageId = normalizeFlowPageId(workspace.settings?.pageId);
  const hasScopedFlows =
    workspace.flowsByPage && typeof workspace.flowsByPage === "object" && !Array.isArray(workspace.flowsByPage);
  const flowsByPage =
    hasScopedFlows ? workspace.flowsByPage : {};
  const contacts = Array.isArray(workspace.contacts)
    ? workspace.contacts.map((contact) => normalizeContactRecord(contact, activePageId))
    : [];

  if (!hasScopedFlows && !flowsByPage[activePageId] && Array.isArray(workspace.flows)) {
    flowsByPage[activePageId] = workspace.flows.map((flow) => stampFlowPage(flow, activePageId));
  }

  for (const [pageId, flows] of Object.entries(flowsByPage)) {
    const normalizedPageId = normalizeFlowPageId(pageId);
    flowsByPage[normalizedPageId] = Array.isArray(flows)
      ? flows
          .filter((flow) => flowBelongsToPage(flow, normalizedPageId, { allowUnscoped: normalizedPageId === activePageId }))
          .map((flow) => stampFlowPage(flow, normalizedPageId))
      : [];
  }

  return {
    ...workspace,
    contacts,
    tagLibraryByPage: normalizeTagLibraryByPage(workspace.tagLibraryByPage, activePageId),
    customFieldsByPage: normalizeCustomFieldsByPage(workspace.customFieldsByPage, activePageId),
    flowsByPage,
    flows: Array.isArray(flowsByPage[activePageId]) ? flowsByPage[activePageId] : Array.isArray(workspace.flows) ? workspace.flows : []
  };
}

function normalizeTagLibraryByPage(library, fallbackPageId = DEFAULT_FLOW_PAGE_ID) {
  const next = {};
  if (library && typeof library === "object" && !Array.isArray(library)) {
    Object.entries(library).forEach(([pageId, tags]) => {
      next[normalizeFlowPageId(pageId)] = normalizeTagStore(tags);
    });
  } else if (Array.isArray(library)) {
    next[normalizeFlowPageId(fallbackPageId)] = normalizeTagStore(library);
  }
  return next;
}

function normalizeTagStore(value) {
  if (Array.isArray(value)) {
    return {
      folders: [defaultTagFolder()],
      tags: normalizeTags(value).map((name) => ({ id: makeStableTagId(name), name, folderId: DEFAULT_TAG_FOLDER_ID }))
    };
  }

  const folders = Array.isArray(value?.folders)
    ? value.folders
        .map((folder) => ({
          id: String(folder?.id || makeId("folder")),
          name: String(folder?.name || "").trim()
        }))
        .filter((folder) => folder.name)
    : [];
  if (!folders.some((folder) => folder.id === DEFAULT_TAG_FOLDER_ID)) folders.unshift(defaultTagFolder());

  const folderIds = new Set(folders.map((folder) => folder.id));
  const tags = Array.isArray(value?.tags)
    ? value.tags
        .map((tag) => {
          const name = String(tag?.name || tag || "").trim();
          return name ? { id: String(tag?.id || makeStableTagId(name)), name, folderId: folderIds.has(tag?.folderId) ? tag.folderId : DEFAULT_TAG_FOLDER_ID } : null;
        })
        .filter(Boolean)
    : [];

  return { folders: uniqueFolders(folders), tags: uniqueTagRecords(tags) };
}

function defaultTagFolder() {
  return { id: DEFAULT_TAG_FOLDER_ID, name: DEFAULT_TAG_FOLDER_NAME };
}

function makeStableTagId(name) {
  return `tag_${normalize(name).replace(/[^a-z0-9]+/g, "_") || Math.random().toString(36).slice(2, 8)}`;
}

function uniqueFolders(folders) {
  const seen = new Set();
  return folders.filter((folder) => {
    const key = normalize(folder.name);
    if (!key || seen.has(folder.id) || seen.has(key)) return false;
    seen.add(folder.id);
    seen.add(key);
    return true;
  });
}

function uniqueTagRecords(tags) {
  const seen = new Set();
  return tags.filter((tag) => {
    const key = normalizeTagKey(tag.name);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizeCustomFieldsByPage(library, fallbackPageId = DEFAULT_FLOW_PAGE_ID) {
  const next = {};
  if (library && typeof library === "object" && !Array.isArray(library)) {
    Object.entries(library).forEach(([pageId, fields]) => {
      next[normalizeFlowPageId(pageId)] = uniqueCustomFieldRecords(fields);
    });
  } else if (Array.isArray(library)) {
    next[normalizeFlowPageId(fallbackPageId)] = uniqueCustomFieldRecords(library);
  }
  return next;
}

function normalizeCustomFieldRecord(field = {}) {
  const name = String(field.name || field.fieldName || "").replace(/\s+/g, " ").trim();
  return {
    ...field,
    id: String(field.id || makeId("field")),
    name,
    type: normalizeCustomFieldType(field.type),
    description: String(field.description || "").trim(),
    folder: String(field.folder || DEFAULT_CUSTOM_FIELD_FOLDER).trim() || DEFAULT_CUSTOM_FIELD_FOLDER
  };
}

function uniqueCustomFieldRecords(fields = []) {
  const seen = new Set();
  return (Array.isArray(fields) ? fields : [])
    .map(normalizeCustomFieldRecord)
    .filter((field) => {
      const key = normalizeCustomFieldKey(field.name);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((left, right) => left.name.localeCompare(right.name));
}

function normalizeCustomFieldType(value) {
  const type = String(value || "text").trim().toLowerCase();
  return customFieldTypes.some((option) => option.id === type) ? type : "text";
}

function normalizeCustomFieldKey(value) {
  return normalize(String(value || "").replace(/\s+/g, " ").trim());
}

function customFieldRecordsForPage(pageId = currentFlowPageId()) {
  if (!state.customFieldsByPage || typeof state.customFieldsByPage !== "object" || Array.isArray(state.customFieldsByPage)) {
    state.customFieldsByPage = {};
  }
  const normalizedPageId = normalizeFlowPageId(pageId);
  state.customFieldsByPage[normalizedPageId] = uniqueCustomFieldRecords(state.customFieldsByPage[normalizedPageId]);
  return state.customFieldsByPage[normalizedPageId];
}

function mergeCustomFieldsForPage(pageId, fields = []) {
  const normalizedPageId = normalizeFlowPageId(pageId);
  const current = customFieldRecordsForPage(normalizedPageId);
  const merged = new Map(current.map((field) => [normalizeCustomFieldKey(field.name), field]));
  uniqueCustomFieldRecords(fields).forEach((field) => {
    merged.set(normalizeCustomFieldKey(field.name), field);
  });
  state.customFieldsByPage[normalizedPageId] = uniqueCustomFieldRecords([...merged.values()]);
  return state.customFieldsByPage[normalizedPageId];
}

function findCustomFieldForPage(fieldRef, pageId = currentFlowPageId()) {
  const value = String(fieldRef || "").trim();
  const key = normalizeCustomFieldKey(value);
  return customFieldRecordsForPage(pageId).find((field) => field.id === value || normalizeCustomFieldKey(field.name) === key) || null;
}

function customFieldTypeLabel(type) {
  return customFieldTypes.find((option) => option.id === normalizeCustomFieldType(type))?.label || "Texto";
}

function normalizeFlowPageId(pageId) {
  return String(pageId || DEFAULT_FLOW_PAGE_ID).trim() || DEFAULT_FLOW_PAGE_ID;
}

function normalizeContactRecord(contact, fallbackPageId = DEFAULT_FLOW_PAGE_ID) {
  const pageId = normalizeFlowPageId(contact?.pageId || fallbackPageId);
  const psid = String(contact?.psid || "").trim() || `PSID_${Math.random().toString().slice(2, 12)}`;
  const tags = normalizeTags(contact?.tags ?? contact?.tag);
  return {
    ...contact,
    id: contact?.id || `${pageId}:${psid}`,
    pageId,
    psid,
    name: contactDisplayName(contact?.name, psid),
    status: contact?.status || "open",
    source: contact?.source || "Messenger",
    tags,
    tag: tags[0] || contact?.tag || "",
    customFields: contact?.customFields && typeof contact.customFields === "object" && !Array.isArray(contact.customFields) ? contact.customFields : {},
    lastSeen: contact?.lastSeen || lastMessage(contact)?.at || "",
    messages: Array.isArray(contact?.messages) ? contact.messages : []
  };
}

function contactDisplayName(name, psid = "") {
  const value = String(name || "").replace(/\s+/g, " ").trim();
  if (value && !isTechnicalContactName(value, psid)) return value;
  const suffix = String(psid || "").slice(-6);
  return suffix ? `Contato ${suffix}` : "Contato Messenger";
}

function isTechnicalContactName(value, psid = "") {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (!text) return true;
  if (psid && text === String(psid)) return true;
  return /^PSID[_:-]?\d+$/i.test(text) || /^\d{12,}$/.test(text);
}

function ensureFlowsByPage() {
  if (!state.flowsByPage || typeof state.flowsByPage !== "object" || Array.isArray(state.flowsByPage)) {
    state.flowsByPage = {};
  }
  return state.flowsByPage;
}

function cacheCurrentPageFlows(pageId = currentFlowPageId()) {
  const flowsByPage = ensureFlowsByPage();
  const normalizedPageId = normalizeFlowPageId(pageId);
  flowsByPage[normalizedPageId] = Array.isArray(state.flows) ? state.flows.map((flow) => stampFlowPage(flow, normalizedPageId)) : [];
}

function localFlowsForPage(pageId) {
  const flowsByPage = ensureFlowsByPage();
  const key = normalizeFlowPageId(pageId);
  const flows = Array.isArray(flowsByPage[key]) ? flowsByPage[key] : [];
  const scopedFlows = flows.filter((flow) => flowBelongsToPage(flow, key)).map((flow) => stampFlowPage(flow, key));
  flowsByPage[key] = scopedFlows;
  return scopedFlows;
}

function setActiveFlowsForPage(pageId, flows = localFlowsForPage(pageId)) {
  const normalizedPageId = normalizeFlowPageId(pageId);
  state.flows = Array.isArray(flows)
    ? flows.filter((flow) => flowBelongsToPage(flow, normalizedPageId)).map((flow) => stampFlowPage(flow, normalizedPageId))
    : [];
  ensureFlowsByPage()[normalizedPageId] = state.flows;
  selectedFlowId = state.flows[0]?.id;
  selectedNodeId = state.flows[0]?.nodes[0]?.id;
}

function stampFlowPage(flow, pageId) {
  if (flow && typeof flow === "object") {
    flow.pageId = normalizeFlowPageId(pageId);
    normalizeFlowStructure(flow);
  }
  return flow;
}

function normalizeFlowStructure(flow) {
  if (!Array.isArray(flow?.nodes)) return flow;
  flow.nodes.forEach(normalizeNodeStructure);
  if (Array.isArray(flow.publishedNodes)) {
    flow.publishedNodes.forEach(normalizeNodeStructure);
  } else {
    flow.publishedNodes = null;
  }
  if (!flow.publishedMeta || typeof flow.publishedMeta !== "object" || Array.isArray(flow.publishedMeta)) {
    flow.publishedMeta = null;
  }
  flow.hasDraftChanges = Boolean(flow.hasDraftChanges);
  if (flow.status === "active" && !Array.isArray(flow.publishedNodes)) {
    flow.publishedNodes = cloneFlowNodes(flow.nodes);
    flow.publishedMeta = flowPublicationMeta(flow);
    flow.hasDraftChanges = false;
    flow.publishedAt = flow.publishedAt || flow.updatedAt || new Date().toISOString();
  }
  if (flow.status === "active" && Array.isArray(flow.publishedNodes) && !flow.publishedMeta) {
    flow.publishedMeta = flowPublicationMeta(flow);
  }
  if (Array.isArray(flow.publishedNodes) && !flow.hasDraftChanges) {
    flow.hasDraftChanges = !flowDraftMatchesPublication(flow);
  }
  return flow;
}

function cloneFlowNodes(nodes) {
  return JSON.parse(JSON.stringify(Array.isArray(nodes) ? nodes : []));
}

function flowDraftMatchesPublication(flow) {
  if (!Array.isArray(flow?.publishedNodes)) return false;
  return JSON.stringify(flow.nodes || []) === JSON.stringify(flow.publishedNodes || []) &&
    JSON.stringify(flowPublicationMeta(flow)) === JSON.stringify(flow.publishedMeta || {});
}

function flowPublicationMeta(flow) {
  return {
    name: String(flow?.name || ""),
    trigger: String(flow?.trigger || ""),
    goal: String(flow?.goal || "")
  };
}

function markCurrentFlowDraftChange() {
  if (activeView !== "flows" || !flowCanvasOpen) return;
  const flow = selectedFlow();
  if (!flow) return;

  normalizeFlowStructure(flow);
  flow.updatedAt = flow.updatedAt || new Date().toISOString();
  if (Array.isArray(flow.publishedNodes)) {
    flow.hasDraftChanges = true;
    return;
  }

  flow.hasDraftChanges = true;
  if (flow.status !== "active" && flow.status !== "paused") flow.status = "draft";
}

function hasPublishedFlow(flow) {
  return Array.isArray(flow?.publishedNodes);
}

function canvasDisplayFlow(flow = selectedFlow()) {
  if (!flow || flowCanvasMode !== "published" || !hasPublishedFlow(flow)) return flow;
  return {
    ...flow,
    ...(flow.publishedMeta || {}),
    nodes: flow.publishedNodes
  };
}

function editPublishedFlow() {
  const flow = selectedFlow();
  if (!flow) return;
  flowCanvasMode = "edit";
  selectedNodeId = flow.nodes.find((node) => node.id === selectedNodeId)?.id || flow.nodes.find((node) => node.type === "message")?.id || flow.nodes[0]?.id;
  messageButtonEditorOptionId = "";
  messageImageUrlEditorBlockId = "";
  messageImageUrlPopoverPosition = null;
  messageCardUrlEditorBlockId = "";
  messageCardUrlPopoverPosition = null;
  messageMorePanelOpen = false;
  messageMorePanelPosition = null;
  showInspector = false;
  shouldAutoFitCanvas = true;
  render();
}

function normalizeNodeStructure(node) {
  if (!node || typeof node !== "object") return node;

  if (node.type === "trigger") {
    node.triggerConfigs =
      node.triggerConfigs && typeof node.triggerConfigs === "object" && !Array.isArray(node.triggerConfigs)
        ? node.triggerConfigs
        : {};
    delete node.triggerConfigs.facebook_ad;
  }

  if (node.type === "message") {
    if (!Array.isArray(node.contentBlocks)) {
      node.contentBlocks = [
        {
          id: makeId("block"),
          type: "text",
          text: node.message || ""
        }
      ];
    }
    node.contentBlocks = node.contentBlocks.map((block) => ({
      id: block.id || makeId("block"),
      type: block.type || "text",
      text: block.text ?? (block.type === "text" ? node.message || "" : ""),
      url: block.url || "",
      cardUrl: block.cardUrl || block.defaultActionUrl || block.default_action_url || block.itemUrl || "",
      title: block.title || "",
      subtitle: block.subtitle || "",
      imageAspectRatio: normalizeCardImageAspectRatio(block.imageAspectRatio || block.image_aspect_ratio),
      fileName: block.fileName || "",
      fieldName: block.fieldName || "",
      endpoint: block.endpoint || "",
      items: Array.isArray(block.items) ? block.items : [],
      buttons: normalizeMessageOptions(block.buttons, "btn").slice(0, 3)
    }));
    node.quickReplies = stripDefaultQuickReplies(normalizeMessageOptions(node.quickReplies, "qr"));
    node.buttons = normalizeMessageOptions(node.buttons, "btn").slice(0, 3);
  }

  if (node.type === "condition") {
    node.conditionType = node.conditionType || "message_contains";
    node.conditionOperator = node.conditionOperator || "contains_any";
    node.yesNext = node.yesNext || node.next || null;
    node.noNext = node.noNext || null;
    if (!Array.isArray(node.conditions)) {
      node.conditions = node.keyword
        ? [
            {
              id: makeId("cond"),
              type: node.conditionType,
              label: conditionLabelForType(node.conditionType),
              operator: node.conditionOperator,
              value: node.conditionType === "field" ? node.fieldValue || "" : node.keyword || "",
              fieldId: node.fieldId || "",
              fieldName: node.fieldName || ""
            }
          ]
        : [];
    }
    node.conditions = node.conditions.map((condition) => ({
      id: condition.id || makeId("cond"),
      type: condition.type || condition.conditionType || "tag",
      label: condition.label || conditionLabelForType(condition.type || condition.conditionType || "tag"),
      operator: condition.operator || "contains_any",
      value: condition.value ?? condition.keyword ?? "",
      fieldId: condition.fieldId || "",
      fieldName: condition.fieldName || ""
    }));
    node.conditions.forEach((condition) => {
      if (condition.type !== "field") return;
      const field = findCustomFieldForPage(condition.fieldId || condition.fieldName);
      if (!field) return;
      condition.fieldId = field.id;
      condition.fieldName = field.name;
    });
    node.conditionMatch = node.conditionMatch || "all";
  }

  if (node.type === "delay") {
    node.delayType = node.delayType || "duration";
    node.delayUnit = normalizeDelayUnit(node.delayUnit);
    node.delayMinutes = Math.max(0, Number(node.delayMinutes) || 0);
    node.delayValue = Math.max(0, Number(node.delayValue ?? node.delayMinutes) || 0);
    node.continueStart = node.continueStart || "";
    node.continueEnd = node.continueEnd || "";
    node.continueDays = node.continueDays || "any";
    node.specificDate = node.specificDate || "";
    const dynamicField = findCustomFieldForPage(node.dynamicFieldId || node.dynamicField);
    node.dynamicFieldId = dynamicField?.id || String(node.dynamicFieldId || "");
    if (dynamicField) node.dynamicField = dynamicField.name;
    node.dynamicField = node.dynamicField || "";
  }

  if (node.type === "user_input") {
    node.saveResponse = node.saveResponse !== false;
    node.responseField = node.responseField || "";
    node.timeoutMinutes = Math.max(0, Number(node.timeoutMinutes) || 0);
  }

  if (node.type === "link_click_wait") {
    node.timeoutMinutes = Math.max(0, Number(node.timeoutMinutes ?? 5) || 0);
    node.clickedNext = node.clickedNext || node.next || null;
    node.noClickNext = node.noClickNext || null;
    node.next = node.clickedNext;
  }

  if (node.type === "jump") {
    node.targetFlowId = String(node.targetFlowId || "");
    node.targetNodeId = String(node.targetNodeId || "");
    node.next = null;
  }

  if (node.type === "randomizer") {
    node.randomEveryTime = node.randomEveryTime !== false;
    if (!Array.isArray(node.variations) || !node.variations.length) {
      node.variations = [
        { id: makeId("var"), label: "Variação A", weight: 50, next: node.next || null },
        { id: makeId("var"), label: "Variação B", weight: 50, next: null }
      ];
    }
    node.variations = node.variations.map((variation, index) => ({
      id: variation.id || makeId("var"),
      label: variation.label || `Variação ${index + 1}`,
      weight: Math.max(0, Number(variation.weight) || 0),
      next: variation.next || null
    }));
  }

  return node;
}

function normalizeMessageOptions(options, prefix) {
  return (Array.isArray(options) ? options : [])
    .map((option) => {
      if (typeof option === "string") {
        return {
          id: makeId(prefix),
          title: option,
          type: "next",
          url: "",
          phone: "",
          next: null
        };
      }
      return {
        id: option.id || makeId(prefix),
        title: option.title || option.caption || option.text || "",
        type: option.type || "next",
        url: option.url || "",
        phone: option.phone || "",
        flowId: option.flowId || "",
        next: option.next || null
      };
    })
    .filter((option) => option.title);
}

function stripDefaultQuickReplies(options) {
  if (!Array.isArray(options) || options.length !== 2) return options;

  const titles = options.map((option) => normalize(option.title)).sort();
  const isDefaultPair = titles[0] === "nao" && titles[1] === "sim";
  const hasConfiguredTarget = options.some((option) => option.next || option.url || option.phone);

  return isDefaultPair && !hasConfiguredTarget ? [] : options;
}

function conditionLabelForType(type) {
  return {
    tag: "Tag",
    field: "Campo personalizado",
    message_contains: "Mensagem contém"
  }[type] || "Condição";
}

function flowBelongsToPage(flow, pageId, options = {}) {
  if (!flow || typeof flow !== "object") return false;
  if (!flow.pageId) return Boolean(options.allowUnscoped);
  return normalizeFlowPageId(flow.pageId) === normalizeFlowPageId(pageId);
}

function saveState(options = {}) {
  if (options.markFlowDraft !== false) markCurrentFlowDraftChange();
  persistLocalState();
  updateFlowStatusPill();
  scheduleFlowSave();
}

function persistLocalState() {
  recordFlowUndoSnapshot();
  cacheCurrentPageFlows();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function ensureFlowUndoBaseline() {
  const flow = selectedFlow();
  const key = currentFlowUndoKey(flow);
  if (!key || !flow) return;

  const snapshot = flowSnapshot(flow);
  if (flowUndoState.key !== key) {
    flowUndoState = {
      ...flowUndoState,
      key,
      lastSnapshot: snapshot,
      undoStack: []
    };
    return;
  }

  if (!flowUndoState.lastSnapshot) flowUndoState.lastSnapshot = snapshot;
}

function recordFlowUndoSnapshot() {
  if (flowUndoState.applying) return;
  if (activeView !== "flows" || !flowCanvasOpen) return;

  const flow = selectedFlow();
  const key = currentFlowUndoKey(flow);
  if (!key || !flow) return;

  const snapshot = flowSnapshot(flow);
  if (flowUndoState.key !== key) {
    flowUndoState = {
      ...flowUndoState,
      key,
      lastSnapshot: snapshot,
      undoStack: []
    };
    return;
  }
  if (!flowUndoState.lastSnapshot || snapshot === flowUndoState.lastSnapshot) return;

  flowUndoState.undoStack.push(flowUndoState.lastSnapshot);
  if (flowUndoState.undoStack.length > FLOW_UNDO_LIMIT) flowUndoState.undoStack.shift();
  flowUndoState.lastSnapshot = snapshot;
}

function currentFlowUndoKey(flow = selectedFlow()) {
  if (!flow?.id) return "";
  return `${currentFlowPageId()}:${flow.id}`;
}

function flowSnapshot(flow = selectedFlow()) {
  return flow ? JSON.stringify(flow) : "";
}

function loadConversationReadState() {
  try {
    const stored = localStorage.getItem(CONVERSATION_READ_KEY);
    if (!stored) return {};
    const parsed = JSON.parse(stored);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function saveConversationReadState() {
  localStorage.setItem(CONVERSATION_READ_KEY, JSON.stringify(conversationReadState));
}

function getInitialView() {
  const hash = location.hash.replace("#", "").split("?")[0];
  if (navItems.some((item) => item.id === hash)) return hash;
  try {
    const storedView = localStorage.getItem(ACTIVE_VIEW_KEY);
    if (navItems.some((item) => item.id === storedView)) return storedView;
  } catch {
    // Local storage is optional for restoring the last screen.
  }
  return "pages";
}

function persistActiveView(view) {
  if (!navItems.some((item) => item.id === view)) return;
  try {
    localStorage.setItem(ACTIVE_VIEW_KEY, view);
  } catch {
    // Best effort only.
  }
}

function oauthErrorFromHash() {
  const query = location.hash.split("?")[1] || "";
  const error = new URLSearchParams(query).get("error");
  return error ? `Facebook Login: ${error}` : "";
}

function renderAuthGate() {
  document.body.classList.toggle("auth-locked", !appAuthenticated);
  document.body.classList.toggle("auth-ready", appAuthenticated);
  if (appShell) appShell.setAttribute("aria-hidden", appAuthenticated ? "false" : "true");
  if (!loginRoot) return;

  if (appAuthenticated) {
    loginRoot.hidden = true;
    loginRoot.innerHTML = "";
    return;
  }

  loginRoot.hidden = false;
  loginRoot.innerHTML = `
    <main class="login-screen">
      <form class="login-panel" data-login-form>
        <div class="login-brand">
          <span class="brand-mark" aria-hidden="true">ML</span>
          <div>
            <strong>Messenlead</strong>
            <span>Automações Messenger</span>
          </div>
        </div>
        <label>
          <span>E-mail</span>
          <input name="email" type="email" autocomplete="username" value="${attr(APP_LOGIN_EMAIL)}" required />
        </label>
        <label>
          <span>Senha</span>
          <input name="password" type="password" autocomplete="current-password" required />
        </label>
        ${appLoginError ? `<div class="login-error">${escapeHtml(appLoginError)}</div>` : ""}
        <button class="primary-button" type="submit">Entrar</button>
      </form>
    </main>
  `;
}

function handleAppLoginSubmit(event) {
  const form = event.target.closest("[data-login-form]");
  if (!form) return;
  event.preventDefault();

  const data = new FormData(form);
  const email = String(data.get("email") || "").trim().toLowerCase();
  const password = String(data.get("password") || "");
  if (email !== APP_LOGIN_EMAIL || password !== APP_LOGIN_PASSWORD) {
    appLoginError = "E-mail ou senha inválidos.";
    renderAuthGate();
    return;
  }

  appAuthenticated = true;
  appLoginError = "";
  localStorage.setItem(APP_LOGIN_SESSION_KEY, "true");
  render();
}

function logoutApp() {
  appAuthenticated = false;
  appLoginError = "";
  localStorage.removeItem(APP_LOGIN_SESSION_KEY);
  render();
}

function render() {
  if (!appAuthenticated) {
    renderAuthGate();
    return;
  }
  renderAuthGate();
  if (activeView === "flows" && flowCanvasOpen) rememberCanvasScroll();
  if (activeView === "flows" && flowCanvasOpen && showInspector) rememberInspectorScroll();
  renderNav();
  renderPageSwitcher();
  appShell?.classList.toggle("canvas-mode", activeView === "flows" && flowCanvasOpen);
  const current = navItems.find((item) => item.id === activeView) || navItems[0];
  pageEyebrow.textContent = "Messenger";
  pageTitle.textContent = current.label === "Messenger" ? "Configuração do Messenger" : current.label;
  globalSearch.placeholder = placeholderForView(activeView);

  const renderers = {
    dashboard: renderDashboard,
    pages: renderPages,
    flows: renderFlows,
    inbox: renderInbox,
    subscribers: renderSubscribers,
    broadcasts: renderBroadcasts,
    json_templates: renderJsonTemplates,
    origins: renderOrigins,
    pixel: renderPixel,
    media: renderMediaLibrary,
    image: renderImageTool,
    video: renderVideoTool,
    setup: renderSetup,
    settings: renderSettings
  };

  renderers[activeView]();
  if (activeView === "flows" && flowCanvasOpen && showInspector) restoreInspectorScroll();
  if (activeView === "flows" && flowCanvasOpen && showInspector) scrollFocusedMessageBlockIntoView();
}

function renderNav() {
  const pageContacts = contactsForPage(currentFlowPageId());
  const counts = {
    dashboard: "",
    pages: pageContacts.filter((contact) => contact.status === "open").length,
    flows: state.flows.filter((flow) => flow.status === "active").length,
    subscribers: pageContacts.length,
    broadcasts: state.campaigns.filter((campaign) => campaign.status !== "sent").length,
    json_templates: jsonTemplateState.pageId === currentFlowPageId() ? jsonTemplateState.templates.length || "" : "",
    origins: attributionSourceState.initialized ? attributionSourceState.sources.length || "" : "",
    pixel: pixelState.summary?.linkClicks || "",
    image: "",
    video: "",
    setup: "",
    settings: ""
  };

  mainNav.innerHTML = navItems
    .map(
      (item) => `
        <button class="nav-button ${activeView === item.id ? "active" : ""}" type="button" data-view="${item.id}">
          ${icons[item.icon]}
          <span>${item.label}</span>
          ${counts[item.id] !== "" ? `<span class="nav-count">${counts[item.id]}</span>` : ""}
        </button>
      `
    )
    .join("");
}

function renderPageSwitcher() {
  if (!pageSwitcher) return;

  const pages = metaState.pages || [];
  const selectedPage = selectedMetaPageFrom(pages);
  const pageName = selectedPage?.name || state.settings.pageName || "Selecionar Página";
  const pageAvatar = renderPageAvatar(selectedPage, pageName);
  const selectedCount = pageContactCount(selectedPage?.id || currentFlowPageId());
  const selectedCountLabel = contactCountLabel(selectedCount);

  if (!pages.length) {
    pageSwitcher.innerHTML = `
      <button class="page-switcher-button" type="button" data-action="go-pages" title="Selecionar Página">
        ${pageAvatar}
        <span class="page-switcher-copy">
          <strong>${escapeHtml(pageName)}</strong>
          <span>${metaState.profile ? escapeHtml(selectedCountLabel) : "Entrar com Facebook"}</span>
        </span>
        <span class="page-switcher-chevron">v</span>
      </button>
    `;
    return;
  }

  pageSwitcher.innerHTML = `
    <label class="page-switcher-control" title="Página onde os fluxos serão criados">
      ${pageAvatar}
      <span class="page-switcher-copy">
        <strong>${escapeHtml(pageName)}</strong>
        <span>${escapeHtml(selectedCountLabel)}</span>
      </span>
      <select id="sidebarPageSelect" aria-label="Selecionar Página">
        ${pages
          .map((page) => `<option value="${attr(page.id)}" ${page.id === (selectedPage?.id || metaState.selectedPageId) ? "selected" : ""}>${escapeHtml(`${page.name} (${pageContactCount(page.id)})`)}</option>`)
          .join("")}
      </select>
      <span class="page-switcher-chevron">v</span>
    </label>
  `;
}

function renderPageAvatar(page, fallbackName) {
  const picture = page?.picture || "";
  if (picture) {
    return `<span class="page-avatar has-image"><img src="${attr(picture)}" alt="${attr(fallbackName || "Página")}" loading="lazy" /></span>`;
  }
  return `<span class="page-avatar">${escapeHtml(initials(fallbackName || "Página"))}</span>`;
}

function renderDashboard() {
  const pageContacts = contactsForPage(currentFlowPageId());
  const open = pageContacts.filter((contact) => contact.status === "open").length;
  const activeFlows = state.flows.filter((flow) => flow.status === "active").length;
  const scheduled = state.campaigns.filter((campaign) => campaign.status === "scheduled").length;
  const hotLeads = pageContacts.filter((contact) => contactHasTag(contact, "lead-quente")).length;

  workspace.innerHTML = `
    <section class="metric-grid" aria-label="Indicadores">
      ${metricCard("Assinantes Messenger", pageContacts.length, "PSIDs salvos nesta pagina", "users")}
      ${metricCard("Conversas abertas", open, "Precisam de atenção humana", "inbox")}
      ${metricCard("Fluxos ativos", activeFlows, "Publicados no builder", "workflow")}
      ${metricCard("Disparos agendados", scheduled, "Dentro da política Messenger", "send")}
    </section>

    <div class="two-column">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h2>Funil do Messenger</h2>
            <span>Resumo operacional da página conectada</span>
          </div>
          <button class="secondary-button" type="button" data-action="go-flows">${icons.workflow}<span>Editar fluxos</span></button>
        </div>
        <div class="panel-body">
          <div class="campaign-list">
            ${state.flows
              .map(
                (flow) => `
                  <article class="campaign-item">
                    <div class="row-between">
                      <div>
                        <strong>${escapeHtml(flow.name)}</strong>
                        <span>${escapeHtml(flow.goal)}</span>
                      </div>
                      ${statusBadge(flow)}
                    </div>
                    <div class="progress" aria-hidden="true"><span style="width:${flow.status === "active" ? 100 : 42}%"></span></div>
                    <span>${flow.nodes.length} blocos · gatilho: ${escapeHtml(flow.trigger)}</span>
                  </article>
                `
              )
              .join("")}
          </div>
        </div>
      </section>

      <aside class="panel">
        <div class="panel-header">
          <div>
            <h2>Saúde do Messenger</h2>
            <span>Checklist para sair do protótipo e conectar na Meta</span>
          </div>
          <span class="badge">Pages Functions</span>
        </div>
        <div class="panel-body stack">
          ${checkItem("Webhook", "/api/messenger/webhook criado para verificação e eventos.")}
          ${checkItem("Token seguro", "Page Access Token fica em variável de ambiente, nunca no navegador.")}
          ${checkItem("Janela 24h", "Disparos devem respeitar a política de mensagens do Messenger.")}
          ${checkItem("Persistência", "Vincule um banco D1 como DB para salvar os fluxos por Página.")}
        </div>
      </aside>

    </div>

    <div class="two-column" style="margin-top:16px">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h2>Conversas recentes</h2>
            <span>${open} conversa${open === 1 ? "" : "s"} aberta${open === 1 ? "" : "s"}</span>
          </div>
        </div>
        <div class="panel-body stack">
          ${pageContacts
            .slice(0, 4)
            .map(
              (contact) => `
                <button class="contact-item" type="button" data-action="open-contact" data-id="${contact.id}">
                  <span class="avatar">${initials(contact.name)}</span>
                  <span>
                    <span class="row-between"><strong>${escapeHtml(contact.name)}</strong>${tagsMarkup(contact)}</span>
                    <span>${escapeHtml(lastMessage(contact)?.text || "Sem mensagens")}</span>
                  </span>
                </button>
              `
            )
            .join("")}
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <h2>Leads quentes</h2>
            <span>${hotLeads} contato${hotLeads === 1 ? "" : "s"} com tag lead-quente</span>
          </div>
        </div>
        <div class="panel-body stack">
          <div class="code-block">Webhook URL: ${escapeHtml(webhookUrl())}
Variáveis: MESSENGER_PAGE_ACCESS_TOKEN, MESSENGER_VERIFY_TOKEN, MESSENGER_APP_SECRET</div>
          <div class="button-row">
            <button class="primary-button" type="button" data-action="go-pages">${icons.inbox}<span>Ver Conversas</span></button>
            <button class="secondary-button" type="button" data-action="go-setup">${icons.plug}<span>Configurar Messenger</span></button>
          </div>
        </div>
      </section>
    </div>
  `;
}

function renderPages() {
  if (!metaState.authChecked) {
    workspace.innerHTML = `
      <section class="panel">
        <div class="empty-state">
          ${icons.pages}
          <strong>Verificando conexão com a Meta</strong>
          <span>O painel vai carregar as conversas da Página selecionada.</span>
        </div>
      </section>
    `;
    if (!metaState.loadingProfile) loadMetaProfile();
    return;
  }

  if (!metaState.profile) {
    workspace.innerHTML = `
      <section class="panel">
        <div class="panel-header">
          <div>
            <h2>Conectar Facebook</h2>
            <span>Entre com uma conta que administra as Páginas que você quer automatizar.</span>
          </div>
        </div>
        <div class="panel-body stack">
          <p class="muted">Depois do login, o painel mostra as conversas do Messenger da Página selecionada e permite abrir o canvas de fluxo associado a ela.</p>
          <div class="button-row">
            <button class="primary-button" type="button" data-action="connect-facebook">${icons.plug}<span>Entrar com Facebook</span></button>
            <button class="secondary-button" type="button" data-action="go-setup">${icons.settings}<span>Ver variáveis</span></button>
          </div>
          ${metaState.error ? `<div class="code-block">${escapeHtml(metaState.error)}</div>` : ""}
        </div>
      </section>
    `;
    return;
  }

  if (metaState.profileFromCache) {
    metaState.profileFromCache = false;
    if (!metaState.loadingProfile) loadMetaProfile({ background: true });
  }

  if (!metaState.pages) {
    workspace.innerHTML = `
      <section class="panel">
        <div class="empty-state">
          ${icons.pages}
          <strong>Carregando conversas</strong>
          <span>Buscando as Páginas conectadas antes de carregar as conversas.</span>
        </div>
      </section>
    `;
    if (!metaState.loadingPages) loadMetaPages();
    return;
  }

  if (metaState.pagesFromCache) {
    metaState.pagesFromCache = false;
    if (!metaState.loadingPages) loadMetaPages({ background: true });
  }

  const allPages = metaState.pages || [];
  const selectedPage = selectedMetaPageFrom(allPages);

  if (selectedPage) {
    const previousPageId = currentFlowPageId();
    const selectedPageId = normalizeFlowPageId(selectedPage.id);
    const pageChanged = normalizeFlowPageId(previousPageId) !== selectedPageId;
    if (pageChanged) cacheCurrentPageFlows(previousPageId);
    const selectionChanged = applySelectedMetaPage(selectedPage);
    if (pageChanged) {
      clearSelectedMetaConversation();
      setActiveFlowsForPage(selectedPageId);
      hydrateCachedFlowsForPage(selectedPageId);
      hydrateCachedConversationsForPage(selectedPageId);
    }
    if (selectionChanged || pageChanged) persistLocalState();
  }

  const conversationsBelongToSelectedPage =
    Boolean(selectedPage?.id) && normalizeFlowPageId(metaState.conversationsPageId) === normalizeFlowPageId(selectedPage.id);
  const conversationsLoadingForSelectedPage =
    Boolean(selectedPage?.id) && normalizeFlowPageId(metaState.loadingConversationsPageId) === normalizeFlowPageId(selectedPage.id);
  if (selectedPage && (!metaState.conversations || !conversationsBelongToSelectedPage) && !conversationsLoadingForSelectedPage) {
    loadMetaConversations(selectedPage.id);
  }

  if (selectedPage && flowStore.pageId !== normalizeFlowPageId(selectedPage.id) && !flowStore.loading) {
    loadFlowsForPage(selectedPage.id);
  }

  const conversations = conversationsBelongToSelectedPage ? sortMetaConversations(metaState.conversations || [], selectedPage?.id) : [];
  const filteredConversations = selectedPage
    ? filterBySearch(conversations, (conversation) => `${conversationTitle(conversation, selectedPage.name)} ${displayConversationSnippet(conversation)} ${conversation.id || ""}`)
    : [];
  const unreadSummary = selectedPage ? metaUnreadSummary(conversations, selectedPage.id) : null;
  const selectedConversation = metaState.selectedConversationId
    ? conversations.find((conversation) => conversation.id === metaState.selectedConversationId) || null
    : null;

  if (metaState.selectedConversationId && metaState.conversations && !selectedConversation) {
    metaState.selectedConversationId = "";
    metaState.messages = null;
    metaState.pixelEvents = null;
    metaState.attributionEvents = null;
    metaState.unreadAnchorId = "";
  }

  if (selectedPage && selectedConversation && !metaState.messages) {
    loadMetaMessages(selectedPage.id, selectedConversation.id);
  }

  workspace.innerHTML = `
    <section class="panel chat-panel conversations-panel">
      ${
        selectedPage
          ? `
            <div class="panel-header">
              <div class="row-between conversations-header">
                <div>
                  <h2>Conversas</h2>
                  <span>${escapeHtml(selectedPage.name)} · ${escapeHtml(unreadSummary?.label || "Conversas reais do Messenger desta Página")}</span>
                </div>
                <div class="button-row">
                  <button class="secondary-button" type="button" data-action="refresh-meta-conversations">${icons.inbox}<span>Atualizar</span></button>
                  ${renderMetaConversationFlowLauncher(selectedPage, selectedConversation)}
                  <button class="primary-button" type="button" data-action="open-page-flow">${icons.workflow}<span>Ver fluxos</span></button>
                  <button class="secondary-button" type="button" data-action="logout-facebook">Sair</button>
                </div>
              </div>
            </div>
            <div class="live-inbox">
              <aside class="live-thread-list">
                ${
                  conversationsBelongToSelectedPage && metaState.conversations
                    ? filteredConversations
                        .map(
                          (conversation) => `
                            <button class="campaign-item conversation-list-item ${conversationNeedsAttention(conversation, selectedPage.id) ? "has-unread" : ""} ${selectedConversation?.id === conversation.id ? "active" : ""}" type="button" data-action="select-meta-conversation" data-id="${conversation.id}">
                              <span class="conversation-title-row">
                                <strong>${escapeHtml(conversationTitle(conversation, selectedPage.name))}</strong>
                                ${renderConversationUnreadBadge(conversation, selectedPage.id)}
                              </span>
                              <span class="conversation-snippet">${escapeHtml(displayConversationSnippet(conversation))}</span>
                              <span>${formatDate(conversation.updated_time)}</span>
                            </button>
                          `
                        )
                        .join("") || emptyInline(searchQuery ? "Nenhuma conversa encontrada para a busca." : "Nenhuma conversa retornada pela Graph API.")
                    : emptyInline("Carregando conversas...")
                }
              </aside>
              <div class="live-thread">
                ${
                  selectedConversation
                    ? `
                      <div class="thread-status-row">
                        <strong>${escapeHtml(conversationTitle(selectedConversation, selectedPage.name))}</strong>
                        ${renderConversationStatus(selectedConversation, selectedPage.id)}
                      </div>
                      <div class="conversation" data-conversation-scroll>
                        ${
                          metaState.messages
                            ? renderMetaConversationMessages(metaState.messages, selectedPage.id, metaState.pixelEvents || [], metaState.attributionEvents || [], metaState.unreadAnchorId)
                            : `<div class="empty-state">${icons.inbox}<span>Carregando mensagens...</span></div>`
                        }
                      </div>
                      <div class="composer">
                        <textarea id="metaComposerText" placeholder="Responder como ${escapeHtml(selectedPage.name)}"></textarea>
                        <button class="primary-button" type="button" data-action="send-meta-message">${icons.send}<span>Enviar</span></button>
                      </div>
                    `
                    : `<div class="empty-state">${icons.inbox}<strong>Selecione uma conversa</strong><span>As mensagens aparecerão aqui.</span></div>`
                }
              </div>
            </div>
          `
          : emptyState("Nenhuma Página", "A conta conectada não retornou Páginas administráveis.", "pages", "Reconectar", "connect-facebook")
      }
    </section>
  `;
}

function renderMetaConversationFlowLauncher(selectedPage, selectedConversation) {
  if (!selectedPage || !selectedConversation) return "";

  const flows = metaConversationRunnableFlows(selectedPage.id);
  const disabled = flows.length ? "" : "disabled";
  return `
    <span class="meta-flow-launcher">
      <select id="metaConversationFlowSelect" class="meta-flow-select" ${disabled}>
        ${
          flows.length
            ? flows
                .map((flow) => `<option value="${attr(flow.id)}">${escapeHtml(flow.name || "Fluxo sem nome")}</option>`)
                .join("")
            : `<option value="">Nenhum fluxo ativo</option>`
        }
      </select>
      <button class="secondary-button" type="button" data-action="run-meta-flow" ${disabled}>${icons.play}<span>Disparar</span></button>
    </span>
  `;
}

function metaConversationRunnableFlows(pageId = currentFlowPageId()) {
  const normalizedPageId = normalizeFlowPageId(pageId);
  return state.flows
    .filter((flow) => normalizeFlowPageId(flow.pageId || normalizedPageId) === normalizedPageId)
    .filter((flow) => flow.status === "active" && hasPublishedFlow(flow));
}

function renderFlows() {
  const pageId = currentFlowPageId();
  if (flowStore.pageId !== pageId && !flowStore.loading) {
    loadFlowsForPage(pageId);
  }

  const filteredFlows = filterBySearch(state.flows, (flow) => `${flow.name} ${flow.goal} ${flow.trigger}`);
  if (!flowCanvasOpen) {
    renderFlowLibrary(filteredFlows);
    return;
  }

  const sourceFlow = selectedFlow();
  if (!sourceFlow) {
    flowCanvasOpen = false;
    workspace.innerHTML = emptyState("Nenhum fluxo", "Crie um fluxo do Messenger para começar.", "workflow", "Novo fluxo", "new-flow");
    return;
  }

  const viewingPublished = flowCanvasMode === "published" && hasPublishedFlow(sourceFlow);
  const flow = canvasDisplayFlow(sourceFlow);
  if (viewingPublished && !flowMetricState.loading && (flowMetricState.pageId !== pageId || flowMetricState.flowId !== sourceFlow.id)) {
    loadFlowMetrics(pageId, sourceFlow.id);
  }
  if (!viewingPublished) {
    ensureFlowUndoBaseline();
    pruneInvalidFlowConnections(flow);
  }

  const node = showInspector ? selectedNode(flow) : null;
  if (showInspector && node) selectedNodeId = node.id;
  const messageButtonOption = viewingPublished ? null : selectedMessageButtonOption(node);
  canvasZoom = clamp(canvasZoom, ZOOM_MIN, ZOOM_MAX);

  renderingCanvasMarkup = true;
  workspace.innerHTML = `
    <div class="page-grid canvas-focused ${showInspector ? "show-inspector" : ""} ${viewingPublished ? "published-view" : "edit-view"}">
      <section class="panel canvas-shell">
        <div class="canvas-toolbar">
          <div class="tight-stack">
            ${
              viewingPublished
                ? `<strong class="published-flow-name">${escapeHtml(flow.name)}</strong>`
                : `<input class="field-input" data-flow-field="name" value="${attr(flow.name)}" aria-label="Nome do fluxo" />`
            }
            <span class="muted">${escapeHtml(flow.goal)}</span>
          </div>
          ${statusBadge(sourceFlow, "flow-status-pill")}
          <span class="sync-pill ${flowStore.serverAvailable ? "synced" : "local"}">${escapeHtml(flowStore.loading ? "Carregando D1" : flowStore.status)}</span>
          <div class="canvas-panel-controls" aria-label="Painéis do canvas">
            <button class="secondary-button" type="button" data-action="back-to-flows">${icons.workflow}<span>Fluxos</span></button>
          </div>
          <div class="canvas-actions">
            ${
              viewingPublished
                ? `
                  <button class="secondary-button" type="button" data-action="refresh-flow-metrics" title="Atualizar métricas">${icons.refresh}<span>Atualizar</span></button>
                  <button class="primary-button edit-published-flow-button" type="button" data-action="edit-published-flow">${icons.edit}<span>Editar automação</span></button>
                `
                : `
                  ${renderPublishFlowButton(sourceFlow)}
                  <button class="icon-button canvas-file-button" type="button" data-action="export-flow-json" title="Exportar fluxo JSON" aria-label="Exportar fluxo JSON">${icons.upload}</button>
                  <button class="icon-button canvas-file-button" type="button" data-action="import-flow-json" title="Importar fluxo JSON" aria-label="Importar fluxo JSON">${icons.download}</button>
                  <button class="secondary-button" type="button" data-action="duplicate-flow">${icons.copy}<span>Duplicar</span></button>
                `
            }
            <input id="flowImportFile" type="file" accept="application/json,.json" hidden />
          </div>
          <div class="canvas-zoom" aria-label="Zoom do canvas">
            <button class="icon-button" type="button" data-action="canvas-zoom-out" title="Diminuir zoom">-</button>
            <button class="secondary-button" type="button" data-action="canvas-fit"><span>Ajustar</span></button>
            <span>${Math.round(canvasZoom * 100)}%</span>
            <button class="icon-button" type="button" data-action="canvas-zoom-in" title="Aumentar zoom">+</button>
          </div>
        </div>
        <button class="canvas-peek-button ${showInspector ? "active" : ""}" type="button" data-action="peek-inspector" data-tooltip="${showInspector ? "Fechar configurações" : "Mostrar configurações do bloco"}" aria-label="${showInspector ? "Fechar configurações" : "Mostrar configurações do bloco"}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="${showInspector ? "m9 18 6-6-6-6" : "m15 18-6-6 6-6"}" /></svg>
        </button>
        ${
          viewingPublished
            ? `<div class="published-view-banner">Você está visualizando uma versão publicada <button type="button" data-action="edit-published-flow">Editar</button></div>`
            : ""
        }
        <div class="flow-canvas" id="flowCanvas" style="--canvas-zoom:${canvasZoom}">
          <div class="canvas-world" style="width:${CANVAS_WIDTH * canvasZoom}px; height:${CANVAS_HEIGHT * canvasZoom}px">
            <div class="canvas-stage" style="width:${CANVAS_WIDTH}px; height:${CANVAS_HEIGHT}px">
              <svg class="connection-layer" viewBox="0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}" aria-hidden="true">
                ${renderConnections(flow)}
              </svg>
              ${flow.nodes.map((item) => renderNode(item, showInspector && item.id === node?.id)).join("")}
            </div>
          </div>
        </div>
        ${
          viewingPublished
            ? ""
            : `
              <div class="canvas-floating-tools" aria-label="Adicionar blocos">
                ${nodeAddButton("message", "Mensagem")}
                ${nodeAddButton("condition", "Condição")}
                ${nodeAddButton("user_input", "Aguardar resposta")}
                ${nodeAddButton("link_click_wait", "Aguardar link")}
                ${nodeAddButton("jump", "Selecionar passo")}
                ${nodeAddButton("delay", "Espera")}
                ${nodeAddButton("action", "Ação")}
              </div>
            `
        }
        <div class="canvas-minimap" id="canvasMinimap">
          ${renderMiniMapContent(flow)}
        </div>
        ${viewingPublished ? "" : renderCanvasAddMenu()}
      </section>

      <aside class="panel inspector flow-config-drawer ${!viewingPublished && messageButtonOption ? "has-drawer-header" : "no-drawer-header"} ${!viewingPublished && conditionPickerNodeId === node?.id ? "condition-picker-open" : ""}">
        ${
          !viewingPublished && messageButtonOption
            ? `
              <div class="flow-config-header compact">
                <strong>Editar botão</strong>
                <button class="icon-button" type="button" data-action="close-message-button-editor" title="Voltar para mensagem" aria-label="Voltar para mensagem">&larr;</button>
              </div>
            `
            : ""
        }
        <div class="panel-body stack ${!viewingPublished && messageButtonOption ? "with-drawer-header" : "without-drawer-header"}" data-inspector-scroll data-inspector-node-id="${attr(`${node?.id || ""}:${messageButtonOption?.id || ""}`)}">
          ${node ? (viewingPublished ? renderPublishedNodeMetrics(flow, node) : messageButtonOption ? renderMessageButtonEditor(flow, node, messageButtonOption) : renderInspector(flow, node)) : ""}
        </div>
      </aside>
      ${viewingPublished ? "" : renderTriggerPicker(flow)}
      ${viewingPublished ? "" : renderNextStepPicker(flow)}
      ${viewingPublished ? "" : renderActionPicker(flow)}
    </div>
  `;
  renderingCanvasMarkup = false;

  if (!viewingPublished) {
    enableNodeDragging(flow);
    enableConnectionDragging(flow);
    enableCanvasDoubleClickMenu();
  }
  enableCanvasPanning();
  enableCanvasWheelZoom();
  enableMiniMapNavigation();
  scheduleCanvasGeometryRefresh(flow);
  if (shouldAutoFitCanvas) {
    shouldAutoFitCanvas = false;
    requestAnimationFrame(() => fitCanvasToViewport());
  } else {
    requestAnimationFrame(() => {
      restoreCanvasScroll();
      updateLiveConnections(flow);
      updateMiniMapViewport();
    });
  }
}

function renderFlowLibrary(flows) {
  const pageLabel = state.settings.pageName || state.settings.pageId || "workspace atual";

  workspace.innerHTML = `
    <section class="panel flow-library-panel">
      <div class="panel-header">
        <div>
          <h2>Fluxos salvos</h2>
          <span>${escapeHtml(pageLabel)} - ${state.flows.length} fluxo${state.flows.length === 1 ? "" : "s"}</span>
        </div>
        <div class="button-row">
          <span class="sync-pill ${flowStore.serverAvailable ? "synced" : "local"}">${escapeHtml(flowStore.loading ? "Carregando D1" : flowStore.status)}</span>
          <button class="primary-button" type="button" data-action="new-flow">${icons.plus}<span>Novo fluxo</span></button>
        </div>
      </div>
      ${
        flows.length
          ? `<div class="flow-library">${flows.map((flow) => renderFlowCard(flow)).join("")}</div>`
          : `
            <div class="empty-state">
              ${icons.workflow}
              <strong>Nenhum fluxo encontrado</strong>
              <span>Crie um fluxo ou ajuste a busca para ver os fluxos salvos.</span>
              <button class="primary-button" type="button" data-action="new-flow">${icons.plus}<span>Novo fluxo</span></button>
            </div>
          `
      }
    </section>
  `;
}

function renderPublishFlowButton(flow) {
  const needsPublish = !hasPublishedFlow(flow) || Boolean(flow?.hasDraftChanges);
  if (needsPublish) {
    return `<button class="primary-button publish-flow-button" type="button" data-action="publish-flow">${icons.upload}<span>Publicar</span></button>`;
  }

  return `<button class="primary-button publish-flow-button published" type="button" disabled aria-disabled="true">${icons.check}<span>Publicado</span></button>`;
}

function renderFlowCard(flow) {
  const nodeCount = flow.nodes?.length || 0;
  const isActive = flow.status === "active" && hasPublishedFlow(flow);
  return `
    <article class="flow-card">
      <button class="flow-card-main" type="button" data-action="select-flow" data-id="${flow.id}">
        <span class="flow-card-head">
          <span class="flow-card-icon">${icons.workflow}</span>
          <span>
            <strong>${escapeHtml(flow.name)}</strong>
            <span>${escapeHtml(flow.trigger || "sem gatilho")}</span>
          </span>
          ${statusBadge(flow, "flow-card-status")}
        </span>
        <span class="flow-card-goal">${escapeHtml(flow.goal || "Sem descricao")}</span>
        <span class="flow-card-meta">
          <span>${nodeCount} bloco${nodeCount === 1 ? "" : "s"}</span>
          <span>Atualizado ${escapeHtml(formatDate(flow.updatedAt) || "agora")}</span>
        </span>
      </button>
      <div class="flow-card-actions">
        <button class="flow-switch ${isActive ? "on" : ""}" type="button" data-action="toggle-flow-active" data-id="${flow.id}" aria-pressed="${isActive ? "true" : "false"}" title="${isActive ? "Desligar fluxo" : "Ligar fluxo"}">
          <span class="flow-switch-track"><span></span></span>
          <span>${isActive ? "Ativo" : "Inativo"}</span>
        </button>
        <button class="icon-button" type="button" data-action="duplicate-flow-card" data-id="${flow.id}" title="Duplicar fluxo">${icons.copy}</button>
        <button class="icon-button danger-icon" type="button" data-action="delete-flow-card" data-id="${flow.id}" title="Excluir fluxo">${icons.trash}</button>
      </div>
    </article>
  `;
}

function renderCanvasAddMenu() {
  if (!canvasAddMenu) return "";
  return `
    <div class="canvas-add-menu" style="left:${canvasAddMenu.left}px; top:${canvasAddMenu.top}px" role="menu" aria-label="Adicionar bloco">
      ${canvasAddOptions
        .map(
          (option) => `
            <button type="button" data-action="add-node-at-menu" data-type="${attr(option.type)}">
              <span>+</span>
              <span>${escapeHtml(option.label)}</span>
            </button>
          `
        )
        .join("")}
      <button class="cancel" type="button" data-action="close-canvas-add-menu">Cancel</button>
    </div>
  `;
}

function renderInbox() {
  const pageContacts = contactsForPage(currentFlowPageId());
  if (shouldLoadContactsForCurrentPage()) loadContactsForPage(currentFlowPageId());
  const filtered = filterBySearch(pageContacts, contactSearchText);
  const contact = selectedContact() || filtered[0] || pageContacts[0];
  if (contact) selectedContactId = contact.id;

  workspace.innerHTML = `
    <div class="split-page">
      <section class="panel flat">
        <div class="panel-header">
          <div>
            <h2>Inbox da Página</h2>
            <span>Conversas vindas do Messenger</span>
          </div>
          <button class="icon-button" type="button" data-action="new-contact" title="Novo contato">${icons.plus}</button>
        </div>
        <div class="contact-list">
          ${filtered
            .map(
              (item) => `
                <button class="contact-item ${contact?.id === item.id ? "active" : ""}" type="button" data-action="select-contact" data-id="${item.id}">
                  <span class="avatar">${initials(item.name)}</span>
                  <span>
                    <span class="row-between"><strong>${escapeHtml(item.name)}</strong>${tagsMarkup(item)}</span>
                    <span>${escapeHtml(lastMessage(item)?.text || "Sem mensagens")}</span>
                  </span>
                </button>
              `
            )
            .join("") || emptyInline("Nenhum contato encontrado.")}
        </div>
      </section>

      <section class="panel chat-panel">
        ${
          contact
            ? `
          <div class="panel-header">
            <div class="row-between" style="width:100%">
              <div>
                <h2>${escapeHtml(contact.name)}</h2>
                <span>${escapeHtml(contact.psid)} · ${escapeHtml(contact.source)}</span>
              </div>
              <div class="button-row">
                ${tagsMarkup(contact)}
                <button class="secondary-button" type="button" data-action="run-contact-flow">${icons.play}<span>Aplicar fluxo</span></button>
                <button class="secondary-button" type="button" data-action="toggle-contact-status">${contact.status === "open" ? "Fechar" : "Reabrir"}</button>
              </div>
            </div>
          </div>
          <div class="conversation" id="conversation">
            ${renderLocalConversationMessages(contact.messages)}
          </div>
          <div class="composer">
            <textarea id="composerText" placeholder="Responder pelo Messenger"></textarea>
            <button class="secondary-button" type="button" data-action="insert-template">${icons.message}<span>Template</span></button>
            <button class="primary-button" type="button" data-action="send-contact-message">${icons.send}<span>Enviar</span></button>
          </div>
        `
            : emptyState("Sem conversa", "Crie ou selecione um assinante Messenger.", "inbox", "Novo contato", "new-contact")
        }
      </section>
    </div>
  `;

  const conversation = document.querySelector("#conversation");
  if (conversation) conversation.scrollTop = conversation.scrollHeight;
}

function renderSubscribersLegacy() {
  const currentPageId = currentFlowPageId();
  if (shouldLoadContactsForCurrentPage()) loadContactsForPage(currentPageId);

  const contacts = contactsForPage(currentPageId);
  const tags = allContactTags(contacts);
  const filtered = filterBySearch(contacts, contactSearchText).filter((contact) =>
    subscriberTagFilter ? contactHasTag(contact, subscriberTagFilter) : true
  );
  const pageName = selectedPageName(currentPageId);

  workspace.innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2>Assinantes Messenger</h2>
          <span>${filtered.length} contato${filtered.length === 1 ? "" : "s"} em ${escapeHtml(pageName || currentPageId)}</span>
        </div>
        <div class="button-row">
          <span class="sync-pill ${contactStore.serverAvailable ? "synced" : "local"}">${escapeHtml(contactStore.loading ? "Carregando D1" : contactStore.status)}</span>
          <button class="secondary-button" type="button" data-action="refresh-contacts">${icons.users}<span>Atualizar</span></button>
          <button class="secondary-button" type="button" data-action="export-csv">${icons.copy}<span>CSV</span></button>
          <button class="primary-button" type="button" data-action="new-contact">${icons.plus}<span>Novo</span></button>
        </div>
      </div>
      <div class="filter-bar">
        <div class="compact-filter readonly-filter">
          <span>Pagina selecionada</span>
          <strong>
            ${escapeHtml(pageName || currentPageId)}
            <small>${escapeHtml(currentPageId)}</small>
          </strong>
        </div>
        <label class="compact-filter">
          <span>Tag</span>
          <select id="subscriberTagFilter">
            <option value="" ${subscriberTagFilter ? "" : "selected"}>Todas as tags</option>
            ${tags.map((value) => `<option value="${attr(value)}" ${subscriberTagFilter === value ? "selected" : ""}>${escapeHtml(value)}</option>`).join("")}
          </select>
        </label>
        <div class="tag-filter-list">${tags.map((value) => `<span class="tag">${escapeHtml(value)}</span>`).join("") || `<span class="muted">Nenhuma tag nesta pagina.</span>`}</div>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>PSID</th>
              <th>Tags</th>
              <th>Campos</th>
              <th>Status</th>
              <th>Origem</th>
              <th>Última mensagem</th>
            </tr>
          </thead>
          <tbody>
            ${filtered
              .map(
                (contact) => `
                  <tr>
                    <td><strong>${escapeHtml(contact.name)}</strong></td>
                    <td>${escapeHtml(contact.psid)}</td>
                    <td>${renderContactTagEditor(contact)}</td>
                    <td>${renderContactCustomFields(contact)}</td>
                    <td>${contact.status === "open" ? "Aberta" : "Fechada"}</td>
                    <td>${escapeHtml(contact.source)}</td>
                    <td>${escapeHtml(lastMessage(contact)?.text || "-")}</td>
                  </tr>
                `
              )
              .join("") || `<tr><td colspan="7">${emptyInline("Nenhum contato neste filtro.")}</td></tr>`}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderSubscribers() {
  const currentPageId = currentFlowPageId();
  if (shouldLoadContactsForCurrentPage()) loadContactsForPage(currentPageId);
  if (customFieldStore.pageId !== currentPageId && !customFieldStore.loading) loadCustomFieldsForPage(currentPageId);

  const contacts = contactsForPage(currentPageId);
  const tags = allContactTags(contacts);
  const filtered = filterBySearch(contacts, contactSearchText).filter((contact) =>
    subscriberTagFilter ? contactHasTag(contact, subscriberTagFilter) : true
  );
  const pageName = selectedPageName(currentPageId);
  const selectedContact =
    filtered.find((contact) => contact.id === selectedContactId) ||
    contacts.find((contact) => contact.id === selectedContactId) ||
    filtered[0] ||
    contacts[0] ||
    null;

  if (selectedContact && selectedContactId !== selectedContact.id) selectedContactId = selectedContact.id;

  const openCount = contacts.filter((contact) => contact.status === "open").length;
  const fieldCount = customFieldRecordsForPage(currentPageId).length;
  const taggedCount = contacts.filter((contact) => contactTags(contact).length).length;

  workspace.innerHTML = `
    <div class="subscribers-layout">
      <section class="panel subscribers-main-panel">
        <div class="panel-header">
          <div>
            <h2>Assinantes Messenger</h2>
            <span>${filtered.length} de ${contacts.length} contato${contacts.length === 1 ? "" : "s"} em ${escapeHtml(pageName || currentPageId)}</span>
          </div>
          <div class="button-row">
            <span class="sync-pill ${contactStore.serverAvailable ? "synced" : "local"}">${escapeHtml(contactStore.loading ? "Carregando D1" : contactStore.status)}</span>
            <button class="secondary-button" type="button" data-action="refresh-contacts">${icons.users}<span>Atualizar</span></button>
            <button class="secondary-button" type="button" data-action="export-csv">${icons.copy}<span>CSV</span></button>
            <button class="primary-button" type="button" data-action="new-contact">${icons.plus}<span>Novo</span></button>
          </div>
        </div>
        <div class="subscriber-summary-strip">
          ${metricInline("Total", contacts.length)}
          ${metricInline("Abertos", openCount)}
          ${metricInline("Com tags", taggedCount)}
          ${metricInline("Campos", fieldCount)}
        </div>
        <div class="subscriber-toolbar">
          <div class="compact-filter readonly-filter">
            <span>Pagina selecionada</span>
            <strong>
              ${escapeHtml(pageName || currentPageId)}
              <small>${escapeHtml(currentPageId)}</small>
            </strong>
          </div>
          <label class="compact-filter">
            <span>Tag</span>
            <select id="subscriberTagFilter">
              <option value="" ${subscriberTagFilter ? "" : "selected"}>Todas as tags</option>
              ${tags.map((value) => `<option value="${attr(value)}" ${subscriberTagFilter === value ? "selected" : ""}>${escapeHtml(value)}</option>`).join("")}
            </select>
          </label>
          <div class="tag-filter-list">${tags.map((value) => `<span class="tag">${escapeHtml(value)}</span>`).join("") || `<span class="muted">Nenhuma tag nesta pagina.</span>`}</div>
        </div>
        <div class="subscriber-list" aria-label="Assinantes filtrados">
          ${filtered.length ? filtered.map((contact) => renderSubscriberListItem(contact, selectedContact?.id === contact.id)).join("") : emptyInline("Nenhum contato neste filtro.")}
        </div>
      </section>
      ${renderSubscriberDetailPanel(selectedContact, currentPageId)}
    </div>
  `;
}

function renderSubscriberListItem(contact, active = false) {
  const message = lastMessage(contact);
  const fieldTotal = Object.entries(contact?.customFields || {}).filter(([, value]) => value !== "" && value !== null && value !== undefined).length;
  return `
    <button class="subscriber-list-item ${active ? "active" : ""}" type="button" data-action="select-contact" data-id="${attr(contact.id)}">
      <span class="subscriber-avatar">${escapeHtml(initials(contact.name))}</span>
      <span class="subscriber-list-main">
        <span class="subscriber-list-title">
          <strong>${escapeHtml(contact.name)}</strong>
          <span class="badge ${contact.status === "open" ? "active" : "paused"}">${contact.status === "open" ? "Aberta" : "Fechada"}</span>
        </span>
        <span class="subscriber-list-meta">${escapeHtml(contact.source || "Messenger")} - ${escapeHtml(contact.psid)}</span>
        <span class="subscriber-list-message">${escapeHtml(message?.text || "Sem mensagem recente")}</span>
      </span>
      <span class="subscriber-list-side">
        ${tagsMarkup(contact)}
        <small>${fieldTotal} campo${fieldTotal === 1 ? "" : "s"}</small>
      </span>
    </button>
  `;
}

function renderSubscriberDetailPanel(contact, pageId) {
  if (!contact) {
    return `
      <aside class="panel subscriber-detail-panel">
        ${emptyState("Nenhum assinante", "Selecione ou crie um contato para editar os dados.", "users", "Novo contato", "new-contact")}
      </aside>
    `;
  }

  const message = lastMessage(contact);
  return `
    <aside class="panel subscriber-detail-panel">
      <div class="subscriber-detail-header">
        <span class="subscriber-detail-avatar">${escapeHtml(initials(contact.name))}</span>
        <div>
          <h2>${escapeHtml(contact.name)}</h2>
          <span>${escapeHtml(contact.psid)}</span>
        </div>
      </div>
      <div class="subscriber-detail-body">
        <div class="subscriber-edit-grid">
          <label class="settings-field">
            <span>Nome</span>
            <input type="text" value="${attr(contact.name)}" data-contact-profile-field="name" data-id="${attr(contact.id)}">
          </label>
          <label class="settings-field">
            <span>Status</span>
            <select data-contact-profile-field="status" data-id="${attr(contact.id)}">
              <option value="open" ${contact.status === "open" ? "selected" : ""}>Aberta</option>
              <option value="closed" ${contact.status === "closed" ? "selected" : ""}>Fechada</option>
            </select>
          </label>
          <label class="settings-field">
            <span>Origem</span>
            <input type="text" value="${attr(contact.source || "Messenger")}" data-contact-profile-field="source" data-id="${attr(contact.id)}">
          </label>
          <label class="settings-field">
            <span>Ultima atividade</span>
            <input type="text" value="${attr(formatDate(contact.lastSeen || message?.at) || "-")}" readonly>
          </label>
        </div>
        <section class="subscriber-detail-section">
          <div class="subscriber-section-title">
            <strong>Tags</strong>
            <span>${contactTags(contact).length || 0}</span>
          </div>
          ${renderContactTagEditor(contact)}
        </section>
        <section class="subscriber-detail-section">
          <div class="subscriber-section-title">
            <strong>Campos do usuario</strong>
            <button class="secondary-button" type="button" data-action="create-custom-field">${icons.plus}<span>Novo campo</span></button>
          </div>
          ${renderSubscriberCustomFieldEditor(contact, pageId)}
        </section>
      </div>
    </aside>
  `;
}

function renderSubscriberCustomFieldEditor(contact, pageId) {
  const rows = subscriberCustomFieldRows(contact, pageId);
  if (!rows.length) {
    return `<div class="subscriber-fields-empty">Nenhum campo criado nesta Pagina. Crie um campo para salvar dados do usuario.</div>`;
  }

  return `
    <div class="subscriber-field-list">
      ${rows.map((row) => renderSubscriberCustomFieldRow(contact, row)).join("")}
    </div>
  `;
}

function subscriberCustomFieldRows(contact, pageId) {
  const rows = [];
  const seen = new Set();
  const fields = customFieldRecordsForPage(pageId);
  const customFields = contact?.customFields && typeof contact.customFields === "object" ? contact.customFields : {};
  const customFieldsById = contact?.customFieldsById && typeof contact.customFieldsById === "object" ? contact.customFieldsById : {};

  fields.forEach((field) => {
    const name = field.name || "";
    const key = normalizeCustomFieldKey(name || field.id);
    if (!name || seen.has(key)) return;
    seen.add(key);
    rows.push({
      id: field.id || "",
      name,
      type: normalizeCustomFieldType(field.type),
      library: true,
      value: customFieldsById[field.id] ?? customFields[name] ?? ""
    });
  });

  Object.entries(customFields).forEach(([name, value]) => {
    const key = normalizeCustomFieldKey(name);
    if (!name || seen.has(key)) return;
    seen.add(key);
    rows.push({
      id: "",
      name,
      type: inferCustomFieldType(value),
      library: false,
      value
    });
  });

  return rows;
}

function renderSubscriberCustomFieldRow(contact, field) {
  return `
    <div class="subscriber-field-row">
      <span>
        <strong>${escapeHtml(field.name)}</strong>
        <small>${escapeHtml(customFieldTypeLabel(field.type))}${field.library ? "" : " - avulso"}</small>
      </span>
      ${subscriberCustomFieldControl(contact, field)}
      <button class="icon-button" type="button" data-action="clear-contact-custom-field" data-id="${attr(contact.id)}" data-field-id="${attr(field.id)}" data-field-name="${attr(field.name)}" title="Limpar campo">${icons.trash}</button>
    </div>
  `;
}

function subscriberCustomFieldControl(contact, field) {
  const commonAttrs = `data-contact-custom-field="true" data-id="${attr(contact.id)}" data-field-id="${attr(field.id)}" data-field-name="${attr(field.name)}" data-field-type="${attr(field.type)}"`;
  const value = customFieldInputValue(field.value, field.type);
  if (field.type === "boolean") {
    const boolValue = Boolean(field.value);
    return `
      <select ${commonAttrs}>
        <option value="true" ${boolValue ? "selected" : ""}>Sim</option>
        <option value="false" ${!boolValue ? "selected" : ""}>Nao</option>
      </select>
    `;
  }

  const type = field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "datetime" ? "datetime-local" : "text";
  return `<input type="${type}" value="${attr(value)}" ${commonAttrs}>`;
}

function customFieldInputValue(value, type = "text") {
  const fieldType = normalizeCustomFieldType(type);
  if (value === null || value === undefined) return "";
  if (fieldType === "datetime") {
    const text = String(value || "");
    const timestamp = Date.parse(text);
    if (!Number.isFinite(timestamp)) return text.slice(0, 16);
    return new Date(timestamp).toISOString().slice(0, 16);
  }
  if (fieldType === "date") return String(value || "").slice(0, 10);
  if (fieldType === "boolean") return value ? "true" : "false";
  return String(value ?? "");
}

function inferCustomFieldType(value) {
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number") return "number";
  return "text";
}

function renderContactCustomFields(contact) {
  const entries = Object.entries(contact?.customFields || {}).filter(([, value]) => value !== "" && value !== null && value !== undefined);
  if (!entries.length) return `<span class="muted">Nenhum</span>`;
  return `
    <div class="contact-custom-fields">
      ${entries
        .slice(0, 4)
        .map(([name, value]) => `<span class="contact-custom-field"><strong>${escapeHtml(name)}</strong><span>${escapeHtml(formatCustomFieldValue(value))}</span></span>`)
        .join("")}
      ${entries.length > 4 ? `<small>+${entries.length - 4}</small>` : ""}
    </div>
  `;
}

function formatCustomFieldValue(value) {
  if (typeof value === "boolean") return value ? "Sim" : "Nao";
  return String(value ?? "");
}

function coerceCustomFieldValue(value, type = "text") {
  const normalizedType = normalizeCustomFieldType(type);
  const text = String(value ?? "").trim();
  if (!text && normalizedType !== "text") return "";
  if (normalizedType === "number") {
    const number = Number(value);
    return Number.isFinite(number) ? number : text;
  }
  if (normalizedType === "boolean") return ["true", "1", "sim", "yes", "on"].includes(text.toLowerCase());
  if (normalizedType === "date") return /^\d{4}-\d{2}-\d{2}$/.test(String(value || "")) ? String(value) : "";
  if (normalizedType === "datetime") {
    const timestamp = Date.parse(String(value || ""));
    return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : "";
  }
  return String(value ?? "");
}

function renderBroadcasts() {
  if (!metaState.authChecked) {
    workspace.innerHTML = `
      <section class="panel">
        <div class="empty-state">
          ${icons.send}
          <strong>Verificando conexao com a Meta</strong>
          <span>O Broadcast usa as conversas reais das Paginas conectadas.</span>
        </div>
      </section>
    `;
    if (!metaState.loadingProfile) loadMetaProfile();
    return;
  }

  if (!metaState.profile) {
    workspace.innerHTML = `
      <section class="panel">
        <div class="empty-state">
          ${icons.plug}
          <strong>Conecte o Facebook</strong>
          <span>Entre com a conta que administra as Paginas para calcular quem esta apto.</span>
          <button class="primary-button" type="button" data-action="connect-facebook">${icons.plug}<span>Entrar com Facebook</span></button>
        </div>
      </section>
    `;
    return;
  }

  if (!metaState.pages) {
    workspace.innerHTML = `
      <section class="panel">
        <div class="empty-state">
          ${icons.pages}
          <strong>Carregando Paginas</strong>
          <span>Buscando as Paginas conectadas para calcular elegibilidade.</span>
        </div>
      </section>
    `;
    if (!metaState.loadingPages) loadMetaPages();
    return;
  }

  const pages = metaState.pages || [];
  if (pages.length && shouldLoadBroadcastConversations(pages)) {
    loadBroadcastConversations(pages);
  }

  const pageStats = pages.map(broadcastPageStats);
  const filteredCampaigns = filterBySearch(state.campaigns, (campaign) => `${campaign.name} ${campaign.audienceTag} ${campaign.message}`);
  const totalEligible = pageStats.reduce((total, item) => total + item.eligible.length, 0);
  const openContacts = pageStats.reduce((total, item) => total + item.recipients.length, 0);
  const outsideWindow = pageStats.reduce((total, item) => total + item.outsideWindow.length, 0);
  const loadingEligibility = pageStats.some((item) => item.loading);

  workspace.innerHTML = `
    <div class="two-column">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h2>Disparos Messenger</h2>
            <span>Contatos aptos por Pagina conectada</span>
          </div>
          <div class="button-row">
            <button class="secondary-button" type="button" data-action="refresh-broadcast-eligibility">${icons.inbox}<span>Atualizar aptos</span></button>
            <button class="primary-button" type="button" data-action="new-campaign">${icons.plus}<span>Novo disparo</span></button>
          </div>
        </div>
        <div class="broadcast-summary">
          <span>
            <strong>${loadingEligibility ? "..." : totalEligible}</strong>
            <span>Aptos agora</span>
          </span>
          <span>
            <strong>${loadingEligibility ? "..." : openContacts}</strong>
            <span>Conversas da Pagina</span>
          </span>
          <span>
            <strong>${loadingEligibility ? "..." : outsideWindow}</strong>
            <span>Fora da janela 24h</span>
          </span>
        </div>
        ${renderMissingTagFlowDispatcher(currentFlowPageId())}
        <div class="panel-body campaign-list">
          ${filteredCampaigns
            .map(
              (campaign) => {
                const audience = openContacts;
                const eligibleAudience = eligibleContactsForBroadcast(campaign.audienceTag).length;
                const eligiblePages = eligiblePagesForBroadcast(campaign.audienceTag);
                return `
                  <article class="campaign-item">
                    <div class="row-between">
                      <div>
                        <strong>${escapeHtml(campaign.name)}</strong>
                            <span>${eligibleAudience} apto${eligibleAudience === 1 ? "" : "s"} de ${audience} conversa${audience === 1 ? "" : "s"} da Pagina</span>
                      </div>
                      ${statusBadge(campaign.status)}
                    </div>
                    <div class="campaign-pages">${eligiblePages.length ? eligiblePages.map((page) => `<span class="channel-pill">${escapeHtml(page.name)}: ${page.count}</span>`).join("") : `<span class="muted">Nenhuma Pagina apta agora</span>`}</div>
                    <p class="muted">${escapeHtml(campaign.message)}</p>
                    <div class="progress"><span style="width:${campaign.sent ? Math.min(100, Math.round((campaign.delivered / Math.max(campaign.sent, 1)) * 100)) : 0}%"></span></div>
                    <div class="row-between">
                      <span>${campaign.sent} enviados · ${campaign.delivered} entregues · ${campaign.replies} respostas</span>
                      <div class="button-row">
                        <button class="secondary-button" type="button" data-action="launch-campaign" data-id="${campaign.id}" ${eligibleAudience ? "" : "disabled"}>${icons.send}<span>Simular envio</span></button>
                        <button class="danger-button" type="button" data-action="delete-campaign" data-id="${campaign.id}">${icons.trash}</button>
                      </div>
                    </div>
                  </article>
                `;
              }
            )
            .join("")}
        </div>
      </section>

      <aside class="panel">
        <div class="panel-header">
          <div>
            <h2>Elegibilidade por Pagina</h2>
            <span>${pages.length} Pagina${pages.length === 1 ? "" : "s"} conectada${pages.length === 1 ? "" : "s"}</span>
          </div>
        </div>
        <div class="panel-body stack broadcast-page-list">
          ${pageStats.length ? pageStats.map(renderBroadcastPageStat).join("") : emptyInline("Nenhuma Pagina conectada.")}
          <p class="muted">Aptos agora considera conversas da Pagina com PSID e interacao nas ultimas 24h. Essa conta e uma pre-checagem operacional; a politica final de envio continua sendo da Meta.</p>
        </div>
      </aside>
    </div>
  `;
}

function renderMissingTagFlowDispatcher(pageId = currentFlowPageId()) {
  const normalizedPageId = normalizeFlowPageId(pageId);
  if (flowStore.pageId !== normalizedPageId && !flowStore.loading) {
    loadFlowsForPage(normalizedPageId);
  }
  if (contactStore.pageId !== normalizedPageId && !contactStore.loading) {
    loadContactsForPage(normalizedPageId);
  }

  const flows = metaConversationRunnableFlows(normalizedPageId);
  const selectedFlowId = currentMissingTagFlowId(normalizedPageId, flows);
  const tags = manualMissingTagOptions(normalizedPageId);
  const selectedTag = currentMissingTagName(normalizedPageId, tags);
  const selectedLimit = currentMissingTagLimit();
  const previewCount = missingTagPreviewRecipients(normalizedPageId, selectedTag).length;
  const result = broadcastState.result;
  const error = broadcastState.error;

  return `
    <div class="manual-flow-dispatcher">
      <div>
        <strong>Disparo manual por tag ausente</strong>
        <span>Usa a Graph API para achar mensagens recentes e roda o fluxo somente em contatos sem a tag escolhida.</span>
      </div>
      <div class="manual-flow-grid">
        <label>
          <span>Fluxo</span>
          <select data-missing-tag-flow="true" ${broadcastState.running || !flows.length ? "disabled" : ""}>
            ${
              flows.length
                ? flows.map((flow) => `<option value="${attr(flow.id)}" ${flow.id === selectedFlowId ? "selected" : ""}>${escapeHtml(flow.name || "Fluxo sem nome")}</option>`).join("")
                : `<option value="">Nenhum fluxo ativo publicado</option>`
            }
          </select>
        </label>
        <label>
          <span>Enviar para quem nao tem a tag</span>
          <select data-missing-tag-name="true" ${broadcastState.running ? "disabled" : ""}>
            ${tags.map((tag) => `<option value="${attr(tag)}" ${tag === selectedTag ? "selected" : ""}>${escapeHtml(tag)}</option>`).join("")}
          </select>
        </label>
        <label>
          <span>Alcance</span>
          <select data-missing-tag-limit="true" ${broadcastState.running ? "disabled" : ""}>
            <option value="25" ${selectedLimit === "25" ? "selected" : ""}>25 conversas recentes</option>
            <option value="50" ${selectedLimit === "50" ? "selected" : ""}>50 conversas recentes</option>
            <option value="100" ${selectedLimit === "100" ? "selected" : ""}>100 conversas recentes</option>
            <option value="all" ${selectedLimit === "all" ? "selected" : ""}>Todos</option>
          </select>
        </label>
        <button class="primary-button" type="button" data-action="run-missing-tag-flow" ${broadcastState.running || !selectedFlowId || !selectedTag ? "disabled" : ""}>${icons.send}<span>${broadcastState.running ? "Enviando..." : "Enviar fluxo"}</span></button>
      </div>
      <p class="muted">${previewCount} conversa${previewCount === 1 ? "" : "s"} desta Pagina parecem estar sem essa tag e dentro da janela de 24h. O backend vai conferir novamente no D1 antes de enviar. Em Todos, ele pagina as conversas da Meta e usa uma trava de seguranca de ate 1000 conversas por execucao.</p>
      ${result ? `<div class="code-block">Escopo: ${result.scope === "all" ? "Todos" : "Limitado"} | Conversas Meta: ${result.scannedConversations || result.checked || 0}${result.partial ? " (parcial)" : ""} | Verificados: ${result.checked} | Disparados: ${result.triggered} | Ja tinham tag: ${result.skippedHasTag} | Fora 24h: ${result.skippedOutsideWindow} | Falhas: ${result.failed}</div>` : ""}
      ${error ? `<div class="code-block">${escapeHtml(error)}</div>` : ""}
    </div>
  `;
}

function currentMissingTagLimit() {
  const value = String(broadcastState.limit || "25").trim().toLowerCase();
  if (value === "all") return "all";
  if (["25", "50", "100"].includes(value)) return value;
  const number = Math.max(1, Math.min(200, Number(value) || 25));
  if (number <= 25) return "25";
  if (number <= 50) return "50";
  return "100";
}

function currentMissingTagFlowId(pageId = currentFlowPageId(), flows = metaConversationRunnableFlows(pageId)) {
  const stored = String(broadcastState.flowId || "").trim();
  if (stored && flows.some((flow) => flow.id === stored)) return stored;
  return flows[0]?.id || "";
}

function currentMissingTagName(pageId = currentFlowPageId(), tags = manualMissingTagOptions(pageId)) {
  const stored = normalizeTagName(broadcastState.missingTag || "");
  const match = tags.find((tag) => normalizeTagKey(tag) === normalizeTagKey(stored));
  return match || tags[0] || "NovoUsuario";
}

function manualMissingTagOptions(pageId = currentFlowPageId()) {
  return unique([
    broadcastState.missingTag,
    "NovoUsuario",
    ...tagRecordsForPage(pageId).map((tag) => tag.name),
    ...allContactTags(contactsForPage(pageId))
  ].map(normalizeTagName).filter(Boolean)).sort((a, b) => a.localeCompare(b));
}

function missingTagPreviewRecipients(pageId = currentFlowPageId(), tagName = "") {
  const page = metaState.pages?.find((item) => normalizeFlowPageId(item.id) === normalizeFlowPageId(pageId));
  const live = page ? broadcastPageStats(page).eligible : [];
  const local = contactsForPage(pageId).filter((contact) => isBroadcastEligible(contact));
  return uniqueRecipients([...live, ...local])
    .filter((contact) => !contactHasTag(contact, tagName));
}

function renderPixel() {
  const pageId = currentFlowPageId();
  const pageName = selectedPageName(pageId);
  if (pixelState.pageId !== pageId && !pixelState.loading) {
    loadPixelEventsForPage(pageId, { silent: true });
  }

  const summary = pixelState.summary || {};
  const visibleEvents = (pixelState.events || []).filter((event) => event.eventType !== "site_heartbeat");
  const events = filterBySearch(visibleEvents, (event) =>
    `${event.eventType} ${event.eventName} ${event.visitorId} ${event.path} ${event.url} ${event.targetUrl} ${event.targetText}`
  );
  const snippet = pixelInstallSnippet(pageId);

  workspace.innerHTML = `
    <div class="pixel-grid">
      <section class="panel pixel-install-panel">
        <div class="panel-header">
          <div>
            <h2>Pixel do site</h2>
            <span>Rastreia entradas no site e cliques em links para ${escapeHtml(pageName)}.</span>
          </div>
          <div class="panel-actions">
            <button class="secondary-button" type="button" data-action="refresh-pixel-events">${icons.refresh}<span>Atualizar</span></button>
            <button class="primary-button" type="button" data-action="copy-pixel-snippet">${icons.copy}<span>Copiar pixel</span></button>
          </div>
        </div>
        <div class="panel-body pixel-install-body">
          <pre class="code-block pixel-snippet">${escapeHtml(snippet)}</pre>
          <div class="pixel-hint-grid">
            <span>Instale antes de fechar a tag &lt;/head&gt; do seu site.</span>
            <span>O identificador do site e definido automaticamente pelo dominio onde o pixel foi instalado.</span>
            <span>O visitante e anonimo: o pixel identifica navegador/sessao, nao uma pessoa real sem login ou parametro externo.</span>
            <span>Cliques em links sao registrados automaticamente; outros eventos ficam disponiveis apenas em modo detalhado.</span>
          </div>
        </div>
      </section>

      <aside class="panel pixel-summary-panel">
        <div class="panel-header">
          <div>
            <h2>Resumo</h2>
            <span>Ultimos ${pixelState.rangeDays} dias</span>
          </div>
        </div>
        <div class="panel-body stack">
          <div class="pixel-range-row">
            ${[1, 7, 30].map((days) => `<button class="secondary-button ${pixelState.rangeDays === days ? "active" : ""}" type="button" data-action="set-pixel-range" data-days="${days}">${days}d</button>`).join("")}
          </div>
          ${renderPixelMetric("Eventos", summary.totalEvents || 0)}
          ${renderPixelMetric("Visitantes", summary.visitors || 0)}
          ${renderPixelMetric("Paginas vistas", summary.pageViews || 0)}
          ${renderPixelMetric("Cliques em links", summary.linkClicks || 0)}
        </div>
      </aside>

      <section class="panel pixel-wide-panel">
        <div class="panel-header">
          <div>
            <h2>Links mais clicados</h2>
            <span>Os links que mais receberam clique no site.</span>
          </div>
        </div>
        <div class="panel-body pixel-top-list">
          ${(summary.topLinks || []).length ? summary.topLinks.map(renderPixelTopLink).join("") : emptyInline("Nenhum clique em link registrado ainda.")}
        </div>
      </section>

      <section class="panel pixel-wide-panel">
        <div class="panel-header">
          <div>
            <h2>Eventos recentes</h2>
            <span>${pixelState.loading ? "Carregando..." : `${events.length} evento${events.length === 1 ? "" : "s"}`}</span>
          </div>
        </div>
        <div class="panel-body">
          ${pixelState.error ? `<div class="modal-error">${escapeHtml(pixelState.error)}</div>` : ""}
          ${renderPixelEvents(events)}
        </div>
      </section>
    </div>
  `;
}

function renderPixelMetric(label, value) {
  return `
    <div class="setting-metric-inline">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function renderPixelTopLink(item) {
  return `
    <article class="pixel-top-row">
      <div>
        <strong>${escapeHtml(item.text || item.url || "Link")}</strong>
        <span>${escapeHtml(item.url || "")}</span>
      </div>
      <div>
        <strong>${escapeHtml(item.clicks || 0)}</strong>
        <span>${escapeHtml(item.visitors || 0)} visitante${Number(item.visitors || 0) === 1 ? "" : "s"}</span>
      </div>
    </article>
  `;
}

function renderPixelEvents(events) {
  if (pixelState.loading && !events.length) return `<div class="empty-state">Carregando eventos do pixel...</div>`;
  if (!events.length) return emptyInline("Nenhum evento encontrado neste periodo.");

  return `
    <div class="pixel-event-list">
      ${events.map(renderPixelEventRow).join("")}
    </div>
  `;
}

function renderPixelEventRow(event) {
  if (event.eventType === "page_view") return renderPixelSiteEntryBubble(event);

  const title = event.targetText || event.eventName || event.title || event.path || event.eventType;
  const detail = event.targetUrl || event.url || event.path || "";
  return `
    <article class="pixel-event-row">
      <div class="pixel-event-type">
        <span class="badge ${event.eventType === "link_click" ? "active" : ""}">${escapeHtml(pixelEventLabel(event.eventType))}</span>
      </div>
      <div class="pixel-event-main">
        <strong>${escapeHtml(title)}</strong>
        <span>${escapeHtml(detail)}</span>
        ${renderPixelEventTrackingMeta(event)}
        ${renderPixelContactLinkBadge(event)}
      </div>
      <div class="pixel-event-meta">
        <span>${escapeHtml(shortVisitorId(event.visitorId))}</span>
        <span>${escapeHtml(event.country || "")}</span>
        <span>${escapeHtml(formatDate(event.createdAt) || event.createdAt || "")}</span>
      </div>
    </article>
  `;
}

function renderPixelSiteEntryBubble(event) {
  const visitor = shortVisitorId(event.visitorId);
  const page = event.path || event.url || "site";
  const time = formatDate(event.createdAt) || event.createdAt || "";
  return `
    <article class="pixel-site-entry-bubble">
      <span>${icons.pixel}</span>
      <strong>${escapeHtml(event.contactPsid ? "Contato Messenger" : visitor)} entrou no site</strong>
      <small>${escapeHtml(page)}${time ? ` - ${escapeHtml(time)}` : ""}</small>
      ${renderPixelEventTrackingMeta(event)}
      ${renderPixelContactLinkBadge(event)}
    </article>
  `;
}

function renderPixelEventTrackingMeta(event) {
  const meta = pixelConversationMeta(event);
  if (!meta.length) return "";
  return `<small class="pixel-event-tracking-meta">${meta.map(escapeHtml).join(" · ")}</small>`;
}

function renderPixelContactLinkBadge(event) {
  if (!event.contactPsid) return `<small class="pixel-link-status anonymous">Anonimo</small>`;
  return `<small class="pixel-link-status linked">Vinculado ao Messenger</small>`;
}

function pixelEventLabel(type) {
  return {
    page_view: "Pagina",
    link_click: "Link",
    messenger_button_click: "Messenger",
    element_click: "Clique",
    form_submit: "Formulario",
    identify: "Identificacao",
    site_heartbeat: "Ativo",
    site_exit: "Saiu",
    site_active: "Ativo",
    site_inactive: "Inativo",
    custom: "Evento"
  }[type] || type || "Evento";
}

function shortVisitorId(value) {
  const id = String(value || "");
  return id.length > 18 ? `${id.slice(0, 10)}...${id.slice(-4)}` : id || "visitante";
}

function pixelInstallSnippet(pageId = currentFlowPageId()) {
  const origin = location.origin === "null" ? "https://messenlead.pages.dev" : location.origin;
  const scriptUrl = `${origin}/api/pixel/script?pageId=${encodeURIComponent(normalizeFlowPageId(pageId))}&v=5`;
  return `<script async src="${scriptUrl}"></script>`;
}

function renderJsonTemplates() {
  const pageId = currentFlowPageId();
  const pageName = selectedPageName(pageId);
  const hasCurrentPageData = jsonTemplateState.pageId === pageId;
  const templates = filterBySearch(hasCurrentPageData ? jsonTemplateState.templates : [], (template) =>
    `${template.name} ${template.description} ${template.jsonText}`
  );

  if (!hasCurrentPageData && !jsonTemplateState.loading) {
    loadJsonTemplatesForPage(pageId, { silent: true });
  }

  workspace.innerHTML = `
    <div class="json-template-grid">
      <section class="panel json-template-library-panel">
        <div class="panel-header">
          <div>
            <h2>JSON Templates</h2>
            <span>Templates reutilizaveis da Pagina ${escapeHtml(pageName)}.</span>
          </div>
          <div class="panel-actions">
            <button class="secondary-button" type="button" data-action="refresh-json-templates">${icons.refresh}<span>Atualizar</span></button>
            <button class="secondary-button" type="button" data-action="create-default-json-template">${icons.plus}<span>Template inicial</span></button>
            <button class="primary-button" type="button" data-action="create-json-template">${icons.plus}<span>Novo template</span></button>
          </div>
        </div>
        <div class="panel-body json-template-list">
          ${jsonTemplateState.error ? `<div class="modal-error">${escapeHtml(jsonTemplateState.error)}</div>` : ""}
          ${
            jsonTemplateState.loading && !templates.length
              ? `<div class="empty-state">Carregando JSON Templates...</div>`
              : templates.length
                ? templates.map(renderJsonTemplateCard).join("")
                : emptyInline("Nenhum JSON Template salvo nesta Pagina.")
          }
        </div>
      </section>

      <aside class="panel json-template-help-panel">
        <div class="panel-header">
          <div>
            <h2>Uso</h2>
            <span>Biblioteca vinculada a Pagina selecionada</span>
          </div>
        </div>
        <div class="panel-body stack">
          ${metricInline("Templates", hasCurrentPageData ? jsonTemplateState.templates.length : 0)}
          <p class="muted">Use Template inicial para gerar o JSON generico de entrada Click-to-Messenger. O mesmo JSON pode ser reutilizado nos anuncios de qualquer Pagina conectada.</p>
          <p class="muted">A biblioteca continua organizada por Pagina. Alterar um template aqui nao modifica anuncios que ja foram publicados na Meta.</p>
        </div>
      </aside>
    </div>
  `;
}

function renderJsonTemplateCard(template) {
  return `
    <article class="json-template-card">
      <div class="json-template-card-header">
        <div>
          <strong>${escapeHtml(template.name || "Template sem nome")}</strong>
          <span>${escapeHtml(template.description || "Sem descricao")}</span>
          <small>Atualizado em ${escapeHtml(formatDate(template.updatedAt) || template.updatedAt || "-")}</small>
        </div>
        <div class="panel-actions">
          <button class="secondary-button" type="button" data-action="copy-json-template" data-id="${attr(template.id)}" title="Copiar JSON">${icons.copy}<span>Copiar</span></button>
          <button class="secondary-button" type="button" data-action="edit-json-template" data-id="${attr(template.id)}" title="Editar template">${icons.edit}<span>Editar</span></button>
          <button class="icon-button danger" type="button" data-action="delete-json-template" data-id="${attr(template.id)}" title="Excluir template">${icons.trash}</button>
        </div>
      </div>
      <pre class="code-block json-template-code">${escapeHtml(template.jsonText || "{}")}</pre>
    </article>
  `;
}

function renderOrigins() {
  if (!metaState.authChecked) {
    workspace.innerHTML = `
      <section class="panel">
        <div class="empty-state">
          ${icons.pixel}
          <strong>Verificando conexao com a Meta</strong>
          <span>O painel vai carregar as origens registradas para sua conta.</span>
        </div>
      </section>
    `;
    if (!metaState.loadingProfile) loadMetaProfile();
    return;
  }

  if (!metaState.profile) {
    workspace.innerHTML = `
      <section class="panel">
        <div class="panel-header">
          <div>
            <h2>Consultar origens</h2>
            <span>Entre com Facebook para consultar as chaves curtas registradas.</span>
          </div>
        </div>
        <div class="panel-body">
          <button class="primary-button" type="button" data-action="connect-facebook">${icons.plug}<span>Entrar com Facebook</span></button>
        </div>
      </section>
    `;
    return;
  }

  if (!metaState.pages) {
    workspace.innerHTML = `
      <section class="panel">
        <div class="empty-state">
          ${icons.pages}
          <strong>Carregando Paginas</strong>
          <span>Atualizando as Paginas vinculadas antes de consultar as origens.</span>
        </div>
      </section>
    `;
    if (!metaState.loadingPages) loadMetaPages();
    return;
  }

  if ((!attributionSourceState.initialized || attributionSourceState.query !== searchQuery) && !attributionSourceState.loading) {
    loadAttributionSources({ query: searchQuery, silent: true });
  }

  const sources = filterBySearch(attributionSourceState.sources, originSourceSearchText);
  const totalEntries = sources.reduce((sum, source) => sum + Number(source.entries || 0), 0);
  const totalContacts = sources.reduce((sum, source) => sum + Number(source.contacts || 0), 0);

  workspace.innerHTML = `
    <section class="panel origins-panel">
      <div class="panel-header">
        <div>
          <h2>Origens dos anuncios</h2>
          <span>Consulte qual Pagina e anuncio correspondem a uma chave curta como src_1lcurop1u8.</span>
        </div>
        <button class="secondary-button" type="button" data-action="refresh-origin-sources">${icons.refresh}<span>Atualizar</span></button>
      </div>
      <div class="origins-summary">
        ${metricInline("Origens encontradas", sources.length)}
        ${metricInline("Contatos vinculados", totalContacts)}
        ${metricInline("Entradas registradas", totalEntries)}
      </div>
      <div class="origins-search-hint">
        ${icons.pixel}
        <span>Use a busca superior para localizar por <strong>src_...</strong>, ID do anuncio, titulo ou Pagina.</span>
      </div>
      ${attributionSourceState.error ? `<div class="modal-error origins-error">${escapeHtml(attributionSourceState.error)}</div>` : ""}
      <div class="table-wrap">
        <table class="data-table origins-table">
          <thead>
            <tr>
              <th>Chave curta</th>
              <th>Pagina</th>
              <th>Anuncio</th>
              <th>Contatos</th>
              <th>Entradas</th>
              <th>Ultima entrada</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${
              attributionSourceState.loading && !sources.length
                ? `<tr><td colspan="7">Carregando origens...</td></tr>`
                : sources.length
                  ? sources.map(renderOriginSourceRow).join("")
                  : `<tr><td colspan="7">Nenhuma origem encontrada.</td></tr>`
            }
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderOriginSourceRow(source) {
  return `
    <tr>
      <td><code class="origin-source-key">${escapeHtml(source.sourceKey || "-")}</code></td>
      <td>
        <strong>${escapeHtml(source.pageName || "Pagina sem nome")}</strong>
        <small class="origin-table-detail">${escapeHtml(source.pageId || "-")}</small>
      </td>
      <td>
        <strong>${escapeHtml(source.adTitle || "Anuncio sem titulo retornado pela Meta")}</strong>
        <small class="origin-table-detail">Ad ID: ${escapeHtml(source.adId || "-")}</small>
      </td>
      <td>${Number(source.contacts || 0)}</td>
      <td>${Number(source.entries || 0)}</td>
      <td>${escapeHtml(formatDate(source.lastSeenAt) || "-")}</td>
      <td>
        <div class="origin-table-actions">
          <button class="icon-button" type="button" data-action="copy-origin-key" data-value="${attr(source.sourceKey || "")}" title="Copiar chave curta">${icons.copy}</button>
          <button class="icon-button" type="button" data-action="copy-origin-ad-id" data-value="${attr(source.adId || "")}" title="Copiar ID do anuncio">${icons.pages}</button>
        </div>
      </td>
    </tr>
  `;
}

function originSourceSearchText(source) {
  return `${source.sourceKey || ""} ${source.pageName || ""} ${source.pageId || ""} ${source.adTitle || ""} ${source.adId || ""}`;
}

function safeTrackingToken(value) {
  return String(value || "default")
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100) || "default";
}

function renderMediaLibrary() {
  const pageId = currentFlowPageId();
  const pageName = selectedPageName(pageId);
  if (mediaState.pageId !== pageId && !mediaState.loading) {
    loadMediaAssetsForPage(pageId, { silent: true });
  }

  const assets = filterBySearch(mediaState.assets || [], (asset) =>
    `${asset.kind} ${asset.fileName} ${asset.originalName} ${asset.url}`
  );
  const imageAssets = assets.filter((asset) => asset.kind === "image");
  const audioAssets = assets.filter((asset) => asset.kind === "audio");
  const videoAssets = assets.filter((asset) => asset.kind === "video");

  workspace.innerHTML = `
    <div class="media-library-grid">
      <section class="panel media-upload-panel">
        <div class="panel-header">
          <div>
            <h2>Biblioteca de mídia</h2>
            <span>Uploads permanentes para usar nos fluxos de ${escapeHtml(pageName)}.</span>
          </div>
          <div class="panel-actions">
            <button class="secondary-button" type="button" data-action="refresh-media-assets">${icons.refresh}<span>Atualizar</span></button>
          </div>
        </div>
        <div class="panel-body image-tool-body">
          <input id="mediaImageUpload" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/*" hidden />
          <input id="mediaAudioUpload" type="file" accept="audio/mpeg,.mp3" hidden />
          <input id="mediaVideoUpload" type="file" accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov" hidden />
          <div class="media-upload-grid">
            <button class="image-dropzone media-upload-card" type="button" data-action="choose-media-image" ${mediaState.uploading ? "disabled" : ""}>
              ${icons.image}
              <strong>Upar imagem</strong>
              <span>JPG, PNG, WebP ou GIF. Ideal para cards e mensagens com imagem.</span>
            </button>
            <button class="image-dropzone media-upload-card" type="button" data-action="choose-media-audio" ${mediaState.uploading ? "disabled" : ""}>
              ${icons.send}
              <strong>Upar áudio MP3</strong>
              <span>Arquivo .mp3 público e permanente para enviar no Messenger.</span>
            </button>
            <button class="image-dropzone media-upload-card" type="button" data-action="choose-media-video" ${mediaState.uploading ? "disabled" : ""}>
              ${icons.video}
              <strong>Upar video</strong>
              <span>MP4 recomendado para envio no Messenger. WebM e MOV ficam salvos como midia.</span>
            </button>
          </div>
          ${mediaState.uploading ? `<div class="video-progress"><span>Enviando para R2...</span><div><i style="width:66%"></i></div></div>` : ""}
          ${mediaState.error ? `<div class="modal-error">${escapeHtml(mediaState.error)}</div>` : ""}
          <p class="muted">Para funcionar no Messenger, o arquivo precisa ser acessível publicamente. Configure o binding R2 <code>MEDIA_BUCKET</code>; se não houver domínio público do R2, o Messenlead entrega os arquivos por <code>/media/arquivo.ext</code>.</p>
        </div>
      </section>

      <section class="panel media-assets-panel">
        <div class="panel-header">
          <div>
            <h2>Videos</h2>
            <span>${videoAssets.length} arquivo${videoAssets.length === 1 ? "" : "s"}</span>
          </div>
        </div>
        <div class="panel-body media-asset-list">
          ${mediaState.loading && !videoAssets.length ? `<div class="empty-state">Carregando midia...</div>` : videoAssets.length ? videoAssets.map(renderMediaAssetCard).join("") : emptyInline("Nenhum video enviado ainda.")}
        </div>
      </section>

      <section class="panel media-assets-panel">
        <div class="panel-header">
          <div>
            <h2>Áudios MP3</h2>
            <span>${audioAssets.length} arquivo${audioAssets.length === 1 ? "" : "s"}</span>
          </div>
        </div>
        <div class="panel-body media-asset-list">
          ${mediaState.loading && !audioAssets.length ? `<div class="empty-state">Carregando mídia...</div>` : audioAssets.length ? audioAssets.map(renderMediaAssetCard).join("") : emptyInline("Nenhum áudio enviado ainda.")}
        </div>
      </section>

      <section class="panel media-assets-panel">
        <div class="panel-header">
          <div>
            <h2>Imagens</h2>
            <span>${imageAssets.length} arquivo${imageAssets.length === 1 ? "" : "s"}</span>
          </div>
        </div>
        <div class="panel-body media-asset-list media-image-list">
          ${mediaState.loading && !imageAssets.length ? `<div class="empty-state">Carregando mídia...</div>` : imageAssets.length ? imageAssets.map(renderMediaAssetCard).join("") : emptyInline("Nenhuma imagem enviada ainda.")}
        </div>
      </section>
    </div>
  `;
}

function renderMediaAssetCard(asset) {
  const isImage = asset.kind === "image";
  const isVideo = asset.kind === "video";
  return `
    <article class="media-asset-card">
      <div class="media-asset-preview ${isImage ? "image" : isVideo ? "video" : "audio"}">
        ${
          isImage
            ? `<img src="${attr(asset.url)}" alt="${attr(asset.originalName || asset.fileName)}" loading="lazy" />`
            : isVideo
              ? `<video src="${attr(asset.url)}" controls playsinline preload="metadata"></video>`
            : `<audio src="${attr(asset.url)}" controls preload="metadata"></audio>`
        }
      </div>
      <div class="media-asset-main">
        <strong>${escapeHtml(asset.originalName || asset.fileName)}</strong>
        <span>${escapeHtml(asset.fileName)} - ${formatBytes(asset.size || 0)} - ${escapeHtml(asset.contentType || "")}</span>
        <code>${escapeHtml(asset.url)}</code>
        <small>${escapeHtml(formatDate(asset.createdAt) || asset.createdAt || "")}</small>
      </div>
      <div class="media-asset-actions">
        <button class="secondary-button" type="button" data-action="copy-media-url" data-id="${attr(asset.id)}">${icons.copy}<span>URL</span></button>
        <button class="secondary-button" type="button" data-action="insert-media-in-message" data-id="${attr(asset.id)}">${icons.plus}<span>Usar no node</span></button>
        <button class="icon-button danger" type="button" data-action="delete-media-asset" data-id="${attr(asset.id)}" title="Excluir">${icons.trash}</button>
      </div>
    </article>
  `;
}

function renderImageTool() {
  const original = imageToolState.original;
  const cleaned = imageToolState.cleaned;
  const savedBytes = original && cleaned ? Math.max(0, original.size - cleaned.size) : 0;

  workspace.innerHTML = `
    <section class="panel image-tool-panel">
      <div class="panel-header">
        <div>
          <h2>Limpar metadados de imagem</h2>
          <span>Remove EXIF/metadados reexportando a imagem no navegador</span>
        </div>
        <div class="button-row">
          <button class="secondary-button" type="button" data-action="choose-image">${icons.image}<span>Escolher imagem</span></button>
          ${cleaned ? `<button class="primary-button" type="button" data-action="download-clean-image">${icons.send}<span>Baixar limpa</span></button>` : ""}
          ${original ? `<button class="secondary-button" type="button" data-action="clear-image-tool">${icons.trash}<span>Limpar</span></button>` : ""}
        </div>
      </div>

      <input id="imageUpload" type="file" accept="image/jpeg,image/png,image/webp,image/*" hidden />

      <div class="panel-body image-tool-body">
        ${
          original
            ? `
              <div class="image-preview-grid">
                ${renderImagePreviewCard("Original", original)}
                ${cleaned ? renderImagePreviewCard("Sem metadados", cleaned) : renderImageProcessingCard()}
              </div>
              <div class="image-result-bar">
                <span><strong>${cleaned ? formatBytes(savedBytes) : "-"}</strong><span>economia estimada</span></span>
                <span><strong>${cleaned ? outputTypeLabel(cleaned.type) : "-"}</strong><span>formato de saida</span></span>
                <span><strong>${cleaned ? `${cleaned.width}x${cleaned.height}` : "-"}</strong><span>dimensoes</span></span>
              </div>
            `
            : `
              <label class="image-dropzone" for="imageUpload">
                ${icons.image}
                <strong>Solte ou selecione uma imagem</strong>
                <span>JPG, PNG e WebP sao processados localmente. A imagem nao sai do seu navegador.</span>
              </label>
            `
        }
        ${imageToolState.error ? `<div class="modal-error">${escapeHtml(imageToolState.error)}</div>` : ""}
        <p class="muted">A limpeza e feita desenhando a imagem em um canvas e exportando um novo arquivo. Isso remove metadados como camera, geolocalizacao e EXIF do arquivo original.</p>
      </div>
    </section>
  `;
}

function renderImagePreviewCard(title, image) {
  return `
    <article class="image-preview-card">
      <div class="image-preview-frame">
        <img src="${attr(image.url)}" alt="${attr(title)}" />
      </div>
      <div class="image-preview-meta">
        <strong>${escapeHtml(title)}</strong>
        <span>${escapeHtml(image.name)}</span>
        <span>${formatBytes(image.size)} - ${outputTypeLabel(image.type)} - ${image.width}x${image.height}</span>
      </div>
    </article>
  `;
}

function renderImageProcessingCard() {
  return `
    <article class="image-preview-card">
      <div class="image-preview-frame empty">
        ${icons.image}
        <span>${imageToolState.processing ? "Limpando..." : "Aguardando processamento"}</span>
      </div>
      <div class="image-preview-meta">
        <strong>Sem metadados</strong>
        <span>Novo arquivo sera gerado aqui.</span>
      </div>
    </article>
  `;
}

function renderVideoTool() {
  const { video, audio, output, processing, progress, mode } = videoToolState;
  const canProcess = video && audio && !processing;

  workspace.innerHTML = `
    <section class="panel image-tool-panel video-tool-panel">
      <div class="panel-header">
        <div>
          <h2>Trocar áudio de vídeo</h2>
          <span>Processamento local no navegador, com saída em WebM</span>
        </div>
        <div class="button-row">
          <button class="secondary-button" type="button" data-action="choose-video">${icons.video}<span>Vídeo</span></button>
          <button class="secondary-button" type="button" data-action="choose-audio">${icons.send}<span>Áudio</span></button>
          <button class="primary-button" type="button" data-action="process-video-audio" ${canProcess ? "" : "disabled"}>${icons.play}<span>${processing ? "Processando" : "Gerar"}</span></button>
          ${output ? `<button class="primary-button" type="button" data-action="download-video-output">${icons.send}<span>Baixar</span></button>` : ""}
          ${video || audio || output ? `<button class="secondary-button" type="button" data-action="clear-video-tool">${icons.trash}<span>Limpar</span></button>` : ""}
        </div>
      </div>

      <input id="videoUpload" type="file" accept="video/*" hidden />
      <input id="audioUpload" type="file" accept="audio/*" hidden />

      <div class="panel-body image-tool-body">
        <div class="video-tool-grid">
          ${video ? renderVideoSourceCard(video) : renderVideoDropzone("videoUpload", "Vídeo", "Selecione ou solte o vídeo base.", icons.video)}
          ${audio ? renderAudioSourceCard(audio) : renderVideoDropzone("audioUpload", "Áudio", "Selecione o áudio que será usado.", icons.send)}
        </div>

        <div class="video-control-panel">
          <label class="settings-field">
            <span>Modo</span>
            <select data-video-field="mode">
              <option value="replace" ${mode === "replace" ? "selected" : ""}>Substituir áudio original</option>
              <option value="overlay" ${mode === "overlay" ? "selected" : ""}>Sobrepor ao áudio original</option>
            </select>
          </label>
          <label class="settings-field">
            <span>Volume do áudio original</span>
            <input type="range" min="0" max="1" step="0.05" data-video-field="originalVolume" value="${attr(videoToolState.originalVolume)}" ${mode === "replace" ? "disabled" : ""} />
          </label>
          <label class="settings-field">
            <span>Volume do novo áudio</span>
            <input type="range" min="0" max="2" step="0.05" data-video-field="audioVolume" value="${attr(videoToolState.audioVolume)}" />
          </label>
          <label class="toggle-row">
            <input type="checkbox" data-video-field="loopAudio" ${videoToolState.loopAudio ? "checked" : ""} />
            <span>Repetir áudio se terminar antes do vídeo</span>
          </label>
        </div>

        ${processing ? renderVideoProgress(progress) : ""}
        ${output ? renderVideoOutputCard(output) : ""}
        ${videoToolState.error ? `<div class="modal-error">${escapeHtml(videoToolState.error)}</div>` : ""}
        <p class="muted">A exportação usa MediaRecorder do navegador. O arquivo final sai em WebM com áudio Opus; para MP4 seria necessário FFmpeg no backend ou ffmpeg.wasm.</p>
      </div>
    </section>
  `;
}

function renderVideoDropzone(inputId, title, text, icon) {
  return `
    <label class="image-dropzone video-dropzone" for="${attr(inputId)}">
      ${icon}
      <strong>${escapeHtml(title)}</strong>
      <span>${escapeHtml(text)}</span>
    </label>
  `;
}

function renderVideoSourceCard(video) {
  return `
    <article class="image-preview-card video-source-card">
      <div class="image-preview-frame video-preview-frame">
        <video src="${attr(video.url)}" controls playsinline preload="metadata"></video>
      </div>
      <div class="image-preview-meta">
        <strong>Vídeo base</strong>
        <span>${escapeHtml(video.name)}</span>
        <span>${formatBytes(video.size)} - ${escapeHtml(video.type || "video")} - ${formatDuration(video.duration)}</span>
      </div>
    </article>
  `;
}

function renderAudioSourceCard(audio) {
  return `
    <article class="image-preview-card video-source-card">
      <div class="audio-preview-frame">
        ${icons.send}
        <audio src="${attr(audio.url)}" controls preload="metadata"></audio>
      </div>
      <div class="image-preview-meta">
        <strong>Áudio selecionado</strong>
        <span>${escapeHtml(audio.name)}</span>
        <span>${formatBytes(audio.size)} - ${escapeHtml(audio.type || "audio")} - ${formatDuration(audio.duration)}</span>
      </div>
    </article>
  `;
}

function renderVideoProgress(progress) {
  return `
    <div class="video-progress" id="videoProgress">
      <span>Processando ${Math.round(progress || 0)}%</span>
      <div><i style="width:${Math.max(2, Math.min(100, Number(progress) || 0))}%"></i></div>
    </div>
  `;
}

function renderVideoOutputCard(output) {
  return `
    <article class="image-preview-card video-output-card">
      <div class="image-preview-frame video-preview-frame">
        <video src="${attr(output.url)}" controls playsinline preload="metadata"></video>
      </div>
      <div class="image-preview-meta">
        <strong>Resultado</strong>
        <span>${escapeHtml(output.name)}</span>
        <span>${formatBytes(output.size)} - WEBM - ${formatDuration(output.duration)}</span>
      </div>
    </article>
  `;
}

function renderSetup() {
  const flowJson = JSON.stringify({ flows: state.flows }, null, 2);
  const pageId = currentFlowPageId();
  const currentPage = metaState.pages.find((page) => page.id === pageId);
  const pageName = currentPage?.name || state.settings.pageName || state.settings.pageId || "Pagina atual";

  workspace.innerHTML = `
    <div class="settings-grid">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h2>Conectar Facebook Messenger</h2>
            <span>Cloudflare Pages + Pages Functions + Meta Webhooks</span>
          </div>
          <span class="badge">Messenger-only</span>
        </div>
        <div class="panel-body stack">
          <div class="integration-grid">
            ${integrationCard("Webhook", "Configure esta URL no app da Meta.", webhookUrl(), "copy-webhook")}
            ${integrationCard("OAuth callback", "Configure em Facebook Login.", `${location.origin}/api/auth/facebook/callback`, "copy-oauth")}
            ${integrationCard("D1 binding", "Salvamento robusto dos fluxos.", "DB", "copy-db-binding")}
            ${integrationCard("Campos", "Assine eventos necessários para automação.", "messages, messaging_postbacks, messaging_optins, messaging_referrals, message_deliveries, message_reads, message_echoes, messaging_handovers, standby", "copy-fields")}
            ${integrationCard("Verify token", "Use o mesmo valor em MESSENGER_VERIFY_TOKEN.", state.settings.verifyToken, "copy-verify")}
            ${integrationCard("Endpoint de envio", "Envio serverless protegido por token.", `${location.origin}/api/messenger/send`, "copy-send")}
          </div>

          <div class="panel flat">
            <div class="panel-header">
              <div>
                <h3>Botao Comecar</h3>
                <span>Configura o Get Started da ${escapeHtml(pageName)} sem abrir a Meta.</span>
              </div>
            </div>
            <div class="panel-body stack">
              <p class="muted">Use isso com o gatilho "Botao Comecar" no node Quando. O payload aplicado sera GET_STARTED.</p>
              <div class="button-row">
                <button class="primary-button" type="button" data-action="setup-get-started">${icons.play}<span>Ativar Comecar</span></button>
                <button class="secondary-button" type="button" data-action="check-get-started">${icons.refresh}<span>Verificar</span></button>
              </div>
            </div>
          </div>

          <div class="panel flat">
            <div class="panel-header">
              <div>
                <h3>Variáveis no Cloudflare Pages</h3>
                <span>Settings → Environment variables</span>
              </div>
              <button class="secondary-button" type="button" data-action="copy-env">${icons.copy}<span>Copiar</span></button>
            </div>
            <div class="panel-body">
              <pre class="code-block" id="envBlock">META_APP_ID=app-id-da-meta
META_APP_SECRET=app-secret-da-meta
SESSION_SECRET=uma-chave-longa-aleatoria
META_REDIRECT_URI=${escapeHtml(`${location.origin}/api/auth/facebook/callback`)}
META_SCOPES=pages_show_list,pages_messaging,pages_manage_metadata,business_management
MESSENGER_PAGE_ACCESS_TOKEN=EAAB...
MESSENGER_VERIFY_TOKEN=${escapeHtml(state.settings.verifyToken)}
MESSENGER_APP_SECRET=app-secret-da-meta
MESSENLEAD_OPERATOR_TOKEN=${escapeHtml(state.settings.operatorToken)}
MESSENLEAD_FLOW_JSON=${escapeHtml(compactFlowJson())}</pre>
            </div>
          </div>

          <div class="button-row">
            <button class="primary-button" type="button" data-action="copy-flow-json">${icons.copy}<span>Copiar JSON dos fluxos</span></button>
            <button class="secondary-button" type="button" data-action="download-flow-json">${icons.send}<span>Baixar JSON</span></button>
          </div>
        </div>
      </section>

      <aside class="panel">
        <div class="panel-header">
          <div>
            <h2>Checklist Meta</h2>
            <span>Passos fora do Cloudflare</span>
          </div>
        </div>
        <div class="panel-body stack">
          ${checkItem("Criar App", "No Meta for Developers, crie um app e adicione Messenger.")}
          ${checkItem("Conectar Página", "Gere Page Access Token da página que receberá mensagens.")}
          ${checkItem("Webhook", "Cole a URL desta tela e confirme com o Verify Token.")}
          ${checkItem("Permissões", "Solicite permissões necessárias antes de produção pública.")}
          ${checkItem("Teste", "Envie mensagem para a página e veja a resposta automática.")}
        </div>
      </aside>
    </div>

    <section class="panel" style="margin-top:16px">
      <div class="panel-header">
        <div>
          <h2>JSON atual dos fluxos</h2>
          <span>Também pode ser importado de volta pelo botão do topo</span>
        </div>
      </div>
      <div class="panel-body">
        <pre class="code-block">${escapeHtml(flowJson)}</pre>
      </div>
    </section>
  `;
}

function renderSettings() {
  const pageId = currentFlowPageId();
  const pageName = state.settings.pageName || state.settings.pageId || "Página atual";
  const folders = tagFoldersForPage(pageId);
  const tags = tagRecordsForPage(pageId);
  const customFields = customFieldRecordsForPage(pageId);
  const pageContacts = contactsForPage(pageId);
  const taggedContacts = pageContacts.filter((contact) => contactTags(contact).length).length;
  const connectedPageCount = connectedPagesForTagCleanup().length;
  const logPageId = flowLogState.scope === "all" ? "__all__" : pageId;
  if (shouldLoadContactsForCurrentPage()) loadContactsForPage(pageId);
  if (flowStore.pageId !== pageId && !flowStore.loading) {
    loadFlowsForPage(pageId);
  }
  if (customFieldStore.pageId !== pageId && !customFieldStore.loading) {
    loadCustomFieldsForPage(pageId);
  }
  if (flowLogState.pageId !== logPageId && !flowLogState.loading) {
    loadFlowLogsForPage(logPageId, { silent: true });
  }
  if (attributionState.pageId !== pageId && !attributionState.loading) {
    loadAttributionsForPage(pageId, { silent: true });
  }

  workspace.innerHTML = `
    <div class="settings-grid">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h2>Pastas de tags</h2>
            <span>Organização de tags para ${escapeHtml(pageName)}</span>
          </div>
          <button class="primary-button" type="button" data-action="create-tag-folder">${icons.plus}<span>Nova pasta</span></button>
        </div>
        <div class="panel-body stack">
          ${folders.map((folder) => renderTagFolderRow(folder, tags)).join("")}
        </div>
      </section>

      <aside class="panel">
        <div class="panel-header">
          <div>
            <h2>Resumo</h2>
            <span>Biblioteca da página selecionada</span>
          </div>
        </div>
        <div class="panel-body stack">
          ${metricInline("Pastas", folders.length)}
          ${metricInline("Tags salvas", tags.length)}
          ${metricInline("Campos personalizados", customFields.length)}
          ${metricInline("Usuarios com tags", taggedContacts)}
          ${metricInline("Paginas conectadas", connectedPageCount)}
          <button class="compact-danger-action" type="button" data-action="reset-running-flows" title="Reiniciar execucoes de fluxos em andamento">${icons.refresh}<span>Reiniciar fluxos em andamento</span></button>
          <button class="compact-danger-action" type="button" data-action="clear-all-contact-tags" title="Limpar tags de todas as paginas">${icons.trash}<span>Limpar tags de todas as paginas</span></button>
          <p class="muted">As tags criadas nos nodes de ação aparecem no dropdown e podem ser agrupadas por pasta aqui.</p>
        </div>
      </aside>

      <section class="panel settings-wide-panel">
        <div class="panel-header">
          <div>
            <h2>JSON Templates</h2>
            <span>Biblioteca por Pagina para editar e copiar templates reutilizaveis de anuncios.</span>
          </div>
          <button class="primary-button" type="button" data-action="open-json-templates">${icons.pages}<span>Abrir biblioteca</span></button>
        </div>
        <div class="panel-body stack">
          <p class="muted">Crie um template inicial de Click-to-Messenger ou salve suas proprias variacoes. O dashboard valida o JSON antes de persistir no D1.</p>
        </div>
      </section>

      <section class="panel settings-wide-panel">
        <div class="panel-header">
          <div>
            <h2>Atribuicoes recentes</h2>
            <span>Mapa automatico entre Pagina, anuncio e chave curta usada nas URLs.</span>
          </div>
          <button class="secondary-button" type="button" data-action="refresh-attributions">${icons.refresh}<span>Atualizar</span></button>
        </div>
        <div class="panel-body">
          ${renderAttributionSummary()}
        </div>
      </section>

      <section class="panel settings-wide-panel">
        <div class="panel-header">
          <div>
            <h2>Campos personalizados</h2>
            <span>Biblioteca da Pagina para salvar dados especificos em cada contato.</span>
          </div>
          <div class="panel-actions">
            <span class="sync-pill ${customFieldStore.serverAvailable ? "synced" : "local"}">${escapeHtml(customFieldStore.loading ? "Carregando D1" : customFieldStore.status)}</span>
            <button class="primary-button" type="button" data-action="create-custom-field">${icons.plus}<span>Novo campo</span></button>
          </div>
        </div>
        <div class="panel-body stack">
          ${customFields.length ? customFields.map(renderCustomFieldRow).join("") : emptyInline("Nenhum campo personalizado criado nesta Pagina.")}
        </div>
      </section>

      <section class="panel settings-wide-panel">
        <div class="panel-header">
          <div>
            <h2>Teste de entrada por anuncio</h2>
            <span>Simula um lead vindo de Click-to-Messenger sem enviar mensagem real.</span>
          </div>
        </div>
        <div class="panel-body">
          ${renderAdFlowTestPanel(pageId)}
        </div>
      </section>

      <section class="panel settings-wide-panel">
        <div class="panel-header">
          <div>
            <h2>Logs do fluxo</h2>
            <span>${flowLogState.scope === "all" ? "Todas as Páginas conectadas" : `Diagnóstico real do webhook para ${escapeHtml(pageName)}`}</span>
          </div>
          <div class="panel-actions">
            <button class="secondary-button ${flowLogState.scope === "current" ? "active" : ""}" type="button" data-action="set-flow-log-scope" data-scope="current"><span>Página atual</span></button>
            <button class="secondary-button ${flowLogState.scope === "all" ? "active" : ""}" type="button" data-action="set-flow-log-scope" data-scope="all"><span>Todas</span></button>
            <button class="secondary-button" type="button" data-action="refresh-flow-logs">${icons.refresh}<span>Atualizar</span></button>
            <button class="secondary-button" type="button" data-action="test-flow-log">${icons.play}<span>Testar D1</span></button>
            <button class="secondary-button" type="button" data-action="process-messenger-queue">${icons.refresh}<span>Processar fila</span></button>
            <button class="secondary-button" type="button" data-action="check-webhook-subscription">${icons.plug}<span>Verificar webhook</span></button>
            <button class="secondary-button" type="button" data-action="subscribe-page-webhook">${icons.workflow}<span>Inscrever app/Página</span></button>
            <button class="secondary-button danger" type="button" data-action="clear-flow-logs">${icons.trash}<span>Limpar</span></button>
          </div>
        </div>
        <div class="panel-body">
          ${renderWebhookDiagnostic(pageId)}
          ${renderAdEntryMonitor(flowLogState.logs)}
          ${renderFlowLogFilters()}
          ${renderFlowLogsPanel(logPageId)}
        </div>
      </section>
    </div>
  `;
}

function renderAdFlowTestPanel(pageId) {
  const result = flowAdTestState.result;
  const logs = flowAdTestState.logs || [];
  const status = adFlowTestStatus(logs, flowAdTestState.error);
  const availableFlows = adTestFlowsForPage(pageId);
  const selectedFlowForTestId = currentAdTestFlowId(pageId);
  const selectedFlowForTest = availableFlows.find((flow) => flow.id === selectedFlowForTestId);
  const testVersion = currentAdTestVersion();
  const pageContacts = contactsForPage(pageId);
  const testerContacts = adTestContactsWithTesterTag(pageContacts);
  const availableTags = adTestTagOptions(pageId, pageContacts);
  const selectedTag = currentAdTestTag(pageId, pageContacts);
  const tagMode = currentAdTestTagMode();
  const selectedPsid = currentAdTestContactPsid(pageId);
  const selectedOptionValue = selectedPsid;
  const selectedContactForTest = testerContacts.find((contact) => contact.psid === selectedPsid);
  const selectedTags = contactTags(selectedContactForTest);
  const simulatedTags = selectedContactForTest ? adTestSimulatedTags(selectedTags, selectedTag, tagMode) : [];
  return `
    <div class="ad-flow-test">
      <div class="ad-flow-test-config">
        <label>
          <span>Fluxo do teste</span>
          <select data-ad-test-flow="true" ${flowAdTestState.loading ? "disabled" : ""}>
            ${!availableFlows.length ? `<option value="" selected disabled>Nenhum fluxo salvo nesta Pagina</option>` : ""}
            ${availableFlows.map((flow) => `
              <option value="${attr(flow.id)}" ${flow.id === selectedFlowForTestId ? "selected" : ""}>
                ${escapeHtml(flow.name || "Fluxo sem nome")} - ${escapeHtml(statusLabel(flow.hasDraftChanges ? "draft" : flow.status))}
              </option>
            `).join("")}
          </select>
          <small>O dry-run executa exatamente este fluxo, sem escolher outro automaticamente.</small>
        </label>
        <label>
          <span>Versao testada</span>
          <select data-ad-test-version="true" ${flowAdTestState.loading ? "disabled" : ""}>
            <option value="published" ${testVersion === "published" ? "selected" : ""}>Publicada igual ao real</option>
            <option value="draft" ${testVersion === "draft" ? "selected" : ""}>Rascunho salvo</option>
          </select>
          <small>${selectedFlowForTest?.hasDraftChanges ? "Este fluxo tem alteracoes que ainda nao foram publicadas." : "O Messenger real usa a versao publicada."}</small>
        </label>
        <label>
          <span>Tag que sera testada</span>
          <select data-ad-test-tag="true" ${flowAdTestState.loading ? "disabled" : ""}>
            ${
              availableTags.length
                ? availableTags.map((tagName) => `
                  <option value="${attr(tagName)}" ${normalizeTagKey(tagName) === normalizeTagKey(selectedTag) ? "selected" : ""}>${escapeHtml(tagName)}</option>
                `).join("")
                : `<option value="" selected disabled>Nenhuma tag alem de ${escapeHtml(AD_TEST_CONTACT_TAG)}</option>`
            }
          </select>
          <small>${escapeHtml(AD_TEST_CONTACT_TAG)} fica apenas como filtro dos contatos de teste.</small>
        </label>
        <label>
          <span>Estado simulado</span>
          <select data-ad-test-tag-mode="true" ${flowAdTestState.loading ? "disabled" : ""}>
            <option value="has" ${tagMode === "has" ? "selected" : ""}>Com essa tag</option>
            <option value="missing" ${tagMode === "missing" ? "selected" : ""}>Sem essa tag</option>
          </select>
          <small>O dry-run adiciona ou remove essa tag somente durante o teste.</small>
        </label>
        <label>
          <span>Envelope de referral</span>
          <select data-ad-test-referral-location="true" ${flowAdTestState.loading ? "disabled" : ""}>
            <option value="message.referral" ${currentAdTestReferralLocation() === "message.referral" ? "selected" : ""}>message.referral</option>
            <option value="postback.referral" ${currentAdTestReferralLocation() === "postback.referral" ? "selected" : ""}>postback.referral</option>
            <option value="event.referral" ${currentAdTestReferralLocation() === "event.referral" ? "selected" : ""}>event.referral</option>
          </select>
          <small>Simula os formatos que podem chegar ao webhook.</small>
        </label>
        <label>
          <span>Contato do teste</span>
          <select data-ad-test-contact="true" ${flowAdTestState.loading ? "disabled" : ""}>
            ${!testerContacts.length ? `<option value="" selected disabled>Nenhum contato com ${escapeHtml(AD_TEST_CONTACT_TAG)}</option>` : ""}
            ${testerContacts.map((contact) => `
              <option value="${attr(contact.psid)}" ${contact.psid === selectedOptionValue ? "selected" : ""}>
                ${escapeHtml(contactDisplayName(contact.name, contact.psid))}
              </option>
            `).join("")}
          </select>
          <small>${selectedPsid ? `Tags reais: ${escapeHtml(selectedTags.join(", ") || "sem tags")} · No teste: ${escapeHtml(simulatedTags.join(", ") || "sem tags")}` : `Apenas contatos com a tag ${escapeHtml(AD_TEST_CONTACT_TAG)} aparecem aqui.`}</small>
        </label>
      </div>
      <div class="ad-flow-test-actions">
        <button class="primary-button" type="button" data-action="test-ad-flow" ${flowAdTestState.loading ? "disabled" : ""}>${icons.send}<span>Testar anuncio normal</span></button>
        <button class="secondary-button" type="button" data-action="test-ad-flow-standby" ${flowAdTestState.loading ? "disabled" : ""}>${icons.send}<span>Testar anuncio em standby</span></button>
      </div>
      <div class="ad-flow-test-grid">
        ${adFlowTestStep("Evento recebido", logs.some((log) => log.event === "event_received"), "Webhook reconheceu o evento simulado de anuncio.")}
        ${adFlowTestStep("Fluxos carregados", logs.some((log) => log.event === "active_flows_loaded"), "Runtime consultou os fluxos publicados no D1.")}
        ${adFlowTestStep("Fluxo iniciado", logs.some((log) => log.event === "flow_started"), "Algum fluxo publicado aceitou o gatilho de anuncio.")}
        ${adFlowTestStep("Saida preparada", logs.some((log) => ["test_replies_prepared", "test_wait_prepared", "flow_waiting", "flow_waiting_for_response", "flow_waiting_for_link_click"].includes(log.event)), "O teste chegou em uma resposta ou em um bloco de espera.")}
      </div>
      <div class="ad-flow-test-result ${attr(status.kind)}">
        <strong>${escapeHtml(status.title)}</strong>
        <span>${escapeHtml(status.message)}</span>
        ${
          result
            ? `<small>PSID de teste: ${escapeHtml(result.psid || "")} · canal: ${escapeHtml(result.channel || "")} · modo usado: ${escapeHtml(result.testTagMode === "missing" ? "sem essa tag" : "com essa tag")} ${escapeHtml(result.testTag || "")} · pagina: ${escapeHtml(pageId || "")}</small>`
            : ""
        }
      </div>
      ${
        logs.length
          ? `<div class="ad-flow-test-log">${logs.slice(0, 8).map(renderAdFlowTestLogItem).join("")}</div>`
          : `<div class="empty-state compact">${flowAdTestState.loading ? "Executando teste..." : "Execute um teste para ver o caminho do evento aqui."}</div>`
      }
    </div>
  `;
}

function renderAttributionSummary() {
  if (attributionState.loading) return `<div class="empty-state compact">Carregando atribuicoes...</div>`;
  if (attributionState.error) return `<div class="empty-state compact">Nao foi possivel carregar atribuicoes: ${escapeHtml(attributionState.error)}</div>`;
  const groups = groupAttributionEvents(attributionState.events);
  if (!groups.length) {
    return `<div class="empty-state compact">Nenhuma entrada originada por anuncio foi registrada nesta Pagina.</div>`;
  }
  return `
    <div class="attribution-summary-list">
      ${groups.map((group) => `
        <article class="attribution-summary-row">
          <div>
            <strong>${escapeHtml(group.sourceKey || "Origem sem chave curta")}</strong>
            <span>${escapeHtml(group.adTitle || "Anuncio sem titulo retornado pela Meta")}</span>
            <small>Ad ID: ${escapeHtml(group.adId || "nao informado")}</small>
          </div>
          <div class="attribution-summary-metrics">
            <span>${group.contacts.size} contato${group.contacts.size === 1 ? "" : "s"}</span>
            <span>${group.entries} entrada${group.entries === 1 ? "" : "s"}</span>
            <small>${escapeHtml(formatDate(group.lastSeen) || "")}</small>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function groupAttributionEvents(events = []) {
  const groups = new Map();
  events.forEach((event) => {
    const key = `${event.pageId || ""}:${event.adId || event.sourceKey || event.id || ""}`;
    const group = groups.get(key) || {
      adId: event.adId || "",
      adTitle: event.adTitle || "",
      sourceKey: event.sourceKey || "",
      contacts: new Set(),
      entries: 0,
      lastSeen: ""
    };
    if (event.psid) group.contacts.add(event.psid);
    group.entries += 1;
    if (!group.lastSeen || Date.parse(event.createdAt || "") > Date.parse(group.lastSeen || "")) group.lastSeen = event.createdAt || "";
    if (!group.adTitle && event.adTitle) group.adTitle = event.adTitle;
    groups.set(key, group);
  });
  return [...groups.values()].sort((left, right) => Date.parse(right.lastSeen || "") - Date.parse(left.lastSeen || ""));
}

function currentAdTestContactPsid(pageId = currentFlowPageId()) {
  const normalizedPageId = normalizeFlowPageId(pageId);
  const pageContacts = contactsForPage(normalizedPageId);
  const testerContacts = adTestContactsWithTesterTag(pageContacts);
  const storedPsid = String(flowAdTestState.psid || "").trim();
  if (storedPsid && testerContacts.some((contact) => contact.psid === storedPsid)) return storedPsid;
  const current = selectedContact();
  if (current && normalizeFlowPageId(current.pageId) === normalizedPageId && adTestContactHasTesterTag(current)) return current.psid;
  return testerContacts[0]?.psid || "";
}

function currentAdTestFlowId(pageId = currentFlowPageId()) {
  const normalizedPageId = normalizeFlowPageId(pageId);
  const flows = adTestFlowsForPage(normalizedPageId);
  const storedFlowId = String(flowAdTestState.flowId || "").trim();
  if (storedFlowId && flows.some((flow) => flow.id === storedFlowId)) return storedFlowId;
  const current = selectedFlow();
  if (current && flows.some((flow) => flow.id === current.id)) return current.id;
  return flows[0]?.id || "";
}

function currentAdTestVersion() {
  return flowAdTestState.testVersion === "draft" ? "draft" : "published";
}

function adTestFlowsForPage(pageId = currentFlowPageId()) {
  const normalizedPageId = normalizeFlowPageId(pageId);
  return state.flows.filter((flow) => normalizeFlowPageId(flow.pageId || normalizedPageId) === normalizedPageId);
}

function currentAdTestTag(pageId = currentFlowPageId(), pageContacts = contactsForPage(pageId)) {
  const options = adTestTagOptions(pageId, pageContacts);
  const stored = normalizeTagName(flowAdTestState.tag || "");
  const match = options.find((tagName) => normalizeTagKey(tagName) === normalizeTagKey(stored));
  return match || options[0] || "";
}

function currentAdTestTagMode() {
  return flowAdTestState.tagMode === "missing" ? "missing" : "has";
}

function currentAdTestReferralLocation() {
  const value = String(flowAdTestState.referralLocation || "");
  return ["message.referral", "postback.referral", "event.referral"].includes(value) ? value : "message.referral";
}

function adTestTagOptions(pageId = currentFlowPageId(), pageContacts = contactsForPage(pageId)) {
  const tagNames = [
    ...tagRecordsForPage(pageId).map((tag) => tag.name),
    ...allContactTags(pageContacts),
    flowAdTestState.tag
  ];
  return unique(
    tagNames
      .map(normalizeTagName)
      .filter((tagName) => tagName && normalizeTagKey(tagName) !== normalizeTagKey(AD_TEST_CONTACT_TAG))
  ).sort((a, b) => a.localeCompare(b));
}

function adTestContactsWithTesterTag(contacts = []) {
  return contacts.filter(adTestContactHasTesterTag);
}

function adTestContactHasTesterTag(contact) {
  const target = normalizeTagKey(AD_TEST_CONTACT_TAG);
  return contactTags(contact).some((tag) => normalizeTagKey(tag) === target);
}

function adTestSimulatedTags(tags = [], tagName = "", tagMode = "has") {
  const normalizedTags = normalizeTags(tags);
  const tag = normalizeTagName(tagName);
  if (!tag) return normalizedTags;
  const target = normalizeTagKey(tag);
  const withoutTag = normalizedTags.filter((item) => normalizeTagKey(item) !== target);
  return tagMode === "missing" ? withoutTag : normalizeTags([...withoutTag, tag]);
}

function adFlowTestStep(label, ok, description) {
  return `
    <div class="ad-flow-test-step ${ok ? "ok" : ""}">
      <span>${ok ? "OK" : "-"}</span>
      <strong>${escapeHtml(label)}</strong>
      <small>${escapeHtml(description)}</small>
    </div>
  `;
}

function adFlowTestStatus(logs, error) {
  if (flowAdTestState.loading) return { kind: "loading", title: "Teste em andamento", message: "Simulando evento e buscando logs." };
  if (error) return { kind: "error", title: "Teste falhou", message: error };
  if (!logs.length) return { kind: "idle", title: "Nenhum teste executado", message: "Use um dos botões acima para simular entrada por anúncio." };
  if (logs.some((log) => log.event === "test_replies_prepared")) return { kind: "ok", title: "Fluxo respondeu no teste", message: "O runtime preparou uma resposta, mas não enviou nada real para o Messenger." };
  if (logs.some((log) => log.event === "test_wait_prepared")) return { kind: "ok", title: "Fluxo chegou em uma espera", message: "O runtime iniciou o fluxo e parou antes de criar uma espera real no teste." };
  const routingIssue = adFlowTestRoutingIssue(logs);
  if (routingIssue) return routingIssue;
  if (logs.some((log) => log.event === "no_matching_trigger")) return { kind: "error", title: "Nenhum gatilho inicial correspondeu", message: "Revise o node Quando do fluxo selecionado. O evento chegou, mas nenhum gatilho configurado aceitou essa entrada." };
  if (logs.some((log) => log.event === "no_matching_flow")) return { kind: "error", title: "Nenhum fluxo correspondeu ao evento", message: "Existem fluxos ativos, mas nenhum deles possui um gatilho compatível com essa entrada." };
  if (logs.some((log) => log.event === "flow_started")) return { kind: "warn", title: "Fluxo iniciou, mas não preparou resposta", message: "Verifique se o próximo bloco é mensagem ou se o fluxo parou em condição/espera." };
  if (logs.some((log) => log.event === "no_active_flow")) return { kind: "error", title: "Nenhum fluxo ativo publicado", message: "Publique o fluxo e confirme que ele pertence à página selecionada." };
  if (logs.some((log) => log.event === "event_received")) return { kind: "warn", title: "Evento recebido, mas fluxo não iniciou", message: "O gatilho de anúncio pode não estar ativo no node Quando." };
  return { kind: "warn", title: "Logs incompletos", message: "O teste rodou, mas não encontrou os eventos esperados." };
}

function adFlowTestRoutingIssue(logs = []) {
  const noNext = logs.find((log) => log.event === "next_node" && !log.data?.targetId && !log.data?.nextNodeId);
  if (!noNext) return null;

  const condition = logs.find((log) => log.event === "condition_result" && log.data?.nodeId === noNext.data?.fromNodeId);
  if (condition) {
    const matched = condition.data?.result === "yes";
    const label = matched ? "Sim" : "Nao";
    const nextField = matched ? "yesNext" : "noNext";
    if (!condition.data?.[nextField]) {
      return {
        kind: "warn",
        title: `Saida ${label} da condicao sem proximo passo`,
        message: `A condicao ${matched ? "correspondeu" : "nao correspondeu"}, mas a saida ${label} nao esta conectada a nenhum bloco. Conecte essa saida a uma mensagem, acao ou espera.`
      };
    }
  }

  return {
    kind: "warn",
    title: "Bloco sem proximo passo",
    message: "O fluxo chegou em um bloco que nao aponta para nenhum proximo passo executavel."
  };
}

function renderAdFlowTestLogItem(log) {
  return `
    <article>
      <span class="flow-log-level">${escapeHtml(log.level || "info")}</span>
      <div>
        <strong>${escapeHtml(log.event || "evento")}</strong>
        <small>${escapeHtml(log.message || "")}</small>
      </div>
      <time>${escapeHtml(formatLogDate(log.createdAt) || "")}</time>
    </article>
  `;
}

function renderFlowLogsPanel(pageId) {
  if (flowLogState.loading && flowLogState.pageId === pageId) {
    return `<div class="empty-state">Carregando logs do D1...</div>`;
  }
  if (flowLogState.error && flowLogState.pageId === pageId) {
    return `<div class="empty-state">Não foi possível carregar os logs: ${escapeHtml(flowLogState.error)}</div>`;
  }
  if (flowLogState.pageId !== pageId || !flowLogState.logs.length) {
    return `
      <div class="empty-state">
        Nenhum log encontrado para esta Página.
        Envie uma mensagem no Messenger e clique em Atualizar. Se continuar vazio, o webhook da Meta não chegou no projeto.
      </div>
    `;
  }

  const visibleLogs = flowLogState.logs.filter((log) => flowLogMatchesFilter(log, flowLogState.filter, flowLogState.logs));
  if (!visibleLogs.length) {
    return `<div class="empty-state compact">Nenhum evento corresponde ao filtro selecionado.</div>`;
  }

  return `
    <div class="flow-log-list">
      ${visibleLogs.map(renderFlowLogRow).join("")}
    </div>
  `;
}

function renderAdEntryMonitor(logs = []) {
  const entryLogs = logs.filter(isAdEntryLog).slice(0, 6);
  return `
    <section class="ad-entry-monitor">
      <div class="ad-entry-monitor-header">
        <div>
          <strong>Monitor de entrada por anuncio</strong>
          <span>Mostra quando a Meta abre a conversa pelo anuncio e quando o contato toca em Receber conteudo.</span>
        </div>
        <span class="badge ${entryLogs.length ? "active" : ""}">${entryLogs.length ? `${entryLogs.length} entrada${entryLogs.length === 1 ? "" : "s"}` : "Aguardando entrada"}</span>
      </div>
      ${
        entryLogs.length
          ? `<div class="ad-entry-monitor-list">${entryLogs.map((log) => renderAdEntryMonitorRow(log, logs)).join("")}</div>`
          : `<div class="empty-state compact">Nenhuma abertura por anuncio ou clique no template apareceu nos logs carregados.</div>`
      }
    </section>
  `;
}

function renderAdEntryMonitorRow(log, logs = []) {
  const hasReferral = Boolean(log.data?.hasAdReferral);
  const route = relatedFlowLog(log, logs, "flow_route_selected");
  const issue = relatedFlowLog(log, logs, ["no_active_flow", "no_matching_flow", "no_matching_trigger"]);
  const entryKind = adEntryKind(log);
  const routeState = route ? "Fluxo selecionado" : issue?.event === "no_active_flow" ? "Pagina sem fluxo ativo" : issue ? "Sem fluxo compativel" : "Roteamento nao registrado";
  return `
    <article class="ad-entry-monitor-row ${issue ? "warn" : ""}">
      <div class="ad-entry-monitor-row-title">
        <strong>${entryKind === "template_click" ? "Receber conteudo clicado" : "Anuncio abriu a conversa"}</strong>
        <time>${escapeHtml(formatLogDate(log.createdAt) || log.createdAt || "")}</time>
      </div>
      <div class="ad-entry-monitor-meta">
        <span class="badge active">Webhook recebido</span>
        <span class="badge ${hasReferral ? "active" : "paused"}">${hasReferral ? "Origem do anuncio recebida" : "Sem origem do anuncio"}</span>
        <span class="badge ${route ? "active" : "paused"}">${escapeHtml(routeState)}</span>
      </div>
      <small>Pagina ${escapeHtml(log.pageId || "")}${log.psid ? ` · PSID ${escapeHtml(log.psid)}` : ""}${log.data?.adId ? ` · Ad ID ${escapeHtml(log.data.adId)}` : ""}</small>
      ${log.data?.adTitle ? `<small>Anuncio: ${escapeHtml(log.data.adTitle)}</small>` : ""}
      ${route?.flowName ? `<small>Fluxo: ${escapeHtml(route.flowName)}</small>` : ""}
    </article>
  `;
}

function relatedFlowLog(source, logs, events) {
  const acceptedEvents = Array.isArray(events) ? events : [events];
  const sourceTime = Date.parse(source.createdAt || "") || 0;
  return logs.find((log) => {
    if (!acceptedEvents.includes(log.event)) return false;
    if (log.psid !== source.psid || log.pageId !== source.pageId) return false;
    const logTime = Date.parse(log.createdAt || "") || 0;
    return logTime >= sourceTime && logTime - sourceTime <= 60 * 1000;
  });
}

function renderFlowLogFilters() {
  const filters = [
    ["all", "Todos"],
    ["ad_entry", "Entrada do anuncio"],
    ["received", "Webhooks recebidos"],
    ["issues", "Problemas"]
  ];
  return `
    <div class="flow-log-filter-bar">
      <strong>Eventos detalhados</strong>
      <div class="segmented">
        ${filters.map(([id, label]) => `
          <button class="${flowLogState.filter === id ? "active" : ""}" type="button" data-action="set-flow-log-filter" data-filter="${attr(id)}">${escapeHtml(label)}</button>
        `).join("")}
      </div>
    </div>
  `;
}

function flowLogMatchesFilter(log, filter = "all", logs = []) {
  if (filter === "ad_entry") return isAdEntryRelatedLog(log, logs);
  if (filter === "received") return ["event_received", "standby_received"].includes(log.event);
  if (filter === "issues") return ["warn", "error"].includes(String(log.level || "").toLowerCase());
  return true;
}

function isAdEntryLog(log) {
  if (log.event !== "event_received") return false;
  return adEntryKind(log) !== "";
}

function adEntryKind(log) {
  if (log.data?.text === "MESSENLEAD_AD_ENTRY" || log.data?.entry?.template_key === "MESSENLEAD_AD_ENTRY") return "template_click";
  if (log.data?.hasAdReferral || log.data?.sourceLabel === "facebook_ad") return "open_thread";
  return "";
}

function isAdEntryRelatedLog(log, logs = []) {
  if (isAdEntryLog(log)) return true;
  if (log.event === "ad_referral_diagnostic") {
    return log.data?.templateKey === "MESSENLEAD_AD_ENTRY" || Boolean(log.data?.adId) || String(log.data?.referralPayload?.source || "").toLowerCase() === "ads";
  }
  if (["flow_route_selected", "no_active_flow", "no_matching_flow", "no_matching_trigger"].includes(log.event)) {
    return log.data?.templateKey === "MESSENLEAD_AD_ENTRY" || log.data?.sourceLabel === "facebook_ad" || logs.some((entry) => isAdEntryLog(entry) && relatedFlowLog(entry, [log], log.event));
  }
  return false;
}

function renderWebhookDiagnostic(pageId) {
  if (webhookDiagState.loading && webhookDiagState.pageId === pageId) {
    return `<div class="webhook-diagnostic"><span class="badge">Verificando</span><strong>Consultando a Meta...</strong></div>`;
  }
  if (webhookDiagState.error && webhookDiagState.pageId === pageId) {
    return `<div class="webhook-diagnostic error"><span class="badge paused">Erro</span><strong>${escapeHtml(webhookDiagState.error)}</strong></div>`;
  }
  if (webhookDiagState.pageId !== pageId || !webhookDiagState.data) {
    return `
      <div class="webhook-diagnostic">
        <span class="badge">Webhook</span>
        <strong>Clique em Verificar webhook para saber se esta Página está inscrita no app.</strong>
      </div>
    `;
  }

  const data = webhookDiagState.data;
  const subscribed = Boolean(data.isCurrentAppSubscribed);
  const appWebhook = data.appWebhook || {};
  const appReady = Boolean(appWebhook.hasPageObjectSubscription && appWebhook.includesMessages);
  const fields = data.currentApp?.subscribed_fields || data.currentApp?.subscribedFields || [];
  const appFields = appWebhook.fields || [];
  return `
    <div class="webhook-diagnostic ${subscribed && appReady ? "ok" : "warn"}">
      <span class="badge ${subscribed ? "active" : "paused"}">${subscribed ? "Página inscrita" : "Página não inscrita"}</span>
      <span class="badge ${appReady ? "active" : "paused"}">${appReady ? "App recebe page/messages" : "App sem page/messages"}</span>
      <strong>${subscribed && appReady ? "A Página e o app estão prontos para receber eventos." : "Ainda falta uma parte da configuração de webhook."}</strong>
      <span>Token da Página: ${data.hasPageAccessToken ? "salvo" : "ausente"} · Apps retornados: ${(data.subscriptions || []).length}</span>
      ${fields.length ? `<span>Campos da Página: ${escapeHtml(fields.join(", "))}</span>` : ""}
      ${appFields.length ? `<span>Campos do app/page: ${escapeHtml(appFields.join(", "))}</span>` : ""}
      ${appWebhook.callbackUrl ? `<span>Callback do app: ${escapeHtml(appWebhook.callbackUrl)}</span>` : ""}
      ${renderWebhookDeliveryProbe(data.deliveryProbe)}
      ${data.error ? `<pre>${escapeHtml(data.error)}</pre>` : ""}
      ${appWebhook.error ? `<pre>${escapeHtml(appWebhook.error)}</pre>` : ""}
    </div>
  `;
}

function renderWebhookDeliveryProbe(probe) {
  if (!probe) return "";
  if (!probe.ok) {
    return `<span>Teste de entrega: nao foi possivel comparar Graph API e logs (${escapeHtml(probe.error || "erro")}).</span>`;
  }

  const inbound = probe.latestInbound;
  if (!inbound) {
    return `<span>Teste de entrega: nenhuma mensagem recente de usuario encontrada nas ultimas conversas da Graph API.</span>`;
  }

  const status = inbound.hasWebhookLog
    ? `Webhook registrou ${inbound.webhookLog?.event || "evento"} em ${formatLogDate(inbound.webhookLog?.createdAt) || inbound.webhookLog?.createdAt || ""}.`
    : "Graph API viu mensagem recente, mas nao existe event_received/standby_received nos logs para esse PSID.";
  return `
    <div class="webhook-delivery-probe ${inbound.hasWebhookLog ? "ok" : "warn"}">
      <span class="badge ${inbound.hasWebhookLog ? "active" : "paused"}">${inbound.hasWebhookLog ? "Webhook encontrado" : "Sem webhook real"}</span>
      <strong>${escapeHtml(status)}</strong>
      <span>Ultima mensagem Graph: ${escapeHtml(inbound.name || inbound.psid || "Contato")} - ${escapeHtml(formatDate(inbound.createdAt) || inbound.createdAt || "")}</span>
      <span>${escapeHtml(inbound.message || "Mensagem sem texto")}</span>
    </div>
  `;
}

function renderFlowLogRow(log) {
  const data = log.data && Object.keys(log.data).length ? JSON.stringify(log.data, null, 2) : "";
  return `
    <article class="flow-log-row ${attr(log.level || "info")}">
      <div class="flow-log-main">
        <span class="flow-log-level">${escapeHtml(log.level || "info")}</span>
        <strong>${escapeHtml(log.message || log.event || "Evento")}</strong>
        <span>${escapeHtml(formatLogDate(log.createdAt) || log.createdAt || "")}</span>
      </div>
      <div class="flow-log-meta">
        <span>${escapeHtml(log.event || "")}</span>
        <span>Página ${escapeHtml(log.pageId || "")}</span>
        ${log.flowName ? `<span>${escapeHtml(log.flowName)}</span>` : ""}
        ${log.psid ? `<span>PSID ${escapeHtml(log.psid)}</span>` : ""}
      </div>
      ${data ? `<pre>${escapeHtml(data)}</pre>` : ""}
    </article>
  `;
}

function renderTagFolderRow(folder, tags) {
  const folderTags = tags.filter((tag) => tag.folderId === folder.id);
  return `
    <article class="tag-folder-row">
      <div>
        <strong>${escapeHtml(folder.name)}</strong>
        <span>${folderTags.length} tag${folderTags.length === 1 ? "" : "s"}</span>
        ${
          folderTags.length
            ? `<div class="tag-folder-tags">${folderTags.slice(0, 8).map((tag) => `<span class="tag">${escapeHtml(tag.name)}</span>`).join("")}${folderTags.length > 8 ? `<span class="tag muted">+${folderTags.length - 8}</span>` : ""}</div>`
            : `<div class="muted">Nenhuma tag nesta pasta.</div>`
        }
      </div>
      ${
        folder.id === DEFAULT_TAG_FOLDER_ID
          ? `<span class="badge">Padrão</span>`
          : `<button class="icon-button danger" type="button" data-action="delete-tag-folder" data-folder-id="${attr(folder.id)}" title="Excluir pasta">${icons.trash}</button>`
      }
    </article>
  `;
}

function metricInline(label, value) {
  return `
    <div class="setting-metric-inline">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function renderCustomFieldRow(field) {
  return `
    <article class="custom-field-row">
      <div>
        <div class="custom-field-row-title">
          <strong>${escapeHtml(field.name)}</strong>
          <span class="badge">${escapeHtml(customFieldTypeLabel(field.type))}</span>
        </div>
        <span>${escapeHtml(field.description || "Campo disponivel para nodes de Acoes e dados do contato.")}</span>
        <small>${escapeHtml(field.folder || DEFAULT_CUSTOM_FIELD_FOLDER)}</small>
      </div>
      <button class="icon-button danger" type="button" data-action="delete-custom-field" data-id="${attr(field.id)}" title="Excluir campo da biblioteca">${icons.trash}</button>
    </article>
  `;
}

function openCreateCustomFieldModal(stepId = "") {
  const context = stepId ? actionStepContext(stepId) : null;
  actionFieldPickerStepId = "";
  actionFieldPickerExpanded = false;
  actionFieldPickerQuery = "";
  openFormModal({
    title: "Criar novo campo do usuário",
    className: "custom-field-create-modal",
    intro:
      "Os atributos personalizados permitem que você salve informações sobre seus contatos. Armazene dados específicos para segmentar o público com mais precisão.",
    submitLabel: "Criar",
    fields: [
      { name: "name", label: "Nome", value: context?.step.fieldName || "", required: true, placeholder: "Ex: Data de nascimento" },
      {
        name: "type",
        label: "Digite",
        type: "select",
        value: normalizeCustomFieldType(context?.step.fieldType),
        options: customFieldTypes.map((option) => ({ value: option.id, label: option.label }))
      },
      { name: "description", label: "Descrição (Opcional)", type: "textarea", rows: 3, value: "", placeholder: "Uso interno deste campo" },
      { name: "folder", label: "Pasta", value: DEFAULT_CUSTOM_FIELD_FOLDER, placeholder: "Ex: Dados do cliente" }
    ],
    onSubmit: async ({ name, type, folder, description }) => {
      const field = await saveCustomFieldForPage(
        {
          name: name.trim(),
          type,
          folder: folder.trim() || DEFAULT_CUSTOM_FIELD_FOLDER,
          description: description.trim()
        },
        currentFlowPageId()
      );
      if (!field) throw new Error("Informe o nome do campo.");
      if (context) {
        context.step.fieldId = field.id;
        context.step.fieldName = field.name;
        context.step.fieldType = field.type;
        context.node.message = summarizeActionSteps(context.node);
        context.flow.updatedAt = new Date().toISOString();
        saveState();
      }
      render();
    }
  });
}

function confirmDeleteCustomField(fieldId) {
  const pageId = currentFlowPageId();
  const field = customFieldRecordsForPage(pageId).find((item) => item.id === fieldId);
  if (!field) return;
  openConfirmModal({
    title: "Excluir campo personalizado",
    message: `Excluir "${field.name}" da biblioteca? Os valores ja gravados nos contatos nao serao apagados automaticamente.`,
    submitLabel: "Excluir",
    danger: true,
    onConfirm: () => removeCustomFieldForPage(field.id, pageId)
  });
}

function openCreateTagFolderModal() {
  openFormModal({
    title: "Criar pasta",
    description: "Pastas ajudam a organizar tags por página.",
    submitLabel: "Criar",
    fields: [{ name: "name", label: "Nome da pasta", value: "", required: true, placeholder: "Ex: Leads, Clientes, Pós-venda" }],
    onSubmit: ({ name }) => {
      const folder = addTagFolder(name.trim(), currentFlowPageId());
      if (!folder) throw new Error("Informe o nome da pasta.");
      saveState();
      render();
    }
  });
}

function confirmDeleteTagFolder(folderId) {
  const folder = tagFoldersForPage(currentFlowPageId()).find((item) => item.id === folderId);
  if (!folder || folder.id === DEFAULT_TAG_FOLDER_ID) return;
  openConfirmModal({
    title: "Excluir pasta",
    message: `Excluir a pasta "${folder.name}"? As tags dessa pasta serão movidas para "${DEFAULT_TAG_FOLDER_NAME}".`,
    submitLabel: "Excluir",
    danger: true,
    onConfirm: () => {
      removeTagFolder(folder.id, currentFlowPageId());
      saveState();
      render();
    }
  });
}

async function confirmClearAllContactTags() {
  const pages = await ensureConnectedPagesForTagCleanup();
  if (!pages.length) {
    toastMessage("Nenhuma pagina conectada encontrada. Entre com Facebook novamente.");
    return;
  }

  const pageIds = pages.map((page) => normalizeFlowPageId(page.id));
  const taggedContacts = state.contacts.filter((contact) => {
    return pageIds.includes(normalizeFlowPageId(contact.pageId)) && contactTags(contact).length;
  }).length;

  openConfirmModal({
    title: "Limpar tags de todas as paginas",
    message: `Remover todas as tags dos usuarios em ${pages.length} pagina${pages.length === 1 ? "" : "s"} conectada${pages.length === 1 ? "" : "s"}? Contatos e fluxos continuam salvos. Usuarios com tags carregados agora: ${taggedContacts}.`,
    submitLabel: "Limpar tags",
    danger: true,
    onConfirm: () => clearAllContactTagsForConnectedPages(pages)
  });
}

async function confirmResetRunningFlows() {
  const pages = await ensureConnectedPagesForRuntimeReset();
  if (!pages.length) {
    toastMessage("Nenhuma pagina conectada encontrada para reiniciar.");
    return;
  }

  openConfirmModal({
    title: "Reiniciar fluxos em andamento",
    message: `Cancelar esperas, respostas aguardadas e envios pendentes de fluxos em ${pages.length} pagina${pages.length === 1 ? "" : "s"} conectada${pages.length === 1 ? "" : "s"}? Os fluxos salvos, tags e contatos nao serao apagados. Quem enviar nova mensagem depois disso iniciara o fluxo novamente pelo gatilho.`,
    submitLabel: "Reiniciar",
    danger: true,
    onConfirm: () => resetRunningFlowsForPages(pages)
  });
}

async function ensureConnectedPagesForRuntimeReset() {
  const pages = await ensureConnectedPagesForTagCleanup();
  if (pages.length) return pages;
  const pageId = currentFlowPageId();
  return pageId ? [{ id: pageId, name: selectedPageName(pageId) || pageId }] : [];
}

async function resetRunningFlowsForPages(pages = []) {
  const normalizedPages = pages
    .map((page) => ({ id: normalizeFlowPageId(page.id), name: page.name || selectedPageName(page.id) || page.id }))
    .filter((page) => page.id);

  if (!normalizedPages.length) {
    toastMessage("Nenhuma pagina conectada para reiniciar.");
    return;
  }

  try {
    window.clearTimeout(flowStore.saveTimer);
    flowStore.status = "Salvando antes do reset";
    updateSyncPill();
    const saved = await syncAllFlowsToServer();
    if (!saved) {
      toastMessage("Nao consegui salvar o fluxo atual no D1. Reset cancelado para evitar executar um desenho antigo.");
      return;
    }

    const result = await apiPost("/api/flow-runtime/reset", {
      pageIds: normalizedPages.map((page) => page.id)
    });
    const reset = result.reset || {};
    const total =
      Number(reset.continuations || 0) +
      Number(reset.responseWaits || 0) +
      Number(reset.linkClickWaits || 0) +
      Number(reset.queuedMessages || 0) +
      Number(reset.relayQueuedMessages || 0);
    toastMessage(`Fluxos em andamento reiniciados: ${total} item${total === 1 ? "" : "s"} cancelado${total === 1 ? "" : "s"}.`);
    await loadFlowLogsForPage(flowLogState.scope === "all" ? "__all__" : currentFlowPageId(), { silent: true });
    render();
  } catch (error) {
    toastMessage(error.message || "Nao foi possivel reiniciar os fluxos em andamento.");
  }
}

async function ensureConnectedPagesForTagCleanup() {
  if (Array.isArray(metaState.pages) && metaState.pages.length) return metaState.pages.filter((page) => page?.id);

  try {
    const profile = await apiGet("/api/meta/me");
    metaState.profile = profile.user || null;
    metaState.profileFromCache = false;
    metaState.authChecked = true;

    const result = await apiGet("/api/meta/pages");
    metaState.pages = result.pages || [];
    metaState.pageDebug = result.debug || null;
    metaState.error = "";
    renderPageSwitcher();
    return metaState.pages.filter((page) => page?.id);
  } catch (error) {
    metaState.error = error.message || "Nao foi possivel carregar as paginas.";
    return [];
  }
}

function connectedPagesForTagCleanup() {
  const pages = Array.isArray(metaState.pages) ? metaState.pages : [];
  if (pages.length) return pages.filter((page) => page?.id);

  const pageId = currentFlowPageId();
  return pageId ? [{ id: pageId, name: selectedPageName(pageId) || state.settings.pageName || pageId }] : [];
}

async function clearAllContactTagsForConnectedPages(pages = connectedPagesForTagCleanup()) {
  const normalizedPages = pages
    .map((page) => ({ id: normalizeFlowPageId(page.id), name: page.name || selectedPageName(page.id) || page.id }))
    .filter((page) => page.id);
  const currentPageId = currentFlowPageId();

  if (!normalizedPages.length) {
    toastMessage("Nenhuma pagina conectada para limpar.");
    return;
  }

  contactStore = {
    pageId: "__all__",
    loading: true,
    serverAvailable: contactStore.serverAvailable,
    status: "Limpando tags"
  };
  render();

  let total = 0;
  let failed = 0;

  try {
    for (const page of normalizedPages) {
      try {
        const result = await apiPost("/api/contacts", {
          pageId: page.id,
          action: "clear_all_tags"
        });

        total += Number(result.count) || 0;
        if (Array.isArray(result.contacts)) {
          mergeContactsForPage(page.id, result.contacts);
        } else {
          clearLocalContactTagsForPage(page.id);
        }
      } catch {
        failed += 1;
      }
    }

    subscriberTagFilter = "";
    persistLocalState();
    contactStore = {
      pageId: currentPageId,
      loading: false,
      serverAvailable: failed === 0,
      status: failed ? "Tags limpas parcialmente" : "Tags limpas"
    };
    toastMessage(`Tags removidas de ${total} contato${total === 1 ? "" : "s"} em ${normalizedPages.length - failed} pagina${normalizedPages.length - failed === 1 ? "" : "s"}.`);
  } catch (error) {
    contactStore = {
      pageId: currentPageId,
      loading: false,
      serverAvailable: false,
      status: "Erro ao limpar tags"
    };
    toastMessage(error.message || "Nao foi possivel limpar as tags.");
  }

  render();
}

function clearLocalContactTagsForPage(pageId) {
  const normalizedPageId = normalizeFlowPageId(pageId);
  state.contacts = state.contacts.map((contact) =>
    normalizeFlowPageId(contact.pageId) === normalizedPageId
      ? { ...contact, tags: [], tag: "", updatedAt: new Date().toISOString() }
      : contact
  );
}

async function loadMetaProfile(options = {}) {
  if (metaState.loadingProfile) return;
  metaState.loadingProfile = true;
  try {
    const profile = await apiGet("/api/meta/me");
    metaState.profile = profile.user || null;
    metaState.profileFromCache = false;
    if (metaState.profile) setDashboardCache("profile", "", metaState.profile);
    metaState.error = "";
  } catch (error) {
    if (error.status === 401) clearDashboardCache();
    if (!options.background || error.status === 401) metaState.profile = null;
    metaState.profileFromCache = false;
    metaState.error = error.message === "Not authenticated" || options.background ? metaState.error : error.message;
  } finally {
    metaState.loadingProfile = false;
    metaState.authChecked = true;
    render();
  }
}

async function loadMetaPages(options = {}) {
  if (metaState.loadingPages) return;
  metaState.loadingPages = true;
  try {
    const endpoint = options.force ? "/api/meta/pages?refresh=1" : "/api/meta/pages";
    const result = await apiGet(endpoint);
    metaState.pages = result.pages || [];
    metaState.pagesFromCache = false;
    metaState.pageDebug = result.debug || null;
    setDashboardCache("pages", "", { pages: metaState.pages, debug: metaState.pageDebug });
    metaState.error = "";
    const nextPage = selectedMetaPageFrom(metaState.pages);

    if (nextPage) {
      const previousPageId = currentFlowPageId();
      const nextPageId = normalizeFlowPageId(nextPage.id);
      const pageChanged = normalizeFlowPageId(previousPageId) !== nextPageId;
      if (pageChanged) cacheCurrentPageFlows(previousPageId);
      const selectionChanged = applySelectedMetaPage(nextPage);
      if (pageChanged) {
        clearSelectedMetaConversation();
        subscriberTagFilter = "";
        setActiveFlowsForPage(nextPageId);
        flowStore.pageId = "";
        contactStore.pageId = "";
        customFieldStore.pageId = "";
        pixelState.pageId = "";
        jsonTemplateState = { pageId: "", loading: false, templates: [], error: "" };
        hydrateCachedFlowsForPage(nextPageId);
        hydrateCachedConversationsForPage(nextPageId);
      }
      if (selectionChanged || pageChanged) persistLocalState();
    }
  } catch (error) {
    if (!options.background || !Array.isArray(metaState.pages)) {
      metaState.pages = [];
      metaState.pageDebug = null;
    }
    metaState.pagesFromCache = false;
    metaState.error = error.message;
    if (!options.background) toastMessage(error.message);
  } finally {
    metaState.loadingPages = false;
    render();
  }
}

async function loadMetaConversations(pageId, options = {}) {
  const requestedPageId = normalizeFlowPageId(pageId);
  if (!options.force && normalizeFlowPageId(metaState.conversationsPageId) !== requestedPageId) {
    const hydrated = hydrateCachedConversationsForPage(requestedPageId);
    if (hydrated) {
      render();
      return;
    }
  }
  metaState.loadingConversationsPageId = requestedPageId;

  try {
    metaState.error = "";
    const result = await apiGet(`/api/meta/conversations?pageId=${encodeURIComponent(requestedPageId)}`);
    if (normalizeFlowPageId(metaState.selectedPageId || state.settings.pageId) !== requestedPageId) return;

    const conversations = result.conversations || [];
    const previousConversationId = metaState.selectedConversationId;
    metaState.conversations = conversations;
    metaState.conversationsPageId = requestedPageId;
    metaState.conversationsFromCachePageId = "";
    setDashboardCache("conversationsByPage", requestedPageId, conversations);
    mergeConversationsAsContacts(requestedPageId, selectedPageName(requestedPageId), conversations);
    metaState.selectedConversationId = conversations.find((conversation) => conversation.id === previousConversationId)?.id || "";
    metaState.messages = null;
    metaState.pixelEvents = null;
    metaState.attributionEvents = null;
    metaState.unreadAnchorId = "";
  } catch (error) {
    if (normalizeFlowPageId(metaState.selectedPageId || state.settings.pageId) !== requestedPageId) return;
    const hasCachedConversations = options.force && normalizeFlowPageId(metaState.conversationsPageId) === requestedPageId && Array.isArray(metaState.conversations);
    if (!hasCachedConversations) {
      metaState.conversations = [];
      metaState.conversationsPageId = requestedPageId;
    }
    metaState.conversationsFromCachePageId = "";
    metaState.error = error.message;
    if (!options.force) toastMessage(error.message);
  } finally {
    if (normalizeFlowPageId(metaState.loadingConversationsPageId) === requestedPageId) {
      metaState.loadingConversationsPageId = "";
    }
    render();
  }
}

function shouldLoadBroadcastConversations(pages) {
  return pages.some((page) => {
    const snapshot = broadcastState.pageConversations[page.id];
    return !snapshot || (!snapshot.loading && !snapshot.loaded && !snapshot.error);
  });
}

async function loadBroadcastConversations(pages) {
  const pending = pages.filter((page) => {
    const snapshot = broadcastState.pageConversations[page.id];
    return !snapshot || (!snapshot.loading && !snapshot.loaded && !snapshot.error);
  });

  if (!pending.length) return;

  pending.forEach((page) => {
    broadcastState.pageConversations[page.id] = {
      loading: true,
      loaded: false,
      error: "",
      conversations: []
    };
  });

  await Promise.all(
    pending.map(async (page) => {
      try {
        const result = await apiGet(`/api/meta/conversations?pageId=${encodeURIComponent(page.id)}&limit=100`);
        broadcastState.pageConversations[page.id] = {
          loading: false,
          loaded: true,
          error: "",
          conversations: result.conversations || []
        };
        mergeConversationsAsContacts(page.id, page.name, result.conversations || []);
      } catch (error) {
        broadcastState.pageConversations[page.id] = {
          loading: false,
          loaded: false,
          error: error.message,
          conversations: []
        };
      }
    })
  );

  if (activeView === "broadcasts") render();
}

function refreshBroadcastEligibility() {
  broadcastState.pageConversations = {};
  render();
}

async function loadMetaMessages(pageId, conversationId, options = {}) {
  if (metaState.loadingMessages && options.silent) return;
  if (!options.force && !options.silent && !metaState.messages) {
    const hydrated = hydrateCachedMessagesForConversation(pageId, conversationId);
    if (hydrated) {
      render();
      return;
    }
  }
  metaState.loadingMessages = true;
  let shouldRenderAfterLoad = true;
  let scrollToUnreadAfterRender = false;
  try {
    const conversation = metaState.conversations?.find((item) => item.id === conversationId);
    const psid = conversation ? recipientIdFromConversation(conversation, pageId) : "";
    const readBeforeOpen = conversationReadState[conversationReadKey(pageId, conversationId)] || null;
    const unreadCountBeforeOpen = conversationUnreadCount(conversation);
    const [result, pixelResult, attributionResult] = await Promise.all([
      apiGet(`/api/meta/messages?pageId=${encodeURIComponent(pageId)}&conversationId=${encodeURIComponent(conversationId)}`),
      psid
        ? apiGet(`/api/pixel/events?pageId=${encodeURIComponent(pageId)}&psid=${encodeURIComponent(psid)}&days=90&limit=80`).catch(() => ({ events: [] }))
        : Promise.resolve({ events: [] }),
      psid
        ? apiGet(`/api/messenger-attributions?pageId=${encodeURIComponent(pageId)}&psid=${encodeURIComponent(psid)}&limit=80`).catch(() => ({ events: [] }))
        : Promise.resolve({ events: [] })
    ]);
    if (activeView === "pages" && (metaState.selectedPageId !== pageId || metaState.selectedConversationId !== conversationId)) {
      shouldRenderAfterLoad = false;
      return;
    }
    metaState.messages = result.messages || [];
    metaState.pixelEvents = pixelResult.events || [];
    metaState.attributionEvents = attributionResult.events || [];
    setDashboardCache("messagesByConversation", conversationCacheKey(pageId, conversationId), {
      messages: metaState.messages,
      pixelEvents: metaState.pixelEvents,
      attributionEvents: metaState.attributionEvents
    });
    metaState.unreadAnchorId = options.silent ? metaState.unreadAnchorId : unreadAnchorForConversation(metaState.messages, pageId, readBeforeOpen, unreadCountBeforeOpen);
    scrollToUnreadAfterRender = !options.silent;
    metaState.error = "";
    markMetaConversationRead(pageId, conversationId);
  } catch (error) {
    if (activeView === "pages" && (metaState.selectedPageId !== pageId || metaState.selectedConversationId !== conversationId)) {
      shouldRenderAfterLoad = false;
      return;
    }
    const keepCurrentMessages = options.silent && Array.isArray(metaState.messages);
    if (!keepCurrentMessages) {
      metaState.messages = [];
      metaState.pixelEvents = [];
      metaState.attributionEvents = [];
      metaState.unreadAnchorId = "";
    }
    metaState.error = error.message;
    if (!options.silent) toastMessage(error.message);
  } finally {
    metaState.loadingMessages = false;
    if (shouldRenderAfterLoad && (!options.silent || activeView === "pages")) {
      const scrollSnapshot = options.silent && activeView === "pages" ? captureMetaConversationScroll() : null;
      render();
      if (scrollSnapshot) restoreMetaConversationScroll(scrollSnapshot);
      else if (scrollToUnreadAfterRender) scrollMetaConversationToUnread();
    }
  }
}

function captureMetaConversationScroll() {
  const scroller = document.querySelector("[data-conversation-scroll]");
  if (!scroller) return null;
  const distanceFromBottom = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight;
  return {
    scrollTop: scroller.scrollTop,
    scrollHeight: scroller.scrollHeight,
    stickToBottom: distanceFromBottom <= 48
  };
}

function restoreMetaConversationScroll(snapshot) {
  window.requestAnimationFrame(() => {
    const scroller = document.querySelector("[data-conversation-scroll]");
    if (!scroller) return;
    if (snapshot.stickToBottom) {
      scroller.scrollTop = scroller.scrollHeight;
      return;
    }
    scroller.scrollTop = Math.min(snapshot.scrollTop, Math.max(0, scroller.scrollHeight - scroller.clientHeight));
  });
}

function scrollMetaConversationToUnread() {
  window.requestAnimationFrame(() => {
    const scroller = document.querySelector("[data-conversation-scroll]");
    if (!scroller) return;
    const anchor = scroller.querySelector("[data-unread-anchor]");
    if (anchor) {
      scroller.scrollTop = Math.max(0, anchor.offsetTop - 14);
      return;
    }
    scroller.scrollTop = scroller.scrollHeight;
  });
}

function unreadAnchorForConversation(messages = [], pageId, readBefore = null, unreadCount = 0) {
  const inboundMessages = [...messages]
    .filter((message) => message?.from?.id !== pageId)
    .sort((left, right) => Date.parse(messageTimeValue(left) || "") - Date.parse(messageTimeValue(right) || ""));

  if (!inboundMessages.length) return "";

  const lastReadTime = Date.parse(readBefore?.readAt || readBefore?.updatedTime || "");
  if (Number.isFinite(lastReadTime)) {
    const firstUnread = inboundMessages.find((message) => {
      const timestamp = Date.parse(messageTimeValue(message) || "");
      return Number.isFinite(timestamp) && timestamp > lastReadTime + 1000;
    });
    if (firstUnread) return messageAnchorId(firstUnread);
  }

  const count = Math.max(0, Number(unreadCount) || 0);
  if (count > 0) {
    const index = Math.max(0, inboundMessages.length - count);
    return messageAnchorId(inboundMessages[index]);
  }

  return "";
}

function shouldLoadContactsForCurrentPage() {
  const pageId = currentFlowPageId();
  return Boolean(pageId && contactStore.pageId !== pageId && !contactStore.loading);
}

async function loadContactsForPage(pageId) {
  const normalizedPageId = normalizeFlowPageId(pageId);
  contactStore = {
    ...contactStore,
    pageId: normalizedPageId,
    loading: true,
    status: "Carregando D1"
  };

  try {
    const result = await apiGet(`/api/contacts?pageId=${encodeURIComponent(normalizedPageId)}`);
    if (currentFlowPageId() !== normalizedPageId && activeView !== "subscribers") return;
    mergeContactsForPage(normalizedPageId, result.contacts || []);
    contactStore.serverAvailable = true;
    contactStore.status = "Contatos no D1";
    persistLocalState();
  } catch (error) {
    contactStore.serverAvailable = false;
    contactStore.status = contactStoreStatusFromError(error);
  } finally {
    contactStore.loading = false;
    if (["subscribers", "inbox", "broadcasts"].includes(activeView)) render();
    renderPageSwitcher();
    renderNav();
  }
}

function mergeContactsForPage(pageId, contacts) {
  const normalizedPageId = normalizeFlowPageId(pageId);
  const byKey = new Map(state.contacts.map((contact) => [`${normalizeFlowPageId(contact.pageId)}:${contact.psid}`, contact]));

  contacts.forEach((contact) => {
    const normalized = normalizeContactRecord(contact, normalizedPageId);
    const key = `${normalized.pageId}:${normalized.psid}`;
    const existing = byKey.get(key);
    if (existing) {
      Object.assign(existing, normalized, {
        messages: existing.messages?.length ? existing.messages : normalized.messages
      });
    } else {
      state.contacts.push(normalized);
    }
  });
}

function mergeConversationsAsContacts(pageId, pageName, conversations) {
  const normalizedPageId = normalizeFlowPageId(pageId);
  let changed = false;

  conversations.forEach((conversation) => {
    const psid = recipientIdFromConversation(conversation, normalizedPageId);
    if (!psid) return;

    const existing = state.contacts.find((contact) => normalizeFlowPageId(contact.pageId) === normalizedPageId && contact.psid === psid);
    const title = conversationTitle(conversation, pageName);
    const next = normalizeContactRecord(
      {
        id: existing?.id || `${normalizedPageId}:${psid}`,
        pageId: normalizedPageId,
        psid,
        name: isTechnicalContactName(title, psid) ? existing?.name || "" : title,
        status: existing?.status || "open",
        source: "Messenger",
        tags: existing ? contactTags(existing) : [],
        lastSeen: conversation.updated_time || existing?.lastSeen || new Date().toISOString(),
        messages: existing?.messages || []
      },
      normalizedPageId
    );

    if (existing) {
      Object.assign(existing, next, { messages: existing.messages || [] });
    } else {
      state.contacts.push(next);
    }
    changed = true;
  });

  if (changed) persistLocalState();
}

function selectedPageName(pageId) {
  const page = metaState.pages?.find((item) => item.id === pageId);
  return page?.name || state.settings.pageName || "Pagina";
}

function contactStoreStatusFromError(error) {
  if (error.status === 401) return "Local: faça login";
  if (error.status === 501) return "Local: configure D1";
  return `Local: ${error.message || "sem servidor"}`;
}

function refreshContacts() {
  contactStore.pageId = "";
  contactStore.serverAvailable = null;
  loadContactsForPage(currentFlowPageId());
  render();
}

async function syncContactToServer(contact, payload = {}) {
  if (!contact?.pageId || contact.pageId === DEFAULT_FLOW_PAGE_ID) return;

  try {
    const result = await apiPost("/api/contacts", {
      pageId: contact.pageId,
      contact: serializeContact(contact),
      ...payload
    });
    if (result.contact) Object.assign(contact, normalizeContactRecord(result.contact, contact.pageId), { messages: contact.messages || [] });
    contactStore.serverAvailable = true;
    contactStore.pageId = contact.pageId;
    contactStore.status = "Contatos no D1";
    persistLocalState();
    renderPageSwitcher();
    renderNav();
  } catch (error) {
    contactStore.serverAvailable = false;
    contactStore.status = contactStoreStatusFromError(error);
    toastMessage(`Contato ficou local: ${contactStore.status}`);
  }
}

async function logoutFacebook() {
  try {
    await apiPost("/api/auth/logout", {});
  } catch {
    // Ignore logout failures on purpose; local UI state still needs to reset.
  }

  clearDashboardCache();
  metaState = {
    authChecked: true,
    loadingProfile: false,
    profile: null,
    profileFromCache: false,
    loadingPages: false,
    pages: null,
    pagesFromCache: false,
    pageDebug: null,
    selectedPageId: "",
    conversations: null,
    conversationsPageId: "",
    conversationsFromCachePageId: "",
    loadingConversationsPageId: "",
    selectedConversationId: "",
    messages: null,
    pixelEvents: null,
    attributionEvents: null,
    loadingMessages: false,
    error: ""
  };
  attributionSourceState = {
    initialized: false,
    loading: false,
    query: "",
    sources: [],
    error: ""
  };
  render();
}

function selectMetaPage(pageId) {
  cacheCurrentPageFlows();
  const page = metaState.pages?.find((item) => item.id === pageId);
  if (!page) return;
  applySelectedMetaPage(page);
  clearSelectedMetaConversation();

  subscriberTagFilter = "";
  setActiveFlowsForPage(page.id);
  persistLocalState();
  flowStore.pageId = "";
  contactStore.pageId = "";
  customFieldStore.pageId = "";
  pixelState.pageId = "";
  jsonTemplateState = { pageId: "", loading: false, templates: [], error: "" };
  hydrateCachedFlowsForPage(page.id);
  hydrateCachedConversationsForPage(page.id);
  loadFlowsForPage(page.id);
  loadContactsForPage(page.id);

  render();
}

function selectSidebarPage(pageId) {
  cacheCurrentPageFlows();
  const page = metaState.pages?.find((item) => item.id === pageId);
  if (!page) return;

  applySelectedMetaPage(page);
  clearSelectedMetaConversation();
  subscriberTagFilter = "";
  setActiveFlowsForPage(page.id);
  selectedNodeId = state.flows[0]?.nodes[0]?.id;
  flowCanvasOpen = false;
  flowCanvasMode = "edit";
  showInspector = false;
  triggerPickerNodeId = "";
  nextStepPickerNodeId = "";
  flowStore.pageId = "";
  contactStore.pageId = "";
  customFieldStore.pageId = "";
  pixelState.pageId = "";
  jsonTemplateState = { pageId: "", loading: false, templates: [], error: "" };
  hydrateCachedFlowsForPage(page.id);
  hydrateCachedConversationsForPage(page.id);
  persistLocalState();
  loadContactsForPage(page.id);
  render();
}

function refreshMetaConversations() {
  if (!metaState.selectedPageId) return;
  const pageId = normalizeFlowPageId(metaState.selectedPageId);
  removeDashboardCache("conversationsByPage", pageId);
  metaState.conversations = null;
  metaState.conversationsPageId = "";
  metaState.conversationsFromCachePageId = "";
  metaState.loadingConversationsPageId = "";
  metaState.messages = null;
  metaState.pixelEvents = null;
  metaState.attributionEvents = null;
  metaState.unreadAnchorId = "";
  render();
}

function selectMetaConversation(conversationId) {
  const pageId = metaState.selectedPageId || state.settings.pageId;
  if (normalizeFlowPageId(metaState.conversationsPageId) !== normalizeFlowPageId(pageId)) return;
  metaState.selectedConversationId = conversationId;
  metaState.messages = null;
  metaState.pixelEvents = null;
  metaState.attributionEvents = null;
  metaState.unreadAnchorId = "";
  hydrateCachedMessagesForConversation(pageId, conversationId);
  render();
}

async function sendMetaMessage() {
  const page = metaState.pages?.find((item) => item.id === metaState.selectedPageId);
  const conversation = page && normalizeFlowPageId(metaState.conversationsPageId) === normalizeFlowPageId(page.id)
    ? metaState.conversations?.find((item) => item.id === metaState.selectedConversationId)
    : null;
  const textarea = document.querySelector("#metaComposerText");
  const text = textarea?.value.trim();
  const psid = conversation ? recipientIdFromConversation(conversation, page?.id) : "";

  if (!page || !conversation || !text) return;
  if (!psid) {
    toastMessage("Não encontrei o PSID do destinatário nesta conversa.");
    return;
  }

  try {
    await apiPost("/api/meta/send", { pageId: page.id, psid, text, lastSeen: conversation.updated_time || "" });
    textarea.value = "";
    removeDashboardCache("messagesByConversation", conversationCacheKey(page.id, conversation.id));
    metaState.messages = null;
    metaState.pixelEvents = null;
    metaState.attributionEvents = null;
    metaState.unreadAnchorId = "";
    toastMessage("Mensagem enviada pelo Messenger.");
    render();
  } catch (error) {
    toastMessage(error.message);
  }
}

async function runMetaConversationFlow() {
  const page = metaState.pages?.find((item) => item.id === metaState.selectedPageId);
  const conversation = page && normalizeFlowPageId(metaState.conversationsPageId) === normalizeFlowPageId(page.id)
    ? metaState.conversations?.find((item) => item.id === metaState.selectedConversationId)
    : null;
  const select = document.querySelector("#metaConversationFlowSelect");
  const flowId = String(select?.value || "").trim();
  const psid = conversation ? recipientIdFromConversation(conversation, page?.id) : "";

  if (!page || !conversation || !flowId) {
    toastMessage("Selecione uma conversa e um fluxo ativo.");
    return;
  }
  if (!psid) {
    toastMessage("Nao encontrei o PSID do destinatario nesta conversa.");
    return;
  }

  const button = document.querySelector('[data-action="run-meta-flow"]');
  if (button) button.disabled = true;

  try {
    const result = await apiPost("/api/flow-runtime/run", {
      pageId: page.id,
      psid,
      flowId,
      lastSeen: conversation.updated_time || "",
      conversationId: conversation.id || "",
      contactName: conversationTitle(conversation, page.name)
    });
    metaState.messages = null;
    metaState.pixelEvents = null;
    metaState.attributionEvents = null;
    metaState.unreadAnchorId = "";
    toastMessage(result.message || "Fluxo disparado para esta conversa.");
    render();
  } catch (error) {
    toastMessage(error.message || "Nao foi possivel disparar o fluxo.");
  } finally {
    if (button) button.disabled = false;
  }
}

function openPageFlow() {
  cacheCurrentPageFlows();
  const page = metaState.pages?.find((item) => item.id === metaState.selectedPageId);
  if (page) {
    applySelectedMetaPage(page);
    setActiveFlowsForPage(page.id);
    persistLocalState();
    flowStore.pageId = "";
    contactStore.pageId = "";
    customFieldStore.pageId = "";
    pixelState.pageId = "";
    jsonTemplateState = { pageId: "", loading: false, templates: [], error: "" };
    hydrateCachedFlowsForPage(page.id);
    hydrateCachedConversationsForPage(page.id);
    loadContactsForPage(page.id);
  }
  navigate("flows");
}

async function loadFlowsForPage(pageId) {
  const normalizedPageId = normalizeFlowPageId(pageId);
  const localFlows = localFlowsForPage(normalizedPageId);
  const hasCachedFlows = hydrateCachedFlowsForPage(normalizedPageId);
  if (!hasCachedFlows) setActiveFlowsForPage(normalizedPageId, localFlows);

  flowStore = {
    ...flowStore,
    pageId: normalizedPageId,
    loading: true,
    status: hasCachedFlows ? "Atualizando D1" : "Carregando D1"
  };

  try {
    const result = await apiGet(`/api/flows?pageId=${encodeURIComponent(normalizedPageId)}`);
    if (currentFlowPageId() !== normalizedPageId) return;

    flowStore.serverAvailable = true;

    if (Array.isArray(result.flows) && result.flows.length) {
      setActiveFlowsForPage(normalizedPageId, result.flows);
      setDashboardCache("flowsByPage", normalizedPageId, result.flows);
      persistLocalState();
      flowStore.status = "Salvo no D1";
    } else if (localFlows.length) {
      flowStore.status = "Rascunhos locais desta pagina";
    } else {
      setActiveFlowsForPage(normalizedPageId, []);
      setDashboardCache("flowsByPage", normalizedPageId, []);
      persistLocalState();
      flowStore.status = "D1 sem fluxos";
    }
  } catch (error) {
    if (currentFlowPageId() !== normalizedPageId) return;
    flowStore.serverAvailable = false;
    flowStore.status = flowStoreStatusFromError(error);
  } finally {
    if (currentFlowPageId() === normalizedPageId) {
      flowStore.loading = false;
      if (activeView === "flows" || activeView === "settings" || activeView === "pages" || activeView === "broadcasts") render();
    }
  }
}

async function loadFlowMetrics(pageId, flowId, options = {}) {
  const normalizedPageId = normalizeFlowPageId(pageId);
  const normalizedFlowId = String(flowId || "").trim();
  if (!normalizedFlowId || (flowMetricState.loading && !options.force)) return;
  const keepCurrentMetrics = flowMetricState.pageId === normalizedPageId && flowMetricState.flowId === normalizedFlowId;

  flowMetricState = {
    ...flowMetricState,
    pageId: normalizedPageId,
    flowId: normalizedFlowId,
    loading: true,
    metrics: keepCurrentMetrics ? flowMetricState.metrics : null,
    error: ""
  };

  try {
    const result = await apiGet(`/api/flow-metrics?pageId=${encodeURIComponent(normalizedPageId)}&flowId=${encodeURIComponent(normalizedFlowId)}`);
    if (selectedFlowId !== normalizedFlowId || currentFlowPageId() !== normalizedPageId) return;
    flowMetricState = {
      pageId: normalizedPageId,
      flowId: normalizedFlowId,
      loading: false,
      metrics: result.metrics || null,
      error: ""
    };
  } catch (error) {
    if (selectedFlowId !== normalizedFlowId || currentFlowPageId() !== normalizedPageId) return;
    flowMetricState = {
      pageId: normalizedPageId,
      flowId: normalizedFlowId,
      loading: false,
      metrics: null,
      error: error.message || "Não foi possível carregar as métricas."
    };
  } finally {
    if (selectedFlowId === normalizedFlowId && currentFlowPageId() === normalizedPageId && activeView === "flows" && flowCanvasOpen && flowCanvasMode === "published") {
      render();
    }
  }
}

async function loadCustomFieldsForPage(pageId) {
  const normalizedPageId = normalizeFlowPageId(pageId);
  customFieldStore = {
    ...customFieldStore,
    pageId: normalizedPageId,
    loading: true,
    status: "Carregando D1"
  };

  try {
    const result = await apiGet(`/api/custom-fields?pageId=${encodeURIComponent(normalizedPageId)}`);
    if (currentFlowPageId() !== normalizedPageId) return;
    mergeCustomFieldsForPage(normalizedPageId, result.fields || []);
    customFieldStore.serverAvailable = true;
    customFieldStore.status = "Campos no D1";
    persistLocalState();
  } catch (error) {
    if (currentFlowPageId() !== normalizedPageId) return;
    customFieldStore.serverAvailable = false;
    customFieldStore.status = flowStoreStatusFromError(error);
  } finally {
    if (currentFlowPageId() === normalizedPageId) {
      customFieldStore.loading = false;
      if (activeView === "settings" || activeView === "subscribers" || (activeView === "flows" && showInspector)) render();
    }
  }
}

async function saveCustomFieldForPage(field, pageId = currentFlowPageId()) {
  const normalizedPageId = normalizeFlowPageId(pageId);
  const localField = normalizeCustomFieldRecord(field);
  if (!localField.name) return null;

  mergeCustomFieldsForPage(normalizedPageId, [localField]);
  persistLocalState();

  if (normalizedPageId === DEFAULT_FLOW_PAGE_ID) return localField;

  try {
    const result = await apiPost("/api/custom-fields", { pageId: normalizedPageId, field: localField });
    const saved = normalizeCustomFieldRecord(result.field || localField);
    mergeCustomFieldsForPage(normalizedPageId, [saved]);
    customFieldStore = {
      ...customFieldStore,
      pageId: normalizedPageId,
      serverAvailable: true,
      status: "Campos no D1"
    };
    persistLocalState();
    return saved;
  } catch (error) {
    customFieldStore = {
      ...customFieldStore,
      pageId: normalizedPageId,
      serverAvailable: false,
      status: flowStoreStatusFromError(error)
    };
    toastMessage("Campo salvo localmente. O D1 nao respondeu.");
    return localField;
  }
}

async function removeCustomFieldForPage(fieldId, pageId = currentFlowPageId()) {
  const normalizedPageId = normalizeFlowPageId(pageId);
  const fields = customFieldRecordsForPage(normalizedPageId);
  state.customFieldsByPage[normalizedPageId] = fields.filter((field) => field.id !== fieldId);
  persistLocalState();
  render();

  if (normalizedPageId === DEFAULT_FLOW_PAGE_ID) return;

  try {
    await apiDelete(`/api/custom-fields?pageId=${encodeURIComponent(normalizedPageId)}&id=${encodeURIComponent(fieldId)}`);
    customFieldStore = {
      ...customFieldStore,
      pageId: normalizedPageId,
      serverAvailable: true,
      status: "Campos no D1"
    };
  } catch (error) {
    customFieldStore = {
      ...customFieldStore,
      pageId: normalizedPageId,
      serverAvailable: false,
      status: flowStoreStatusFromError(error)
    };
    toastMessage("Campo removido localmente. O D1 nao respondeu.");
  }
}

function scheduleFlowSave() {
  if (activeView !== "flows") return;
  if (flowStore.loading) return;

  const flow = selectedFlow();
  if (!flow) return;

  window.clearTimeout(flowStore.saveTimer);
  flowStore.saveTimer = window.setTimeout(() => {
    syncFlowToServer(flow);
  }, 650);
}

async function syncFlowToServer(flow, options = {}) {
  const pageId = currentFlowPageId();
  if (!options.force && flowStore.serverAvailable === false && flowStore.pageId === pageId) return false;

  try {
    flow.pageId = pageId;
    await apiPost("/api/flows", { pageId, flow });
    flowStore.serverAvailable = true;
    flowStore.pageId = pageId;
    flowStore.status = "Salvo no D1";
    setDashboardCache("flowsByPage", pageId, state.flows);
    updateSyncPill();
    return true;
  } catch (error) {
    flowStore.serverAvailable = false;
    flowStore.status = flowStoreStatusFromError(error);
    updateSyncPill();
    return false;
  }
}

async function syncAllFlowsToServer() {
  const pageId = currentFlowPageId();
  if (!state.flows.length) return true;

  try {
    state.flows.forEach((flow) => {
      flow.pageId = pageId;
    });
    await apiPost("/api/flows", { pageId, flows: state.flows });
    flowStore.serverAvailable = true;
    flowStore.pageId = pageId;
    flowStore.status = "Fluxos salvos no D1";
    setDashboardCache("flowsByPage", pageId, state.flows);
    updateSyncPill();
    return true;
  } catch (error) {
    flowStore.serverAvailable = false;
    flowStore.status = flowStoreStatusFromError(error);
    updateSyncPill();
    return false;
  }
}

async function loadFlowLogsForPage(pageId = currentFlowPageId(), options = {}) {
  const normalizedPageId = normalizeFlowPageId(pageId);
  flowLogState = {
    ...flowLogState,
    pageId: normalizedPageId,
    loading: true,
    error: options.keepError ? flowLogState.error : ""
  };
  if (activeView === "settings" && !options.silent) render();

  try {
    const result = await apiGet(`/api/flow-logs?pageId=${encodeURIComponent(normalizedPageId)}&limit=120`);
    if (flowLogState.pageId !== normalizedPageId) return;
    flowLogState.logs = Array.isArray(result.logs) ? result.logs : [];
    flowLogState.error = "";
  } catch (error) {
    if (flowLogState.pageId !== normalizedPageId) return;
    flowLogState.logs = [];
    flowLogState.error = error.message || "Erro ao carregar logs";
  } finally {
    if (flowLogState.pageId === normalizedPageId) {
      flowLogState.loading = false;
      if (activeView === "settings") render();
    }
  }
}

function refreshFlowLogs() {
  return loadFlowLogsForPage(currentFlowLogPageId());
}

async function loadPixelEventsForPage(pageId = currentFlowPageId(), options = {}) {
  const normalizedPageId = normalizeFlowPageId(pageId);
  pixelState = {
    ...pixelState,
    pageId: normalizedPageId,
    loading: true,
    error: ""
  };
  if (activeView === "pixel" && !options.silent) render();

  try {
    const result = await apiGet(`/api/pixel/events?pageId=${encodeURIComponent(normalizedPageId)}&days=${encodeURIComponent(pixelState.rangeDays)}&limit=120`);
    if (pixelState.pageId !== normalizedPageId) return;
    pixelState.summary = result.summary || null;
    pixelState.events = Array.isArray(result.events) ? result.events : [];
    pixelState.error = "";
  } catch (error) {
    if (pixelState.pageId !== normalizedPageId) return;
    pixelState.summary = null;
    pixelState.events = [];
    pixelState.error = error.message || "Erro ao carregar eventos do pixel";
  } finally {
    if (pixelState.pageId === normalizedPageId) {
      pixelState.loading = false;
      if (activeView === "pixel") render();
    }
  }
}

async function loadMediaAssetsForPage(pageId = currentFlowPageId(), options = {}) {
  const normalizedPageId = normalizeFlowPageId(pageId);
  mediaState = {
    ...mediaState,
    pageId: normalizedPageId,
    loading: true,
    error: options.keepError ? mediaState.error : ""
  };
  if (activeView === "media" && !options.silent) render();

  try {
    const result = await apiGet(`/api/media?pageId=${encodeURIComponent(normalizedPageId)}&limit=160`);
    if (mediaState.pageId !== normalizedPageId) return;
    mediaState.assets = Array.isArray(result.assets) ? result.assets : [];
    mediaState.error = result.hasR2 === false ? "Configure o binding R2 MEDIA_BUCKET para enviar arquivos." : "";
  } catch (error) {
    if (mediaState.pageId !== normalizedPageId) return;
    mediaState.assets = [];
    mediaState.error = error.message || "Erro ao carregar midia";
  } finally {
    if (mediaState.pageId === normalizedPageId) {
      mediaState.loading = false;
      if (activeView === "media") render();
    }
  }
}

async function loadAttributionsForPage(pageId = currentFlowPageId(), options = {}) {
  const normalizedPageId = normalizeFlowPageId(pageId);
  attributionState = {
    ...attributionState,
    pageId: normalizedPageId,
    loading: true,
    error: ""
  };
  if (activeView === "settings" && !options.silent) render();

  try {
    const result = await apiGet(`/api/messenger-attributions?pageId=${encodeURIComponent(normalizedPageId)}&limit=160`);
    if (attributionState.pageId !== normalizedPageId) return;
    attributionState.events = Array.isArray(result.events) ? result.events : [];
    attributionState.error = "";
  } catch (error) {
    if (attributionState.pageId !== normalizedPageId) return;
    attributionState.events = [];
    attributionState.error = error.message || "Erro ao carregar atribuicoes";
  } finally {
    if (attributionState.pageId === normalizedPageId) {
      attributionState.loading = false;
      if (activeView === "settings") render();
    }
  }
}

async function loadAttributionSources(options = {}) {
  const query = String(options.query ?? searchQuery ?? "").trim().toLowerCase();
  attributionSourceState = {
    ...attributionSourceState,
    loading: true,
    query,
    error: ""
  };
  if (activeView === "origins" && !options.silent) render();

  try {
    const result = await apiGet(`/api/messenger-attributions?view=sources&limit=500&q=${encodeURIComponent(query)}`);
    if (attributionSourceState.query !== query) return;
    attributionSourceState.sources = Array.isArray(result.sources) ? result.sources : [];
    attributionSourceState.initialized = true;
    attributionSourceState.error = "";
  } catch (error) {
    if (attributionSourceState.query !== query) return;
    attributionSourceState.sources = [];
    attributionSourceState.initialized = true;
    attributionSourceState.error = error.message || "Erro ao carregar origens";
  } finally {
    if (attributionSourceState.query === query) {
      attributionSourceState.loading = false;
      if (activeView === "origins") render();
    }
  }
}

async function loadJsonTemplatesForPage(pageId = currentFlowPageId(), options = {}) {
  const normalizedPageId = normalizeFlowPageId(pageId);
  jsonTemplateState = {
    ...jsonTemplateState,
    pageId: normalizedPageId,
    loading: true,
    error: ""
  };
  if (activeView === "json_templates" && !options.silent) render();

  try {
    const result = await apiGet(`/api/json-templates?pageId=${encodeURIComponent(normalizedPageId)}`);
    if (jsonTemplateState.pageId !== normalizedPageId) return;
    jsonTemplateState.templates = Array.isArray(result.templates) ? result.templates : [];
    jsonTemplateState.error = "";
  } catch (error) {
    if (jsonTemplateState.pageId !== normalizedPageId) return;
    jsonTemplateState.templates = [];
    jsonTemplateState.error = error.message || "Erro ao carregar JSON Templates";
  } finally {
    if (jsonTemplateState.pageId === normalizedPageId) {
      jsonTemplateState.loading = false;
      if (activeView === "json_templates") render();
    }
  }
}

function openJsonTemplateModal(template = null) {
  const editing = Boolean(template?.id);
  openFormModal({
    title: editing ? "Editar JSON Template" : "Novo JSON Template",
    description: "O JSON sera validado antes de ser salvo no D1.",
    submitLabel: editing ? "Salvar alteracoes" : "Criar template",
    className: "json-template-modal",
    fields: [
      { name: "name", label: "Nome", required: true, value: template?.name || "", placeholder: "Ex.: Entrada Click-to-Messenger" },
      { name: "description", label: "Descricao", value: template?.description || "", placeholder: "Uso interno deste template" },
      { name: "jsonText", label: "JSON", type: "textarea", rows: 18, required: true, value: template?.jsonText || "{\n  \"messages\": []\n}" }
    ],
    onSubmit: async (values) => {
      validateJsonTemplateText(values.jsonText);
      await saveJsonTemplateForPage({
        ...template,
        name: values.name,
        description: values.description,
        jsonText: values.jsonText
      });
    }
  });
}

async function saveJsonTemplateForPage(template, pageId = currentFlowPageId()) {
  const normalizedPageId = normalizeFlowPageId(pageId);
  const result = await apiPost("/api/json-templates", {
    pageId: normalizedPageId,
    template
  });
  const saved = result.template;
  jsonTemplateState = {
    ...jsonTemplateState,
    pageId: normalizedPageId,
    templates: [
      saved,
      ...jsonTemplateState.templates.filter((item) => item.id !== saved.id)
    ],
    error: ""
  };
  toastMessage("JSON Template salvo no D1.");
  if (activeView === "json_templates") render();
  return saved;
}

async function createDefaultJsonTemplate() {
  const description = "Template generico reutilizavel em anuncios Click-to-Messenger de qualquer Pagina.";
  const existing = jsonTemplateState.templates.find((template) => template.name === "Entrada Click-to-Messenger");
  if (existing) {
    openJsonTemplateModal({
      ...existing,
      description,
      jsonText: adEntryTemplateJson()
    });
    return;
  }

  try {
    await saveJsonTemplateForPage({
      name: "Entrada Click-to-Messenger",
      description,
      jsonText: adEntryTemplateJson()
    });
  } catch (error) {
    toastMessage(error.message || "Nao foi possivel criar o template inicial.");
  }
}

function editJsonTemplate(templateId) {
  const template = jsonTemplateState.templates.find((item) => item.id === templateId);
  if (!template) return toastMessage("JSON Template nao encontrado.");
  openJsonTemplateModal(template);
}

function copyJsonTemplate(templateId) {
  const template = jsonTemplateState.templates.find((item) => item.id === templateId);
  if (!template) return toastMessage("JSON Template nao encontrado.");
  return copyText(template.jsonText, "JSON Template copiado.");
}

function confirmDeleteJsonTemplate(templateId) {
  const template = jsonTemplateState.templates.find((item) => item.id === templateId);
  if (!template) return;
  openConfirmModal({
    title: "Excluir JSON Template",
    message: `Excluir ${template.name}? Esta acao remove o template salvo nesta Pagina.`,
    submitLabel: "Excluir",
    danger: true,
    onConfirm: () => removeJsonTemplateForPage(templateId)
  });
}

async function removeJsonTemplateForPage(templateId, pageId = currentFlowPageId()) {
  const normalizedPageId = normalizeFlowPageId(pageId);
  try {
    await apiDelete(`/api/json-templates?pageId=${encodeURIComponent(normalizedPageId)}&id=${encodeURIComponent(templateId)}`);
    if (jsonTemplateState.pageId === normalizedPageId) {
      jsonTemplateState.templates = jsonTemplateState.templates.filter((template) => template.id !== templateId);
    }
    toastMessage("JSON Template excluido.");
    if (activeView === "json_templates") render();
  } catch (error) {
    toastMessage(error.message || "Nao foi possivel excluir o JSON Template.");
  }
}

function validateJsonTemplateText(value) {
  const text = String(value || "").trim();
  if (!text) throw new Error("O JSON e obrigatorio.");
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("O JSON informado e invalido.");
  }
  if (!parsed || typeof parsed !== "object") throw new Error("O JSON precisa ser um objeto ou array.");
  return parsed;
}

async function testFlowLog() {
  const pageId = currentFlowPageId();
  try {
    await apiPost("/api/flow-logs", { pageId });
    toastMessage("Log de teste criado.");
    await loadFlowLogsForPage(pageId);
  } catch (error) {
    toastMessage(error.message || "Não foi possível criar log de teste.");
  }
}

async function processMessengerQueue() {
  const pageId = currentFlowPageId();
  try {
    const result = await apiPost("/api/messenger/queue", { pageId });
    const continuations = Number(result?.continuations?.resumed || 0);
    const sent = Number(result?.result?.sent || 0);
    toastMessage(`Fila processada: ${continuations} espera(s) retomada(s), ${sent} envio(s) local(is).`);
    await loadFlowLogsForPage(currentFlowLogPageId());
  } catch (error) {
    toastMessage(error.message || "Nao foi possivel processar a fila.");
  }
}

async function testAdFlow(channel = "messaging") {
  const pageId = currentFlowPageId();
  const flowId = currentAdTestFlowId(pageId);
  const testVersion = currentAdTestVersion();
  const psid = currentAdTestContactPsid(pageId);
  const selectedAdTestValue = psid;
  const selectedTag = currentAdTestTag(pageId);
  const tagMode = currentAdTestTagMode();
  const referralLocation = currentAdTestReferralLocation();
  if (!pageId || pageId === DEFAULT_FLOW_PAGE_ID) {
    toastMessage("Selecione uma Pagina antes de simular anuncio.");
    return;
  }
  if (!flowId) {
    toastMessage("Escolha um fluxo salvo para testar.");
    return;
  }
  if (!psid) {
    toastMessage(`Nenhum contato com a tag ${AD_TEST_CONTACT_TAG} para testar.`);
    return;
  }
  if (!selectedTag) {
    toastMessage(`Escolha uma tag diferente de ${AD_TEST_CONTACT_TAG} para testar.`);
    return;
  }

  flowAdTestState = {
    loading: true,
    channel,
    flowId,
    testVersion,
    psid: selectedAdTestValue,
    tag: selectedTag,
    tagMode,
    referralLocation,
    result: null,
    logs: [],
    error: ""
  };
  if (activeView === "settings") render();

  try {
    const result = await apiPost("/api/flow-runtime/test-ad", {
      pageId,
      flowId,
      testVersion,
      psid,
      testTag: selectedTag,
      testTagMode: tagMode,
      referralLocation,
      channel,
      text: "Hola"
    });
    const logsResult = await apiGet(`/api/flow-logs?pageId=${encodeURIComponent(pageId)}&limit=160`);
    const logs = Array.isArray(logsResult.logs) ? logsResult.logs.filter((log) => log.psid === result.psid) : [];
    flowAdTestState = {
      loading: false,
      channel,
      flowId,
      testVersion,
      psid: selectedAdTestValue,
      tag: selectedTag,
      tagMode,
      referralLocation,
      result,
      logs,
      error: ""
    };
    flowLogState = {
      ...flowLogState,
      pageId,
      loading: false,
      logs: Array.isArray(logsResult.logs) ? logsResult.logs : [],
      error: ""
    };
    toastMessage(result.ok ? "Teste de anuncio concluido." : "Simulacao enviada.");
  } catch (error) {
    flowAdTestState = {
      loading: false,
      channel,
      flowId,
      testVersion,
      psid: selectedAdTestValue,
      tag: selectedTag,
      tagMode,
      referralLocation,
      result: null,
      logs: [],
      error: error.message || "Nao foi possivel simular anuncio."
    };
    toastMessage(error.message || "Nao foi possivel simular anuncio.");
  } finally {
    if (activeView === "settings") render();
  }
}

async function checkWebhookSubscription() {
  const pageId = currentFlowPageId();
  webhookDiagState = { pageId, loading: true, data: null, error: "" };
  if (activeView === "settings") render();

  try {
    const data = await apiGet(`/api/debug/webhook?pageId=${encodeURIComponent(pageId)}`);
    webhookDiagState = { pageId, loading: false, data, error: "" };
  } catch (error) {
    webhookDiagState = { pageId, loading: false, data: null, error: error.message || "Erro ao verificar webhook" };
  }

  if (activeView === "settings") render();
}

async function subscribePageWebhook() {
  const pageId = currentFlowPageId();
  webhookDiagState = { pageId, loading: true, data: null, error: "" };
  if (activeView === "settings") render();

  try {
    const data = await apiPost("/api/debug/webhook", { pageId });
    webhookDiagState = { pageId, loading: false, data, error: "" };
    toastMessage(data.isCurrentAppSubscribed ? "Página inscrita no webhook." : "A Meta não confirmou a inscrição.");
    await loadFlowLogsForPage(pageId, { silent: true });
  } catch (error) {
    webhookDiagState = { pageId, loading: false, data: null, error: error.message || "Erro ao inscrever Página" };
    toastMessage(webhookDiagState.error);
  }

  if (activeView === "settings") render();
}

async function setupGetStartedButton() {
  const pageId = currentFlowPageId();
  if (!pageId || pageId === DEFAULT_FLOW_PAGE_ID) {
    toastMessage("Selecione uma Pagina antes de ativar Comecar.");
    return;
  }

  try {
    const data = await apiPost("/api/meta/messenger-profile", { pageId, payload: "GET_STARTED" });
    toastMessage(data?.ok ? "Botao Comecar ativado com GET_STARTED." : "Solicitacao enviada para a Meta.");
  } catch (error) {
    toastMessage(error.message || "Nao foi possivel ativar Comecar.");
  }
}

async function checkGetStartedButton() {
  const pageId = currentFlowPageId();
  if (!pageId || pageId === DEFAULT_FLOW_PAGE_ID) {
    toastMessage("Selecione uma Pagina para verificar Comecar.");
    return;
  }

  try {
    const data = await apiGet(`/api/meta/messenger-profile?pageId=${encodeURIComponent(pageId)}`);
    const payload = data?.profile?.get_started?.payload || "";
    toastMessage(payload ? `Comecar ativo: ${payload}` : "Comecar ainda nao esta configurado.");
  } catch (error) {
    toastMessage(error.message || "Nao foi possivel verificar Comecar.");
  }
}

async function clearFlowLogs() {
  const pageId = currentFlowLogPageId();
  openConfirmModal({
    title: "Limpar logs",
    message: pageId === "__all__" ? "Apagar todos os logs de fluxo de todas as Páginas?" : "Apagar todos os logs de fluxo desta Página?",
    submitLabel: "Limpar",
    danger: true,
    onConfirm: async () => {
      try {
        await apiDelete(`/api/flow-logs?pageId=${encodeURIComponent(pageId)}`);
        flowLogState = { ...flowLogState, pageId, loading: false, logs: [], error: "" };
        render();
      } catch (error) {
        toastMessage(error.message || "Não foi possível limpar os logs.");
      }
    }
  });
}

function setFlowLogScope(scope) {
  flowLogState = {
    ...flowLogState,
    scope: scope === "all" ? "all" : "current",
    pageId: ""
  };
  return loadFlowLogsForPage(currentFlowLogPageId());
}

function setFlowLogFilter(filter) {
  flowLogState = {
    ...flowLogState,
    filter: ["ad_entry", "received", "issues"].includes(filter) ? filter : "all"
  };
  render();
}

function currentFlowLogPageId() {
  return flowLogState.scope === "all" ? "__all__" : currentFlowPageId();
}

async function deleteFlowFromServer(flowId, pageId) {
  if (!flowId) return;

  const response = await fetch(`/api/flows?pageId=${encodeURIComponent(pageId)}&flowId=${encodeURIComponent(flowId)}`, {
    method: "DELETE",
    credentials: "same-origin"
  });
  await parseApiResponse(response);
  flowStore.serverAvailable = true;
  flowStore.pageId = pageId;
}

function currentFlowPageId() {
  return normalizeFlowPageId(metaState.selectedPageId || state.settings.pageId);
}

function flowStoreStatusFromError(error) {
  if (error.status === 401) return "Local: faça login";
  if (error.status === 501) return "Local: configure D1";
  return `Local: ${error.message || "sem servidor"}`;
}

function updateSyncPill() {
  const pill = document.querySelector(".sync-pill");
  if (!pill) return;
  pill.textContent = flowStore.status;
  pill.classList.toggle("synced", Boolean(flowStore.serverAvailable));
  pill.classList.toggle("local", !flowStore.serverAvailable);
}

async function apiGet(path) {
  const response = await fetch(path, { credentials: "same-origin" });
  return parseApiResponse(response);
}

async function apiPost(path, payload) {
  const response = await fetch(path, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return parseApiResponse(response);
}

async function apiPostForm(path, formData) {
  const response = await fetch(path, {
    method: "POST",
    credentials: "same-origin",
    body: formData
  });
  return parseApiResponse(response);
}

async function apiDelete(path) {
  const response = await fetch(path, {
    method: "DELETE",
    credentials: "same-origin"
  });
  return parseApiResponse(response);
}

async function parseApiResponse(response) {
  const text = await response.text();
  const payload = text ? safeJson(text) : {};

  if (!response.ok) {
    const error = new Error(payload?.error || payload?.message || text || `HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }

  return payload || {};
}

function renderTriggerPicker(flow) {
  const node = triggerPickerNodeId ? flow.nodes.find((item) => item.id === triggerPickerNodeId) : null;
  if (!node) return "";
  const activeTriggers = nodeTriggerEvents(node);

  return `
    <div class="trigger-picker-backdrop" aria-hidden="false">
      <section class="trigger-picker-panel" aria-label="Selecionar gatilho">
      <div class="trigger-picker-header">
        <div>
          <h2>Iniciar automação quando...</h2>
          <span>Escolha como este fluxo deve começar no Messenger.</span>
        </div>
        <button class="icon-button" type="button" data-action="close-trigger-picker" title="Fechar">&times;</button>
      </div>
      <div class="trigger-picker-body">
        <aside class="trigger-picker-tabs">
          <button class="active" type="button">${icons.message}<span>Messenger</span></button>
          <button type="button" disabled>${icons.users}<span>Eventos de contato</span></button>
        </aside>
        <div class="trigger-picker-list">
          ${triggerOptions
            .map((option) => {
              const active = activeTriggers.includes(option.id);
              return `
                <button class="trigger-option ${active ? "active" : ""}" type="button" data-action="add-trigger-event" data-id="${node.id}" data-trigger-id="${option.id}">
                  <span class="trigger-option-icon">${icons.message}</span>
                  <span>
                    <span>${escapeHtml(option.source)}</span>
                    <strong>${escapeHtml(option.title)}</strong>
                    <small>${escapeHtml(option.description)}</small>
                  </span>
                  ${active ? `<span class="badge">Ativo</span>` : ""}
                </button>
              `;
            })
            .join("")}
        </div>
      </div>
      </section>
    </div>
  `;
}

function renderNextStepPicker(flow) {
  const node = nextStepPickerNodeId ? flow.nodes.find((item) => item.id === nextStepPickerNodeId) : null;
  if (!node) return "";
  const existingNodes = flow.nodes.filter((item) => item.id !== node.id && canAcceptIncomingConnection(item));

  return `
    <section class="next-step-picker-panel" aria-label="Escolher próximo passo">
      <div class="next-step-picker-header">
        <strong>Escolher Próximo Passo</strong>
        <button class="icon-button" type="button" data-action="close-next-step-picker" title="Fechar">&times;</button>
      </div>
      <div class="next-step-choice-list">
        ${nextStepChoice("message", "Messenger", icons.message)}
        ${nextStepChoice("action", "Executar Ações", icons.action)}
        ${nextStepChoice("condition", "Condição", icons.condition)}
        ${nextStepChoice("user_input", "Aguardar resposta", icons.user_input)}
        ${nextStepChoice("link_click_wait", "Aguardar clique no link", icons.link_click_wait)}
        ${nextStepChoice("jump", "Selecionar passo existente", icons.jump)}
        ${nextStepChoice("randomizer", "Randomizador", icons.workflow)}
        ${nextStepChoice("delay", "Atraso Inteligente", icons.delay)}
        <div class="next-step-existing-group">
          <strong>Selecionar Passo Existente</strong>
          ${
            existingNodes.length
              ? existingNodes
                  .map(
                    (item) => `
                      <button class="next-step-choice existing" type="button" data-action="set-existing-next-step" data-id="${node.id}" data-target-id="${item.id}">
                        <span class="step-choice-icon">${icons[item.type] || icons.message}</span>
                        <span>${escapeHtml(item.title || nodeLabels[item.type] || "Bloco")}</span>
                      </button>
                    `
                  )
                  .join("")
              : `<span class="muted">Nenhum outro passo criado.</span>`
          }
        </div>
      </div>
    </section>
  `;
}

function nextStepChoice(type, label, icon) {
  return `
    <button class="next-step-choice" type="button" data-action="add-next-step" data-type="${type}">
      <span class="step-choice-icon">${icon}</span>
      <span>${escapeHtml(label)}</span>
    </button>
  `;
}

function renderInspector(flow, node) {
  if (node.type === "trigger") return renderTriggerSettings(flow, node);
  if (node.type === "message") return renderMessageSettingsManychatVisual(flow, node);
  if (node.type === "condition") return renderConditionSettings(flow, node);
  if (node.type === "delay") return renderDelaySettings(flow, node);
  if (node.type === "user_input") return renderUserInputSettings(flow, node);
  if (node.type === "link_click_wait") return renderLinkClickWaitSettings(flow, node);
  if (node.type === "jump") return renderJumpSettings(flow, node);
  if (node.type === "randomizer") return renderRandomizerSettings(flow, node);
  if (node.type === "comment") return renderCommentSettings(flow, node);
  return renderActionSettings(flow, node);
}

function nodeEditableTitle(flow, node, fallback = "Bloco") {
  const value = String(node?.title || "").trim();
  if (node?.type === "action") {
    const defaultTitle = `Ações #${nodeIndexByType(flow, node, "action")}`;
    return value && value !== nodeLabels.action ? value : defaultTitle;
  }
  if (node?.type === "trigger") return value || "Quando...";
  return value || fallback || nodeLabels[node?.type] || "Bloco";
}

function nodeIndexByType(flow, node, type) {
  const nodes = Array.isArray(flow?.nodes) ? flow.nodes : [];
  const index = nodes.filter((item) => item.type === type).findIndex((item) => item.id === node?.id);
  return index >= 0 ? index + 1 : 1;
}

function renderEditableNodeHeader(flow, node, options = {}) {
  const {
    className = "message-inspector-title",
    fallback = "Bloco",
    ariaLabel = "Nome do bloco"
  } = options;
  return `
    <div class="${attr(className)}">
      <input data-node-field="title" value="${attr(nodeEditableTitle(flow, node, fallback))}" aria-label="${attr(ariaLabel)}" />
      ${icons.edit}
    </div>
  `;
}

function renderEditableSettingsSectionHeader(flow, node, title, subtitle, icon) {
  return `
    <div class="settings-section-header editable-node-section-header">
      <span class="settings-section-icon">${icon}</span>
      <div>
        <label class="editable-node-title-row">
          <input data-node-field="title" value="${attr(nodeEditableTitle(flow, node, title))}" aria-label="${attr(`Nome do bloco ${title}`)}" />
          ${icons.edit}
        </label>
        <span>${escapeHtml(subtitle)}</span>
      </div>
    </div>
  `;
}

function updateCanvasNodeTitle(flow, node) {
  const title = nodeEditableTitle(flow, node, nodeLabels[node?.type] || "Bloco");
  document.querySelectorAll(`[data-node-title="${node.id}"]`).forEach((element) => {
    element.textContent = title;
  });
}

function nextNumberedName(value, existingValues = [], fallback = "Item") {
  const base = numberedNameBase(value, fallback);
  const pattern = new RegExp(`^${escapeRegExp(base)}(?:\\s+#(\\d+))?$`, "i");
  const max = existingValues.reduce((highest, item) => {
    const match = pattern.exec(String(item || "").trim());
    if (!match) return highest;
    return Math.max(highest, match[1] ? Number(match[1]) || 0 : 0);
  }, 0);
  return `${base} #${max + 1}`;
}

function numberedNameBase(value, fallback = "Item") {
  const text = String(value || "").trim() || fallback;
  return text.replace(/\s+#\d+$/u, "").trim() || fallback;
}

function escapeRegExp(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderPublishedNodeMetrics(flow, node) {
  if (node.type === "trigger") return renderPublishedTriggerMetrics(flow, node);
  if (node.type === "comment") return renderPublishedComment(node);

  const flowStarted = flowMetricValue("", "flow_started");
  const sent = flowMetricValue(node.id, "node_sent");
  const delivered = flowMetricValue(node.id, "node_delivered");
  const read = flowMetricValue(node.id, "node_read");
  const clicked = flowMetricValue(node.id, "node_clicked");
  const reached = node.type === "message" ? sent : { total: 0, unique: 0 };
  const reachRate = metricPercent(reached.unique, flowStarted.unique);
  const text = node.type === "message"
    ? String(node.contentBlocks?.find((block) => block.type === "text" && block.text)?.text || node.message || "").trim()
    : node.message || node.title || nodeLabels[node.type] || "Bloco";

  return `
    <section class="published-metrics-panel">
      <label class="published-metric-filter">
        <span>Desempenho</span>
        <select disabled>
          <option>Todos os gatilhos</option>
        </select>
      </label>
      <div class="published-reach-summary">
        <div>
          <strong>${reached.unique ? `${reached.unique} contato${reached.unique === 1 ? "" : "s"}` : "Nenhum contato"}</strong>
          <span>chegaram a esta etapa</span>
        </div>
        <b>${reachRate}%</b>
      </div>
      ${flowMetricState.loading ? `<span class="muted">Atualizando métricas...</span>` : ""}
      ${flowMetricState.error ? `<span class="published-metric-error">${escapeHtml(flowMetricState.error)}</span>` : ""}
      <div class="published-metric-table">
        <div class="published-metric-table-head"><span>Evento</span><span>Total</span><span>Exclusivo</span></div>
        ${renderPublishedMetricRow("Enviado", sent)}
        ${renderPublishedMetricRow("Entregue", delivered, "Confirmado por eventos message_deliveries da Meta.")}
        ${renderPublishedMetricRow("Aberto", read, "Confirmado por eventos message_reads da Meta.")}
        ${renderPublishedMetricRow("Cliques", clicked)}
      </div>
      <div class="published-metric-preview">
        <strong>${escapeHtml(node.title || nodeLabels[node.type] || "Bloco")}</strong>
        <p>${escapeHtml(text || "Sem conteúdo textual.")}</p>
      </div>
      ${node.type === "message" ? renderPublishedButtonMetrics(node) : ""}
    </section>
  `;
}

function renderPublishedComment(node) {
  return `
    <section class="published-comment-panel">
      ${renderCommentMarkdown(node.message || "Anotacao interna do fluxo.")}
    </section>
  `;
}

function renderPublishedTriggerMetrics(flow, node) {
  const started = flowMetricValue("", "flow_started");
  const events = nodeTriggerEvents(node);

  return `
    <section class="published-trigger-panel">
      <div class="published-trigger-head">Quando...</div>
      <div class="published-trigger-body">
        <div class="published-trigger-list">
          ${
            events.length
              ? events.map((triggerId, index) => renderPublishedTriggerCard(triggerId, index, started.total)).join("")
              : `<span class="muted">Nenhum gatilho publicado.</span>`
          }
        </div>
        <div class="published-trigger-divider"></div>
        <div class="published-trigger-then">
          <strong>Ent&atilde;o...</strong>
          ${renderPublishedNextStep(flow, node)}
        </div>
      </div>
    </section>
  `;
}

function renderPublishedTriggerCard(triggerId, index, executions) {
  const option = triggerOptionById(triggerId);
  const count = Number(executions || 0);
  const resultLabel = triggerId === "facebook_ad"
    ? `${count} ${count === 1 ? "clicado" : "clicados"}`
    : `${count} ${count === 1 ? "execu\u00e7\u00e3o" : "execu\u00e7\u00f5es"}`;

  return `
    <article class="published-trigger-card">
      <span class="published-trigger-icon">${icons.message}</span>
      <span>
        <small>${escapeHtml(option?.source || "Messenger")} #${index + 1}</small>
        <strong>${escapeHtml(option?.title || triggerId)}</strong>
        <em>${escapeHtml(resultLabel)}</em>
      </span>
    </article>
  `;
}

function renderPublishedNextStep(flow, node) {
  const next = flow.nodes.find((item) => item.id === node.next);
  if (!next || !canAcceptIncomingConnection(next)) return `<span class="muted">Sem pr&oacute;ximo passo.</span>`;
  const title = next.type === "message" ? "Messenger" : nodeLabels[next.type] || next.title || "Pr\u00f3ximo passo";
  const subtitle = next.type === "message" ? "Enviar Mensagem" : next.title || nodeLabels[next.type] || "Bloco";

  return `
    <article class="published-next-step-card">
      <span class="published-next-step-icon">${icons[next.type] || icons.message}</span>
      <span>
        <strong>${escapeHtml(title)}</strong>
        <small>${escapeHtml(subtitle)}</small>
      </span>
    </article>
  `;
}

function renderPublishedMetricRow(label, metric, title = "") {
  const available = metric && typeof metric === "object";
  return `
    <div class="published-metric-row" ${title ? `title="${attr(title)}"` : ""}>
      <span>${escapeHtml(label)}</span>
      <strong>${available ? metric.total || 0 : "--"}</strong>
      <strong>${available ? metric.unique || 0 : "--"}</strong>
    </div>
  `;
}

function renderPublishedButtonMetrics(node) {
  const buttons = [...(node.buttons || []), ...(node.quickReplies || []), ...(node.contentBlocks || []).flatMap((block) => block.buttons || [])];
  if (!buttons.length) return "";
  const sent = flowMetricValue(node.id, "node_sent");

  return `
    <div class="published-button-metrics">
      <strong>CTR dos botões</strong>
      ${buttons
        .map((button) => {
          const clicked = flowButtonMetricValue(node.id, button.id, "button_clicked");
          return `
            <div>
              <span>${escapeHtml(button.title || "Botão")}</span>
              <b>CTR ${metricPercent(clicked.total, sent.total)}%</b>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function flowMetricValue(nodeId, metric) {
  const metrics = flowMetricState.metrics || {};
  const value = nodeId ? metrics.nodes?.[nodeId]?.metrics?.[metric] : metrics.summary?.[metric];
  return {
    total: Number(value?.total || 0),
    unique: Number(value?.unique || 0)
  };
}

function flowButtonMetricValue(nodeId, optionId, metric) {
  const value = flowMetricState.metrics?.nodes?.[nodeId]?.buttons?.[optionId]?.[metric];
  return {
    total: Number(value?.total || 0),
    unique: Number(value?.unique || 0)
  };
}

function metricPercent(value, total) {
  const count = Number(value || 0);
  const denominator = Number(total || 0);
  return denominator ? Math.min(100, Math.round((count / denominator) * 100)) : 0;
}

function renderTriggerSettings(flow, node) {
  return `
    <form class="inspector-form manychat-settings">
      ${renderEditableNodeHeader(flow, node, {
        className: "manychat-trigger-head",
        fallback: "Quando...",
        ariaLabel: "Nome do gatilho"
      })}
      <div class="trigger-card-list">
        ${nodeTriggerEvents(node).map((id, index) => renderTriggerSettingCard(node, id, index)).join("")}
        <button class="dashed-add-button" type="button" data-action="open-trigger-picker" data-id="${node.id}">+ Novo Gatilho</button>
      </div>
      <div class="next-step-divider"></div>
      <div class="then-block">
        <strong>Então...</strong>
        ${
          node.next
            ? renderSelectedNextStep(flow, node)
            : `<button class="choose-next-step-button" type="button" data-action="open-next-step-picker" data-id="${node.id}">Escolher Próximo Passo</button>`
        }
      </div>
    </form>
  `;
}

function renderTriggerSettingCard(node, triggerId, index) {
  const option = triggerOptionById(triggerId);
  normalizeNodeStructure(node);
  return `
    <article class="trigger-setting-card">
      <span class="trigger-card-icon">${icons.message}</span>
      <div class="trigger-setting-copy">
        <span class="trigger-setting-source">${escapeHtml(option?.source || "Messenger")} #${index + 1}</span>
        <strong>${escapeHtml(option?.title || triggerId)}</strong>
        <small>${triggerExecutionLabel(triggerId)}</small>
      </div>
      <button class="mini-menu-button" type="button" data-action="open-trigger-picker" data-id="${node.id}" title="Editar gatilho">⋮</button>
    </article>
  `;
}

function triggerExecutionLabel(triggerId) {
  if (triggerId === "facebook_ad") return "Interacao recebida pelo template JSON do anuncio";
  return "0 execuções";
}

function renderSelectedNextStep(flow, node) {
  const next = flow.nodes.find((item) => item.id === node.next);
  if (!next || !canAcceptIncomingConnection(next)) {
    return `<button class="choose-next-step-button" type="button" data-action="open-next-step-picker" data-id="${node.id}">Escolher Próximo Passo</button>`;
  }
  return `
    <button class="selected-next-step-card" type="button" data-action="open-next-step-picker" data-id="${node.id}">
      <span class="step-choice-icon">${icons[next.type] || icons.message}</span>
      <span>
        <strong>${escapeHtml(next.title || nodeLabels[next.type] || "Próximo passo")}</strong>
        <small>${escapeHtml(nodeLabels[next.type] || "Bloco")}</small>
      </span>
    </button>
  `;
}

function legacyRenderMessageSettings(flow, node) {
  return `
    <form class="inspector-form manychat-settings">
      ${settingsSectionHeader("Messenger", "Enviar mensagem", icons.message)}
      <label class="settings-field">
        <span>Título do bloco</span>
        <input data-node-field="title" value="${attr(node.title || "")}" />
      </label>
      <div class="message-builder-card">
        <div class="message-builder-header">
          <span class="trigger-option-icon">${icons.message}</span>
          <div>
            <strong>Enviar Mensagem</strong>
            <span>Conteúdo enviado pelo Messenger.</span>
          </div>
        </div>
        <label class="settings-field">
          <span>Texto</span>
          <textarea data-node-field="message" placeholder="Adicionar texto">${escapeHtml(node.message || "")}</textarea>
        </label>
        <label class="settings-field">
          <span>Respostas rápidas</span>
          <input data-node-field="quickReplies" value="${attr((node.quickReplies || []).join(", "))}" placeholder="Sim, Não, Falar com humano" />
        </label>
      </div>
    </form>
  `;
}

function renderMessageSettings(flow, node) {
  normalizeNodeStructure(node);
  return `
    <form class="inspector-form manychat-settings">
      ${settingsSectionHeader("Messenger", "Enviar mensagem", icons.message)}
      <label class="settings-field">
        <span>Título do bloco</span>
        <input data-node-field="title" value="${attr(node.title || "")}" />
      </label>
      <div class="message-builder-card">
        <div class="message-builder-header">
          <span class="trigger-option-icon">${icons.message}</span>
          <div>
            <strong>Enviar Mensagem</strong>
            <span>Monte os blocos enviados no Messenger.</span>
          </div>
        </div>
        <small class="settings-hint">Links e textos aceitam {{entry.source_key}}, {{entry.ad_id}}, {{entry.page_id}}, {{entry.source}} e {{contact.nome_do_campo}}. No orgânico, {{entry.source}} e {{entry.ad_id}} viram organic.</small>
        <div class="content-block-list">
          ${node.contentBlocks.map((block) => renderMessageContentBlock(flow, node, block)).join("")}
          <div class="content-add-row">
            ${messageContentBlockTypes
              .map((blockType) => `<button type="button" data-action="add-message-block" data-type="${attr(blockType.type)}">${icons[blockType.icon] || icons.message}<span>${escapeHtml(blockType.label)}</span></button>`)
              .join("")}
          </div>
        </div>
        <div class="settings-card">
          <div class="settings-card-title">
            <strong>Respostas rápidas</strong>
            <span>Até 11 opções que somem depois que o contato escolhe.</span>
          </div>
          <div class="message-option-list">
            ${node.quickReplies.map((option) => renderMessageOption(flow, node, option, "quick_reply")).join("")}
            <button class="dashed-add-button" type="button" data-action="add-quick-reply" data-id="${node.id}">+ Resposta rápida</button>
          </div>
        </div>
        <div class="next-step-divider"></div>
        <div class="then-block">
          <strong>Depois da mensagem...</strong>
          ${renderSelectedNextStep(flow, node)}
        </div>
      </div>
    </form>
  `;
}

function renderMessageSettingsManychatVisual(flow, node) {
  normalizeNodeStructure(node);
  const firstTextBlock = node.contentBlocks.find((block) => block.type === "text");
  return `
    <form class="message-inspector manychat-settings">
      ${renderEditableNodeHeader(flow, node, {
        className: "message-inspector-title",
        fallback: "Mensagem",
        ariaLabel: "Nome do bloco de mensagem"
      })}
      <label class="message-send-window">
        <span>Enviar</span>
        <select aria-label="Janela de envio da mensagem">
          <option>Dentro da janela de mensagens</option>
        </select>
      </label>
      <div class="message-inspector-divider"></div>
      ${node.contentBlocks.map((block) => block.type === "text" ? renderManychatTextWidget(node, block, Boolean(firstTextBlock && block.id === firstTextBlock.id)) : renderMessageContentBlock(flow, node, block)).join("")}
      <div class="manychat-quick-replies">
        ${node.quickReplies.map((option) => renderMessageOption(flow, node, option, "quick_reply")).join("")}
        <button class="manychat-quick-reply-add" type="button" data-action="add-quick-reply" data-id="${node.id}" ${node.quickReplies.length >= 11 ? "disabled" : ""}>+ Resposta Rápida</button>
      </div>
      <div class="message-inspector-divider"></div>
      <small class="manychat-block-label">Adicione um dos blocos de conteúdo:</small>
      <div class="manychat-content-options">
        ${renderManychatContentOption("text", "Texto", "Adicione texto simples e botões", icons.message, "add-message-block")}
        ${renderManychatContentOption("image", "Imagem", "Impulsione o engajamento com visuais", icons.image, "add-message-block")}
        ${renderManychatContentOption("delay", "Atraso", "Deixe um intervalo entre as mensagens", icons.delay, "")}
        ${renderManychatContentOption("audio", "Áudio", "Envie áudios no chat", icons.send, "add-message-block")}
        ${renderManychatContentOption("more", "Mais", "Ver todas as opções disponíveis", icons.more, "toggle-message-more-panel")}
      </div>
      ${messageMorePanelOpen ? renderManychatMorePanel() : ""}
      <small class="settings-hint">Links e textos aceitam {{entry.source_key}}, {{entry.ad_id}}, {{entry.page_id}}, {{entry.source}} e {{contact.nome_do_campo}}. No orgânico, {{entry.source}} e {{entry.ad_id}} viram organic.</small>
      <div class="message-inspector-divider"></div>
      ${node.next ? renderSelectedNextStep(flow, node) : `<button class="choose-next-step-button blue" type="button" data-action="open-next-step-picker" data-id="${node.id}">Escolher Próximo Passo</button>`}
    </form>
  `;
}

function renderManychatTextWidget(node, block, primary = false) {
  return `
    <div class="manychat-widget" data-message-block-widget="${attr(block.id)}">
      <div class="manychat-message-preview">
        <textarea data-message-block-field="text" data-block-id="${attr(block.id)}" placeholder="Adicionar texto">${escapeHtml(block.text || (primary ? node.message || "" : ""))}</textarea>
        ${primary ? renderInlineMessageButtons(node) : ""}
      </div>
      ${renderManychatBlockControls(block)}
    </div>
  `;
}

function renderManychatContentOption(type, title, description, icon, action) {
  const actionAttrs = action ? `data-action="${attr(action)}" data-type="${attr(type)}"` : `aria-disabled="true"`;
  return `
    <button class="manychat-content-option ${action ? "" : "visual-only"}" type="button" ${actionAttrs}>
      <span class="manychat-content-icon">${icon}</span>
      <span>
        <strong>${escapeHtml(title)}</strong>
        <small>${escapeHtml(description)}</small>
      </span>
    </button>
  `;
}

function renderManychatMorePanel() {
  const items = [
    ["file", "Arquivo", "Anexe arquivos na mensagem", icons.pages, ""],
    ["data_collection", "Coleta de Dados", "Capture e-mails, telefones e mais", icons.pages, ""],
    ["video", "Vídeo", "Compartilhe vídeos no chat", icons.video, ""],
    ["card", "Cartão", "Adicione uma imagem com botão", icons.image, ""],
    ["gallery", "Galeria", "Adicione até 10 imagens no chat", icons.workflow, ""],
    ["messenger_list", "Messenger List", "Adicione um widget para que os usuários possam se inscrever", icons.pages, ""],
    ["dynamic", "Dinâmico", "Solicite o conteúdo do servidor", icons.upload, ""]
  ];
  return `
    <div class="manychat-more-panel"${renderMessageFloatingStyle(messageMorePanelPosition)}>
      ${items.map(([type, title, description, icon, action]) => renderManychatContentOption(type, title, description, icon, action || (type === "card" ? "add-message-block" : ""))).join("")}
    </div>
  `;
}

function renderMessageFloatingStyle(position) {
  if (!position) return "";
  const left = Number(position.left);
  const top = Number(position.top);
  if (!Number.isFinite(left) || !Number.isFinite(top)) return "";
  return ` style="--manychat-popup-left:${Math.round(left)}px; --manychat-popup-top:${Math.round(top)}px"`;
}

function renderManychatBlockControls(block = {}) {
  return `
    <div class="manychat-widget-controls" aria-label="Ações do bloco">
      <button type="button" data-action="remove-message-block" data-block-id="${attr(block.id)}" title="Remover bloco" aria-label="Remover bloco">&times;</button>
      <button type="button" class="message-block-drag-handle" data-message-block-drag-handle="true" data-block-id="${attr(block.id)}" draggable="true" title="Arrastar para reorganizar" aria-label="Arrastar para reorganizar">${icons.move_vertical}</button>
      <button type="button" data-action="duplicate-message-block" data-block-id="${attr(block.id)}" title="Duplicar bloco" aria-label="Duplicar bloco">${icons.copy}</button>
    </div>
  `;
}

function messageBlockMediaLabel(type) {
  if (type === "audio") return "áudio";
  if (type === "video") return "vídeo";
  if (type === "file") return "arquivo";
  return "imagem";
}

function messageBlockUrlPlaceholder(type) {
  if (type === "audio") return "https://example.com/audio.mp3";
  if (type === "video") return "https://example.com/video.mp4";
  if (type === "file") return "https://example.com/arquivo.pdf";
  return "https://example.com/640x360.jpeg";
}

function messageBlockUrlLabel(type) {
  return type === "image" || !type ? "URL da imagem" : `URL do ${messageBlockMediaLabel(type)}`;
}

function normalizeCardImageAspectRatio(value) {
  return String(value || "horizontal").trim() === "square" ? "square" : "horizontal";
}

function renderManychatImageUrlPopover(block = {}) {
  return `
    <div class="manychat-image-url-popover"${renderMessageFloatingStyle(messageImageUrlPopoverPosition)}>
      <label>
        <span>${escapeHtml(messageBlockUrlLabel(block.type))}</span>
        <input data-message-block-field="url" data-block-id="${attr(block.id)}" value="${attr(block.url || "")}" placeholder="${attr(messageBlockUrlPlaceholder(block.type))}" autofocus />
      </label>
      <button type="button" data-action="close-message-image-url" title="Fechar editor de URL" aria-label="Fechar editor de URL">{}</button>
    </div>
  `;
}

function renderManychatCardUrlPopover(block = {}) {
  return `
    <div class="manychat-image-url-popover manychat-card-url-popover"${renderMessageFloatingStyle(messageCardUrlPopoverPosition)}>
      <label>
        <span>URL do cartao</span>
        <input data-message-block-field="cardUrl" data-block-id="${attr(block.id)}" value="${attr(block.cardUrl || "")}" placeholder="Digite a URL aqui..." autofocus />
      </label>
      <button type="button" data-action="close-message-card-url" title="Fechar editor de URL" aria-label="Fechar editor de URL">{}</button>
    </div>
  `;
}

function renderMessageContentBlock(flow, node, block) {
  const type = messageContentBlockTypes.find((item) => item.type === block.type) || messageContentBlockTypes[0];
  const removeButton = `<button class="mini-menu-button" type="button" data-action="remove-message-block" data-block-id="${attr(block.id)}" title="Remover bloco">&times;</button>`;

  if (block.type === "text") {
    const firstTextBlock = node.contentBlocks.find((item) => item.type === "text");
    return `
      <article class="message-content-block manychat-text-message-block">
        <div class="message-content-head">${icons[type.icon] || icons.message}<strong>Texto</strong>${removeButton}</div>
        <textarea data-message-block-field="text" data-block-id="${attr(block.id)}" placeholder="Adicionar texto">${escapeHtml(block.text || "")}</textarea>
        ${firstTextBlock?.id === block.id ? renderInlineMessageButtons(node) : ""}
      </article>
    `;
  }

  if (block.type === "image") {
    const inputId = `message_block_file_${block.id}`;
    const hasImage = Boolean(String(block.url || "").trim());
    return `
      <div class="manychat-widget" data-message-block-widget="${attr(block.id)}">
        <article class="manychat-image-widget ${hasImage ? "has-image" : "is-empty"}">
          <div class="manychat-image-upload-area">
            ${
              hasImage
                ? `<a class="manychat-image-preview" href="${attr(block.url)}" target="_blank" rel="noopener"><img src="${attr(block.url)}" alt="${attr(block.title || "Imagem da mensagem")}" loading="lazy" /></a>`
                : `<span class="manychat-image-placeholder">${icons.image}</span>`
            }
            ${
              hasImage
                ? ""
                : `<div class="manychat-image-actions">
                    <button type="button" data-action="choose-message-block-file" data-input-id="${attr(inputId)}">Enviar Imagem</button>
                    <span>ou</span>
                    <button type="button" data-action="open-message-image-url" data-block-id="${attr(block.id)}">colar a URL</button>
                  </div>`
            }
          </div>
          ${renderManychatImageBlockButtons(flow, node, block)}
          <input id="${attr(inputId)}" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/*" data-message-block-file="true" data-block-id="${attr(block.id)}" data-kind="image" hidden />
        </article>
        ${messageImageUrlEditorBlockId === block.id ? renderManychatImageUrlPopover(block) : ""}
        ${renderManychatBlockControls(block)}
      </div>
    `;
  }

  if (block.type === "audio") {
    const inputId = `message_block_file_${block.id}`;
    const hasAudio = Boolean(String(block.url || "").trim());
    return `
      <div class="manychat-widget" data-message-block-widget="${attr(block.id)}">
        <article class="manychat-image-widget manychat-audio-widget ${hasAudio ? "has-audio" : "is-empty"}">
          <div class="manychat-image-upload-area">
            ${
              hasAudio
                ? `<div class="manychat-audio-player"><audio src="${attr(block.url)}" controls preload="metadata"></audio></div>`
                : `<span class="manychat-image-placeholder">${icons.send}</span>
                  <div class="manychat-image-actions">
                    <button type="button" data-action="choose-message-block-file" data-input-id="${attr(inputId)}">Enviar Áudio</button>
                    <span>ou</span>
                    <button type="button" data-action="open-message-image-url" data-block-id="${attr(block.id)}">colar a URL</button>
                  </div>`
            }
          </div>
          <input id="${attr(inputId)}" type="file" accept="audio/mpeg,.mp3" data-message-block-file="true" data-block-id="${attr(block.id)}" data-kind="audio" hidden />
        </article>
        ${messageImageUrlEditorBlockId === block.id ? renderManychatImageUrlPopover(block) : ""}
        ${renderManychatBlockControls(block)}
      </div>
    `;
  }

  if (["audio", "video", "file"].includes(block.type)) {
    return `
      <article class="message-content-block manychat-widget" data-message-block-widget="${attr(block.id)}">
        <div class="message-content-head">${icons[type.icon] || icons.message}<strong>${escapeHtml(type.label)}</strong>${removeButton}</div>
        <input data-message-block-field="url" data-block-id="${attr(block.id)}" value="${attr(block.url || "")}" placeholder="URL do arquivo" />
        ${block.type === "video" || block.type === "audio" ? renderMessageMediaPreview(block) : ""}
        ${block.type === "file" ? `<input data-message-block-field="fileName" data-block-id="${attr(block.id)}" value="${attr(block.fileName || "")}" placeholder="Nome do arquivo" />` : ""}
        ${renderManychatBlockControls(block)}
      </article>
    `;
  }

  if (block.type === "card") return renderManychatCardWidget(flow, node, block);

  if (block.type === "card" || block.type === "gallery") {
    return `
      <article class="message-content-block">
        <div class="message-content-head">${icons[type.icon] || icons.message}<strong>${escapeHtml(type.label)}</strong>${removeButton}</div>
        <input data-message-block-field="title" data-block-id="${attr(block.id)}" value="${attr(block.title || "")}" placeholder="Título" />
        <input data-message-block-field="subtitle" data-block-id="${attr(block.id)}" value="${attr(block.subtitle || "")}" placeholder="Subtítulo" />
        <input data-message-block-field="url" data-block-id="${attr(block.id)}" value="${attr(block.url || "")}" placeholder="URL da imagem" />
      </article>
    `;
  }

  if (block.type === "data_collection") {
    return `
      <article class="message-content-block">
        <div class="message-content-head">${icons[type.icon] || icons.message}<strong>Coleta de dados</strong>${removeButton}</div>
        <input data-message-block-field="fieldName" data-block-id="${attr(block.id)}" value="${attr(block.fieldName || "")}" placeholder="Campo do usuário para salvar a resposta" />
        <textarea data-message-block-field="text" data-block-id="${attr(block.id)}" placeholder="Pergunta enviada ao contato">${escapeHtml(block.text || "Qual informação você gostaria de coletar?")}</textarea>
      </article>
    `;
  }

  return `
    <article class="message-content-block">
      <div class="message-content-head">${icons[type.icon] || icons.message}<strong>Dinâmico</strong>${removeButton}</div>
      <input data-message-block-field="endpoint" data-block-id="${attr(block.id)}" value="${attr(block.endpoint || "")}" placeholder="Endpoint que retornará a mensagem" />
      <textarea data-message-block-field="text" data-block-id="${attr(block.id)}" placeholder="Fallback se o endpoint falhar">${escapeHtml(block.text || "")}</textarea>
    </article>
  `;
}

function renderManychatCardWidget(flow, node, block) {
  const inputId = `message_block_file_${block.id}`;
  const hasImage = Boolean(String(block.url || "").trim());
  const aspect = normalizeCardImageAspectRatio(block.imageAspectRatio);
  return `
    <div class="manychat-widget" data-message-block-widget="${attr(block.id)}">
      <article class="manychat-card-widget ${hasImage ? "has-image" : "is-empty"} aspect-${attr(aspect)}">
        <div class="manychat-card-aspect-toggle" aria-label="Formato da imagem do cartao">
          ${renderManychatCardAspectButton(block, "square", aspect)}
          ${renderManychatCardAspectButton(block, "horizontal", aspect)}
        </div>
        <div class="manychat-card-media">
          ${
            hasImage
              ? `<button class="manychat-card-image-button ${block.cardUrl ? "has-card-url" : ""}" type="button" data-action="open-message-card-url" data-block-id="${attr(block.id)}" title="Editar URL do cartao"><img src="${attr(block.url)}" alt="${attr(block.title || "Imagem do cartao")}" loading="lazy" /></button>`
              : `<span class="manychat-image-placeholder">${icons.image}</span>
                <div class="manychat-image-actions">
                  <button type="button" data-action="choose-message-block-file" data-input-id="${attr(inputId)}">Enviar Imagem</button>
                  <span>ou</span>
                  <button type="button" data-action="open-message-image-url" data-block-id="${attr(block.id)}">colar a URL</button>
                </div>`
          }
        </div>
        <div class="manychat-card-copy">
          <input data-message-block-field="title" data-block-id="${attr(block.id)}" value="${attr(block.title || "")}" placeholder="Inserir titulo..." aria-label="Titulo do cartao" />
          <input data-message-block-field="subtitle" data-block-id="${attr(block.id)}" value="${attr(block.subtitle || "")}" placeholder="Inserir Legenda..." aria-label="Legenda do cartao" />
        </div>
        ${renderManychatImageBlockButtons(flow, node, block)}
        <input id="${attr(inputId)}" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/*" data-message-block-file="true" data-block-id="${attr(block.id)}" data-kind="image" hidden />
      </article>
      ${messageImageUrlEditorBlockId === block.id ? renderManychatImageUrlPopover(block) : ""}
      ${messageCardUrlEditorBlockId === block.id ? renderManychatCardUrlPopover(block) : ""}
      ${renderManychatBlockControls(block)}
    </div>
  `;
}

function renderManychatCardAspectButton(block, value, current) {
  return `
    <button class="${value === current ? "active" : ""}" type="button" data-action="set-card-image-aspect" data-block-id="${attr(block.id)}" data-aspect="${attr(value)}" title="${value === "square" ? "Quadrado" : "Horizontal"}" aria-label="${value === "square" ? "Imagem quadrada" : "Imagem horizontal"}">
      <span class="card-aspect-icon ${attr(value)}"></span>
    </button>
  `;
}

function renderInlineMessageButtons(node) {
  const buttons = Array.isArray(node.buttons) ? node.buttons : [];
  return `
    <div class="inline-message-button-list">
      ${buttons
        .map(
          (option) => `
            <button class="inline-message-button" type="button" data-action="edit-message-button" data-option-id="${attr(option.id)}">
              <span>${escapeHtml(option.title || "Novo botão")}</span>
              ${icons.edit}
            </button>
          `
        )
        .join("")}
      <button class="inline-message-button-add" type="button" data-action="add-message-button" data-id="${attr(node.id)}" ${buttons.length >= 3 ? "disabled" : ""}>+ Botão Adicionar</button>
    </div>
  `;
}

function renderMessageButtonEditor(flow, node, option) {
  const behavior = messageButtonBehavior(flow, option);
  return `
    <form class="message-button-editor manychat-settings">
      <label class="settings-field">
        <span>Título do botão</span>
        <input data-message-option-field="title" data-option-kind="button" data-option-id="${attr(option.id)}" value="${attr(option.title || "")}" placeholder="Novo botão" />
      </label>
      <div class="message-button-behavior">
        <strong>Quando este botão é pressionado</strong>
        <div class="message-button-behavior-list">
          ${messageButtonBehaviorChoice("message", "Messenger", icons.message, behavior)}
          ${messageButtonBehaviorChoice("url", "Abrir Site", icons.link_click_wait, behavior)}
          ${messageButtonBehaviorChoice("phone", "Número de chamada", icons.phone, behavior)}
          ${messageButtonBehaviorChoice("action", "Executar Ações", icons.action, behavior)}
          ${messageButtonBehaviorChoice("condition", "Condição", icons.condition, behavior)}
          ${messageButtonBehaviorChoice("randomizer", "Randomizador", icons.randomizer, behavior)}
          ${messageButtonBehaviorChoice("delay", "Atraso Inteligente", icons.delay, behavior)}
          ${messageButtonBehaviorChoice("start_flow", "Iniciar outra automação", icons.workflow, behavior)}
          ${messageButtonBehaviorChoice("existing", "Selecionar Passo Existente", icons.workflow, behavior)}
        </div>
      </div>
      ${
        option.type === "url"
          ? `<label class="settings-field"><span>URL</span><input data-message-option-field="url" data-option-kind="button" data-option-id="${attr(option.id)}" value="${attr(option.url || "")}" placeholder="https://..." /></label>`
          : option.type === "phone"
            ? `<label class="settings-field"><span>Número de chamada</span><input data-message-option-field="phone" data-option-kind="button" data-option-id="${attr(option.id)}" value="${attr(option.phone || "")}" placeholder="+5511999999999" /></label>`
            : option.type === "start_flow"
              ? renderMessageButtonFlowSelect(flow, option)
              : targetSelectField(flow, node, option.next, "Próximo passo", { kind: "button", id: option.id })
      }
      <div class="message-button-editor-footer">
        <button class="text-button danger" type="button" data-action="remove-message-option" data-option-kind="button" data-option-id="${attr(option.id)}">${icons.trash}<span>Excluir</span></button>
        <button class="primary-button" type="button" data-action="close-message-button-editor">Concluído</button>
      </div>
    </form>
  `;
}

function messageButtonBehaviorChoice(id, label, icon, current) {
  return `
    <button class="message-button-behavior-choice ${id === current ? "active" : ""}" type="button" data-action="set-message-button-behavior" data-behavior="${attr(id)}">
      <span>${icon}</span>
      <strong>${escapeHtml(label)}</strong>
    </button>
  `;
}

function selectedMessageButtonOption(node) {
  if (!messageButtonEditorOptionId || node?.type !== "message") return null;
  return node.buttons?.find((option) => option.id === messageButtonEditorOptionId) || null;
}

function messageButtonBehavior(flow, option) {
  if (option.type === "url") return "url";
  if (option.type === "phone") return "phone";
  if (option.type === "start_flow") return "start_flow";
  const target = flow.nodes.find((node) => node.id === option.next);
  if (["message", "action", "condition", "randomizer", "delay"].includes(target?.type)) return target.type;
  return target ? "existing" : "message";
}

function renderMessageButtonFlowSelect(flow, option) {
  const pageId = normalizeFlowPageId(flow.pageId || currentFlowPageId());
  const options = state.flows
    .filter((item) => item.id !== flow.id && normalizeFlowPageId(item.pageId || pageId) === pageId)
    .map((item) => `<option value="${attr(item.id)}" ${item.id === option.flowId ? "selected" : ""}>${escapeHtml(item.name || "Fluxo sem nome")}</option>`)
    .join("");
  return `
    <label class="settings-field">
      <span>Automação</span>
      <select data-message-option-field="flowId" data-option-kind="button" data-option-id="${attr(option.id)}">
        <option value="">Selecione um fluxo</option>
        ${options}
      </select>
    </label>
  `;
}

function renderMessageImagePreview(block) {
  if (!block.url) {
    return `
      <div class="message-image-block-preview empty">
        ${icons.image}
        <span>Adicione a URL da imagem para visualizar sem corte.</span>
      </div>
    `;
  }

  return `
    <a class="message-image-block-preview" href="${attr(block.url)}" target="_blank" rel="noopener">
      <img src="${attr(block.url)}" alt="${attr(block.title || "Preview da imagem")}" loading="lazy" />
    </a>
  `;
}

function renderMessageMediaPreview(block) {
  if (!block.url) {
    return `
      <div class="message-image-block-preview empty">
        ${block.type === "video" ? icons.video : icons.send}
        <span>Adicione a URL do ${block.type === "video" ? "video" : "audio"} para visualizar.</span>
      </div>
    `;
  }

  if (block.type === "video") {
    return `
      <div class="message-image-block-preview message-video-preview">
        <video src="${attr(block.url)}" controls playsinline preload="metadata"></video>
      </div>
    `;
  }

  return `
    <div class="message-image-block-preview message-audio-preview">
      <audio src="${attr(block.url)}" controls preload="metadata"></audio>
    </div>
  `;
}

function renderMessageBlockButtons(flow, node, block) {
  const buttons = Array.isArray(block.buttons) ? block.buttons : [];
  return `
    <div class="message-block-button-list">
      <div class="settings-card-title compact">
        <strong>Botões da imagem</strong>
        <span>Até 3 botões vinculados a esta imagem.</span>
      </div>
      ${buttons.map((button) => renderMessageBlockButton(flow, node, block, button)).join("")}
      <button class="dashed-add-button" type="button" data-action="add-message-block-button" data-block-id="${attr(block.id)}" ${buttons.length >= 3 ? "disabled" : ""}>+ Botão da imagem</button>
    </div>
  `;
}

function renderMessageBlockButton(flow, node, block, button) {
  return `
    <article class="message-option-card block-button-card">
      <div class="message-option-grid">
        <label class="settings-field">
          <span>Botão</span>
          <input data-message-block-button-field="title" data-block-id="${attr(block.id)}" data-button-id="${attr(button.id)}" value="${attr(button.title || "")}" placeholder="Texto" />
        </label>
        <label class="settings-field">
          <span>Tipo</span>
          <select data-message-block-button-field="type" data-block-id="${attr(block.id)}" data-button-id="${attr(button.id)}">
            ${optionSelect("url", "Abrir site", button.type || "url")}
            ${optionSelect("next", "Próximo passo", button.type || "url")}
            ${optionSelect("phone", "Ligar", button.type || "url")}
          </select>
        </label>
        ${
          button.type === "next"
            ? targetSelectField(flow, node, button.next, "Próximo passo", { blockId: block.id, blockButtonId: button.id })
            : button.type === "phone"
              ? `<label class="settings-field"><span>Telefone</span><input data-message-block-button-field="phone" data-block-id="${attr(block.id)}" data-button-id="${attr(button.id)}" value="${attr(button.phone || "")}" placeholder="+5511999999999" /></label>`
              : `<label class="settings-field"><span>URL</span><input data-message-block-button-field="url" data-block-id="${attr(block.id)}" data-button-id="${attr(button.id)}" value="${attr(button.url || "")}" placeholder="https://..." /></label>`
        }
      </div>
      <button class="mini-menu-button" type="button" data-action="remove-message-block-button" data-block-id="${attr(block.id)}" data-button-id="${attr(button.id)}" title="Remover">&times;</button>
    </article>
  `;
}

function renderManychatImageBlockButtons(flow, node, block) {
  const buttons = Array.isArray(block.buttons) ? block.buttons : [];
  return `
    <div class="manychat-image-button-list">
      ${buttons.map((button) => renderManychatImageBlockButton(flow, node, block, button)).join("")}
      <button class="inline-message-button-add" type="button" data-action="add-message-block-button" data-block-id="${attr(block.id)}" ${buttons.length >= 3 ? "disabled" : ""}>+ Botão Adicionar</button>
    </div>
  `;
}

function renderManychatImageBlockButton(flow, node, block, button) {
  const currentType = button.type || "url";
  return `
    <article class="manychat-image-button-card">
      <div class="manychat-image-button-head">
        <input data-message-block-button-field="title" data-block-id="${attr(block.id)}" data-button-id="${attr(button.id)}" value="${attr(button.title || "")}" placeholder="Novo botão" aria-label="Título do botão da imagem" />
        <select data-message-block-button-field="type" data-block-id="${attr(block.id)}" data-button-id="${attr(button.id)}" aria-label="Tipo do botão da imagem">
          ${optionSelect("url", "Abrir site", currentType)}
          ${optionSelect("next", "Próximo passo", currentType)}
          ${optionSelect("phone", "Ligar", currentType)}
        </select>
        <button class="mini-menu-button" type="button" data-action="remove-message-block-button" data-block-id="${attr(block.id)}" data-button-id="${attr(button.id)}" title="Remover" aria-label="Remover botão">&times;</button>
      </div>
      ${
        currentType === "next"
          ? targetSelectField(flow, node, button.next, "Próximo passo", { blockId: block.id, blockButtonId: button.id })
          : currentType === "phone"
            ? `<input class="manychat-image-button-target" data-message-block-button-field="phone" data-block-id="${attr(block.id)}" data-button-id="${attr(button.id)}" value="${attr(button.phone || "")}" placeholder="+5511999999999" aria-label="Telefone do botão" />`
            : `<input class="manychat-image-button-target" data-message-block-button-field="url" data-block-id="${attr(block.id)}" data-button-id="${attr(button.id)}" value="${attr(button.url || "")}" placeholder="https://..." aria-label="URL do botão" />`
      }
    </article>
  `;
}

function renderMessageOption(flow, node, option, kind) {
  const label = kind === "button" ? "Botão" : "Resposta";
  return `
    <article class="message-option-card">
      <div class="message-option-grid">
        <label class="settings-field">
          <span>${label}</span>
          <input data-message-option-field="title" data-option-kind="${kind}" data-option-id="${attr(option.id)}" value="${attr(option.title || "")}" placeholder="Texto" />
        </label>
        ${
          kind === "button"
            ? `<label class="settings-field">
                <span>Tipo</span>
                <select data-message-option-field="type" data-option-kind="${kind}" data-option-id="${attr(option.id)}">
                  ${optionSelect("next", "Próximo passo", option.type || "next")}
                  ${optionSelect("url", "Abrir site", option.type || "next")}
                  ${optionSelect("phone", "Ligar", option.type || "next")}
                </select>
              </label>`
            : ""
        }
        ${
          option.type === "url"
            ? `<label class="settings-field"><span>URL</span><input data-message-option-field="url" data-option-kind="${kind}" data-option-id="${attr(option.id)}" value="${attr(option.url || "")}" placeholder="https://..." /></label>`
            : option.type === "phone"
              ? `<label class="settings-field"><span>Telefone</span><input data-message-option-field="phone" data-option-kind="${kind}" data-option-id="${attr(option.id)}" value="${attr(option.phone || "")}" placeholder="+5511999999999" /></label>`
              : targetSelectField(flow, node, option.next, "Próximo passo", { field: "next", kind, id: option.id })
        }
      </div>
      <button class="mini-menu-button" type="button" data-action="remove-message-option" data-option-kind="${kind}" data-option-id="${attr(option.id)}" title="Remover">&times;</button>
    </article>
  `;
}

function optionSelect(value, label, current) {
  return `<option value="${attr(value)}" ${value === current ? "selected" : ""}>${escapeHtml(label)}</option>`;
}

function legacyRenderConditionSettings(flow, node) {
  return `
    <form class="inspector-form manychat-settings">
      ${settingsSectionHeader("Condição", "Definir caminho por regra", icons.condition)}
      <label class="settings-field">
        <span>Nome da condição</span>
        <input data-node-field="title" value="${attr(node.title || "")}" />
      </label>
      <div class="settings-card">
        <div class="settings-card-title">
          <strong>Se a mensagem contém</strong>
          <span>Use vírgulas para separar termos.</span>
        </div>
        <input data-node-field="keyword" value="${attr(node.keyword || "")}" placeholder="preço, orçamento, proposta" />
      </div>
      <label class="settings-field">
        <span>Observação interna</span>
        <textarea data-node-field="message">${escapeHtml(node.message || "")}</textarea>
      </label>
    </form>
  `;
}

function legacyRenderDelaySettings(flow, node) {
  return `
    <form class="inspector-form manychat-settings">
      ${settingsSectionHeader("Espera", "Aguardar antes de continuar", icons.delay)}
      <label class="settings-field">
        <span>Nome da espera</span>
        <input data-node-field="title" value="${attr(node.title || "")}" />
      </label>
      <div class="settings-card compact-setting">
        <label class="settings-field">
          <span>Esperar por minutos</span>
          <input type="number" min="0" data-node-field="delayMinutes" value="${attr(node.delayMinutes || 0)}" />
        </label>
      </div>
      <label class="settings-field">
        <span>Descrição interna</span>
        <textarea data-node-field="message">${escapeHtml(node.message || "")}</textarea>
      </label>
    </form>
  `;
}

function legacyRenderRandomizerSettings(flow, node) {
  return `
    <form class="inspector-form manychat-settings">
      ${settingsSectionHeader("Randomizador", "Distribuir contatos entre caminhos", icons.workflow)}
      <label class="settings-field">
        <span>Nome do randomizador</span>
        <input data-node-field="title" value="${attr(node.title || "")}" />
      </label>
      <label class="settings-field">
        <span>Observação interna</span>
        <textarea data-node-field="message">${escapeHtml(node.message || "")}</textarea>
      </label>
    </form>
  `;
}

function legacyRenderConditionSettingsManychat(flow, node) {
  normalizeNodeStructure(node);
  return `
    <form class="inspector-form manychat-settings">
      ${settingsSectionHeader("Condição", "Dividir caminho por regra", icons.condition)}
      <label class="settings-field">
        <span>Nome da condição</span>
        <input data-node-field="title" value="${attr(node.title || "")}" />
      </label>
      <div class="settings-card">
        <div class="settings-card-title">
          <strong>Regra</strong>
          <span>Escolha o dado usado para mandar o contato para Sim ou Não.</span>
        </div>
        <label class="settings-field">
          <span>Tipo</span>
          <select data-node-field="conditionType">
            ${optionSelect("message_contains", "Mensagem contém", node.conditionType)}
            ${optionSelect("tag", "Contato possui tag", node.conditionType)}
            ${optionSelect("field", "Campo do usuário", node.conditionType)}
          </select>
        </label>
        <label class="settings-field">
          <span>Operador</span>
          <select data-node-field="conditionOperator">
            ${optionSelect("contains_any", "Contém qualquer termo", node.conditionOperator)}
            ${optionSelect("contains_all", "Contém todos os termos", node.conditionOperator)}
            ${optionSelect("equals", "É exatamente", node.conditionOperator)}
            ${optionSelect("not_contains", "Não contém", node.conditionOperator)}
          </select>
        </label>
        <label class="settings-field">
          <span>${node.conditionType === "field" ? "Campo" : node.conditionType === "tag" ? "Tag" : "Termos"}</span>
          <input data-node-field="${node.conditionType === "field" ? "fieldName" : "keyword"}" value="${attr(node.conditionType === "field" ? node.fieldName || "" : node.keyword || "")}" placeholder="preço, orçamento, lead-quente" />
        </label>
        ${
          node.conditionType === "field"
            ? `<label class="settings-field"><span>Valor esperado</span><input data-node-field="fieldValue" value="${attr(node.fieldValue || "")}" placeholder="Valor" /></label>`
            : ""
        }
      </div>
      <div class="condition-branches">
        ${targetSelectField(flow, node, node.yesNext, "Se SIM", { field: "yesNext" })}
        ${targetSelectField(flow, node, node.noNext, "Se NÃO", { field: "noNext" })}
      </div>
    </form>
  `;
}

function renderConditionSettings(flow, node) {
  normalizeNodeStructure(node);
  const pageId = currentFlowPageId();
  if (customFieldStore.pageId !== pageId && !customFieldStore.loading) loadCustomFieldsForPage(pageId);
  return `
    <form class="inspector-form manychat-condition-settings">
      ${renderEditableNodeHeader(flow, node, {
        className: "manychat-condition-head",
        fallback: "Condição",
        ariaLabel: "Nome da condição"
      })}
      <div class="manychat-condition-content">
        <div class="condition-match-row">
          <div class="condition-match-copy">
            <span>O contato corresponde</span>
            <button type="button" data-action="toggle-condition-match" data-id="${node.id}">
              ${node.conditionMatch === "any" ? "qualquer uma destas condições?" : "todas as seguintes condições?"}
            </button>
          </div>
          <div class="condition-side-actions" aria-hidden="true">
            <span>${icons.copy}</span>
            <span>${icons.move_vertical}</span>
          </div>
        </div>
        <div class="condition-rule-list">
          ${node.conditions.length ? node.conditions.map((condition) => renderConditionRule(condition)).join("") : ""}
          <div class="condition-add-wrap">
            <button class="dashed-add-button condition-add-button" type="button" data-action="open-condition-picker" data-id="${node.id}">+ Condição</button>
            ${conditionPickerNodeId === node.id ? renderConditionPicker(node) : ""}
          </div>
        </div>
      </div>
    </form>
  `;
}

function renderConditionRule(condition) {
  if (condition.type === "tag") return renderTagConditionRule(condition);
  if (condition.type === "field") return renderCustomFieldConditionRule(condition);
  if (condition.type === "entry") return renderEntryConditionRule(condition);
  return `
    <article class="condition-rule-card">
      <span class="condition-rule-icon">${icons.condition}</span>
      <div>
        <strong>${escapeHtml(condition.label || conditionLabelForType(condition.type))}</strong>
        <span>${escapeHtml(conditionRuleSummary(condition))}</span>
        <input data-condition-rule-field="value" data-condition-id="${attr(condition.id)}" value="${attr(condition.value || "")}" placeholder="${attr(condition.type === "tag" ? "Nome da tag" : condition.type === "field" ? "Valor esperado" : "Termos")}" />
      </div>
      <button class="mini-menu-button" type="button" data-action="remove-condition-rule" data-condition-id="${attr(condition.id)}" title="Remover condição">&times;</button>
    </article>
  `;
}

function renderEntryConditionRule(condition) {
  const fields = [
    { id: "source", label: "Origem da entrada" },
    { id: "ad_id", label: "Ad ID da entrada" },
    { id: "source_key", label: "Chave curta da entrada" },
    { id: "page_id", label: "Page ID da entrada" }
  ];
  return `
    <article class="condition-rule-card entry-condition-rule-card">
      <select data-condition-rule-field="fieldName" data-condition-id="${attr(condition.id)}">
        ${fields.map((field) => `<option value="${attr(field.id)}" ${condition.fieldName === field.id ? "selected" : ""}>${escapeHtml(field.label)}</option>`).join("")}
      </select>
      <select data-condition-rule-field="operator" data-condition-id="${attr(condition.id)}">
        <option value="equals" ${condition.operator === "equals" ? "selected" : ""}>e exatamente</option>
        <option value="contains_any" ${condition.operator === "contains_any" ? "selected" : ""}>contem</option>
        <option value="not_contains" ${condition.operator === "not_contains" ? "selected" : ""}>nao contem</option>
      </select>
      <input data-condition-rule-field="value" data-condition-id="${attr(condition.id)}" value="${attr(condition.value || "")}" placeholder="Valor esperado" />
      <button class="mini-menu-button" type="button" data-action="remove-condition-rule" data-condition-id="${attr(condition.id)}" title="Remover condicao">&times;</button>
    </article>
  `;
}

function renderCustomFieldConditionRule(condition) {
  const fields = customFieldRecordsForPage();
  const selected = findCustomFieldForPage(condition.fieldId || condition.fieldName);
  const fieldType = normalizeCustomFieldType(selected?.type || "text");
  if (fieldType === "boolean") {
    condition.operator = "equals";
    if (!["true", "false"].includes(String(condition.value))) condition.value = "";
  }
  const options = selected || !condition.fieldName ? fields : [...fields, { id: "", name: condition.fieldName, type: "text" }];
  return `
    <article class="condition-rule-card custom-field-condition-rule-card">
      <div class="condition-rule-main">
        <select class="condition-field-select" data-condition-rule-field="fieldId" data-condition-id="${attr(condition.id)}">
          <option value="" ${condition.fieldName || condition.fieldId ? "" : "selected"}>Selecionar campo</option>
          ${options.map((field) => {
            const value = field.id || field.name;
            const selectedOption = condition.fieldId ? field.id === condition.fieldId : normalizeCustomFieldKey(field.name) === normalizeCustomFieldKey(condition.fieldName);
            return `<option value="${attr(value)}" ${selectedOption ? "selected" : ""}>${escapeHtml(field.name)}</option>`;
          }).join("")}
        </select>
        ${renderConditionOperatorControl(condition, fieldType)}
        ${renderConditionValueControl(condition, fieldType)}
      </div>
      <button class="mini-menu-button" type="button" data-action="remove-condition-rule" data-condition-id="${attr(condition.id)}" title="Remover condicao">&times;</button>
    </article>
  `;
}

function renderConditionOperatorControl(condition, fieldType = "text") {
  if (fieldType === "boolean") {
    return `
      <select class="condition-rule-operator-select" data-condition-rule-field="operator" data-condition-id="${attr(condition.id)}">
        <option value="equals" selected>é</option>
      </select>
    `;
  }
  return `
    <select class="condition-rule-operator-select" data-condition-rule-field="operator" data-condition-id="${attr(condition.id)}">
      <option value="equals" ${condition.operator === "equals" ? "selected" : ""}>é</option>
      <option value="contains_any" ${condition.operator === "contains_any" ? "selected" : ""}>contém</option>
      <option value="not_contains" ${condition.operator === "not_contains" ? "selected" : ""}>não contém</option>
    </select>
  `;
}

function renderConditionValueControl(condition, fieldType = "text") {
  const common = `class="condition-rule-value-control" data-condition-rule-field="value" data-condition-id="${attr(condition.id)}"`;
  if (fieldType === "boolean") {
    return `
      <select ${common}>
        <option value="" ${condition.value === "" ? "selected" : ""}>Selecionar valor</option>
        <option value="true" ${String(condition.value) === "true" ? "selected" : ""}>Verdadeiro</option>
        <option value="false" ${String(condition.value) === "false" ? "selected" : ""}>Falso</option>
      </select>
    `;
  }
  const inputType = fieldType === "number" ? "number" : fieldType === "date" ? "date" : fieldType === "datetime" ? "datetime-local" : "text";
  return `<input type="${attr(inputType)}" ${common} value="${attr(condition.value || "")}" placeholder="Valor esperado" />`;
}

function renderTagConditionRule(condition) {
  const tags = tagOptionsForCurrentPage(condition.value);
  return `
    <article class="condition-rule-card tag-condition-rule-card">
      <span class="condition-token-label">Tag</span>
      <select class="condition-operator-select" data-condition-rule-field="operator" data-condition-id="${attr(condition.id)}">
        <option value="contains_any" ${condition.operator === "not_contains" ? "" : "selected"}>está</option>
        <option value="not_contains" ${condition.operator === "not_contains" ? "selected" : ""}>não é</option>
      </select>
      ${
        tags.length
          ? `<select class="condition-tag-select" data-condition-rule-field="value" data-condition-id="${attr(condition.id)}">
              <option value="" ${condition.value ? "" : "selected"}>Selecionar tag</option>
              ${tags.map((tagName) => `<option value="${attr(tagName)}" ${condition.value === tagName ? "selected" : ""}>${escapeHtml(tagName)}</option>`).join("")}
            </select>`
          : `<input class="condition-tag-input" data-condition-rule-field="value" data-condition-id="${attr(condition.id)}" value="${attr(condition.value || "")}" placeholder="Nome da tag" />`
      }
      <button class="mini-menu-button" type="button" data-action="remove-condition-rule" data-condition-id="${attr(condition.id)}" title="Remover condição">&times;</button>
    </article>
  `;
}

function updateConditionRuleField(condition, fieldName, value) {
  if (fieldName === "fieldId" && condition.type === "field") {
    const field = findCustomFieldForPage(value);
    condition.fieldId = field?.id || "";
    condition.fieldName = field?.name || value;
    if (normalizeCustomFieldType(field?.type || "text") === "boolean") {
      condition.operator = "equals";
      if (!["true", "false"].includes(String(condition.value))) condition.value = "";
    }
    return;
  }

  condition[fieldName] = value;
  if (fieldName === "fieldName" && condition.type === "field") {
    const field = findCustomFieldForPage(value);
    condition.fieldId = field?.id || "";
    condition.fieldName = field?.name || value;
    if (normalizeCustomFieldType(field?.type || "text") === "boolean") {
      condition.operator = "equals";
      if (!["true", "false"].includes(String(condition.value))) condition.value = "";
    }
  }
}

function conditionRuleSummary(condition) {
  if (condition.type === "tag") {
    if (!condition.value) return "Escolha uma tag";
    return `${condition.operator === "not_contains" ? "não é" : "está"} ${condition.value}`;
  }
  if (condition.type === "field") {
    const field = findCustomFieldForPage(condition.fieldId || condition.fieldName);
    return `${field?.name || condition.fieldName || "campo"} ${condition.value ? `é ${condition.value}` : "não definido"}`;
  }
  return condition.value ? `contém ${condition.value}` : "Mensagem contém termo";
}

function tagOptionsForCurrentPage(selectedValue = "") {
  return availableTagsForCurrentPage(selectedValue);
}

function availableTagsForCurrentPage(selectedValue = "") {
  return availableTagsForPage(currentFlowPageId(), selectedValue);
}

function availableTagsForPage(pageId, selectedValue = "") {
  const normalizedPageId = normalizeFlowPageId(pageId);
  const tags = unique([
    ...allContactTags(contactsForPage(normalizedPageId)),
    ...tagRecordsForPage(normalizedPageId).map((tag) => tag.name),
    ...flowActionTagsForPage(normalizedPageId)
  ]);
  const selected = String(selectedValue || "").trim();
  return unique(selected && !tags.includes(selected) ? [...tags, selected] : tags).sort((a, b) => a.localeCompare(b));
}

function tagStoreForPage(pageId = currentFlowPageId()) {
  if (!state.tagLibraryByPage || typeof state.tagLibraryByPage !== "object" || Array.isArray(state.tagLibraryByPage)) {
    state.tagLibraryByPage = {};
  }
  const normalizedPageId = normalizeFlowPageId(pageId);
  state.tagLibraryByPage[normalizedPageId] = normalizeTagStore(state.tagLibraryByPage[normalizedPageId]);
  return state.tagLibraryByPage[normalizedPageId];
}

function tagFoldersForPage(pageId = currentFlowPageId()) {
  return tagStoreForPage(pageId).folders;
}

function tagRecordsForPage(pageId = currentFlowPageId()) {
  return tagStoreForPage(pageId).tags;
}

function addTagFolder(folderName, pageId = currentFlowPageId()) {
  const name = String(folderName || "").trim();
  if (!name) return null;
  const store = tagStoreForPage(pageId);
  const existing = store.folders.find((folder) => normalize(folder.name) === normalize(name));
  if (existing) return existing;
  const folder = { id: makeId("folder"), name };
  store.folders.push(folder);
  store.folders.sort((a, b) => (a.id === DEFAULT_TAG_FOLDER_ID ? -1 : b.id === DEFAULT_TAG_FOLDER_ID ? 1 : a.name.localeCompare(b.name)));
  return folder;
}

function removeTagFolder(folderId, pageId = currentFlowPageId()) {
  if (!folderId || folderId === DEFAULT_TAG_FOLDER_ID) return false;
  const store = tagStoreForPage(pageId);
  store.folders = store.folders.filter((folder) => folder.id !== folderId);
  store.tags.forEach((tag) => {
    if (tag.folderId === folderId) tag.folderId = DEFAULT_TAG_FOLDER_ID;
  });
  return true;
}

function addTagToLibrary(tagName, pageId = currentFlowPageId(), folderIdOrName = null) {
  const value = normalizeTagName(tagName);
  if (!value) return null;
  const store = tagStoreForPage(pageId);
  const existing = store.tags.find((tag) => normalizeTagKey(tag.name) === normalizeTagKey(value));
  const folder =
    store.folders.find((item) => item.id === folderIdOrName) ||
    store.folders.find((item) => normalize(item.name) === normalize(folderIdOrName)) ||
    (folderIdOrName ? addTagFolder(folderIdOrName, pageId) : null) ||
    defaultTagFolder();

  if (existing) {
    if (folderIdOrName) existing.folderId = folder.id;
    return existing;
  }

  const tag = { id: makeStableTagId(value), name: value, folderId: folder.id };
  store.tags.push(tag);
  store.tags.sort((a, b) => a.name.localeCompare(b.name));
  return tag;
}

function flowActionTagsForPage(pageId = currentFlowPageId()) {
  return unique(
    localFlowsForPage(pageId).flatMap((flow) =>
      (flow.nodes || []).flatMap((node) => (node.type === "action" ? nodeActionSteps(node).map((step) => step.tag).filter(Boolean) : []))
    )
  );
}

function renderConditionPicker(node) {
  const query = normalize(conditionPickerQuery);
  const options = conditionOptions.filter((option) => option.category === conditionPickerCategory && (!query || normalize(option.label).includes(query)));
  return `
    <div class="condition-picker-popover">
      <label class="condition-picker-search-row">
        <span>${icons.search}</span>
        <input class="condition-picker-search" data-condition-search="true" value="${attr(conditionPickerQuery)}" aria-label="Pesquisar condição" />
      </label>
      <div class="condition-picker-body">
        <aside class="condition-picker-tabs">
          ${conditionPickerCategories
            .map((category) => `<button class="${conditionPickerCategory === category.id ? "active" : ""}" type="button" data-action="select-condition-category" data-category="${attr(category.id)}">${escapeHtml(category.label)}</button>`)
            .join("")}
        </aside>
        <div class="condition-picker-options">
          ${options
            .map((option) => `<button type="button" data-action="add-condition-rule" data-id="${node.id}" data-condition-option="${attr(option.id)}"><span>${conditionOptionIcon(option)}</span><strong>${escapeHtml(option.label)}</strong></button>`)
            .join("") || `<span class="muted">Nenhuma condição encontrada.</span>`}
        </div>
      </div>
    </div>
  `;
}

function conditionOptionIcon(option) {
  if (option.icon === "tag") return "◇";
  if (option.icon === "message") return "☰";
  return "T";
}

function renderDelaySettings(flow, node) {
  normalizeNodeStructure(node);
  const pageId = currentFlowPageId();
  if (customFieldStore.pageId !== pageId && !customFieldStore.loading) loadCustomFieldsForPage(pageId);
  return `
    <form class="inspector-form manychat-settings">
      ${renderEditableSettingsSectionHeader(flow, node, "Atraso Inteligente", "Controlar quando o fluxo continua", icons.delay)}
      <div class="settings-card">
        <label class="settings-field">
          <span>Tipo</span>
          <select data-node-field="delayType">
            ${optionSelect("duration", "Duração", node.delayType)}
            ${optionSelect("date", "Data específica", node.delayType)}
            ${optionSelect("dynamic_date", "Data dinâmica do contato", node.delayType)}
          </select>
        </label>
        ${
          node.delayType === "duration"
            ? `<div class="two-field-row">
                <label class="settings-field"><span>Quantidade</span><input type="number" min="0" data-node-field="delayValue" value="${attr(node.delayValue || node.delayMinutes || 0)}" /></label>
                <label class="settings-field"><span>Unidade</span><select data-node-field="delayUnit">${optionSelect("seconds", "Segundos", node.delayUnit)}${optionSelect("minutes", "Minutos", node.delayUnit)}${optionSelect("hours", "Horas", node.delayUnit)}${optionSelect("days", "Dias", node.delayUnit)}</select></label>
              </div>`
            : node.delayType === "date"
              ? `<label class="settings-field"><span>Data e hora</span><input type="datetime-local" data-node-field="specificDate" value="${attr(node.specificDate || "")}" /></label>`
              : renderDelayDynamicFieldSelect(node)
        }
        <div class="two-field-row">
          <label class="settings-field"><span>Continuar entre</span><input type="time" data-node-field="continueStart" value="${attr(node.continueStart || "")}" /></label>
          <label class="settings-field"><span>e</span><input type="time" data-node-field="continueEnd" value="${attr(node.continueEnd || "")}" /></label>
        </div>
        <label class="settings-field">
          <span>Dias permitidos</span>
          <select data-node-field="continueDays">
            ${optionSelect("any", "Qualquer dia", node.continueDays)}
            ${optionSelect("weekdays", "Segunda a sexta", node.continueDays)}
            ${optionSelect("weekends", "Fim de semana", node.continueDays)}
          </select>
        </label>
      </div>
      ${renderSelectedNextStep(flow, node)}
    </form>
  `;
}

function renderDelayDynamicFieldSelect(node) {
  const fields = customFieldRecordsForPage().filter((field) => ["date", "datetime"].includes(normalizeCustomFieldType(field.type)));
  const selected = findCustomFieldForPage(node.dynamicFieldId || node.dynamicField);
  const options = selected || !node.dynamicField ? fields : [...fields, { id: "", name: node.dynamicField, type: "text" }];
  return `
    <label class="settings-field">
      <span>Campo de data do contato</span>
      <select data-node-field="dynamicFieldId">
        <option value="" ${node.dynamicField || node.dynamicFieldId ? "" : "selected"}>Selecionar campo</option>
        ${options.map((field) => {
          const value = field.id || field.name;
          const isSelected = node.dynamicFieldId ? field.id === node.dynamicFieldId : normalizeCustomFieldKey(field.name) === normalizeCustomFieldKey(node.dynamicField);
          return `<option value="${attr(value)}" ${isSelected ? "selected" : ""}>${escapeHtml(field.name)}${["date", "datetime"].includes(normalizeCustomFieldType(field.type)) ? "" : " (legado)"}</option>`;
        }).join("")}
      </select>
    </label>
  `;
}

function syncDelayDynamicField(node, value) {
  const field = findCustomFieldForPage(value);
  node.dynamicFieldId = field?.id || "";
  node.dynamicField = field?.name || value || "";
}

function renderUserInputSettings(flow, node) {
  normalizeNodeStructure(node);
  return `
    <form class="inspector-form manychat-settings">
      ${renderEditableSettingsSectionHeader(flow, node, "Aguardar resposta", "Pausar o fluxo até o contato responder", icons.user_input)}
      <div class="settings-card">
        <label class="toggle-row">
          <input type="checkbox" data-node-field="saveResponse" ${node.saveResponse ? "checked" : ""} />
          <span>Salvar a próxima resposta do contato</span>
        </label>
        ${
          node.saveResponse
            ? `<label class="settings-field">
                <span>Campo onde a resposta será salva</span>
                <input data-node-field="responseField" value="${attr(node.responseField || "")}" placeholder="ex: ultima_resposta" />
              </label>`
            : ""
        }
        <label class="settings-field">
          <span>Tempo limite em minutos</span>
          <input type="number" min="0" data-node-field="timeoutMinutes" value="${attr(node.timeoutMinutes || 0)}" placeholder="0 = sem limite" />
        </label>
        <span class="settings-helper">Quando o contato responder, o fluxo continua pelo próximo passo usando a nova mensagem recebida.</span>
      </div>
      <div class="then-block">
        <strong>Depois da resposta...</strong>
        ${renderSelectedNextStep(flow, node)}
      </div>
    </form>
  `;
}

function renderLinkClickWaitSettings(flow, node) {
  normalizeNodeStructure(node);
  return `
    <form class="inspector-form manychat-settings">
      ${renderEditableSettingsSectionHeader(flow, node, "Aguardar clique no link", "Pausar ate o contato clicar no link anterior", icons.link_click_wait)}
      <div class="settings-card">
        <label class="settings-field">
          <span>Tempo limite em minutos</span>
          <input type="number" min="0" data-node-field="timeoutMinutes" value="${attr(node.timeoutMinutes || 0)}" placeholder="0 = sem limite" />
        </label>
        <span class="settings-helper">Este bloco aguarda o clique em um link rastreado enviado pelo node de mensagem anterior no caminho. A saida "Nao clicou" roda quando o tempo limite termina.</span>
      </div>
      <div class="condition-branches">
        ${targetSelectField(flow, node, node.clickedNext, "Se clicou no link", {
          field: "clickedNext",
          className: "condition-next-step",
          placeholder: "Escolher Proximo Passo"
        })}
        <div class="condition-branch-divider"><span></span><strong>Se nao</strong><span></span></div>
        ${targetSelectField(flow, node, node.noClickNext, "Se nao clicou no prazo", {
          field: "noClickNext",
          className: "condition-next-step",
          placeholder: "Escolher Proximo Passo"
        })}
      </div>
    </form>
  `;
}

function renderJumpSettings(flow, node) {
  normalizeNodeStructure(node);
  const pageId = normalizeFlowPageId(flow.pageId || currentFlowPageId());
  const flows = jumpTargetFlows(pageId);
  const selectedTargetFlow = jumpTargetFlow(node, flow);
  const targetNodes = selectedTargetFlow ? jumpTargetNodes(selectedTargetFlow, node, flow) : [];
  const selectedTargetNode = selectedTargetFlow?.nodes?.find((item) => item.id === node.targetNodeId) || null;
  const flowOptions = flows
    .map((item) => {
      const state = flowBadgeState(item);
      const label = `${item.name || "Fluxo sem nome"}${state?.label ? ` - ${state.label}` : ""}`;
      return `<option value="${attr(item.id)}" ${item.id === node.targetFlowId ? "selected" : ""}>${escapeHtml(label)}</option>`;
    })
    .join("");
  const nodeOptions = targetNodes
    .map((item) => `<option value="${attr(item.id)}" ${item.id === node.targetNodeId ? "selected" : ""}>${escapeHtml(jumpTargetNodeLabel(item))}</option>`)
    .join("");

  return `
    <form class="inspector-form manychat-settings">
      ${renderEditableSettingsSectionHeader(flow, node, "Selecionar passo existente", "Continuar em um passo de outro fluxo publicado", icons.jump)}
      <label class="settings-field">
        <span>Fluxo de destino</span>
        <select data-node-field="targetFlowId">
          <option value="">Selecione um fluxo</option>
          ${flowOptions}
        </select>
      </label>
      <label class="settings-field">
        <span>Passo de destino</span>
        <select data-node-field="targetNodeId" ${selectedTargetFlow ? "" : "disabled"}>
          <option value="">Selecione um passo</option>
          ${nodeOptions}
        </select>
      </label>
      <div class="settings-card jump-target-card">
        <strong>${selectedTargetNode ? "Destino configurado" : "Destino pendente"}</strong>
        <span>Fluxo: ${escapeHtml(selectedTargetFlow?.name || "Nenhum fluxo escolhido")}</span>
        <span>Passo: ${escapeHtml(selectedTargetNode ? jumpTargetNodeLabel(selectedTargetNode) : "Nenhum passo escolhido")}</span>
        <small>Em produção, o fluxo de destino precisa estar publicado e ligado.</small>
      </div>
    </form>
  `;
}

function jumpTargetFlows(pageId = currentFlowPageId()) {
  const normalizedPageId = normalizeFlowPageId(pageId);
  return state.flows.filter((flow) => normalizeFlowPageId(flow.pageId || normalizedPageId) === normalizedPageId);
}

function jumpTargetFlow(node, currentFlow = selectedFlow()) {
  const pageId = normalizeFlowPageId(currentFlow?.pageId || currentFlowPageId());
  const flowId = String(node?.targetFlowId || "").trim();
  if (!flowId) return null;
  return jumpTargetFlows(pageId).find((flow) => flow.id === flowId) || null;
}

function jumpTargetNodes(flow, node = null, currentFlow = selectedFlow()) {
  if (!flow?.nodes?.length) return [];
  const sameFlow = flow.id && currentFlow?.id && flow.id === currentFlow.id;
  return flow.nodes.filter((item) => item.id && !(sameFlow && item.id === node?.id) && canAcceptIncomingConnection(item) && item.type !== "jump");
}

function jumpTargetNodeLabel(node) {
  if (!node) return "";
  const title = node.title || nodeLabels[node.type] || "Bloco";
  return `${title} (${nodeLabels[node.type] || node.type || "Bloco"})`;
}

function jumpTargetSummary(node, currentFlow = selectedFlow()) {
  const flow = jumpTargetFlow(node, currentFlow);
  const target = flow?.nodes?.find((item) => item.id === node?.targetNodeId) || null;
  return { flow, target };
}

function renderRandomizerSettings(flow, node) {
  normalizeNodeStructure(node);
  return `
    <form class="inspector-form manychat-settings">
      ${renderEditableSettingsSectionHeader(flow, node, "Randomizador", "Distribuir contatos entre caminhos", icons.workflow)}
      <label class="toggle-row">
        <input type="checkbox" data-node-field="randomEveryTime" ${node.randomEveryTime ? "checked" : ""} />
        <span>Caminho aleatório sempre que o contato passar por aqui</span>
      </label>
      <div class="variation-list">
        ${node.variations.map((variation) => renderRandomizerVariation(flow, node, variation)).join("")}
        <button class="dashed-add-button" type="button" data-action="add-random-variation" data-id="${node.id}">+ Nova variação</button>
      </div>
    </form>
  `;
}

function renderRandomizerVariation(flow, node, variation) {
  return `
    <article class="variation-card">
      <label class="settings-field">
        <span>Nome</span>
        <input data-random-variation-field="label" data-variation-id="${attr(variation.id)}" value="${attr(variation.label || "")}" />
      </label>
      <label class="settings-field">
        <span>%</span>
        <input type="number" min="0" max="100" data-random-variation-field="weight" data-variation-id="${attr(variation.id)}" value="${attr(variation.weight || 0)}" />
      </label>
      ${targetSelectField(flow, node, variation.next, "Próximo passo", { field: "next", variationId: variation.id })}
      <button class="mini-menu-button" type="button" data-action="remove-random-variation" data-variation-id="${attr(variation.id)}" title="Remover">&times;</button>
    </article>
  `;
}

function targetSelectField(flow, node, value, label, data = {}) {
  const { className = "", placeholder = "Sem próximo passo", ...targetData } = data;
  const dataAttrs = Object.entries(targetData)
    .map(([key, item]) => `data-target-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}="${attr(item)}"`)
    .join(" ");
  const options = flow.nodes
    .filter((item) => item.id !== node.id && canAcceptIncomingConnection(item))
    .map((item) => `<option value="${attr(item.id)}" ${item.id === value ? "selected" : ""}>${escapeHtml(item.title || nodeLabels[item.type] || "Bloco")}</option>`)
    .join("");
  return `
    <label class="settings-field ${attr(className)}">
      ${label ? `<span>${escapeHtml(label)}</span>` : ""}
      <select data-target-select="true" ${dataAttrs}>
        <option value="">${escapeHtml(placeholder)}</option>
        ${options}
      </select>
    </label>
  `;
}

function renderCommentSettings(flow, node) {
  return `
    <form class="inspector-form manychat-settings">
      ${renderEditableSettingsSectionHeader(flow, node, "Comentário", "Anotação interna no canvas", icons.comment)}
      <label class="settings-field">
        <span>Comentário</span>
        <textarea data-node-field="message">${escapeHtml(node.message || "")}</textarea>
        <small>Aceita Markdown: títulos, listas, links, citações, negrito, itálico e código.</small>
      </label>
    </form>
  `;
}

function renderActionSettings(flow, node) {
  const pageId = currentFlowPageId();
  if (customFieldStore.pageId !== pageId && !customFieldStore.loading) loadCustomFieldsForPage(pageId);
  return `
    <form class="inspector-form manychat-settings">
      ${renderEditableNodeHeader(flow, node, {
        className: "manychat-action-head",
        fallback: "Ações",
        ariaLabel: "Nome das ações"
      })}
      <div class="action-settings-copy">Realize as seguintes ações:</div>
      <div class="action-step-list">
        ${nodeActionSteps(node).map((step) => renderActionStep(node.id, step)).join("")}
        <button class="dashed-add-button action-add-button" type="button" data-action="open-action-picker" data-id="${node.id}">+ Ação</button>
      </div>
      <div class="next-step-divider"></div>
      <div class="then-block">
        ${
          node.next
            ? renderSelectedNextStep(flow, node)
            : `<button class="choose-next-step-button blue" type="button" data-action="open-next-step-picker" data-id="${node.id}">Escolher Próximo Passo</button>`
        }
      </div>
    </form>
  `;
}

function renderActionStep(nodeId, step) {
  const label = actionStepLabel(step);
  const fieldId = `action_${step.id || makeId("act")}`;
  const removeButton = `<button class="mini-menu-button" type="button" data-action="remove-action-step" data-id="${nodeId}" data-step-id="${attr(step.id)}" title="Remover ação">&times;</button>`;

  if (step.type === "add_tag" || step.type === "remove_tag") {
    return `
      <article class="action-step-card">
        <div class="action-step-title">
          <span class="action-step-icon">${icons.action}</span>
          <strong>${escapeHtml(label)}</strong>
          ${removeButton}
        </div>
        <div class="action-tag-combobox">
          <input id="${attr(fieldId)}" data-action="open-action-tag-picker" data-action-tag-input="${attr(step.id)}" data-action-step-field="tag" data-step-id="${attr(step.id)}" value="${attr(step.tag || "")}" autocomplete="off" placeholder="Digite ou selecione a tag" />
          ${actionTagPickerStepId === step.id ? renderActionTagPicker(step) : ""}
        </div>
      </article>
    `;
  }

  if (step.type === "set_user_field" || step.type === "clear_custom_field") {
    return `
      <article class="action-step-card">
        <div class="action-step-title">
          <span class="action-step-icon">${icons.action}</span>
          <strong>${escapeHtml(label)}</strong>
          ${removeButton}
        </div>
        ${renderActionCustomFieldControl(step)}
        ${
          step.type === "set_user_field"
            ? renderActionCustomFieldValue(step)
            : ""
        }
      </article>
    `;
  }

  return `
    <article class="action-step-card compact">
      <div class="action-step-title">
        <span class="action-step-icon">${icons.action}</span>
        <strong>${escapeHtml(label)}</strong>
        ${removeButton}
      </div>
    </article>
  `;
}

function renderActionCustomFieldControl(step) {
  const selected = findCustomFieldForPage(step.fieldId || step.fieldName);
  return `
    <div class="action-field-control">
      <button class="action-field-trigger ${selected ? "" : "missing"}" type="button" data-action="open-action-field-picker" data-step-id="${attr(step.id)}">
        ${escapeHtml(selected?.name || step.fieldName || "Campo desconhecido (undefined)")}
      </button>
      ${actionFieldPickerStepId === step.id ? renderActionCustomFieldPicker(step) : ""}
    </div>
  `;
}

function renderActionCustomFieldPicker(step) {
  const query = normalize(actionFieldPickerQuery);
  const fields = customFieldRecordsForPage().filter((field) => !query || normalize(field.name).includes(query));
  return `
    <div class="action-field-picker">
      <strong>Campo do Usuário</strong>
      <input id="action_field_${attr(step.id)}" data-action="expand-action-field-picker" data-action-field-search="true" data-step-id="${attr(step.id)}" value="${attr(actionFieldPickerQuery)}" autocomplete="off" />
      ${
        actionFieldPickerExpanded
          ? `
            <div class="action-field-picker-menu">
              <div class="action-field-picker-list">
                ${
                  fields.length
                    ? fields.map((field) => `
                        <button type="button" data-action="select-action-custom-field" data-step-id="${attr(step.id)}" data-field-id="${attr(field.id)}" data-field-name="${attr(field.name)}">
                          <strong>${escapeHtml(field.name)}</strong>
                          <small>${escapeHtml(customFieldTypeLabel(field.type))}</small>
                        </button>
                      `).join("")
                    : `<span class="action-field-picker-empty">Configure campos personalizados para coletar e armazenar informações específicas sobre seus clientes.</span>`
                }
              </div>
              <button class="action-field-create" type="button" data-action="create-action-custom-field" data-step-id="${attr(step.id)}">+ Campo do Usuário</button>
            </div>
          `
          : `<small>Primeiro, selecione o campo</small>`
      }
    </div>
  `;
}

function renderActionCustomFieldValue(step) {
  const field = findCustomFieldForPage(step.fieldId || step.fieldName);
  if (!step.fieldName && !step.fieldId) return "";
  const type = normalizeCustomFieldType(field?.type || step.fieldType);
  const common = `data-action-step-field="fieldValue" data-step-id="${attr(step.id)}"`;
  const dynamicValue = String(step.fieldValue ?? "").includes("{{");
  if (type === "boolean") {
    return `
      <select ${common}>
        <option value="" ${step.fieldValue === "" ? "selected" : ""}>Selecionar valor</option>
        <option value="true" ${String(step.fieldValue) === "true" ? "selected" : ""}>Verdadeiro</option>
        <option value="false" ${String(step.fieldValue) === "false" ? "selected" : ""}>Falso</option>
      </select>
    `;
  }
  const inputType = dynamicValue ? "text" : type === "number" ? "number" : type === "date" ? "date" : type === "datetime" ? "datetime-local" : "text";
  return `
    <input type="${attr(inputType)}" ${common} value="${attr(step.fieldValue ?? "")}" placeholder="Valor ou {{entry.ad_id}}" />
    <small class="settings-hint">Aceita {{entry.ad_id}}, {{entry.source_key}}, {{entry.page_id}} e {{entry.source}}. No orgânico, {{entry.source}} e {{entry.ad_id}} viram organic.</small>
  `;
}

function renderActionTagPicker(step) {
  const tags = availableTagsForCurrentPage(step.tag).filter((tagName) => {
    const query = normalize(step.tag || "");
    return !query || normalize(tagName).includes(query);
  });
  return `
    <div class="action-tag-picker">
      <div class="action-tag-picker-list">
        ${
          tags.length
            ? tags.map((tagName) => `<button type="button" data-action="select-action-tag" data-step-id="${attr(step.id)}" data-tag="${attr(tagName)}">${escapeHtml(tagName)}</button>`).join("")
            : `<span class="action-tag-empty">Nenhuma tag encontrada.</span>`
        }
      </div>
      <button class="action-tag-create" type="button" data-action="open-create-action-tag" data-step-id="${attr(step.id)}">+ Tag</button>
    </div>
  `;
}

function renderActionPicker(flow) {
  const node = actionPickerNodeId ? flow.nodes.find((item) => item.id === actionPickerNodeId) : null;
  if (!node) return "";
  const categories = unique(actionOptions.map((option) => option.category));
  const activeOptions = actionOptions.filter((option) => option.category === actionPickerCategory);

  return `
    <div class="action-picker-backdrop" aria-hidden="false">
      <section class="action-picker-panel" aria-label="Selecionar ação">
        <div class="action-picker-header">
          <strong>Realize as seguintes ações...</strong>
          <button class="icon-button" type="button" data-action="close-action-picker" title="Fechar">&times;</button>
        </div>
        <div class="action-picker-body">
          <aside class="action-picker-tabs">
            ${categories
              .map((category) => {
                const option = actionOptions.find((item) => item.category === category);
                return `
                  <button class="${actionPickerCategory === category ? "active" : ""}" type="button" data-action="select-action-category" data-category="${attr(category)}">
                    <span>${category === "contact" ? icons.users : category === "inbox" ? icons.inbox : icons.workflow}</span>
                    <span>${escapeHtml(option?.categoryLabel || category)}</span>
                  </button>
                `;
              })
              .join("")}
            <div class="action-picker-upgrade">
              <strong>Obtenha acesso a novas ações -></strong>
              <span>Conecte integrações e amplie as possibilidades de ações em suas automações.</span>
            </div>
          </aside>
          <div class="action-picker-list">
            <div class="action-picker-list-head">
              <strong>${escapeHtml(actionPickerCategory === "contact" ? "Utilizado recentemente" : activeOptions[0]?.categoryLabel || "Ações")}</strong>
              <span>Ações utilizadas recentemente.</span>
            </div>
            ${activeOptions.map((option) => renderActionOption(option)).join("")}
          </div>
        </div>
      </section>
    </div>
  `;
}

function renderActionOption(option) {
  return `
    <button class="action-option" type="button" data-action="add-action-step" data-type="${attr(option.id)}">
      <span class="action-option-icon">${icons.action}</span>
      <span>
        <strong>${escapeHtml(option.title)}</strong>
        <small>${escapeHtml(option.description)}</small>
      </span>
    </button>
  `;
}

function settingsSectionHeader(title, subtitle, icon) {
  return `
    <div class="settings-section-header">
      <span class="settings-section-icon">${icon}</span>
      <div>
        <strong>${escapeHtml(title)}</strong>
        <span>${escapeHtml(subtitle)}</span>
      </div>
    </div>
  `;
}

function renderSimulator() {
  return `
    <div class="simulator">
      <div class="sim-header">
        <strong>Simulador Messenger</strong>
        <button class="secondary-button" type="button" data-action="start-sim">${icons.play}<span>Rodar</span></button>
      </div>
      <div class="sim-messages">
        ${
          simLog.length
            ? simLog.map((message) => `<div class="bubble ${message.from === "user" ? "inbound" : "outbound"}">${escapeHtml(message.text)}</div>`).join("")
            : `<div class="empty-state">${icons.message}<span>Teste palavras como "oi" ou "quero orçamento".</span></div>`
        }
      </div>
      <div class="chat-input">
        <input id="simInput" type="text" placeholder="Mensagem do assinante" />
        <button class="icon-button" type="button" data-action="send-sim" title="Enviar">${icons.send}</button>
      </div>
    </div>
  `;
}

function handleWorkspaceClick(event) {
  if (activeView === "flows" && flowCanvasOpen) rememberCanvasScroll();

  if (actionPickerNodeId && event.target.closest(".action-picker-backdrop") && !event.target.closest(".action-picker-panel")) {
    actionPickerNodeId = "";
    return render();
  }

  if (triggerPickerNodeId && event.target.closest(".trigger-picker-backdrop") && !event.target.closest(".trigger-picker-panel")) {
    triggerPickerNodeId = "";
    return render();
  }

  if (conditionPickerNodeId && !event.target.closest(".condition-picker-popover") && !event.target.closest("[data-action='open-condition-picker']")) {
    conditionPickerNodeId = "";
    conditionPickerQuery = "";
    if (!event.target.closest("[data-action]")) return render();
  }

  if (actionTagPickerStepId && !event.target.closest(".action-tag-picker") && !event.target.closest("[data-action-tag-input]")) {
    actionTagPickerStepId = "";
    if (!event.target.closest("[data-action]")) return render();
  }

  if (actionFieldPickerStepId && !event.target.closest(".action-field-picker") && !event.target.closest("[data-action='open-action-field-picker']")) {
    actionFieldPickerStepId = "";
    actionFieldPickerExpanded = false;
    actionFieldPickerQuery = "";
    if (!event.target.closest("[data-action]")) return render();
  }

  if (contactTagPickerContactId && !event.target.closest(".contact-tag-picker") && !event.target.closest("[data-action='open-contact-tag-picker']")) {
    contactTagPickerContactId = "";
    if (!event.target.closest("[data-action]")) return render();
  }

  if (canvasAddMenu && !event.target.closest(".canvas-add-menu")) {
    canvasAddMenu = null;
    document.querySelector(".canvas-add-menu")?.remove();
    if (!event.target.closest("[data-action]")) return;
  }

  if (event.target.closest(".node-port")) return;
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  const id = button.dataset.id;

  if (action === "go-flows") return navigate("flows");
  if (action === "go-pages") return navigate("pages");
  if (action === "go-setup") return navigate("setup");
  if (action === "back-to-flows") {
    flowCanvasOpen = false;
    flowCanvasMode = "edit";
    showInspector = false;
    messageButtonEditorOptionId = "";
    messageImageUrlEditorBlockId = "";
    messageImageUrlPopoverPosition = null;
    messageCardUrlEditorBlockId = "";
    messageCardUrlPopoverPosition = null;
    messageMorePanelOpen = false;
    messageMorePanelPosition = null;
    triggerPickerNodeId = "";
    nextStepPickerNodeId = "";
    actionPickerNodeId = "";
    actionTagPickerStepId = "";
    actionFieldPickerStepId = "";
    actionFieldPickerExpanded = false;
    actionFieldPickerQuery = "";
    conditionPickerNodeId = "";
    canvasAddMenu = null;
    return render();
  }
  if (action === "toggle-flow-list") return toggleFlowList();
  if (action === "toggle-inspector") return toggleInspector();
  if (action === "peek-inspector") return peekInspector();
  if (action === "edit-published-flow") return editPublishedFlow();
  if (action === "refresh-flow-metrics") return loadFlowMetrics(currentFlowPageId(), selectedFlowId, { force: true });
  if (action === "open-trigger-picker") return openTriggerPicker(id);
  if (action === "close-trigger-picker") {
    triggerPickerNodeId = "";
    nextStepPickerNodeId = "";
    actionPickerNodeId = "";
    actionTagPickerStepId = "";
    conditionPickerNodeId = "";
    canvasAddMenu = null;
    return render();
  }
  if (action === "add-trigger-event") return addTriggerEvent(id, button.dataset.triggerId);
  if (action === "open-next-step-picker") return openNextStepPicker(id);
  if (action === "close-next-step-picker") return closeNextStepPicker();
  if (action === "add-next-step") return addNextStep(button.dataset.type);
  if (action === "set-existing-next-step") return setExistingNextStep(id, button.dataset.targetId);
  if (action === "disconnect-connection") return disconnectConnection(button);
  if (action === "open-action-picker") return openActionPicker(id);
  if (action === "close-action-picker") return closeActionPicker();
  if (action === "select-action-category") return selectActionCategory(button.dataset.category);
  if (action === "add-action-step") return addActionStep(button.dataset.type);
  if (action === "remove-action-step") return removeActionStep(id, button.dataset.stepId);
  if (action === "open-action-tag-picker") return openActionTagPicker(button.dataset.stepId);
  if (action === "select-action-tag") return selectActionTag(button.dataset.stepId, button.dataset.tag);
  if (action === "open-create-action-tag") return openCreateActionTagModal(button.dataset.stepId);
  if (action === "open-action-field-picker") return openActionFieldPicker(button.dataset.stepId);
  if (action === "expand-action-field-picker") return expandActionFieldPicker(button.dataset.stepId);
  if (action === "select-action-custom-field") return selectActionCustomField(button.dataset.stepId, button.dataset.fieldName, button.dataset.fieldId);
  if (action === "create-action-custom-field") return openCreateCustomFieldModal(button.dataset.stepId);
  if (action === "open-condition-picker") return openConditionPicker(id);
  if (action === "close-condition-picker") return closeConditionPicker();
  if (action === "select-condition-category") return selectConditionCategory(button.dataset.category);
  if (action === "add-condition-rule") return addConditionRule(id, button.dataset.conditionOption);
  if (action === "remove-condition-rule") return removeConditionRule(button.dataset.conditionId);
  if (action === "toggle-condition-match") return toggleConditionMatch(id);
  if (action === "connect-facebook") {
    window.location.href = "/api/auth/facebook/start";
    return;
  }
  if (action === "logout-facebook") return logoutFacebook();
  if (action === "select-meta-page") return selectMetaPage(id);
  if (action === "refresh-meta-conversations") return refreshMetaConversations();
  if (action === "select-meta-conversation") return selectMetaConversation(id);
  if (action === "send-meta-message") return sendMetaMessage();
  if (action === "run-meta-flow") return runMetaConversationFlow();
  if (action === "open-page-flow") return openPageFlow();
  if (action === "open-contact") {
    selectedContactId = id;
    return navigate("inbox");
  }
  if (action === "new-flow") return createFlow();
  if (action === "select-flow") {
    selectedFlowId = id;
    flowCanvasMode = hasPublishedFlow(selectedFlow()) ? "published" : "edit";
    selectedNodeId = canvasDisplayFlow(selectedFlow())?.nodes.find((node) => node.type === "message")?.id || canvasDisplayFlow(selectedFlow())?.nodes[0]?.id;
    messageButtonEditorOptionId = "";
    flowCanvasOpen = true;
    showFlowList = false;
    showInspector = flowCanvasMode === "published";
    triggerPickerNodeId = "";
    nextStepPickerNodeId = "";
    actionPickerNodeId = "";
    actionTagPickerStepId = "";
    actionFieldPickerStepId = "";
    actionFieldPickerExpanded = false;
    actionFieldPickerQuery = "";
    canvasAddMenu = null;
    shouldAutoFitCanvas = true;
    localStorage.setItem("messenlead.canvas.flowList", "false");
    simLog = [];
    return render();
  }
  if (action === "select-node") {
    if (suppressedNodeClickId === id) {
      suppressedNodeClickId = "";
      return;
    }
    selectedNodeId = id;
    messageButtonEditorOptionId = "";
    messageImageUrlEditorBlockId = "";
    messageImageUrlPopoverPosition = null;
    messageCardUrlEditorBlockId = "";
    messageCardUrlPopoverPosition = null;
    messageMorePanelOpen = false;
    messageMorePanelPosition = null;
    showInspector = true;
    showFlowList = false;
    triggerPickerNodeId = "";
    nextStepPickerNodeId = "";
    actionPickerNodeId = "";
    actionTagPickerStepId = "";
    actionFieldPickerStepId = "";
    actionFieldPickerExpanded = false;
    actionFieldPickerQuery = "";
    canvasAddMenu = null;
    localStorage.setItem("messenlead.canvas.flowList", "false");
    return render();
  }
  if (action === "add-node") return addNode(button.dataset.type);
  if (action === "add-node-at-menu") return addNodeFromCanvasMenu(button.dataset.type);
  if (action === "add-message-block") return addMessageBlock(button.dataset.type);
  if (action === "remove-message-block") return removeMessageBlock(button.dataset.blockId);
  if (action === "duplicate-message-block") return duplicateMessageBlock(button.dataset.blockId);
  if (action === "move-message-block") return moveMessageBlock(button.dataset.blockId);
  if (action === "choose-message-block-file") return document.getElementById(button.dataset.inputId)?.click();
  if (action === "open-message-image-url") return openMessageImageUrlEditor(button.dataset.blockId, button);
  if (action === "close-message-image-url") return closeMessageImageUrlEditor();
  if (action === "open-message-card-url") return openMessageCardUrlEditor(button.dataset.blockId, button);
  if (action === "close-message-card-url") return closeMessageCardUrlEditor();
  if (action === "set-card-image-aspect") return setCardImageAspect(button.dataset.blockId, button.dataset.aspect);
  if (action === "toggle-message-more-panel") return toggleMessageMorePanel(button);
  if (action === "add-message-block-button") return addMessageBlockButton(button.dataset.blockId);
  if (action === "remove-message-block-button") return removeMessageBlockButton(button.dataset.blockId, button.dataset.buttonId);
  if (action === "add-message-button") return addMessageButton();
  if (action === "edit-message-button") return editMessageButton(button.dataset.optionId);
  if (action === "close-message-button-editor") return closeMessageButtonEditor();
  if (action === "set-message-button-behavior") return setMessageButtonBehavior(button.dataset.behavior);
  if (action === "add-quick-reply") return addQuickReply();
  if (action === "remove-message-option") return removeMessageOption(button.dataset.optionKind, button.dataset.optionId);
  if (action === "add-random-variation") return addRandomVariation();
  if (action === "remove-random-variation") return removeRandomVariation(button.dataset.variationId);
  if (action === "close-canvas-add-menu") {
    canvasAddMenu = null;
    return render();
  }
  if (action === "duplicate-node") return duplicateNodeById(id);
  if (action === "delete-node-by-id") return deleteNodeById(id);
  if (action === "set-flow-status") return setFlowStatus(button.dataset.status);
  if (action === "toggle-flow-active") return toggleFlowActive(id);
  if (action === "publish-flow") return publishSelectedFlow();
  if (action === "duplicate-flow") return duplicateFlow();
  if (action === "duplicate-flow-card") return duplicateFlow(id, { openCanvas: false });
  if (action === "export-flow-json") return exportSelectedFlowJson();
  if (action === "import-flow-json") return document.querySelector("#flowImportFile")?.click();
  if (action === "delete-flow") return deleteFlow();
  if (action === "delete-flow-card") return deleteFlow(id, { openCanvasAfterDelete: false });
  if (action === "delete-node") return deleteNode();
  if (action === "canvas-zoom-in") return setCanvasZoom(canvasZoom + 0.08);
  if (action === "canvas-zoom-out") return setCanvasZoom(canvasZoom - 0.08);
  if (action === "canvas-fit") return fitCanvasToViewport();
  if (action === "start-sim") return startSimulation();
  if (action === "send-sim") return sendSimulationMessage();
  if (action === "new-contact") return createContact();
  if (action === "refresh-contacts") return refreshContacts();
  if (action === "open-contact-tag-picker") return openContactTagPicker(id);
  if (action === "select-contact-tag") return selectContactTag(id, button.dataset.tag);
  if (action === "add-contact-tag") return addTagFromContactEditor(id, button.dataset.inputId);
  if (action === "remove-contact-tag") return removeContactTag(id, button.dataset.tag);
  if (action === "clear-contact-custom-field") return clearContactCustomField(id, button.dataset.fieldName, button.dataset.fieldId);
  if (action === "select-contact") {
    selectedContactId = id;
    return render();
  }
  if (action === "send-contact-message") return sendContactMessage();
  if (action === "insert-template") return insertTemplate();
  if (action === "run-contact-flow") return runFlowForContact();
  if (action === "toggle-contact-status") return toggleContactStatus();
  if (action === "export-csv") return exportSubscribersCsv();
  if (action === "new-campaign") return createCampaign();
  if (action === "launch-campaign") return launchCampaign(id);
  if (action === "run-missing-tag-flow") return runMissingTagFlow();
  if (action === "delete-campaign") return deleteCampaign(id);
  if (action === "create-tag-folder") return openCreateTagFolderModal();
  if (action === "delete-tag-folder") return confirmDeleteTagFolder(button.dataset.folderId);
  if (action === "create-custom-field") return openCreateCustomFieldModal();
  if (action === "delete-custom-field") return confirmDeleteCustomField(id);
  if (action === "reset-running-flows") return confirmResetRunningFlows();
  if (action === "clear-all-contact-tags") return confirmClearAllContactTags();
  if (action === "set-flow-log-scope") return setFlowLogScope(button.dataset.scope);
  if (action === "set-flow-log-filter") return setFlowLogFilter(button.dataset.filter);
  if (action === "refresh-flow-logs") return refreshFlowLogs();
  if (action === "test-flow-log") return testFlowLog();
  if (action === "process-messenger-queue") return processMessengerQueue();
  if (action === "test-ad-flow") return testAdFlow("messaging");
  if (action === "test-ad-flow-standby") return testAdFlow("standby");
  if (action === "check-webhook-subscription") return checkWebhookSubscription();
  if (action === "subscribe-page-webhook") return subscribePageWebhook();
  if (action === "setup-get-started") return setupGetStartedButton();
  if (action === "check-get-started") return checkGetStartedButton();
  if (action === "clear-flow-logs") return clearFlowLogs();
  if (action === "refresh-pixel-events") return loadPixelEventsForPage(currentFlowPageId());
  if (action === "refresh-attributions") return loadAttributionsForPage(currentFlowPageId());
  if (action === "refresh-origin-sources") return loadAttributionSources({ query: searchQuery });
  if (action === "copy-origin-key") return copyText(button.dataset.value || "", "Chave curta copiada.");
  if (action === "copy-origin-ad-id") return copyText(button.dataset.value || "", "ID do anuncio copiado.");
  if (action === "copy-ad-entry-template") return copyText(adEntryTemplateJson(), "Template JSON copiado.");
  if (action === "open-json-templates") return navigate("json_templates");
  if (action === "refresh-json-templates") return loadJsonTemplatesForPage(currentFlowPageId());
  if (action === "create-json-template") return openJsonTemplateModal();
  if (action === "create-default-json-template") return createDefaultJsonTemplate();
  if (action === "copy-json-template") return copyJsonTemplate(id);
  if (action === "edit-json-template") return editJsonTemplate(id);
  if (action === "delete-json-template") return confirmDeleteJsonTemplate(id);
  if (action === "copy-pixel-snippet") return copyText(pixelInstallSnippet(currentFlowPageId()), "Pixel copiado.");
  if (action === "set-pixel-range") {
    pixelState.rangeDays = Number(button.dataset.days || 7);
    return loadPixelEventsForPage(currentFlowPageId());
  }
  if (action === "refresh-media-assets") return loadMediaAssetsForPage(currentFlowPageId());
  if (action === "choose-media-image") return document.querySelector("#mediaImageUpload")?.click();
  if (action === "choose-media-audio") return document.querySelector("#mediaAudioUpload")?.click();
  if (action === "choose-media-video") return document.querySelector("#mediaVideoUpload")?.click();
  if (action === "copy-media-url") return copyMediaUrl(id);
  if (action === "insert-media-in-message") return insertMediaInSelectedMessage(id);
  if (action === "delete-media-asset") return confirmDeleteMediaAsset(id);
  if (action === "copy-webhook") return copyText(webhookUrl(), "Webhook copiado.");
  if (action === "copy-oauth") return copyText(`${location.origin}/api/auth/facebook/callback`, "Callback OAuth copiado.");
  if (action === "copy-db-binding") return copyText("DB", "Nome do binding D1 copiado.");
  if (action === "copy-fields") return copyText("messages,messaging_postbacks,messaging_optins,messaging_referrals,message_deliveries,message_reads,message_echoes,messaging_handovers,standby", "Campos copiados.");
  if (action === "refresh-broadcast-eligibility") return refreshBroadcastEligibility();
  if (action === "choose-image") return document.querySelector("#imageUpload")?.click();
  if (action === "download-clean-image") return downloadCleanImage();
  if (action === "clear-image-tool") return clearImageTool();
  if (action === "choose-video") return document.querySelector("#videoUpload")?.click();
  if (action === "choose-audio") return document.querySelector("#audioUpload")?.click();
  if (action === "process-video-audio") return processVideoAudio();
  if (action === "download-video-output") return downloadVideoOutput();
  if (action === "clear-video-tool") return clearVideoTool();
  if (action === "copy-verify") return copyText(state.settings.verifyToken, "Verify token copiado.");
  if (action === "copy-send") return copyText(`${location.origin}/api/messenger/send`, "Endpoint copiado.");
  if (action === "copy-env") return copyText(document.querySelector("#envBlock")?.textContent || "", "Variáveis copiadas.");
  if (action === "copy-flow-json") return copyText(compactFlowJson(), "JSON dos fluxos copiado.");
  if (action === "download-flow-json") return downloadFile("messenlead-flows.json", JSON.stringify({ flows: state.flows }, null, 2), "application/json");
  if (action === "export-json") return exportWorkspace();
  if (action === "reset-workspace") return resetWorkspace();
}

function handleWorkspaceInput(event) {
  const target = event.target;
  const flow = selectedFlow();
  const node = flow ? selectedNode(flow) : null;

  if (target.dataset.nodeField && node) {
    const fieldName = target.dataset.nodeField;
    node[fieldName] = normalizeFieldValue(fieldName, target.value);
    if (fieldName === "delayValue" || fieldName === "delayUnit") node.delayMinutes = delayToMinutes(node);
    if (fieldName === "dynamicFieldId") syncDelayDynamicField(node, target.value);
    if (fieldName === "message") syncTextBlockFromLegacyMessage(node);
    if (fieldName === "title") updateCanvasNodeTitle(flow, node);
    flow.updatedAt = new Date().toISOString();
    saveState();
  }

  if (target.dataset.triggerConfigField && node?.type === "trigger") {
    normalizeNodeStructure(node);
    const triggerId = target.dataset.triggerId;
    node.triggerConfigs[triggerId] = node.triggerConfigs[triggerId] || {};
    node.triggerConfigs[triggerId][target.dataset.triggerConfigField] = target.value.trim();
    flow.updatedAt = new Date().toISOString();
    saveState();
  }

  if (target.dataset.messageBlockField && node?.type === "message") {
    const block = node.contentBlocks?.find((item) => item.id === target.dataset.blockId);
    if (!block) return;
    block[target.dataset.messageBlockField] = target.value;
    syncLegacyMessageFromBlocks(node);
    flow.updatedAt = new Date().toISOString();
    saveState();
  }

  if (target.dataset.messageBlockButtonField && node?.type === "message") {
    const option = findMessageBlockButton(node, target.dataset.blockId, target.dataset.buttonId);
    if (!option) return;
    option[target.dataset.messageBlockButtonField] = target.value;
    flow.updatedAt = new Date().toISOString();
    saveState();
  }

  if (target.dataset.messageOptionField && node?.type === "message") {
    const list = target.dataset.optionKind === "button" ? node.buttons : node.quickReplies;
    const option = list?.find((item) => item.id === target.dataset.optionId);
    if (!option) return;
    option[target.dataset.messageOptionField] = target.value;
    flow.updatedAt = new Date().toISOString();
    saveState();
  }

  if (target.dataset.randomVariationField && node?.type === "randomizer") {
    const variation = node.variations?.find((item) => item.id === target.dataset.variationId);
    if (!variation) return;
    variation[target.dataset.randomVariationField] =
      target.dataset.randomVariationField === "weight" ? Math.max(0, Number(target.value) || 0) : target.value;
    flow.updatedAt = new Date().toISOString();
    saveState();
  }

  if (target.dataset.conditionSearch) {
    conditionPickerQuery = target.value;
    render();
    return;
  }

  if (target.dataset.actionFieldSearch) {
    actionFieldPickerQuery = target.value;
    actionFieldPickerExpanded = true;
    render();
    requestAnimationFrame(() => {
      const input = document.getElementById(`action_field_${target.dataset.stepId || ""}`);
      input?.focus();
      input?.setSelectionRange?.(input.value.length, input.value.length);
    });
    return;
  }

  if (target.dataset.conditionRuleField && node?.type === "condition") {
    const condition = node.conditions?.find((item) => item.id === target.dataset.conditionId);
    if (!condition) return;
    const ruleField = target.dataset.conditionRuleField;
    updateConditionRuleField(condition, ruleField, target.value);
    if ((condition.type === "tag" || condition.type === "message_contains") && ruleField === "value") node.keyword = target.value;
    if (condition.type === "field") {
      node.fieldId = condition.fieldId || "";
      node.fieldName = condition.fieldName || "";
      node.conditionOperator = condition.operator || node.conditionOperator;
      if (ruleField === "value") node.fieldValue = condition.value || "";
    }
    flow.updatedAt = new Date().toISOString();
    saveState();
  }

  if (target.dataset.actionStepField && node) {
    const step = nodeActionSteps(node).find((item) => item.id === target.dataset.stepId);
    if (!step) return;
    step[target.dataset.actionStepField] = target.value;
    if (target.dataset.actionStepField === "fieldName") {
      const field = findCustomFieldForPage(target.value);
      step.fieldId = field?.id || "";
      step.fieldType = field?.type || normalizeCustomFieldType(step.fieldType);
      step.fieldValue = "";
    }
    if (target.dataset.actionStepField === "tag") actionTagPickerStepId = step.id;
    node.message = summarizeActionSteps(node);
    flow.updatedAt = new Date().toISOString();
    saveState();
  }

  if (target.dataset.flowField && flow) {
    flow[target.dataset.flowField] = target.value;
    flow.updatedAt = new Date().toISOString();
    saveState();
  }

  if (target.dataset.settingField) {
    state.settings[target.dataset.settingField] = target.value;
    saveState();
  }

  if (target.dataset.videoField) {
    updateVideoToolField(target, { renderAfter: false });
  }
}

function handleWorkspaceChange(event) {
  const target = event.target;
  const flow = selectedFlow();
  const node = flow ? selectedNode(flow) : null;

  if (target.id === "imageUpload") {
    handleImageUpload(target.files?.[0]);
    target.value = "";
    return;
  }
  if (target.id === "videoUpload") {
    handleVideoUpload(target.files?.[0]);
    target.value = "";
    return;
  }
  if (target.id === "audioUpload") {
    handleAudioUpload(target.files?.[0]);
    target.value = "";
    return;
  }
  if (target.id === "mediaImageUpload") {
    uploadMediaFile(target.files?.[0], "image");
    target.value = "";
    return;
  }
  if (target.id === "mediaAudioUpload") {
    uploadMediaFile(target.files?.[0], "audio");
    target.value = "";
    return;
  }
  if (target.id === "mediaVideoUpload") {
    uploadMediaFile(target.files?.[0], "video");
    target.value = "";
    return;
  }
  if (target.id === "flowImportFile") {
    importFlowJson(target.files?.[0]);
    target.value = "";
    return;
  }
  if (target.dataset.messageBlockFile) {
    uploadMessageBlockFile(target.dataset.blockId, target.files?.[0], target.dataset.kind || "image");
    target.value = "";
    return;
  }
  if (target.dataset.videoField) {
    updateVideoToolField(target);
    return;
  }
  if (target.id === "subscriberTagFilter") {
    subscriberTagFilter = target.value;
    render();
    return;
  }
  if (target.dataset.contactProfileField) {
    updateContactProfileField(target.dataset.id, target.dataset.contactProfileField, target.value);
    return;
  }
  if (target.dataset.contactCustomField) {
    updateContactCustomFieldFromInput(target);
    return;
  }
  if (target.dataset.missingTagFlow) {
    broadcastState = { ...broadcastState, flowId: target.value, result: null, error: "" };
    render();
    return;
  }
  if (target.dataset.missingTagName) {
    broadcastState = { ...broadcastState, missingTag: target.value, result: null, error: "" };
    render();
    return;
  }
  if (target.dataset.missingTagLimit) {
    const nextLimit = String(target.value || "").trim().toLowerCase() === "all"
      ? "all"
      : String(Math.max(1, Math.min(200, Number(target.value) || 25)));
    broadcastState = { ...broadcastState, limit: nextLimit, result: null, error: "" };
    render();
    return;
  }
  if (target.dataset.adTestContact) {
    flowAdTestState = {
      ...flowAdTestState,
      psid: target.value,
      result: null,
      logs: [],
      error: ""
    };
    render();
    return;
  }
  if (target.dataset.adTestFlow) {
    flowAdTestState = {
      ...flowAdTestState,
      flowId: target.value,
      result: null,
      logs: [],
      error: ""
    };
    render();
    return;
  }
  if (target.dataset.adTestTag) {
    flowAdTestState = {
      ...flowAdTestState,
      tag: target.value,
      result: null,
      logs: [],
      error: ""
    };
    render();
    return;
  }
  if (target.dataset.adTestTagMode) {
    flowAdTestState = {
      ...flowAdTestState,
      tagMode: target.value === "missing" ? "missing" : "has",
      result: null,
      logs: [],
      error: ""
    };
    render();
    return;
  }
  if (target.dataset.adTestReferralLocation) {
    flowAdTestState = {
      ...flowAdTestState,
      referralLocation: target.value,
      result: null,
      logs: [],
      error: ""
    };
    render();
    return;
  }
  if (target.dataset.nodeField && node) {
    if (target.type === "checkbox") {
      node[target.dataset.nodeField] = target.checked;
      flow.updatedAt = new Date().toISOString();
      saveState();
    } else {
      const fieldName = target.dataset.nodeField;
      node[fieldName] = normalizeFieldValue(fieldName, target.value);
      if (fieldName === "targetFlowId" && node.type === "jump") node.targetNodeId = "";
      if (fieldName === "delayValue" || fieldName === "delayUnit") node.delayMinutes = delayToMinutes(node);
      if (fieldName === "dynamicFieldId") syncDelayDynamicField(node, target.value);
      if (fieldName === "title") updateCanvasNodeTitle(flow, node);
      flow.updatedAt = new Date().toISOString();
      saveState();
      if (node.type === "jump" && (fieldName === "targetFlowId" || fieldName === "targetNodeId")) render();
    }
  }

  if (target.dataset.targetSelect && node) {
    applyTargetSelection(node, target);
    flow.updatedAt = new Date().toISOString();
    saveState();
  }

  if (target.dataset.messageOptionField && node?.type === "message") {
    const list = target.dataset.optionKind === "button" ? node.buttons : node.quickReplies;
    const option = list?.find((item) => item.id === target.dataset.optionId);
    if (option) {
      option[target.dataset.messageOptionField] = target.value;
      if (target.dataset.messageOptionField === "type" && option.type !== "url" && option.type !== "phone") {
        option.type = "next";
      }
      flow.updatedAt = new Date().toISOString();
      saveState();
    }
  }

  if (target.dataset.messageBlockButtonField && node?.type === "message") {
    const option = findMessageBlockButton(node, target.dataset.blockId, target.dataset.buttonId);
    if (option) {
      option[target.dataset.messageBlockButtonField] = target.value;
      if (target.dataset.messageBlockButtonField === "type" && option.type !== "url" && option.type !== "phone") {
        option.type = "next";
      }
      flow.updatedAt = new Date().toISOString();
      saveState();
    }
  }

  if (target.dataset.conditionRuleField && node?.type === "condition") {
    const condition = node.conditions?.find((item) => item.id === target.dataset.conditionId);
    if (condition) {
      const ruleField = target.dataset.conditionRuleField;
      updateConditionRuleField(condition, ruleField, target.value);
      if ((condition.type === "tag" || condition.type === "message_contains") && ruleField === "value") node.keyword = condition.value || "";
      if (condition.type === "field") {
        node.fieldId = condition.fieldId || "";
        node.fieldName = condition.fieldName || "";
        node.conditionOperator = condition.operator || node.conditionOperator;
        if (ruleField === "value") node.fieldValue = condition.value || "";
      }
      flow.updatedAt = new Date().toISOString();
      saveState();
    }
  }

  if (target.dataset.actionStepField && node) {
    const step = nodeActionSteps(node).find((item) => item.id === target.dataset.stepId);
    if (step) {
      const fieldName = target.dataset.actionStepField;
      const changed = step[fieldName] !== target.value;
      step[fieldName] = target.value;
      if (fieldName === "fieldName" && changed) {
        const field = findCustomFieldForPage(target.value);
        step.fieldId = field?.id || "";
        step.fieldType = field?.type || normalizeCustomFieldType(step.fieldType);
        step.fieldValue = "";
      }
      node.message = summarizeActionSteps(node);
      flow.updatedAt = new Date().toISOString();
      saveState();
    }
  }

  if (
    target.dataset.nodeField ||
    target.dataset.triggerConfigField ||
    target.dataset.flowField ||
    target.dataset.settingField ||
    target.dataset.actionStepField ||
    target.dataset.messageBlockField ||
    target.dataset.messageBlockButtonField ||
    target.dataset.messageOptionField ||
    target.dataset.randomVariationField ||
    target.dataset.conditionRuleField ||
    target.dataset.targetSelect
  ) {
    render();
  }
}

function handleWorkspaceKeydown(event) {
  if (event.key !== "Enter") return;
  if (event.target.id === "simInput") {
    event.preventDefault();
    sendSimulationMessage();
  }
  if (event.target.id === "composerText" && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    sendContactMessage();
  }
}

function handleGlobalKeydown(event) {
  if (event.key === "Escape" && modalState) {
    closeModal();
    return;
  }

  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z" && shouldHandleFlowUndoShortcut(event)) {
    event.preventDefault();
    undoLastFlowChange();
    return;
  }

  if (!shouldHandleFlowShortcut(event)) return;

  if (event.key === "Delete") {
    event.preventDefault();
    deleteSelectedNode();
    return;
  }

  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "d") {
    event.preventDefault();
    duplicateSelectedNode();
  }
}

function shouldHandleFlowShortcut(event) {
  if (modalState) return false;
  if (flowCanvasMode === "published") return false;
  if (activeView !== "flows" || !flowCanvasOpen || !selectedNodeId) return false;
  return !isEditableTarget(event.target);
}

function shouldHandleFlowUndoShortcut(event) {
  if (modalState) return false;
  if (flowCanvasMode === "published") return false;
  if (activeView !== "flows" || !flowCanvasOpen) return false;
  return !isEditableTarget(event.target);
}

function isEditableTarget(target) {
  return Boolean(target?.closest?.("input, textarea, select, [contenteditable='true']"));
}

function handleWorkspaceDragStart(event) {
  const handle = event.target.closest("[data-message-block-drag-handle]");
  if (!handle) {
    if (event.target.closest(".messenger-preview-node img")) event.preventDefault();
    return;
  }

  const blockId = handle.dataset.blockId || "";
  const flow = selectedFlow();
  const node = flow ? selectedNode(flow) : null;
  if (!blockId || !flow || node?.type !== "message") {
    event.preventDefault();
    return;
  }

  normalizeNodeStructure(node);
  if (node.contentBlocks.length < 2 || !node.contentBlocks.some((block) => block.id === blockId)) {
    event.preventDefault();
    return;
  }

  messageBlockDragId = blockId;
  try {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(MESSAGE_BLOCK_DRAG_TYPE, blockId);
    event.dataTransfer.setData("text/plain", blockId);
  } catch {
    // Some browsers restrict custom drag payloads, but the local state still tracks it.
  }
  messageBlockApplyDragIndicators(blockId, messageBlockDropIndexFromEvent(event));
}

function handleWorkspaceDragEnd() {
  clearMessageBlockDragIndicators();
  messageBlockDragId = "";
}

function messageBlockDragTypes(event) {
  return Array.from(event.dataTransfer?.types || []);
}

function isMessageBlockDragEvent(event) {
  return Boolean(messageBlockDragId || messageBlockDragTypes(event).includes(MESSAGE_BLOCK_DRAG_TYPE));
}

function messageBlockWidgets() {
  return Array.from(document.querySelectorAll(".message-inspector [data-message-block-widget]"));
}

function messageBlockDropIndexFromEvent(event) {
  const widgets = messageBlockWidgets();
  if (!widgets.length) return 0;
  const y = Number(event.clientY);
  if (!Number.isFinite(y)) return widgets.length;

  for (let index = 0; index < widgets.length; index += 1) {
    const rect = widgets[index].getBoundingClientRect();
    if (y < rect.top + rect.height / 2) return index;
  }

  return widgets.length;
}

function messageBlockApplyDragIndicators(blockId, dropIndex) {
  const widgets = messageBlockWidgets();
  widgets.forEach((widget) => {
    widget.classList.toggle("dragging", widget.dataset.messageBlockWidget === blockId);
    widget.classList.remove("drop-before", "drop-after");
  });
  if (!blockId || widgets.length < 2) return;

  const normalizedIndex = Math.max(0, Math.min(Number(dropIndex) || 0, widgets.length));
  const target = normalizedIndex >= widgets.length ? widgets.at(-1) : widgets[normalizedIndex];
  target?.classList.add(normalizedIndex >= widgets.length ? "drop-after" : "drop-before");
}

function clearMessageBlockDragIndicators() {
  messageBlockWidgets().forEach((widget) => {
    widget.classList.remove("dragging", "drop-before", "drop-after");
  });
}

function reorderMessageBlockToDropIndex(blockId, dropIndex) {
  const flow = selectedFlow();
  const node = flow ? selectedNode(flow) : null;
  if (!flow || node?.type !== "message") return;

  normalizeNodeStructure(node);
  const fromIndex = node.contentBlocks.findIndex((block) => block.id === blockId);
  if (fromIndex < 0 || node.contentBlocks.length < 2) return;

  let toIndex = Math.max(0, Math.min(Number(dropIndex) || 0, node.contentBlocks.length));
  if (fromIndex < toIndex) toIndex -= 1;
  toIndex = Math.max(0, Math.min(toIndex, node.contentBlocks.length - 1));
  if (toIndex === fromIndex) return;

  const [block] = node.contentBlocks.splice(fromIndex, 1);
  node.contentBlocks.splice(toIndex, 0, block);
  syncLegacyMessageFromBlocks(node);
  flow.updatedAt = new Date().toISOString();
  saveState();
  render();
}

function handleWorkspaceDragOver(event) {
  if (isMessageBlockDragEvent(event)) {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
    messageBlockApplyDragIndicators(messageBlockDragId, messageBlockDropIndexFromEvent(event));
    return;
  }

  if (!["image", "video"].includes(activeView)) return;
  if (!event.dataTransfer?.types?.includes("Files")) return;
  event.preventDefault();
}

function handleWorkspaceDrop(event) {
  if (isMessageBlockDragEvent(event)) {
    event.preventDefault();
    const blockId = messageBlockDragId || event.dataTransfer?.getData(MESSAGE_BLOCK_DRAG_TYPE) || "";
    const dropIndex = messageBlockDropIndexFromEvent(event);
    clearMessageBlockDragIndicators();
    messageBlockDragId = "";
    reorderMessageBlockToDropIndex(blockId, dropIndex);
    return;
  }

  if (!["image", "video"].includes(activeView)) return;
  const file = event.dataTransfer?.files?.[0];
  if (!file) return;
  event.preventDefault();
  if (activeView === "image") {
    handleImageUpload(file);
    return;
  }
  if (file.type.startsWith("video/")) handleVideoUpload(file);
  else if (file.type.startsWith("audio/")) handleAudioUpload(file);
  else {
    videoToolState.error = "Solte um arquivo de vídeo ou áudio.";
    render();
  }
}

function createFlow() {
  openFormModal({
    title: "Novo fluxo",
    description: "Crie o fluxo e depois edite os blocos no canvas.",
    submitLabel: "Criar fluxo",
    fields: [
      {
        name: "name",
        label: "Nome do fluxo",
        value: "Novo fluxo Messenger",
        required: true
      }
    ],
    onSubmit: ({ name }) => createFlowFromName(name.trim())
  });
}

function createFlowFromName(name) {
  const triggerId = makeId("node");
  const messageId = makeId("node");
  const flow = {
    id: makeId("flow"),
    pageId: currentFlowPageId(),
    name,
    status: "draft",
    trigger: "nova mensagem",
    goal: "Descreva o objetivo deste fluxo.",
    updatedAt: new Date().toISOString(),
    nodes: [
      {
        id: triggerId,
        type: "trigger",
        title: "Quando...",
        message: "O usuário envia uma mensagem no Messenger.",
        keyword: "oi",
        triggerEvents: ["messenger_message"],
        next: messageId,
        x: 90,
        y: 140
      },
      {
        id: messageId,
        type: "message",
        title: "Resposta",
        message: "Oi {{first_name}}, como posso ajudar?",
        quickReplies: [],
        next: null,
        x: 390,
        y: 140
      }
    ]
  };
  state.flows.unshift(flow);
  selectedFlowId = flow.id;
  selectedNodeId = triggerId;
  flowCanvasOpen = true;
  flowCanvasMode = "edit";
  showFlowList = false;
  showInspector = false;
  shouldAutoFitCanvas = true;
  localStorage.setItem("messenlead.canvas.flowList", "false");
  saveState();
  toastMessage("Fluxo criado.");
  render();
}

function addNode(type) {
  const flow = selectedFlow();
  if (!flow) return;
  const current = selectedNode(flow);
  const nextColumnX = current ? current.x + 340 : 120 + flow.nodes.length * 36;
  const wrapsToNextRow = nextColumnX > CANVAS_WIDTH - NODE_WIDTH - 100;
  const nextX = wrapsToNextRow ? 120 : nextColumnX;
  const nextY = current ? current.y + (wrapsToNextRow ? 220 : 0) : 130 + flow.nodes.length * 46;
  const node = {
    id: makeId("node"),
    type,
    title: nodeLabels[type],
    message: defaultNodeMessage(type),
    contentBlocks: type === "message" ? [{ id: makeId("block"), type: "text", text: defaultNodeMessage(type) }] : undefined,
    buttons: type === "message" ? [] : undefined,
    actions: type === "action" ? [] : undefined,
    keyword: "",
    quickReplies: [],
    conditionType: type === "condition" ? "message_contains" : undefined,
    conditionOperator: type === "condition" ? "contains_any" : undefined,
    yesNext: type === "condition" ? null : undefined,
    noNext: type === "condition" ? null : undefined,
    delayType: type === "delay" ? "duration" : undefined,
    delayUnit: type === "delay" ? "minutes" : undefined,
    delayValue: type === "delay" ? 5 : undefined,
    delayMinutes: type === "delay" ? 5 : undefined,
    dynamicFieldId: type === "delay" ? "" : undefined,
    saveResponse: type === "user_input" ? true : undefined,
    responseField: type === "user_input" ? "ultima_resposta" : undefined,
    timeoutMinutes: type === "link_click_wait" ? 5 : type === "user_input" ? 0 : undefined,
    clickedNext: type === "link_click_wait" ? null : undefined,
    noClickNext: type === "link_click_wait" ? null : undefined,
    targetFlowId: type === "jump" ? flow.id : undefined,
    targetNodeId: type === "jump" ? "" : undefined,
    randomEveryTime: type === "randomizer" ? true : undefined,
    variations: type === "randomizer"
      ? [
          { id: makeId("var"), label: "Variação A", weight: 50, next: null },
          { id: makeId("var"), label: "Variação B", weight: 50, next: null }
        ]
      : undefined,
    next: null,
    x: clampNodeX(Math.round(nextX)),
    y: clampNodeY(Math.round(nextY))
  };
  normalizeNodeStructure(node);
  insertNodeAfterCurrentOutput(current, node);
  flow.nodes.push(node);
  flow.updatedAt = new Date().toISOString();
  selectedNodeId = node.id;
  showInspector = true;
  saveState();
  render();
}

function insertNodeAfterCurrentOutput(current, node) {
  if (!current || !node) return;
  const insertion = simpleInsertionOutput(current);
  if (!insertion) {
    if (!outputRefs(current).length) assignPrimaryTarget(current, node.id);
    return;
  }

  if (insertion.targetId) node.next = insertion.targetId;
  assignOutputTarget(current, node.id, insertion);
}

function simpleInsertionOutput(node) {
  if (!node || node.type === "comment" || node.type === "condition" || node.type === "randomizer" || node.type === "jump") return null;
  normalizeNodeStructure(node);
  if (node.type === "message") {
    const refs = outputRefs(node);
    if (refs.length > 1) return null;
    if (node.next) return { targetId: node.next, field: "next", kind: "default" };
    if (!refs.length) return { targetId: null, field: "next", kind: "default" };
    return refs[0].field === "next" || refs[0].kind === "default" ? refs[0] : null;
  }
  return { targetId: node.next || null, field: "next" };
}

function addNodeFromCanvasMenu(type) {
  if (!canvasAddMenu) return;
  const target = canvasAddMenu;
  canvasAddMenu = null;
  addNodeAt(type, target.x, target.y, {
    sourceId: target.sourceId || "",
    sourceOutput: target.sourceOutput || null
  });
}

function addNodeAt(type, x, y, options = {}) {
  const flow = selectedFlow();
  if (!flow || !nodeLabels[type]) return;

  const node = buildNode(type, x, y);
  flow.nodes.push(node);
  const source = options.sourceId ? flow.nodes.find((item) => item.id === options.sourceId) : null;
  if (source && source.id !== node.id) assignOutputTarget(source, node.id, options.sourceOutput || "");
  selectedNodeId = node.id;
  showInspector = true;
  showFlowList = false;
  triggerPickerNodeId = "";
  nextStepPickerNodeId = "";
  actionPickerNodeId = "";
  flow.updatedAt = new Date().toISOString();
  saveState();
  render();
}

function buildNode(type, x, y) {
  const node = {
    id: makeId("node"),
    type,
    title: type === "trigger" ? "Quando..." : nodeLabels[type],
    message: defaultNodeMessage(type),
    actions: type === "action" ? [] : undefined,
    keyword: "",
    quickReplies: [],
    contentBlocks: type === "message" ? [{ id: makeId("block"), type: "text", text: defaultNodeMessage(type) }] : undefined,
    buttons: type === "message" ? [] : undefined,
    conditionType: type === "condition" ? "message_contains" : undefined,
    conditionOperator: type === "condition" ? "contains_any" : undefined,
    yesNext: type === "condition" ? null : undefined,
    noNext: type === "condition" ? null : undefined,
    delayType: type === "delay" ? "duration" : undefined,
    delayUnit: type === "delay" ? "minutes" : undefined,
    delayValue: type === "delay" ? 5 : undefined,
    delayMinutes: type === "delay" ? 5 : undefined,
    dynamicFieldId: type === "delay" ? "" : undefined,
    saveResponse: type === "user_input" ? true : undefined,
    responseField: type === "user_input" ? "ultima_resposta" : undefined,
    timeoutMinutes: type === "link_click_wait" ? 5 : type === "user_input" ? 0 : undefined,
    clickedNext: type === "link_click_wait" ? null : undefined,
    noClickNext: type === "link_click_wait" ? null : undefined,
    targetFlowId: type === "jump" ? selectedFlow()?.id || "" : undefined,
    targetNodeId: type === "jump" ? "" : undefined,
    randomEveryTime: type === "randomizer" ? true : undefined,
    variations: type === "randomizer"
      ? [
          { id: makeId("var"), label: "Variação A", weight: 50, next: null },
          { id: makeId("var"), label: "Variação B", weight: 50, next: null }
        ]
      : undefined,
    next: null,
    x: clampNodeX(Math.round(x)),
    y: clampNodeY(Math.round(y))
  };

  if (type === "trigger") {
    node.triggerEvents = ["messenger_message"];
    node.keyword = "";
  }

  return normalizeNodeStructure(node);
}

function setFlowStatus(status) {
  const flow = selectedFlow();
  if (!flow) return;
  if (status === "active" && !hasPublishedFlow(flow)) {
    toastMessage("Publique o fluxo antes de ligar.");
    return;
  }
  flow.status = status;
  flow.updatedAt = new Date().toISOString();
  saveState({ markFlowDraft: false });
  toastMessage(`Fluxo marcado como ${statusLabel(status).toLowerCase()}.`);
  render();
}

async function publishSelectedFlow() {
  const flow = selectedFlow();
  if (!flow) return;

  normalizeFlowStructure(flow);
  const now = new Date().toISOString();
  if (flow.status !== "active") flow.status = "paused";
  flow.publishedNodes = cloneFlowNodes(flow.nodes);
  flow.publishedMeta = flowPublicationMeta(flow);
  flow.hasDraftChanges = false;
  flow.publishedAt = now;
  flow.updatedAt = now;
  persistLocalState();
  flowStore.status = "Publicando";
  updateSyncPill();
  render();

  const synced = flowStore.loading ? false : await syncFlowToServer(flow, { force: true });
  const activeHint = flow.status === "active" ? "" : " Ele continua inativo ate voce ligar.";
  toastMessage(synced ? `Fluxo publicado.${activeHint}` : `Fluxo publicado localmente: ${flowStore.status}${activeHint}`);
  flowMetricState = { pageId: "", flowId: "", loading: false, metrics: null, error: "" };
  render();
}

function toggleFlowActive(flowId = selectedFlowId) {
  const flow = state.flows.find((item) => item.id === flowId);
  if (!flow) return;

  if (flow.status !== "active" && !hasPublishedFlow(flow)) {
    toastMessage("Publique o fluxo antes de ligar.");
    return;
  }

  flow.status = flow.status === "active" ? "paused" : "active";
  flow.updatedAt = new Date().toISOString();
  persistLocalState();
  if (!flowStore.loading) syncFlowToServer(flow, { force: true });
  toastMessage(`Fluxo ${flow.status === "active" ? "ligado pela ultima publicacao" : "desligado"}.`);
  render();
}

function duplicateFlow(flowId = selectedFlowId, options = {}) {
  const flow = state.flows.find((item) => item.id === flowId) || selectedFlow();
  if (!flow) return;
  const copy = JSON.parse(JSON.stringify(flow));
  const idMap = new Map();
  copy.id = makeId("flow");
  copy.pageId = currentFlowPageId();
  copy.publishedNodes = null;
  copy.publishedMeta = null;
  copy.hasDraftChanges = true;
  copy.publishedAt = "";
  copy.name = nextNumberedName(flow.name || "Fluxo", state.flows.map((item) => item.name), "Fluxo");
  copy.status = "draft";
  copy.updatedAt = new Date().toISOString();
  copy.nodes.forEach((node) => {
    const newId = makeId("node");
    idMap.set(node.id, newId);
    node.id = newId;
    node.x += 24;
    node.y += 24;
  });
  copy.nodes.forEach((node) => {
    if (node.next) node.next = idMap.get(node.next) || null;
    if (node.yesNext) node.yesNext = idMap.get(node.yesNext) || null;
    if (node.noNext) node.noNext = idMap.get(node.noNext) || null;
    node.buttons?.forEach((option) => {
      option.id = makeId("btn");
      if (option.next) option.next = idMap.get(option.next) || null;
    });
    node.quickReplies?.forEach((option) => {
      option.id = makeId("qr");
      if (option.next) option.next = idMap.get(option.next) || null;
    });
    node.variations?.forEach((variation) => {
      variation.id = makeId("var");
      if (variation.next) variation.next = idMap.get(variation.next) || null;
    });
    node.contentBlocks?.forEach((block) => {
      block.id = makeId("block");
      block.buttons?.forEach((option) => {
        option.id = makeId("btn");
        if (option.next) option.next = idMap.get(option.next) || null;
      });
    });
  });
  state.flows.unshift(copy);
  selectedFlowId = copy.id;
  selectedNodeId = copy.nodes[0]?.id;
  flowCanvasOpen = options.openCanvas ?? true;
  flowCanvasMode = "edit";
  showInspector = false;
  shouldAutoFitCanvas = true;
  saveState();
  toastMessage("Fluxo duplicado.");
  render();
}

function exportSelectedFlowJson() {
  const flow = selectedFlow();
  if (!flow) return;

  const payload = {
    type: "messenlead.flow",
    version: 1,
    exportedAt: new Date().toISOString(),
    flow
  };
  downloadFile(`${safeFileName(flow.name || flow.id || "fluxo")}.json`, JSON.stringify(payload, null, 2), "application/json");
  toastMessage("Fluxo exportado.");
}

async function importFlowJson(file) {
  if (!file) return;

  try {
    const text = await file.text();
    const data = JSON.parse(text);
    const pageId = currentFlowPageId();
    const flows = importedFlowsFromJson(data);
    if (!flows.length) throw new Error("Arquivo de fluxo invalido.");

    const imported = flows.map((flow) => prepareImportedFlow(flow, pageId));
    state.flows.unshift(...imported);
    selectedFlowId = imported[0].id;
    selectedNodeId = imported[0].nodes[0]?.id;
    flowCanvasOpen = true;
    flowCanvasMode = "edit";
    showInspector = false;
    triggerPickerNodeId = "";
    nextStepPickerNodeId = "";
    actionPickerNodeId = "";
    actionTagPickerStepId = "";
    canvasAddMenu = null;
    shouldAutoFitCanvas = true;
    persistLocalState();
    flowStore.status = "Importando";
    render();
    if (!flowStore.loading) await syncAllFlowsToServer();
    toastMessage(`${imported.length} fluxo${imported.length === 1 ? "" : "s"} importado${imported.length === 1 ? "" : "s"}.`);
    render();
  } catch (error) {
    toastMessage(error.message || "Nao foi possivel importar o fluxo.");
  }
}

function importedFlowsFromJson(data) {
  if (Array.isArray(data)) return data.filter(isImportableFlow);
  if (Array.isArray(data?.flows)) return data.flows.filter(isImportableFlow);
  if (isImportableFlow(data?.flow)) return [data.flow];
  if (isImportableFlow(data)) return [data];
  return [];
}

function isImportableFlow(flow) {
  return Boolean(flow && typeof flow === "object" && Array.isArray(flow.nodes));
}

function prepareImportedFlow(flow, pageId) {
  if (!isImportableFlow(flow)) throw new Error("Arquivo de fluxo invalido.");

  const copy = JSON.parse(JSON.stringify(flow));
  const now = new Date().toISOString();
  const idMap = new Map();
  copy.id = makeId("flow");
  copy.pageId = normalizeFlowPageId(pageId);
  copy.publishedNodes = null;
  copy.publishedMeta = null;
  copy.hasDraftChanges = true;
  copy.publishedAt = "";
  copy.name = copy.name ? `${copy.name} importado` : "Fluxo importado";
  copy.status = "draft";
  copy.createdAt = now;
  copy.updatedAt = now;
  copy.nodes = copy.nodes.filter((node) => node && typeof node === "object");

  copy.nodes.forEach((node) => {
    const previousId = String(node.id || "");
    const newId = makeId("node");
    if (previousId) idMap.set(previousId, newId);
    node.id = newId;
    node.x = clampNodeX(Number(node.x) || 0);
    node.y = clampNodeY(Number(node.y) || 0);
    normalizeNodeStructure(node);
  });

  copy.nodes.forEach((node) => remapImportedNodeReferences(node, idMap));
  normalizeFlowStructure(copy);
  pruneInvalidFlowConnections(copy);
  return copy;
}

function remapImportedNodeReferences(node, idMap) {
  node.next = remapImportedTarget(node.next, idMap);
  node.yesNext = remapImportedTarget(node.yesNext, idMap);
  node.noNext = remapImportedTarget(node.noNext, idMap);
  node.clickedNext = remapImportedTarget(node.clickedNext, idMap);
  node.noClickNext = remapImportedTarget(node.noClickNext, idMap);
  if (Array.isArray(node.buttons)) node.buttons.forEach((option) => {
    option.id = makeId("btn");
    option.next = remapImportedTarget(option.next, idMap);
  });
  if (Array.isArray(node.quickReplies)) node.quickReplies.forEach((option) => {
    option.id = makeId("qr");
    option.next = remapImportedTarget(option.next, idMap);
  });
  if (Array.isArray(node.variations)) node.variations.forEach((variation) => {
    variation.id = makeId("var");
    variation.next = remapImportedTarget(variation.next, idMap);
  });
  if (Array.isArray(node.contentBlocks)) node.contentBlocks.forEach((block) => {
    block.id = makeId("block");
    if (Array.isArray(block.buttons)) block.buttons.forEach((option) => {
      option.id = makeId("btn");
      option.next = remapImportedTarget(option.next, idMap);
    });
  });
  if (Array.isArray(node.actions)) node.actions.forEach((step) => {
    step.id = makeId("act");
  });
  if (Array.isArray(node.conditions)) node.conditions.forEach((condition) => {
    condition.id = makeId("cond");
  });
}

function remapImportedTarget(target, idMap) {
  if (!target) return null;
  return idMap.get(String(target)) || null;
}

function safeFileName(value) {
  return normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "fluxo";
}

function deleteFlow(flowId = selectedFlowId, options = {}) {
  const flow = state.flows.find((item) => item.id === flowId) || selectedFlow();
  if (!flow) return;
  openConfirmModal({
    title: "Excluir fluxo",
    message: `Excluir o fluxo "${flow.name}"? Esta acao nao pode ser desfeita.`,
    submitLabel: "Excluir",
    danger: true,
    onConfirm: () => performDeleteFlow(flow, options)
  });
}

async function performDeleteFlow(flow, options = {}) {
  const deletedFlowId = flow.id;
  const pageId = currentFlowPageId();
  const previousState = {
    flows: state.flows,
    selectedFlowId,
    selectedNodeId,
    flowCanvasOpen
  };

  state.flows = state.flows.filter((item) => item.id !== flow.id);
  if (selectedFlowId === deletedFlowId) {
    selectedFlowId = state.flows[0]?.id;
    selectedNodeId = state.flows[0]?.nodes[0]?.id;
  }
  flowCanvasOpen = options.openCanvasAfterDelete ?? Boolean(state.flows.length);
  persistLocalState();
  flowStore.status = "Excluindo no D1";
  render();

  try {
    await deleteFlowFromServer(deletedFlowId, pageId);
    flowStore.status = "Salvo no D1";
    toastMessage("Fluxo excluido.");
    updateSyncPill();
  } catch (error) {
    state.flows = previousState.flows;
    selectedFlowId = previousState.selectedFlowId;
    selectedNodeId = previousState.selectedNodeId;
    flowCanvasOpen = previousState.flowCanvasOpen;
    persistLocalState();
    flowStore.status = flowStoreStatusFromError(error);
    toastMessage(`Nao exclui no D1: ${error.message}`);
    render();
  }
}

function deleteNode() {
  const flow = selectedFlow();
  const node = flow ? selectedNode(flow) : null;
  if (!flow || !node) return;
  if (isLockedTriggerNode(node)) {
    toastMessage("O bloco Quando e padrao do fluxo e nao pode ser excluido.");
    return;
  }
  if (flow.nodes.length === 1) {
    toastMessage("O fluxo precisa ter pelo menos um bloco.");
    return;
  }
  flow.nodes.forEach((item) => replaceNodeReference(item, node.id, node.next || null));
  flow.nodes = flow.nodes.filter((item) => item.id !== node.id);
  selectedNodeId = flow.nodes[0]?.id;
  flow.updatedAt = new Date().toISOString();
  saveState();
  render();
}

function deleteSelectedNode() {
  const flow = selectedFlow();
  const node = flow?.nodes.find((item) => item.id === selectedNodeId);
  if (!node) return;
  deleteNode();
}

function deleteNodeById(nodeId) {
  const flow = selectedFlow();
  if (!flow?.nodes.some((node) => node.id === nodeId)) return;
  selectedNodeId = nodeId;
  deleteNode();
}

function replaceNodeReference(node, oldId, newId = null) {
  if (!node) return;
  normalizeNodeStructure(node);
  if (node.next === oldId) node.next = newId;
  if (node.yesNext === oldId) node.yesNext = newId;
  if (node.noNext === oldId) node.noNext = newId;
  if (node.clickedNext === oldId) node.clickedNext = newId;
  if (node.noClickNext === oldId) node.noClickNext = newId;
  node.buttons?.forEach((option) => {
    if (option.next === oldId) option.next = newId;
  });
  node.quickReplies?.forEach((option) => {
    if (option.next === oldId) option.next = newId;
  });
  node.contentBlocks?.forEach((block) => {
    block.buttons?.forEach((option) => {
      if (option.next === oldId) option.next = newId;
    });
  });
  node.variations?.forEach((variation) => {
    if (variation.next === oldId) variation.next = newId;
  });
}

function disconnectConnection(sourceIdOrDataset, output = null) {
  const flow = selectedFlow();
  const sourceId = typeof sourceIdOrDataset === "string" ? sourceIdOrDataset : sourceIdOrDataset?.dataset?.sourceId;
  const node = flow?.nodes.find((item) => item.id === sourceId);
  if (!flow || !node) return;

  const ref =
    output || {
      field: sourceIdOrDataset.dataset.outputField || "",
      kind: sourceIdOrDataset.dataset.outputKind || "",
      optionId: sourceIdOrDataset.dataset.outputOptionId || "",
      blockId: sourceIdOrDataset.dataset.outputBlockId || "",
      variationId: sourceIdOrDataset.dataset.outputVariationId || ""
    };

  clearOutputTarget(node, ref);
  flow.updatedAt = new Date().toISOString();
  saveState();
  render();
}

function clearOutputTarget(node, ref = {}) {
  normalizeNodeStructure(node);
  if (node.type === "condition" && (ref.field === "yesNext" || ref.field === "noNext")) {
    node[ref.field] = null;
    return;
  }
  if (node.type === "link_click_wait" && (ref.field === "clickedNext" || ref.field === "noClickNext")) {
    node[ref.field] = null;
    if (ref.field === "clickedNext") node.next = null;
    return;
  }
  if (node.type === "randomizer" && ref.variationId) {
    const variation = node.variations?.find((item) => item.id === ref.variationId);
    if (variation) variation.next = null;
    return;
  }
  if (node.type === "message") {
    if (ref.field === "next" || ref.kind === "default") {
      node.next = null;
      return;
    }
    if ((ref.kind === "button" || ref.kind === "quick_reply") && ref.optionId) {
      const list = ref.kind === "button" ? node.buttons : node.quickReplies;
      const option = list.find((item) => item.id === ref.optionId);
      if (option) option.next = null;
      return;
    }
    if (ref.kind === "image_button" && ref.blockId && ref.optionId) {
      const option = findMessageBlockButton(node, ref.blockId, ref.optionId);
      if (option) option.next = null;
      return;
    }
  }
  if (ref.field && Object.prototype.hasOwnProperty.call(node, ref.field)) {
    node[ref.field] = null;
    return;
  }
  node.next = null;
}

function duplicateSelectedNode() {
  const flow = selectedFlow();
  const node = flow?.nodes.find((item) => item.id === selectedNodeId);
  if (!flow || !node) return;
  if (isLockedTriggerNode(node)) {
    toastMessage("O bloco Quando e padrao do fluxo e nao pode ser duplicado.");
    return;
  }

  const copy = JSON.parse(JSON.stringify(node));
  copy.id = makeId("node");
  copy.title = nextNumberedName(
    nodeEditableTitle(flow, node, nodeLabels[node.type] || "Bloco"),
    flow.nodes.map((item) => nodeEditableTitle(flow, item, nodeLabels[item.type] || "Bloco")),
    nodeLabels[node.type] || "Bloco"
  );
  copy.next = null;
  copy.yesNext = null;
  copy.noNext = null;
  copy.clickedNext = null;
  copy.noClickNext = null;
  if (Array.isArray(copy.buttons)) copy.buttons = copy.buttons.map((option) => ({ ...option, id: makeId("btn"), next: null }));
  if (Array.isArray(copy.quickReplies)) copy.quickReplies = copy.quickReplies.map((option) => ({ ...option, id: makeId("qr"), next: null }));
  if (Array.isArray(copy.variations)) copy.variations = copy.variations.map((variation) => ({ ...variation, id: makeId("var"), next: null }));
  if (Array.isArray(copy.contentBlocks)) {
    copy.contentBlocks = copy.contentBlocks.map((block) => ({
      ...block,
      id: makeId("block"),
      buttons: Array.isArray(block.buttons)
        ? block.buttons.map((option) => ({ ...option, id: makeId("btn"), next: null }))
        : []
    }));
  }
  copy.x = clampNodeX((node.x || 0) + 32);
  copy.y = clampNodeY((node.y || 0) + 32);
  if (Array.isArray(copy.actions)) {
    copy.actions = copy.actions.map((step) => ({ ...step, id: makeId("act") }));
  }

  flow.nodes.push(copy);
  selectedNodeId = copy.id;
  showInspector = true;
  triggerPickerNodeId = "";
  nextStepPickerNodeId = "";
  actionPickerNodeId = "";
  flow.updatedAt = new Date().toISOString();
  saveState();
  render();
}

function duplicateNodeById(nodeId) {
  const flow = selectedFlow();
  if (!flow?.nodes.some((node) => node.id === nodeId)) return;
  selectedNodeId = nodeId;
  duplicateSelectedNode();
}

function isLockedTriggerNode(node) {
  return node?.type === "trigger";
}

function undoLastFlowChange() {
  const current = selectedFlow();
  if (!current) return;

  ensureFlowUndoBaseline();
  const previousSnapshot = flowUndoState.undoStack.pop();
  if (!previousSnapshot) {
    toastMessage("Nada para desfazer neste fluxo.");
    return;
  }

  let restored;
  try {
    restored = JSON.parse(previousSnapshot);
  } catch {
    toastMessage("Nao foi possivel desfazer esta alteracao.");
    return;
  }

  normalizeFlowStructure(restored);
  pruneInvalidFlowConnections(restored);
  const index = state.flows.findIndex((flow) => flow.id === current.id);
  if (index === -1) return;

  flowUndoState.applying = true;
  state.flows[index] = restored;
  selectedFlowId = restored.id;
  if (!restored.nodes.some((node) => node.id === selectedNodeId)) {
    selectedNodeId = restored.nodes[0]?.id;
  }
  triggerPickerNodeId = "";
  nextStepPickerNodeId = "";
  actionPickerNodeId = "";
  actionTagPickerStepId = "";
  canvasAddMenu = null;
  window.clearTimeout(flowStore.saveTimer);
  flowUndoState.lastSnapshot = flowSnapshot(restored);
  persistLocalState();
  flowUndoState.applying = false;
  syncFlowToServer(restored);
  toastMessage("Alteracao desfeita.");
  render();
}

function setCanvasZoom(value) {
  const nextZoom = clamp(value, ZOOM_MIN, ZOOM_MAX);
  const canvas = document.querySelector("#flowCanvas");
  if (!canvas) {
    canvasZoom = nextZoom;
    localStorage.setItem("messenlead.canvas.zoom", String(canvasZoom));
    render();
    return;
  }

  applyCanvasZoom(nextZoom, canvas.clientWidth / 2, canvas.clientHeight / 2);
}

function toggleFlowList() {
  showFlowList = !showFlowList;
  localStorage.setItem("messenlead.canvas.flowList", String(showFlowList));
  render();
}

function toggleInspector() {
  if (showInspector) {
    closeInspectorPanel();
    return;
  }
  peekInspector();
}

function closeInspectorPanel() {
  showInspector = false;
  messageButtonEditorOptionId = "";
  messageImageUrlEditorBlockId = "";
  messageImageUrlPopoverPosition = null;
  messageCardUrlEditorBlockId = "";
  messageCardUrlPopoverPosition = null;
  messageMorePanelOpen = false;
  messageMorePanelPosition = null;
  triggerPickerNodeId = "";
  nextStepPickerNodeId = "";
  actionPickerNodeId = "";
  actionTagPickerStepId = "";
  actionFieldPickerStepId = "";
  actionFieldPickerExpanded = false;
  actionFieldPickerQuery = "";
  canvasAddMenu = null;
  render();
}

function peekInspector() {
  const flow = canvasDisplayFlow(selectedFlow());
  if (!flow) return;
  if (showInspector) {
    closeInspectorPanel();
    return;
  }
  selectedNodeId = selectedNodeId || flow.nodes.find((node) => node.type === "trigger")?.id || flow.nodes[0]?.id || "";
  showInspector = Boolean(selectedNodeId);
  triggerPickerNodeId = "";
  nextStepPickerNodeId = "";
  actionPickerNodeId = "";
  actionTagPickerStepId = "";
  actionFieldPickerStepId = "";
  actionFieldPickerExpanded = false;
  actionFieldPickerQuery = "";
  canvasAddMenu = null;
  render();
}

function openTriggerPicker(nodeId) {
  const flow = selectedFlow();
  const node = flow?.nodes.find((item) => item.id === nodeId);
  if (!node) return;
  selectedNodeId = node.id;
  triggerPickerNodeId = node.id;
  nextStepPickerNodeId = "";
  actionPickerNodeId = "";
  actionTagPickerStepId = "";
  actionFieldPickerStepId = "";
  actionFieldPickerExpanded = false;
  actionFieldPickerQuery = "";
  canvasAddMenu = null;
  showInspector = false;
  render();
}

function addTriggerEvent(nodeId, triggerId) {
  const flow = selectedFlow();
  const node = flow?.nodes.find((item) => item.id === nodeId);
  const option = triggerOptionById(triggerId);
  if (!flow || !node || !option) return;

  const current = nodeTriggerEvents(node);
  const next = new Set(current);
  if (next.has(triggerId) && next.size > 1) {
    next.delete(triggerId);
  } else {
    next.add(triggerId);
  }
  node.triggerEvents = [...next];
  node.title = "Quando...";
  node.message = triggerOptionById(node.triggerEvents[0])?.description || option.description;
  flow.trigger = summarizeTriggerEvents(node);
  flow.updatedAt = new Date().toISOString();
  triggerPickerNodeId = "";
  nextStepPickerNodeId = "";
  actionPickerNodeId = "";
  canvasAddMenu = null;
  showInspector = true;
  selectedNodeId = node.id;
  saveState();
  render();
}

function openNextStepPicker(nodeId) {
  const flow = selectedFlow();
  const node = flow?.nodes.find((item) => item.id === nodeId);
  if (!node) return;
  selectedNodeId = node.id;
  nextStepPickerNodeId = node.id;
  triggerPickerNodeId = "";
  actionPickerNodeId = "";
  actionTagPickerStepId = "";
  actionFieldPickerStepId = "";
  actionFieldPickerExpanded = false;
  actionFieldPickerQuery = "";
  canvasAddMenu = null;
  showInspector = true;
  render();
}

function closeNextStepPicker() {
  nextStepPickerNodeId = "";
  render();
}

function openActionPicker(nodeId) {
  const flow = selectedFlow();
  const node = flow?.nodes.find((item) => item.id === nodeId);
  if (!node) return;
  selectedNodeId = node.id;
  actionPickerNodeId = node.id;
  actionPickerCategory = "contact";
  triggerPickerNodeId = "";
  nextStepPickerNodeId = "";
  actionTagPickerStepId = "";
  actionFieldPickerStepId = "";
  actionFieldPickerExpanded = false;
  actionFieldPickerQuery = "";
  canvasAddMenu = null;
  showInspector = true;
  render();
}

function closeActionPicker() {
  actionPickerNodeId = "";
  render();
}

function selectActionCategory(category) {
  if (!category) return;
  actionPickerCategory = category;
  render();
}

function openConditionPicker(nodeId) {
  const flow = selectedFlow();
  const node = flow?.nodes.find((item) => item.id === nodeId);
  if (!node || node.type !== "condition") return;
  selectedNodeId = node.id;
  conditionPickerNodeId = node.id;
  conditionPickerCategory = "recommended";
  conditionPickerQuery = "";
  triggerPickerNodeId = "";
  nextStepPickerNodeId = "";
  actionPickerNodeId = "";
  showInspector = true;
  render();
}

function closeConditionPicker() {
  conditionPickerNodeId = "";
  conditionPickerQuery = "";
  render();
}

function selectConditionCategory(category) {
  if (!conditionPickerCategories.some((item) => item.id === category)) return;
  conditionPickerCategory = category;
  conditionPickerQuery = "";
  render();
}

function addConditionRule(nodeId, optionId) {
  const flow = selectedFlow();
  const node = flow?.nodes.find((item) => item.id === nodeId);
  const option = conditionOptions.find((item) => item.id === optionId);
  if (!flow || !node || node.type !== "condition" || !option) return;
  normalizeNodeStructure(node);
  node.conditions.push({
    id: makeId("cond"),
    type: option.conditionType,
    label: option.label,
    operator: option.operator,
    value: "",
    fieldId: "",
    fieldName: option.fieldName || ""
  });
  node.conditionType = option.conditionType;
  node.conditionOperator = option.operator;
  node.keyword = option.conditionType === "tag" ? option.placeholder || "" : node.keyword || "";
  conditionPickerNodeId = "";
  conditionPickerQuery = "";
  flow.updatedAt = new Date().toISOString();
  saveState();
  render();
}

function removeConditionRule(conditionId) {
  const flow = selectedFlow();
  const node = flow ? selectedNode(flow) : null;
  if (!flow || !node || node.type !== "condition") return;
  normalizeNodeStructure(node);
  node.conditions = node.conditions.filter((condition) => condition.id !== conditionId);
  flow.updatedAt = new Date().toISOString();
  saveState();
  render();
}

function toggleConditionMatch(nodeId) {
  const flow = selectedFlow();
  const node = flow?.nodes.find((item) => item.id === nodeId);
  if (!flow || !node || node.type !== "condition") return;
  node.conditionMatch = node.conditionMatch === "any" ? "all" : "any";
  flow.updatedAt = new Date().toISOString();
  saveState();
  render();
}

function addMessageBlock(type) {
  const flow = selectedFlow();
  const node = flow ? selectedNode(flow) : null;
  const blockType = messageContentBlockTypes.find((item) => item.type === type);
  if (!flow || !node || node.type !== "message" || !blockType) return;
  normalizeNodeStructure(node);
  const block = defaultMessageBlock(type);
  const textIndex = node.contentBlocks.findIndex((item) => item.type === "text");
  const insertIndex = textIndex >= 0 ? textIndex + 1 : node.contentBlocks.length;
  node.contentBlocks.splice(insertIndex, 0, block);
  messageBlockFocusId = block.id;
  messageMorePanelOpen = false;
  messageMorePanelPosition = null;
  messageImageUrlEditorBlockId = "";
  messageImageUrlPopoverPosition = null;
  messageCardUrlEditorBlockId = "";
  messageCardUrlPopoverPosition = null;
  syncLegacyMessageFromBlocks(node);
  flow.updatedAt = new Date().toISOString();
  saveState();
  render();
}

function removeMessageBlock(blockId) {
  const flow = selectedFlow();
  const node = flow ? selectedNode(flow) : null;
  if (!flow || !node || node.type !== "message") return;
  normalizeNodeStructure(node);
  const removedBlock = node.contentBlocks.find((block) => block.id === blockId);
  node.contentBlocks = node.contentBlocks.filter((block) => block.id !== blockId);
  if (removedBlock?.type === "text" && !node.contentBlocks.some((block) => block.type === "text")) {
    node.buttons = [];
    messageButtonEditorOptionId = "";
  }
  if (messageImageUrlEditorBlockId === blockId) {
    messageImageUrlEditorBlockId = "";
    messageImageUrlPopoverPosition = null;
  }
  if (messageCardUrlEditorBlockId === blockId) {
    messageCardUrlEditorBlockId = "";
    messageCardUrlPopoverPosition = null;
  }
  syncLegacyMessageFromBlocks(node);
  flow.updatedAt = new Date().toISOString();
  saveState();
  render();
}

function duplicateMessageBlock(blockId) {
  const flow = selectedFlow();
  const node = flow ? selectedNode(flow) : null;
  if (!flow || !node || node.type !== "message") return;
  normalizeNodeStructure(node);
  const index = node.contentBlocks.findIndex((block) => block.id === blockId);
  if (index < 0) return;
  const copy = JSON.parse(JSON.stringify(node.contentBlocks[index]));
  copy.id = makeId("block");
  copy.buttons = Array.isArray(copy.buttons)
    ? copy.buttons.map((button) => ({ ...button, id: makeId("btn") }))
    : [];
  node.contentBlocks.splice(index + 1, 0, copy);
  syncLegacyMessageFromBlocks(node);
  flow.updatedAt = new Date().toISOString();
  saveState();
  render();
}

function moveMessageBlock(blockId) {
  const flow = selectedFlow();
  const node = flow ? selectedNode(flow) : null;
  if (!flow || !node || node.type !== "message") return;
  normalizeNodeStructure(node);
  const index = node.contentBlocks.findIndex((block) => block.id === blockId);
  if (index < 0 || node.contentBlocks.length < 2) return;
  const nextIndex = index < node.contentBlocks.length - 1 ? index + 1 : index - 1;
  const [block] = node.contentBlocks.splice(index, 1);
  node.contentBlocks.splice(nextIndex, 0, block);
  syncLegacyMessageFromBlocks(node);
  flow.updatedAt = new Date().toISOString();
  saveState();
  render();
}

function computeMessageFloatingPosition(anchorElement, options = {}) {
  const margin = 12;
  const width = Number(options.width) || 278;
  const height = Number(options.height) || 140;
  const minTop = window.innerWidth <= 900 ? margin : 64;
  const drawer = document.querySelector(".page-grid.canvas-focused.show-inspector > .inspector") || document.querySelector(".page-grid.canvas-focused > .inspector");
  const drawerRect = drawer?.getBoundingClientRect();
  const anchorTarget = options.anchorSelector ? anchorElement?.closest(options.anchorSelector) : anchorElement;
  const anchorRect = anchorTarget?.getBoundingClientRect() || anchorElement?.getBoundingClientRect();
  const fallbackTop = Number(options.fallbackTop) || 140;
  const preferredLeft = drawerRect ? drawerRect.right + margin : (anchorRect?.right || margin);
  const preferredTop = anchorRect ? anchorRect.top + (Number(options.offsetTop) || 0) : (drawerRect ? drawerRect.top + fallbackTop : fallbackTop);
  const maxLeft = Math.max(margin, window.innerWidth - width - margin);
  const maxTop = Math.max(minTop, window.innerHeight - height - margin);

  return {
    left: Math.max(margin, Math.min(preferredLeft, maxLeft)),
    top: Math.max(minTop, Math.min(preferredTop, maxTop))
  };
}

function openMessageImageUrlEditor(blockId, anchorElement = null) {
  messageImageUrlEditorBlockId = blockId || "";
  messageImageUrlPopoverPosition = computeMessageFloatingPosition(anchorElement, {
    anchorSelector: "[data-message-block-widget]",
    width: 274,
    height: 116,
    fallbackTop: 160
  });
  messageCardUrlEditorBlockId = "";
  messageCardUrlPopoverPosition = null;
  messageMorePanelOpen = false;
  messageMorePanelPosition = null;
  render();
}

function closeMessageImageUrlEditor() {
  messageImageUrlEditorBlockId = "";
  messageImageUrlPopoverPosition = null;
  render();
}

function openMessageCardUrlEditor(blockId, anchorElement = null) {
  messageCardUrlEditorBlockId = blockId || "";
  messageCardUrlPopoverPosition = computeMessageFloatingPosition(anchorElement, {
    anchorSelector: "[data-message-block-widget]",
    width: 274,
    height: 116,
    fallbackTop: 160
  });
  messageImageUrlEditorBlockId = "";
  messageImageUrlPopoverPosition = null;
  messageMorePanelOpen = false;
  messageMorePanelPosition = null;
  render();
}

function closeMessageCardUrlEditor() {
  messageCardUrlEditorBlockId = "";
  messageCardUrlPopoverPosition = null;
  render();
}

function setCardImageAspect(blockId, aspect) {
  const flow = selectedFlow();
  const node = flow ? selectedNode(flow) : null;
  if (!flow || node?.type !== "message") return;
  normalizeNodeStructure(node);
  const block = node.contentBlocks.find((item) => item.id === blockId && item.type === "card");
  if (!block) return;
  block.imageAspectRatio = normalizeCardImageAspectRatio(aspect);
  flow.updatedAt = new Date().toISOString();
  saveState();
  render();
}

function toggleMessageMorePanel(anchorElement = null) {
  messageMorePanelOpen = !messageMorePanelOpen;
  messageMorePanelPosition = messageMorePanelOpen
    ? computeMessageFloatingPosition(anchorElement, {
        anchorSelector: ".manychat-content-options",
        width: 278,
        height: 360,
        fallbackTop: 232
      })
    : null;
  messageImageUrlEditorBlockId = "";
  messageImageUrlPopoverPosition = null;
  messageCardUrlEditorBlockId = "";
  messageCardUrlPopoverPosition = null;
  render();
}

function defaultMessageBlock(type) {
  return {
    id: makeId("block"),
    type,
    text: type === "text" ? "Nova mensagem" : "",
    url: "",
    cardUrl: "",
    title: "",
    subtitle: "",
    imageAspectRatio: type === "card" || type === "gallery" ? "horizontal" : "",
    fileName: "",
    fieldName: "",
    endpoint: "",
    items: [],
    buttons: []
  };
}

function findMessageBlockButton(node, blockId, buttonId) {
  const block = node?.contentBlocks?.find((item) => item.id === blockId);
  return block?.buttons?.find((option) => option.id === buttonId) || null;
}

function addMessageBlockButton(blockId) {
  const flow = selectedFlow();
  const node = flow ? selectedNode(flow) : null;
  if (!flow || !node || node.type !== "message") return;
  normalizeNodeStructure(node);
  const block = node.contentBlocks.find((item) => item.id === blockId && ["image", "card"].includes(item.type));
  if (!block) return;
  if (block.buttons.length >= 3) {
    toastMessage("O Messenger permite ate 3 botoes por bloco.");
    return;
  }
  block.buttons.push({ id: makeId("btn"), title: "Novo botão", type: "url", url: "", phone: "", next: null });
  flow.updatedAt = new Date().toISOString();
  saveState();
  render();
}

function removeMessageBlockButton(blockId, buttonId) {
  const flow = selectedFlow();
  const node = flow ? selectedNode(flow) : null;
  if (!flow || !node || node.type !== "message") return;
  normalizeNodeStructure(node);
  const block = node.contentBlocks.find((item) => item.id === blockId);
  if (!block) return;
  block.buttons = block.buttons.filter((option) => option.id !== buttonId);
  flow.updatedAt = new Date().toISOString();
  saveState();
  render();
}

function addMessageButton() {
  const flow = selectedFlow();
  const node = flow ? selectedNode(flow) : null;
  if (!flow || !node || node.type !== "message") return;
  normalizeNodeStructure(node);
  if (node.buttons.length >= 3) {
    toastMessage("O Messenger permite ate 3 botoes por mensagem.");
    return;
  }
  node.buttons.push({ id: makeId("btn"), title: "Novo botao", type: "next", url: "", phone: "", next: null });
  messageButtonEditorOptionId = node.buttons.at(-1).id;
  flow.updatedAt = new Date().toISOString();
  saveState();
  render();
}

function editMessageButton(optionId) {
  const flow = selectedFlow();
  const node = flow ? selectedNode(flow) : null;
  if (!flow || node?.type !== "message" || !node.buttons?.some((option) => option.id === optionId)) return;
  messageButtonEditorOptionId = optionId;
  showInspector = true;
  render();
}

function closeMessageButtonEditor() {
  messageButtonEditorOptionId = "";
  render();
}

function setMessageButtonBehavior(behavior) {
  const flow = selectedFlow();
  const node = flow ? selectedNode(flow) : null;
  const option = selectedMessageButtonOption(node);
  if (!flow || node?.type !== "message" || !option) return;
  if (!["message", "url", "phone", "action", "condition", "randomizer", "delay", "start_flow", "existing"].includes(behavior)) return;

  if (behavior === "url" || behavior === "phone" || behavior === "start_flow") {
    option.type = behavior;
    option.next = null;
    if (behavior !== "start_flow") option.flowId = "";
  } else {
    option.type = "next";
    option.flowId = "";
    if (["action", "condition", "randomizer", "delay"].includes(behavior)) {
      const currentTarget = flow.nodes.find((item) => item.id === option.next);
      if (currentTarget?.type !== behavior) {
        const buttonIndex = Math.max(0, node.buttons.findIndex((item) => item.id === option.id));
        const target = buildNode(behavior, node.x + 360, node.y + buttonIndex * 170);
        flow.nodes.push(target);
        option.next = target.id;
      }
    } else if (behavior === "message") {
      option.next = null;
    }
  }

  flow.updatedAt = new Date().toISOString();
  saveState();
  render();
}

function addQuickReply() {
  const flow = selectedFlow();
  const node = flow ? selectedNode(flow) : null;
  if (!flow || !node || node.type !== "message") return;
  normalizeNodeStructure(node);
  if (node.quickReplies.length >= 11) {
    toastMessage("O Messenger permite ate 11 respostas rapidas.");
    return;
  }
  node.quickReplies.push({ id: makeId("qr"), title: "Nova resposta", type: "next", url: "", phone: "", next: null });
  flow.updatedAt = new Date().toISOString();
  saveState();
  render();
}

function removeMessageOption(kind, optionId) {
  const flow = selectedFlow();
  const node = flow ? selectedNode(flow) : null;
  if (!flow || !node || node.type !== "message") return;
  if (kind === "button") node.buttons = node.buttons.filter((option) => option.id !== optionId);
  else node.quickReplies = node.quickReplies.filter((option) => option.id !== optionId);
  if (messageButtonEditorOptionId === optionId) messageButtonEditorOptionId = "";
  flow.updatedAt = new Date().toISOString();
  saveState();
  render();
}

function addRandomVariation() {
  const flow = selectedFlow();
  const node = flow ? selectedNode(flow) : null;
  if (!flow || !node || node.type !== "randomizer") return;
  normalizeNodeStructure(node);
  node.variations.push({ id: makeId("var"), label: `Variação ${node.variations.length + 1}`, weight: 0, next: null });
  flow.updatedAt = new Date().toISOString();
  saveState();
  render();
}

function removeRandomVariation(variationId) {
  const flow = selectedFlow();
  const node = flow ? selectedNode(flow) : null;
  if (!flow || !node || node.type !== "randomizer") return;
  node.variations = node.variations.filter((variation) => variation.id !== variationId);
  if (!node.variations.length) node.variations.push({ id: makeId("var"), label: "Variação A", weight: 100, next: null });
  flow.updatedAt = new Date().toISOString();
  saveState();
  render();
}

function addActionStep(type) {
  const flow = selectedFlow();
  const node = flow?.nodes.find((item) => item.id === actionPickerNodeId);
  const option = actionOptions.find((item) => item.id === type);
  if (!flow || !node || !option) return;

  const step = {
    id: makeId("act"),
    type: option.id,
    tag: option.id === "add_tag" ? "" : "",
    fieldId: "",
    fieldName: "",
    fieldValue: "",
    fieldType: "text"
  };

  nodeActionSteps(node).push(step);
  node.title = "Ações";
  node.message = summarizeActionSteps(node);
  flow.updatedAt = new Date().toISOString();
  actionPickerNodeId = "";
  selectedNodeId = node.id;
  showInspector = true;
  saveState();
  render();
}

function openActionTagPicker(stepId) {
  if (!stepId) return;
  actionTagPickerStepId = stepId;
  render();
  requestAnimationFrame(() => {
    const input = document.getElementById(`action_${stepId}`);
    input?.focus();
  });
}

function selectActionTag(stepId, tagName) {
  const context = actionStepContext(stepId);
  if (!context || !tagName) return;
  context.step.tag = tagName;
  addTagToLibrary(tagName, currentFlowPageId());
  context.node.message = summarizeActionSteps(context.node);
  context.flow.updatedAt = new Date().toISOString();
  actionTagPickerStepId = "";
  saveState();
  render();
}

function openActionFieldPicker(stepId) {
  if (!actionStepContext(stepId)) return;
  actionFieldPickerStepId = stepId;
  actionFieldPickerExpanded = false;
  actionFieldPickerQuery = "";
  render();
}

function expandActionFieldPicker(stepId) {
  if (!actionStepContext(stepId)) return;
  actionFieldPickerStepId = stepId;
  actionFieldPickerExpanded = true;
  render();
  requestAnimationFrame(() => document.getElementById(`action_field_${stepId}`)?.focus());
}

function selectActionCustomField(stepId, fieldName, fieldId = "") {
  const context = actionStepContext(stepId);
  const field = findCustomFieldForPage(fieldId || fieldName);
  if (!context || !field) return;
  context.step.fieldId = field.id;
  context.step.fieldName = field.name;
  context.step.fieldType = field.type;
  context.step.fieldValue = "";
  context.node.message = summarizeActionSteps(context.node);
  context.flow.updatedAt = new Date().toISOString();
  actionFieldPickerStepId = "";
  actionFieldPickerExpanded = false;
  actionFieldPickerQuery = "";
  saveState();
  render();
}

function openCreateActionTagModal(stepId) {
  const context = actionStepContext(stepId);
  if (!context) return;
  actionTagPickerStepId = "";
  openFormModal({
    title: "Criar tag",
    className: "tag-create-modal",
    intro:
      "Uma tag é como um rótulo que descreve características dos contatos, permitindo classificar e organizar o seu público de forma eficiente. As tags são usadas para segmentar os contatos com precisão.",
    submitLabel: "Criar",
    fields: [
      { name: "name", label: "Nome", value: context.step.tag || "", required: true, placeholder: "Inserir nome da tag" },
      {
        name: "folder",
        label: "Pasta",
        type: "select",
        value: DEFAULT_TAG_FOLDER_ID,
        options: tagFoldersForPage(currentFlowPageId()).map((folder) => ({ value: folder.id, label: folder.name }))
      }
    ],
    onSubmit: ({ name, folder }) => {
      const tagName = name.trim();
      if (!tagName) throw new Error("Informe o nome da tag.");
      context.step.tag = tagName;
      addTagToLibrary(tagName, currentFlowPageId(), folder || DEFAULT_TAG_FOLDER_ID);
      context.node.message = summarizeActionSteps(context.node);
      context.flow.updatedAt = new Date().toISOString();
      saveState();
      render();
    }
  });
}

function actionStepContext(stepId) {
  const flow = selectedFlow();
  const node = flow ? selectedNode(flow) : null;
  if (!flow || !node || node.type !== "action") return null;
  const step = nodeActionSteps(node).find((item) => item.id === stepId);
  return step ? { flow, node, step } : null;
}

function removeActionStep(nodeId, stepId) {
  const flow = selectedFlow();
  const node = flow?.nodes.find((item) => item.id === nodeId);
  if (!flow || !node || !stepId) return;

  node.actions = nodeActionSteps(node).filter((step) => step.id !== stepId);
  node.message = summarizeActionSteps(node);
  flow.updatedAt = new Date().toISOString();
  saveState();
  render();
}

function addNextStep(type) {
  const flow = selectedFlow();
  const current = flow?.nodes.find((item) => item.id === nextStepPickerNodeId);
  const normalizedType = nextStepType(type);
  if (!flow || !current || !normalizedType) return;

  const previousNext = current.next;
  const previousTarget = flow.nodes.find((item) => item.id === previousNext);
  const node = {
    id: makeId("node"),
    type: normalizedType,
    title: nodeLabels[normalizedType],
    message: defaultNodeMessage(normalizedType),
    actions: normalizedType === "action" ? [] : undefined,
    keyword: "",
    quickReplies: [],
    saveResponse: normalizedType === "user_input" ? true : undefined,
    responseField: normalizedType === "user_input" ? "ultima_resposta" : undefined,
    timeoutMinutes: normalizedType === "link_click_wait" ? 5 : normalizedType === "user_input" ? 0 : undefined,
    clickedNext: normalizedType === "link_click_wait" ? null : undefined,
    noClickNext: normalizedType === "link_click_wait" ? null : undefined,
    targetFlowId: normalizedType === "jump" ? flow.id : undefined,
    targetNodeId: normalizedType === "jump" ? "" : undefined,
    next: canAcceptIncomingConnection(previousTarget) ? previousNext : null,
    x: clampNodeX(Math.round(current.x + 340)),
    y: clampNodeY(Math.round(current.y))
  };
  normalizeNodeStructure(node);

  assignPrimaryTarget(current, node.id);
  flow.nodes.push(node);
  flow.updatedAt = new Date().toISOString();
  selectedNodeId = node.id;
  nextStepPickerNodeId = "";
  actionPickerNodeId = "";
  showInspector = true;
  saveState();
  render();
}

function setExistingNextStep(nodeId, targetId) {
  const flow = selectedFlow();
  const node = flow?.nodes.find((item) => item.id === nodeId);
  const target = flow?.nodes.find((item) => item.id === targetId);
  if (!flow || !node || !target || node.id === target.id || !canAcceptIncomingConnection(target)) return;

  assignPrimaryTarget(node, target.id);
  flow.updatedAt = new Date().toISOString();
  selectedNodeId = node.id;
  nextStepPickerNodeId = "";
  actionPickerNodeId = "";
  showInspector = true;
  saveState();
  render();
}

function nextStepType(type) {
  if (["message", "action", "condition", "delay", "user_input", "link_click_wait", "jump", "randomizer"].includes(type)) return type;
  return "";
}

function fitCanvasToViewport() {
  const canvas = document.querySelector("#flowCanvas");
  const flow = canvasDisplayFlow(selectedFlow());
  if (!canvas || !flow?.nodes?.length) return;

  const bounds = flow.nodes.reduce(
    (box, node) => ({
      minX: Math.min(box.minX, node.x),
      minY: Math.min(box.minY, node.y),
      maxX: Math.max(box.maxX, node.x + canvasNodeWidth(node) + 120),
      maxY: Math.max(box.maxY, node.y + 190)
    }),
    { minX: Infinity, minY: Infinity, maxX: 0, maxY: 0 }
  );

  const width = Math.max(520, bounds.maxX - Math.max(0, bounds.minX - 40));
  const height = Math.max(360, bounds.maxY - Math.max(0, bounds.minY - 40));
  const nextZoom = Math.min((canvas.clientWidth - 28) / width, (canvas.clientHeight - 28) / height, ZOOM_MAX);
  canvasZoom = clamp(nextZoom, ZOOM_MIN, ZOOM_MAX);
  localStorage.setItem("messenlead.canvas.zoom", String(canvasZoom));
  render();

  requestAnimationFrame(() => {
    const refreshed = document.querySelector("#flowCanvas");
    if (!refreshed) return;
    const centerX = (CANVAS_ORIGIN_X + (bounds.minX + bounds.maxX) / 2) * canvasZoom;
    const centerY = (CANVAS_ORIGIN_Y + (bounds.minY + bounds.maxY) / 2) * canvasZoom;
    refreshed.scrollLeft = Math.max(0, centerX - refreshed.clientWidth / 2);
    refreshed.scrollTop = Math.max(0, centerY - refreshed.clientHeight / 2);
  });
}

function createContact() {
  openFormModal({
    title: "Novo assinante",
    description: "Crie um contato local para testes de inbox e fluxo.",
    submitLabel: "Criar assinante",
    fields: [
      { name: "name", label: "Nome", value: "Novo assinante", required: true },
      { name: "psid", label: "PSID", value: "", hint: "Opcional. Se ficar vazio, um PSID de teste sera criado." },
      { name: "tag", label: "Tag", value: "novo-assinante" }
    ],
    onSubmit: ({ name, psid, tag }) => createContactFromValues({ name: name.trim(), psid: psid.trim(), tag: tag.trim() })
  });
}

function createContactFromValues({ name, psid, tag }) {
  const pageId = currentFlowPageId();
  const tags = normalizeTags(tag || "novo-assinante");
  tags.forEach((tagName) => addTagToLibrary(tagName, pageId));
  const contact = {
    id: makeId("contact"),
    pageId,
    name,
    psid: psid || `PSID_${Math.random().toString().slice(2, 12)}`,
    status: "open",
    tags,
    tag: tags[0] || "",
    source: "Cadastro manual",
    lastSeen: new Date().toISOString(),
    messages: [{ from: "contact", text: "Oi, comecei uma conversa pelo Messenger.", at: new Date().toISOString() }]
  };
  state.contacts.unshift(contact);
  selectedContactId = contact.id;
  saveState();
  syncContactToServer(contact);
  if (activeView === "subscribers") render();
  else navigate("inbox");
}

function sendContactMessage() {
  const contact = selectedContact();
  const textarea = document.querySelector("#composerText");
  const text = textarea?.value.trim();
  if (!contact || !text) return;
  contact.messages.push({ from: "page", text, at: new Date().toISOString() });
  contact.status = "open";
  contact.lastSeen = new Date().toISOString();
  saveState();
  syncContactToServer(contact);
  render();
}

function insertTemplate() {
  const textarea = document.querySelector("#composerText");
  if (!textarea) return;
  textarea.value = "Obrigado por chamar a página. Vou te ajudar por aqui no Messenger.";
  textarea.focus();
}

function runFlowForContact() {
  const contact = selectedContact();
  const flow = state.flows.find((item) => item.status === "active") || state.flows[0];
  if (!contact || !flow) return;
  const messages = simulateFlow(flow, "oi", contact.name, { contact, applyActions: true });
  messages
    .filter((message) => message.from === "bot")
    .forEach((message) => contact.messages.push({ from: "automation", text: message.text, at: new Date().toISOString() }));
  contact.status = "open";
  contact.lastSeen = new Date().toISOString();
  saveState();
  syncContactToServer(contact);
  render();
}

function toggleContactStatus() {
  const contact = selectedContact();
  if (!contact) return;
  contact.status = contact.status === "open" ? "closed" : "open";
  saveState();
  syncContactToServer(contact);
  render();
}

function updateContactProfileField(contactId, fieldName, value) {
  const contact = state.contacts.find((item) => item.id === contactId);
  if (!contact) return;

  if (fieldName === "name") contact.name = contactDisplayName(value, contact.psid);
  if (fieldName === "status") contact.status = value === "closed" ? "closed" : "open";
  if (fieldName === "source") contact.source = String(value || "").trim() || "Messenger";

  contact.updatedAt = new Date().toISOString();
  saveState();
  syncContactToServer(contact);
  render();
}

function updateContactCustomFieldFromInput(input) {
  const contact = state.contacts.find((item) => item.id === input.dataset.id);
  if (!contact) return;

  const field = subscriberCustomFieldForInput(contact, input);
  if (!field.name) return;

  const value = coerceCustomFieldValue(input.value, field.type);
  writeContactCustomField(contact, field, value);
  saveState();
  render();
  syncContactCustomFieldAction(contact, {
    type: "set_user_field",
    fieldId: field.id,
    fieldName: field.name,
    fieldType: field.type,
    fieldValue: value
  });
}

function clearContactCustomField(contactId, fieldName = "", fieldId = "") {
  const contact = state.contacts.find((item) => item.id === contactId);
  if (!contact) return;

  const field = subscriberCustomFieldDefinition(contact, fieldName, fieldId);
  if (!field.name && !field.id) return;

  if (field.name && contact.customFields) delete contact.customFields[field.name];
  if (field.id && contact.customFieldsById) delete contact.customFieldsById[field.id];
  contact.updatedAt = new Date().toISOString();
  saveState();
  render();
  syncContactCustomFieldAction(contact, {
    type: "clear_custom_field",
    fieldId: field.id,
    fieldName: field.name,
    fieldType: field.type
  });
}

function subscriberCustomFieldForInput(contact, input) {
  return subscriberCustomFieldDefinition(contact, input.dataset.fieldName, input.dataset.fieldId, input.dataset.fieldType);
}

function subscriberCustomFieldDefinition(contact, fieldName = "", fieldId = "", fieldType = "text") {
  const pageId = normalizeFlowPageId(contact?.pageId || currentFlowPageId());
  const fields = customFieldRecordsForPage(pageId);
  const id = String(fieldId || "").trim();
  const name = String(fieldName || "").trim();
  const field =
    (id && fields.find((item) => item.id === id)) ||
    (name && fields.find((item) => normalizeCustomFieldKey(item.name) === normalizeCustomFieldKey(name))) ||
    null;

  return {
    id: field?.id || id,
    name: field?.name || name,
    type: normalizeCustomFieldType(field?.type || fieldType)
  };
}

function writeContactCustomField(contact, field, value) {
  contact.customFields = contact.customFields && typeof contact.customFields === "object" ? contact.customFields : {};
  contact.customFieldsById = contact.customFieldsById && typeof contact.customFieldsById === "object" ? contact.customFieldsById : {};
  contact.customFields[field.name] = value;
  if (field.id) contact.customFieldsById[field.id] = value;
  contact.updatedAt = new Date().toISOString();
}

async function syncContactCustomFieldAction(contact, action) {
  if (!contact?.pageId || contact.pageId === DEFAULT_FLOW_PAGE_ID || !contact.psid) return;

  try {
    const result = await apiPost("/api/contacts", {
      pageId: contact.pageId,
      psid: contact.psid,
      contact: serializeContact(contact),
      action: "apply_actions",
      actions: [action]
    });
    if (result.contact) Object.assign(contact, normalizeContactRecord(result.contact, contact.pageId), { messages: contact.messages || [] });
    contactStore.serverAvailable = true;
    contactStore.pageId = contact.pageId;
    contactStore.status = "Contatos no D1";
    saveState();
  } catch (error) {
    contactStore.serverAvailable = false;
    contactStore.status = contactStoreStatusFromError(error);
    toastMessage(`Campo ficou local: ${contactStore.status}`);
  } finally {
    renderPageSwitcher();
    renderNav();
    if (activeView === "subscribers") render();
  }
}

function addTagFromContactEditor(contactId, inputId) {
  const contact = state.contacts.find((item) => item.id === contactId);
  const input = inputId ? document.getElementById(inputId) : null;
  const value = input?.value.trim();
  if (!contact || !value) return;
  if (!isSavedTagForPage(value, contact.pageId || currentFlowPageId())) {
    toastMessage("Selecione uma tag salva nesta Pagina.");
    return;
  }

  addTagToContact(contact, value);
  if (input) input.value = "";
  saveState();
  syncContactToServer(contact, { action: "add_tag", tag: value });
  render();
}

function openContactTagPicker(contactId) {
  if (!contactId) return;
  contactTagPickerContactId = contactTagPickerContactId === contactId ? "" : contactId;
  render();
}

function selectContactTag(contactId, value) {
  const contact = state.contacts.find((item) => item.id === contactId);
  const tagName = String(value || "").trim();
  if (!contact || !tagName) return;

  if (!isSavedTagForPage(tagName, contact.pageId || currentFlowPageId())) {
    toastMessage("Esta tag nao existe na Pagina selecionada.");
    return;
  }

  addTagToContact(contact, tagName);
  contactTagPickerContactId = "";
  saveState();
  syncContactToServer(contact, { action: "add_tag", tag: tagName });
  render();
}

function isSavedTagForPage(value, pageId = currentFlowPageId()) {
  const target = normalizeTagKey(value);
  return tagRecordsForPage(pageId).some((tag) => normalizeTagKey(tag.name) === target);
}

function removeContactTag(contactId, value) {
  const contact = state.contacts.find((item) => item.id === contactId);
  if (!contact || !value) return;

  removeTagFromContact(contact, value);
  saveState();
  syncContactToServer(contact, { action: "remove_tag", tag: value });
  render();
}

function addTagToContact(contact, value) {
  const tagName = normalizeTagName(value);
  if (!tagName) return;
  const tags = normalizeTags([...contactTags(contact), tagName]);
  contact.tags = tags;
  contact.tag = tags[0] || "";
  contact.lastSeen = contact.lastSeen || new Date().toISOString();
  addTagToLibrary(tagName, contact.pageId || currentFlowPageId());
}

function removeTagFromContact(contact, value) {
  const target = normalizeTagKey(value);
  const tags = contactTags(contact).filter((tagName) => normalizeTagKey(tagName) !== target);
  contact.tags = tags;
  contact.tag = tags[0] || "";
}

function createCampaign() {
  openFormModal({
    title: "Novo disparo",
    description: "Monte um disparo local para testar a lista de assinantes.",
    submitLabel: "Criar disparo",
    fields: [
      { name: "name", label: "Nome do disparo", value: "Novo disparo", required: true },
      { name: "audienceTag", label: "Tag do publico", value: "lead-quente", required: true },
      {
        name: "message",
        label: "Mensagem",
        type: "textarea",
        value: "Oi {{first_name}}, posso te ajudar com mais alguma coisa?",
        required: true
      }
    ],
    onSubmit: ({ name, audienceTag, message }) =>
      createCampaignFromValues({ name: name.trim(), audienceTag: audienceTag.trim(), message: message.trim() })
  });
}

function createCampaignFromValues({ name, audienceTag, message }) {
  state.campaigns.unshift({
    id: makeId("campaign"),
    name,
    audienceTag,
    message,
    status: "draft",
    sent: 0,
    delivered: 0,
    replies: 0,
    scheduledAt: "Rascunho"
  });
  saveState();
  render();
}

function launchCampaign(id) {
  const campaign = state.campaigns.find((item) => item.id === id);
  if (!campaign) return;
  const audience = eligibleContactsForBroadcast(campaign.audienceTag);
  if (!audience.length) {
    toastMessage("Nenhum contato apto para receber este disparo agora.");
    return;
  }
  campaign.status = "sent";
  campaign.sent = audience.length;
  campaign.delivered = Math.max(0, audience.length - (audience.length > 2 ? 1 : 0));
  campaign.replies = Math.floor(audience.length / 3);
  campaign.scheduledAt = "Enviado agora";
  audience.forEach((contact) => {
    if (!Array.isArray(contact.messages)) return;
    contact.messages.push({
      from: "page",
      text: resolveTemplate(campaign.message, contact.name),
      at: new Date().toISOString()
    });
  });
  saveState();
  toastMessage("Envio simulado no inbox local.");
  render();
}

async function runMissingTagFlow() {
  const pageId = currentFlowPageId();
  const flowId = currentMissingTagFlowId(pageId);
  const tag = currentMissingTagName(pageId);
  const selectedLimit = currentMissingTagLimit();
  const limit = selectedLimit === "all" ? "all" : Number(selectedLimit);

  if (!pageId || pageId === DEFAULT_FLOW_PAGE_ID || !flowId || !tag) {
    toastMessage("Selecione uma Pagina, um fluxo ativo e uma tag.");
    return;
  }

  broadcastState = { ...broadcastState, running: true, result: null, error: "" };
  render();

  try {
    const result = await apiPost("/api/flow-runtime/run-missing-tag", {
      pageId,
      flowId,
      tag,
      limit,
      scope: selectedLimit === "all" ? "all" : "limited"
    });
    broadcastState = { ...broadcastState, running: false, result, error: "" };
    toastMessage(`Disparo finalizado: ${result.triggered || 0} contato${result.triggered === 1 ? "" : "s"} acionado${result.triggered === 1 ? "" : "s"}.`);
    await Promise.all([
      loadContactsForPage(pageId),
      loadFlowLogsForPage(pageId, { silent: true })
    ]);
  } catch (error) {
    broadcastState = { ...broadcastState, running: false, result: null, error: error.message || "Falha no disparo manual." };
    toastMessage(broadcastState.error);
  } finally {
    if (activeView === "broadcasts") render();
  }
}

function deleteCampaign(id) {
  const campaign = state.campaigns.find((item) => item.id === id);
  if (!campaign) return;

  openConfirmModal({
    title: "Excluir disparo",
    message: `Excluir o disparo "${campaign.name}"?`,
    submitLabel: "Excluir",
    danger: true,
    onConfirm: () => {
      state.campaigns = state.campaigns.filter((item) => item.id !== id);
      saveState();
      render();
    }
  });
}

async function uploadMediaFile(file, kind) {
  if (!file) return;
  const normalizedKind = ["audio", "video"].includes(kind) ? kind : "image";
  if (normalizedKind === "audio" && !/\.mp3$/i.test(file.name || "")) {
    mediaState.error = "Envie um arquivo .mp3.";
    render();
    return;
  }
  if (normalizedKind === "video" && !String(file.type || "").startsWith("video/") && !/\.(mp4|webm|mov)$/i.test(file.name || "")) {
    mediaState.error = "Envie um arquivo de video.";
    render();
    return;
  }
  if (normalizedKind === "image" && !String(file.type || "").startsWith("image/")) {
    mediaState.error = "Envie um arquivo de imagem.";
    render();
    return;
  }

  const pageId = currentFlowPageId();
  const form = new FormData();
  form.set("pageId", pageId);
  form.set("kind", normalizedKind);
  form.set("file", file);

  mediaState = {
    ...mediaState,
    pageId,
    uploading: true,
    error: ""
  };
  if (activeView === "media") render();

  try {
    const result = await apiPostForm("/api/media", form);
    mediaState.assets = [result.asset, ...mediaState.assets.filter((asset) => asset.id !== result.asset.id)];
    mediaState.error = "";
    toastMessage(`${mediaKindLabel(normalizedKind)} enviado para a biblioteca.`);
    await loadMediaAssetsForPage(pageId, { silent: true });
  } catch (error) {
    mediaState.error = error.message || "Nao foi possivel enviar o arquivo.";
    toastMessage(mediaState.error);
  } finally {
    mediaState.uploading = false;
    if (activeView === "media") render();
  }
}

async function uploadMessageBlockFile(blockId, file, kind = "image") {
  if (!file) return;
  const normalizedKind = ["audio", "video"].includes(kind) ? kind : "image";
  const label = mediaKindLabel(normalizedKind);
  if (normalizedKind === "audio" && !/\.mp3$/i.test(file.name || "")) {
    toastMessage("Envie um arquivo .mp3.");
    return;
  }
  if (normalizedKind === "video" && !String(file.type || "").startsWith("video/") && !/\.(mp4|webm|mov)$/i.test(file.name || "")) {
    toastMessage("Envie um arquivo de video.");
    return;
  }
  if (normalizedKind === "image" && !String(file.type || "").startsWith("image/")) {
    toastMessage("Envie um arquivo de imagem.");
    return;
  }

  const flow = selectedFlow();
  const node = flow ? selectedNode(flow) : null;
  if (!flow || node?.type !== "message") return;
  normalizeNodeStructure(node);
  const block = node.contentBlocks.find((item) => item.id === blockId);
  if (!block) return;

  const pageId = currentFlowPageId();
  const form = new FormData();
  form.set("pageId", pageId);
  form.set("kind", normalizedKind);
  form.set("file", file);

  try {
    toastMessage(`Enviando ${label.toLowerCase()}...`);
    const result = await apiPostForm("/api/media", form);
    if (!(block.type === "card" && normalizedKind === "image")) {
      block.type = normalizedKind;
    }
    block.url = result.asset?.url || "";
    if (block.type !== "card") block.title = "";
    block.fileName = result.asset?.fileName || file.name || "";
    mediaState.assets = result.asset
      ? [result.asset, ...mediaState.assets.filter((asset) => asset.id !== result.asset.id)]
      : mediaState.assets;
    flow.updatedAt = new Date().toISOString();
    saveState();
    toastMessage(normalizedKind === "image" ? "Imagem adicionada ao bloco." : `${label} adicionado ao bloco.`);
  } catch (error) {
    toastMessage(error.message || `Não foi possível enviar ${label.toLowerCase()}.`);
  } finally {
    render();
  }
}

function mediaKindLabel(kind) {
  if (kind === "audio") return "Audio";
  if (kind === "video") return "Video";
  return "Imagem";
}

function copyMediaUrl(id) {
  const asset = mediaAssetById(id);
  if (!asset?.url) return;
  return copyText(asset.url, "URL da midia copiada.");
}

function insertMediaInSelectedMessage(id) {
  const asset = mediaAssetById(id);
  const flow = selectedFlow();
  const node = flow ? selectedNode(flow) : null;
  if (!asset || !flow || node?.type !== "message") {
    toastMessage("Selecione um node de mensagem no fluxo para usar esta midia.");
    return;
  }

  normalizeNodeStructure(node);
  node.contentBlocks.push({
    id: makeId("block"),
    type: asset.kind,
    text: "",
    url: asset.url,
    title: asset.originalName || asset.fileName,
    subtitle: "",
    fileName: asset.fileName,
    fieldName: "",
    endpoint: "",
    items: [],
    buttons: []
  });
  flow.updatedAt = new Date().toISOString();
  saveState();
  scheduleFlowSave();
  toastMessage("Midia adicionada ao node de mensagem.");
}

function confirmDeleteMediaAsset(id) {
  const asset = mediaAssetById(id);
  if (!asset) return;

  openConfirmModal({
    title: "Excluir midia",
    message: `Excluir "${asset.originalName || asset.fileName}" da biblioteca?`,
    submitLabel: "Excluir",
    danger: true,
    onConfirm: async () => {
      try {
        await apiDelete(`/api/media?pageId=${encodeURIComponent(currentFlowPageId())}&id=${encodeURIComponent(id)}`);
        mediaState.assets = mediaState.assets.filter((item) => item.id !== id);
        toastMessage("Midia excluida.");
      } catch (error) {
        toastMessage(error.message || "Nao foi possivel excluir a midia.");
      }
      render();
    }
  });
}

function mediaAssetById(id) {
  return (mediaState.assets || []).find((asset) => asset.id === id);
}

async function handleImageUpload(file) {
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    imageToolState.error = "Selecione um arquivo de imagem.";
    render();
    return;
  }

  clearImageUrls();
  const originalUrl = URL.createObjectURL(file);
  imageToolState = {
    original: {
      name: file.name,
      size: file.size,
      type: file.type || "image/png",
      url: originalUrl,
      width: 0,
      height: 0
    },
    cleaned: null,
    processing: true,
    error: ""
  };
  render();

  try {
    const result = await stripImageMetadata(file, originalUrl);
    imageToolState.original.width = result.width;
    imageToolState.original.height = result.height;
    imageToolState.cleaned = {
      name: cleanedImageName(result.type),
      size: result.blob.size,
      type: result.type,
      url: URL.createObjectURL(result.blob),
      width: result.width,
      height: result.height,
      blob: result.blob
    };
    imageToolState.processing = false;
    toastMessage("Metadados removidos.");
  } catch (error) {
    imageToolState.processing = false;
    imageToolState.error = error.message || "Nao foi possivel processar esta imagem.";
  }

  render();
}

async function stripImageMetadata(file, sourceUrl) {
  const image = await loadImageElement(sourceUrl);
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;

  if (!width || !height) {
    throw new Error("Nao consegui ler as dimensoes da imagem.");
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0, width, height);

  const type = normalizedImageOutputType(file.type);
  const blob = await new Promise((resolve) => {
    canvas.toBlob(resolve, type, type === "image/png" ? undefined : 0.92);
  });

  if (!blob) {
    throw new Error("O navegador nao conseguiu exportar a imagem limpa.");
  }

  return { blob, type, width, height };
}

function loadImageElement(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Formato de imagem nao suportado pelo navegador."));
    image.src = url;
  });
}

function normalizedImageOutputType(type) {
  if (["image/jpeg", "image/png", "image/webp"].includes(type)) return type;
  return "image/png";
}

function cleanedImageName(type) {
  const extension = type === "image/jpeg" ? "jpg" : type.split("/")[1] || "png";
  return `${randomImageBaseName()}.${extension}`;
}

function randomImageBaseName() {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return `imagem-${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}

function outputTypeLabel(type) {
  return String(type || "image/png").replace("image/", "").toUpperCase().replace("JPEG", "JPG");
}

function downloadCleanImage() {
  const cleaned = imageToolState.cleaned;
  if (!cleaned?.blob) return;
  downloadBlob(cleaned.name, cleaned.blob);
}

function clearImageTool() {
  clearImageUrls();
  imageToolState = {
    original: null,
    cleaned: null,
    processing: false,
    error: ""
  };
  render();
}

function clearImageUrls() {
  if (imageToolState.original?.url) URL.revokeObjectURL(imageToolState.original.url);
  if (imageToolState.cleaned?.url) URL.revokeObjectURL(imageToolState.cleaned.url);
}

async function handleVideoUpload(file) {
  if (!file) return;
  if (!file.type.startsWith("video/")) {
    videoToolState.error = "Selecione um arquivo de vídeo.";
    render();
    return;
  }

  clearVideoUrl("video");
  clearVideoUrl("output");
  const url = URL.createObjectURL(file);
  videoToolState = {
    ...videoToolState,
    video: {
      name: file.name,
      size: file.size,
      type: file.type || "video",
      url,
      duration: 0
    },
    output: null,
    processing: false,
    progress: 0,
    error: ""
  };
  render();

  try {
    const metadata = await readMediaMetadata(url, "video");
    videoToolState.video.duration = metadata.duration;
  } catch {
    videoToolState.video.duration = 0;
  }
  render();
}

async function handleAudioUpload(file) {
  if (!file) return;
  if (!file.type.startsWith("audio/")) {
    videoToolState.error = "Selecione um arquivo de áudio.";
    render();
    return;
  }

  clearVideoUrl("audio");
  clearVideoUrl("output");
  const url = URL.createObjectURL(file);
  videoToolState = {
    ...videoToolState,
    audio: {
      name: file.name,
      size: file.size,
      type: file.type || "audio",
      url,
      duration: 0
    },
    output: null,
    processing: false,
    progress: 0,
    error: ""
  };
  render();

  try {
    const metadata = await readMediaMetadata(url, "audio");
    videoToolState.audio.duration = metadata.duration;
  } catch {
    videoToolState.audio.duration = 0;
  }
  render();
}

function updateVideoToolField(target, options = {}) {
  const field = target.dataset.videoField;
  if (!field) return;

  if (target.type === "checkbox") {
    videoToolState[field] = target.checked;
  } else if (target.type === "range" || target.type === "number") {
    videoToolState[field] = Number(target.value);
  } else {
    videoToolState[field] = target.value;
  }

  clearVideoUrl("output");
  videoToolState.output = null;
  videoToolState.error = "";
  if (options.renderAfter !== false) render();
}

async function processVideoAudio() {
  if (videoToolState.processing) return;
  if (!videoToolState.video?.url || !videoToolState.audio?.url) {
    videoToolState.error = "Selecione um vídeo e um áudio.";
    render();
    return;
  }

  const captureStreamSupported = Boolean(HTMLMediaElement.prototype.captureStream || HTMLMediaElement.prototype.mozCaptureStream);
  if (!window.MediaRecorder || !window.AudioContext || !captureStreamSupported) {
    videoToolState.error = "Seu navegador não suporta processamento de vídeo local com áudio.";
    render();
    return;
  }

  clearVideoUrl("output");
  videoToolState = { ...videoToolState, output: null, processing: true, progress: 0, error: "" };
  render();

  let audioContext;
  let progressTimer;
  let combinedStream;
  let workbench;
  const chunks = [];

  try {
    const video = document.createElement("video");
    const audio = document.createElement("audio");
    video.src = videoToolState.video.url;
    audio.src = videoToolState.audio.url;
    video.muted = false;
    video.playsInline = true;
    video.preload = "auto";
    audio.preload = "auto";
    audio.loop = Boolean(videoToolState.loopAudio);
    workbench = document.createElement("div");
    workbench.style.cssText = "position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;";
    workbench.append(video, audio);
    document.body.append(workbench);

    await Promise.all([waitForMediaReady(video), waitForMediaReady(audio)]);

    audioContext = new AudioContext();
    await audioContext.resume();
    const destination = audioContext.createMediaStreamDestination();
    const videoSource = audioContext.createMediaElementSource(video);
    const audioSource = audioContext.createMediaElementSource(audio);
    const originalGain = audioContext.createGain();
    const audioGain = audioContext.createGain();

    originalGain.gain.value = videoToolState.mode === "overlay" ? Number(videoToolState.originalVolume) || 0 : 0;
    audioGain.gain.value = Number(videoToolState.audioVolume) || 0;
    videoSource.connect(originalGain).connect(destination);
    audioSource.connect(audioGain).connect(destination);

    const sourceStream = video.captureStream ? video.captureStream() : video.mozCaptureStream();
    const videoTracks = sourceStream.getVideoTracks();
    if (!videoTracks.length) throw new Error("Não consegui capturar o vídeo.");

    combinedStream = new MediaStream([...videoTracks, ...destination.stream.getAudioTracks()]);
    const mimeType = preferredVideoMimeType();
    const recorder = new MediaRecorder(combinedStream, mimeType ? { mimeType } : undefined);
    const finished = new Promise((resolve, reject) => {
      recorder.ondataavailable = (event) => {
        if (event.data?.size) chunks.push(event.data);
      };
      recorder.onerror = () => reject(recorder.error || new Error("Falha ao gravar o vídeo."));
      recorder.onstop = resolve;
    });

    video.currentTime = 0;
    audio.currentTime = 0;
    recorder.start(1000);
    progressTimer = window.setInterval(() => updateVideoProcessingProgress(video), 350);
    video.onended = () => {
      if (recorder.state !== "inactive") recorder.stop();
      audio.pause();
    };

    await Promise.all([video.play(), audio.play()]);
    await finished;

    const type = recorder.mimeType || mimeType || "video/webm";
    const blob = new Blob(chunks, { type });
    const outputUrl = URL.createObjectURL(blob);
    videoToolState.output = {
      name: randomVideoOutputName(),
      size: blob.size,
      type,
      url: outputUrl,
      blob,
      duration: videoToolState.video.duration || video.duration || 0
    };
    videoToolState.progress = 100;
    toastMessage("Vídeo gerado.");
  } catch (error) {
    videoToolState.error = error.message || "Não foi possível processar o vídeo.";
  } finally {
    if (progressTimer) window.clearInterval(progressTimer);
    combinedStream?.getTracks().forEach((track) => track.stop());
    workbench?.remove();
    if (audioContext) await audioContext.close().catch(() => {});
    videoToolState.processing = false;
    render();
  }
}

function updateVideoProcessingProgress(video) {
  const duration = videoToolState.video?.duration || video.duration || 0;
  if (!duration) return;
  videoToolState.progress = Math.max(0, Math.min(99, (video.currentTime / duration) * 100));
  const progress = document.querySelector("#videoProgress");
  if (!progress) return;
  progress.querySelector("span").textContent = `Processando ${Math.round(videoToolState.progress)}%`;
  progress.querySelector("i").style.width = `${Math.max(2, videoToolState.progress)}%`;
}

function preferredVideoMimeType() {
  return [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm"
  ].find((type) => MediaRecorder.isTypeSupported(type)) || "";
}

function waitForMediaReady(element) {
  return new Promise((resolve, reject) => {
    if (element.readyState >= 2) {
      resolve(element);
      return;
    }
    element.onloadeddata = () => resolve(element);
    element.onerror = () => reject(new Error("Não consegui ler o arquivo de mídia."));
  });
}

function readMediaMetadata(url, kind) {
  return new Promise((resolve, reject) => {
    const element = document.createElement(kind === "audio" ? "audio" : "video");
    element.preload = "metadata";
    element.src = url;
    element.onloadedmetadata = () => resolve({ duration: Number.isFinite(element.duration) ? element.duration : 0 });
    element.onerror = () => reject(new Error("Não consegui ler os metadados da mídia."));
  });
}

function downloadVideoOutput() {
  const output = videoToolState.output;
  if (!output?.blob) return;
  downloadBlob(output.name, output.blob);
}

function clearVideoTool() {
  clearVideoUrls();
  videoToolState = {
    video: null,
    audio: null,
    output: null,
    mode: "replace",
    originalVolume: 0.45,
    audioVolume: 1,
    loopAudio: true,
    processing: false,
    progress: 0,
    error: ""
  };
  render();
}

function clearVideoUrl(key) {
  if (videoToolState[key]?.url) URL.revokeObjectURL(videoToolState[key].url);
}

function clearVideoUrls() {
  clearVideoUrl("video");
  clearVideoUrl("audio");
  clearVideoUrl("output");
}

function randomVideoOutputName() {
  const bytes = new Uint8Array(10);
  crypto.getRandomValues(bytes);
  return `video-${Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("")}.webm`;
}

function startSimulation() {
  const flow = selectedFlow();
  if (!flow) return;
  simLog = simulateFlow(flow, "GET_STARTED", "Felipe");
  render();
}

function sendSimulationMessage() {
  const input = document.querySelector("#simInput");
  const text = input?.value.trim();
  const flow = selectedFlow();
  if (!text || !flow) return;
  simLog = simulateFlow(flow, text, "Felipe");
  render();
}

function simulateFlow(flow, inputText, displayName, options = {}) {
  const messages = [{ from: "user", text: inputText }];
  const normalizedText = normalize(inputText);
  const context = { inputText, normalizedText, contact: options.contact || null };
  let activeFlow = flow;
  let current =
    interactiveStartNode(flow, context) ||
    flow.nodes.find((node) => node.type === "trigger" && triggerMatchesSimulation(node, flow, normalizedText)) ||
    flow.nodes.find((node) => node.type === "trigger") ||
    flow.nodes[0];
  let guard = 0;

  while (current && guard < 12) {
    guard += 1;
    if (current.type === "message") {
      buildSimulationMessagesForNode(current, displayName).forEach((message) => messages.push(message));
    }
    if (current.type === "action") {
      if (options.applyActions && options.contact) applyActionNodeToContact(options.contact, current);
      nodeActionSteps(current).forEach((step) => {
        messages.push({ from: "system", text: actionStepSummary(step) });
      });
    }
    if (current.type === "delay" && current.message) {
      messages.push({ from: "bot", text: smartDelaySummary(current) });
    }
    if (current.type === "user_input") {
      messages.push({ from: "system", text: "Aguardando a próxima resposta do contato." });
      break;
    }
    if (current.type === "link_click_wait") {
      messages.push({ from: "system", text: "Aguardando clique no link enviado pelo node anterior." });
      break;
    }
    if (current.type === "jump") {
      const targetFlow = jumpTargetFlow(current, activeFlow);
      const targetNode = targetFlow?.nodes?.find((node) => node.id === current.targetNodeId);
      messages.push({
        from: "system",
        text: targetFlow && targetNode
          ? `Continuar em ${targetFlow.name || "fluxo sem nome"} / ${jumpTargetNodeLabel(targetNode)}`
          : "Selecionar passo: destino nao configurado."
      });
      if (!targetFlow || !targetNode || !canAcceptIncomingConnection(targetNode)) break;
      activeFlow = targetFlow;
      current = targetNode;
      continue;
    }
    if (current.type === "condition") {
      messages.push({ from: "system", text: conditionMatchesNode(current, context) ? "Condição: caminho SIM" : "Condição: caminho NÃO" });
    }
    if (current.type === "randomizer") {
      const variation = pickRandomVariation(current, context);
      messages.push({ from: "system", text: `Randomizador: ${variation?.label || "sem caminho"}` });
    }
    current = current.type === "comment" ? null : nextExecutableNode(activeFlow, current, context);
  }

  if (messages.length === 1) {
    messages.push({ from: "bot", text: state.settings.defaultReply });
  }

  return messages;
}

function interactiveStartNode(flow, context) {
  if (!["postback", "quick_reply"].includes(context.eventType)) return null;

  for (const node of flow.nodes || []) {
    if (node.type !== "message") continue;
    normalizeNodeStructure(node);
    const option = matchingMessageOption(node, context);
    if (!option?.next) continue;
    const target = flow.nodes.find((item) => item.id === option.next);
    if (canAcceptIncomingConnection(target)) return target;
  }
  return null;
}

function buildSimulationMessagesForNode(node, displayName) {
  normalizeNodeStructure(node);
  const messages = [];
  node.contentBlocks.forEach((block) => {
    if (block.type === "text") messages.push({ from: "bot", text: resolveTemplate(block.text || node.message, displayName) });
    else if (["image", "audio", "video", "file"].includes(block.type)) {
      messages.push({ from: "bot", text: `${messageBlockTypeLabel(block.type)}: ${block.url || "sem URL"}` });
      const blockButtons = (block.buttons || []).map((option) => option.title).filter(Boolean);
      if (block.type === "image" && blockButtons.length) messages.push({ from: "system", text: `Botoes da imagem: ${blockButtons.join(", ")}` });
    }
    else if (block.type === "card") messages.push({ from: "bot", text: `Card: ${block.title || "sem título"}` });
    else if (block.type === "gallery") messages.push({ from: "bot", text: `Galeria: ${block.title || "sem título"}` });
    else if (block.type === "data_collection") messages.push({ from: "bot", text: resolveTemplate(block.text || "Informe o dado solicitado.", displayName) });
    else messages.push({ from: "bot", text: resolveTemplate(block.text || "Mensagem dinâmica.", displayName) });
  });
  const quickReplies = node.quickReplies.map((option) => option.title).filter(Boolean);
  const buttons = node.buttons.map((option) => option.title).filter(Boolean);
  if (quickReplies.length) messages.push({ from: "system", text: `Respostas rápidas: ${quickReplies.join(", ")}` });
  if (buttons.length) messages.push({ from: "system", text: `Botões: ${buttons.join(", ")}` });
  return messages.length ? messages : [{ from: "bot", text: resolveTemplate(node.message, displayName) }];
}

function messageBlockTypeLabel(type) {
  return messageContentBlockTypes.find((item) => item.type === type)?.label || type;
}

function smartDelaySummary(node) {
  normalizeNodeStructure(node);
  if (node.delayType === "date") return `Atraso até ${node.specificDate || "data não definida"}`;
  if (node.delayType === "dynamic_date") {
    const field = findCustomFieldForPage(node.dynamicFieldId || node.dynamicField);
    return `Atraso até o campo ${field?.name || node.dynamicField || "não definido"}`;
  }
  return `Atraso de ${node.delayValue || node.delayMinutes || 0} ${delayUnitLabel(node.delayUnit)}`;
}

function triggerMatchesSimulation(node, flow, normalizedText) {
  const triggers = nodeTriggerEvents(node);
  const keywords = node.keyword || flow.trigger || "";
  return triggers.some((trigger) => {
    if (trigger === "messenger_message") return true;
    if (trigger === "facebook_ad") return normalizedText.includes("ad") || normalizedText.includes("anuncio");
    if (trigger === "facebook_comment") return normalizedText.includes("comentario");
    if (trigger === "referral_link") return normalizedText.includes("ref") || keywordMatches(keywords, normalizedText);
    if (trigger === "qr_code") return normalizedText.includes("qr") || keywordMatches(keywords, normalizedText);
    if (trigger === "facebook_shop_message") return normalizedText.includes("loja") || normalizedText.includes("shop");
    if (trigger === "get_started") return normalizedText.includes("get_started") || normalizedText.includes("comecar");
    if (trigger === "messenger_postback") return normalizedText.includes("postback") || normalizedText.includes("botao") || keywordMatches(keywords, normalizedText);
    if (trigger === "messenger_optin") return normalizedText.includes("optin") || normalizedText.includes("opt-in") || keywordMatches(keywords, normalizedText);
    if (trigger === "message_contains_keyword") return keywordMatches(keywords, normalizedText);
    return false;
  });
}

function applyActionNodeToContact(contact, node) {
  nodeActionSteps(node).forEach((step) => {
    if (step.type === "add_tag" && step.tag) addTagToContact(contact, step.tag);
    if (step.type === "remove_tag" && step.tag) removeTagFromContact(contact, step.tag);
    if (step.type === "set_user_field" && (step.fieldName || step.fieldId)) {
      const field = findCustomFieldForPage(step.fieldId || step.fieldName);
      const fieldName = field?.name || step.fieldName;
      if (!fieldName) return;
      const value = coerceCustomFieldValue(step.fieldValue, field?.type || step.fieldType);
      contact.customFields = contact.customFields && typeof contact.customFields === "object" ? contact.customFields : {};
      contact.customFieldsById = contact.customFieldsById && typeof contact.customFieldsById === "object" ? contact.customFieldsById : {};
      contact.customFields[fieldName] = value;
      if (field?.id || step.fieldId) contact.customFieldsById[field?.id || step.fieldId] = value;
      if (step.fieldName && step.fieldName !== fieldName) delete contact.customFields[step.fieldName];
    }
    if (step.type === "clear_custom_field" && (step.fieldName || step.fieldId) && contact.customFields) {
      const field = findCustomFieldForPage(step.fieldId || step.fieldName);
      const fieldName = field?.name || step.fieldName;
      if (!fieldName) return;
      delete contact.customFields[fieldName];
      if (field?.id || step.fieldId) delete contact.customFieldsById?.[field?.id || step.fieldId];
      if (step.fieldName && step.fieldName !== fieldName) delete contact.customFields[step.fieldName];
    }
    if (step.type === "delete_contact") {
      contact.status = "deleted";
    }
    if (step.type === "open_inbox") {
      contact.status = "open";
    }
  });
}

function enableNodeDragging(flow) {
  const canvas = document.querySelector("#flowCanvas");
  if (!canvas) return;
  canvas.querySelectorAll(".node").forEach((element) => {
    element.addEventListener("pointerdown", (event) => {
      if (event.target.closest("button, .node-hover-actions, .node-port")) return;
      const node = flow.nodes.find((item) => item.id === element.dataset.id);
      if (!node) return;
      selectedNodeId = node.id;
      const zoom = canvasZoom || 1;
      const startX = event.clientX;
      const startY = event.clientY;
      const startNodeX = node.x;
      const startNodeY = node.y;
      let moved = false;
      element.setPointerCapture(event.pointerId);
      canvas.querySelectorAll(".node.selected").forEach((nodeElement) => nodeElement.classList.remove("selected"));
      element.classList.add("selected");

      const onMove = (moveEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;
        if (Math.abs(deltaX) + Math.abs(deltaY) <= 3) return;
        moved = true;
        const x = startNodeX + deltaX / zoom;
        const y = startNodeY + deltaY / zoom;
        node.x = clampNodeX(Math.round(x));
        node.y = clampNodeY(Math.round(y));
        element.style.left = `${canvasNodeLeft(node)}px`;
        element.style.top = `${canvasNodeTop(node)}px`;
        updateLiveConnections(flow);
        updateMiniMap(flow);
      };

      const onUp = () => {
        element.removeEventListener("pointermove", onMove);
        element.removeEventListener("pointerup", onUp);
        if (moved) {
          suppressedNodeClickId = node.id;
          window.setTimeout(() => {
            if (suppressedNodeClickId === node.id) suppressedNodeClickId = "";
          }, 250);
          flow.updatedAt = new Date().toISOString();
          saveState();
        }
      };

      element.addEventListener("pointermove", onMove);
      element.addEventListener("pointerup", onUp);
    });
  });
}

function enableConnectionDragging(flow) {
  const canvas = document.querySelector("#flowCanvas");
  const layer = document.querySelector(".connection-layer");
  if (!canvas || !layer) return;

  canvas.querySelectorAll(".node-port").forEach((port) => {
    port.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });

    port.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const sourceId = port.dataset.portSource;
      const source = flow.nodes.find((node) => node.id === sourceId);
      if (!source) return;

      selectedNodeId = source.id;
      port.setPointerCapture(event.pointerId);
      canvas.classList.add("connecting");
      canvas.querySelectorAll(".node.selected").forEach((nodeElement) => nodeElement.classList.remove("selected"));
      port.closest(".node")?.classList.add("selected");

      const sourceOutput = portOutputRef(port);
      const start = nodeOutputPoint(source, sourceOutput);
      const startClientX = event.clientX;
      const startClientY = event.clientY;
      let moved = false;
      const tempPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      tempPath.setAttribute("class", "connection-temp");
      layer.appendChild(tempPath);

      const onMove = (moveEvent) => {
        moveEvent.preventDefault();
        if (Math.abs(moveEvent.clientX - startClientX) + Math.abs(moveEvent.clientY - startClientY) > 3) moved = true;
        const point = canvasPointFromEvent(moveEvent, canvas);
        tempPath.setAttribute("d", connectionPath(start.x, start.y, point.x, point.y));
      };

      const onUp = (upEvent) => {
        upEvent.preventDefault();
        upEvent.stopPropagation();
        port.removeEventListener("pointermove", onMove);
        port.removeEventListener("pointerup", onUp);
        if (port.hasPointerCapture?.(upEvent.pointerId)) port.releasePointerCapture(upEvent.pointerId);
        canvas.classList.remove("connecting");
        tempPath.remove();

        const targetElement = document.elementFromPoint(upEvent.clientX, upEvent.clientY)?.closest(".node");
        const targetId = targetElement?.dataset.id;
        const target = targetId ? flow.nodes.find((node) => node.id === targetId) : null;

        if (target && target.id !== source.id && canAcceptIncomingConnection(target)) {
          assignOutputTarget(source, target.id, sourceOutput);
          selectedNodeId = source.id;
          flow.updatedAt = new Date().toISOString();
          rememberCanvasScroll();
          saveState();
          render();
          return;
        }

        if (moved && clientPointInsideElement(upEvent, canvas)) {
          openCanvasAddMenuAtPoint(upEvent, {
            sourceId: source.id,
            sourceOutput
          });
          return;
        }

        updateLiveConnections(flow);
      };

      onMove(event);
      port.addEventListener("pointermove", onMove);
      port.addEventListener("pointerup", onUp);
    });
  });
}

function portOutputRef(port) {
  return {
    field: port.dataset.portField || "",
    kind: port.dataset.portKind || "",
    optionId: port.dataset.portOptionId || "",
    blockId: port.dataset.portBlockId || ""
  };
}

function assignPrimaryTarget(node, targetId) {
  normalizeNodeStructure(node);
  if (node.type === "jump") return;
  if (node.type === "condition") {
    if (!node.yesNext) node.yesNext = targetId;
    else node.noNext = targetId;
    return;
  }
  if (node.type === "link_click_wait") {
    if (!node.clickedNext) {
      node.clickedNext = targetId;
      node.next = targetId;
    } else {
      node.noClickNext = targetId;
    }
    return;
  }
  if (node.type === "randomizer") {
    const empty = node.variations.find((variation) => !variation.next) || node.variations[0];
    if (empty) empty.next = targetId;
    return;
  }
  node.next = targetId;
}

function assignOutputTarget(node, targetId, output = "") {
  normalizeNodeStructure(node);
  const ref = typeof output === "string" ? { field: output } : output || {};
  const field = ref.field || "";
  if (node.type === "condition" && (field === "yesNext" || field === "noNext")) {
    node[field] = targetId;
    return;
  }
  if (node.type === "link_click_wait" && (field === "clickedNext" || field === "noClickNext")) {
    node[field] = targetId;
    if (field === "clickedNext") node.next = targetId;
    return;
  }
  if (node.type === "message") {
    if (field === "next") {
      node.next = targetId;
      return;
    }
    if ((ref.kind === "button" || ref.kind === "quick_reply") && ref.optionId) {
      const list = ref.kind === "button" ? node.buttons : node.quickReplies;
      const option = list.find((item) => item.id === ref.optionId);
      if (option) {
        option.type = "next";
        option.url = "";
        option.phone = "";
        option.flowId = "";
        option.next = targetId;
      }
      return;
    }
    if (ref.kind === "image_button" && ref.blockId && ref.optionId) {
      const option = findMessageBlockButton(node, ref.blockId, ref.optionId);
      if (option) {
        option.type = "next";
        option.url = "";
        option.phone = "";
        option.next = targetId;
      }
      return;
    }
  }
  assignPrimaryTarget(node, targetId);
}

function enableCanvasPanning() {
  const canvas = document.querySelector("#flowCanvas");
  if (!canvas) return;
  canvas.addEventListener("scroll", updateMiniMapViewport, { passive: true });
  updateMiniMapViewport();

  canvas.addEventListener("pointerdown", (event) => {
    if (event.target.closest(".node, button, input, textarea, select, .inspector, .canvas-floating-tools")) return;
    event.preventDefault();

    const startX = event.clientX;
    const startY = event.clientY;
    const startScrollLeft = canvas.scrollLeft;
    const startScrollTop = canvas.scrollTop;
    let moved = false;
    canvas.setPointerCapture(event.pointerId);
    canvas.classList.add("panning");

    const onMove = (moveEvent) => {
      if (Math.abs(moveEvent.clientX - startX) + Math.abs(moveEvent.clientY - startY) > 3) moved = true;
      canvas.scrollLeft = startScrollLeft - (moveEvent.clientX - startX);
      canvas.scrollTop = startScrollTop - (moveEvent.clientY - startY);
    };

    const onUp = () => {
      canvas.classList.remove("panning");
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      rememberCanvasScroll();
      updateMiniMapViewport();
      if (!moved) clearCanvasSelection();
    };

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
  });
}

function enableCanvasDoubleClickMenu() {
  const canvas = document.querySelector("#flowCanvas");
  const shell = document.querySelector(".canvas-shell");
  if (!canvas || !shell) return;

  canvas.addEventListener("dblclick", (event) => {
    if (event.target.closest(".node, button, input, textarea, select, .inspector, .canvas-floating-tools, .canvas-minimap, .canvas-add-menu")) return;
    event.preventDefault();
    event.stopPropagation();
    openCanvasAddMenuAtPoint(event);
  });
}

function openCanvasAddMenuAtPoint(event, options = {}) {
  const canvas = document.querySelector("#flowCanvas");
  const shell = document.querySelector(".canvas-shell");
  if (!canvas || !shell) return;

  const shellRect = shell.getBoundingClientRect();
  const canvasRect = canvas.getBoundingClientRect();
  const zoom = canvasZoom || 1;
  const stageX = (canvas.scrollLeft + event.clientX - canvasRect.left) / zoom;
  const stageY = (canvas.scrollTop + event.clientY - canvasRect.top) / zoom;

  canvasAddMenu = {
    left: clamp(event.clientX - shellRect.left, 8, shell.clientWidth - 176),
    top: clamp(event.clientY - shellRect.top, 52, shell.clientHeight - 270),
    x: clampNodeX(stageX - CANVAS_ORIGIN_X - NODE_WIDTH / 2),
    y: clampNodeY(stageY - CANVAS_ORIGIN_Y - NODE_CENTER_Y),
    sourceId: options.sourceId || "",
    sourceOutput: options.sourceOutput || null
  };

  rememberCanvasScroll();
  render();
}

function clientPointInsideElement(event, element) {
  const rect = element.getBoundingClientRect();
  return event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
}

function enableCanvasWheelZoom() {
  const canvas = document.querySelector("#flowCanvas");
  if (!canvas) return;

  canvas.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const anchorX = event.clientX - rect.left;
      const anchorY = event.clientY - rect.top;
      const scale = event.deltaY < 0 ? 1.08 : 0.92;
      applyCanvasZoom(canvasZoom * scale, anchorX, anchorY);
    },
    { passive: false }
  );
}

function enableMiniMapNavigation() {
  const miniMap = document.querySelector("#canvasMinimap");
  const canvas = document.querySelector("#flowCanvas");
  if (!miniMap || !canvas) return;

  const moveToEventPoint = (event, options = {}) => {
    event.preventDefault();
    event.stopPropagation();
    const svg = miniMap.querySelector("svg");
    if (!svg) return false;
    const point = miniMapPointFromEvent(event, svg, options);
    if (!point) return false;
    centerCanvasOnMiniMapPoint(point.x, point.y);
    return true;
  };

  miniMap.addEventListener("pointerdown", (event) => {
    if (!moveToEventPoint(event, { requireInside: true })) return;
    miniMap.classList.add("dragging");
    miniMap.setPointerCapture(event.pointerId);

    const onMove = (moveEvent) => moveToEventPoint(moveEvent);
    const onUp = () => {
      miniMap.classList.remove("dragging");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      if (miniMap.hasPointerCapture?.(event.pointerId)) miniMap.releasePointerCapture(event.pointerId);
      rememberCanvasScroll();
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  });
}

function miniMapPointFromEvent(event, svg, options = {}) {
  const rect = svg.getBoundingClientRect();
  const rawX = event.clientX - rect.left;
  const rawY = event.clientY - rect.top;

  if (options.requireInside && (rawX < 0 || rawY < 0 || rawX > rect.width || rawY > rect.height)) {
    return null;
  }

  return {
    x: clamp((rawX / rect.width) * MINIMAP_WIDTH, 0, MINIMAP_WIDTH),
    y: clamp((rawY / rect.height) * MINIMAP_HEIGHT, 0, MINIMAP_HEIGHT)
  };
}

function centerCanvasOnMiniMapPoint(miniXPos, miniYPos) {
  const canvas = document.querySelector("#flowCanvas");
  if (!canvas) return;

  const zoom = canvasZoom || 1;
  const stageX = (miniXPos / MINIMAP_WIDTH) * CANVAS_WIDTH;
  const stageY = (miniYPos / MINIMAP_HEIGHT) * CANVAS_HEIGHT;
  const maxScrollLeft = Math.max(0, canvas.scrollWidth - canvas.clientWidth);
  const maxScrollTop = Math.max(0, canvas.scrollHeight - canvas.clientHeight);
  canvas.scrollLeft = clamp(stageX * zoom - canvas.clientWidth / 2, 0, maxScrollLeft);
  canvas.scrollTop = clamp(stageY * zoom - canvas.clientHeight / 2, 0, maxScrollTop);
  rememberCanvasScroll();
  updateMiniMapViewport();
}

function applyCanvasZoom(value, anchorX, anchorY) {
  const canvas = document.querySelector("#flowCanvas");
  if (!canvas) return;

  const oldZoom = canvasZoom || 1;
  const nextZoom = clamp(value, ZOOM_MIN, ZOOM_MAX);
  if (Math.abs(nextZoom - oldZoom) < 0.001) return;

  const worldX = (canvas.scrollLeft + anchorX) / oldZoom;
  const worldY = (canvas.scrollTop + anchorY) / oldZoom;
  const world = canvas.querySelector(".canvas-world");

  canvasZoom = nextZoom;
  localStorage.setItem("messenlead.canvas.zoom", String(canvasZoom));
  canvas.style.setProperty("--canvas-zoom", String(canvasZoom));
  if (world) {
    world.style.width = `${CANVAS_WIDTH * canvasZoom}px`;
    world.style.height = `${CANVAS_HEIGHT * canvasZoom}px`;
  }

  canvas.scrollLeft = Math.max(0, worldX * canvasZoom - anchorX);
  canvas.scrollTop = Math.max(0, worldY * canvasZoom - anchorY);
  updateCanvasZoomLabel();
  rememberCanvasScroll();
  updateMiniMapViewport();
}

function updateCanvasZoomLabel() {
  const label = document.querySelector(".canvas-zoom > span");
  if (label) label.textContent = `${Math.round(canvasZoom * 100)}%`;
}

function clearCanvasSelection() {
  if (!showInspector && !selectedNodeId && !triggerPickerNodeId && !nextStepPickerNodeId && !actionPickerNodeId) return;
  showInspector = false;
  selectedNodeId = "";
  messageButtonEditorOptionId = "";
  messageImageUrlEditorBlockId = "";
  messageImageUrlPopoverPosition = null;
  messageCardUrlEditorBlockId = "";
  messageCardUrlPopoverPosition = null;
  messageMorePanelOpen = false;
  messageMorePanelPosition = null;
  triggerPickerNodeId = "";
  nextStepPickerNodeId = "";
  actionPickerNodeId = "";
  actionTagPickerStepId = "";
  actionFieldPickerStepId = "";
  actionFieldPickerExpanded = false;
  actionFieldPickerQuery = "";
  canvasAddMenu = null;
  document.querySelector(".canvas-focused")?.classList.remove("show-inspector");
  document.querySelector(".trigger-picker-panel")?.remove();
  document.querySelector(".next-step-picker-panel")?.remove();
  document.querySelector(".action-picker-panel")?.remove();
  document.querySelector(".canvas-add-menu")?.remove();
  document.querySelectorAll(".node.selected").forEach((nodeElement) => nodeElement.classList.remove("selected"));
  updateMiniMap();
}

function rememberCanvasScroll() {
  const canvas = document.querySelector("#flowCanvas");
  if (!canvas) return;
  const zoom = canvasZoom || 1;
  canvasScrollState = {
    x: canvas.scrollLeft / zoom,
    y: canvas.scrollTop / zoom
  };
}

function restoreCanvasScroll() {
  const canvas = document.querySelector("#flowCanvas");
  if (!canvas || !canvasScrollState) return;
  const zoom = canvasZoom || 1;
  canvas.scrollLeft = canvasScrollState.x * zoom;
  canvas.scrollTop = canvasScrollState.y * zoom;
}

function rememberInspectorScroll() {
  const scroller = document.querySelector("[data-inspector-scroll]");
  if (!scroller) return;
  inspectorScrollState = {
    nodeId: scroller.dataset.inspectorNodeId || "",
    scrollTop: scroller.scrollTop
  };
}

function restoreInspectorScroll() {
  const snapshot = inspectorScrollState;
  if (!snapshot) return;
  window.requestAnimationFrame(() => {
    const scroller = document.querySelector("[data-inspector-scroll]");
    if (!scroller || scroller.dataset.inspectorNodeId !== snapshot.nodeId) return;
    scroller.scrollTop = Math.min(snapshot.scrollTop, Math.max(0, scroller.scrollHeight - scroller.clientHeight));
  });
}

function scrollFocusedMessageBlockIntoView() {
  const blockId = messageBlockFocusId;
  if (!blockId) return;
  messageBlockFocusId = "";
  window.requestAnimationFrame(() => {
    const widget = Array.from(document.querySelectorAll("[data-message-block-widget]"))
      .find((item) => item.dataset.messageBlockWidget === blockId);
    widget?.scrollIntoView({ block: "center" });
  });
}

function updateLiveConnections(flow) {
  const layer = document.querySelector(".connection-layer");
  if (!layer) return;
  layer.innerHTML = renderConnections(flow);
}

function scheduleCanvasGeometryRefresh(flow) {
  if (canvasGeometryFrame) cancelAnimationFrame(canvasGeometryFrame);
  canvasGeometryFrame = requestAnimationFrame(() => {
    canvasGeometryFrame = 0;
    if (activeView !== "flows" || !flowCanvasOpen) return;
    const renderedFlow = canvasDisplayFlow(selectedFlow());
    if (!renderedFlow || renderedFlow.id !== flow?.id) return;
    updateLiveConnections(renderedFlow);
    updateMiniMap(renderedFlow);
  });
}

function updateMiniMap(flow = canvasDisplayFlow(selectedFlow())) {
  const miniMap = document.querySelector("#canvasMinimap");
  if (!miniMap || !flow) return;
  miniMap.innerHTML = renderMiniMapContent(flow);
  updateMiniMapViewport();
}

function updateMiniMapViewport() {
  const canvas = document.querySelector("#flowCanvas");
  const viewport = document.querySelector("#minimapViewport");
  if (!canvas || !viewport) return;

  const zoom = canvasZoom || 1;
  const x = (canvas.scrollLeft / zoom / CANVAS_WIDTH) * MINIMAP_WIDTH;
  const y = (canvas.scrollTop / zoom / CANVAS_HEIGHT) * MINIMAP_HEIGHT;
  const width = Math.max(8, (canvas.clientWidth / zoom / CANVAS_WIDTH) * MINIMAP_WIDTH);
  const height = Math.max(8, (canvas.clientHeight / zoom / CANVAS_HEIGHT) * MINIMAP_HEIGHT);

  viewport.setAttribute("x", miniNumber(Math.max(0, Math.min(MINIMAP_WIDTH - width, x))));
  viewport.setAttribute("y", miniNumber(Math.max(0, Math.min(MINIMAP_HEIGHT - height, y))));
  viewport.setAttribute("width", miniNumber(Math.min(MINIMAP_WIDTH, width)));
  viewport.setAttribute("height", miniNumber(Math.min(MINIMAP_HEIGHT, height)));
}

function renderMiniMapContent(flow) {
  const links = flow.nodes
    .flatMap((node) =>
      connectionTargets(flow, node).map((connection) => {
        const start = nodeOutputPoint(node, connection);
        const end = nodeInputPoint(connection.target);
        return `<line class="minimap-link" x1="${miniX(start.x)}" y1="${miniY(start.y)}" x2="${miniX(end.x)}" y2="${miniY(end.y)}" />`;
      })
    )
    .join("");
  const nodes = flow.nodes
    .map((node) => {
      const width = Math.max(4, (canvasNodeWidth(node) / CANVAS_WIDTH) * MINIMAP_WIDTH);
      const height = Math.max(5, (136 / CANVAS_HEIGHT) * MINIMAP_HEIGHT);
      return `<rect class="minimap-node ${node.id === selectedNodeId ? "selected" : ""}" x="${miniX(canvasNodeLeft(node))}" y="${miniY(canvasNodeTop(node))}" width="${miniNumber(width)}" height="${miniNumber(height)}" rx="1.5" />`;
    })
    .join("");

  return `
    <div class="minimap-title">Mapa</div>
    <svg viewBox="0 0 ${MINIMAP_WIDTH} ${MINIMAP_HEIGHT}" aria-hidden="true">
      <rect class="minimap-bg" x="0" y="0" width="${MINIMAP_WIDTH}" height="${MINIMAP_HEIGHT}" rx="6" />
      ${links}
      ${nodes}
      <rect class="minimap-viewport" id="minimapViewport" x="0" y="0" width="20" height="20" rx="2" />
    </svg>
  `;
}

function renderConnections(flow) {
  const links = flow.nodes
    .flatMap((node) =>
      connectionTargets(flow, node).map((connection) => {
      const { target, label } = connection;
      const start = nodeOutputPoint(node, connection);
      const end = nodeInputPoint(target);
      const startY = start.y;
      const endY = end.y;
      const path = connectionPath(start.x, startY, end.x, endY);
      const middleX = (start.x + end.x) / 2;
      const middleY = (startY + endY) / 2;
      const dataAttrs = connectionDataAttributes(node, connection);
      return `
        <g class="connection-link" ${dataAttrs}>
          <path class="connection-hit" d="${attr(path)}" />
          <path class="connection-line" d="${attr(path)}" marker-end="url(#connection-arrow)" />
          <text class="connection-label" x="${miniNumber(middleX)}" y="${miniNumber(middleY - 6)}">${escapeHtml(label || "")}</text>
          <foreignObject class="connection-delete-object" x="${miniNumber(middleX - 14)}" y="${miniNumber(middleY - 14)}" width="28" height="28">
            <button class="connection-delete-button" type="button" data-action="disconnect-connection" ${dataAttrs} title="Desconectar linha" aria-label="Desconectar linha">${icons.trash}</button>
          </foreignObject>
        </g>
      `;
      })
    )
    .join("");

  return `
    <defs>
      <marker id="connection-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse">
        <path class="connection-arrow-path" d="M0,0 L8,4 L0,8 Z" />
      </marker>
    </defs>
    ${links}
  `;
}

function connectionDataAttributes(source, connection) {
  return [
    ["data-source-id", source.id],
    ["data-output-field", connection.field || ""],
    ["data-output-kind", connection.kind || ""],
    ["data-output-option-id", connection.optionId || ""],
    ["data-output-block-id", connection.blockId || ""],
    ["data-output-variation-id", connection.variationId || ""]
  ]
    .map(([key, value]) => `${key}="${attr(value)}"`)
    .join(" ");
}

function connectionTargets(flow, node) {
  return outputRefs(node)
    .map((ref) => ({
      ...ref,
      target: flow.nodes.find((item) => item.id === ref.targetId)
    }))
    .filter((ref) => canAcceptIncomingConnection(ref.target));
}

function outputRefs(node) {
  if (!node) return [];
  normalizeNodeStructure(node);
  const refs = [];
  if (node.type === "condition") {
    if (node.yesNext) refs.push({ targetId: node.yesNext, label: "Sim", field: "yesNext" });
    if (node.noNext) refs.push({ targetId: node.noNext, label: "Não", field: "noNext" });
    return refs;
  }
  if (node.type === "link_click_wait") {
    if (node.clickedNext) refs.push({ targetId: node.clickedNext, label: "Clicou", field: "clickedNext" });
    if (node.noClickNext) refs.push({ targetId: node.noClickNext, label: "Nao clicou", field: "noClickNext" });
    return refs;
  }
  if (node.type === "randomizer") {
    return node.variations
      .filter((variation) => variation.next)
      .map((variation) => ({ targetId: variation.next, label: `${variation.label || "Variação"} ${variation.weight || 0}%`, variationId: variation.id }));
  }
  if (node.type === "message") {
    return messageOutputItems(node).filter((item) => item.targetId);
  }
  if (node.next) refs.push({ targetId: node.next, label: "", field: "next" });
  return refs;
}

function canAcceptIncomingConnection(node) {
  return Boolean(node && node.type !== "trigger" && node.type !== "comment");
}

function nextExecutableNode(flow, node, context = {}) {
  const targetId = nextExecutableTargetId(node, context);
  const next = targetId ? flow.nodes.find((item) => item.id === targetId) : null;
  return canAcceptIncomingConnection(next) ? next : null;
}

function nextExecutableTargetId(node, context = {}) {
  if (!node) return null;
  normalizeNodeStructure(node);
  if (node.type === "condition") return conditionMatchesNode(node, context) ? node.yesNext : node.noNext;
  if (node.type === "randomizer") return pickRandomVariation(node, context)?.next || null;
  if (node.type === "link_click_wait") return node.clickedNext || node.next || null;
  if (node.type === "jump") return null;
  if (node.type === "message") {
    const option = matchingMessageOption(node, context);
    return option?.next || node.next || null;
  }
  return node.next || null;
}

function matchingMessageOption(node, context = {}) {
  const input = normalize(context.inputText || context.normalizedText || "");
  if (!input) return null;
  const blockButtons = (node.contentBlocks || []).flatMap((block) => block.buttons || []);
  return [...(node.buttons || []), ...(node.quickReplies || []), ...blockButtons].find((option) => {
    return normalize(option.id) === input || normalize(option.title) === input;
  });
}

function conditionMatchesNode(node, context = {}) {
  normalizeNodeStructure(node);
  if (node.conditions?.length) {
    const results = node.conditions.map((condition) => conditionRuleMatches(condition, context));
    return node.conditionMatch === "any" ? results.some(Boolean) : results.every(Boolean);
  }

  const normalizedInput = normalize(context.inputText || context.normalizedText || "");
  const rawTerms = String(node.keyword || "")
    .split(",")
    .map((item) => normalizeTagKey(item))
    .filter(Boolean);
  const operator = node.conditionOperator || "contains_any";

  if (node.conditionType === "tag") {
    const tags = normalizeTags(context.contact?.tags || context.contact?.tag).map(normalizeTagKey);
    if (operator === "not_contains") return rawTerms.length ? rawTerms.every((term) => !tags.includes(term)) : false;
    return rawTerms.length ? rawTerms.some((term) => tags.includes(term)) : false;
  }

  if (node.conditionType === "field") {
    const value = normalize(contactCustomFieldValue(context.contact, node.fieldId, node.fieldName));
    const expected = normalize(node.fieldValue || node.keyword || "");
    if (operator === "not_contains") return expected ? !value.includes(expected) : !value;
    if (operator === "equals") return value === expected;
    return expected ? value.includes(expected) : Boolean(value);
  }

  if (!rawTerms.length) return true;
  if (operator === "contains_all") return rawTerms.every((term) => normalizedInput.includes(term));
  if (operator === "equals") return rawTerms.some((term) => normalizedInput === term);
  if (operator === "not_contains") return rawTerms.every((term) => !normalizedInput.includes(term));
  return rawTerms.some((term) => normalizedInput.includes(term));
}

function conditionRuleMatches(condition, context = {}) {
  const normalizedInput = normalize(context.inputText || context.normalizedText || "");
  const expected = condition.type === "tag" ? normalizeTagKey(condition.value) : normalize(String(condition.value || "").trim());
  if (condition.type === "tag") {
    const tags = normalizeTags(context.contact?.tags || context.contact?.tag).map(normalizeTagKey);
    if (!expected) return false;
    const hasTag = tags.includes(expected);
    return condition.operator === "not_contains" ? !hasTag : hasTag;
  }
  if (condition.type === "field") {
    const value = normalize(contactCustomFieldValue(context.contact, condition.fieldId, condition.fieldName));
    if (condition.operator === "equals") return value === expected;
    if (condition.operator === "not_contains") return expected ? !value.includes(expected) : !value;
    return expected ? value.includes(expected) : Boolean(value);
  }
  if (condition.type === "entry") {
    const value = normalize(context.entry?.[condition.fieldName] || "");
    if (condition.operator === "equals") return value === expected;
    if (condition.operator === "not_contains") return expected ? !value.includes(expected) : !value;
    return expected ? value.includes(expected) : Boolean(value);
  }
  const terms = String(condition.value || "")
    .split(",")
    .map((item) => normalize(item.trim()))
    .filter(Boolean);
  if (!terms.length) return true;
  if (condition.operator === "contains_all") return terms.every((term) => normalizedInput.includes(term));
  if (condition.operator === "equals") return terms.some((term) => normalizedInput === term);
  if (condition.operator === "not_contains") return terms.every((term) => !normalizedInput.includes(term));
  return terms.some((term) => normalizedInput.includes(term));
}

function contactCustomFieldValue(contact = {}, fieldId = "", fieldName = "") {
  const id = String(fieldId || "").trim();
  const name = String(fieldName || "").trim();
  if (id && contact?.customFieldsById && Object.prototype.hasOwnProperty.call(contact.customFieldsById, id)) {
    return contact.customFieldsById[id];
  }
  if (name && contact?.customFields && Object.prototype.hasOwnProperty.call(contact.customFields, name)) {
    return contact.customFields[name];
  }
  return name ? contact?.[name] ?? "" : "";
}

function pickRandomVariation(node, context = {}) {
  const variations = Array.isArray(node.variations) ? node.variations.filter((variation) => variation.next) : [];
  if (!variations.length) return null;
  const total = variations.reduce((sum, variation) => sum + Math.max(0, Number(variation.weight) || 0), 0) || variations.length;
  const seed = node.randomEveryTime ? Math.random() * total : seededNumber(`${context.contact?.psid || ""}:${node.id}`, total);
  let cursor = 0;
  for (const variation of variations) {
    cursor += Math.max(0, Number(variation.weight) || 0) || 1;
    if (seed <= cursor) return variation;
  }
  return variations[0];
}

function seededNumber(seed, max) {
  let hash = 0;
  const text = String(seed || "default");
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  }
  return hash % Math.max(1, max);
}

function pruneInvalidFlowConnections(flow) {
  if (!flow?.nodes?.length) return;
  let changed = false;
  flow.nodes.forEach((node) => {
    outputRefs(node).forEach((ref) => {
      const target = flow.nodes.find((item) => item.id === ref.targetId);
      if (canAcceptIncomingConnection(target)) return;
      replaceNodeReference(node, ref.targetId, null);
      changed = true;
    });
  });

  if (changed) {
    flow.updatedAt = new Date().toISOString();
    markCurrentFlowDraftChange();
    persistLocalState();
    if (!flowStore.loading) syncFlowToServer(flow);
  }
}

function connectionPath(x1, y1, x2, y2) {
  const mid = Math.max(60, Math.abs(x2 - x1) / 2);
  return `M ${x1} ${y1} C ${x1 + mid} ${y1}, ${x2 - mid} ${y2}, ${x2} ${y2}`;
}

function messageOutputItems(node) {
  normalizeNodeStructure(node);
  const hasTextBlock = node.contentBlocks.some((block) => block.type === "text");
  const items = [
    {
      targetId: node.next || null,
      label: "Depois da mensagem",
      field: "next",
      kind: "default"
    }
  ];

  if (hasTextBlock) {
    node.buttons.forEach((option) => {
      items.push({
        targetId: option.next || null,
        label: `Botao: ${option.title || "sem titulo"}`,
        kind: "button",
        optionId: option.id
      });
    });
  }

  node.quickReplies.forEach((option) => {
    items.push({
      targetId: option.next || null,
      label: `Resposta: ${option.title || "sem titulo"}`,
      kind: "quick_reply",
      optionId: option.id
    });
  });

  node.contentBlocks.forEach((block) => {
    block.buttons?.forEach((option) => {
      const prefix = block.type === "card" ? "Cartao" : "Imagem";
      items.push({
        targetId: option.next || null,
        label: `${prefix}: ${option.title || "sem titulo"}`,
        kind: "image_button",
        optionId: option.id,
        blockId: block.id
      });
    });
  });

  return items;
}

function messageOutputIndex(node, output = {}) {
  const ref = output || {};
  return Math.max(
    0,
    messageOutputItems(node).findIndex((item) => {
      if (ref.field === "next" || ref.kind === "default") return item.field === "next";
      if (ref.kind === "image_button") return item.kind === ref.kind && item.optionId === ref.optionId && item.blockId === ref.blockId;
      if (ref.kind === "button" || ref.kind === "quick_reply") return item.kind === ref.kind && item.optionId === ref.optionId;
      return false;
    })
  );
}

function messageOutputY(node, output = {}) {
  return MESSAGE_OUTPUT_START_Y + messageOutputIndex(node, output) * MESSAGE_OUTPUT_GAP_Y;
}

function nodeOutputPoint(node, output = {}) {
  const portPoint = nodePortDomPoint(node, output);
  if (portPoint) return portPoint;

  const outputY =
    node.type === "condition"
      ? conditionOutputY(output.field)
      : node.type === "message"
        ? messageOutputY(node, output)
        : node.type === "link_click_wait"
          ? linkClickOutputY(output.field)
          : NODE_CONNECT_Y;
  return {
    x: canvasNodeLeft(node) + canvasNodeWidth(node),
    y: canvasNodeTop(node) + outputY
  };
}

function nodePortDomPoint(node, output = {}) {
  if (renderingCanvasMarkup) return null;
  const canvas = document.querySelector("#flowCanvas");
  if (!canvas || !node?.id) return null;
  const ports = Array.from(canvas.querySelectorAll(".node-port")).filter((item) => item.dataset.portSource === node.id);
  const port = ports.find((item) => portMatchesOutput(item, output)) || (ports.length === 1 ? ports[0] : null);
  if (!port) return null;

  return stageElementPoint(port);
}

function portMatchesOutput(port, output = {}) {
  const field = output.field || "";
  const kind = output.kind || "";
  const optionId = output.optionId || "";
  const blockId = output.blockId || "";

  if (field && (port.dataset.portField || "") !== field) return false;
  if (kind && (port.dataset.portKind || "") !== kind) return false;
  if (optionId && (port.dataset.portOptionId || "") !== optionId) return false;
  if (blockId && (port.dataset.portBlockId || "") !== blockId) return false;

  if (!field && !kind && !optionId && !blockId) {
    return !(port.dataset.portField || port.dataset.portKind || port.dataset.portOptionId || port.dataset.portBlockId);
  }

  return true;
}

function conditionOutputY(field) {
  return field === "noNext" ? 124 : 72;
}

function linkClickOutputY(field) {
  return field === "noClickNext" ? 124 : 72;
}

function nodeInputPoint(node) {
  const canvas = document.querySelector("#flowCanvas");
  const element = canvas
    ? Array.from(canvas.querySelectorAll(".node")).find((item) => item.dataset.id === node?.id)
    : null;
  if (!renderingCanvasMarkup && canvas && element) {
    const stage = canvas.querySelector(".canvas-stage");
    const stageRect = stage?.getBoundingClientRect();
    const nodeRect = element.getBoundingClientRect();
    const zoom = canvasZoom || 1;
    if (stageRect) {
      return {
        x: (nodeRect.left - stageRect.left) / zoom,
        y: (nodeRect.top + NODE_INPUT_Y * zoom - stageRect.top) / zoom
      };
    }
  }
  return {
    x: canvasNodeLeft(node),
    y: canvasNodeTop(node) + NODE_INPUT_Y
  };
}

function stageElementPoint(element) {
  const canvas = document.querySelector("#flowCanvas");
  const stage = canvas?.querySelector(".canvas-stage");
  if (!stage || !element) return null;

  const stageRect = stage.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  const zoom = canvasZoom || 1;
  return {
    x: (elementRect.left + elementRect.width / 2 - stageRect.left) / zoom,
    y: (elementRect.top + elementRect.height / 2 - stageRect.top) / zoom
  };
}

function canvasNodeWidth(node) {
  if (node?.type === "message") return 300;
  if (node?.type === "trigger") return 370;
  return NODE_WIDTH;
}

function canvasPointFromEvent(event, canvas = document.querySelector("#flowCanvas")) {
  if (!canvas) return { x: 0, y: 0 };
  const rect = canvas.getBoundingClientRect();
  const zoom = canvasZoom || 1;
  return {
    x: (canvas.scrollLeft + event.clientX - rect.left) / zoom,
    y: (canvas.scrollTop + event.clientY - rect.top) / zoom
  };
}

function renderNode(node, selected) {
  if (node.type === "trigger") return renderTriggerNode(node, selected);
  if (node.type === "action") return renderActionNode(node, selected);
  if (node.type === "condition") return renderConditionNode(node, selected);
  if (node.type === "comment") return renderCommentNode(node, selected);
  if (node.type === "message") return renderMessageNode(node, selected);

  const flow = selectedFlow();
  const messageNumber = node.type === "message" ? messageNodeNumber(flow, node) : 0;
  const icon = icons[node.type] || icons.message;
  normalizeNodeStructure(node);
  const summary = nodeCardSummary(node);
  const outputRows = node.type === "message" ? renderMessageOutputPorts(node) : "";
  const quickReplies = node.quickReplies?.length ? `${node.quickReplies.length} respostas rápidas` : "Sem respostas rápidas";
  const title = nodeEditableTitle(flow, node, nodeLabels[node.type] || "Bloco");
  return `
    <article class="node ${node.type} ${selected ? "selected" : ""}" data-action="select-node" data-id="${node.id}" style="left:${canvasNodeLeft(node)}px; top:${canvasNodeTop(node)}px">
      ${messageNumber ? `<span class="node-sequence-badge">${messageNumber}</span>` : ""}
      ${renderNodeHoverActions(node)}
      <div class="node-head">
        <div class="node-title">
          ${icon}
          <span>
            <span class="node-type">${nodeLabels[node.type]}</span>
            <strong data-node-title="${attr(node.id)}">${escapeHtml(title)}</strong>
          </span>
        </div>
        <button class="node-action" type="button" data-action="select-node" data-id="${node.id}" title="Editar bloco">${icons.settings}</button>
      </div>
      <p>${escapeHtml(summary.body)}</p>
      ${summary.chips?.length ? renderNodeSummaryChips(summary.chips) : ""}
      ${outputRows}
      <div class="node-footer">
        <span>${escapeHtml(summary.footer)}</span>
        <span>${escapeHtml(summary.status)}</span>
      </div>
      ${node.type === "message" ? "" : node.type === "link_click_wait" ? renderLinkClickWaitOutputPorts(node) : node.type === "jump" ? "" : renderOutputPort(node)}
    </article>
  `;
}

function renderMessageNode(node, selected) {
  const flow = canvasDisplayFlow(selectedFlow());
  const viewingPublished = flowCanvasMode === "published";
  normalizeNodeStructure(node);
  const firstTextBlock = node.contentBlocks.find((block) => block.type === "text");
  const messageNumber = messageNodeNumber(flow, node);
  const defaultOutput = messageOutputItems(node).find((item) => item.field === "next");
  const contentPreview = node.contentBlocks.map((block) => renderMessengerPreviewContentBlock(node, block, { firstTextBlock })).join("");
  const title = nodeEditableTitle(flow, node, "Mensagem");
  return `
    <article class="node message messenger-preview-node ${selected ? "selected" : ""}" data-action="select-node" data-id="${node.id}" style="left:${canvasNodeLeft(node)}px; top:${canvasNodeTop(node)}px">
      ${messageNumber ? `<span class="node-sequence-badge">${messageNumber}</span>` : ""}
      ${renderNodeHoverActions(node)}
      <div class="messenger-preview-head">
        <span class="messenger-preview-icon">${icons.message}</span>
        <span>
          <small>Facebook</small>
          <strong data-node-title="${attr(node.id)}">${escapeHtml(title)}</strong>
        </span>
        ${viewingPublished ? "" : `<button class="node-action" type="button" data-action="select-node" data-id="${node.id}" title="Editar bloco">${icons.settings}</button>`}
      </div>
      ${viewingPublished ? renderPublishedMessageNodeMetrics(node) : ""}
      ${contentPreview}
      ${node.quickReplies.length ? `<div class="messenger-preview-quick-replies">${node.quickReplies.map((option) => renderMessengerPreviewQuickReply(node, option)).join("")}</div>` : ""}
      <div class="messenger-preview-next ${defaultOutput?.targetId ? "connected" : ""}">
        <span>Próximo Passo</span>
        ${renderMessageNodePort(node, defaultOutput)}
      </div>
    </article>
  `;
}

function renderMessengerPreviewContentBlock(node, block = {}, context = {}) {
  if (block.type === "text") {
    const text = String(block.text || "").trim();
    const textButtons = context.firstTextBlock?.id === block.id ? node.buttons : [];
    if (!text && !textButtons.length) return "";
    return `
      <div class="messenger-preview-bubble">
        ${text ? `<p>${escapeHtml(text)}</p>` : ""}
        ${textButtons.map((option) => renderMessengerPreviewButton(node, option)).join("")}
      </div>
    `;
  }

  if (block.type === "image") return renderMessengerPreviewImageBlock(node, block);
  if (block.type === "card") return renderMessengerPreviewCardBlock(node, block);
  if (block.type === "audio") return renderMessengerPreviewAudioBlock(block);

  const label = messageNodeContentChips({ ...node, contentBlocks: [block] }).join(" · ");
  return label ? `<div class="messenger-preview-meta">${escapeHtml(label)}</div>` : "";
}

function renderMessengerPreviewAudioBlock(block = {}) {
  const audioUrl = String(block.url || "").trim();
  return `
    <div class="messenger-preview-audio-card ${audioUrl ? "has-audio" : "empty"}">
      <span class="messenger-preview-audio-icon">${icons.send}</span>
      ${
        audioUrl
          ? `<audio src="${attr(audioUrl)}" controls preload="metadata"></audio>`
          : `<span>Áudio</span>`
      }
    </div>
  `;
}

function renderMessengerPreviewImageBlock(node, block = {}) {
  const imageUrl = String(block.url || "").trim();
  const buttons = Array.isArray(block.buttons) ? block.buttons : [];
  return `
    <div class="messenger-preview-image-card ${buttons.length ? "has-buttons" : ""}">
      <div class="messenger-preview-image ${imageUrl ? "has-image" : "empty"}">
        ${imageUrl ? `<img src="${attr(imageUrl)}" alt="${attr(block.title || "Imagem da mensagem")}" loading="lazy" draggable="false" />` : icons.image}
      </div>
      ${
        buttons.length
          ? `<div class="messenger-preview-image-buttons">${buttons.map((option) => renderMessengerPreviewImageButton(node, block, option)).join("")}</div>`
          : ""
      }
    </div>
  `;
}

function renderMessengerPreviewCardBlock(node, block = {}) {
  const imageUrl = String(block.url || "").trim();
  const buttons = Array.isArray(block.buttons) ? block.buttons : [];
  const aspect = normalizeCardImageAspectRatio(block.imageAspectRatio);
  return `
    <div class="messenger-preview-card-block aspect-${attr(aspect)} ${buttons.length ? "has-buttons" : ""}">
      <div class="messenger-preview-card-image ${imageUrl ? "has-image" : "empty"}">
        ${imageUrl ? `<img src="${attr(imageUrl)}" alt="${attr(block.title || "Imagem do cartao")}" loading="lazy" draggable="false" />` : icons.image}
      </div>
      <div class="messenger-preview-card-copy">
        <strong>${escapeHtml(block.title || "Inserir titulo...")}</strong>
        <span>${escapeHtml(block.subtitle || "Inserir Legenda...")}</span>
      </div>
      ${
        buttons.length
          ? `<div class="messenger-preview-image-buttons">${buttons.map((option) => renderMessengerPreviewImageButton(node, block, option)).join("")}</div>`
          : ""
      }
    </div>
  `;
}

function renderMessengerPreviewImageButton(node, block, option) {
  const output = messageOutputItems(node).find((item) => item.kind === "image_button" && item.blockId === block.id && item.optionId === option.id);
  return `
    <div class="messenger-preview-image-button ${output?.targetId ? "connected" : ""}">
      <span>${escapeHtml(option.title || "Novo botão")}</span>
      ${output ? renderMessageNodePort(node, output) : ""}
    </div>
  `;
}

function renderMessengerPreviewButton(node, option) {
  const output = messageOutputItems(node).find((item) => item.kind === "button" && item.optionId === option.id);
  const ctr = flowCanvasMode === "published" ? metricPercent(flowButtonMetricValue(node.id, option.id, "button_clicked").total, flowMetricValue(node.id, "node_sent").total) : null;
  return `
    <div class="messenger-preview-button ${output?.targetId ? "connected" : ""}">
      <span>${escapeHtml(option.title || "Novo botão")}</span>
      ${ctr == null ? "" : `<small>CTR ${ctr}%</small>`}
      ${output ? renderMessageNodePort(node, output) : ""}
    </div>
  `;
}

function renderPublishedMessageNodeMetrics(node) {
  const sent = flowMetricValue(node.id, "node_sent");
  const delivered = flowMetricValue(node.id, "node_delivered");
  const read = flowMetricValue(node.id, "node_read");
  const clicked = flowMetricValue(node.id, "node_clicked");
  const items = [
    ["Enviado", sent.total],
    ["Entregue", `${metricPercent(delivered.total, sent.total)}%`],
    ["Aberto", `${metricPercent(read.total, sent.total)}%`],
    ["Clicado", `${metricPercent(clicked.total, sent.total)}%`]
  ];
  return `
    <div class="published-node-metrics">
      ${items.map(([label, value]) => `<span><b>${escapeHtml(value)}</b><small>${escapeHtml(label)}</small></span>`).join("")}
    </div>
  `;
}

function renderMessengerPreviewAuxOutputs(node) {
  const outputs = messageOutputItems(node).filter((item) => item.kind === "image_button");
  if (!outputs.length) return "";
  return `
    <div class="messenger-preview-aux-outputs">
      ${outputs
        .map(
          (output) => `
            <div class="messenger-preview-aux-output ${output.targetId ? "connected" : ""}">
              <span>${escapeHtml(output.label)}</span>
              ${renderMessageNodePort(node, output)}
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderMessengerPreviewQuickReply(node, option) {
  const output = messageOutputItems(node).find((item) => item.kind === "quick_reply" && item.optionId === option.id);
  return `
    <div class="messenger-preview-quick-reply ${output?.targetId ? "connected" : ""}">
      <span>${escapeHtml(option.title || "Resposta rápida")}</span>
      ${output ? renderMessageNodePort(node, output) : ""}
    </div>
  `;
}

function renderMessageNodePort(node, item = {}) {
  return `
    <button
      class="node-port message-node-port ${item?.targetId ? "connected" : ""}"
      type="button"
      data-port-source="${attr(node.id)}"
      data-port-field="${attr(item?.field || "")}"
      data-port-kind="${attr(item?.kind || "")}"
      data-port-option-id="${attr(item?.optionId || "")}"
      data-port-block-id="${attr(item?.blockId || "")}"
      aria-label="${attr(`Conectar ${item?.label || "próximo passo"}`)}"
    ></button>
  `;
}

function messageNodeNumber(flow, node) {
  if (!flow || !node || node.type !== "message") return 0;
  const index = (flow.nodes || []).filter((item) => item.type === "message").findIndex((item) => item.id === node.id);
  return index >= 0 ? index + 1 : 0;
}

function conditionNodeLines(node) {
  normalizeNodeStructure(node);
  return node.conditions
    .slice(0, 2)
    .map((condition) => conditionNodeLine(condition))
    .filter(Boolean);
}

function conditionNodeLine(condition) {
  const value = String(condition.value || "").trim();
  if (condition.type === "tag") return value ? `Tag ${condition.operator === "not_contains" ? "não é" : "está"} ${value}` : "Tag não definida";
  if (condition.type === "field") {
    const label = condition.fieldName || "Campo";
    if (!value) return `${label} não definido`;
    if (condition.operator === "not_contains") return `${label} não contém ${value}`;
    return `${label} é ${value}`;
  }
  return value ? `Mensagem contém ${value}` : "Mensagem contém termo";
}

function nodeCardSummary(node) {
  const flow = selectedFlow() || { nodes: [] };
  if (node.type === "message") {
    const blockCount = node.contentBlocks?.length || 0;
    const blockChoices = (node.contentBlocks || []).reduce((sum, block) => sum + (block.buttons?.length || 0), 0);
    const choices = (node.buttons?.length || 0) + (node.quickReplies?.length || 0) + blockChoices;
    return {
      body: messageNodeSummaryText(node),
      chips: messageNodeContentChips(node),
      footer: `${blockCount} bloco${blockCount === 1 ? "" : "s"} · ${choices} opção${choices === 1 ? "" : "ões"}`,
      status: connectionTargets(flow, node).length ? "conectado" : "fim"
    };
  }
  if (node.type === "condition") {
    return {
      body: `${node.conditionType || "Regra"}: ${node.keyword || node.fieldName || "sem critério"}`,
      footer: "Saídas: Sim / Não",
      status: [node.yesNext, node.noNext].filter(Boolean).length ? "conectado" : "fim"
    };
  }
  if (node.type === "delay") {
    return {
      body: smartDelaySummary(node),
      footer: node.continueStart && node.continueEnd ? `${node.continueStart}-${node.continueEnd}` : "sem janela",
      status: node.next ? "conectado" : "fim"
    };
  }
  if (node.type === "user_input") {
    return {
      body: "Pausa o fluxo até o contato responder no Messenger.",
      footer: node.saveResponse && node.responseField ? `salva em ${node.responseField}` : "sem salvar campo",
      status: node.next ? "conectado" : "fim"
    };
  }
  if (node.type === "link_click_wait") {
    const branchCount = [node.clickedNext, node.noClickNext].filter(Boolean).length;
    return {
      body: "Pausa o fluxo ate o contato clicar no link do node anterior.",
      footer: node.timeoutMinutes ? `${node.timeoutMinutes} min limite` : "sem limite",
      status: branchCount ? `${branchCount} saida${branchCount === 1 ? "" : "s"}` : "fim"
    };
  }
  if (node.type === "jump") {
    const { flow: targetFlow, target } = jumpTargetSummary(node, flow);
    return {
      body: target ? `Continua em ${jumpTargetNodeLabel(target)}` : "Escolha o passo que deve continuar o fluxo.",
      footer: targetFlow ? targetFlow.name || "Fluxo sem nome" : "Sem fluxo escolhido",
      status: target ? "configurado" : "sem destino"
    };
  }
  if (node.type === "randomizer") {
    return {
      body: `${node.variations?.length || 0} variações configuradas`,
      footer: node.randomEveryTime ? "aleatório sempre" : "fixo por contato",
      status: connectionTargets(flow, node).length ? "conectado" : "fim"
    };
  }
  return {
    body: node.message || "",
    footer: node.next ? "Próximo passo" : "Sem próximo passo",
    status: node.next ? "conectado" : "fim"
  };
}

function renderNodeSummaryChips(chips = []) {
  return `
    <div class="node-summary-chips">
      ${chips.map((chip) => `<span>${escapeHtml(chip)}</span>`).join("")}
    </div>
  `;
}

function messageNodeSummaryText(node) {
  normalizeNodeStructure(node);
  const text = String(node.contentBlocks?.find((block) => block.type === "text" && block.text)?.text || node.message || "").trim();
  return text || "Mensagem do Messenger";
}

function messageNodeContentChips(node) {
  normalizeNodeStructure(node);
  const labels = {
    text: ["texto", "textos"],
    image: ["imagem", "imagens"],
    audio: ["áudio", "áudios"],
    video: ["vídeo", "vídeos"],
    file: ["arquivo", "arquivos"],
    card: ["card", "cards"],
    gallery: ["galeria", "galerias"],
    data_collection: ["coleta", "coletas"],
    dynamic: ["dinâmico", "dinâmicos"]
  };
  const counts = (node.contentBlocks || []).reduce((map, block) => {
    const type = messageBlockPreviewType(block);
    map[type] = (map[type] || 0) + 1;
    return map;
  }, {});

  return Object.entries(counts).map(([type, count]) => {
    const label = labels[type] || [type, `${type}s`];
    return `${count} ${count === 1 ? label[0] : label[1]}`;
  });
}

function messageBlockPreviewType(block = {}) {
  const type = String(block.type || "text");
  const url = String(block.url || "").toLowerCase();
  if (type === "file") {
    if (/\.(mp3|m4a|aac|wav|ogg|oga|opus|webm)(\?|#|$)/.test(url)) return "audio";
    if (/\.(mp4|mov|m4v|webm)(\?|#|$)/.test(url)) return "video";
    if (/\.(png|jpe?g|gif|webp|avif)(\?|#|$)/.test(url)) return "image";
  }
  if (["text", "image", "audio", "video", "file", "card", "gallery", "data_collection", "dynamic"].includes(type)) return type;
  return "file";
}

function messageBlockCountsSummary(blocks = []) {
  const labels = {
    text: "texto",
    image: "imagem",
    audio: "áudio",
    video: "vídeo",
    file: "arquivo",
    card: "card",
    gallery: "galeria",
    data_collection: "coleta",
    dynamic: "dinâmico"
  };
  const plurals = {
    text: "textos",
    image: "imagens",
    audio: "áudios",
    video: "vídeos",
    file: "arquivos",
    card: "cards",
    gallery: "galerias",
    data_collection: "coletas",
    dynamic: "dinâmicos"
  };
  const counts = blocks.reduce((map, block) => {
    const type = messageBlockPreviewType(block);
    map[type] = (map[type] || 0) + 1;
    return map;
  }, {});

  return Object.entries(counts)
    .filter(([type]) => type !== "text")
    .map(([type, count]) => `${count} ${count === 1 ? labels[type] || type : plurals[type] || `${type}s`}`)
    .join(" + ");
}

function renderConditionNode(node, selected) {
  const flow = canvasDisplayFlow(selectedFlow());
  normalizeNodeStructure(node);
  const conditionLines = conditionNodeLines(node);
  const hasBranchPorts = conditionLines.length || node.yesNext || node.noNext;
  const title = nodeEditableTitle(flow, node, "Condição");
  return `
    <article class="node condition condition-node ${selected ? "selected" : ""}" data-action="select-node" data-id="${node.id}" style="left:${canvasNodeLeft(node)}px; top:${canvasNodeTop(node)}px">
      ${renderNodeHoverActions(node)}
      <div class="condition-node-head">
        <span>${icons.condition}</span>
        <strong data-node-title="${attr(node.id)}">${escapeHtml(title)}</strong>
      </div>
      <div class="condition-node-body">
        ${
          conditionLines.length
            ? `<div class="condition-node-list">${conditionLines.map((line) => `<span>${escapeHtml(line)}</span>`).join("")}</div>`
            : `<div class="condition-node-empty">Clique para adicionar uma condição</div>`
        }
      </div>
      ${
        hasBranchPorts
          ? `<div class="condition-node-negative">O contato não corresponde a nenhuma dessas condições</div>${renderConditionOutputPorts(node)}`
          : renderOutputPort(node)
      }
    </article>
  `;
}

function renderCommentNode(node, selected) {
  const flow = canvasDisplayFlow(selectedFlow());
  const viewingPublished = flowCanvasMode === "published";
  const title = nodeEditableTitle(flow, node, "Comentário");
  return `
    <article class="node comment ${viewingPublished ? "published-comment-node" : ""} ${selected ? "selected" : ""}" data-action="select-node" data-id="${node.id}" style="left:${canvasNodeLeft(node)}px; top:${canvasNodeTop(node)}px">
      ${
        viewingPublished
          ? ""
          : `
            ${renderNodeHoverActions(node)}
            <div class="node-head">
              <div class="node-title">
                ${icons.comment}
                <span>
                  <span class="node-type">Comentário</span>
                  <strong data-node-title="${attr(node.id)}">${escapeHtml(title)}</strong>
                </span>
              </div>
            </div>
          `
      }
      <div class="comment-markdown">${renderCommentMarkdown(node.message || "Anotação interna do fluxo.")}</div>
    </article>
  `;
}

function renderCommentMarkdown(value) {
  const lines = String(value || "").replaceAll("\r\n", "\n").split("\n");
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (/^```/.test(line.trim())) {
      const code = [];
      index += 1;
      while (index < lines.length && !/^```/.test(lines[index].trim())) {
        code.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) index += 1;
      blocks.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      blocks.push(`<h${level}>${renderCommentInlineMarkdown(heading[2])}</h${level}>`);
      index += 1;
      continue;
    }

    if (/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      blocks.push("<hr />");
      index += 1;
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      const quote = [];
      while (index < lines.length && /^\s*>\s?/.test(lines[index])) {
        quote.push(lines[index].replace(/^\s*>\s?/, ""));
        index += 1;
      }
      blocks.push(`<blockquote>${quote.map(renderCommentInlineMarkdown).join("<br />")}</blockquote>`);
      continue;
    }

    const listMatch = line.match(/^\s*(?:([-+*])|(\d+)\.)\s+(.+)$/);
    if (listMatch) {
      const ordered = Boolean(listMatch[2]);
      const items = [];
      while (index < lines.length) {
        const item = lines[index].match(/^\s*(?:([-+*])|(\d+)\.)\s+(.+)$/);
        if (!item || Boolean(item[2]) !== ordered) break;
        items.push(`<li>${renderCommentInlineMarkdown(item[3])}</li>`);
        index += 1;
      }
      blocks.push(`<${ordered ? "ol" : "ul"}>${items.join("")}</${ordered ? "ol" : "ul"}>`);
      continue;
    }

    const paragraph = [];
    while (index < lines.length && lines[index].trim() && !commentMarkdownStartsBlock(lines[index])) {
      paragraph.push(lines[index]);
      index += 1;
    }
    if (!paragraph.length) {
      paragraph.push(line);
      index += 1;
    }
    blocks.push(`<p>${paragraph.map(renderCommentInlineMarkdown).join("<br />")}</p>`);
  }

  return blocks.join("");
}

function commentMarkdownStartsBlock(line) {
  return (
    /^```/.test(line.trim()) ||
    /^(#{1,4})\s+/.test(line) ||
    /^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(line) ||
    /^\s*>\s?/.test(line) ||
    /^\s*(?:[-+*]|\d+\.)\s+/.test(line)
  );
}

function renderCommentInlineMarkdown(value, allowLinks = true) {
  const tokens = [];
  const keep = (markup) => {
    const key = `\uE000${tokens.length}\uE001`;
    tokens.push([key, markup]);
    return key;
  };

  let text = String(value || "").replace(/`([^`\n]+)`/g, (_, code) => keep(`<code>${escapeHtml(code)}</code>`));
  if (allowLinks) {
    text = text.replace(/\[([^\]\n]+)\]\(([^)\s]+)\)/g, (match, label, url) => {
      if (!isSafeCommentMarkdownUrl(url)) return match;
      return keep(`<a href="${attr(url)}" target="_blank" rel="noopener noreferrer">${renderCommentInlineMarkdown(label, false)}</a>`);
    });
  }

  let markup = escapeHtml(text)
    .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
    .replace(/~~([^~\n]+)~~/g, "<s>$1</s>")
    .replace(/\*([^*\n]+)\*/g, "<em>$1</em>");

  tokens.forEach(([key, token]) => {
    markup = markup.replaceAll(key, token);
  });
  return markup;
}

function isSafeCommentMarkdownUrl(value) {
  return /^(?:https?:\/\/|mailto:)/i.test(String(value || "").trim());
}

function renderActionNode(node, selected) {
  const flow = canvasDisplayFlow(selectedFlow());
  const steps = nodeActionSteps(node);
  const title = nodeEditableTitle(flow, node, "Ações");
  return `
    <article class="node action action-node ${selected ? "selected" : ""}" data-action="select-node" data-id="${node.id}" style="left:${canvasNodeLeft(node)}px; top:${canvasNodeTop(node)}px">
      ${renderNodeHoverActions(node)}
      <div class="action-node-head">
        <span>${icons.action}</span>
        <strong data-node-title="${attr(node.id)}">${escapeHtml(title)}</strong>
      </div>
      <div class="action-node-body">
        ${
          steps.length
            ? `<div class="action-node-list">${steps.slice(0, 3).map(renderActionNodeStep).join("")}</div>`
            : `<div class="action-node-empty">Clique para adicionar uma</div>`
        }
      </div>
      <div class="node-footer">
        <span>Próximo Passo</span>
      </div>
      ${renderOutputPort(node)}
    </article>
  `;
}

function actionNodeNumber(node) {
  const flow = canvasDisplayFlow(selectedFlow());
  return nodeIndexByType(flow, node, "action");
}

function renderActionNodeStep(step) {
  if (step.type === "set_user_field") {
    const field = findCustomFieldForPage(step.fieldId || step.fieldName);
    const fieldName = String(field?.name || step.fieldName || "").trim();
    return `
      <span class="action-node-step">
        <span>Definir campo do usuário</span>
        <strong>${escapeHtml(fieldName || "Campo desconhecido")}</strong>
        ${fieldName ? (step.fieldValue !== "" ? `<em>${escapeHtml(formatCustomFieldValue(step.fieldValue))}</em>` : "") : `<em>(undefined)</em>`}
      </span>
    `;
  }

  return `<span class="action-node-step"><strong>${escapeHtml(actionStepSummary(step))}</strong></span>`;
}

function renderTriggerNode(node, selected) {
  const flow = canvasDisplayFlow(selectedFlow());
  const activeTriggers = nodeTriggerEvents(node);
  const triggerItems = activeTriggers
    .map((id, index) => ({ id, option: triggerOptionById(id), index }))
    .filter((item) => item.option);
  const title = nodeEditableTitle(flow, node, "Quando...");

  return `
    <article class="node trigger trigger-start ${selected ? "selected" : ""}" data-action="select-node" data-id="${node.id}" style="left:${canvasNodeLeft(node)}px; top:${canvasNodeTop(node)}px">
      ${renderNodeHoverActions(node)}
      <div class="node-head">
        <div class="node-title">
          ${icons.trigger}
          <span>
            <strong data-node-title="${attr(node.id)}">${escapeHtml(title)}</strong>
          </span>
        </div>
      </div>
      <div class="trigger-list">
        ${
          triggerItems.length
            ? triggerItems.map((item) => renderTriggerNodeItem(item)).join("")
            : `<span>Nenhum gatilho configurado</span>`
        }
      </div>
      <button class="trigger-add-button" type="button" data-action="open-trigger-picker" data-id="${node.id}">+ Novo Gatilho</button>
      <div class="node-footer">
        <span>Então</span>
      </div>
      ${renderOutputPort(node)}
    </article>
  `;
}

function renderTriggerNodeItem(item) {
  return `
    <div class="trigger-node-item" title="${attr(item.option.title)}">
      <span class="trigger-node-item-icon">${icons.message}</span>
      <span>
        <strong>${escapeHtml(item.option.title)}</strong>
        <small>${escapeHtml(item.option.source || "Messenger")} #${item.index + 1}</small>
      </span>
    </div>
  `;
}

function nodeAddButton(type, label) {
  return `<button class="chip-button" type="button" data-action="add-node" data-type="${type}" title="${attr(label)}">${icons[type]}<span>${label}</span></button>`;
}

function renderMessageOutputPorts(node) {
  const items = messageOutputItems(node);
  return `
    <div class="message-node-outputs" aria-label="Saidas da mensagem">
      ${items
        .map(
          (item) => `
            <div class="message-node-output-row ${item.targetId ? "connected" : ""}">
              <span>${escapeHtml(item.label)}</span>
              <button
                class="node-port message-node-port ${item.targetId ? "connected" : ""}"
                type="button"
                data-port-source="${attr(node.id)}"
                data-port-field="${attr(item.field || "")}"
                data-port-kind="${attr(item.kind || "")}"
                data-port-option-id="${attr(item.optionId || "")}"
                data-port-block-id="${attr(item.blockId || "")}"
                aria-label="${attr(`Conectar ${item.label}`)}"
              ></button>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderOutputPort(node) {
  if (node.type === "comment") return "";
  const connected = node.type === "randomizer" ? node.variations?.some((variation) => variation.next) : node.next;
  return `<button class="node-port ${connected ? "connected" : ""}" type="button" data-port-source="${attr(node.id)}" data-port-field="next" aria-label="Conectar próximo passo"></button>`;
}

function renderConditionOutputPorts(node) {
  return `
    <button class="node-port condition-node-port yes ${node.yesNext ? "connected" : ""}" type="button" data-port-source="${attr(node.id)}" data-port-field="yesNext" aria-label="Conectar quando corresponde"></button>
    <button class="node-port condition-node-port no ${node.noNext ? "connected" : ""}" type="button" data-port-source="${attr(node.id)}" data-port-field="noNext" aria-label="Conectar quando não corresponde"></button>
  `;
}

function renderLinkClickWaitOutputPorts(node) {
  return `
    <button class="node-port link-click-node-port yes ${node.clickedNext ? "connected" : ""}" type="button" data-port-source="${attr(node.id)}" data-port-field="clickedNext" aria-label="Conectar quando clicou"></button>
    <button class="node-port link-click-node-port no ${node.noClickNext ? "connected" : ""}" type="button" data-port-source="${attr(node.id)}" data-port-field="noClickNext" aria-label="Conectar quando nao clicou"></button>
  `;
}

function renderNodeHoverActions(node) {
  if (flowCanvasMode === "published") return "";
  if (isLockedTriggerNode(node)) return "";
  return `
    <div class="node-hover-actions" aria-label="Ações do bloco">
      <button type="button" data-action="duplicate-node" data-id="${attr(node.id)}" title="Duplicar bloco">${icons.copy}</button>
      <button class="danger" type="button" data-action="delete-node-by-id" data-id="${attr(node.id)}" title="Excluir bloco">${icons.trash}</button>
    </div>
  `;
}

function nodeActionSteps(node) {
  if (!node) return [];
  if (!Array.isArray(node.actions)) {
    node.actions = [];
  }
  if (node.tag && !node.actions.some((step) => step.type === "add_tag" && step.tag === node.tag)) {
    node.actions.unshift({ id: makeId("act"), type: "add_tag", tag: node.tag });
    node.tag = "";
  }
  node.actions.forEach((step) => {
    if (!step.id) step.id = makeId("act");
    if (step.type === "set_user_field" || step.type === "clear_custom_field") {
      const field = findCustomFieldForPage(step.fieldId || step.fieldName);
      step.fieldId = field?.id || String(step.fieldId || "");
      if (field) {
        step.fieldName = field.name;
        step.fieldType = field.type;
      }
    }
  });
  return node.actions;
}

function actionStepLabel(step) {
  const option = actionOptions.find((item) => item.id === step.type);
  return option?.title || "Ação";
}

function actionStepSummary(step) {
  if (step.type === "add_tag") return step.tag ? `Adicionar Tag: ${step.tag}` : "Adicionar Tag";
  if (step.type === "remove_tag") return step.tag ? `Remover Tag: ${step.tag}` : "Remover Tag";
  if (step.type === "set_user_field") {
    const field = findCustomFieldForPage(step.fieldId || step.fieldName);
    const fieldName = field?.name || step.fieldName;
    return fieldName ? `Definir ${fieldName}: ${formatCustomFieldValue(step.fieldValue) || "valor"}` : "Definir campo";
  }
  if (step.type === "clear_custom_field") {
    const field = findCustomFieldForPage(step.fieldId || step.fieldName);
    const fieldName = field?.name || step.fieldName;
    return fieldName ? `Limpar campo: ${fieldName}` : "Limpar campo";
  }
  if (step.type === "delete_contact") return "Excluir contato";
  if (step.type === "open_inbox") return "Abrir conversa";
  return actionStepLabel(step);
}

function summarizeActionSteps(node) {
  const steps = nodeActionSteps(node).map(actionStepSummary);
  return steps.length ? steps.join(", ") : "Clique para adicionar uma ação.";
}

function nodeTriggerEvents(node) {
  if (Array.isArray(node.triggerEvents) && node.triggerEvents.length) return node.triggerEvents;
  if (node.triggerKind) return [node.triggerKind];
  if (String(node.keyword || "").toLowerCase().includes("qr")) return ["qr_code"];
  return ["messenger_message"];
}

function triggerOptionById(id) {
  return triggerOptions.find((option) => option.id === id) || null;
}

function summarizeTriggerEvents(node) {
  return nodeTriggerEvents(node)
    .map((id) => triggerOptionById(id)?.title)
    .filter(Boolean)
    .join(", ");
}

function canvasNodeLeft(node) {
  return node.x + CANVAS_ORIGIN_X;
}

function canvasNodeTop(node) {
  return node.y + CANVAS_ORIGIN_Y;
}

function clampNodeX(value) {
  return Math.max(CANVAS_MIN_X, Math.min(CANVAS_MAX_X, value));
}

function clampNodeY(value) {
  return Math.max(CANVAS_MIN_Y, Math.min(CANVAS_MAX_Y, value));
}

function miniX(stageX) {
  return miniNumber((stageX / CANVAS_WIDTH) * MINIMAP_WIDTH);
}

function miniY(stageY) {
  return miniNumber((stageY / CANVAS_HEIGHT) * MINIMAP_HEIGHT);
}

function miniNumber(value) {
  return Number(value).toFixed(2);
}

function selectedFlow() {
  return state.flows.find((flow) => flow.id === selectedFlowId) || state.flows[0];
}

function selectedNode(flow) {
  return flow?.nodes.find((node) => node.id === selectedNodeId) || flow?.nodes[0];
}

function selectedContact() {
  const pageContacts = contactsForPage(currentFlowPageId());
  return pageContacts.find((contact) => contact.id === selectedContactId) || pageContacts[0];
}

function renderMetaConversationMessages(messages, pageId, pixelEvents = [], attributionEvents = [], unreadAnchorId = "") {
  const visibleMessages = messages.filter((message) => !isMetaDefaultGreetingMessage(message, pageId));
  const normalizedPixelEvents = conversationPixelTimelineEvents(pixelEvents);
  const timeline = [
    ...visibleMessages.map((message) => ({ kind: "message", at: messageTimeValue(message), message })),
    ...normalizedPixelEvents.map((event) => ({ kind: "pixel", at: event.createdAt || "", event })),
    ...attributionEvents.map((event) => ({ kind: "attribution", at: event.createdAt || "", event }))
  ].sort((left, right) => Date.parse(left.at || "") - Date.parse(right.at || ""));

  return timeline
    .map((item, index) => {
      if (item.kind === "pixel") {
        return renderPixelConversationBubble(item.event, shouldShowBubbleTime(item, timeline[index - 1]));
      }
      if (item.kind === "attribution") {
        return renderAttributionConversationBubble(item.event);
      }

      const message = item.message;
      const direction = message.from?.id === pageId ? "outbound" : "inbound";
      const marker = unreadAnchorId && messageAnchorId(message) === unreadAnchorId
        ? `<div class="unread-divider" data-unread-anchor>Mensagens novas</div>`
        : "";
      return `${marker}${renderConversationBubble({
        direction,
        content: renderMessageContent(message),
        sender: message.from?.name || "",
        time: messageTimeValue(message),
        showTime: shouldShowBubbleTime(item, timeline[index - 1])
      })}`;
    })
    .join("");
}

function renderAttributionConversationBubble(event = {}) {
  const meta = [
    event.sourceKey ? `Chave ${event.sourceKey}` : "",
    event.referralLocation ? `Recebido em ${event.referralLocation}` : ""
  ].filter(Boolean);
  return renderConversationBubble({
    direction: "system attribution-event",
    content: `
      <div class="pixel-chat-event attribution-chat-event">
        ${icons.trigger}
        <div>
          <strong>Entrou pelo anuncio</strong>
          ${event.adTitle ? `<span>${escapeHtml(event.adTitle)}</span>` : ""}
          <span>Ad ID: ${escapeHtml(event.adId || "nao informado pela Meta")}</span>
          ${meta.length ? `<span class="pixel-chat-event-meta">${meta.map((item) => `<small>${escapeHtml(item)}</small>`).join("")}</span>` : ""}
        </div>
      </div>
    `,
    time: event.createdAt || "",
    showTime: true
  });
}

function displayConversationSnippet(conversation = {}) {
  const snippet = String(conversation.snippet || "").trim();
  return isMetaDefaultGreetingText(snippet) ? "Saudacao padrao da Meta ocultada" : snippet || "Sem previa";
}

function isMetaDefaultGreetingMessage(message = {}, pageId = "") {
  if (String(message.from?.id || "") !== String(pageId || "")) return false;
  return isMetaDefaultGreetingText(message.message);
}

function isMetaDefaultGreetingText(value) {
  const normalizedText = normalize(value)
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = normalizedText.split(" ").filter(Boolean);
  if (words[0] !== "hola") return false;
  if (words.length < 5 || words.length > 8) return false;
  return normalizedText.endsWith(" como podemos ayudarte") || normalizedText.endsWith(" en que podemos ayudarte");
}

function conversationPixelTimelineEvents(events = []) {
  const visibleEvents = events.filter((event) => event.eventType !== "site_heartbeat");
  if (visibleEvents.some((event) => ["site_active", "site_inactive"].includes(event.eventType))) {
    return collapseConversationPixelEvents(visibleEvents);
  }

  const presenceEvents = events
    .filter((event) => event.contactPsid && ["page_view", "link_click", "element_click", "form_submit", "site_heartbeat", "site_exit"].includes(event.eventType))
    .sort((left, right) => Date.parse(right.createdAt || "") - Date.parse(left.createdAt || ""));

  const latest = presenceEvents[0];
  if (!latest || latest.eventType === "site_exit") return collapseConversationPixelEvents(visibleEvents);

  const latestTime = Date.parse(latest.createdAt || "");
  if (!Number.isFinite(latestTime)) return collapseConversationPixelEvents(visibleEvents);

  const age = Date.now() - latestTime;
  const syntheticType = age > PIXEL_HEARTBEAT_STALE_MS ? "site_inactive" : "site_active";
  const syntheticTime = syntheticType === "site_inactive" ? new Date(latestTime + PIXEL_HEARTBEAT_STALE_MS).toISOString() : latest.createdAt;

  return collapseConversationPixelEvents([
    ...visibleEvents,
    {
      ...latest,
      id: `${latest.id || latest.sessionId || "pixel"}_${syntheticType}`,
      eventType: syntheticType,
      eventName: syntheticType,
      createdAt: syntheticTime
    }
  ]);
}

function collapseConversationPixelEvents(events = []) {
  const grouped = new Map();
  const passthrough = [];

  events.forEach((event) => {
    const key = pixelConversationGroupKey(event);
    if (!key) {
      passthrough.push(event);
      return;
    }
    const group = grouped.get(key) || [];
    group.push(event);
    grouped.set(key, group);
  });

  const collapsed = [...grouped.values()].map(mergePixelConversationGroup);
  return [...passthrough, ...collapsed].sort((left, right) => Date.parse(left.createdAt || "") - Date.parse(right.createdAt || ""));
}

function pixelConversationGroupKey(event) {
  const type = String(event?.eventType || "");
  if (!["page_view", "link_click", "site_active", "site_inactive", "site_exit"].includes(type)) return "";
  const destination = pixelConversationDestinationKey(event);
  if (!destination) return "";
  return [event.pageId || "", event.contactPsid || event.visitorId || "", destination].join(":");
}

function mergePixelConversationGroup(events = []) {
  const sorted = [...events].sort((left, right) => Date.parse(left.createdAt || "") - Date.parse(right.createdAt || ""));
  const representative = pixelConversationRepresentative(sorted);
  const destination = pixelConversationDestinationKey(representative);
  return {
    ...representative,
    data: {
      ...(representative.data || {}),
      groupedDomain: destination,
      groupedSuppressedCount: Math.max(0, sorted.length - 1)
    }
  };
}

function pixelConversationRepresentative(events = []) {
  return [...events]
    .sort((left, right) => {
      const priorityDiff = pixelConversationEventPriority(right) - pixelConversationEventPriority(left);
      if (priorityDiff) return priorityDiff;
      return Date.parse(right.createdAt || "") - Date.parse(left.createdAt || "");
    })[0] || {};
}

function pixelConversationEventPriority(event) {
  const type = String(event?.eventType || "");
  if (type === "messenger_button_click") return 60;
  if (type === "link_click") return 50;
  if (type === "page_view") return 40;
  if (type === "site_exit") return 30;
  if (type === "site_inactive") return 20;
  if (type === "site_active") return 10;
  return 0;
}

function pixelConversationDestinationKey(event) {
  return pixelUrlHostname(event?.targetUrl) || pixelUrlHostname(event?.url) || normalizePixelDestination(event?.siteId) || normalizePixelDestination(event?.path);
}

function pixelUrlHostname(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  try {
    const base = location.origin && location.origin !== "null" ? location.origin : "https://messenlead.local";
    const url = new URL(raw, base);
    return normalizePixelDestination(url.hostname);
  } catch {
    return "";
  }
}

function normalizePixelDestination(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^www\./, "")
    .replace(/\?.*$/, "")
    .replace(/#.*$/, "");
}

function renderLocalConversationMessages(messages = []) {
  return messages
    .map((message, index) =>
      renderConversationBubble({
        direction: message.from === "contact" ? "inbound" : "outbound",
        content: escapeHtml(message.text || ""),
        time: messageTimeValue(message),
        showTime: shouldShowBubbleTime(message, messages[index - 1])
      })
    )
    .join("");
}

function renderConversationBubble({ direction, content, sender = "", time = "", showTime = false }) {
  const footerParts = [];
  if (sender) footerParts.push(`<span>${escapeHtml(sender)}</span>`);
  if (showTime && time) footerParts.push(`<time datetime="${attr(time)}">${escapeHtml(formatBubbleTime(time))}</time>`);

  return `
    <div class="bubble ${direction}">
      ${content}
      ${footerParts.length ? `<span class="bubble-meta">${footerParts.join("")}</span>` : ""}
    </div>
  `;
}

function renderPixelConversationBubble(event) {
  return renderConversationBubble({
    direction: "system pixel-event",
    content: renderPixelConversationContent(event),
    time: event.createdAt || "",
    showTime: true
  });
}

function renderPixelConversationContent(event) {
  const title = pixelConversationTitle(event);
  const detail = event.targetUrl || event.url || event.path || "";
  const meta = pixelConversationMeta(event);
  return `
    <div class="pixel-chat-event">
      ${icons.pixel}
      <div>
        <strong>${escapeHtml(title)}</strong>
        ${detail ? renderPixelConversationDetail(detail) : ""}
        ${meta.length ? `<span class="pixel-chat-event-meta">${meta.map((item) => `<small>${escapeHtml(item)}</small>`).join("")}</span>` : ""}
      </div>
    </div>
  `;
}

function renderPixelConversationDetail(detail) {
  const value = String(detail || "").trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) {
    return `<a class="pixel-chat-event-url" href="${attr(value)}" target="_blank" rel="noopener noreferrer">${escapeHtml(value)}</a>`;
  }
  return `<span class="pixel-chat-event-url">${escapeHtml(value)}</span>`;
}

function pixelConversationMeta(event) {
  const data = event?.data || {};
  const meta = [];
  const nodeNumber = String(data.contactNodeNumber || "").trim();
  const button = String(data.contactButton || event.targetText || "").trim();
  const pageViews = Number(data.contactPageViews || 0);
  const groupedDomain = String(data.groupedDomain || "").trim();
  if (button && event.eventType !== "messenger_button_click") meta.push(button);
  if (nodeNumber) meta.push(`Node ${nodeNumber}`);
  if (pageViews > 0) meta.push(`${pageViews} pagina${pageViews === 1 ? "" : "s"} vista${pageViews === 1 ? "" : "s"}`);
  if (groupedDomain && !meta.includes(groupedDomain)) meta.push(groupedDomain);
  return meta;
}

function pixelConversationTitle(event) {
  if (event.eventType === "messenger_button_click") return `Clicou no botao${event.targetText ? `: ${event.targetText}` : ""}`;
  if (event.eventType === "link_click") return "Clicou no link";
  if (event.eventType === "element_click") return `Clicou em: ${event.targetText || event.eventName || "elemento"}`;
  if (event.eventType === "form_submit") return "Enviou um formulario no site";
  if (event.eventType === "page_view") return "Entrou no site";
  if (event.eventType === "site_active") return "Ativo no site";
  if (event.eventType === "site_exit") return "Saiu do site";
  if (event.eventType === "site_inactive") return "Sessao inativa";
  if (event.eventType === "site_heartbeat") return "Ativo no site";
  if (event.eventType === "identify") return "Foi identificado no site";
  return `Evento no site: ${event.eventName || pixelEventLabel(event.eventType)}`;
}

function shouldShowBubbleTime(message, previousMessage) {
  const currentKey = messageHourKey(messageTimeValue(message));
  if (!currentKey) return false;
  return currentKey !== messageHourKey(messageTimeValue(previousMessage));
}

function messageTimeValue(message) {
  return message?.created_time || message?.at || message?.timestamp || "";
}

function messageAnchorId(message = {}) {
  return String(message.id || message.mid || `${messageTimeValue(message)}:${message.from?.id || ""}`).replace(/[^a-zA-Z0-9_-]+/g, "_");
}

function messageHourKey(value) {
  const timestamp = Date.parse(value || "");
  if (!Number.isFinite(timestamp)) return "";
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
}

function formatBubbleTime(value) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(value));
  } catch {
    return "";
  }
}

function renderMessageContent(message) {
  const text = message.message ? `<div>${escapeHtml(message.message)}</div>` : "";
  const attachments = normalizeMessageAttachments(message).map(renderAttachment).join("");

  return text || attachments ? `${text}${attachments}` : `<span class="muted">[anexo ou evento sem texto]</span>`;
}

function normalizeMessageAttachments(message) {
  const attachments = [];
  if (Array.isArray(message.attachments)) attachments.push(...message.attachments);
  if (Array.isArray(message.attachments?.data)) attachments.push(...message.attachments.data);

  const sticker = normalizeStickerAttachment(message);
  if (sticker) attachments.push(sticker);

  return attachments;
}

function normalizeStickerAttachment(message) {
  const sticker = message?.sticker;
  if (!sticker && !message?.sticker_id) return null;

  if (typeof sticker === "string") {
    return { type: "sticker", url: sticker, title: "Sticker recebido" };
  }

  return {
    type: "sticker",
    title: "Sticker recebido",
    url: sticker?.url || sticker?.image_url || sticker?.uri || "",
    image_data: sticker?.image_data || null,
    sticker_id: message.sticker_id || sticker?.id || ""
  };
}

function renderAttachment(attachment) {
  const mimeType = String(attachment.mime_type || attachment.mime || "").toLowerCase();
  const attachmentType = String(attachment.type || "").toLowerCase();
  const audioUrl = attachment.audio_data?.url || attachment.audio_data?.preview_url || "";
  const imageUrl = attachment.image_data?.url || attachment.image_data?.preview_url || "";
  const stickerUrl = attachment.sticker_data?.url || attachment.sticker_data?.preview_url || attachment.payload?.sticker_url || attachment.payload?.url || "";
  const videoUrl = attachment.video_data?.url || attachment.video_data?.preview_url || "";
  const fileUrl = attachment.file_url || attachment.url || audioUrl || imageUrl || stickerUrl || videoUrl || "";
  const fileName = attachment.name || attachment.title || "Anexo recebido";
  const lowerUrl = fileUrl.split("?")[0].toLowerCase();

  if (attachmentType === "sticker" || attachment.sticker_id || stickerUrl) {
    if (!fileUrl) {
      return `<div class="message-attachment message-sticker-placeholder">Sticker recebido</div>`;
    }
    return `
      <a class="message-attachment message-sticker" href="${attr(fileUrl)}" target="_blank" rel="noopener">
        <img src="${attr(fileUrl)}" alt="${attr(fileName === "Anexo recebido" ? "Sticker recebido" : fileName)}" loading="lazy" />
      </a>
    `;
  }

  if (!fileUrl) {
    return `<div class="message-attachment">${escapeHtml(fileName)}</div>`;
  }

  if (isAudioAttachment(mimeType, attachmentType, lowerUrl)) {
    return `
      <div class="message-attachment message-audio">
        <span>${escapeHtml(fileName === "Anexo recebido" ? "Audio recebido" : fileName)}</span>
        <audio controls preload="metadata" src="${attr(fileUrl)}"></audio>
      </div>
    `;
  }

  if (mimeType.startsWith("image/") || attachmentType === "image" || imageUrl) {
    return `
      <a class="message-attachment message-image" href="${attr(fileUrl)}" target="_blank" rel="noopener">
        <img src="${attr(fileUrl)}" alt="${attr(fileName)}" loading="lazy" />
      </a>
    `;
  }

  if (mimeType.startsWith("video/") || attachmentType === "video" || videoUrl) {
    return `
      <div class="message-attachment message-video">
        <video controls preload="metadata" src="${attr(fileUrl)}"></video>
      </div>
    `;
  }

  return `
    <a class="message-attachment message-file" href="${attr(fileUrl)}" target="_blank" rel="noopener">
      ${escapeHtml(fileName)}
    </a>
  `;
}

function isAudioAttachment(mimeType, attachmentType, lowerUrl) {
  return (
    mimeType.startsWith("audio/") ||
    attachmentType === "audio" ||
    /\.(aac|m4a|mp3|oga|ogg|opus|wav|webm)$/.test(lowerUrl)
  );
}

function normalizeFieldValue(fieldName, value) {
  if (fieldName === "quickReplies") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 8);
  }
  if (fieldName === "delayMinutes") return Math.max(0, Number(value) || 0);
  if (fieldName === "delayValue") return Math.max(0, Number(value) || 0);
  if (fieldName === "delayUnit") return normalizeDelayUnit(value);
  if (fieldName === "timeoutMinutes") return Math.max(0, Number(value) || 0);
  if (fieldName === "next") return value || null;
  return value;
}

function normalizeDelayUnit(unit) {
  const normalized = String(unit || "minutes").trim();
  return ["seconds", "minutes", "hours", "days"].includes(normalized) ? normalized : "minutes";
}

function delayUnitLabel(unit) {
  const normalized = normalizeDelayUnit(unit);
  if (normalized === "seconds") return "segundos";
  if (normalized === "hours") return "horas";
  if (normalized === "days") return "dias";
  return "minutos";
}

function delayToMinutes(node) {
  const value = Math.max(0, Number(node.delayValue ?? node.delayMinutes) || 0);
  const unit = normalizeDelayUnit(node.delayUnit);
  if (unit === "seconds") return value / 60;
  if (unit === "hours") return value * 60;
  if (unit === "days") return value * 24 * 60;
  return value;
}

function syncLegacyMessageFromBlocks(node) {
  const firstText = node.contentBlocks?.find((block) => block.type === "text" && block.text);
  node.message = firstText ? firstText.text : "";
}

function syncTextBlockFromLegacyMessage(node) {
  if (!Array.isArray(node.contentBlocks)) return;
  const firstText = node.contentBlocks.find((block) => block.type === "text");
  if (firstText) firstText.text = node.message || "";
}

function applyTargetSelection(node, target) {
  const value = target.value || null;
  const field = target.dataset.targetField || "";
  if (target.dataset.targetKind && target.dataset.targetId && node.type === "message") {
    const list = target.dataset.targetKind === "button" ? node.buttons : node.quickReplies;
    const option = list?.find((item) => item.id === target.dataset.targetId);
    if (option) option.next = value;
    return;
  }
  if (target.dataset.targetBlockId && target.dataset.targetBlockButtonId && node.type === "message") {
    const option = findMessageBlockButton(node, target.dataset.targetBlockId, target.dataset.targetBlockButtonId);
    if (option) option.next = value;
    return;
  }
  if (target.dataset.targetVariationId && node.type === "randomizer") {
    const variation = node.variations?.find((item) => item.id === target.dataset.targetVariationId);
    if (variation) variation.next = value;
    return;
  }
  if (field) {
    node[field] = value;
    if (node.type === "link_click_wait" && field === "clickedNext") node.next = value;
  }
}

function defaultNodeMessage(type) {
  const messages = {
    message: "Digite a mensagem que a página enviará no Messenger.",
    condition: "Defina palavras-chave ou critérios para seguir este caminho.",
    delay: "Aguardar alguns minutos antes de continuar.",
    user_input: "Aguardar a próxima resposta do contato.",
    link_click_wait: "Aguardar clique no link enviado pelo node anterior.",
    jump: "Continuar em um passo existente de outro fluxo.",
    action: "Aplicar tag, abrir conversa ou notificar atendimento.",
    randomizer: "Distribuir contatos entre caminhos aleatórios.",
    comment: "Anotação interna do fluxo.",
    trigger: "Mensagem recebida no Messenger."
  };
  return messages[type] || messages.message;
}

function navigate(view) {
  activeView = view;
  persistActiveView(view);
  if (view === "flows") {
    flowCanvasOpen = false;
    flowCanvasMode = "edit";
    showInspector = false;
    messageButtonEditorOptionId = "";
    triggerPickerNodeId = "";
    nextStepPickerNodeId = "";
    actionPickerNodeId = "";
  }
  history.replaceState(null, "", `#${view}`);
  render();
}

function placeholderForView(view) {
  const placeholders = {
    dashboard: "Buscar no painel",
    pages: "Buscar conversa",
    flows: "Buscar fluxo ou gatilho",
    inbox: "Buscar conversa Messenger",
    subscribers: "Buscar assinante ou PSID",
    broadcasts: "Buscar disparo",
    json_templates: "Buscar JSON Template",
    origins: "Buscar src_, anuncio ou Pagina",
    pixel: "Buscar evento, link ou visitante",
    image: "Limpar metadados de imagem",
    video: "Trocar áudio de vídeo",
    setup: "Buscar configuração",
    settings: "Buscar ajuste"
  };
  return placeholders[view] || "Buscar";
}

function filterBySearch(items, selector) {
  if (!searchQuery) return items;
  return items.filter((item) => normalize(selector(item)).includes(normalize(searchQuery)));
}

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function keywordMatches(keywords, text) {
  const list = String(keywords || "")
    .split(",")
    .map((item) => normalize(item.trim()))
    .filter(Boolean);
  if (!list.length) return true;
  return list.some((keyword) => text.includes(keyword) || keyword.includes(text));
}

function resolveTemplate(text, name) {
  const firstName = String(name || "Contato").split(" ")[0];
  return String(text || "").replaceAll("{{first_name}}", firstName);
}

function statusLabel(status) {
  return {
    active: "Ativo",
    paused: "Pausado",
    draft: "Rascunho",
    scheduled: "Agendado",
    sent: "Enviado"
  }[status] || status;
}

function flowBadgeState(flow) {
  if (!flow || typeof flow !== "object") return null;
  if (flow.hasDraftChanges) {
    return {
      status: "draft",
      label: hasPublishedFlow(flow) ? "Editado" : "Rascunho"
    };
  }
  if (flow.status === "active" && hasPublishedFlow(flow)) {
    return { status: "active", label: "Publicado" };
  }
  return { status: flow.status, label: statusLabel(flow.status) };
}

function statusBadge(statusOrFlow, extraClass = "") {
  const isFlow = statusOrFlow && typeof statusOrFlow === "object";
  const flowState = isFlow ? flowBadgeState(statusOrFlow) : null;
  const status = flowState?.status || statusOrFlow;
  const label = flowState?.label || statusLabel(status);
  const classes = ["badge", status, extraClass].filter(Boolean).join(" ");
  return `<span class="${classes}">${label}</span>`;
}

function updateFlowStatusPill() {
  const pill = document.querySelector(".flow-status-pill");
  const flow = selectedFlow();
  if (!pill || !flow) return;

  const status = flow.hasDraftChanges ? "draft" : flow.status;
  pill.className = ["badge", status, "flow-status-pill"].join(" ");
  pill.textContent = flowBadgeState(flow)?.label || statusLabel(flow.status);
}

function tag(value) {
  return `<span class="tag">${escapeHtml(value || "sem-tag")}</span>`;
}

function tagsMarkup(contact) {
  const tags = contactTags(contact);
  if (!tags.length) return tag("sem-tag");
  return `<span class="tag-stack">${tags.slice(0, 2).map((value) => tag(value)).join("")}${tags.length > 2 ? `<span class="tag muted">+${tags.length - 2}</span>` : ""}</span>`;
}

function renderContactTagEditor(contact) {
  const tags = contactTags(contact);
  return `
    <div class="contact-tag-editor">
      <div class="tag-stack editable">
        ${
          tags.length
            ? tags
                .map(
                  (value) => `
                    <span class="tag editable-tag">
                      ${escapeHtml(value)}
                      <button type="button" data-action="remove-contact-tag" data-id="${attr(contact.id)}" data-tag="${attr(value)}" title="Remover tag">&times;</button>
                    </span>
                  `
                )
                .join("")
            : tag("sem-tag")
        }
      </div>
      <div class="contact-tag-picker-wrap">
        <button class="contact-tag-add-button" type="button" data-action="open-contact-tag-picker" data-id="${attr(contact.id)}" title="Adicionar tag salva">${icons.plus}<span>Tag salva</span></button>
        ${contactTagPickerContactId === contact.id ? renderContactTagPicker(contact) : ""}
      </div>
    </div>
  `;
}

function renderContactTagPicker(contact) {
  const pageId = normalizeFlowPageId(contact.pageId || currentFlowPageId());
  const folders = tagFoldersForPage(pageId);
  const records = tagRecordsForPage(pageId);
  const applied = new Set(contactTags(contact).map(normalizeTagKey));

  if (!records.length) {
    return `
      <div class="contact-tag-picker">
        <div class="contact-tag-picker-empty">Nenhuma tag salva nesta Pagina.</div>
      </div>
    `;
  }

  return `
    <div class="contact-tag-picker">
      ${folders
        .map((folder) => {
          const folderTags = records.filter((record) => (record.folderId || DEFAULT_TAG_FOLDER_ID) === folder.id);
          if (!folderTags.length) return "";
          return `
            <div class="contact-tag-folder">
              <strong>${escapeHtml(folder.name)}</strong>
              <div class="contact-tag-option-list">
                ${folderTags
                  .map((record) => {
                    const selected = applied.has(normalizeTagKey(record.name));
                    return `<button type="button" data-action="select-contact-tag" data-id="${attr(contact.id)}" data-tag="${attr(record.name)}" ${selected ? "disabled" : ""}>${escapeHtml(record.name)}${selected ? `<span>aplicada</span>` : ""}</button>`;
                  })
                  .join("")}
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function contactTags(contact) {
  return normalizeTags(contact?.tags ?? contact?.tag);
}

function normalizeTags(value) {
  const raw = Array.isArray(value) ? value : String(value || "").split(",");
  const seen = new Set();
  const tags = [];
  raw.forEach((item) => {
    const tagName = normalizeTagName(item);
    const key = normalizeTagKey(tagName);
    if (!tagName || seen.has(key)) return;
    seen.add(key);
    tags.push(tagName);
  });
  return tags;
}

function contactHasTag(contact, value) {
  const target = normalizeTagKey(value);
  return contactTags(contact).some((tagName) => normalizeTagKey(tagName) === target);
}

function normalizeTagName(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function normalizeTagKey(value) {
  return normalize(normalizeTagName(value));
}

function allContactTags(contacts = state.contacts) {
  return unique(contacts.flatMap((contact) => contactTags(contact))).sort((a, b) => a.localeCompare(b));
}

function contactSearchText(contact) {
  const fields = Object.entries(contact?.customFields || {})
    .map(([name, value]) => `${name} ${formatCustomFieldValue(value)}`)
    .join(" ");
  return `${contact.name} ${contact.psid} ${contactTags(contact).join(" ")} ${fields} ${contact.source} ${lastMessage(contact)?.text || ""}`;
}

function contactsForPage(pageId) {
  const normalizedPageId = normalizeFlowPageId(pageId);
  return state.contacts
    .map((contact) => Object.assign(contact, normalizeContactRecord(contact, normalizedPageId)))
    .filter((contact) => normalizeFlowPageId(contact.pageId) === normalizedPageId && contact.status !== "deleted");
}

function pageContactCount(pageId) {
  return contactsForPage(pageId).length;
}

function contactCountLabel(count) {
  return `${count} contato${count === 1 ? "" : "s"}`;
}

function metricCard(label, value, description, iconName) {
  return `
    <article class="metric">
      <span class="metric-icon">${icons[iconName]}</span>
      <span>
        <strong>${value}</strong>
        <span>${label}</span>
        <span>${description}</span>
      </span>
    </article>
  `;
}

function checkItem(title, copy) {
  return `
    <div class="row-between">
      <span>
        <strong>${escapeHtml(title)}</strong>
        <span class="muted">${escapeHtml(copy)}</span>
      </span>
      <span class="status-dot" aria-hidden="true"></span>
    </div>
  `;
}

function integrationCard(title, copy, value, action) {
  return `
    <article class="integration">
      <div class="integration-head">
        <span class="integration-icon">${icons.plug}</span>
        <span>
          <strong>${escapeHtml(title)}</strong>
          <span class="muted">${escapeHtml(copy)}</span>
        </span>
        <button class="icon-button" type="button" data-action="${action}" title="Copiar">${icons.copy}</button>
      </div>
      <code>${escapeHtml(value)}</code>
    </article>
  `;
}

function field(label, fieldName, value, type = "input") {
  return `
    <div class="field">
      <label for="${fieldName}">${label}</label>
      ${
        type === "textarea"
          ? `<textarea id="${fieldName}" data-setting-field="${fieldName}">${escapeHtml(value || "")}</textarea>`
          : `<input id="${fieldName}" data-setting-field="${fieldName}" value="${attr(value || "")}" />`
      }
    </div>
  `;
}

function emptyState(title, copy, iconName, buttonLabel, action) {
  return `
    <section class="panel">
      <div class="empty-state">
        ${icons[iconName]}
        <strong>${escapeHtml(title)}</strong>
        <span>${escapeHtml(copy)}</span>
        <button class="primary-button" type="button" data-action="${action}">${buttonLabel}</button>
      </div>
    </section>
  `;
}

function emptyInline(copy) {
  return `<div class="empty-state"><span>${escapeHtml(copy)}</span></div>`;
}

function initials(name) {
  return String(name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function lastMessage(contact) {
  return contact.messages?.[contact.messages.length - 1];
}

function eligibleContactsForBroadcast(tagName = "") {
  const liveRecipients = broadcastRecipientsFromPages();
  const localRecipients = state.contacts
    .filter((contact) => isBroadcastEligible(contact, tagName))
    .map((contact) => ({
      ...contact,
      pageId: contact.pageId || state.settings.pageId || "__local__",
      pageName: selectedPageName(contact.pageId || state.settings.pageId) || "Contatos locais",
      live: false
    }));

  return uniqueRecipients([...liveRecipients, ...localRecipients]).filter((contact) => isBroadcastEligible(contact, tagName));
}

function isBroadcastEligible(contact, tagName = "") {
  if (tagName && !contact.live && !contactHasTag(contact, tagName)) return false;
  if (!contact.psid) return false;
  if (contact.status && contact.status !== "open") return false;
  return isInsideMessengerReplyWindow(contact);
}

function isInsideMessengerReplyWindow(contact) {
  const value = contact.lastSeen || lastMessage(contact)?.at;
  const timestamp = Date.parse(value || "");
  if (!Number.isFinite(timestamp)) return false;
  return Date.now() - timestamp <= MESSENGER_REPLY_WINDOW_MS;
}

function broadcastPageStats(page) {
  const snapshot = broadcastState.pageConversations[page.id] || {};
  const conversations = snapshot.conversations || [];
  const recipients = conversations.map((conversation) => conversationToBroadcastRecipient(conversation, page)).filter(Boolean);
  const eligible = recipients.filter((contact) => isBroadcastEligible(contact));
  const outsideWindow = recipients.filter((contact) => !isInsideMessengerReplyWindow(contact));

  return {
    page,
    loading: Boolean(snapshot.loading),
    error: snapshot.error || "",
    recipients,
    eligible,
    outsideWindow
  };
}

function renderBroadcastPageStat(stat) {
  return `
    <article class="broadcast-page-card">
      <div class="row-between">
        <div>
          <strong>${escapeHtml(stat.page.name)}</strong>
          <span>${escapeHtml(stat.page.id)}</span>
        </div>
        <span class="badge ${stat.eligible.length ? "active" : "draft"}">${stat.loading ? "Carregando" : `${stat.eligible.length} apto${stat.eligible.length === 1 ? "" : "s"}`}</span>
      </div>
      <div class="broadcast-page-metrics">
        <span><strong>${stat.recipients.length}</strong><small>conversas</small></span>
        <span><strong>${stat.outsideWindow.length}</strong><small>fora 24h</small></span>
      </div>
      ${stat.error ? `<p class="muted">${escapeHtml(stat.error)}</p>` : ""}
    </article>
  `;
}

function eligiblePagesForBroadcast(tagName = "") {
  const byPage = new Map();
  eligibleContactsForBroadcast(tagName).forEach((contact) => {
    const pageId = contact.pageId || "__local__";
    const current = byPage.get(pageId) || {
      id: pageId,
      name: contact.pageName || "Contatos locais",
      count: 0
    };
    current.count += 1;
    byPage.set(pageId, current);
  });
  return [...byPage.values()].filter((page) => page.count > 0);
}

function broadcastRecipientsFromPages() {
  const pages = metaState.pages || [];
  return pages.flatMap((page) => broadcastPageStats(page).eligible);
}

function conversationToBroadcastRecipient(conversation, page) {
  const psid = recipientIdFromConversation(conversation, page.id);
  if (!psid) return null;
  const existing = state.contacts.find((contact) => normalizeFlowPageId(contact.pageId) === normalizeFlowPageId(page.id) && contact.psid === psid);

  return {
    id: `${page.id}:${psid}`,
    psid,
    pageId: page.id,
    pageName: page.name,
    name: conversationTitle(conversation, page.name),
    lastSeen: conversation.updated_time,
    source: "Messenger",
    tags: existing ? contactTags(existing) : [],
    tag: existing ? contactTags(existing)[0] || "" : "",
    status: "open",
    live: true
  };
}

function uniqueRecipients(recipients) {
  const byId = new Map();
  recipients.forEach((recipient) => {
    const key = `${recipient.pageId || "__local__"}:${recipient.psid}`;
    if (!byId.has(key)) byId.set(key, recipient);
  });
  return [...byId.values()];
}

function sortMetaConversations(conversations, pageId) {
  return [...conversations].sort((a, b) => {
    const attentionDiff = Number(conversationNeedsAttention(b, pageId)) - Number(conversationNeedsAttention(a, pageId));
    if (attentionDiff) return attentionDiff;
    return Date.parse(b.updated_time || "") - Date.parse(a.updated_time || "");
  });
}

function metaUnreadSummary(conversations, pageId) {
  const unreadTotal = conversations.reduce((total, conversation) => total + conversationUnreadCount(conversation), 0);
  const attentionTotal = conversations.filter((conversation) => conversationNeedsAttention(conversation, pageId)).length;

  if (unreadTotal) {
    return {
      count: unreadTotal,
      label: `${unreadTotal} mensagem${unreadTotal === 1 ? "" : "s"} nao lida${unreadTotal === 1 ? "" : "s"} em ${attentionTotal} conversa${attentionTotal === 1 ? "" : "s"}`
    };
  }

  if (attentionTotal) {
    return {
      count: attentionTotal,
      label: `${attentionTotal} conversa${attentionTotal === 1 ? "" : "s"} com novidade`
    };
  }

  return { count: 0, label: "Sem mensagens novas" };
}

function conversationUnreadCount(conversation) {
  const value = Number(conversation?.unread_count || 0);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function conversationNeedsAttention(conversation, pageId) {
  if (conversationUnreadCount(conversation) > 0) return true;
  const read = conversationReadState[conversationReadKey(pageId, conversation?.id)];
  return Boolean(read?.updatedTime && conversation?.updated_time && read.updatedTime !== conversation.updated_time);
}

function renderConversationUnreadBadge(conversation, pageId) {
  const unread = conversationUnreadCount(conversation);
  if (unread) return `<span class="unread-badge">${unread}</span>`;
  if (conversationNeedsAttention(conversation, pageId)) return `<span class="unread-badge new">Nova</span>`;
  return "";
}

function renderConversationStatus(conversation, pageId) {
  const unread = conversationUnreadCount(conversation);
  if (unread) return `<span class="unread-badge">${unread} nao lida${unread === 1 ? "" : "s"}</span>`;
  if (conversationNeedsAttention(conversation, pageId)) return `<span class="unread-badge new">Nova mensagem</span>`;
  return `<span class="channel-pill">Lida</span>`;
}

function conversationReadKey(pageId, conversationId) {
  return `${pageId || "__page__"}:${conversationId || "__conversation__"}`;
}

function markMetaConversationRead(pageId, conversationId) {
  const conversation = metaState.conversations?.find((item) => item.id === conversationId);
  if (!pageId || !conversationId || !conversation) return;
  conversation.unread_count = 0;
  conversationReadState[conversationReadKey(pageId, conversationId)] = {
    updatedTime: conversation.updated_time || "",
    readAt: new Date().toISOString()
  };
  saveConversationReadState();
}

function conversationTitle(conversation, pageName) {
  const participants = conversation.participants?.data || conversation.senders?.data || [];
  const person =
    participants.find((participant) => participant.name && participant.name !== pageName && !isTechnicalContactName(participant.name, participant.id)) ||
    participants.find((participant) => participant.id && participant.name !== pageName) ||
    participants[0];
  return contactDisplayName(person?.name || "", person?.id || conversation.id);
}

function pageDebugText(debug) {
  const granted = debug.grantedPermissions?.length ? debug.grantedPermissions.join(", ") : "nenhuma";
  const declined = debug.declinedPermissions?.length ? debug.declinedPermissions.join(", ") : "nenhuma";
  return `A Meta retornou 0 Páginas.
Permissões concedidas: ${granted}
Permissões recusadas: ${declined}

Verifique se a conta logada administra alguma Página e se o app recebeu pages_show_list. Em apps em modo desenvolvimento, a conta também precisa estar em App roles.`;
}

function recipientIdFromConversation(conversation, pageId) {
  const participants = conversation.participants?.data || conversation.senders?.data || [];
  return participants.find((participant) => participant.id && participant.id !== pageId)?.id || "";
}

function formatDate(value) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function formatLogDate(value) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
      hour12: false
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function formatDuration(value) {
  const seconds = Math.max(0, Math.round(Number(value) || 0));
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${String(mins).padStart(2, "0")}m`;
  }
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

function formatBytes(value) {
  const bytes = Number(value) || 0;
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let size = bytes / 1024;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(size >= 10 ? 1 : 2)} ${units[unitIndex]}`;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function makeId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;
}

function webhookUrl() {
  const origin = location.origin === "null" ? "https://seu-projeto.pages.dev" : location.origin;
  return `${origin}/api/messenger/webhook`;
}

function adEntryTemplateJson() {
  return JSON.stringify({
    message: {
      text: "Ola! Toque abaixo para receber o conteudo.",
      quick_replies: [
        {
          content_type: "text",
          title: "Receber conteudo",
          payload: "MESSENLEAD_AD_ENTRY"
        }
      ]
    }
  }, null, 2);
}

function compactFlowJson() {
  return JSON.stringify({ flows: state.flows });
}

function serializeContact(contact) {
  return {
    id: contact.id,
    pageId: normalizeFlowPageId(contact.pageId || currentFlowPageId()),
    psid: contact.psid,
    name: contact.name,
    status: contact.status || "open",
    source: contact.source || "Messenger",
    tags: contactTags(contact),
    tag: contactTags(contact)[0] || "",
    customFields: contact.customFields || {},
    customFieldsById: contact.customFieldsById || {},
    lastSeen: contact.lastSeen || lastMessage(contact)?.at || new Date().toISOString()
  };
}

function exportWorkspace() {
  downloadFile("messenlead-workspace.json", JSON.stringify(state, null, 2), "application/json");
}

async function importWorkspace(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    if (!data.flows || !Array.isArray(data.flows)) throw new Error("Arquivo inválido.");
    state = normalizeWorkspaceState({
      settings: data.settings || state.settings,
      flows: data.flows,
      flowsByPage: data.flowsByPage,
      contacts: data.contacts || state.contacts,
      campaigns: data.campaigns || state.campaigns
    });
    selectedFlowId = state.flows[0]?.id;
    selectedNodeId = state.flows[0]?.nodes[0]?.id;
    selectedContactId = state.contacts[0]?.id;
    saveState();
    syncAllFlowsToServer();
    toastMessage("Workspace importado.");
    render();
  } catch (error) {
    toastMessage(error.message || "Não foi possível importar.");
  } finally {
    event.target.value = "";
  }
}

function exportSubscribersCsv() {
  const header = ["name", "psid", "tags", "status", "source", "page_id"].join(",");
  const pageId = currentFlowPageId();
  const rows = contactsForPage(pageId).map((contact) =>
    [contact.name, contact.psid, contactTags(contact).join("|"), contact.status, contact.source, contact.pageId]
      .map((value) => `"${String(value).replaceAll('"', '""')}"`)
      .join(",")
  );
  downloadFile(`messenlead-assinantes-${safeFileName(selectedPageName(pageId) || pageId)}.csv`, [header, ...rows].join("\n"), "text/csv");
}

function downloadFile(name, content, type) {
  const blob = new Blob([content], { type });
  downloadBlob(name, blob);
}

function downloadBlob(name, blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

async function copyText(text, message) {
  try {
    await navigator.clipboard.writeText(text);
    toastMessage(message);
  } catch {
    toastMessage("Copie manualmente o conteúdo exibido.");
  }
}

function resetWorkspace() {
  openConfirmModal({
    title: "Restaurar modelo inicial",
    message: "Restaurar o modelo inicial e apagar o workspace local?",
    submitLabel: "Restaurar",
    danger: true,
    onConfirm: performResetWorkspace
  });
}

function performResetWorkspace() {
  state = seedWorkspace();
  selectedFlowId = state.flows[0]?.id;
  selectedNodeId = state.flows[0]?.nodes[0]?.id;
  selectedContactId = state.contacts[0]?.id;
  simLog = [];
  saveState();
  render();
}

function toastMessage(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toast.dataset.timeout);
  toast.dataset.timeout = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function attr(value) {
  return escapeHtml(value);
}

function safeJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
