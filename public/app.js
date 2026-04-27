const STORAGE_KEY = "messenlead.messenger.workspace.v2";
const SIDEBAR_COLLAPSED_KEY = "messenlead.sidebar.collapsed";

const navItems = [
  { id: "dashboard", label: "Painel", icon: "dashboard" },
  { id: "pages", label: "Páginas", icon: "pages" },
  { id: "flows", label: "Fluxos", icon: "workflow" },
  { id: "inbox", label: "Inbox", icon: "inbox" },
  { id: "subscribers", label: "Assinantes", icon: "users" },
  { id: "broadcasts", label: "Disparos", icon: "send" },
  { id: "setup", label: "Messenger", icon: "plug" },
  { id: "settings", label: "Ajustes", icon: "settings" }
];

const nodeLabels = {
  trigger: "Gatilho",
  message: "Mensagem",
  condition: "Condição",
  delay: "Espera",
  action: "Ação"
};

const CANVAS_WIDTH = 1500;
const CANVAS_HEIGHT = 980;
const NODE_WIDTH = 228;
const NODE_CENTER_Y = 70;
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
  trigger: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 13a8 8 0 0 1 16 0"/><path d="M12 13V5m0 8 4-4m-4 4-4-4"/><path d="M5 19h14"/></svg>`
};

const appShell = document.querySelector(".app-shell");
const workspace = document.querySelector("#workspace");
const mainNav = document.querySelector("#mainNav");
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
const storedCanvasZoom = localStorage.getItem("messenlead.canvas.zoom");
let canvasZoom = Number(storedCanvasZoom) || 0.78;
let shouldAutoFitCanvas = !storedCanvasZoom;
let flowCanvasOpen = false;
let showFlowList = localStorage.getItem("messenlead.canvas.flowList") === "true";
let showInspector = localStorage.getItem("messenlead.canvas.inspector") === "true";
let flowStore = {
  pageId: "",
  loading: false,
  serverAvailable: null,
  status: "Local",
  saveTimer: null
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

mainNav.addEventListener("click", (event) => {
  const button = event.target.closest("[data-view]");
  if (!button) return;
  activeView = button.dataset.view;
  if (activeView === "flows") flowCanvasOpen = false;
  history.replaceState(null, "", `#${activeView}`);
  render();
});

workspace.addEventListener("click", handleWorkspaceClick);
workspace.addEventListener("input", handleWorkspaceInput);
workspace.addEventListener("change", handleWorkspaceChange);
workspace.addEventListener("keydown", handleWorkspaceKeydown);
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
  if (activeView === "flows") flowCanvasOpen = false;
  render();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modalState) closeModal();
});

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

  return {
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
}

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return seedWorkspace();
    const parsed = JSON.parse(stored);
    if (!parsed.flows || !parsed.contacts || !parsed.campaigns) return seedWorkspace();
    return parsed;
  } catch {
    return seedWorkspace();
  }
}

function saveState() {
  persistLocalState();
  scheduleFlowSave();
}

function persistLocalState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
  renderNav();
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
    setup: renderSetup,
    settings: renderSettings
  };

  renderers[activeView]();
}

