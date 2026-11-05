const STORAGE_KEY = "linkki-prototype-v1";
// Configure URL e chave publica em supabase-config.js (nunca use service_role).
const authClient = (window.supabase && window.LINKKI_SUPABASE_URL && window.LINKKI_SUPABASE_ANON_KEY && !window.LINKKI_SUPABASE_URL.includes('COLE_'))
  ? window.supabase.createClient(window.LINKKI_SUPABASE_URL, window.LINKKI_SUPABASE_ANON_KEY)
  : null;
function requireAuthClient(form) {
  if (authClient) return true;
  const error = form?.querySelector('.form-error');
  if (error) error.textContent = 'Falta configurar a URL e a chave pública do Supabase em supabase-config.js.';
  return false;
}
function authError(error) {
  const message = String(error?.message || '');
  if (/hook|username|nickname|already.*(use|taken)/i.test(message)) return 'Não foi possível cadastrar este nome de usuário. Volte e escolha outro.';
  return message || 'Não foi possível concluir. Tente novamente.';
}
async function checkUsernameAvailability(username) {
  if (!authClient) throw new Error('Não foi possível verificar o nome de usuário agora.');
  const { data, error } = await authClient.rpc('linkki_username_available', { requested_username: username });
  if (error) throw new Error('Não foi possível verificar o nome de usuário agora. Tente novamente.');
  return data === true;
}
const fontPresets = {
  system: { name: "Moderna", css: "Inter, ui-sans-serif, system-ui, sans-serif" },
  serif: { name: "Editorial", css: "Georgia, 'Times New Roman', serif" },
  mono: { name: "Mono", css: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" },
  humanist: { name: "Humanista", css: "'Trebuchet MS', Candara, Calibri, sans-serif" },
};

function makeTemplateAppearance(background, text, buttonBackground, buttonText, buttonStyle = "rounded", titleFont = "system", bodyFont = "system", extras = {}) {
  return {
    customColors: { background, text, buttonBackground, buttonText },
    buttonStyle,
    titleFont,
    bodyFont,
    buttonBorder: extras.buttonBorder || { enabled: false, color: text },
    buttonShadow: extras.buttonShadow || { enabled: false, distance: 10, blur: 24, opacity: 20, angle: 90 },
  };
}

function seedCommunityTemplates() {
  return [
    {
      id: "template-verde-essencial", ownerId: "lia", author: "Lia Mendes", initials: "LM",
      title: "Verde essencial", category: "Criadores", likes: 284, uses: 1402, liked: false, published: true,
      appearance: makeTemplateAppearance("#CAD593", "#2A3C24", "#2A3C24", "#CAD593", "rounded"),
    },
    {
      id: "template-noite-editorial", ownerId: "caio", author: "Caio Studio", initials: "CS",
      title: "Noite editorial", category: "Portfólio", likes: 198, uses: 876, liked: false, published: true,
      appearance: makeTemplateAppearance("#172018", "#F1EEDD", "#F1EEDD", "#172018", "square", "serif", "serif", {
        buttonBorder: { enabled: true, color: "#F1EEDD" },
      }),
    },
    {
      id: "template-pop-criador", ownerId: "nina", author: "Nina Lima", initials: "NL",
      title: "Pop creator", category: "Influencer", likes: 521, uses: 2387, liked: true, published: true,
      appearance: makeTemplateAppearance("#FFB4D9", "#4B1740", "#A1FF5E", "#26331C", "pill", "humanist", "system", {
        buttonBorder: { enabled: true, color: "#4B1740" },
        buttonShadow: { enabled: true, distance: 8, blur: 0, opacity: 55, angle: 90 },
      }),
    },
    {
      id: "template-minimal-claro", ownerId: "mateus", author: "Mateus Rocha", initials: "MR",
      title: "Minimal claro", category: "Profissional", likes: 142, uses: 653, liked: false, published: true,
      appearance: makeTemplateAppearance("#F7F7F2", "#20231E", "#20231E", "#FFFFFF", "pill", "system", "system"),
    },
    {
      id: "template-menu-solar", ownerId: "sol", author: "Bistrô Sol", initials: "BS",
      title: "Menu solar", category: "Restaurante", likes: 337, uses: 1194, liked: false, published: true,
      appearance: makeTemplateAppearance("#FFD56A", "#5A2E16", "#E5662E", "#FFF8E9", "rounded", "serif", "system", {
        buttonShadow: { enabled: true, distance: 9, blur: 18, opacity: 22, angle: 90 },
      }),
    },
    {
      id: "template-lilas-portfolio", ownerId: "mari", author: "Mari Design", initials: "MD",
      title: "Portfólio lilás", category: "Designer", likes: 419, uses: 1688, liked: false, published: true,
      appearance: makeTemplateAppearance("#E8DFFF", "#382A59", "#7454D6", "#FFFFFF", "rounded", "humanist", "system", {
        buttonBorder: { enabled: true, color: "#382A59" },
      }),
    },
  ];
}

const defaultState = {
  activeSection: "editor",
  activeTab: "content",
  currentPageId: "page-principal",
  communityView: "discover",
  signupStep: 1,
  loginCodeSent: false,
  passwordResetMode: false,
  account: {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    category: "",
    verified: false,
    loggedIn: false,
  },
  profile: {
    name: "Marina Costa",
    username: "marina",
    bio: "Criatividade, rotina e tudo que inspira meu caminho.",
    avatar: "",
    background: "custom",
    buttonStyle: "rounded",
    titleFont: "system",
    bodyFont: "system",
    customColors: {
      background: "#CAD593",
      text: "#2A3C24",
      buttonBackground: "#2A3C24",
      buttonText: "#CAD593",
    },
    buttonBorder: {
      enabled: false,
      color: "#2A3C24",
    },
    buttonShadow: {
      enabled: false,
      distance: 10,
      blur: 24,
      opacity: 20,
      angle: 90,
    },
    customFonts: [],
    recentFonts: ["system"],
    fontViews: {
      titleFont: "models",
      bodyFont: "models",
    },
    published: true,
  },
  links: [
    { id: crypto.randomUUID(), title: "Meu portfólio", url: "https://example.com", visible: true, clicks: 32 },
    { id: crypto.randomUUID(), title: "Vídeo novo no canal", url: "https://youtube.com", visible: true, clicks: 21 },
    { id: crypto.randomUUID(), title: "Fale comigo", url: "mailto:oi@example.com", visible: true, clicks: 12 },
  ],
  analytics: {
    views: 128,
    shares: 7,
  },
  communityTemplates: seedCommunityTemplates(),
  userPages: [],
};

function cloneDefaultState() {
  return JSON.parse(JSON.stringify(defaultState));
}

function appearanceSnapshot(profile) {
  return {
    customColors: JSON.parse(JSON.stringify(profile.customColors)),
    buttonStyle: profile.buttonStyle,
    titleFont: fontPresets[profile.titleFont] ? profile.titleFont : "system",
    bodyFont: fontPresets[profile.bodyFont] ? profile.bodyFont : "system",
    buttonBorder: JSON.parse(JSON.stringify(profile.buttonBorder)),
    buttonShadow: JSON.parse(JSON.stringify(profile.buttonShadow)),
  };
}

function seedUserPages(profile) {
  return [
    {
      id: "page-principal",
      title: "Página principal",
      profileName: profile.name || "Seu nome",
      username: profile.username || "minhapagina",
      active: Boolean(profile.published),
      appearance: appearanceSnapshot(profile),
    },
    {
      id: "page-portfolio",
      title: "Portfólio criativo",
      profileName: "Meu portfólio",
      username: "meuportfolio",
      active: false,
      appearance: makeTemplateAppearance("#E8DFFF", "#382A59", "#7454D6", "#FFFFFF", "rounded", "humanist", "system"),
    },
    {
      id: "page-contato",
      title: "Links profissionais",
      profileName: "Contato profissional",
      username: "contato",
      active: true,
      appearance: makeTemplateAppearance("#F7F7F2", "#20231E", "#20231E", "#FFFFFF", "pill", "system", "system"),
    },
  ];
}

function syncCurrentPageSnapshot() {
  const current = state.userPages.find((page) => page.id === state.currentPageId) || state.userPages[0];
  if (!current) return;
  current.profileName = state.profile.name || current.profileName || "Seu nome";
  current.username = state.profile.username || "minhapagina";
  current.active = Boolean(state.profile.published);
  current.appearance = appearanceSnapshot(state.profile);
}

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return cloneDefaultState();
    const parsed = JSON.parse(stored);
    const base = cloneDefaultState();
    const profile = {
      ...base.profile,
      ...(parsed.profile || {}),
      customColors: {
        ...base.profile.customColors,
        ...(parsed.profile?.customColors || {}),
      },
      buttonBorder: {
        ...base.profile.buttonBorder,
        ...(parsed.profile?.buttonBorder || {}),
      },
      buttonShadow: {
        ...base.profile.buttonShadow,
        ...(parsed.profile?.buttonShadow || {}),
      },
      customFonts: Array.isArray(parsed.profile?.customFonts) ? parsed.profile.customFonts : [],
      recentFonts: Array.isArray(parsed.profile?.recentFonts) ? parsed.profile.recentFonts : base.profile.recentFonts,
      fontViews: {
        ...base.profile.fontViews,
        ...(parsed.profile?.fontViews || {}),
      },
    };

    const backgroundMap = {
      light: ["#CAD593", "#2A3C24", "#2A3C24", "#CAD593"],
      bright: ["#A1C349", "#2A3C24", "#2A3C24", "#CAD593"],
      dark: ["#2A3C24", "#FFFFFF", "#A1C349", "#2A3C24"],
      white: ["#FFFFFF", "#2A3C24", "#2A3C24", "#CAD593"],
    };
    if (backgroundMap[profile.background]) {
      const [background, text, buttonBackground, buttonText] = backgroundMap[profile.background];
      profile.customColors = { background, text, buttonBackground, buttonText };
      profile.background = "custom";
    }

    const legacyFont = parsed.profile?.font || "system";
    profile.titleFont = parsed.profile?.titleFont || legacyFont;
    profile.bodyFont = parsed.profile?.bodyFont || legacyFont;
    if (parsed.profile?.customFont?.dataUrl && !profile.customFonts.length) {
      const legacyCustom = {
        id: "custom-legacy",
        name: parsed.profile.customFont.name || "Minha fonte",
        dataUrl: parsed.profile.customFont.dataUrl,
      };
      profile.customFonts.push(legacyCustom);
      if (legacyFont === "custom") {
        profile.titleFont = legacyCustom.id;
        profile.bodyFont = legacyCustom.id;
      }
    }
    profile.recentFonts = [...new Set([profile.titleFont, profile.bodyFont, ...profile.recentFonts])].slice(0, 5);
    if (profile.buttonStyle === "outline") {
      profile.buttonStyle = "rounded";
      profile.buttonBorder.enabled = true;
    }

    return {
      ...base,
      ...parsed,
      account: { ...base.account, ...(parsed.account || {}) },
      profile,
      analytics: { ...base.analytics, ...(parsed.analytics || {}) },
      links: Array.isArray(parsed.links) ? parsed.links : base.links,
      communityTemplates: Array.isArray(parsed.communityTemplates) ? parsed.communityTemplates : base.communityTemplates,
      userPages: Array.isArray(parsed.userPages) ? parsed.userPages : base.userPages,
    };
  } catch {
    return cloneDefaultState();
  }
}

// v0.2: estado de cada conta no Supabase (tabela linkki_user_data).
// Nunca envie dados de login, OTP ou sessao para o banco.
const legacyLocalState = loadState();
let cloudUserId = null;
let cloudSaveTimer = null;
let cloudSaveChain = Promise.resolve();
let cloudRevision = 0;
let cloudReady = false;
let cloudErrorShown = false;
let publishedFingerprint = null;
let publishInProgress = false;

