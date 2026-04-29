const STORAGE_KEY = "messenlead.messenger.workspace.v2";
const SIDEBAR_COLLAPSED_KEY = "messenlead.sidebar.collapsed";
const DEFAULT_FLOW_PAGE_ID = "__global__";
const CONVERSATION_READ_KEY = "messenlead.messenger.conversation.read.v1";

const navItems = [
  { id: "dashboard", label: "Painel", icon: "dashboard" },
  { id: "pages", label: "Páginas", icon: "pages" },
  { id: "flows", label: "Fluxos", icon: "workflow" },
  { id: "inbox", label: "Inbox", icon: "inbox" },
  { id: "subscribers", label: "Assinantes", icon: "users" },
  { id: "broadcasts", label: "Disparos", icon: "send" },
  { id: "image", label: "Imagem", icon: "image" },
  { id: "setup", label: "Messenger", icon: "plug" },
  { id: "settings", label: "Ajustes", icon: "settings" }
];

const nodeLabels = {
  trigger: "Gatilho",
  message: "Mensagem",
  condition: "Condição",
  delay: "Espera",
  randomizer: "Randomizador",
  action: "Ação",
  comment: "Comentário"
};

const canvasAddOptions = [
  { type: "message", label: "Messenger" },
  { type: "trigger", label: "Iniciar a automação" },
  { type: "action", label: "Ações" },
  { type: "condition", label: "Condição" },
  { type: "randomizer", label: "Randomizador" },
  { type: "delay", label: "Atraso Inteligente" },
  { type: "comment", label: "Comentar" }
];

const triggerOptions = [
  {
    id: "facebook_ad",
    group: "Messenger",
    source: "Anúncios do Facebook",
    title: "O usuário clica no anúncio do Facebook",
    description: "Dispara quando a conversa chega com referência de anúncio."
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

const messageContentBlockTypes = [
  { type: "text", label: "Texto", icon: "message" },
  { type: "image", label: "Imagem", icon: "image" },
  { type: "audio", label: "Audio", icon: "send" },
  { type: "video", label: "Video", icon: "play" },
  { type: "file", label: "Arquivo", icon: "pages" },
  { type: "card", label: "Card", icon: "image" },
  { type: "gallery", label: "Galeria", icon: "workflow" },
  { type: "data_collection", label: "Coleta de dados", icon: "users" },
  { type: "dynamic", label: "Dinamico", icon: "plug" }
];

const CANVAS_WIDTH = 8000;
const CANVAS_HEIGHT = 6000;
const CANVAS_ORIGIN_X = 3600;
const CANVAS_ORIGIN_Y = 2600;
const NODE_WIDTH = 260;
const NODE_CENTER_Y = 70;
const NODE_CONNECT_Y = 112;
const CANVAS_MIN_X = -CANVAS_ORIGIN_X + 80;
const CANVAS_MAX_X = CANVAS_WIDTH - CANVAS_ORIGIN_X - NODE_WIDTH - 80;
const CANVAS_MIN_Y = -CANVAS_ORIGIN_Y + 80;
const CANVAS_MAX_Y = CANVAS_HEIGHT - CANVAS_ORIGIN_Y - 190;
const MINIMAP_WIDTH = 160;
const MINIMAP_HEIGHT = 110;
const ZOOM_MIN = 0.45;
const ZOOM_MAX = 1.15;
const MESSENGER_REPLY_WINDOW_MS = 24 * 60 * 60 * 1000;

const icons = {
  dashboard: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13h7V4H4v9Zm9 7h7V4h-7v16ZM4 20h7v-5H4v5Z"/></svg>`,
  pages: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21V5a2 2 0 0 1 2-2h10l4 4v14H4Z"/><path d="M14 3v5h5"/><path d="M8 13h8M8 17h6"/></svg>`,
  workflow: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6h.01M18 6h.01M6 18h.01M7 6h10M6 7v10m1 1h10m1-11v10"/><path d="M4 4h4v4H4V4Zm12 0h4v4h-4V4ZM4 16h4v4H4v-4Zm12 0h4v4h-4v-4Z"/></svg>`,
  inbox: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M3 15h5l2 3h4l2-3h5L18 4H6L3 15Z"/></svg>`,
  users: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  send: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4 20-7Z"/><path d="M22 2 11 13"/></svg>`,
  image: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4V5Z"/><path d="m8 15 3-3 2 2 3-4 4 5"/><circle cx="8.5" cy="9.5" r="1.5"/></svg>`,
  plug: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22v-5"/><path d="M9 8V2m6 6V2M6 8h12v5a6 6 0 0 1-12 0V8Z"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3.05V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.1.36.66 1 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1Z"/></svg>`,
  play: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7V5Z"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2m-1 5v6M9 11v6M5 6l1 15h12l1-15"/></svg>`,
  copy: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8h12v12H8V8Z"/><path d="M4 16V4h12"/></svg>`,
  message: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"/></svg>`,
  condition: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 9 9-9 9-9-9 9-9Z"/><path d="M12 8v4l3 3"/></svg>`,
  delay: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
  action: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 3 14h8l-1 8 11-13h-8l1-7Z"/></svg>`,
  trigger: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13a8 8 0 0 1 16 0"/><path d="M12 13V5m0 8 4-4m-4 4-4-4"/><path d="M5 19h14"/></svg>`,
  comment: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"/><path d="M8 9h8M8 13h5"/></svg>`
};

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
const sidebarToggle = document.querySelector("#sidebarToggle");
const toast = document.querySelector("#toast");
const modalRoot = document.querySelector("#modalRoot");

let state = loadState();
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
const storedCanvasZoom = localStorage.getItem("messenlead.canvas.zoom");
let canvasZoom = Number(storedCanvasZoom) || 0.78;
let shouldAutoFitCanvas = !storedCanvasZoom;
let flowCanvasOpen = false;
let showFlowList = false;
let showInspector = false;
let canvasScrollState = null;
let triggerPickerNodeId = "";
let nextStepPickerNodeId = "";
let actionPickerNodeId = "";
let actionPickerCategory = "contact";
let canvasAddMenu = null;
let suppressedNodeClickId = "";
let subscriberPageFilter = "";
let subscriberTagFilter = "";
let flowStore = {
  pageId: "",
  loading: false,
  serverAvailable: null,
  status: "Local",
  saveTimer: null
};
let contactStore = {
  pageId: "",
  loading: false,
  serverAvailable: null,
  status: "Local"
};
let metaState = {
  authChecked: false,
  profile: null,
  pages: null,
  pageDebug: null,
  selectedPageId: state.settings.pageId || "",
  conversations: null,
  selectedConversationId: "",
  messages: null,
  error: oauthErrorFromHash()
};
let broadcastState = {
  pageConversations: {}
};

mainNav.addEventListener("click", (event) => {
  const button = event.target.closest("[data-view]");
  if (!button) return;
  activeView = button.dataset.view;
  if (activeView === "flows") {
    flowCanvasOpen = false;
    showInspector = false;
    triggerPickerNodeId = "";
    nextStepPickerNodeId = "";
    actionPickerNodeId = "";
  }
  history.replaceState(null, "", `#${activeView}`);
  render();
});

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
workspace.addEventListener("dragover", handleWorkspaceDragOver);
workspace.addEventListener("drop", handleWorkspaceDrop);
modalRoot.addEventListener("click", handleModalClick);
modalRoot.addEventListener("submit", handleModalSubmit);

globalSearch.addEventListener("input", (event) => {
  searchQuery = event.target.value.trim().toLowerCase();
  render();
});

exportButton.addEventListener("click", exportWorkspace);
importButton.addEventListener("click", () => importFile.click());
importFile.addEventListener("change", importWorkspace);
initSidebarToggle();
window.addEventListener("hashchange", () => {
  activeView = getInitialView();
  if (activeView === "flows") {
    flowCanvasOpen = false;
    showInspector = false;
    triggerPickerNodeId = "";
    nextStepPickerNodeId = "";
    actionPickerNodeId = "";
  }
  render();
});
document.addEventListener("keydown", handleGlobalKeydown);

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
      <section class="app-modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
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
          : `<input name="${attr(field.name)}" type="${attr(field.type || "text")}" value="${value}" />`
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
      timezone: "America/Sao_Paulo"
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
            quickReplies: ["Quero uma proposta", "Tenho uma dúvida", "Falar com humano"],
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
            quickReplies: ["Serviço", "Produto", "Ainda estou pesquisando"],
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
            quickReplies: ["Sim", "Depois"],
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
            quickReplies: ["Pode enviar", "Agora não"],
            next: null,
            x: 395,
            y: 180
          }
        ]
      }
    ],
    contacts: [],
    campaigns: []
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
    flowsByPage,
    flows: Array.isArray(flowsByPage[activePageId]) ? flowsByPage[activePageId] : Array.isArray(workspace.flows) ? workspace.flows : []
  };
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
    name: contact?.name || psid,
    status: contact?.status || "open",
    source: contact?.source || "Messenger",
    tags,
    tag: tags[0] || contact?.tag || "",
    lastSeen: contact?.lastSeen || lastMessage(contact)?.at || "",
    messages: Array.isArray(contact?.messages) ? contact.messages : []
  };
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
  return flow;
}

