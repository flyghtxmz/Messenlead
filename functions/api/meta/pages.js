import { getManagedPages, getMetaConfig, getSession, json } from "../../_lib/meta.js";
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
    return json({
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