function editableSnapshot() {
  return {
    profile: state.profile,
    links: state.links,
    analytics: state.analytics,
    userPages: state.userPages,
    currentPageId: state.currentPageId,
    communityTemplates: state.communityTemplates,
  };
}

function applyCloudSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== 'object' || Array.isArray(snapshot)) return;
  // Reutiliza o normalizador existente sem sobrescrever o estado de autenticacao.
  const previous = localStorage.getItem(STORAGE_KEY);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    const normalized = loadState();
    state.profile = normalized.profile;
    state.links = normalized.links;
    state.analytics = normalized.analytics;
    state.userPages = normalized.userPages;
    state.currentPageId = normalized.currentPageId;
    state.communityTemplates = normalized.communityTemplates;
    if (!state.userPages.length) state.userPages = seedUserPages(state.profile);
  } finally {
    if (previous === null) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, previous);
  }
}

function reportCloudError(error) {
  console.error('Linkki: falha na sincronizacao', error);
  const status = document.querySelector('.save-status');
  if (status) status.textContent = 'Nao sincronizado';
  if (!cloudErrorShown) {
    cloudErrorShown = true;
    showToast('Nao foi possivel sincronizar. Seus dados continuam neste navegador.');
  }
}

// Apenas os campos destinados à página pública são enviados para esta tabela.
function publicPageSnapshot() {
  const profile = structuredClone(state.profile);
  const allowed = ['name','username','bio','avatar','customColors','buttonStyle','buttonBorder','buttonShadow','titleFont','bodyFont','customFonts'];
  const safeProfile = Object.fromEntries(allowed.filter(k => Object.hasOwn(profile,k)).map(k => [k,profile[k]]));
  return { profile: safeProfile, links: state.links.filter(link => link.visible).map(link => ({ id: link.id, title: link.title, url: link.url, visible: true })) };
}

async function syncPublicPage(owner, snapshot) {
  if (!authClient || owner !== cloudUserId) return;
  const username = String(state.account.username || '').toLowerCase().trim();
  if (!/^[a-z0-9_.-]{3,30}$/.test(username)) return;
  if (!snapshot.profile.published) {
    const { error } = await authClient.from('linkki_public_pages').delete().eq('user_id', owner);
    if (error) throw error;
    return;
  }
  const { error } = await authClient.from('linkki_public_pages').upsert({
    user_id: owner, username, public_data: { profile: Object.fromEntries(['name','username','bio','avatar','customColors','buttonStyle','buttonBorder','buttonShadow','titleFont','bodyFont','customFonts'].filter(k => Object.hasOwn(snapshot.profile,k)).map(k => [k,snapshot.profile[k]])), links: snapshot.links.filter(link => link.visible).map(link => ({ id: link.id, title: link.title, url: link.url, visible: true })) }, updated_at: new Date().toISOString()
  }, { onConflict: 'user_id' });
  if (error) throw error;
}

function publicPublishPayload() {
  const snapshot = editableSnapshot();
  const profile = snapshot.profile;
  const allowed = ['name','username','bio','avatar','customColors','buttonStyle','buttonBorder','buttonShadow','titleFont','bodyFont','customFonts'];
  return {
    profile: Object.fromEntries(allowed.filter(k => Object.hasOwn(profile,k)).map(k => [k,profile[k]])),
    links: snapshot.links.filter(link => link.visible).map(link => ({ id: link.id, title: link.title, url: link.url, visible: true }))
  };
}
function hasUnpublishedChanges() {
  return Boolean(state.profile.published && publishedFingerprint !== JSON.stringify(publicPublishPayload()));
}

