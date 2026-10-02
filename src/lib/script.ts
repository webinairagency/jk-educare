// Server-only helper: talks to the Apps Script backend with the shared secret.
export type Student = { regNo: string; name: string; group: string; board: string; gender: string; status: string };

export class ScriptError extends Error {}

export async function callScript<T>(action: string, payload: Record<string, unknown> = {}): Promise<T> {
  const url = process.env.APPS_SCRIPT_URL;
  const secret = process.env.PORTAL_SECRET;
  if (!url || !secret) throw new ScriptError("APPS_SCRIPT_URL or PORTAL_SECRET is not set");
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action, secret, ...payload }),
    cache: "no-store",
  });
  const j = await r.json();
  if (!j.ok) throw new ScriptError(j.error || "Request failed");
  return j as T;
}
