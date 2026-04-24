import { getSession, json } from "../../_lib/meta.js";

export async function onRequestGet({ request, env }) {
  const session = await getSession(request, env);

  if (!session?.accessToken) {
    return json({ error: "Not authenticated" }, 401);
  }

  return json({ user: session.user || null });
}
