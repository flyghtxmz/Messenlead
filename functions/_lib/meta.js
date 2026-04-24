const DEFAULT_SCOPES = [
  "pages_show_list",
  "pages_messaging",
  "pages_manage_metadata"
].join(",");

const SESSION_COOKIE = "messenlead_meta_session";
const STATE_COOKIE = "messenlead_oauth_state";

export function getMetaConfig(request, env) {
  const origin = new URL(request.url).origin;
  const appId = env.META_APP_ID || env.FACEBOOK_APP_ID;
  const appSecret = env.META_APP_SECRET || env.FACEBOOK_APP_SECRET || env.MESSENGER_APP_SECRET;
  const redirectUri = env.META_REDIRECT_URI || `${origin}/api/auth/facebook/callback`;
  const version = env.META_GRAPH_API_VERSION || "v23.0";
  const scopes = env.META_SCOPES || DEFAULT_SCOPES;
  const sessionSecret = env.SESSION_SECRET || appSecret;

  return { appId, appSecret, redirectUri, version, scopes, sessionSecret };
}

export function requireMetaConfig(config) {
  const missing = [];
  if (!config.appId) missing.push("META_APP_ID");
  if (!config.appSecret) missing.push("META_APP_SECRET");
  if (!config.sessionSecret) missing.push("SESSION_SECRET");

  if (missing.length) {
    return json({ error: `Missing environment variable: ${missing.join(", ")}` }, 500);
  }

  return null;
}

export function facebookDialogUrl(config, state) {
  const url = new URL(`https://www.facebook.com/${config.version}/dialog/oauth`);
  url.searchParams.set("client_id", config.appId);
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("scope", config.scopes);
  url.searchParams.set("response_type", "code");
  return url.toString();
}

export async function exchangeCodeForToken(config, code) {
  const url = new URL(`https://graph.facebook.com/${config.version}/oauth/access_token`);
  url.searchParams.set("client_id", config.appId);
  url.searchParams.set("client_secret", config.appSecret);
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("code", code);

  const token = await graphFetch(url);
  return exchangeLongLivedToken(config, token.access_token);
}

export async function exchangeLongLivedToken(config, accessToken) {
  const url = new URL(`https://graph.facebook.com/${config.version}/oauth/access_token`);
  url.searchParams.set("grant_type", "fb_exchange_token");
  url.searchParams.set("client_id", config.appId);
  url.searchParams.set("client_secret", config.appSecret);
  url.searchParams.set("fb_exchange_token", accessToken);

  try {
    return await graphFetch(url);
  } catch {
    return { access_token: accessToken };
  }
}

export async function getSession(request, env) {
  const config = getMetaConfig(request, env);
  const cookies = parseCookies(request.headers.get("cookie") || "");
  const rawSession = cookies[SESSION_COOKIE];

  if (!rawSession || !config.sessionSecret) return null;

  try {
    const session = await decryptSession(rawSession, config.sessionSecret);
    if (session.expiresAt && Date.now() > session.expiresAt) return null;
    return session;
  } catch {
    return null;
  }
}

export async function createSessionHeader(request, config, data) {
  const secure = new URL(request.url).protocol === "https:";
  const value = await encryptSession(data, config.sessionSecret);
  return serializeCookie(SESSION_COOKIE, value, {
    maxAge: 60 * 60 * 24 * 60,
    httpOnly: true,
    secure,
    sameSite: "Lax",
    path: "/"
  });
}

export function createStateHeader(request, state) {
  const secure = new URL(request.url).protocol === "https:";
  return serializeCookie(STATE_COOKIE, state, {
    maxAge: 60 * 10,
    httpOnly: true,
    secure,
    sameSite: "Lax",
    path: "/"
  });
}

export function clearStateHeader() {
  return serializeCookie(STATE_COOKIE, "", { maxAge: 0, httpOnly: true, sameSite: "Lax", path: "/" });
}

export function clearSessionHeader() {
  return serializeCookie(SESSION_COOKIE, "", { maxAge: 0, httpOnly: true, sameSite: "Lax", path: "/" });
}

export function getExpectedState(request) {
  const cookies = parseCookies(request.headers.get("cookie") || "");
  return cookies[STATE_COOKIE] || "";
}

export async function getUserProfile(userAccessToken, config) {
  const url = graphUrl(config, "/me", {
    fields: "id,name,picture",
    access_token: userAccessToken
  });
  return graphFetch(url);
}

export async function getManagedPages(userAccessToken, config) {
  const url = graphUrl(config, "/me/accounts", {
    fields: "id,name,category,access_token,picture{url},tasks",
    limit: "100",
    access_token: userAccessToken
  });
  const result = await graphFetch(url);
  return result.data || [];
}

export async function getPageAccessToken(request, env, pageId) {
  const session = await getSession(request, env);
  if (!session?.accessToken) return "";

  const config = getMetaConfig(request, env);
  const pages = await getManagedPages(session.accessToken, config);
  const page = pages.find((item) => item.id === pageId);
  return page?.access_token || "";
}

export async function graphFetch(url, init) {
  const response = await fetch(url.toString(), init);
  const text = await response.text();
  const payload = text ? safeJson(text) : {};

  if (!response.ok) {
    const message = payload?.error?.message || payload?.error || text || `Graph API HTTP ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload || {};
}

export function graphUrl(config, path, params = {}) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`https://graph.facebook.com/${config.version}${normalizedPath}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  return url;
}

export function json(payload, status = 200, headers = {}) {
  const responseHeaders = new Headers({
    "Content-Type": "application/json"
  });

  appendHeaders(responseHeaders, headers);

  return new Response(JSON.stringify(payload), {
    status,
    headers: responseHeaders
  });
}

export function redirect(location, headers = {}) {
  const responseHeaders = new Headers({ Location: location });
  appendHeaders(responseHeaders, headers);

  return new Response(null, {
    status: 302,
    headers: responseHeaders
  });
}

export function randomState() {
  const values = crypto.getRandomValues(new Uint8Array(24));
  return base64UrlEncode(values);
}

function parseCookies(header) {
  return Object.fromEntries(
    header
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        if (index === -1) return [part, ""];
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      })
  );
}

function appendHeaders(headers, values) {
  Object.entries(values).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => headers.append(key, item));
      return;
    }
    headers.set(key, value);
  });
}

function serializeCookie(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];

  if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`);
  if (options.path) parts.push(`Path=${options.path}`);
  if (options.httpOnly) parts.push("HttpOnly");
  if (options.secure) parts.push("Secure");
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);

  return parts.join("; ");
}

async function encryptSession(data, secret) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await aesKey(secret);
  const payload = new TextEncoder().encode(JSON.stringify(data));
  const cipher = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, payload));
  return `${base64UrlEncode(iv)}.${base64UrlEncode(cipher)}`;
}

async function decryptSession(value, secret) {
  const [rawIv, rawCipher] = value.split(".");
  if (!rawIv || !rawCipher) throw new Error("Invalid session");

  const iv = base64UrlDecode(rawIv);
  const cipher = base64UrlDecode(rawCipher);
  const key = await aesKey(secret);
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, cipher);
  return JSON.parse(new TextDecoder().decode(plain));
}

async function aesKey(secret) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret));
  return crypto.subtle.importKey("raw", digest, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

function base64UrlEncode(bytes) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function safeJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
