"use client";
import { useActionState, useEffect, useState } from "react";
import { linkAccount, type LinkState } from "./actions";
import s from "../../components/portal/portal.module.css";

/** Saved on this phone by the registration success screen. Cleared by the dashboard after linking. */
export const PENDING_KEY = "jk_pending_link";

export default function LinkForm() {
  const [state, action, pending] = useActionState<LinkState, FormData>(linkAccount, {});
  const [regNo, setRegNo] = useState("");
  const [code, setCode] = useState("");
  const [prefilled, setPrefilled] = useState(false);
  const [canPaste, setCanPaste] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(PENDING_KEY) || "null");
      if (saved?.regNo && saved?.code) { setRegNo(saved.regNo); setCode(saved.code); setPrefilled(true); }
    } catch { /* storage blocked: student types it */ }
    setCanPaste(!!navigator.clipboard?.readText);
  }, []);

  async function paste() {
    try {
      const text = await navigator.clipboard.readText();
      const digits = text.match(/\b\d{6}\b/)?.[0];
      const roll = text.match(/JK-B\d+-\d{4}/i)?.[0];
      if (digits) setCode(digits);
      if (roll) setRegNo(roll.toUpperCase());
    } catch { /* permission denied: student types it */ }
  }

  return (
    <form action={action}>
      {state.error && <div className={s.err} role="alert">{state.error}</div>}
      {prefilled && !state.error && (
        <div className={s.notice} style={{ marginTop: 0, marginBottom: 14 }}>
          ✓ Filled in from your registration on this phone. Just tap <b>Link my account</b>.
        </div>
      )}
      <div className={s.field}>
        <label htmlFor="regNo">Roll number</label>
        <input id="regNo" name="regNo" placeholder="JK-B1-0007" autoCapitalize="characters" autoComplete="off" required
          value={regNo} onChange={e => setRegNo(e.target.value.toUpperCase())} />
        <div className={s.hint}>The registration number you got for Batch I.</div>
      </div>
      <div className={s.field}>
        <label htmlFor="code">Access code</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input id="code" name="code" inputMode="numeric" maxLength={6} placeholder="6 digits" autoComplete="one-time-code" required
            value={code} onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} style={{ flex: 1 }} />
          {canPaste && (
            <button type="button" onClick={paste} className={`${s.btn} ${s.btnGhost}`} style={{ marginTop: 0 }}>Paste</button>
          )}
        </div>
        <div className={s.hint}>Shown after you registered. Works only once.</div>
      </div>
      <button className={s.submit} disabled={pending}>{pending ? "Linking…" : "Link my account"}</button>
    </form>
  );
}