function renderNav() {
  const counts = {
    dashboard: "",
    pages: metaState.pages?.length || "",
    flows: state.flows.filter((flow) => flow.status === "active").length,
    inbox: state.contacts.filter((contact) => contact.status === "open").length,
    subscribers: state.contacts.length,
    broadcasts: state.campaigns.filter((campaign) => campaign.status !== "sent").length,
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

function renderDashboard() {
  const open = state.contacts.filter((contact) => contact.status === "open").length;
  const activeFlows = state.flows.filter((flow) => flow.status === "active").length;
  const scheduled = state.campaigns.filter((campaign) => campaign.status === "scheduled").length;
  const hotLeads = state.contacts.filter((contact) => contact.tag === "lead-quente").length;

  workspace.innerHTML = `
    <section class="metric-grid" aria-label="Indicadores">
      ${metricCard("Assinantes Messenger", state.contacts.length, "PSIDs salvos neste workspace", "users")}
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
          ${state.contacts
            .slice(0, 4)
            .map(
              (contact) => `
                <button class="contact-item" type="button" data-action="open-contact" data-id="${contact.id}">
                  <span class="avatar">${initials(contact.name)}</span>
                  <span>
                    <span class="row-between"><strong>${escapeHtml(contact.name)}</strong>${tag(contact.tag)}</span>
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

  const conversations = metaState.conversations || [];
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
                    <span>Conversas reais do Messenger desta Página</span>
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
                              <button class="campaign-item ${selectedConversation?.id === conversation.id ? "active" : ""}" type="button" data-action="select-meta-conversation" data-id="${conversation.id}">
                                <strong>${escapeHtml(conversationTitle(conversation, selectedPage.name))}</strong>
                                <span>${escapeHtml(conversation.snippet || "Sem prévia")}</span>
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
                        <div class="conversation">
                          ${
                            metaState.messages
                              ? metaState.messages
                                  .slice()
                                  .reverse()
                                  .map((message) => {
                                    const direction = message.from?.id === selectedPage.id ? "outbound" : "inbound";
                                    return `
                                      <div class="bubble ${direction}">
                                        ${renderMessageContent(message)}
                                        <span class="muted">${escapeHtml(message.from?.name || "")}</span>
                                      </div>
                                    `;
                                  })
                                  .join("")
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

  const node = selectedNode(flow) || flow.nodes[0];
  if (node) selectedNodeId = node.id;
  canvasZoom = clamp(canvasZoom, ZOOM_MIN, ZOOM_MAX);

  workspace.innerHTML = `
    <div class="page-grid canvas-focused ${showFlowList ? "show-flow-list" : ""} ${showInspector ? "show-inspector" : ""}">
      <section class="panel flow-sidebar">
        <div class="panel-header">
          <div>
            <h2>Fluxos Messenger</h2>
            <span>Gatilhos, mensagens, condições e handoff</span>
          </div>
          <div class="button-row">
            <button class="icon-button" type="button" data-action="new-flow" title="Novo fluxo">${icons.plus}</button>
            <button class="icon-button" type="button" data-action="toggle-flow-list" title="Fechar lista">&times;</button>
          </div>
        </div>
        <div class="panel-body flow-list">
          ${filteredFlows
            .map(
              (item) => `
                <button class="flow-item ${item.id === flow.id ? "active" : ""}" type="button" data-action="select-flow" data-id="${item.id}">
                  <span class="row-between">
                    <strong>${escapeHtml(item.name)}</strong>
                    ${statusBadge(item.status)}
                  </span>
                  <span>${item.nodes.length} blocos · ${escapeHtml(item.trigger)}</span>
                </button>
              `
            )
            .join("")}
        </div>
      </section>

      <section class="panel canvas-shell">
        <div class="canvas-toolbar">
          <div class="tight-stack">
            <input class="field-input" data-flow-field="name" value="${attr(flow.name)}" aria-label="Nome do fluxo" />
            <span class="muted">${escapeHtml(flow.goal)}</span>
          </div>
          <span class="sync-pill ${flowStore.serverAvailable ? "synced" : "local"}">${escapeHtml(flowStore.loading ? "Carregando D1" : flowStore.status)}</span>
          <div class="canvas-panel-controls" aria-label="Painéis do canvas">
            <button class="secondary-button" type="button" data-action="back-to-flows">${icons.workflow}<span>Todos</span></button>
            <button class="secondary-button ${showFlowList ? "active" : ""}" type="button" data-action="toggle-flow-list">${icons.workflow}<span>Fluxos</span></button>
            <button class="secondary-button ${showInspector ? "active" : ""}" type="button" data-action="toggle-inspector">${icons.settings}<span>Editar</span></button>
          </div>
          <div class="canvas-actions">
            ${nodeAddButton("message", "Mensagem")}
            ${nodeAddButton("condition", "Condição")}
            ${nodeAddButton("delay", "Espera")}
            ${nodeAddButton("action", "Ação")}
            <button class="secondary-button" type="button" data-action="duplicate-flow">${icons.copy}<span>Duplicar</span></button>
          </div>
          <div class="canvas-zoom" aria-label="Zoom do canvas">
            <button class="icon-button" type="button" data-action="canvas-zoom-out" title="Diminuir zoom">-</button>
            <button class="secondary-button" type="button" data-action="canvas-fit"><span>Ajustar</span></button>
            <span>${Math.round(canvasZoom * 100)}%</span>
            <button class="icon-button" type="button" data-action="canvas-zoom-in" title="Aumentar zoom">+</button>
          </div>
        </div>
        <div class="flow-canvas" id="flowCanvas" style="--canvas-zoom:${canvasZoom}">
          <div class="canvas-world" style="width:${CANVAS_WIDTH * canvasZoom}px; height:${CANVAS_HEIGHT * canvasZoom}px">
            <div class="canvas-stage" style="width:${CANVAS_WIDTH}px; height:${CANVAS_HEIGHT}px">
              <svg class="connection-layer" viewBox="0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}" aria-hidden="true">
                ${renderConnections(flow)}
              </svg>
              ${flow.nodes.map((item) => renderNode(item, item.id === node?.id)).join("")}
            </div>
          </div>
        </div>
      </section>

      <aside class="panel inspector">
        <div class="panel-header">
          <div>
            <h2>Inspetor</h2>
            <span>${node ? nodeLabels[node.type] : "Selecione um bloco"}</span>
          </div>
          <div class="button-row">
            <div class="segmented" aria-label="Status do fluxo">
              ${["draft", "active", "paused"]
                .map((status) => `<button class="${flow.status === status ? "active" : ""}" type="button" data-action="set-flow-status" data-status="${status}">${statusLabel(status)}</button>`)
                .join("")}
            </div>
            <button class="icon-button" type="button" data-action="toggle-inspector" title="Fechar inspetor">&times;</button>
          </div>
        </div>
        <div class="panel-body stack">
          ${node ? renderInspector(flow, node) : ""}
          ${renderSimulator()}
        </div>
      </aside>
    </div>
  `;

  enableNodeDragging(flow);
  if (shouldAutoFitCanvas) {
    shouldAutoFitCanvas = false;
    requestAnimationFrame(() => fitCanvasToViewport());
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
        <button class="icon-button" type="button" data-action="duplicate-flow-card" data-id="${flow.id}" title="Duplicar fluxo">${icons.copy}</button>
        <button class="icon-button danger-icon" type="button" data-action="delete-flow-card" data-id="${flow.id}" title="Excluir fluxo">${icons.trash}</button>
      </div>
    </article>
  `;
}

function renderInbox() {
  const filtered = filterBySearch(state.contacts, (contact) => `${contact.name} ${contact.psid} ${contact.tag} ${lastMessage(contact)?.text || ""}`);
  const contact = selectedContact() || filtered[0] || state.contacts[0];
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
                    <span class="row-between"><strong>${escapeHtml(item.name)}</strong>${tag(item.tag)}</span>
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
                ${tag(contact.tag)}
                <button class="secondary-button" type="button" data-action="run-contact-flow">${icons.play}<span>Aplicar fluxo</span></button>
                <button class="secondary-button" type="button" data-action="toggle-contact-status">${contact.status === "open" ? "Fechar" : "Reabrir"}</button>
              </div>
            </div>
          </div>
          <div class="conversation" id="conversation">
            ${contact.messages
              .map(
                (message) => `
                  <div class="bubble ${message.from === "contact" ? "inbound" : "outbound"}">
                    ${escapeHtml(message.text)}
                  </div>
                `
              )
              .join("")}
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
  const tags = unique(state.contacts.map((contact) => contact.tag));
  const filtered = filterBySearch(state.contacts, (contact) => `${contact.name} ${contact.psid} ${contact.tag} ${contact.source}`);

  workspace.innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2>Assinantes Messenger</h2>
          <span>Base capturada pela página e pelos fluxos</span>
        </div>
        <div class="button-row">
          <button class="secondary-button" type="button" data-action="export-csv">${icons.copy}<span>CSV</span></button>
          <button class="primary-button" type="button" data-action="new-contact">${icons.plus}<span>Novo</span></button>
        </div>
      </div>
      <div class="filter-bar">
        ${tags.map((value) => `<span class="tag">${escapeHtml(value)}</span>`).join("")}
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>PSID</th>
              <th>Tag</th>
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
                    <td>${tag(contact.tag)}</td>
                    <td>${contact.status === "open" ? "Aberta" : "Fechada"}</td>
                    <td>${escapeHtml(contact.source)}</td>
                    <td>${escapeHtml(lastMessage(contact)?.text || "-")}</td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderBroadcasts() {
  const filteredCampaigns = filterBySearch(state.campaigns, (campaign) => `${campaign.name} ${campaign.audienceTag} ${campaign.message}`);
  const totalEligible = eligibleContactsForBroadcast().length;
  const openContacts = state.contacts.filter((contact) => contact.status === "open").length;
  const outsideWindow = state.contacts.filter((contact) => contact.psid && contact.status === "open" && !isInsideMessengerReplyWindow(contact)).length;

  workspace.innerHTML = `
    <div class="two-column">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h2>Disparos Messenger</h2>
            <span>Use apenas para contatos elegíveis pela política da Meta</span>
          </div>
          <button class="primary-button" type="button" data-action="new-campaign">${icons.plus}<span>Novo disparo</span></button>
        </div>
        <div class="broadcast-summary">
          <span>
            <strong>${totalEligible}</strong>
            <span>Aptos agora</span>
          </span>
          <span>
            <strong>${openContacts}</strong>
            <span>Conversas abertas</span>
          </span>
          <span>
            <strong>${outsideWindow}</strong>
            <span>Fora da janela 24h</span>
          </span>
        </div>
        <div class="panel-body campaign-list">
          ${filteredCampaigns
            .map(
              (campaign) => {
                const audience = state.contacts.filter((contact) => contact.tag === campaign.audienceTag).length;
                const eligibleAudience = eligibleContactsForBroadcast(campaign.audienceTag).length;
                return `
                  <article class="campaign-item">
                    <div class="row-between">
                      <div>
                        <strong>${escapeHtml(campaign.name)}</strong>
                        <span>${eligibleAudience} apto${eligibleAudience === 1 ? "" : "s"} de ${audience} com tag ${escapeHtml(campaign.audienceTag)}</span>
                      </div>
                      ${statusBadge(campaign.status)}
                    </div>
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
            <h2>Regra importante</h2>
            <span>Messenger Platform</span>
          </div>
        </div>
        <div class="panel-body stack">
          <p class="muted">Mensagens promocionais só devem ser enviadas para usuários que aceitaram contato e dentro das janelas permitidas pela Meta. Para produção, implemente validação de política antes do envio real.</p>
          <div class="code-block">POST /api/messenger/send
Authorization: Bearer MESSENLEAD_OPERATOR_TOKEN
{
  "psid": "PSID_...",
  "text": "Mensagem aprovada"
}</div>
        </div>
      </aside>
    </div>
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
            ${integrationCard("Campos", "Assine eventos necessários para automação.", "messages, messaging_postbacks, messaging_optins", "copy-fields")}
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
  workspace.innerHTML = `
    <div class="settings-grid">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h2>Ajustes da Página</h2>
            <span>Dados usados pelo simulador e pelas funções serverless</span>
          </div>
        </div>
        <div class="panel-body inspector-form">
          ${field("Nome da página", "pageName", state.settings.pageName)}
          ${field("Page ID", "pageId", state.settings.pageId)}
          ${field("Saudação", "greeting", state.settings.greeting, "textarea")}
          ${field("Resposta padrão", "defaultReply", state.settings.defaultReply, "textarea")}
          ${field("Verify token", "verifyToken", state.settings.verifyToken)}
          ${field("Operator token", "operatorToken", state.settings.operatorToken)}
          ${field("Horário de atendimento", "businessHours", state.settings.businessHours)}
          ${field("Timezone", "timezone", state.settings.timezone)}
        </div>
      </section>

      <aside class="panel">
        <div class="panel-header">
          <div>
            <h2>Workspace local</h2>
            <span>Persistido no navegador</span>
          </div>
        </div>
        <div class="panel-body stack">
          <p class="muted">Este painel salva dados no localStorage. Em produção, use Cloudflare KV, D1 ou um banco externo para assinantes, conversas e auditoria.</p>
          <button class="secondary-button" type="button" data-action="export-json">${icons.copy}<span>Exportar backup</span></button>
          <button class="danger-button" type="button" data-action="reset-workspace">${icons.trash}<span>Restaurar modelo inicial</span></button>
        </div>
      </aside>
    </div>
  `;
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
    metaState.conversations = result.conversations || [];
    metaState.selectedConversationId = metaState.conversations[0]?.id || "";
    metaState.messages = null;
  } catch (error) {
    metaState.conversations = [];
    metaState.error = error.message;
    toastMessage(error.message);
  } finally {
    render();
  }
}

async function loadMetaMessages(pageId, conversationId) {
  try {
    const result = await apiGet(
      `/api/meta/messages?pageId=${encodeURIComponent(pageId)}&conversationId=${encodeURIComponent(conversationId)}`
    );
    metaState.messages = result.messages || [];
    metaState.error = "";
  } catch (error) {
    metaState.messages = [];
    metaState.error = error.message;
    toastMessage(error.message);
  } finally {
    render();
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
  const page = metaState.pages?.find((item) => item.id === pageId);
  metaState.selectedPageId = pageId;
  metaState.conversations = null;
  metaState.selectedConversationId = "";
  metaState.messages = null;

  if (page) {
    state.settings.pageId = page.id;
    state.settings.pageName = page.name;
    saveState();
    flowStore.pageId = "";
    loadFlowsForPage(page.id);
  }

  render();
}

function refreshMetaConversations() {
  if (!metaState.selectedPageId) return;
  metaState.conversations = null;
  metaState.messages = null;
  render();
}

function selectMetaConversation(conversationId) {
  metaState.selectedConversationId = conversationId;
  metaState.messages = null;
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
  const page = metaState.pages?.find((item) => item.id === metaState.selectedPageId);
  if (page) {
    state.settings.pageId = page.id;
    state.settings.pageName = page.name;
    saveState();
    flowStore.pageId = "";
  }
  navigate("flows");
}

async function loadFlowsForPage(pageId) {
  const normalizedPageId = pageId || "__global__";
  flowStore = {
    ...flowStore,
    pageId: normalizedPageId,
    loading: true,
    status: "Carregando D1"
  };

  try {
    const result = await apiGet(`/api/flows?pageId=${encodeURIComponent(normalizedPageId)}`);
    flowStore.serverAvailable = true;

    if (Array.isArray(result.flows) && result.flows.length) {
      state.flows = result.flows;
      selectedFlowId = state.flows[0]?.id;
      selectedNodeId = state.flows[0]?.nodes[0]?.id;
      persistLocalState();
      flowStore.status = "Salvo no D1";
    } else if (state.flows.length) {
      await apiPost("/api/flows", { pageId: normalizedPageId, flows: state.flows });
      flowStore.status = "Modelo salvo no D1";
    } else {
      flowStore.status = "D1 sem fluxos";
    }
  } catch (error) {
    flowStore.serverAvailable = false;
    flowStore.status = flowStoreStatusFromError(error);
  } finally {
    flowStore.loading = false;
    if (activeView === "flows") render();
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
  return metaState.selectedPageId || state.settings.pageId || "__global__";
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

function renderInspector(flow, node) {
  const options = [`<option value="">Fim do fluxo</option>`]
    .concat(
      flow.nodes
        .filter((item) => item.id !== node.id)
        .map((item) => `<option value="${item.id}" ${node.next === item.id ? "selected" : ""}>${escapeHtml(item.title)}</option>`)
    )
    .join("");

  return `
    <form class="inspector-form">
      <div class="field">
        <label for="nodeType">Tipo</label>
        <select id="nodeType" data-node-field="type">
          ${Object.entries(nodeLabels).map(([value, label]) => `<option value="${value}" ${node.type === value ? "selected" : ""}>${label}</option>`).join("")}
        </select>
      </div>
      <div class="field">
        <label for="nodeTitle">Título</label>
        <input id="nodeTitle" data-node-field="title" value="${attr(node.title)}" />
      </div>
      <div class="field">
        <label for="nodeMessage">Mensagem ou instrução</label>
        <textarea id="nodeMessage" data-node-field="message">${escapeHtml(node.message || "")}</textarea>
      </div>
      <div class="inline-fields">
        <div class="field">
          <label for="nodeKeyword">Palavras-chave</label>
          <input id="nodeKeyword" data-node-field="keyword" value="${attr(node.keyword || "")}" placeholder="oi, preço, suporte" />
        </div>
        <div class="field">
          <label for="nodeTag">Tag</label>
          <input id="nodeTag" data-node-field="tag" value="${attr(node.tag || "")}" placeholder="lead-quente" />
        </div>
      </div>
      <div class="field">
        <label for="quickReplies">Respostas rápidas</label>
        <input id="quickReplies" data-node-field="quickReplies" value="${attr((node.quickReplies || []).join(", "))}" placeholder="Sim, Não, Falar com humano" />
      </div>
      <div class="inline-fields">
        <div class="field">
          <label for="delayMinutes">Espera em minutos</label>
          <input id="delayMinutes" type="number" min="0" data-node-field="delayMinutes" value="${attr(node.delayMinutes || 0)}" />
        </div>
        <div class="field">
          <label for="nextNode">Próximo bloco</label>
          <select id="nextNode" data-node-field="next">${options}</select>
        </div>
      </div>
      <div class="field">
        <label for="flowGoal">Objetivo do fluxo</label>
        <textarea id="flowGoal" data-flow-field="goal">${escapeHtml(flow.goal || "")}</textarea>
      </div>
      <div class="button-row">
        <button class="danger-button" type="button" data-action="delete-node">${icons.trash}<span>Excluir bloco</span></button>
        <button class="secondary-button" type="button" data-action="delete-flow">${icons.trash}<span>Excluir fluxo</span></button>
      </div>
    </form>
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
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  const id = button.dataset.id;

  if (action === "go-flows") return navigate("flows");
  if (action === "go-pages") return navigate("pages");
  if (action === "go-setup") return navigate("setup");
  if (action === "back-to-flows") {
    flowCanvasOpen = false;
    return render();
  }
  if (action === "toggle-flow-list") return toggleFlowList();
  if (action === "toggle-inspector") return toggleInspector();
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
    localStorage.setItem("messenlead.canvas.flowList", "false");
    simLog = [];
    return render();
  }
  if (action === "select-node") {
    selectedNodeId = id;
    showInspector = true;
    localStorage.setItem("messenlead.canvas.inspector", "true");
    return render();
  }
  if (action === "add-node") return addNode(button.dataset.type);
  if (action === "set-flow-status") return setFlowStatus(button.dataset.status);
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
  if (action === "copy-fields") return copyText("messages,messaging_postbacks,messaging_optins", "Campos copiados.");
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
  if (target.dataset.nodeField || target.dataset.flowField || target.dataset.settingField) {
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
    name,
    status: "draft",
    trigger: "nova mensagem",
    goal: "Descreva o objetivo deste fluxo.",
    updatedAt: new Date().toISOString(),
    nodes: [
      {
        id: triggerId,
        type: "trigger",
        title: "Gatilho",
        message: "Mensagem recebida no Messenger.",
        keyword: "oi",
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
  localStorage.setItem("messenlead.canvas.flowList", "false");
  saveState();
  toastMessage("Fluxo criado.");
  render();
}

function addNode(type) {
  const flow = selectedFlow();
  if (!flow) return;
  const node = {
    id: makeId("node"),
    type,
    title: nodeLabels[type],
    message: defaultNodeMessage(type),
    keyword: "",
    quickReplies: type === "message" ? ["Sim", "Não"] : [],
    next: null,
    x: 120 + flow.nodes.length * 36,
    y: 130 + flow.nodes.length * 46
  };
  const current = selectedNode(flow);
  if (current && !current.next) current.next = node.id;
  flow.nodes.push(node);
  flow.updatedAt = new Date().toISOString();
  selectedNodeId = node.id;
  saveState();
  render();
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

function duplicateFlow(flowId = selectedFlowId, options = {}) {
  const flow = state.flows.find((item) => item.id === flowId) || selectedFlow();
  if (!flow) return;
  const copy = JSON.parse(JSON.stringify(flow));
  const idMap = new Map();
  copy.id = makeId("flow");
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
  });
  state.flows.unshift(copy);
  selectedFlowId = copy.id;
  selectedNodeId = copy.nodes[0]?.id;
  flowCanvasOpen = options.openCanvas ?? true;
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
  flow.nodes.forEach((item) => {
    if (item.next === node.id) item.next = node.next || null;
  });
  flow.nodes = flow.nodes.filter((item) => item.id !== node.id);
  selectedNodeId = flow.nodes[0]?.id;
  flow.updatedAt = new Date().toISOString();
  saveState();
  render();
}

function setCanvasZoom(value) {
  canvasZoom = clamp(value, ZOOM_MIN, ZOOM_MAX);
  localStorage.setItem("messenlead.canvas.zoom", String(canvasZoom));
  render();
}

function toggleFlowList() {
  showFlowList = !showFlowList;
  localStorage.setItem("messenlead.canvas.flowList", String(showFlowList));
  render();
}

function toggleInspector() {
  showInspector = !showInspector;
  localStorage.setItem("messenlead.canvas.inspector", String(showInspector));
  render();
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
    refreshed.scrollLeft = Math.max(0, (Math.max(0, bounds.minX - 40) * canvasZoom) - 14);
    refreshed.scrollTop = Math.max(0, (Math.max(0, bounds.minY - 40) * canvasZoom) - 14);
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
  const contact = {
    id: makeId("contact"),
    name,
    psid: psid || `PSID_${Math.random().toString().slice(2, 12)}`,
    status: "open",
    tag: tag || "novo-assinante",
    source: "Cadastro manual",
    lastSeen: new Date().toISOString(),
    messages: [{ from: "contact", text: "Oi, comecei uma conversa pelo Messenger.", at: new Date().toISOString() }]
  };
  state.contacts.unshift(contact);
  selectedContactId = contact.id;
  saveState();
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
  const messages = simulateFlow(flow, "oi", contact.name);
  messages
    .filter((message) => message.from === "bot")
    .forEach((message) => contact.messages.push({ from: "automation", text: message.text, at: new Date().toISOString() }));
  contact.status = "open";
  saveState();
  render();
}

function toggleContactStatus() {
  const contact = selectedContact();
  if (!contact) return;
  contact.status = contact.status === "open" ? "closed" : "open";
  saveState();
  render();
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

function simulateFlow(flow, inputText, displayName) {
  const messages = [{ from: "user", text: inputText }];
  const normalizedText = normalize(inputText);
  let current =
    flow.nodes.find((node) => node.type === "trigger" && keywordMatches(node.keyword || flow.trigger, normalizedText)) ||
    flow.nodes.find((node) => node.type === "trigger") ||
    flow.nodes[0];
  let guard = 0;

  while (current && guard < 12) {
    guard += 1;
    if (current.type === "message") {
      messages.push({ from: "bot", text: resolveTemplate(current.message, displayName) });
    }
    if (current.type === "action" && current.message) {
      messages.push({ from: "bot", text: `Ação interna: ${current.message}` });
    }
    if (current.type === "delay" && current.message) {
      messages.push({ from: "bot", text: `Espera configurada: ${current.message}` });
    }
    current = current.next ? flow.nodes.find((node) => node.id === current.next) : null;
  }

  if (messages.length === 1) {
    messages.push({ from: "bot", text: state.settings.defaultReply });
  }

  return messages;
}

function enableNodeDragging(flow) {
  const canvas = document.querySelector("#flowCanvas");
  if (!canvas) return;
  canvas.querySelectorAll(".node").forEach((element) => {
    element.addEventListener("pointerdown", (event) => {
      if (event.target.closest("button")) return;
      const node = flow.nodes.find((item) => item.id === element.dataset.id);
      if (!node) return;
      selectedNodeId = node.id;
      const zoom = canvasZoom || 1;
      const startX = event.clientX;
      const startY = event.clientY;
      const startNodeX = node.x;
      const startNodeY = node.y;
      element.setPointerCapture(event.pointerId);
      element.classList.add("selected");

      const onMove = (moveEvent) => {
        const x = startNodeX + (moveEvent.clientX - startX) / zoom;
        const y = startNodeY + (moveEvent.clientY - startY) / zoom;
        node.x = Math.max(20, Math.min(CANVAS_WIDTH - NODE_WIDTH - 40, Math.round(x)));
        node.y = Math.max(20, Math.min(CANVAS_HEIGHT - 190, Math.round(y)));
        element.style.left = `${node.x}px`;
        element.style.top = `${node.y}px`;
      };

      const onUp = () => {
        element.removeEventListener("pointermove", onMove);
        element.removeEventListener("pointerup", onUp);
        flow.updatedAt = new Date().toISOString();
        saveState();
        render();
      };

      element.addEventListener("pointermove", onMove);
      element.addEventListener("pointerup", onUp);
    });
  });
}

function renderConnections(flow) {
  return flow.nodes
    .map((node) => {
      if (!node.next) return "";
      const target = flow.nodes.find((item) => item.id === node.next);
      if (!target) return "";
      const x1 = node.x + NODE_WIDTH;
      const y1 = node.y + NODE_CENTER_Y;
      const x2 = target.x;
      const y2 = target.y + NODE_CENTER_Y;
      const mid = Math.max(60, Math.abs(x2 - x1) / 2);
      return `<path d="M ${x1} ${y1} C ${x1 + mid} ${y1}, ${x2 - mid} ${y2}, ${x2} ${y2}" />`;
    })
    .join("");
}

function renderNode(node, selected) {
  const icon = icons[node.type] || icons.message;
  const quickReplies = node.quickReplies?.length ? `${node.quickReplies.length} respostas rápidas` : "Sem respostas rápidas";
  return `
    <article class="node ${node.type} ${selected ? "selected" : ""}" data-id="${node.id}" style="left:${node.x}px; top:${node.y}px">
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
      <p>${escapeHtml(node.message || "")}</p>
      <div class="node-footer">
        <span>${node.type === "trigger" ? escapeHtml(node.keyword || "qualquer mensagem") : quickReplies}</span>
        <span>${node.next ? "conectado" : "fim"}</span>
      </div>
    </article>
  `;
}

function nodeAddButton(type, label) {
  return `<button class="chip-button" type="button" data-action="add-node" data-type="${type}">${icons[type]}<span>${label}</span></button>`;
}

function selectedFlow() {
  return state.flows.find((flow) => flow.id === selectedFlowId) || state.flows[0];
}

function selectedNode(flow) {
  return flow?.nodes.find((node) => node.id === selectedNodeId) || flow?.nodes[0];
}

function selectedContact() {
  return state.contacts.find((contact) => contact.id === selectedContactId) || state.contacts[0];
}

function renderMessageContent(message) {
  const text = message.message ? `<div>${escapeHtml(message.message)}</div>` : "";
  const attachments = normalizeMessageAttachments(message).map(renderAttachment).join("");

  return text || attachments ? `${text}${attachments}` : `<span class="muted">[anexo ou evento sem texto]</span>`;
}

function normalizeMessageAttachments(message) {
  if (Array.isArray(message.attachments)) return message.attachments;
  if (Array.isArray(message.attachments?.data)) return message.attachments.data;
  return [];
}

function renderAttachment(attachment) {
  const mimeType = String(attachment.mime_type || attachment.mime || "").toLowerCase();
  const attachmentType = String(attachment.type || "").toLowerCase();
  const audioUrl = attachment.audio_data?.url || attachment.audio_data?.preview_url || "";
  const imageUrl = attachment.image_data?.url || attachment.image_data?.preview_url || "";
  const videoUrl = attachment.video_data?.url || attachment.video_data?.preview_url || "";
  const fileUrl = attachment.file_url || attachment.url || audioUrl || imageUrl || videoUrl || "";
  const fileName = attachment.name || attachment.title || "Anexo recebido";
  const lowerUrl = fileUrl.split("?")[0].toLowerCase();

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
  if (fieldName === "next") return value || null;
  return value;
}

function defaultNodeMessage(type) {
  const messages = {
    message: "Digite a mensagem que a página enviará no Messenger.",
    condition: "Defina palavras-chave ou critérios para seguir este caminho.",
    delay: "Aguardar alguns minutos antes de continuar.",
    action: "Aplicar tag, abrir conversa ou notificar atendimento.",
    trigger: "Mensagem recebida no Messenger."
  };
  return messages[type] || messages.message;
}

function navigate(view) {
  activeView = view;
  if (view === "flows") flowCanvasOpen = false;
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
  return state.contacts.filter((contact) => isBroadcastEligible(contact, tagName));
}

function isBroadcastEligible(contact, tagName = "") {
  if (tagName && contact.tag !== tagName) return false;
  if (!contact.psid) return false;
  if (contact.status !== "open") return false;
  return isInsideMessengerReplyWindow(contact);
}

function isInsideMessengerReplyWindow(contact) {
  const value = contact.lastSeen || lastMessage(contact)?.at;
  const timestamp = Date.parse(value || "");
  if (!Number.isFinite(timestamp)) return false;
  return Date.now() - timestamp <= MESSENGER_REPLY_WINDOW_MS;
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
    state = {
      settings: data.settings || state.settings,
      flows: data.flows,
      contacts: data.contacts || state.contacts,
      campaigns: data.campaigns || state.campaigns
    };
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
  const header = ["name", "psid", "tag", "status", "source"].join(",");
  const rows = state.contacts.map((contact) =>
    [contact.name, contact.psid, contact.tag, contact.status, contact.source].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")
  );
  downloadFile("messenlead-assinantes.csv", [header, ...rows].join("\n"), "text/csv");
}

function downloadFile(name, content, type) {
  const blob = new Blob([content], { type });
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
