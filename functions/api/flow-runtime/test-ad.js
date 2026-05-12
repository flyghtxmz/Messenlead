import { getSession, json } from "../../_lib/meta.js";
import { handleMessengerEvent } from "../messenger/webhook.js";

export async function onRequestPost({ request, env }) {
  const auth = await authorizeTestRequest(request, env);
  if (!auth.ok) return auth.response;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const pageId = String(body.pageId || "").trim();
  const requestedPsid = String(body.psid || "").trim();
  const psid = requestedPsid || `test_ad_${Date.now()}`;
  const text = String(body.text || "Hola").trim() || "Hola";
  const channel = body.channel === "standby" ? "standby" : "messaging";
  if (!pageId) return json({ error: "pageId is required" }, 400);

  const timestamp = Date.now();
  const event = {
    sender: { id: psid },
    recipient: { id: pageId },
    timestamp,
    message: {
      mid: `mid.test_ad.${timestamp}`,
      text,
      referral: {
        source: "ADS",
        type: "OPEN_THREAD",
        ref: "messenlead_ad_test",
        ad_id: `ad_test_${timestamp}`,
        ads_context_data: {
          ad_id: `ad_test_${timestamp}`,
          ad_title: "Messenlead dashboard ad test"
        }
      }
    }
  };

  await handleMessengerEvent(event, env, pageId, {
    channel,
    simulated: true,
    dryRun: true,
    forceLogs: true,
    testContactPsid: requestedPsid
  });
  return json({
    ok: true,
    pageId,
    psid,
    channel,
    text,
    dryRun: true,
    storedContact: Boolean(requestedPsid),
    message: "Evento de anuncio simulado em modo dry-run. Veja o painel visual e os logs para confirmar event_received e flow_started."
  });
}

async function authorizeTestRequest(request, env) {
  const authorization = request.headers.get("authorization") || "";
  if (env.MESSENLEAD_OPERATOR_TOKEN && authorization === `Bearer ${env.MESSENLEAD_OPERATOR_TOKEN}`) {
    return { ok: true };
  }

  const session = await getSession(request, env);
  if (session?.accessToken) return { ok: true };

  return {
    ok: false,
    response: json({ error: "Login required to test flow runtime" }, 401)
  };
}
