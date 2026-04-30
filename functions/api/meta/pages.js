import { getGrantedPermissions, getManagedPages, getMetaConfig, getSession, json, subscribePageToMessengerWebhooks } from "../../_lib/meta.js";
import { upsertConnectedPages } from "../../_lib/pages.js";

export async function onRequestGet({ request, env }) {
  const session = await getSession(request, env);

  if (!session?.accessToken) {
    return json({ error: "Not authenticated" }, 401);
  }

  try {
    const config = getMetaConfig(request, env);
    const pages = await getManagedPages(session.accessToken, config);
    await upsertConnectedPages(env, session.user?.id, pages);
    const webhookSubscriptions = [];
    if (env.MESSENLEAD_AUTO_SUBSCRIBE_PAGES !== "false") {
      for (const page of pages) {
        webhookSubscriptions.push(await subscribePageToMessengerWebhooks(page, config));
      }
    }
    const permissions = pages.length ? [] : await getGrantedPermissions(session.accessToken, config);
    return json({
      debug: {
        pageCount: pages.length,
        grantedPermissions: permissions
          .filter((permission) => permission.status === "granted")
          .map((permission) => permission.permission),
        declinedPermissions: permissions
          .filter((permission) => permission.status !== "granted")
          .map((permission) => permission.permission),
        webhookSubscriptions
      },
      pages: pages.map((page) => ({
        id: page.id,
        name: page.name,
        category: page.category,
        picture: page.picture?.data?.url || "",
        tasks: page.tasks || []
      }))
    });
  } catch (error) {
    return json({ error: error.message, details: error.payload || null }, error.status || 500);
  }
}
