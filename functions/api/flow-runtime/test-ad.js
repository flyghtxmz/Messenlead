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
  const flowId = String(body.flowId || "").trim();
  const requestedPsid = String(body.psid || "").trim();
  const psid = requestedPsid || `test_ad_${Date.now()}`;
  const text = String(body.text || "Hola").trim() || "Hola";
  const channel = body.channel === "standby" ? "standby" : "messaging";
  const adId = String(body.adId || `ad_test_${Date.now()}`).trim();
  const referralLocation = normalizeReferralLocation(body.referralLocation);
  const testTag = String(body.testTag || "").replace(/\s+/g, " ").trim();
  const testTagMode = body.testTagMode === "missing" ? "missing" : "has";
  if (!pageId) return json({ error: "pageId is required" }, 400);
  if (!flowId) return json({ error: "flowId is required" }, 400);

  const timestamp = Date.now();
  const referral = {
    source: "ADS",
    type: "OPEN_THREAD",
    ref: "messenlead_ad_test",
    ad_id: adId,
    ads_context_data: {
      ad_id: adId,
      ad_title: "Messenlead dashboard ad test"
    }
  };
  const event = {
    sender: { id: psid },
    recipient: { id: pageId },
    timestamp
  };
  if (referralLocation === "postback.referral") {
    event.postback = {
      mid: `mid.test_ad.${timestamp}`,
      title: "Receber conteudo",
      payload: "MESSENLEAD_AD_ENTRY",
      referral
    };
  } else if (referralLocation === "event.referral") {
    event.referral = referral;
  } else {
    event.message = {
      mid: `mid.test_ad.${timestamp}`,
      text: "Receber conteudo",
      quick_reply: {
        payload: "MESSENLEAD_AD_ENTRY"
      },
      referral
    };
  }

  await handleMessengerEvent(event, env, pageId, {
    channel,
    referralLocation,
    adId,
    simulated: true,
    dryRun: true,
    forceLogs: true,
    testFlowId: flowId,
    testContactPsid: requestedPsid,
    testTag,
    testTagMode
  });
  return json({
    ok: true,
    pageId,
    flowId,
    psid,
    channel,
    text,
    dryRun: true,
    storedContact: Boolean(requestedPsid),
    testTag,
    testTagMode,
    message: "Evento de anuncio simulado em modo dry-run. Veja o painel visual e os logs para confirmar event_received e flow_started."
  });
}

function normalizeReferralLocation(value) {
  const location = String(value || "").trim();
  return ["message.referral", "postback.referral", "event.referral"].includes(location) ? location : "message.referral";
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
