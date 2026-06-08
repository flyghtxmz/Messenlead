import { getGrantedPermissions, getManagedPages, getMetaConfig, getSession, json, subscribePageToMessengerWebhooks } from "../../_lib/meta.js";
import { listStoredConnectedPages, upsertConnectedPages } from "../../_lib/pages.js";

const DEFAULT_PAGES_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export async function onRequestGet({ request, env }) {
  const session = await getSession(request, env);

  if (!session?.accessToken) {
    return json({ error: "Not authenticated" }, 401);
  }

  try {
    const url = new URL(request.url);
    const forceRefresh = isForceRefresh(url.searchParams.get("refresh")) || isForceRefresh(url.searchParams.get("force"));
    const cacheTtlMs = pagesCacheTtlMs(env);

    if (!forceRefresh) {
      const cachedPages = await listStoredConnectedPages(env, session.user?.id || "", { maxAgeMs: cacheTtlMs });
      if (cachedPages.length) {
        return pagesJson(cachedPages, {
          source: "d1",
          cached: true,
          cacheTtlSeconds: Math.round(cacheTtlMs / 1000),
          pageCount: cachedPages.length,
          grantedPermissions: [],
          declinedPermissions: [],
          webhookSubscriptions: []
        });
      }
    }

    const config = getMetaConfig(request, env);
    let pages = [];
    try {
      pages = await getManagedPages(session.accessToken, config);
    } catch (error) {
      const stalePages = await listStoredConnectedPages(env, session.user?.id || "");
      if (stalePages.length) {
        return pagesJson(stalePages, {
          source: "d1_stale",
          cached: true,
          stale: true,
          pageCount: stalePages.length,
          graphError: error.message,
          grantedPermissions: [],
          declinedPermissions: [],
          webhookSubscriptions: []
        });
      }
      throw error;
    }

    await upsertConnectedPages(env, session.user?.id, pages);
    const webhookSubscriptions = [];
    if (env.MESSENLEAD_AUTO_SUBSCRIBE_PAGES !== "false") {
      for (const page of pages) {
        webhookSubscriptions.push(await subscribePageToMessengerWebhooks(page, config));
      }
    }
    const permissions = pages.length ? [] : await getGrantedPermissions(session.accessToken, config);
    return pagesJson(pages, {
      source: "graph",
      cached: false,
      refreshed: true,
        pageCount: pages.length,
        grantedPermissions: permissions
          .filter((permission) => permission.status === "granted")
          .map((permission) => permission.permission),
        declinedPermissions: permissions
          .filter((permission) => permission.status !== "granted")
          .map((permission) => permission.permission),
        webhookSubscriptions
    });
  } catch (error) {
    return json({ error: error.message, details: error.payload || null }, error.status || 500);
  }
}

function pagesJson(pages, debug = {}) {
  return json({
    debug,
    pages: pages.map((page) => ({
      id: page.id,
      name: page.name,
      category: page.category,
      picture: page.picture?.data?.url || "",
      tasks: page.tasks || []
    }))
  });
}

function isForceRefresh(value) {
  return ["1", "true", "yes", "force"].includes(String(value || "").trim().toLowerCase());
}

function pagesCacheTtlMs(env) {
  const seconds = Number(env.META_PAGES_CACHE_TTL_SECONDS);
  if (Number.isFinite(seconds) && seconds >= 0) return seconds * 1000;

  const hours = Number(env.META_PAGES_CACHE_TTL_HOURS);
  if (Number.isFinite(hours) && hours >= 0) return hours * 60 * 60 * 1000;

  return DEFAULT_PAGES_CACHE_TTL_MS;
}