function normalizeNodeStructure(node) {
  if (!node || typeof node !== "object") return node;

  if (node.type === "message") {
    if (!Array.isArray(node.contentBlocks) || !node.contentBlocks.length) {
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
      title: block.title || "",
      subtitle: block.subtitle || "",
      fileName: block.fileName || "",
      fieldName: block.fieldName || "",
      endpoint: block.endpoint || "",
      items: Array.isArray(block.items) ? block.items : []
    }));
    node.quickReplies = normalizeMessageOptions(node.quickReplies, "qr");
    node.buttons = normalizeMessageOptions(node.buttons, "btn").slice(0, 3);
  }

  if (node.type === "condition") {
    node.conditionType = node.conditionType || "message_contains";
    node.conditionOperator = node.conditionOperator || "contains_any";
    node.yesNext = node.yesNext || node.next || null;
    node.noNext = node.noNext || null;
  }

  if (node.type === "delay") {
    node.delayType = node.delayType || "duration";
    node.delayUnit = node.delayUnit || "minutes";
    node.delayMinutes = Math.max(0, Number(node.delayMinutes) || 0);
    node.delayValue = Math.max(0, Number(node.delayValue ?? node.delayMinutes) || 0);
    node.continueStart = node.continueStart || "";
    node.continueEnd = node.continueEnd || "";
    node.continueDays = node.continueDays || "any";
    node.specificDate = node.specificDate || "";
    node.dynamicField = node.dynamicField || "";
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
        next: option.next || null
      };
    })
    .filter((option) => option.title);
}

function flowBelongsToPage(flow, pageId, options = {}) {
  if (!flow || typeof flow !== "object") return false;
  if (!flow.pageId) return Boolean(options.allowUnscoped);
  return normalizeFlowPageId(flow.pageId) === normalizeFlowPageId(pageId);
}

function saveState() {
  persistLocalState();
  scheduleFlowSave();
}

function persistLocalState() {
  cacheCurrentPageFlows();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
  return navItems.some((item) => item.id === hash) ? hash : "pages";
}

function oauthErrorFromHash() {
  const query = location.hash.split("?")[1] || "";
  const error = new URLSearchParams(query).get("error");
  return error ? `Facebook Login: ${error}` : "";
}

function render() {
  if (activeView === "flows" && flowCanvasOpen) rememberCanvasScroll();
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
    image: renderImageTool,
    setup: renderSetup,
    settings: renderSettings
  };

  renderers[activeView]();
}

