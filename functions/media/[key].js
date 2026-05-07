import { getMediaObject } from "../_lib/media.js";

export async function onRequestGet({ params, env }) {
  const key = String(params.key || "").trim();
  const object = await getMediaObject(env, key);
  if (!object) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("Cache-Control", headers.get("Cache-Control") || "public, max-age=31536000, immutable");
  headers.set("Access-Control-Allow-Origin", "*");

  return new Response(object.body, { headers });
}