function queueCloudSave() {
  if (!cloudReady || !cloudUserId || !authClient) return;
  const owner = cloudUserId;
  const revision = ++cloudRevision;
  clearTimeout(cloudSaveTimer);
  cloudSaveTimer = setTimeout(() => {
    const payload = structuredClone(editableSnapshot());
    cloudSaveChain = cloudSaveChain.then(async () => {
      if (owner !== cloudUserId || !cloudReady || revision !== cloudRevision) return;
      const { error } = await authClient.from('linkki_user_data').upsert({
        user_id: owner, data: payload, updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
      if (error) throw error;
      cloudErrorShown = false;
      const status = document.querySelector('.save-status');
      if (status && owner === cloudUserId) status.textContent = 'Salvo na nuvem';
    }).catch(reportCloudError);
  }, 650);
}

async function initializeCloudForUser(user) {
  if (!user?.id || !authClient) return;
  clearTimeout(cloudSaveTimer);
  cloudReady = false;
  cloudUserId = user.id;
  cloudRevision++;
  const { data, error } = await authClient.from('linkki_user_data')
    .select('data').eq('user_id', user.id).maybeSingle();
  if (error) { reportCloudError(error); return; }
  if (data?.data) {
    applyCloudSnapshot(data.data);
  } else {
    const sameAccount = legacyLocalState.account?.verified &&
      legacyLocalState.account?.email?.toLowerCase() === user.email?.toLowerCase();
    const importOld = sameAccount && window.confirm(
      'Encontramos dados salvos neste navegador para esta conta. Deseja importa-los para a nuvem?'
    );
    if (importOld) applyCloudSnapshot(legacyLocalState);
    else {
      const fresh = cloneDefaultState();
      applyCloudSnapshot(fresh);
      state.profile.name = [user.user_metadata?.first_name, user.user_metadata?.last_name].filter(Boolean).join(' ') || state.profile.name;
      state.profile.username = user.user_metadata?.username || state.profile.username;
      state.profile.published = false;
    }
  }
  state.account.email = user.email || state.account.email;
  state.account.firstName = user.user_metadata?.first_name || state.account.firstName;
  state.account.lastName = user.user_metadata?.last_name || state.account.lastName;
  state.account.username = user.user_metadata?.username || state.account.username;
  state.account.verified = true;
  state.account.loggedIn = true;
  cloudReady = true;
  publishedFingerprint = null;
  try {
    const { data: publishedPage } = await authClient.from('linkki_public_pages')
      .select('public_data').eq('user_id', user.id).maybeSingle();
    if (publishedPage?.public_data) {
      publishedFingerprint = JSON.stringify(publishedPage.public_data);
      state.profile.published = true;
    } else {
      state.profile.published = false;
    }
  } catch (error) { console.warn('Linkki: estado da publicação indisponível', error); }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (!data?.data) queueCloudSave();
}

async function restoreSupabaseSession() {
  // O estado de login local nao e prova de autenticacao.
  state.account.loggedIn = false;
  state.account.verified = false;
  if (!authClient) { render(); return; }
  try {
    const { data, error } = await authClient.auth.getUser();
    if (error || !data?.user) { render(); return; }
    await initializeCloudForUser(data.user);
  } catch (error) { reportCloudError(error); }
  render();
}

let pendingSignupPassword = "";
let state = loadState();
if (state.activeTab === "community") {
  state.activeSection = "community";
  state.activeTab = "content";
}
if (!state.userPages.length) state.userPages = seedUserPages(state.profile);
let toastTimer;
let pendingFontTarget = "titleFont";
let menuOpen = false;

function refreshPublishButton() {
  const button = document.querySelector('[data-action="publish"]');
  if (!button || publishInProgress) return;
  const published = Boolean(state.profile.published);
  button.textContent = published ? (hasUnpublishedChanges() ? "Publicar alterações" : "Publicado") : "Publicar";
  button.classList.toggle("button--accent", published);
  button.classList.toggle("button--primary", !published);
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  queueCloudSave();
  refreshPublishButton();
  const status = document.querySelector(".save-status");
  if (status) {
    status.textContent = cloudReady ? "Salvando..." : "Salvo neste navegador";
  }
}

function syncLivePreview() {
  const preview = document.querySelector(".preview-screen");
  if (preview) preview.innerHTML = publicProfileMarkup();

  const sidebarName = document.querySelector(".sidebar-profile strong");
  const sidebarUrl = document.querySelector(".sidebar-profile span");
  if (sidebarName) sidebarName.textContent = state.profile.name || "Seu nome";
  if (sidebarUrl) sidebarUrl.textContent = `linkki.com/${state.profile.username || "usuario"}`;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function validHex(value, fallback) {
  return /^#[0-9a-f]{6}$/i.test(value || "") ? value : fallback;
}

function safeUrl(value = "") {
  const trimmed = value.trim();
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return trimmed;
  if (!trimmed) return "#";
  return `https://${trimmed}`;
}

function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "L";
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

function brand(light = false) {
  return `
    <span class="brand ${light ? "brand--light" : ""}" aria-label="Linkki">
      <span class="brand-mark" aria-hidden="true">木</span>
      <span>Linkki</span>
    </span>
  `;
}

function landingPage() {
  return `
    <main class="landing">
      <nav class="landing-nav" aria-label="Navegação principal">
        <a href="#home">${brand()}</a>
        <div class="nav-actions">
          <a class="button button--ghost" href="#login">Entrar</a>
          <a class="button button--primary" href="#signup">Criar minha Linkki</a>
        </div>
      </nav>

      <section class="hero">
        <div class="hero-copy">
          <div class="eyebrow"><span class="eyebrow-dot"></span> Sua presença, do seu jeito</div>
          <h1>Conecte tudo <span>que é seu.</span></h1>
          <p>
            Reúna seus links, projetos, redes e conteúdos em uma página única,
            bonita e completamente sua.
          </p>
          <div class="hero-actions">
            <a class="button button--primary" href="#signup">Criar minha página <span aria-hidden="true">→</span></a>
            <a class="button button--ghost" href="#public">Ver uma Linkki</a>
          </div>
          <div class="hero-note">Grátis para começar · Sem cartão · Pronto em minutos</div>
        </div>

        <div class="hero-visual" aria-label="Exemplo de página criada na Linkki">
          <div class="hero-orbit"></div>
          <div class="float-card float-card--one"><span class="float-icon">↗</span> Todos os seus links</div>
          <div class="float-card float-card--two"><span class="float-icon">✦</span> Do seu jeito</div>
          <div class="phone">
            <div class="phone-screen">
              <div class="demo-avatar">MC</div>
              <div class="demo-name">Marina Costa</div>
              <p class="demo-handle">@marina</p>
              <p class="demo-bio">Criatividade, rotina e tudo que inspira meu caminho.</p>
              <div class="demo-link">Meu portfólio <span>↗</span></div>
              <div class="demo-link">Vídeo novo no canal <span>↗</span></div>
              <div class="demo-link">Fale comigo <span>↗</span></div>
            </div>
          </div>
        </div>
      </section>

      <section class="value-strip" aria-label="Vantagens da Linkki">
        <div class="value-grid">
          <article class="value-card">
            <strong>Todos os caminhos</strong>
            <p>Centralize o que importa e facilite para as pessoas encontrarem você.</p>
          </article>
          <article class="value-card">
            <strong>Sua identidade</strong>
            <p>Escolha aparência, organização e conteúdo sem perder a personalidade.</p>
          </article>
          <article class="value-card">
            <strong>Simples de verdade</strong>
            <p>Edite, reorganize e publique em poucos cliques, direto do celular.</p>
          </article>
        </div>
      </section>

      <footer class="landing-footer">
        ${brand(true)}
        <span>Linkki — Conecte tudo que é seu.</span>
      </footer>
    </main>
  `;
}

const accountCategories = [
  ["influencer", "✦", "Influencer"],
  ["designer", "◇", "Designer"],
  ["salao", "✂", "Salão de beleza"],
  ["restaurante", "⌁", "Restaurante"],
  ["youtuber", "▶", "YouTuber"],
  ["artista", "♪", "Artista / músico"],
  ["fotografo", "◉", "Fotógrafo"],
  ["negocio", "▦", "Negócio / empresa"],
  ["freelancer", "↗", "Freelancer"],
  ["outro", "+", "Outro"],
];

function authShell(content, title, description) {
  return `
    <main class="auth-page">
      <a class="auth-brand" href="#home">${brand()}</a>
      <section class="auth-layout">
        <aside class="auth-aside">
          <span class="auth-kanji" aria-hidden="true">木</span>
          <p class="eyebrow"><span class="eyebrow-dot"></span> Comece pela raiz</p>
          <h1>${title}</h1>
          <p>${description}</p>
          <div class="auth-promise">
            <span>✓</span> Sua página só é criada depois da verificação da conta.
          </div>
        </aside>
        <section class="auth-card">${content}</section>
      </section>
    </main>
  `;
}

function signupProgress() {
  return `
    <div class="signup-progress" aria-label="Progresso do cadastro">
      ${[1, 2, 3].map((step) => `
        <span class="progress-step ${state.signupStep >= step ? "is-active" : ""}">
          <b>${state.signupStep > step ? "✓" : step}</b>
          ${step === 1 ? "Seus dados" : step === 2 ? "Seu perfil" : "Verificação"}
        </span>
      `).join("")}
    </div>
  `;
}

function signupPage() {
  let content = "";

  if (state.signupStep === 1) {
    content = `
      ${signupProgress()}
      <div class="auth-heading">
        <h2>Crie sua conta</h2>
        <p>Esses dados serão usados para identificar e proteger sua página.</p>
      </div>
      <form class="auth-form" data-form="signup-details">
        <div class="field-grid">
          <label class="field">
            <span class="field-label">Nome</span>
            <input class="input" name="firstName" autocomplete="given-name" required maxlength="40" value="${escapeHtml(state.account.firstName)}" placeholder="Seu nome" />
          </label>
          <label class="field">
            <span class="field-label">Sobrenome</span>
            <input class="input" name="lastName" autocomplete="family-name" required maxlength="60" value="${escapeHtml(state.account.lastName)}" placeholder="Seu sobrenome" />
          </label>
          <label class="field field--wide">
            <span class="field-label">Nome de usuário</span>
            <div class="input-prefix"><span>linkki.com/</span><input name="username" autocomplete="username" required maxlength="30" value="${escapeHtml(state.account.username)}" placeholder="seunome" /></div>
            <small class="field-help">Use letras minúsculas, números, ponto, hífen ou underline.</small>
            <small class="field-help" data-username-status role="status" aria-live="polite"></small>
          </label>
          <label class="field field--wide">
            <span class="field-label">E-mail</span>
            <input class="input" name="email" type="email" autocomplete="email" required value="${escapeHtml(state.account.email)}" placeholder="voce@email.com" />
          </label>
          <label class="field field--wide">
            <span class="field-label">Crie uma senha</span>
            <input class="input" name="password" type="password" autocomplete="new-password" minlength="8" required placeholder="Mínimo de 8 caracteres" />
          </label>
          <label class="field field--wide">
            <span class="field-label">Confirme sua senha</span>
            <input class="input" name="passwordConfirm" type="password" autocomplete="new-password" minlength="8" required placeholder="Digite a senha novamente" />
          </label>
        </div>
        <p class="form-error" role="alert"></p>
        <button class="button button--primary auth-submit" type="submit">Continuar <span aria-hidden="true">→</span></button>
      </form>
      <p class="auth-switch">Já possui uma conta? <a href="#login">Entrar</a></p>
    `;
  } else if (state.signupStep === 2) {
    content = `
      ${signupProgress()}
      <div class="auth-heading">
        <h2>O que melhor descreve você?</h2>
        <p>Isso ajudará a Linkki a sugerir recursos e modelos mais úteis.</p>
      </div>
      <form class="auth-form" data-form="signup-category">
        <div class="category-grid" role="radiogroup" aria-label="Tipo de perfil">
          ${accountCategories.map(([id, icon, label]) => `
            <button class="category-option ${state.account.category === id ? "is-selected" : ""}" type="button" role="radio" aria-checked="${state.account.category === id}" data-category="${id}">
              <span>${icon}</span>${label}
            </button>
          `).join("")}
        </div>
        <p class="form-error" role="alert"></p>
        <div class="auth-form-actions">
          <button class="button button--ghost" type="button" data-action="signup-back">Voltar</button>
          <button class="button button--primary" type="submit">Enviar código <span aria-hidden="true">→</span></button>
        </div>
      </form>
    `;
  } else {
    content = `
      ${signupProgress()}
      <div class="auth-heading">
        <span class="mail-icon" aria-hidden="true">✉</span>
        <h2>Confira seu e-mail</h2>
        <p>Enviamos um código de 6 dígitos para <strong>${escapeHtml(state.account.email)}</strong>.</p>
      </div>
      <form class="auth-form" data-form="signup-verify">
        <label class="field">
          <span class="field-label">Código de verificação</span>
          <input class="input verification-input" name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="000000" required />
        </label>

        <p class="form-error" role="alert"></p>
        <button class="button button--primary auth-submit" type="submit">Verificar e criar página</button>
        <button class="text-button" type="button" data-action="resend-code">Reenviar código</button>
        <button class="text-button" type="button" data-action="signup-back">Alterar dados</button>
      </form>
    `;
  }

  return authShell(content, "Sua Linkki começa com você.", "Crie sua conta, diga o que você faz e transforme seus caminhos em uma página única.");
}

function loginPage() {
  const hasAccount = true;
  const content = `
    <div class="auth-heading">
      <h2>Entre na sua Linkki</h2>
      <p>${state.passwordResetMode ? "Defina uma senha para sua conta usando um código enviado por e-mail." : "Entre com seu e-mail e sua senha."}</p>
    </div>
    ${hasAccount ? `
      <form class="auth-form" data-form="login">
        <label class="field">
          <span class="field-label">E-mail</span>
          <input class="input" name="loginEmail" type="email" autocomplete="email" required value="${escapeHtml(state.account.email)}" />
        </label>
        ${state.passwordResetMode ? `
          ${state.loginCodeSent ? `<label class="field"><span class="field-label">Código recebido por e-mail</span><input class="input verification-input" name="loginCode" inputmode="numeric" maxlength="6" placeholder="000000" required /></label>
          <label class="field"><span class="field-label">Nova senha</span><input class="input" name="newPassword" type="password" autocomplete="new-password" minlength="8" required /></label>
          <label class="field"><span class="field-label">Confirme a nova senha</span><input class="input" name="newPasswordConfirm" type="password" autocomplete="new-password" minlength="8" required /></label>` : ""}
        ` : `<label class="field"><span class="field-label">Senha</span><input class="input" name="loginPassword" type="password" autocomplete="current-password" required /></label>`}
        <p class="form-error" role="alert"></p>
        <button class="button button--primary auth-submit" type="submit">${state.passwordResetMode ? (state.loginCodeSent ? "Salvar senha e entrar" : "Enviar código para definir senha") : "Entrar"}</button>
      </form>
      <p class="auth-switch"><button class="text-button" type="button" data-action="toggle-password-reset">${state.passwordResetMode ? "Voltar ao login com senha" : "Esqueci minha senha / Primeiro acesso com código"}</button></p>
    ` : `<a class="button button--primary auth-submit" href="#signup">Criar minha conta</a>`}
    <p class="auth-switch"><a href="#home">← Voltar para o início</a></p>
  `;
  return authShell(content, "Bom ter você de volta.", "Acesse sua conta para editar, personalizar e acompanhar sua página.");
}

function avatarMarkup(className = "profile-avatar", profile = state.profile) {
  if (profile.avatar) {
    return `<div class="${className}"><img src="${escapeHtml(profile.avatar)}" alt="Foto de ${escapeHtml(profile.name)}" /></div>`;
  }
  return `<div class="${className}" aria-label="Avatar de ${escapeHtml(profile.name)}">${escapeHtml(initials(profile.name))}</div>`;
}

function fontName(fontId) {
  return fontPresets[fontId]?.name
    || state.profile.customFonts.find((font) => font.id === fontId)?.name
    || "Moderna";
}

function customFontFamily(fontId) {
  return `LinkkiFont-${String(fontId).replace(/[^a-z0-9_-]/gi, "")}`;
}

function fontCssValue(fontId, profile = state.profile) {
  if (fontPresets[fontId]) return fontPresets[fontId].css;
  if (profile.customFonts.some((font) => font.id === fontId)) return `"${customFontFamily(fontId)}", sans-serif`;
  return fontPresets.system.css;
}

function buttonShadowValue(shadow = state.profile.buttonShadow) {
  if (!shadow.enabled) return "none";
  const angle = Math.max(0, Math.min(360, Number(shadow.angle) || 0));
  const distance = Math.max(0, Math.min(50, Number(shadow.distance) || 0));
  const blur = Math.max(0, Math.min(80, Number(shadow.blur) || 0));
  const opacity = Math.max(0, Math.min(100, Number(shadow.opacity) || 0)) / 100;
  const radians = angle * Math.PI / 180;
  const x = Math.round(Math.cos(radians) * distance * 10) / 10;
  const y = Math.round(Math.sin(radians) * distance * 10) / 10;
  return `${x}px ${y}px ${blur}px rgba(42,60,36,${opacity})`;
}

function publicProfileMarkup(page = { profile: state.profile, links: state.links }) {
  const profile = page.profile;
  const visibleLinks = page.links.filter((link) => link.visible);
  const custom = profile.customColors;
  const border = profile.buttonBorder;
  const colorStyle = [
    `--profile-bg:${validHex(custom.background, "#CAD593")}`,
    `--profile-text:${validHex(custom.text, "#2A3C24")}`,
    `--button-bg:${validHex(custom.buttonBackground, "#2A3C24")}`,
    `--button-text:${validHex(custom.buttonText, "#CAD593")}`,
    `--button-border-width:${border.enabled ? "2px" : "0px"}`,
    `--button-border-color:${validHex(border.color, "#2A3C24")}`,
    `--button-shadow:${buttonShadowValue(profile.buttonShadow)}`,
    `--title-font:${fontCssValue(profile.titleFont, profile)}`,
    `--body-font:${fontCssValue(profile.bodyFont, profile)}`,
    `background:${validHex(custom.background, "#CAD593")}`,
  ].join(";");
  const customFontStyle = profile.customFonts.length
    ? `<style>${profile.customFonts.map((font) => `@font-face{font-family:"${customFontFamily(font.id)}";src:url("${escapeHtml(font.dataUrl)}")}`).join("")}</style>`
    : "";
  return `
    ${customFontStyle}
    <div class="profile-canvas bg-custom buttons-${escapeHtml(profile.buttonStyle)}" style="${escapeHtml(colorStyle)}">
      <div class="profile-inner">
        ${avatarMarkup("public-avatar", profile)}
        <h1 class="public-name">${escapeHtml(profile.name || "Seu nome")}</h1>
        <p class="public-handle">@${escapeHtml(profile.username || "seuusuario")}</p>
        <p class="public-bio">${escapeHtml(profile.bio || "Conte um pouco sobre você.")}</p>
        <div class="public-links">
          ${visibleLinks.length ? visibleLinks.map((link) => `
            <a
              class="link-button"
              href="${escapeHtml(safeUrl(link.url))}"
              data-public-link="${escapeHtml(link.id)}"
              target="_blank"
              rel="noopener noreferrer"
            >${escapeHtml(link.title || "Novo link")}</a>
          `).join("") : `<div class="empty-state"><strong>Nenhum link visível</strong>Ative um link no editor.</div>`}
        </div>
        <a class="profile-brand" href="#home"><span aria-hidden="true">木</span> Linkki</a>
      </div>
    </div>
  `;
}

function sidebar() {
  const tabs = [
    ["content", "✦", "Conteúdo"],
    ["appearance", "◐", "Aparência"],
    ["analytics", "↗", "Analytics"],
  ];
  return `
    <aside class="sidebar" aria-label="Seções do editor">
      <div class="sidebar-label">Sua página</div>
      ${tabs.map(([id, icon, label]) => `
        <button class="tab-button ${state.activeTab === id ? "is-active" : ""}" data-tab="${id}">
          <span class="tab-icon" aria-hidden="true">${icon}</span>${label}
        </button>
      `).join("")}
      <div class="sidebar-profile">
        <strong>${escapeHtml(state.profile.name || "Seu nome")}</strong>
        <span>linkki.com/${escapeHtml(state.profile.username || "usuario")}</span>
      </div>
    </aside>
  `;
}

function contentPanel() {
  return `
    <div class="panel-header">
      <div>
        <h1>Seu conteúdo</h1>
        <p>Edite seu perfil e organize os caminhos que você quer compartilhar.</p>
      </div>
      <button class="button button--accent" data-action="add-link">+ Adicionar link</button>
    </div>

    <section class="card">
      <div class="card-title"><h2>Perfil</h2></div>
      <div class="profile-row">
        ${avatarMarkup()}
        <div class="avatar-actions">
          <label class="button button--ghost button--small" for="avatar-input">Enviar foto</label>
          <input id="avatar-input" type="file" accept="image/*" hidden />
          ${state.profile.avatar ? `<button class="button button--ghost button--small" data-action="remove-avatar">Remover</button>` : ""}
        </div>
      </div>
      <div class="field-grid">
        <label class="field">
          <span class="field-label">Nome</span>
          <input class="input" name="profile-name" maxlength="50" value="${escapeHtml(state.profile.name)}" />
        </label>
        <label class="field">
          <span class="field-label">Nome de usuário</span>
          <input class="input" name="profile-username" maxlength="30" value="${escapeHtml(state.profile.username)}" />
        </label>
        <label class="field field--wide">
          <span class="field-label">Bio <small>${state.profile.bio.length}/160</small></span>
          <textarea class="textarea" name="profile-bio" maxlength="160">${escapeHtml(state.profile.bio)}</textarea>
        </label>
      </div>
    </section>

    <section class="card">
      <div class="card-title">
        <h2>Links</h2>
        <span class="save-status">Salvo</span>
      </div>
      <div class="link-list">
        ${state.links.length ? state.links.map((link, index) => linkEditor(link, index)).join("") : `
          <div class="empty-state">
            <strong>Sua árvore está pronta para crescer</strong>
            Adicione o primeiro link da sua página.
          </div>
        `}
      </div>
    </section>
  `;
}

function linkEditor(link, index) {
  return `
    <article class="link-editor" draggable="true" data-link-id="${escapeHtml(link.id)}">
      <span class="drag-handle" title="Arraste para reorganizar" aria-hidden="true">•••</span>
      <div class="link-fields">
        <input class="input" data-link-field="title" value="${escapeHtml(link.title)}" maxlength="70" aria-label="Título do link ${index + 1}" placeholder="Título do link" />
        <input class="input" data-link-field="url" value="${escapeHtml(link.url)}" aria-label="Endereço do link ${index + 1}" placeholder="https://..." />
      </div>
      <div class="link-actions">
        <button class="icon-button" data-action="move-up" title="Mover para cima" aria-label="Mover link para cima">↑</button>
        <button class="icon-button" data-action="move-down" title="Mover para baixo" aria-label="Mover link para baixo">↓</button>
        <button class="switch ${link.visible ? "is-on" : ""}" data-action="toggle-link" title="${link.visible ? "Ocultar link" : "Mostrar link"}" aria-label="${link.visible ? "Ocultar link" : "Mostrar link"}" aria-pressed="${link.visible}"></button>
        <button class="icon-button icon-button--delete" data-action="delete-link" title="Excluir link" aria-label="Excluir link">×</button>
      </div>
    </article>
  `;
}

function fontPickerMarkup(target, label, description) {
  const selected = state.profile[target];
  const view = state.profile.fontViews[target] || "models";
  const recent = [...new Set(state.profile.recentFonts)]
    .filter((fontId) => fontPresets[fontId] || state.profile.customFonts.some((font) => font.id === fontId))
    .slice(0, 5);
  const models = Object.keys(fontPresets);
  const ownFonts = state.profile.customFonts.map((font) => font.id);
  const visibleFonts = view === "recent" ? recent : view === "owned" ? ownFonts : models;
  return `
    <div class="font-picker-card">
      <div class="font-picker-header">
        <div><strong>${label}</strong><span>${description}</span></div>
        <div class="font-view-tabs" role="tablist" aria-label="Coleções de fontes para ${label}">
          ${[
            ["models", "Modelos"],
            ["recent", "Recentes"],
            ["owned", "Suas fontes"],
          ].map(([id, tabLabel]) => `
            <button type="button" class="font-view-tab ${view === id ? "is-active" : ""}" data-font-view="${id}" data-font-target="${target}" role="tab" aria-selected="${view === id}">${tabLabel}</button>
          `).join("")}
        </div>
      </div>
      <button class="button button--ghost button--small font-install-button" type="button" data-action="install-font" data-font-target="${target}">Instalar fonte</button>
      ${visibleFonts.length ? `
        <div class="font-choice-grid">
          ${visibleFonts.map((fontId) => `
            <button
              type="button"
              class="font-tile ${selected === fontId ? "is-active" : ""}"
              data-font-quick="${escapeHtml(fontId)}"
              data-font-target="${target}"
              style="font-family:${escapeHtml(fontCssValue(fontId))}"
            >
              <span>Aa</span>
              <strong>${escapeHtml(fontName(fontId))}</strong>
            </button>
          `).join("")}
        </div>
      ` : `
        <div class="font-empty-panel">
          <strong>${view === "owned" ? "Nenhuma fonte instalada" : "Nenhuma fonte recente"}</strong>
          <span>${view === "owned" ? "Use o botão “Instalar fonte” para adicionar uma." : "As fontes escolhidas aparecerão aqui."}</span>
        </div>
      `}
    </div>
  `;
}

function appearancePanel() {
  const buttons = [
    ["rounded", "rounded", "Arredondado"],
    ["pill", "pill", "Pílula"],
    ["square", "square", "Reto"],
  ];
  const colorFields = [
    ["background", "Fundo", "Cor da página"],
    ["text", "Textos", "Nome, bio e informações"],
    ["buttonBackground", "Botões", "Preenchimento dos links"],
    ["buttonText", "Texto dos botões", "Títulos dos links"],
  ];
  const shadow = state.profile.buttonShadow;
  const border = state.profile.buttonBorder;

  return `
    <div class="panel-header">
      <div>
        <h1>Aparência</h1>
        <p>Personalize cada parte da página e acompanhe o resultado na prévia.</p>
      </div>
    </div>

    <section class="card">
      <div class="card-title"><h2>Cores</h2></div>
      <div class="direct-color-list">
        ${colorFields.map(([field, label, description]) => `
          <div class="direct-color-row">
            <div class="direct-color-label"><strong>${label}</strong><span>${description}</span></div>
            <label class="direct-color-control">
              <input type="color" data-color-picker="${field}" value="${validHex(state.profile.customColors[field], "#2A3C24")}" aria-label="Seletor de cor para ${label}" />
              <input class="hex-input" data-color-field="${field}" value="${escapeHtml(state.profile.customColors[field])}" maxlength="7" aria-label="Código da cor para ${label}" />
            </label>
          </div>
        `).join("")}
      </div>
    </section>

    <section class="card">
      <div class="card-title"><h2>Botões</h2></div>
      <span class="option-label">Formato</span>
      <div class="appearance-grid appearance-grid--three">
        ${buttons.map(([id, styleClass, label]) => `
          <button class="choice ${state.profile.buttonStyle === id ? "is-active" : ""}" data-choice="buttonStyle" data-value="${id}">
            <span class="button-demo ${styleClass}"></span>${label}
          </button>
        `).join("")}
      </div>

      <div class="effect-settings">
        <div class="effect-block">
          <div class="effect-heading">
            <div><strong>Borda</strong><span>Adicione um contorno aos botões.</span></div>
            <button class="switch ${border.enabled ? "is-on" : ""}" data-action="toggle-border" aria-label="${border.enabled ? "Desativar borda" : "Ativar borda"}" aria-pressed="${border.enabled}"></button>
          </div>
          ${border.enabled ? `
            <div class="effect-content">
              <div class="direct-color-row compact">
                <div class="direct-color-label"><strong>Cor da borda</strong></div>
                <label class="direct-color-control">
                  <input type="color" data-border-picker value="${validHex(border.color, "#2A3C24")}" aria-label="Seletor da cor da borda" />
                  <input class="hex-input" data-border-color value="${escapeHtml(border.color)}" maxlength="7" aria-label="Código da cor da borda" />
                </label>
              </div>
            </div>
          ` : ""}
        </div>

        <div class="effect-block">
          <div class="effect-heading">
            <div><strong>Sombra</strong><span>Controle direção, distância e suavidade.</span></div>
            <button class="switch ${shadow.enabled ? "is-on" : ""}" data-action="toggle-shadow" aria-label="${shadow.enabled ? "Desativar sombra" : "Ativar sombra"}" aria-pressed="${shadow.enabled}"></button>
          </div>
          ${shadow.enabled ? `
            <div class="effect-content range-grid">
              ${[
                ["distance", "Distância", 0, 50, 1, "px"],
                ["blur", "Suavidade", 0, 80, 1, "px"],
                ["opacity", "Opacidade", 0, 100, 1, "%"],
                ["angle", "Ângulo", 0, 360, 1, "°"],
              ].map(([field, label, min, max, step, suffix]) => `
                <label class="range-control">
                  <span><strong>${label}</strong><output data-shadow-output="${field}">${shadow[field]}${suffix}</output></span>
                  <input type="range" min="${min}" max="${max}" step="${step}" value="${shadow[field]}" data-shadow-field="${field}" data-suffix="${suffix}" />
                </label>
              `).join("")}
            </div>
          ` : ""}
        </div>
      </div>
    </section>

    <section class="card">
      <div class="card-title"><h2>Tipografia</h2></div>
      <p class="section-description">Escolha fontes diferentes para dar hierarquia à sua página.</p>
      <div class="font-picker-list">
        ${fontPickerMarkup("titleFont", "Títulos principais", "Nome do perfil e títulos dos links")}
        ${fontPickerMarkup("bodyFont", "Textos", "Bio, usuário e informações auxiliares")}
      </div>
      <input id="font-file-input" type="file" accept=".woff,.woff2,.ttf,.otf,font/woff,font/woff2,font/ttf,font/otf" hidden />
      <p class="font-license-note">Instale apenas fontes que você tem permissão para usar. Formatos aceitos: WOFF, WOFF2, TTF e OTF, até 1,5 MB.</p>
    </section>
  `;
}

function formatCount(value) {
  const number = Number(value) || 0;
  if (number >= 1000000) return `${(number / 1000000).toFixed(number >= 10000000 ? 0 : 1).replace(".", ",")} mi`;
  if (number >= 1000) return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1).replace(".", ",")} mil`;
  return String(number);
}

function templatePreviewMarkup(item) {
  const appearance = item.appearance;
  const colors = appearance.customColors;
  const border = appearance.buttonBorder || { enabled: false, color: colors.text };
  const shadow = appearance.buttonShadow || { enabled: false, distance: 0, blur: 0, opacity: 0, angle: 90 };
  const style = [
    `--template-bg:${validHex(colors.background, "#CAD593")}`,
    `--template-text:${validHex(colors.text, "#2A3C24")}`,
    `--template-button:${validHex(colors.buttonBackground, "#2A3C24")}`,
    `--template-button-text:${validHex(colors.buttonText, "#CAD593")}`,
    `--template-border-width:${border.enabled ? "2px" : "0px"}`,
    `--template-border-color:${validHex(border.color, colors.text)}`,
    `--template-shadow:${buttonShadowValue(shadow)}`,
    `--template-title-font:${fontCssValue(appearance.titleFont || "system")}`,
    `--template-body-font:${fontCssValue(appearance.bodyFont || "system")}`,
  ].join(";");
  const shape = appearance.buttonStyle || "rounded";
  return `
    <div class="template-preview template-shape-${escapeHtml(shape)}" style="${escapeHtml(style)}">
      <div class="template-mini-avatar">${escapeHtml(item.initials || initials(item.title))}</div>
      <strong class="template-mini-name">${escapeHtml(item.previewName || item.author || item.title)}</strong>
      <span class="template-mini-handle">@${escapeHtml(item.username || "seulinkki")}</span>
      <div class="template-mini-links">
        <span>Meu destaque</span><span>Conteúdo novo</span><span>Fale comigo</span>
      </div>
      <small>木 Linkki</small>
    </div>
  `;
}

function communityNav() {
  return `
    <div class="community-nav" role="tablist" aria-label="Seções da comunidade">
      <button class="community-nav-button ${state.communityView === "discover" ? "is-active" : ""}" data-community-view="discover" role="tab" aria-selected="${state.communityView === "discover"}">Descobrir</button>
      <button class="community-nav-button ${state.communityView === "mine" ? "is-active" : ""}" data-community-view="mine" role="tab" aria-selected="${state.communityView === "mine"}">Meus modelos</button>
    </div>
  `;
}

function communityTemplateCard(template, mine = false) {
  return `
    <article class="community-template-card">
      ${templatePreviewMarkup(template)}
      <div class="template-card-body">
        <div class="template-card-title">
          <div><strong>${escapeHtml(template.title)}</strong><span>${escapeHtml(template.category)}</span></div>
          ${mine ? `<span class="published-badge">Publicado</span>` : ""}
        </div>
        <div class="template-author"><span>${escapeHtml(template.initials || initials(template.author))}</span><strong>${escapeHtml(template.author)}</strong></div>
        <div class="template-stats">
          <button class="template-stat ${template.liked ? "is-liked" : ""}" data-action="like-template" data-template-id="${escapeHtml(template.id)}" aria-label="${template.liked ? "Remover curtida" : "Curtir modelo"}">♡ <span>${formatCount(template.likes)}</span></button>
          <span class="template-stat">◎ <span>${formatCount(template.uses)} usos</span></span>
        </div>
        ${mine ? `
          <button class="button button--ghost template-action" data-action="unpublish-template" data-template-id="${escapeHtml(template.id)}">Remover publicação</button>
        ` : `
          <button class="button button--primary template-action" data-action="apply-template" data-template-id="${escapeHtml(template.id)}">Usar este modelo</button>
        `}
      </div>
    </article>
  `;
}

function communityPanel() {
  syncCurrentPageSnapshot();
  const publishedTemplates = state.communityTemplates.filter((template) => template.published);
  const myPublishedTemplates = publishedTemplates.filter((template) => template.ownerId === "self");

  if (state.communityView === "publish") {
    return `
      <div class="panel-header community-panel-header">
        <div>
          <button class="back-link" data-community-view="discover">← Voltar para a comunidade</button>
          <h1>Publicar um modelo</h1>
          <p>Escolha uma das suas páginas. Ela continuará existindo mesmo se o modelo for removido da comunidade.</p>
        </div>
      </div>
      <div class="publish-info"><span>✦</span><p>Você pode publicar páginas ativas ou desativadas. Apenas a aparência vira modelo; seus links e dados pessoais não são copiados.</p></div>
      <div class="user-pages-grid">
        ${state.userPages.map((page) => {
          const existing = state.communityTemplates.find((template) => template.ownerId === "self" && template.sourcePageId === page.id && template.published);
          return `
            <article class="user-page-card">
              ${templatePreviewMarkup({ ...page, author: state.profile.name, initials: initials(state.profile.name), previewName: page.title })}
              <div class="user-page-info">
                <div>
                  <strong>${escapeHtml(page.title)}</strong>
                  <span>linkki.com/${escapeHtml(page.username)}</span>
                </div>
                <span class="page-status ${page.active ? "is-active" : ""}">${page.active ? "Ativa" : "Desativada"}</span>
              </div>
              <button class="button ${existing ? "button--ghost" : "button--primary"} template-action" data-action="publish-page-template" data-page-id="${escapeHtml(page.id)}" ${existing ? "disabled" : ""}>${existing ? "Modelo publicado" : "Publicar como modelo"}</button>
            </article>
          `;
        }).join("")}
      </div>
    `;
  }

  if (state.communityView === "mine") {
    return `
      <div class="panel-header community-panel-header">
        <div><h1>Comunidade</h1><p>Gerencie os modelos que você compartilhou.</p></div>
        <button class="button button--accent" data-community-view="publish">+ Publicar modelo</button>
      </div>
      ${communityNav()}
      ${myPublishedTemplates.length ? `
        <div class="community-grid">${myPublishedTemplates.map((template) => communityTemplateCard(template, true)).join("")}</div>
      ` : `
        <div class="community-empty">
          <span>木</span><strong>Nenhum modelo publicado</strong>
          <p>Transforme uma das suas páginas em inspiração para a comunidade.</p>
          <button class="button button--primary" data-community-view="publish">Publicar meu primeiro modelo</button>
        </div>
      `}
    `;
  }

  return `
    <div class="panel-header community-panel-header">
      <div><h1>Comunidade</h1><p>Descubra modelos criados por pessoas da Linkki e adapte ao seu conteúdo.</p></div>
      <button class="button button--accent" data-community-view="publish">+ Publicar modelo</button>
    </div>
    ${communityNav()}
    <section class="community-hero">
      <div><span>MODELOS DA COMUNIDADE</span><h2>Encontre um ponto de partida e deixe com a sua cara.</h2></div>
      <strong>${formatCount(publishedTemplates.reduce((sum, template) => sum + template.uses, 0))}<small>aplicações</small></strong>
    </section>
    <div class="community-section-title"><div><h2>Em destaque</h2><p>Modelos que a comunidade está usando agora.</p></div><span>${publishedTemplates.length} modelos</span></div>
    <div class="community-grid">${publishedTemplates.map((template) => communityTemplateCard(template)).join("")}</div>
  `;
}

function analyticsPanel() {
  const totalClicks = state.links.reduce((sum, link) => sum + (Number(link.clicks) || 0), 0);
  const maxClicks = Math.max(1, ...state.links.map((link) => Number(link.clicks) || 0));
  const clickRate = state.analytics.views ? Math.round((totalClicks / state.analytics.views) * 100) : 0;
  return `
    <div class="panel-header">
      <div>
        <h1>Analytics</h1>
        <p>Uma visão simples de como as pessoas interagem com sua Linkki.</p>
      </div>
    </div>

    <div class="stats-grid">
      <article class="stat-card"><span>Visualizações</span><strong>${state.analytics.views}</strong></article>
      <article class="stat-card"><span>Cliques</span><strong>${totalClicks}</strong></article>
      <article class="stat-card"><span>Taxa de clique</span><strong>${clickRate}%</strong></article>
    </div>

    <section class="card">
      <div class="card-title"><h2>Cliques por link</h2></div>
      ${state.links.length ? state.links.map((link) => {
        const clicks = Number(link.clicks) || 0;
        const width = Math.max(3, Math.round((clicks / maxClicks) * 100));
        return `
          <div class="chart-row">
            <span class="chart-label" title="${escapeHtml(link.title)}">${escapeHtml(link.title || "Sem título")}</span>
            <span class="chart-track"><span class="chart-bar" style="width:${width}%"></span></span>
            <span class="chart-value">${clicks}</span>
          </div>
        `;
      }).join("") : `<div class="empty-state"><strong>Sem dados ainda</strong>Adicione links para começar a acompanhar os cliques.</div>`}
    </section>

    <section class="card">
      <div class="card-title"><h2>Nesta primeira versão</h2></div>
      <p style="margin:0;color:var(--muted);line-height:1.65;font-size:13px">
        Os dados são demonstrativos e ficam salvos neste navegador. Na próxima fundação,
        conectaremos contas, banco de dados e métricas reais.
      </p>
    </section>
  `;
}

function appMenuMarkup() {
  const items = [
    ["account", "●", "Minha conta", "Dados e preferências"],
    ["pages", "▤", "Minhas páginas", "Gerencie suas Linkkis"],
    ["community", "◎", "Comunidade", "Modelos compartilhados"],
    ["support", "?", "Suporte", "Ajuda e atendimento"],
  ];
  const accountName = `${state.account.firstName || ""} ${state.account.lastName || ""}`.trim() || state.profile.name || "Sua conta";
  return `
    <div class="menu-overlay ${menuOpen ? "is-open" : ""}" data-action="close-menu" aria-hidden="${!menuOpen}"></div>
    <aside class="app-drawer ${menuOpen ? "is-open" : ""}" aria-label="Menu principal" aria-hidden="${!menuOpen}">
      <div class="drawer-header">
        ${brand()}
        <button class="drawer-close" data-action="close-menu" aria-label="Fechar menu">×</button>
      </div>
      <div class="drawer-label">Navegação</div>
      <nav class="drawer-nav">
        ${items.map(([id, icon, label, description]) => `
          <button class="drawer-item ${state.activeSection === id ? "is-active" : ""}" data-app-section="${id}">
            <span class="drawer-item-icon">${icon}</span>
            <span><strong>${label}</strong><small>${description}</small></span>
            <b aria-hidden="true">›</b>
          </button>
        `).join("")}
      </nav>
      <div class="drawer-account">
        <span>${escapeHtml(initials(accountName))}</span>
        <div><strong>${escapeHtml(accountName)}</strong><small>${escapeHtml(state.account.email || `@${state.profile.username}`)}</small></div>
      </div>
      <div style="padding:12px 20px 22px">
        <button type="button" class="button" data-action="logout" style="width:100%">Sair da conta</button>
      </div>
    </aside>
  `;
}

function accountPanel() {
  const accountName = `${state.account.firstName || ""} ${state.account.lastName || ""}`.trim() || state.profile.name || "Sua conta";
  const category = accountCategories.find(([id]) => id === state.account.category)?.[2] || "Não informado";
  return `
    <div class="panel-header section-panel-header">
      <div><span class="section-eyebrow">CONTA</span><h1>Minha conta</h1><p>Seus dados de acesso e informações pessoais.</p></div>
    </div>
    <div class="account-overview">
      <section class="account-identity-card">
        <div class="account-avatar">${escapeHtml(initials(accountName))}</div>
        <h2>${escapeHtml(accountName)}</h2>
        <p>@${escapeHtml(state.account.username || state.profile.username)}</p>
        <span class="verified-pill">✓ E-mail verificado</span>
        <button class="button button--primary" data-app-section="editor">Editar minha página</button>
        <button type="button" class="button" data-action="logout" style="margin-top:10px">Sair da conta</button>
      </section>
      <div class="account-details-column">
        <section class="card account-card">
          <div class="card-title"><h2>Informações pessoais</h2><span class="base-badge">BASE</span></div>
          <div class="account-detail-list">
            <div><span>Nome completo</span><strong>${escapeHtml(accountName)}</strong></div>
            <div><span>E-mail</span><strong>${escapeHtml(state.account.email || "E-mail ainda não informado")}</strong></div>
            <div><span>Nome de usuário</span><strong>@${escapeHtml(state.account.username || state.profile.username)}</strong></div>
            <div><span>Tipo de perfil</span><strong>${escapeHtml(category)}</strong></div>
          </div>
        </section>
        <section class="card account-card">
          <div class="card-title"><h2>Segurança</h2></div>
          <div class="account-security-row"><div><strong>Verificação por e-mail</strong><span>Sua conta está protegida por código de acesso.</span></div><span class="status-ok">Ativa</span></div>
        </section>
      </div>
    </div>
  `;
}

function myPagesPanel() {
  syncCurrentPageSnapshot();
  return `
    <div class="panel-header section-panel-header">
      <div><span class="section-eyebrow">PÁGINAS</span><h1>Minhas páginas</h1><p>Crie, ative, desative e edite suas páginas da Linkki.</p></div>
      <button class="button button--accent" data-action="create-page">+ Nova página</button>
    </div>
    <div class="pages-summary">
      <div><strong>${state.userPages.length}</strong><span>Páginas criadas</span></div>
      <div><strong>${state.userPages.filter((page) => page.active).length}</strong><span>Ativas</span></div>
      <div><strong>${state.userPages.filter((page) => !page.active).length}</strong><span>Desativadas</span></div>
    </div>
    <div class="managed-pages-grid">
      ${state.userPages.map((page) => `
        <article class="managed-page-card ${state.currentPageId === page.id ? "is-current" : ""}">
          ${templatePreviewMarkup({ ...page, author: page.profileName || page.title, initials: initials(page.profileName || page.title), previewName: page.profileName || page.title })}
          <div class="managed-page-body">
            <div class="user-page-info">
              <div><strong>${escapeHtml(page.title)}</strong><span>linkki.com/${escapeHtml(page.username)}</span></div>
              <span class="page-status ${page.active ? "is-active" : ""}">${page.active ? "Ativa" : "Desativada"}</span>
            </div>
            <div class="managed-page-actions">
              <button class="button button--primary button--small" data-action="open-page" data-page-id="${escapeHtml(page.id)}">Editar página</button>
              <button class="button button--ghost button--small" data-action="toggle-page-status" data-page-id="${escapeHtml(page.id)}">${page.active ? "Desativar" : "Ativar"}</button>
            </div>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function supportPanel() {
  return `
    <div class="panel-header section-panel-header">
      <div><span class="section-eyebrow">AJUDA</span><h1>Suporte</h1><p>Encontre respostas e os caminhos para falar com a Linkki.</p></div>
    </div>
    <section class="support-hero">
      <span>?</span><div><h2>Como podemos ajudar?</h2><p>A central completa será conectada nas próximas etapas.</p></div>
      <label class="support-search"><span>⌕</span><input type="search" placeholder="Buscar uma dúvida..." aria-label="Buscar no suporte" /></label>
    </section>
    <div class="support-category-grid">
      <article><span>✦</span><strong>Primeiros passos</strong><p>Conta, páginas e publicação.</p></article>
      <article><span>◐</span><strong>Personalização</strong><p>Cores, fontes e modelos.</p></article>
      <article><span>◎</span><strong>Comunidade</strong><p>Modelos, curtidas e usos.</p></article>
    </div>
    <section class="card support-faq">
      <div class="card-title"><h2>Perguntas frequentes</h2><span class="base-badge">BASE</span></div>
      <details><summary>Como publico minha página?</summary><p>Abra o editor, conclua as informações e use o botão Publicar no topo.</p></details>
      <details><summary>Aplicar um modelo remove meus links?</summary><p>Não. O modelo altera apenas a aparência; nome, bio e links são preservados.</p></details>
      <details><summary>O que acontece se eu remover um modelo da comunidade?</summary><p>A publicação pública é removida, mas sua página original continua salva.</p></details>
    </section>
  `;
}

function editorPage() {
  const panels = {
    content: contentPanel,
    appearance: appearancePanel,
    analytics: analyticsPanel,
  };
  const sections = {
    account: accountPanel,
    pages: myPagesPanel,
    community: communityPanel,
    support: supportPanel,
  };
  const isEditor = state.activeSection === "editor";
  const panel = isEditor ? (panels[state.activeTab] || contentPanel) : (sections[state.activeSection] || accountPanel);
  return `
    <main class="app-shell">
      <header class="app-topbar">
        <div class="topbar-brand-group">
          <button class="menu-button" data-action="open-menu" aria-label="Abrir menu"><span></span><span></span><span></span></button>
          <button class="topbar-logo" data-app-section="editor" aria-label="Abrir editor">${brand()}</button>
        </div>
        <div class="topbar-actions">
          <span class="save-status">Salvo neste navegador</span>
          <a class="button button--ghost button--small" href="#public">Prévia da página</a>
          <button class="button ${state.profile.published ? "button--accent" : "button--primary"} button--small" data-action="publish">
            ${state.profile.published ? (hasUnpublishedChanges() ? "Publicar alterações" : "Publicado") : "Publicar"}
          </button>
        </div>
      </header>
      ${appMenuMarkup()}
      <div class="workspace ${isEditor ? "" : "workspace--section"}">
        ${isEditor ? sidebar() : ""}
        <section class="editor-panel ${isEditor ? "" : "editor-panel--section"}">${panel()}</section>
        ${isEditor ? `<aside class="preview-panel" aria-label="Prévia da sua página">
          <div class="preview-wrap">
            <div class="preview-label"><span>PRÉVIA AO VIVO</span><a href="#public">Abrir ↗</a></div>
            <div class="preview-phone"><div class="preview-screen">${publicProfileMarkup()}</div></div>
          </div>
        </aside>` : ""}
      </div>
    </main>
  `;
}

function publicPage() {
  return `
    <main class="public-page">
      <div class="public-actions">
        <button class="public-action" data-action="share" aria-label="Compartilhar página" title="Compartilhar">↗</button>
        <a class="public-action" href="#editor" aria-label="Editar página" title="Editar">✎</a>
      </div>
      ${publicProfileMarkup()}
    </main>
  `;
}

let publicRouteToken = 0;
async function loadPublicRoute(username) {
  const token = ++publicRouteToken;
  const app = document.querySelector('#app');
  app.innerHTML = '<main class="public-page"><div class="profile-canvas bg-light"><div class="profile-inner"><p class="public-bio">Carregando página...</p></div></div></main>';
  if (!authClient) { app.innerHTML = publicNotFound('Não foi possível carregar esta página.'); return; }
  const { data, error } = await authClient.from('linkki_public_pages').select('public_data').eq('username',username).maybeSingle();
  if (token !== publicRouteToken || location.hash.replace(/^#\/?/, '').toLowerCase() !== username) return;
  if (error || !data?.public_data?.profile || !Array.isArray(data.public_data.links)) {
    app.innerHTML = publicNotFound(error ? 'Não foi possível carregar esta página.' : 'Esta página não está publicada.');
  } else {
    app.innerHTML = `<main class="public-page">${publicProfileMarkup(data.public_data)}</main>`;
  }
  bindEvents();
}
function publicNotFound(message) {
  return `<main class="public-page"><div class="profile-canvas bg-light"><div class="profile-inner"><div class="public-avatar">木</div><h1 class="public-name">${escapeHtml(message)}</h1><a class="button button--primary" href="#home">Voltar ao Linkki</a></div></div></main>`;
}

function render() {
  const app = document.querySelector("#app");
  const route = location.hash.replace(/^#\/?/, "") || "home";
  if (route === "signup") {
    app.innerHTML = state.account.loggedIn ? editorPage() : signupPage();
  } else if (route === "login") {
    app.innerHTML = state.account.loggedIn ? editorPage() : loginPage();
  } else if (route === "editor") {
    if (!state.account.verified) app.innerHTML = signupPage();
    else if (!state.account.loggedIn) app.innerHTML = loginPage();
    else app.innerHTML = editorPage();
  } else if (route === "public") {
    app.innerHTML = publicPage();
  } else if (/^[a-z0-9_.-]{3,30}$/i.test(route) && route !== "home") {
    loadPublicRoute(route.toLowerCase());
    return;
  } else {
    app.innerHTML = landingPage();
  }
  bindEvents();
  window.scrollTo({ top: 0, behavior: "instant" });
}

function refreshEditorViews() {
  saveState();
  render();
}

function updateProfileField(field, value, shouldRender = true) {
  state.profile[field] = value;
  saveState();
  if (shouldRender) render();
}

function addLink() {
  state.links.push({
    id: crypto.randomUUID(),
    title: "Novo link",
    url: "https://",
    visible: true,
    clicks: 0,
  });
  refreshEditorViews();
  requestAnimationFrame(() => {
    const cards = document.querySelectorAll(".link-editor");
    const last = cards[cards.length - 1];
    last?.querySelector('[data-link-field="title"]')?.select();
    last?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

function moveLink(id, direction) {
  const index = state.links.findIndex((link) => link.id === id);
  const next = index + direction;
  if (index < 0 || next < 0 || next >= state.links.length) return;
  [state.links[index], state.links[next]] = [state.links[next], state.links[index]];
  refreshEditorViews();
}

function bindEvents() {
  const setFormError = (form, message) => {
    const error = form?.querySelector(".form-error");
    if (error) error.textContent = message;
  };

  const detailsForm = document.querySelector('[data-form="signup-details"]');
  const usernameField = detailsForm?.querySelector('[name="username"]');
  const usernameStatus = detailsForm?.querySelector('[data-username-status]');
  let usernameCheckSequence = 0;
  async function checkUsernameInForm() {
    const nickname = String(usernameField?.value || '').trim().toLowerCase();
    const sequence = ++usernameCheckSequence;
    if (!nickname) { if (usernameStatus) usernameStatus.textContent = ''; return false; }
    if (!/^[a-z0-9._-]{3,30}$/.test(nickname)) {
      if (usernameStatus) usernameStatus.textContent = 'Use de 3 a 30 caracteres: letras, números, ponto, hífen ou underline.';
      return false;
    }
    if (usernameStatus) usernameStatus.textContent = 'Verificando disponibilidade...';
    try {
      const available = await checkUsernameAvailability(nickname);
      if (sequence !== usernameCheckSequence || nickname !== String(usernameField?.value || '').trim().toLowerCase()) return false;
      if (usernameStatus) usernameStatus.textContent = available ? 'Nome de usuário disponível ✓' : 'Esse nome de usuário já está em uso.';
      return available;
    } catch (error) {
      if (usernameStatus && sequence === usernameCheckSequence) usernameStatus.textContent = error.message;
      return false;
    }
  }
  usernameField?.addEventListener('blur', checkUsernameInForm);
  usernameField?.addEventListener('input', () => { usernameCheckSequence++; if (usernameStatus) usernameStatus.textContent = ''; });
  detailsForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(detailsForm);
    const firstName = String(data.get("firstName") || "").trim();
    const lastName = String(data.get("lastName") || "").trim();
    const username = String(data.get("username") || "").toLowerCase().replace(/[^a-z0-9._-]/g, "").slice(0, 30);
    const email = String(data.get("email") || "").trim().toLowerCase();
    const password = String(data.get("password") || "");
    const passwordConfirm = String(data.get("passwordConfirm") || "");
    if (password.length < 8 || password !== passwordConfirm) {
      setFormError(detailsForm, "A senha deve ter pelo menos 8 caracteres e ser igual nos dois campos."); return;
    }

    if (!firstName || !lastName || !username || !email) {
      setFormError(detailsForm, "Preencha todos os campos para continuar.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError(detailsForm, "Digite um endereço de e-mail válido.");
      return;
    }

    if (!requireAuthClient(detailsForm)) return;
    const continueButton = detailsForm.querySelector('[type="submit"]');
    continueButton.disabled = true;
    const available = await checkUsernameInForm();
    continueButton.disabled = false;
    if (!available) {
      setFormError(detailsForm, 'Escolha um nome de usuário disponível antes de continuar.');
      return;
    }
    state.account = { ...state.account, firstName, lastName, username, email };
    pendingSignupPassword = password;
    state.signupStep = 2;
    saveState();
    render();
  });

  document.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      state.account.category = button.dataset.category;
      saveState();
      render();
    });
  });

  const categoryForm = document.querySelector('[data-form="signup-category"]');
  categoryForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!state.account.category) { setFormError(categoryForm, "Selecione a opção que melhor descreve você."); return; }
    if (!requireAuthClient(categoryForm)) return;
    const button = categoryForm.querySelector('[type="submit"]');
    button.disabled = true;
    try {
      const { error } = await authClient.auth.signUp({
        email: state.account.email,
        password: pendingSignupPassword,
        options: { data: {
          first_name: state.account.firstName, last_name: state.account.lastName,
          username: state.account.username, category: state.account.category
        } }
      });
      if (error) throw error;
      state.signupStep = 3; saveState(); render(); showToast("Código enviado para seu e-mail.");
    } catch (error) { setFormError(categoryForm, authError(error)); }
    finally { button.disabled = false; }
  });

  document.querySelectorAll('[data-action="signup-back"]').forEach((button) => {
    button.addEventListener("click", () => {
      state.signupStep = Math.max(1, state.signupStep - 1);
      saveState();
      render();
    });
  });

  document.querySelector('[data-action="resend-code"]')?.addEventListener("click", async (event) => {
    if (!requireAuthClient(verifyForm)) return;
    const button = event.currentTarget; button.disabled = true;
    try {
      const { error } = await authClient.auth.resend({ type: "signup", email: state.account.email });
      if (error) throw error;
      showToast("Novo código enviado.");
    } catch (error) { setFormError(verifyForm, authError(error)); }
    finally { button.disabled = false; }
  });

  const verifyForm = document.querySelector('[data-form="signup-verify"]');
  verifyForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!requireAuthClient(verifyForm)) return;
    const code = String(new FormData(verifyForm).get("code") || "").replace(/\D/g, "");
    if (code.length !== 6) { setFormError(verifyForm, "Digite os seis números do código."); return; }
    const button = verifyForm.querySelector('[type="submit"]'); button.disabled = true;
    try {
      const { data, error } = await authClient.auth.verifyOtp({ email: state.account.email, token: code, type: "signup" });
      if (error) throw error;
      if (!data.session) throw new Error('Não foi possível iniciar a sessão.');
      state.account.verified = true; state.account.loggedIn = true;
      pendingSignupPassword = "";
      state.profile.name = `${state.account.firstName} ${state.account.lastName}`.trim();
      state.profile.username = state.account.username; state.profile.published = false;
      await initializeCloudForUser(data.user);
      state.activeTab = "content"; saveState(); location.hash = "#editor"; render();
      showToast("Conta verificada! Sua Linkki está pronta.");
    } catch (error) { setFormError(verifyForm, authError(error)); }
    finally { button.disabled = false; }
  });

  document.querySelector('[data-action="toggle-password-reset"]')?.addEventListener("click", () => {
    state.passwordResetMode = !state.passwordResetMode;
    state.loginCodeSent = false;
    render();
  });

  const loginForm = document.querySelector('[data-form="login"]');
  loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!requireAuthClient(loginForm)) return;
    const data = new FormData(loginForm);
    const email = String(data.get("loginEmail") || "").trim().toLowerCase();
    const button = loginForm.querySelector('[type="submit"]'); button.disabled = true;
    try {
      if (state.passwordResetMode && !state.loginCodeSent) {
        const { error } = await authClient.auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
        if (error) throw error;
        state.account.email = email; state.loginCodeSent = true; render();
        showToast("Confira seu e-mail para definir a senha.");
        return;
      }
      let result;
      if (state.passwordResetMode) {
        const code = String(data.get("loginCode") || "").replace(/\D/g, "");
        const password = String(data.get("newPassword") || "");
        if (code.length !== 6) throw new Error("Digite os seis números do código.");
        if (password.length < 8 || password !== String(data.get("newPasswordConfirm") || "")) throw new Error("Use uma senha de 8 caracteres ou mais, igual nos dois campos.");
        const verified = await authClient.auth.verifyOtp({ email, token: code, type: "email" });
        if (verified.error) throw verified.error;
        if (!verified.data.session) throw new Error("Não foi possível verificar o código.");
        const updated = await authClient.auth.updateUser({ password });
        if (updated.error) throw updated.error;
        result = verified.data;
      } else {
        const signed = await authClient.auth.signInWithPassword({ email, password: String(data.get("loginPassword") || "") });
        if (signed.error) throw signed.error;
        result = signed.data;
      }
      if (!result.session) throw new Error("Não foi possível iniciar a sessão.");
      state.account.verified = true; state.account.loggedIn = true;
      state.loginCodeSent = false; state.passwordResetMode = false;
      state.account.email = email;
      const metadata = result.user?.user_metadata || {};
      state.account.firstName = metadata.first_name || state.account.firstName;
      state.account.lastName = metadata.last_name || state.account.lastName;
      state.account.username = metadata.username || state.account.username;
      state.profile.name = `${state.account.firstName} ${state.account.lastName}`.trim() || state.profile.name;
      state.profile.username = state.account.username || state.profile.username;
      await initializeCloudForUser(result.user);
      saveState(); location.hash = "#editor"; render();
    } catch (error) { setFormError(loginForm, authError(error)); }
    finally { button.disabled = false; }
  });

  document.querySelectorAll('[data-action="logout"]').forEach((button) => {
    button.addEventListener("click", async () => {
      if (!authClient) { showToast("Conexão com o Supabase indisponível."); return; }
      button.disabled = true;
      try {
        // Aguarda o salvamento automático pendente antes de encerrar a sessão.
        if (cloudSaveTimer) await new Promise((resolve) => setTimeout(resolve, 750));
        await cloudSaveChain;
        const { error } = await authClient.auth.signOut();
        if (error) throw error;
        clearTimeout(cloudSaveTimer);
        cloudSaveTimer = null;
        cloudReady = false;
        cloudUserId = null;
        cloudRevision++;
        cloudErrorShown = false;
        menuOpen = false;
        pendingSignupPassword = "";
        state = cloneDefaultState();
        localStorage.removeItem(STORAGE_KEY);
        location.hash = "#login";
        render();
      } catch (error) {
        showToast("Não foi possível sair: " + authError(error));
        button.disabled = false;
      }
    });
  });

  document.querySelector('[data-action="open-menu"]')?.addEventListener("click", () => {
    menuOpen = true;
    render();
  });

  document.querySelectorAll('[data-action="close-menu"]').forEach((button) => {
    button.addEventListener("click", () => {
      menuOpen = false;
      render();
    });
  });

  document.querySelectorAll("[data-app-section]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeSection = button.dataset.appSection;
      if (state.activeSection === "community" && !["discover", "mine", "publish"].includes(state.communityView)) {
        state.communityView = "discover";
      }
      menuOpen = false;
      saveState();
      render();
    });
  });

  document.querySelector('[data-action="create-page"]')?.addEventListener("click", () => {
    syncCurrentPageSnapshot();
    const number = state.userPages.length + 1;
    const id = `page-${crypto.randomUUID()}`;
    const page = {
      id,
      title: `Nova página ${number}`,
      profileName: state.profile.name || "Sua nova página",
      username: `pagina${number}`,
      active: false,
      appearance: appearanceSnapshot(state.profile),
    };
    state.userPages.push(page);
    state.currentPageId = id;
    state.profile.username = page.username;
    state.profile.published = false;
    state.activeSection = "editor";
    state.activeTab = "content";
    saveState();
    render();
    showToast("Nova página criada. Comece a personalizar!");
  });

  document.querySelectorAll('[data-action="open-page"]').forEach((button) => {
    button.addEventListener("click", () => {
      syncCurrentPageSnapshot();
      const page = state.userPages.find((item) => item.id === button.dataset.pageId);
      if (!page) return;
      const appearance = JSON.parse(JSON.stringify(page.appearance));
      state.currentPageId = page.id;
      state.profile.name = page.profileName || page.title;
      state.profile.username = page.username;
      state.profile.published = page.active;
      state.profile.customColors = appearance.customColors;
      state.profile.buttonStyle = appearance.buttonStyle;
      state.profile.buttonBorder = appearance.buttonBorder;
      state.profile.buttonShadow = appearance.buttonShadow;
      state.profile.titleFont = appearance.titleFont;
      state.profile.bodyFont = appearance.bodyFont;
      state.activeSection = "editor";
      state.activeTab = "content";
      saveState();
      render();
    });
  });

  document.querySelectorAll('[data-action="toggle-page-status"]').forEach((button) => {
    button.addEventListener("click", () => {
      const page = state.userPages.find((item) => item.id === button.dataset.pageId);
      if (!page) return;
      page.active = !page.active;
      if (state.currentPageId === page.id) state.profile.published = page.active;
      saveState();
      render();
      showToast(page.active ? "Página ativada." : "Página desativada.");
    });
  });

  document.querySelectorAll("[data-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTab = button.dataset.tab;
      refreshEditorViews();
    });
  });

  document.querySelectorAll("[data-community-view]").forEach((button) => {
    button.addEventListener("click", () => {
      state.communityView = button.dataset.communityView;
      saveState();
      render();
    });
  });

  document.querySelectorAll('[data-action="like-template"]').forEach((button) => {
    button.addEventListener("click", () => {
      const template = state.communityTemplates.find((item) => item.id === button.dataset.templateId);
      if (!template) return;
      template.liked = !template.liked;
      template.likes = Math.max(0, Number(template.likes || 0) + (template.liked ? 1 : -1));
      saveState();
      render();
    });
  });

  document.querySelectorAll('[data-action="apply-template"]').forEach((button) => {
    button.addEventListener("click", () => {
      const template = state.communityTemplates.find((item) => item.id === button.dataset.templateId && item.published);
      if (!template) return;
      const appearance = JSON.parse(JSON.stringify(template.appearance));
      state.profile.customColors = appearance.customColors;
      state.profile.buttonStyle = appearance.buttonStyle;
      state.profile.buttonBorder = appearance.buttonBorder;
      state.profile.buttonShadow = appearance.buttonShadow;
      state.profile.titleFont = appearance.titleFont;
      state.profile.bodyFont = appearance.bodyFont;
      state.profile.background = "custom";
      template.uses = Number(template.uses || 0) + 1;
      state.activeSection = "editor";
      state.activeTab = "appearance";
      saveState();
      render();
      showToast("Modelo aplicado. Seus links e informações foram preservados.");
    });
  });

  document.querySelectorAll('[data-action="publish-page-template"]').forEach((button) => {
    button.addEventListener("click", () => {
      syncCurrentPageSnapshot();
      const page = state.userPages.find((item) => item.id === button.dataset.pageId);
      if (!page) return;
      const existing = state.communityTemplates.find((template) => template.ownerId === "self" && template.sourcePageId === page.id);
      if (existing) {
        existing.published = true;
        existing.appearance = JSON.parse(JSON.stringify(page.appearance));
      } else {
        const author = `${state.account.firstName || ""} ${state.account.lastName || ""}`.trim() || state.profile.name || "Você";
        const category = accountCategories.find(([id]) => id === state.account.category)?.[2] || "Criadores";
        state.communityTemplates.unshift({
          id: `template-user-${crypto.randomUUID()}`,
          sourcePageId: page.id,
          ownerId: "self",
          author,
          initials: initials(author),
          title: page.title,
          category,
          likes: existing?.likes || 0,
          uses: existing?.uses || 0,
          liked: false,
          published: true,
          appearance: JSON.parse(JSON.stringify(page.appearance)),
        });
      }
      state.communityView = "mine";
      saveState();
      render();
      showToast("Modelo publicado na comunidade.");
    });
  });

  document.querySelectorAll('[data-action="unpublish-template"]').forEach((button) => {
    button.addEventListener("click", () => {
      const template = state.communityTemplates.find((item) => item.id === button.dataset.templateId && item.ownerId === "self");
      if (!template) return;
      template.published = false;
      saveState();
      render();
      showToast("Publicação removida. Sua página continua salva.");
    });
  });

  document.querySelectorAll("[data-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      updateProfileField(button.dataset.choice, button.dataset.value);
    });
  });

  document.querySelectorAll("[data-color-picker]").forEach((picker) => {
    picker.addEventListener("input", () => {
      const field = picker.dataset.colorPicker;
      state.profile.customColors[field] = picker.value.toUpperCase();
      const codeInput = document.querySelector(`[data-color-field="${field}"]`);
      if (codeInput) codeInput.value = state.profile.customColors[field];
      saveState();
      syncLivePreview();
    });
  });

  document.querySelectorAll("[data-color-field]").forEach((input) => {
    input.addEventListener("input", () => {
      const field = input.dataset.colorField;
      const value = input.value.startsWith("#") ? input.value : `#${input.value}`;
      state.profile.customColors[field] = value.toUpperCase();
      const picker = document.querySelector(`[data-color-picker="${field}"]`);
      if (picker && /^#[0-9a-f]{6}$/i.test(value)) picker.value = value;
      saveState();
      syncLivePreview();
    });
    input.addEventListener("change", () => {
      const field = input.dataset.colorField;
      if (!/^#[0-9a-f]{6}$/i.test(state.profile.customColors[field])) {
        state.profile.customColors[field] = cloneDefaultState().profile.customColors[field];
        input.value = state.profile.customColors[field];
        showToast("Use uma cor hexadecimal com 6 caracteres.");
      }
      saveState();
      render();
    });
  });

  document.querySelector('[data-action="toggle-border"]')?.addEventListener("click", () => {
    state.profile.buttonBorder.enabled = !state.profile.buttonBorder.enabled;
    saveState();
    render();
  });

  document.querySelector('[data-action="toggle-shadow"]')?.addEventListener("click", () => {
    state.profile.buttonShadow.enabled = !state.profile.buttonShadow.enabled;
    saveState();
    render();
  });

  document.querySelector("[data-border-picker]")?.addEventListener("input", (event) => {
    state.profile.buttonBorder.color = event.target.value.toUpperCase();
    const codeInput = document.querySelector("[data-border-color]");
    if (codeInput) codeInput.value = state.profile.buttonBorder.color;
    saveState();
    syncLivePreview();
  });

  document.querySelector("[data-border-color]")?.addEventListener("input", (event) => {
    const value = event.target.value.startsWith("#") ? event.target.value : `#${event.target.value}`;
    state.profile.buttonBorder.color = value.toUpperCase();
    const picker = document.querySelector("[data-border-picker]");
    if (picker && /^#[0-9a-f]{6}$/i.test(value)) picker.value = value;
    saveState();
    syncLivePreview();
  });

  document.querySelector("[data-border-color]")?.addEventListener("change", (event) => {
    if (!/^#[0-9a-f]{6}$/i.test(state.profile.buttonBorder.color)) {
      state.profile.buttonBorder.color = "#2A3C24";
      event.target.value = state.profile.buttonBorder.color;
      showToast("Use uma cor hexadecimal com 6 caracteres.");
    }
    saveState();
    render();
  });

  document.querySelectorAll("[data-shadow-field]").forEach((input) => {
    input.addEventListener("input", () => {
      const field = input.dataset.shadowField;
      state.profile.buttonShadow[field] = Number(input.value);
      const output = document.querySelector(`[data-shadow-output="${field}"]`);
      if (output) output.textContent = `${input.value}${input.dataset.suffix}`;
      saveState();
      syncLivePreview();
    });
  });

  const applyFont = (target, fontId) => {
    if (!fontPresets[fontId] && !state.profile.customFonts.some((font) => font.id === fontId)) return;
    state.profile[target] = fontId;
    state.profile.recentFonts = [fontId, ...state.profile.recentFonts.filter((id) => id !== fontId)].slice(0, 5);
    saveState();
    render();
  };

  document.querySelectorAll("[data-font-view]").forEach((button) => {
    button.addEventListener("click", () => {
      state.profile.fontViews[button.dataset.fontTarget] = button.dataset.fontView;
      saveState();
      render();
    });
  });

  document.querySelectorAll("[data-font-quick]").forEach((button) => {
    button.addEventListener("click", () => applyFont(button.dataset.fontTarget, button.dataset.fontQuick));
  });

  document.querySelectorAll('[data-action="install-font"]').forEach((button) => {
    button.addEventListener("click", () => {
      pendingFontTarget = button.dataset.fontTarget;
      document.querySelector("#font-file-input")?.click();
    });
  });

  document.querySelector("#font-file-input")?.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      showToast("Escolha uma fonte de até 1,5 MB.");
      return;
    }
    if (!/\.(woff2?|ttf|otf)$/i.test(file.name)) {
      showToast("Formato não suportado. Use WOFF, WOFF2, TTF ou OTF.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const font = {
        id: `custom-${crypto.randomUUID()}`,
        name: file.name.replace(/\.[^.]+$/, "").slice(0, 40),
        dataUrl: reader.result,
      };
      state.profile.customFonts.push(font);
      state.profile[pendingFontTarget] = font.id;
      state.profile.recentFonts = [font.id, ...state.profile.recentFonts.filter((id) => id !== font.id)].slice(0, 5);
      saveState();
      render();
      showToast("Fonte instalada na sua Linkki.");
    };
    reader.readAsDataURL(file);
  });

  const nameInput = document.querySelector('[name="profile-name"]');
  const usernameInput = document.querySelector('[name="profile-username"]');
  const bioInput = document.querySelector('[name="profile-bio"]');

  nameInput?.addEventListener("input", (event) => {
    state.profile.name = event.target.value;
    saveState();
    syncLivePreview();
  });
  nameInput?.addEventListener("change", (event) => {
    state.profile.name = event.target.value.trim() || "Seu nome";
    event.target.value = state.profile.name;
    saveState();
    syncLivePreview();
  });

  usernameInput?.addEventListener("input", (event) => {
    const clean = event.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, "").slice(0, 30);
    event.target.value = clean;
    state.profile.username = clean;
    saveState();
    syncLivePreview();
  });
  usernameInput?.addEventListener("change", (event) => {
    state.profile.username = event.target.value || "usuario";
    event.target.value = state.profile.username;
    saveState();
    syncLivePreview();
  });

  bioInput?.addEventListener("input", (event) => {
    state.profile.bio = event.target.value;
    const counter = event.target.closest(".field")?.querySelector(".field-label small");
    if (counter) counter.textContent = `${event.target.value.length}/160`;
    saveState();
    syncLivePreview();
  });

  document.querySelector('[data-action="add-link"]')?.addEventListener("click", addLink);
  document.querySelector('[data-action="remove-avatar"]')?.addEventListener("click", () => updateProfileField("avatar", ""));

  document.querySelector("#avatar-input")?.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast("Escolha uma imagem de até 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => updateProfileField("avatar", reader.result);
    reader.readAsDataURL(file);
  });

  document.querySelectorAll(".link-editor").forEach((card) => {
    const id = card.dataset.linkId;
    card.querySelectorAll("[data-link-field]").forEach((input) => {
      input.addEventListener("input", () => {
        const link = state.links.find((item) => item.id === id);
        if (!link) return;
        link[input.dataset.linkField] = input.value;
        saveState();
        syncLivePreview();
      });
      input.addEventListener("change", () => {
        const link = state.links.find((item) => item.id === id);
        if (!link) return;
        link[input.dataset.linkField] = input.value.trim();
        input.value = link[input.dataset.linkField];
        saveState();
        syncLivePreview();
      });
    });

    card.querySelector('[data-action="toggle-link"]')?.addEventListener("click", () => {
      const link = state.links.find((item) => item.id === id);
      if (!link) return;
      link.visible = !link.visible;
      refreshEditorViews();
    });

    card.querySelector('[data-action="delete-link"]')?.addEventListener("click", () => {
      state.links = state.links.filter((item) => item.id !== id);
      refreshEditorViews();
      showToast("Link removido.");
    });

    card.querySelector('[data-action="move-up"]')?.addEventListener("click", () => moveLink(id, -1));
    card.querySelector('[data-action="move-down"]')?.addEventListener("click", () => moveLink(id, 1));

    card.addEventListener("dragstart", () => card.classList.add("is-dragging"));
    card.addEventListener("dragend", () => card.classList.remove("is-dragging"));
    card.addEventListener("dragover", (event) => event.preventDefault());
    card.addEventListener("drop", (event) => {
      event.preventDefault();
      const dragging = document.querySelector(".link-editor.is-dragging");
      if (!dragging || dragging === card) return;
      const from = state.links.findIndex((item) => item.id === dragging.dataset.linkId);
      const to = state.links.findIndex((item) => item.id === id);
      const [moved] = state.links.splice(from, 1);
      state.links.splice(to, 0, moved);
      refreshEditorViews();
    });
  });

  document.querySelector('[data-action="publish"]')?.addEventListener("click", async (event) => {
    if (publishInProgress || !cloudReady || !cloudUserId || !authClient) {
      showToast("Aguarde a conexão com sua conta para publicar.");
      return;
    }
    const owner = cloudUserId;
    const wasPublished = Boolean(state.profile.published);
    if (wasPublished && !hasUnpublishedChanges()) {
      showToast("Sua página já está publicada.");
      return;
    }
    publishInProgress = true;
    const button = event.currentTarget;
    button.disabled = true;
    button.textContent = 'Publicando...';
    try {
      const username = String(state.account.username || '').toLowerCase().trim();
      if (!/^[a-z0-9_.-]{3,30}$/.test(username)) throw new Error('Nickname inválido');
      const payload = publicPublishPayload();
      const { error } = await authClient.from('linkki_public_pages').upsert({
        user_id: owner, username, public_data: payload, updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
      if (error) throw error;
      if (owner !== cloudUserId) return;
      publishedFingerprint = JSON.stringify(payload);
      state.profile.published = true;
      saveState();
      render();
      showToast(wasPublished ? 'Alterações publicadas!' : 'Sua Linkki está publicada!');
    } catch (error) {
      console.error('Linkki: erro ao publicar', error);
      showToast('Não foi possível publicar. Tente novamente.');
      button.disabled = false;
      button.textContent = wasPublished ? 'Publicar alterações' : 'Publicar';
    } finally { publishInProgress = false; }
  });

  document.querySelector('[data-action="share"]')?.addEventListener("click", async () => {
    state.analytics.shares += 1;
    saveState();
    const url = `${location.origin}${location.pathname}#/${encodeURIComponent(state.account.username || state.profile.username)}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${state.profile.name} na Linkki`, text: state.profile.bio, url });
      } else {
        await navigator.clipboard.writeText(url);
        showToast("Link copiado!");
      }
    } catch (error) {
      if (error?.name !== "AbortError") showToast("Não foi possível compartilhar.");
    }
  });

  document.querySelectorAll("[data-public-link]").forEach((linkElement) => {
    linkElement.addEventListener("click", () => {
      const link = state.links.find((item) => item.id === linkElement.dataset.publicLink);
      if (link && state.account.loggedIn && location.hash === "#public") {
        link.clicks = (Number(link.clicks) || 0) + 1;
        saveState();
      }
    });
  });
}

window.addEventListener("hashchange", render);
window.addEventListener("DOMContentLoaded", restoreSupabaseSession);
