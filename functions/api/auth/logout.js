import { clearSessionHeader, json } from "../../_lib/meta.js";

export function onRequestPost() {
  return json(
    { ok: true },
    200,
    {
      "Set-Cookie": clearSessionHeader()
    }
  );
}