function renderNav() {
  const pageContacts = contactsForPage(currentFlowPageId());
  const counts = {
    dashboard: "",
    pages: metaState.pages?.length || "",
    flows: state.flows.filter((flow) => flow.status === "active").length,
    inbox: pageContacts.filter((contact) => contact.status === "open").length,
    subscribers: pageContacts.length,
    broadcasts: state.campaigns.filter((campaign) => campaign.status !== "sent").length,
    image: "",
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
  const selectedPage =
    pages.find((page) => page.id === metaState.selectedPageId) ||
    pages.find((page) => page.id === state.settings.pageId) ||
    null;
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
                      ${statusBadge(flow.status)}
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
            <button class="primary-button" type="button" data-action="go-pages">${icons.pages}<span>Ver Páginas</span></button>
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
          <span>O painel vai carregar as Páginas conectadas à sua conta.</span>
        </div>
      </section>
    `;
    loadMetaProfile();
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
          <p class="muted">Depois do login, o painel lista suas Páginas, mostra as conversas do Messenger e permite abrir o canvas de fluxo já associado à Página escolhida.</p>
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

  if (!metaState.pages) {
    workspace.innerHTML = `
      <section class="panel">
        <div class="empty-state">
          ${icons.pages}
          <strong>Carregando Páginas</strong>
          <span>Buscando as Páginas que sua conta pode administrar.</span>
        </div>
      </section>
    `;
    loadMetaPages();
    return;
  }

  const pages = filterBySearch(metaState.pages, (page) => `${page.name} ${page.id} ${page.category || ""}`);
  const selectedPage = pages.find((page) => page.id === metaState.selectedPageId) || pages[0] || null;

  if (selectedPage && selectedPage.id !== metaState.selectedPageId) {
    metaState.selectedPageId = selectedPage.id;
  }

  if (selectedPage && !metaState.conversations) {
    loadMetaConversations(selectedPage.id);
  }

  const conversations = sortMetaConversations(metaState.conversations || [], selectedPage?.id);
  const unreadSummary = selectedPage ? metaUnreadSummary(conversations, selectedPage.id) : null;
  const selectedConversation =
    conversations.find((conversation) => conversation.id === metaState.selectedConversationId) ||
    conversations[0] ||
    null;

  if (selectedConversation && selectedConversation.id !== metaState.selectedConversationId) {
    metaState.selectedConversationId = selectedConversation.id;
  }

  if (selectedPage && selectedConversation && !metaState.messages) {
    loadMetaMessages(selectedPage.id, selectedConversation.id);
  }

  workspace.innerHTML = `
    <div class="split-page">
      <section class="panel flat">
        <div class="panel-header">
          <div>
            <h2>Suas Páginas</h2>
            <span>${escapeHtml(metaState.profile.name || "Conta Meta")} · ${metaState.pages.length} Página${metaState.pages.length === 1 ? "" : "s"}</span>
          </div>
          <button class="secondary-button" type="button" data-action="logout-facebook">Sair</button>
        </div>
        <div class="contact-list">
          ${
            pages.length
              ? pages
                  .map(
                    (page) => `
                      <button class="contact-item ${selectedPage?.id === page.id ? "active" : ""}" type="button" data-action="select-meta-page" data-id="${page.id}">
                        <span class="avatar">${initials(page.name)}</span>
                        <span>
                          <span class="row-between"><strong>${escapeHtml(page.name)}</strong><span class="channel-pill">Messenger</span></span>
                          <span>${escapeHtml(page.category || "Página")} · ${escapeHtml(page.id)}</span>
                        </span>
                      </button>
                    `
                  )
                  .join("")
              : emptyInline("Nenhuma Página encontrada para esta conta.")
          }
          ${!pages.length && metaState.pageDebug ? `<div class="code-block">${escapeHtml(pageDebugText(metaState.pageDebug))}</div>` : ""}
        </div>
      </section>

      <section class="panel chat-panel">
        ${
          selectedPage
            ? `
              <div class="panel-header">
                <div class="row-between" style="width:100%">
                  <div>
                    <h2>${escapeHtml(selectedPage.name)}</h2>
                    <span>${escapeHtml(unreadSummary?.label || "Conversas reais do Messenger desta Pagina")}</span>
                  </div>
                  <div class="button-row">
                    <button class="secondary-button" type="button" data-action="refresh-meta-conversations">${icons.inbox}<span>Atualizar</span></button>
                    <button class="primary-button" type="button" data-action="open-page-flow">${icons.workflow}<span>Ver fluxos</span></button>
                  </div>
                </div>
              </div>
              <div class="live-inbox">
                <aside class="live-thread-list">
                  ${
                    metaState.conversations
                      ? conversations
                          .map(
                            (conversation) => `
                              <button class="campaign-item conversation-list-item ${conversationNeedsAttention(conversation, selectedPage.id) ? "has-unread" : ""} ${selectedConversation?.id === conversation.id ? "active" : ""}" type="button" data-action="select-meta-conversation" data-id="${conversation.id}">
                                <span class="conversation-title-row">
                                  <strong>${escapeHtml(conversationTitle(conversation, selectedPage.name))}</strong>
                                  ${renderConversationUnreadBadge(conversation, selectedPage.id)}
                                </span>
                                <span class="conversation-snippet">${escapeHtml(conversation.snippet || "Sem previa")}</span>
                                <span>${formatDate(conversation.updated_time)}</span>
                              </button>
                            `
                          )
                          .join("") || emptyInline("Nenhuma conversa retornada pela Graph API.")
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
                        <div class="conversation">
                          ${
                            metaState.messages
                              ? renderMetaConversationMessages(metaState.messages, selectedPage.id)
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
    </div>
  `;
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

  const flow = selectedFlow();
  if (!flow) {
    flowCanvasOpen = false;
    workspace.innerHTML = emptyState("Nenhum fluxo", "Crie um fluxo do Messenger para começar.", "workflow", "Novo fluxo", "new-flow");
    return;
  }

  pruneInvalidFlowConnections(flow);

  const node = showInspector ? selectedNode(flow) : null;
  if (showInspector && node) selectedNodeId = node.id;
  canvasZoom = clamp(canvasZoom, ZOOM_MIN, ZOOM_MAX);

  workspace.innerHTML = `
    <div class="page-grid canvas-focused ${showInspector ? "show-inspector" : ""}">
      <section class="panel canvas-shell">
        <div class="canvas-toolbar">
          <div class="tight-stack">
            <input class="field-input" data-flow-field="name" value="${attr(flow.name)}" aria-label="Nome do fluxo" />
            <span class="muted">${escapeHtml(flow.goal)}</span>
          </div>
          <span class="sync-pill ${flowStore.serverAvailable ? "synced" : "local"}">${escapeHtml(flowStore.loading ? "Carregando D1" : flowStore.status)}</span>
          <div class="canvas-panel-controls" aria-label="Painéis do canvas">
            <button class="secondary-button" type="button" data-action="back-to-flows">${icons.workflow}<span>Fluxos</span></button>
          </div>
          <div class="canvas-actions">
            <button class="secondary-button" type="button" data-action="duplicate-flow">${icons.copy}<span>Duplicar</span></button>
          </div>
          <div class="canvas-zoom" aria-label="Zoom do canvas">
            <button class="icon-button" type="button" data-action="canvas-zoom-out" title="Diminuir zoom">-</button>
            <button class="secondary-button" type="button" data-action="canvas-fit"><span>Ajustar</span></button>
            <span>${Math.round(canvasZoom * 100)}%</span>
            <button class="icon-button" type="button" data-action="canvas-zoom-in" title="Aumentar zoom">+</button>
          </div>
        </div>
        <button class="canvas-peek-button ${showInspector ? "active" : ""}" type="button" data-action="peek-inspector" title="${showInspector ? "Fechar configurações" : "Mostrar configurações do bloco"}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="${showInspector ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"}" /></svg>
        </button>
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
        <div class="canvas-floating-tools" aria-label="Adicionar blocos">
          ${nodeAddButton("message", "Mensagem")}
          ${nodeAddButton("condition", "Condição")}
          ${nodeAddButton("delay", "Espera")}
          ${nodeAddButton("action", "Ação")}
        </div>
        <div class="canvas-minimap" id="canvasMinimap">
          ${renderMiniMapContent(flow)}
        </div>
        ${renderCanvasAddMenu()}
      </section>

      <aside class="panel inspector flow-config-drawer">
        <div class="flow-config-header">
          <span>Configurações do bloco</span>
          <strong>${escapeHtml(node?.title || "Bloco")}</strong>
          <button class="icon-button" type="button" data-action="peek-inspector" title="Fechar configurações">&times;</button>
        </div>
        <div class="panel-body stack">
          ${node ? renderInspector(flow, node) : ""}
        </div>
      </aside>
      ${renderTriggerPicker(flow)}
      ${renderNextStepPicker(flow)}
      ${renderActionPicker(flow)}
    </div>
  `;

  enableNodeDragging(flow);
  enableConnectionDragging(flow);
  enableCanvasPanning();
  enableCanvasDoubleClickMenu();
  enableCanvasWheelZoom();
  enableMiniMapNavigation();
  if (shouldAutoFitCanvas) {
    shouldAutoFitCanvas = false;
    requestAnimationFrame(() => fitCanvasToViewport());
  } else {
    requestAnimationFrame(() => {
      restoreCanvasScroll();
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

function renderFlowCard(flow) {
  const nodeCount = flow.nodes?.length || 0;
  const isActive = flow.status === "active";
  return `
    <article class="flow-card">
      <button class="flow-card-main" type="button" data-action="select-flow" data-id="${flow.id}">
        <span class="flow-card-head">
          <span class="flow-card-icon">${icons.workflow}</span>
          <span>
            <strong>${escapeHtml(flow.name)}</strong>
            <span>${escapeHtml(flow.trigger || "sem gatilho")}</span>
          </span>
          ${statusBadge(flow.status)}
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
          <span>${isActive ? "Ligado" : "Desligado"}</span>
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

function renderSubscribers() {
  const currentPageId = currentFlowPageId();
  if (shouldLoadContactsForCurrentPage()) loadContactsForPage(currentPageId);

  const selectedPageFilter = subscriberPageFilter || currentPageId;
  const contacts = selectedPageFilter === "__all__" ? state.contacts : contactsForPage(selectedPageFilter);
  const tags = allContactTags(contacts);
  const filtered = filterBySearch(contacts, contactSearchText).filter((contact) =>
    subscriberTagFilter ? contactHasTag(contact, subscriberTagFilter) : true
  );
  const pages = metaState.pages || [];

  workspace.innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2>Assinantes Messenger</h2>
          <span>${filtered.length} contato${filtered.length === 1 ? "" : "s"} neste filtro</span>
        </div>
        <div class="button-row">
          <span class="sync-pill ${contactStore.serverAvailable ? "synced" : "local"}">${escapeHtml(contactStore.loading ? "Carregando D1" : contactStore.status)}</span>
          <button class="secondary-button" type="button" data-action="refresh-contacts">${icons.users}<span>Atualizar</span></button>
          <button class="secondary-button" type="button" data-action="export-csv">${icons.copy}<span>CSV</span></button>
          <button class="primary-button" type="button" data-action="new-contact">${icons.plus}<span>Novo</span></button>
        </div>
      </div>
      <div class="filter-bar">
        <label class="compact-filter">
          <span>Pagina</span>
          <select id="subscriberPageFilter">
            <option value="__all__" ${selectedPageFilter === "__all__" ? "selected" : ""}>Todas as paginas (${state.contacts.length})</option>
            ${pages
              .map((page) => `<option value="${attr(page.id)}" ${selectedPageFilter === page.id ? "selected" : ""}>${escapeHtml(`${page.name} (${pageContactCount(page.id)})`)}</option>`)
              .join("")}
          </select>
        </label>
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
                    <td>${contact.status === "open" ? "Aberta" : "Fechada"}</td>
                    <td>${escapeHtml(contact.source)}</td>
                    <td>${escapeHtml(lastMessage(contact)?.text || "-")}</td>
                  </tr>
                `
              )
              .join("") || `<tr><td colspan="6">${emptyInline("Nenhum contato neste filtro.")}</td></tr>`}
          </tbody>
        </table>
      </div>
    </section>
  `;
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
    loadMetaProfile();
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
    loadMetaPages();
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

function renderSetup() {
  const flowJson = JSON.stringify({ flows: state.flows }, null, 2);

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
            ${integrationCard("Campos", "Assine eventos necessários para automação.", "messages, messaging_postbacks, messaging_optins, messaging_referrals", "copy-fields")}
            ${integrationCard("Verify token", "Use o mesmo valor em MESSENGER_VERIFY_TOKEN.", state.settings.verifyToken, "copy-verify")}
            ${integrationCard("Endpoint de envio", "Envio serverless protegido por token.", `${location.origin}/api/messenger/send`, "copy-send")}
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
  workspace.innerHTML = "";
}

async function loadMetaProfile() {
  try {
    const profile = await apiGet("/api/meta/me");
    metaState.profile = profile.user || null;
    metaState.error = "";
  } catch (error) {
    metaState.profile = null;
    metaState.error = error.message === "Not authenticated" ? metaState.error : error.message;
  } finally {
    metaState.authChecked = true;
    render();
  }
}

async function loadMetaPages() {
  try {
    const result = await apiGet("/api/meta/pages");
    metaState.pages = result.pages || [];
    metaState.pageDebug = result.debug || null;
    metaState.error = "";
    if (!metaState.selectedPageId && metaState.pages[0]) {
      metaState.selectedPageId = metaState.pages[0].id;
    }
  } catch (error) {
    metaState.pages = [];
    metaState.pageDebug = null;
    metaState.error = error.message;
    toastMessage(error.message);
  } finally {
    render();
  }
}

async function loadMetaConversations(pageId) {
  try {
    metaState.error = "";
    const result = await apiGet(`/api/meta/conversations?pageId=${encodeURIComponent(pageId)}`);
    const conversations = result.conversations || [];
    const previousConversationId = metaState.selectedConversationId;
    metaState.conversations = conversations;
    mergeConversationsAsContacts(pageId, selectedPageName(pageId), conversations);
    metaState.selectedConversationId =
      conversations.find((conversation) => conversation.id === previousConversationId)?.id ||
      sortMetaConversations(conversations, pageId)[0]?.id ||
      "";
    metaState.messages = null;
  } catch (error) {
    metaState.conversations = [];
    metaState.error = error.message;
    toastMessage(error.message);
  } finally {
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

async function loadMetaMessages(pageId, conversationId) {
  try {
    const result = await apiGet(
      `/api/meta/messages?pageId=${encodeURIComponent(pageId)}&conversationId=${encodeURIComponent(conversationId)}`
    );
    metaState.messages = result.messages || [];
    metaState.error = "";
    markMetaConversationRead(pageId, conversationId);
  } catch (error) {
    metaState.messages = [];
    metaState.error = error.message;
    toastMessage(error.message);
  } finally {
    render();
  }
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
    if (["subscribers", "inbox"].includes(activeView)) render();
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
    const next = normalizeContactRecord(
      {
        id: existing?.id || `${normalizedPageId}:${psid}`,
        pageId: normalizedPageId,
        psid,
        name: conversationTitle(conversation, pageName),
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
  }
}

async function logoutFacebook() {
  try {
    await apiPost("/api/auth/logout", {});
  } catch {
    // Ignore logout failures on purpose; local UI state still needs to reset.
  }

  metaState = {
    authChecked: true,
    profile: null,
    pages: null,
    pageDebug: null,
    selectedPageId: "",
    conversations: null,
    selectedConversationId: "",
    messages: null,
    error: ""
  };
  render();
}

function selectMetaPage(pageId) {
  cacheCurrentPageFlows();
  const page = metaState.pages?.find((item) => item.id === pageId);
  metaState.selectedPageId = pageId;
  metaState.conversations = null;
  metaState.selectedConversationId = "";
  metaState.messages = null;

  if (page) {
    state.settings.pageId = page.id;
    state.settings.pageName = page.name;
    subscriberPageFilter = page.id;
    subscriberTagFilter = "";
    setActiveFlowsForPage(page.id);
    persistLocalState();
    flowStore.pageId = "";
    contactStore.pageId = "";
    loadFlowsForPage(page.id);
    loadContactsForPage(page.id);
  }

  render();
}

function selectSidebarPage(pageId) {
  cacheCurrentPageFlows();
  const page = metaState.pages?.find((item) => item.id === pageId);
  if (!page) return;

  metaState.selectedPageId = page.id;
  metaState.conversations = null;
  metaState.selectedConversationId = "";
  metaState.messages = null;
  state.settings.pageId = page.id;
  state.settings.pageName = page.name;
  subscriberPageFilter = page.id;
  subscriberTagFilter = "";
  setActiveFlowsForPage(page.id);
  selectedNodeId = state.flows[0]?.nodes[0]?.id;
  flowCanvasOpen = false;
  showInspector = false;
  triggerPickerNodeId = "";
  nextStepPickerNodeId = "";
  flowStore.pageId = "";
  contactStore.pageId = "";
  persistLocalState();
  loadContactsForPage(page.id);
  render();
}

function refreshMetaConversations() {
  if (!metaState.selectedPageId) return;
  metaState.conversations = null;
  metaState.messages = null;
  render();
}

function selectMetaConversation(conversationId) {
  const pageId = metaState.selectedPageId || state.settings.pageId;
  metaState.selectedConversationId = conversationId;
  metaState.messages = null;
  markMetaConversationRead(pageId, conversationId);
  render();
}

async function sendMetaMessage() {
  const page = metaState.pages?.find((item) => item.id === metaState.selectedPageId);
  const conversation = metaState.conversations?.find((item) => item.id === metaState.selectedConversationId);
  const textarea = document.querySelector("#metaComposerText");
  const text = textarea?.value.trim();
  const psid = conversation ? recipientIdFromConversation(conversation, page?.id) : "";

  if (!page || !conversation || !text) return;
  if (!psid) {
    toastMessage("Não encontrei o PSID do destinatário nesta conversa.");
    return;
  }

  try {
    await apiPost("/api/meta/send", { pageId: page.id, psid, text });
    textarea.value = "";
    metaState.messages = null;
    toastMessage("Mensagem enviada pelo Messenger.");
    render();
  } catch (error) {
    toastMessage(error.message);
  }
}

function openPageFlow() {
  cacheCurrentPageFlows();
  const page = metaState.pages?.find((item) => item.id === metaState.selectedPageId);
  if (page) {
    state.settings.pageId = page.id;
    state.settings.pageName = page.name;
    setActiveFlowsForPage(page.id);
    persistLocalState();
    flowStore.pageId = "";
    contactStore.pageId = "";
    loadContactsForPage(page.id);
  }
  navigate("flows");
}

async function loadFlowsForPage(pageId) {
  const normalizedPageId = normalizeFlowPageId(pageId);
  const localFlows = localFlowsForPage(normalizedPageId);
  setActiveFlowsForPage(normalizedPageId, localFlows);

  flowStore = {
    ...flowStore,
    pageId: normalizedPageId,
    loading: true,
    status: "Carregando D1"
  };

  try {
    const result = await apiGet(`/api/flows?pageId=${encodeURIComponent(normalizedPageId)}`);
    if (currentFlowPageId() !== normalizedPageId) return;

    flowStore.serverAvailable = true;

    if (Array.isArray(result.flows) && result.flows.length) {
      setActiveFlowsForPage(normalizedPageId, result.flows);
      persistLocalState();
      flowStore.status = "Salvo no D1";
    } else if (localFlows.length) {
      flowStore.status = "Rascunhos locais desta pagina";
    } else {
      setActiveFlowsForPage(normalizedPageId, []);
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
      if (activeView === "flows") render();
    }
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

async function syncFlowToServer(flow) {
  const pageId = currentFlowPageId();
  if (flowStore.serverAvailable === false && flowStore.pageId === pageId) return;

  try {
    flow.pageId = pageId;
    await apiPost("/api/flows", { pageId, flow });
    flowStore.serverAvailable = true;
    flowStore.pageId = pageId;
    flowStore.status = "Salvo no D1";
    updateSyncPill();
  } catch (error) {
    flowStore.serverAvailable = false;
    flowStore.status = flowStoreStatusFromError(error);
    updateSyncPill();
  }
}

async function syncAllFlowsToServer() {
  const pageId = currentFlowPageId();
  if (!state.flows.length) return;

  try {
    state.flows.forEach((flow) => {
      flow.pageId = pageId;
    });
    await apiPost("/api/flows", { pageId, flows: state.flows });
    flowStore.serverAvailable = true;
    flowStore.pageId = pageId;
    flowStore.status = "Fluxos salvos no D1";
    updateSyncPill();
  } catch (error) {
    flowStore.serverAvailable = false;
    flowStore.status = flowStoreStatusFromError(error);
    updateSyncPill();
  }
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
  if (node.type === "message") return renderMessageSettings(flow, node);
  if (node.type === "condition") return renderConditionSettings(flow, node);
  if (node.type === "delay") return renderDelaySettings(flow, node);
  if (node.type === "randomizer") return renderRandomizerSettings(flow, node);
  if (node.type === "comment") return renderCommentSettings(flow, node);
  return renderActionSettings(flow, node);
}

function renderTriggerSettings(flow, node) {
  return `
    <form class="inspector-form manychat-settings">
      <div class="manychat-trigger-head">Quando...</div>
      <div class="trigger-card-list">
        ${nodeTriggerEvents(node).map((id, index) => renderTriggerSettingCard(node.id, id, index)).join("")}
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

function renderTriggerSettingCard(nodeId, triggerId, index) {
  const option = triggerOptionById(triggerId);
  return `
    <article class="trigger-setting-card">
      <span class="trigger-card-icon">${icons.message}</span>
      <div class="trigger-setting-copy">
        <span class="trigger-setting-source">${escapeHtml(option?.source || "Messenger")} #${index + 1}</span>
        <strong>${escapeHtml(option?.title || triggerId)}</strong>
        <small>${triggerExecutionLabel(triggerId)}</small>
      </div>
      <button class="mini-menu-button" type="button" data-action="open-trigger-picker" data-id="${nodeId}" title="Editar gatilho">⋮</button>
    </article>
  `;
}

function triggerExecutionLabel(triggerId) {
  if (triggerId === "facebook_ad") return "0 clicado";
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
        <div class="content-block-list">
          ${node.contentBlocks.map((block) => renderMessageContentBlock(block)).join("")}
          <div class="content-add-row">
            ${messageContentBlockTypes
              .map((blockType) => `<button type="button" data-action="add-message-block" data-type="${attr(blockType.type)}">${icons[blockType.icon] || icons.message}<span>${escapeHtml(blockType.label)}</span></button>`)
              .join("")}
          </div>
        </div>
        <div class="settings-card">
          <div class="settings-card-title">
            <strong>Botões</strong>
            <span>Até 3 botões fixos. Cada botão pode abrir site, telefone ou seguir para um passo.</span>
          </div>
          <div class="message-option-list">
            ${node.buttons.map((option) => renderMessageOption(flow, node, option, "button")).join("")}
            <button class="dashed-add-button" type="button" data-action="add-message-button" data-id="${node.id}">+ Botão</button>
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

function renderMessageContentBlock(block) {
  const type = messageContentBlockTypes.find((item) => item.type === block.type) || messageContentBlockTypes[0];
  const removeButton = `<button class="mini-menu-button" type="button" data-action="remove-message-block" data-block-id="${attr(block.id)}" title="Remover bloco">&times;</button>`;

  if (block.type === "text") {
    return `
      <article class="message-content-block">
        <div class="message-content-head">${icons[type.icon] || icons.message}<strong>Texto</strong>${removeButton}</div>
        <textarea data-message-block-field="text" data-block-id="${attr(block.id)}" placeholder="Adicionar texto">${escapeHtml(block.text || "")}</textarea>
      </article>
    `;
  }

  if (["image", "audio", "video", "file"].includes(block.type)) {
    return `
      <article class="message-content-block">
        <div class="message-content-head">${icons[type.icon] || icons.message}<strong>${escapeHtml(type.label)}</strong>${removeButton}</div>
        <input data-message-block-field="url" data-block-id="${attr(block.id)}" value="${attr(block.url || "")}" placeholder="URL do arquivo" />
        ${block.type === "file" ? `<input data-message-block-field="fileName" data-block-id="${attr(block.id)}" value="${attr(block.fileName || "")}" placeholder="Nome do arquivo" />` : ""}
      </article>
    `;
  }

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

function renderConditionSettings(flow, node) {
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

function renderDelaySettings(flow, node) {
  normalizeNodeStructure(node);
  return `
    <form class="inspector-form manychat-settings">
      ${settingsSectionHeader("Atraso Inteligente", "Controlar quando o fluxo continua", icons.delay)}
      <label class="settings-field">
        <span>Nome do atraso</span>
        <input data-node-field="title" value="${attr(node.title || "")}" />
      </label>
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
                <label class="settings-field"><span>Unidade</span><select data-node-field="delayUnit">${optionSelect("minutes", "Minutos", node.delayUnit)}${optionSelect("hours", "Horas", node.delayUnit)}${optionSelect("days", "Dias", node.delayUnit)}</select></label>
              </div>`
            : node.delayType === "date"
              ? `<label class="settings-field"><span>Data e hora</span><input type="datetime-local" data-node-field="specificDate" value="${attr(node.specificDate || "")}" /></label>`
              : `<label class="settings-field"><span>Campo de data do contato</span><input data-node-field="dynamicField" value="${attr(node.dynamicField || "")}" placeholder="ex: data_agendamento" /></label>`
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

function renderRandomizerSettings(flow, node) {
  normalizeNodeStructure(node);
  return `
    <form class="inspector-form manychat-settings">
      ${settingsSectionHeader("Randomizador", "Distribuir contatos entre caminhos", icons.workflow)}
      <label class="settings-field">
        <span>Nome do randomizador</span>
        <input data-node-field="title" value="${attr(node.title || "")}" />
      </label>
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
  const dataAttrs = Object.entries(data)
    .map(([key, item]) => `data-target-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}="${attr(item)}"`)
    .join(" ");
  const options = flow.nodes
    .filter((item) => item.id !== node.id && canAcceptIncomingConnection(item))
    .map((item) => `<option value="${attr(item.id)}" ${item.id === value ? "selected" : ""}>${escapeHtml(item.title || nodeLabels[item.type] || "Bloco")}</option>`)
    .join("");
  return `
    <label class="settings-field">
      <span>${escapeHtml(label)}</span>
      <select data-target-select="true" ${dataAttrs}>
        <option value="">Sem próximo passo</option>
        ${options}
      </select>
    </label>
  `;
}

function renderCommentSettings(flow, node) {
  return `
    <form class="inspector-form manychat-settings">
      ${settingsSectionHeader("Comentário", "Anotação interna no canvas", icons.comment)}
      <label class="settings-field">
        <span>Título</span>
        <input data-node-field="title" value="${attr(node.title || "")}" />
      </label>
      <label class="settings-field">
        <span>Comentário</span>
        <textarea data-node-field="message">${escapeHtml(node.message || "")}</textarea>
      </label>
    </form>
  `;
}

function renderActionSettings(flow, node) {
  return `
    <form class="inspector-form manychat-settings">
      <div class="manychat-action-head">
        <span>${icons.action}</span>
        <strong>Ações</strong>
      </div>
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
        <input id="${attr(fieldId)}" data-action-step-field="tag" data-step-id="${attr(step.id)}" value="${attr(step.tag || "")}" placeholder="Digite ou selecione a tag" />
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
        <input data-action-step-field="fieldName" data-step-id="${attr(step.id)}" value="${attr(step.fieldName || "")}" placeholder="Nome do campo" />
        ${
          step.type === "set_user_field"
            ? `<input data-action-step-field="fieldValue" data-step-id="${attr(step.id)}" value="${attr(step.fieldValue || "")}" placeholder="Valor" />`
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
    showInspector = false;
    triggerPickerNodeId = "";
    nextStepPickerNodeId = "";
    actionPickerNodeId = "";
    canvasAddMenu = null;
    return render();
  }
  if (action === "toggle-flow-list") return toggleFlowList();
  if (action === "toggle-inspector") return toggleInspector();
  if (action === "peek-inspector") return peekInspector();
  if (action === "open-trigger-picker") return openTriggerPicker(id);
  if (action === "close-trigger-picker") {
    triggerPickerNodeId = "";
    nextStepPickerNodeId = "";
    actionPickerNodeId = "";
    canvasAddMenu = null;
    return render();
  }
  if (action === "add-trigger-event") return addTriggerEvent(id, button.dataset.triggerId);
  if (action === "open-next-step-picker") return openNextStepPicker(id);
  if (action === "close-next-step-picker") return closeNextStepPicker();
  if (action === "add-next-step") return addNextStep(button.dataset.type);
  if (action === "set-existing-next-step") return setExistingNextStep(id, button.dataset.targetId);
  if (action === "open-action-picker") return openActionPicker(id);
  if (action === "close-action-picker") return closeActionPicker();
  if (action === "select-action-category") return selectActionCategory(button.dataset.category);
  if (action === "add-action-step") return addActionStep(button.dataset.type);
  if (action === "remove-action-step") return removeActionStep(id, button.dataset.stepId);
  if (action === "connect-facebook") {
    window.location.href = "/api/auth/facebook/start";
    return;
  }
  if (action === "logout-facebook") return logoutFacebook();
  if (action === "select-meta-page") return selectMetaPage(id);
  if (action === "refresh-meta-conversations") return refreshMetaConversations();
  if (action === "select-meta-conversation") return selectMetaConversation(id);
  if (action === "send-meta-message") return sendMetaMessage();
  if (action === "open-page-flow") return openPageFlow();
  if (action === "open-contact") {
    selectedContactId = id;
    return navigate("inbox");
  }
  if (action === "new-flow") return createFlow();
  if (action === "select-flow") {
    selectedFlowId = id;
    selectedNodeId = selectedFlow()?.nodes[0]?.id;
    flowCanvasOpen = true;
    showFlowList = false;
    showInspector = false;
    triggerPickerNodeId = "";
    nextStepPickerNodeId = "";
    actionPickerNodeId = "";
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
    showInspector = true;
    showFlowList = false;
    triggerPickerNodeId = "";
    nextStepPickerNodeId = "";
    actionPickerNodeId = "";
    canvasAddMenu = null;
    localStorage.setItem("messenlead.canvas.flowList", "false");
    return render();
  }
  if (action === "add-node") return addNode(button.dataset.type);
  if (action === "add-node-at-menu") return addNodeFromCanvasMenu(button.dataset.type);
  if (action === "add-message-block") return addMessageBlock(button.dataset.type);
  if (action === "remove-message-block") return removeMessageBlock(button.dataset.blockId);
  if (action === "add-message-button") return addMessageButton();
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
  if (action === "duplicate-flow") return duplicateFlow();
  if (action === "duplicate-flow-card") return duplicateFlow(id, { openCanvas: false });
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
  if (action === "add-contact-tag") return addTagFromContactEditor(id, button.dataset.inputId);
  if (action === "remove-contact-tag") return removeContactTag(id, button.dataset.tag);
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
  if (action === "delete-campaign") return deleteCampaign(id);
  if (action === "copy-webhook") return copyText(webhookUrl(), "Webhook copiado.");
  if (action === "copy-oauth") return copyText(`${location.origin}/api/auth/facebook/callback`, "Callback OAuth copiado.");
  if (action === "copy-db-binding") return copyText("DB", "Nome do binding D1 copiado.");
  if (action === "copy-fields") return copyText("messages,messaging_postbacks,messaging_optins,messaging_referrals", "Campos copiados.");
  if (action === "refresh-broadcast-eligibility") return refreshBroadcastEligibility();
  if (action === "choose-image") return document.querySelector("#imageUpload")?.click();
  if (action === "download-clean-image") return downloadCleanImage();
  if (action === "clear-image-tool") return clearImageTool();
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
    if (fieldName === "message") syncTextBlockFromLegacyMessage(node);
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

  if (target.dataset.actionStepField && node) {
    const step = nodeActionSteps(node).find((item) => item.id === target.dataset.stepId);
    if (!step) return;
    step[target.dataset.actionStepField] = target.value;
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
  if (target.id === "subscriberPageFilter") {
    subscriberPageFilter = target.value;
    subscriberTagFilter = "";
    render();
    return;
  }
  if (target.id === "subscriberTagFilter") {
    subscriberTagFilter = target.value;
    render();
    return;
  }
  if (target.dataset.nodeField && node) {
    if (target.type === "checkbox") {
      node[target.dataset.nodeField] = target.checked;
      flow.updatedAt = new Date().toISOString();
      saveState();
    } else {
      node[target.dataset.nodeField] = normalizeFieldValue(target.dataset.nodeField, target.value);
      if (target.dataset.nodeField === "delayValue" || target.dataset.nodeField === "delayUnit") node.delayMinutes = delayToMinutes(node);
      flow.updatedAt = new Date().toISOString();
      saveState();
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

  if (
    target.dataset.nodeField ||
    target.dataset.flowField ||
    target.dataset.settingField ||
    target.dataset.actionStepField ||
    target.dataset.messageBlockField ||
    target.dataset.messageOptionField ||
    target.dataset.randomVariationField ||
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
  if (activeView !== "flows" || !flowCanvasOpen || !selectedNodeId) return false;
  return !isEditableTarget(event.target);
}

function isEditableTarget(target) {
  return Boolean(target?.closest?.("input, textarea, select, [contenteditable='true']"));
}

function handleWorkspaceDragOver(event) {
  if (activeView !== "image") return;
  if (!event.dataTransfer?.types?.includes("Files")) return;
  event.preventDefault();
}

function handleWorkspaceDrop(event) {
  if (activeView !== "image") return;
  const file = event.dataTransfer?.files?.[0];
  if (!file) return;
  event.preventDefault();
  handleImageUpload(file);
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
        quickReplies: ["Tenho interesse", "Suporte", "Falar com humano"],
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
    quickReplies: type === "message" ? ["Sim", "Não"] : [],
    conditionType: type === "condition" ? "message_contains" : undefined,
    conditionOperator: type === "condition" ? "contains_any" : undefined,
    yesNext: type === "condition" ? null : undefined,
    noNext: type === "condition" ? null : undefined,
    delayType: type === "delay" ? "duration" : undefined,
    delayUnit: type === "delay" ? "minutes" : undefined,
    delayValue: type === "delay" ? 5 : undefined,
    delayMinutes: type === "delay" ? 5 : undefined,
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
  if (current && !outputRefs(current).length) assignPrimaryTarget(current, node.id);
  flow.nodes.push(node);
  flow.updatedAt = new Date().toISOString();
  selectedNodeId = node.id;
  showInspector = true;
  saveState();
  render();
}

function addNodeFromCanvasMenu(type) {
  if (!canvasAddMenu) return;
  const target = canvasAddMenu;
  canvasAddMenu = null;
  addNodeAt(type, target.x, target.y);
}

function addNodeAt(type, x, y) {
  const flow = selectedFlow();
  if (!flow || !nodeLabels[type]) return;

  const node = buildNode(type, x, y);
  flow.nodes.push(node);
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
    quickReplies: type === "message" ? ["Sim", "Não"] : [],
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
    node.keyword = "oi";
  }

  return normalizeNodeStructure(node);
}

function setFlowStatus(status) {
  const flow = selectedFlow();
  if (!flow) return;
  flow.status = status;
  flow.updatedAt = new Date().toISOString();
  saveState();
  toastMessage(`Fluxo marcado como ${statusLabel(status).toLowerCase()}.`);
  render();
}

function toggleFlowActive(flowId = selectedFlowId) {
  const flow = state.flows.find((item) => item.id === flowId);
  if (!flow) return;

  flow.status = flow.status === "active" ? "paused" : "active";
  flow.updatedAt = new Date().toISOString();
  persistLocalState();
  if (!flowStore.loading) syncFlowToServer(flow);
  toastMessage(`Fluxo ${flow.status === "active" ? "ligado" : "desligado"}.`);
  render();
}

function duplicateFlow(flowId = selectedFlowId, options = {}) {
  const flow = state.flows.find((item) => item.id === flowId) || selectedFlow();
  if (!flow) return;
  const copy = JSON.parse(JSON.stringify(flow));
  const idMap = new Map();
  copy.id = makeId("flow");
  copy.pageId = currentFlowPageId();
  copy.name = `${flow.name} cópia`;
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
    });
  });
  state.flows.unshift(copy);
  selectedFlowId = copy.id;
  selectedNodeId = copy.nodes[0]?.id;
  flowCanvasOpen = options.openCanvas ?? true;
  showInspector = false;
  shouldAutoFitCanvas = true;
  saveState();
  toastMessage("Fluxo duplicado.");
  render();
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
  node.buttons?.forEach((option) => {
    if (option.next === oldId) option.next = newId;
  });
  node.quickReplies?.forEach((option) => {
    if (option.next === oldId) option.next = newId;
  });
  node.variations?.forEach((variation) => {
    if (variation.next === oldId) variation.next = newId;
  });
}

function duplicateSelectedNode() {
  const flow = selectedFlow();
  const node = flow?.nodes.find((item) => item.id === selectedNodeId);
  if (!flow || !node) return;

  const copy = JSON.parse(JSON.stringify(node));
  copy.id = makeId("node");
  copy.title = node.title ? `${node.title} cópia` : nodeLabels[node.type] || "Bloco";
  copy.next = null;
  copy.yesNext = null;
  copy.noNext = null;
  if (Array.isArray(copy.buttons)) copy.buttons = copy.buttons.map((option) => ({ ...option, id: makeId("btn"), next: null }));
  if (Array.isArray(copy.quickReplies)) copy.quickReplies = copy.quickReplies.map((option) => ({ ...option, id: makeId("qr"), next: null }));
  if (Array.isArray(copy.variations)) copy.variations = copy.variations.map((variation) => ({ ...variation, id: makeId("var"), next: null }));
  if (Array.isArray(copy.contentBlocks)) copy.contentBlocks = copy.contentBlocks.map((block) => ({ ...block, id: makeId("block") }));
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
  triggerPickerNodeId = "";
  nextStepPickerNodeId = "";
  actionPickerNodeId = "";
  canvasAddMenu = null;
  render();
}

function peekInspector() {
  const flow = selectedFlow();
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

function addMessageBlock(type) {
  const flow = selectedFlow();
  const node = flow ? selectedNode(flow) : null;
  const blockType = messageContentBlockTypes.find((item) => item.type === type);
  if (!flow || !node || node.type !== "message" || !blockType) return;
  normalizeNodeStructure(node);
  node.contentBlocks.push(defaultMessageBlock(type));
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
  node.contentBlocks = node.contentBlocks.filter((block) => block.id !== blockId);
  if (!node.contentBlocks.length) node.contentBlocks.push(defaultMessageBlock("text"));
  syncLegacyMessageFromBlocks(node);
  flow.updatedAt = new Date().toISOString();
  saveState();
  render();
}

function defaultMessageBlock(type) {
  return {
    id: makeId("block"),
    type,
    text: type === "text" ? "Nova mensagem" : "",
    url: "",
    title: type === "card" || type === "gallery" ? "Titulo" : "",
    subtitle: "",
    fileName: "",
    fieldName: "",
    endpoint: "",
    items: []
  };
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
    fieldName: "",
    fieldValue: ""
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
    quickReplies: normalizedType === "message" ? ["Sim", "Não"] : [],
    next: canAcceptIncomingConnection(previousTarget) ? previousNext : null,
    x: clampNodeX(Math.round(current.x + 340)),
    y: clampNodeY(Math.round(current.y))
  };

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

  node.next = target.id;
  flow.updatedAt = new Date().toISOString();
  selectedNodeId = node.id;
  nextStepPickerNodeId = "";
  actionPickerNodeId = "";
  showInspector = true;
  saveState();
  render();
}

function nextStepType(type) {
  if (["message", "action", "condition", "delay", "randomizer"].includes(type)) return type;
  return "";
}

function fitCanvasToViewport() {
  const canvas = document.querySelector("#flowCanvas");
  const flow = selectedFlow();
  if (!canvas || !flow?.nodes?.length) return;

  const bounds = flow.nodes.reduce(
    (box, node) => ({
      minX: Math.min(box.minX, node.x),
      minY: Math.min(box.minY, node.y),
      maxX: Math.max(box.maxX, node.x + NODE_WIDTH + 120),
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
  navigate("inbox");
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

function addTagFromContactEditor(contactId, inputId) {
  const contact = state.contacts.find((item) => item.id === contactId);
  const input = inputId ? document.getElementById(inputId) : null;
  const value = input?.value.trim();
  if (!contact || !value) return;

  addTagToContact(contact, value);
  if (input) input.value = "";
  saveState();
  syncContactToServer(contact, { action: "add_tag", tag: value });
  render();
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
  const tags = normalizeTags([...contactTags(contact), value]);
  contact.tags = tags;
  contact.tag = tags[0] || "";
  contact.lastSeen = contact.lastSeen || new Date().toISOString();
}

function removeTagFromContact(contact, value) {
  const target = normalize(value);
  const tags = contactTags(contact).filter((tagName) => normalize(tagName) !== target);
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
    if (current.type === "condition") {
      messages.push({ from: "system", text: conditionMatchesNode(current, context) ? "Condição: caminho SIM" : "Condição: caminho NÃO" });
    }
    if (current.type === "randomizer") {
      const variation = pickRandomVariation(current, context);
      messages.push({ from: "system", text: `Randomizador: ${variation?.label || "sem caminho"}` });
    }
    current = current.type === "comment" ? null : nextExecutableNode(flow, current, context);
  }

  if (messages.length === 1) {
    messages.push({ from: "bot", text: state.settings.defaultReply });
  }

  return messages;
}

function interactiveStartNode(flow, context) {
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
    else if (["image", "audio", "video", "file"].includes(block.type)) messages.push({ from: "bot", text: `${messageBlockTypeLabel(block.type)}: ${block.url || "sem URL"}` });
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
  if (node.delayType === "dynamic_date") return `Atraso até o campo ${node.dynamicField || "não definido"}`;
  return `Atraso de ${node.delayValue || node.delayMinutes || 0} ${node.delayUnit || "minutes"}`;
}

function triggerMatchesSimulation(node, flow, normalizedText) {
  const triggers = nodeTriggerEvents(node);
  const keywords = node.keyword || flow.trigger || "";
  return triggers.some((trigger) => {
    if (trigger === "messenger_message") return keywordMatches(keywords, normalizedText);
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
    if (step.type === "set_user_field" && step.fieldName) {
      contact.customFields = contact.customFields && typeof contact.customFields === "object" ? contact.customFields : {};
      contact.customFields[step.fieldName] = step.fieldValue || "";
    }
    if (step.type === "clear_custom_field" && step.fieldName && contact.customFields) {
      delete contact.customFields[step.fieldName];
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

      const start = nodeOutputPoint(source);
      const tempPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      tempPath.setAttribute("class", "connection-temp");
      layer.appendChild(tempPath);

      const onMove = (moveEvent) => {
        moveEvent.preventDefault();
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
          assignPrimaryTarget(source, target.id);
          selectedNodeId = source.id;
          flow.updatedAt = new Date().toISOString();
          rememberCanvasScroll();
          saveState();
          render();
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

function assignPrimaryTarget(node, targetId) {
  normalizeNodeStructure(node);
  if (node.type === "condition") {
    if (!node.yesNext) node.yesNext = targetId;
    else node.noNext = targetId;
    return;
  }
  if (node.type === "randomizer") {
    const empty = node.variations.find((variation) => !variation.next) || node.variations[0];
    if (empty) empty.next = targetId;
    return;
  }
  node.next = targetId;
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

    const shellRect = shell.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const zoom = canvasZoom || 1;
    const stageX = (canvas.scrollLeft + event.clientX - canvasRect.left) / zoom;
    const stageY = (canvas.scrollTop + event.clientY - canvasRect.top) / zoom;

    canvasAddMenu = {
      left: clamp(event.clientX - shellRect.left, 8, shell.clientWidth - 176),
      top: clamp(event.clientY - shellRect.top, 52, shell.clientHeight - 270),
      x: clampNodeX(stageX - CANVAS_ORIGIN_X - NODE_WIDTH / 2),
      y: clampNodeY(stageY - CANVAS_ORIGIN_Y - NODE_CENTER_Y)
    };

    rememberCanvasScroll();
    render();
  });
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
  const svg = miniMap?.querySelector("svg");
  if (!miniMap || !canvas || !svg) return;

  const moveToEventPoint = (event, options = {}) => {
    event.preventDefault();
    event.stopPropagation();
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
      miniMap.removeEventListener("pointermove", onMove);
      miniMap.removeEventListener("pointerup", onUp);
      if (miniMap.hasPointerCapture?.(event.pointerId)) miniMap.releasePointerCapture(event.pointerId);
      rememberCanvasScroll();
    };

    miniMap.addEventListener("pointermove", onMove);
    miniMap.addEventListener("pointerup", onUp);
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
  triggerPickerNodeId = "";
  nextStepPickerNodeId = "";
  actionPickerNodeId = "";
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

function updateLiveConnections(flow) {
  const layer = document.querySelector(".connection-layer");
  if (!layer) return;
  layer.innerHTML = renderConnections(flow);
}

function updateMiniMap(flow = selectedFlow()) {
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
      connectionTargets(flow, node).map(({ target }) => {
        return `<line class="minimap-link" x1="${miniX(canvasNodeLeft(node) + NODE_WIDTH)}" y1="${miniY(canvasNodeTop(node) + NODE_CONNECT_Y)}" x2="${miniX(canvasNodeLeft(target))}" y2="${miniY(canvasNodeTop(target) + NODE_CONNECT_Y)}" />`;
      })
    )
    .join("");
  const nodes = flow.nodes
    .map((node) => {
      const width = Math.max(4, (NODE_WIDTH / CANVAS_WIDTH) * MINIMAP_WIDTH);
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
  return flow.nodes
    .flatMap((node) =>
      connectionTargets(flow, node).map(({ target, label }, index) => {
      const start = nodeOutputPoint(node);
      const end = nodeInputPoint(target);
      const offset = index * 8;
      return `<path d="${connectionPath(start.x, start.y + offset, end.x, end.y)}" /><text class="connection-label" x="${miniNumber((start.x + end.x) / 2)}" y="${miniNumber((start.y + end.y) / 2 + offset - 6)}">${escapeHtml(label || "")}</text>`;
      })
    )
    .join("");
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
  if (node.type === "randomizer") {
    return node.variations
      .filter((variation) => variation.next)
      .map((variation) => ({ targetId: variation.next, label: `${variation.label || "Variação"} ${variation.weight || 0}%`, variationId: variation.id }));
  }
  if (node.type === "message") {
    if (node.next) refs.push({ targetId: node.next, label: "Depois", field: "next" });
    node.buttons.forEach((option) => {
      if (option.next) refs.push({ targetId: option.next, label: option.title, optionId: option.id, kind: "button" });
    });
    node.quickReplies.forEach((option) => {
      if (option.next) refs.push({ targetId: option.next, label: option.title, optionId: option.id, kind: "quick_reply" });
    });
    return refs;
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
  if (node.type === "message") {
    const option = matchingMessageOption(node, context);
    return option?.next || node.next || null;
  }
  return node.next || null;
}

function matchingMessageOption(node, context = {}) {
  const input = normalize(context.inputText || context.normalizedText || "");
  if (!input) return null;
  return [...(node.buttons || []), ...(node.quickReplies || [])].find((option) => {
    return normalize(option.id) === input || normalize(option.title) === input;
  });
}

function conditionMatchesNode(node, context = {}) {
  const normalizedInput = normalize(context.inputText || context.normalizedText || "");
  const rawTerms = String(node.keyword || "")
    .split(",")
    .map((item) => normalize(item.trim()))
    .filter(Boolean);
  const operator = node.conditionOperator || "contains_any";

  if (node.conditionType === "tag") {
    const tags = normalizeTags(context.contact?.tags || context.contact?.tag).map(normalize);
    return rawTerms.length ? rawTerms.some((term) => tags.includes(term)) : false;
  }

  if (node.conditionType === "field") {
    const value = normalize(context.contact?.customFields?.[node.fieldName] || "");
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
    persistLocalState();
    if (!flowStore.loading) syncFlowToServer(flow);
  }
}

function connectionPath(x1, y1, x2, y2) {
  const mid = Math.max(60, Math.abs(x2 - x1) / 2);
  return `M ${x1} ${y1} C ${x1 + mid} ${y1}, ${x2 - mid} ${y2}, ${x2} ${y2}`;
}

function nodeOutputPoint(node) {
  return {
    x: canvasNodeLeft(node) + NODE_WIDTH,
    y: canvasNodeTop(node) + NODE_CONNECT_Y
  };
}

function nodeInputPoint(node) {
  return {
    x: canvasNodeLeft(node),
    y: canvasNodeTop(node) + NODE_CONNECT_Y
  };
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
  if (node.type === "comment") return renderCommentNode(node, selected);

  const icon = icons[node.type] || icons.message;
  normalizeNodeStructure(node);
  const summary = nodeCardSummary(node);
  const quickReplies = node.quickReplies?.length ? `${node.quickReplies.length} respostas rápidas` : "Sem respostas rápidas";
  return `
    <article class="node ${node.type} ${selected ? "selected" : ""}" data-action="select-node" data-id="${node.id}" style="left:${canvasNodeLeft(node)}px; top:${canvasNodeTop(node)}px">
      ${renderNodeHoverActions(node)}
      <div class="node-head">
        <div class="node-title">
          ${icon}
          <span>
            <span class="node-type">${nodeLabels[node.type]}</span>
            <strong>${escapeHtml(node.title)}</strong>
          </span>
        </div>
        <button class="node-action" type="button" data-action="select-node" data-id="${node.id}" title="Editar bloco">${icons.settings}</button>
      </div>
      <p>${escapeHtml(summary.body)}</p>
      <div class="node-footer">
        <span>${escapeHtml(summary.footer)}</span>
        <span>${escapeHtml(summary.status)}</span>
      </div>
      ${renderOutputPort(node)}
    </article>
  `;
}

function nodeCardSummary(node) {
  const flow = selectedFlow() || { nodes: [] };
  if (node.type === "message") {
    const blockCount = node.contentBlocks?.length || 0;
    const choices = (node.buttons?.length || 0) + (node.quickReplies?.length || 0);
    return {
      body: node.contentBlocks?.find((block) => block.type === "text")?.text || node.message || "Mensagem do Messenger",
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

function renderCommentNode(node, selected) {
  return `
    <article class="node comment ${selected ? "selected" : ""}" data-action="select-node" data-id="${node.id}" style="left:${canvasNodeLeft(node)}px; top:${canvasNodeTop(node)}px">
      ${renderNodeHoverActions(node)}
      <div class="node-head">
        <div class="node-title">
          ${icons.comment}
          <span>
            <span class="node-type">Comentário</span>
            <strong>${escapeHtml(node.title || "Comentário")}</strong>
          </span>
        </div>
      </div>
      <p>${escapeHtml(node.message || "Anotação interna do fluxo.")}</p>
    </article>
  `;
}

function renderActionNode(node, selected) {
  const steps = nodeActionSteps(node);
  return `
    <article class="node action action-node ${selected ? "selected" : ""}" data-action="select-node" data-id="${node.id}" style="left:${canvasNodeLeft(node)}px; top:${canvasNodeTop(node)}px">
      ${renderNodeHoverActions(node)}
      <div class="action-node-head">
        <span>${icons.action}</span>
        <strong>Ações</strong>
      </div>
      <div class="action-node-body">
        ${
          steps.length
            ? `<div class="action-node-list">${steps.slice(0, 3).map((step) => `<span>${escapeHtml(actionStepSummary(step))}</span>`).join("")}</div>`
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

function renderTriggerNode(node, selected) {
  const activeTriggers = nodeTriggerEvents(node);
  const triggerSummary = activeTriggers
    .map((id) => triggerOptionById(id)?.title)
    .filter(Boolean)
    .slice(0, 2);

  return `
    <article class="node trigger trigger-start ${selected ? "selected" : ""}" data-action="select-node" data-id="${node.id}" style="left:${canvasNodeLeft(node)}px; top:${canvasNodeTop(node)}px">
      ${renderNodeHoverActions(node)}
      <div class="node-head">
        <div class="node-title">
          ${icons.trigger}
          <span>
            <strong>Quando...</strong>
            <span class="node-type">Gatilho inicial</span>
          </span>
        </div>
      </div>
      <p>O gatilho é responsável por acionar a automação. Clique para adicionar um gatilho.</p>
      <div class="trigger-list">
        ${
          triggerSummary.length
            ? triggerSummary.map((title) => `<span>${escapeHtml(title)}</span>`).join("")
            : `<span>Nenhum gatilho configurado</span>`
        }
      </div>
      <button class="trigger-add-button" type="button" data-action="open-trigger-picker" data-id="${node.id}">+ Novo Gatilho</button>
      <div class="node-footer">
        <span>Entrada</span>
      </div>
      ${renderOutputPort(node)}
    </article>
  `;
}

function nodeAddButton(type, label) {
  return `<button class="chip-button" type="button" data-action="add-node" data-type="${type}" title="${attr(label)}">${icons[type]}<span>${label}</span></button>`;
}

function renderOutputPort(node) {
  if (node.type === "comment") return "";
  return `<button class="node-port" type="button" data-port-source="${attr(node.id)}" aria-label="Conectar próximo passo"></button>`;
}

function renderNodeHoverActions(node) {
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
  if (step.type === "set_user_field") return step.fieldName ? `Definir campo: ${step.fieldName}` : "Definir campo";
  if (step.type === "clear_custom_field") return step.fieldName ? `Limpar campo: ${step.fieldName}` : "Limpar campo";
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

function renderMetaConversationMessages(messages, pageId) {
  const ordered = messages.slice().reverse();
  return ordered
    .map((message, index) => {
      const direction = message.from?.id === pageId ? "outbound" : "inbound";
      return renderConversationBubble({
        direction,
        content: renderMessageContent(message),
        sender: message.from?.name || "",
        time: messageTimeValue(message),
        showTime: shouldShowBubbleTime(message, ordered[index - 1])
      });
    })
    .join("");
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

function shouldShowBubbleTime(message, previousMessage) {
  const currentKey = messageHourKey(messageTimeValue(message));
  if (!currentKey) return false;
  return currentKey !== messageHourKey(messageTimeValue(previousMessage));
}

function messageTimeValue(message) {
  return message?.created_time || message?.at || message?.timestamp || "";
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
  if (fieldName === "next") return value || null;
  return value;
}

function delayToMinutes(node) {
  const value = Math.max(0, Number(node.delayValue ?? node.delayMinutes) || 0);
  if (node.delayUnit === "hours") return value * 60;
  if (node.delayUnit === "days") return value * 24 * 60;
  return value;
}

function syncLegacyMessageFromBlocks(node) {
  const firstText = node.contentBlocks?.find((block) => block.type === "text" && block.text);
  if (firstText) node.message = firstText.text;
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
  if (target.dataset.targetVariationId && node.type === "randomizer") {
    const variation = node.variations?.find((item) => item.id === target.dataset.targetVariationId);
    if (variation) variation.next = value;
    return;
  }
  if (field) node[field] = value;
}

function defaultNodeMessage(type) {
  const messages = {
    message: "Digite a mensagem que a página enviará no Messenger.",
    condition: "Defina palavras-chave ou critérios para seguir este caminho.",
    delay: "Aguardar alguns minutos antes de continuar.",
    action: "Aplicar tag, abrir conversa ou notificar atendimento.",
    randomizer: "Distribuir contatos entre caminhos aleatórios.",
    comment: "Anotação interna do fluxo.",
    trigger: "Mensagem recebida no Messenger."
  };
  return messages[type] || messages.message;
}

function navigate(view) {
  activeView = view;
  if (view === "flows") {
    flowCanvasOpen = false;
    showInspector = false;
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
    pages: "Buscar Página ou conversa",
    flows: "Buscar fluxo ou gatilho",
    inbox: "Buscar conversa Messenger",
    subscribers: "Buscar assinante ou PSID",
    broadcasts: "Buscar disparo",
    image: "Limpar metadados de imagem",
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

function statusBadge(status) {
  return `<span class="badge ${status}">${statusLabel(status)}</span>`;
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
  const inputId = `tag_input_${String(contact.id || contact.psid).replace(/[^a-z0-9_-]/gi, "_")}`;
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
      <div class="tag-editor-row">
        <input id="${attr(inputId)}" placeholder="Nova tag" />
        <button class="icon-button" type="button" data-action="add-contact-tag" data-id="${attr(contact.id)}" data-input-id="${attr(inputId)}" title="Adicionar tag">${icons.plus}</button>
      </div>
    </div>
  `;
}

function contactTags(contact) {
  return normalizeTags(contact?.tags ?? contact?.tag);
}

function normalizeTags(value) {
  const raw = Array.isArray(value) ? value : String(value || "").split(",");
  return unique(raw.map((item) => String(item || "").trim()).filter(Boolean));
}

function contactHasTag(contact, value) {
  const target = normalize(value);
  return contactTags(contact).some((tagName) => normalize(tagName) === target);
}

function allContactTags(contacts = state.contacts) {
  return unique(contacts.flatMap((contact) => contactTags(contact))).sort((a, b) => a.localeCompare(b));
}

function contactSearchText(contact) {
  return `${contact.name} ${contact.psid} ${contactTags(contact).join(" ")} ${contact.source} ${lastMessage(contact)?.text || ""}`;
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

  return {
    id: `${page.id}:${psid}`,
    psid,
    pageId: page.id,
    pageName: page.name,
    name: conversationTitle(conversation, page.name),
    lastSeen: conversation.updated_time,
    source: "Messenger",
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
  const person = participants.find((participant) => participant.name !== pageName) || participants[0];
  return person?.name || conversation.id;
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
  const rows = state.contacts.map((contact) =>
    [contact.name, contact.psid, contactTags(contact).join("|"), contact.status, contact.source, contact.pageId]
      .map((value) => `"${String(value).replaceAll('"', '""')}"`)
      .join(",")
  );
  downloadFile("messenlead-assinantes.csv", [header, ...rows].join("\n"), "text/csv");
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
