"use client";
import { useActionState } from "react";
import { linkAccount, type LinkState } from "./actions";
import s from "../../components/portal/portal.module.css";

export default function LinkForm() {
  const [state, action, pending] = useActionState<LinkState, FormData>(linkAccount, {});
  return (
    <form action={action}>
      {state.error && <div className={s.err} role="alert">{state.error}</div>}
      <div className={s.field}>
        <label htmlFor="regNo">Roll number</label>
        <input id="regNo" name="regNo" placeholder="JK-B1-0007" autoCapitalize="characters" autoComplete="off" required />
        <div className={s.hint}>The registration number you got for Batch I.</div>
      </div>
      <div className={s.field}>
        <label htmlFor="code">Access code</label>
        <input id="code" name="code" inputMode="numeric" maxLength={6} placeholder="6 digits" autoComplete="one-time-code" required />
        <div className={s.hint}>Sent to you by JK sir on WhatsApp. Works only once.</div>
      </div>
      <button className={s.submit} disabled={pending}>{pending ? "Linking…" : "Link my account"}</button>
    </form>
  );
}
