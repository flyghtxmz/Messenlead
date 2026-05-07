import { deleteMediaAsset, listMediaAssets, uploadMediaAsset } from "../_lib/media.js";
import { getSession, json } from "../_lib/meta.js";

export async function onRequestGet({ request, env }) {
  const auth = await authorizeMediaRequest(request, env);
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const pageId = url.searchParams.get("pageId");
  const kind = url.searchParams.get("kind");
  const limit = url.searchParams.get("limit");

  try {
    return json({
      pageId,
      assets: await listMediaAssets(env, pageId, { kind, limit }),
      hasR2: Boolean(r2BucketConfigured(env))
    });
  } catch (error) {
    return json({ error: error.message || "Could not list media assets", assets: [] }, 500);
  }
}

function r2BucketConfigured(env) {
  return [env.MEDIA_BUCKET, env.MESSENLEAD_MEDIA_BUCKET, env.R2_BUCKET].some((bucket) => {
    return bucket && typeof bucket.get === "function" && typeof bucket.put === "function";
  });
}

export async function onRequestPost({ request, env }) {
  const auth = await authorizeMediaRequest(request, env);
  if (!auth.ok) return auth.response;

  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ error: "Invalid form data" }, 400);
  }

  try {
    const asset = await uploadMediaAsset(env, request, {
      pageId: form.get("pageId"),
      kind: form.get("kind"),
      file: form.get("file")
    });
    return json({ ok: true, asset });
  } catch (error) {
    return json({ error: error.message || "Could not upload media asset" }, 400);
  }
}

export async function onRequestDelete({ request, env }) {
  const auth = await authorizeMediaRequest(request, env);
  if (!auth.ok) return auth.response;

  const url = new URL(request.url);
  const pageId = url.searchParams.get("pageId");
  const id = url.searchParams.get("id");
  if (!pageId || !id) return json({ error: "pageId and id are required" }, 400);

  try {
    const deleted = await deleteMediaAsset(env, pageId, id);
    return json({ ok: deleted });
  } catch (error) {
    return json({ error: error.message || "Could not delete media asset" }, 500);
  }
}

async function authorizeMediaRequest(request, env) {
  const authorization = request.headers.get("authorization") || "";
  if (env.MESSENLEAD_OPERATOR_TOKEN && authorization === `Bearer ${env.MESSENLEAD_OPERATOR_TOKEN}`) {
    return { ok: true };
  }

  const session = await getSession(request, env);
  if (session?.accessToken) return { ok: true };

  return {
    ok: false,
    response: json({ error: "Login required to manage media assets" }, 401)
  };
}
