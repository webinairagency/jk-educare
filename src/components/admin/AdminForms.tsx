"use client";
import { useActionState, useEffect, useRef } from "react";
import { addClass, addMaterial, addNotice, type FormState } from "../../app/admin/actions";
import { ForSelect, SubjectOptions } from "./fields";
import a from "./admin.module.css";

function Msg({ s }: { s: FormState }) {
  return s ? <p className={s.ok ? a.ok : a.bad} role="status">{s.msg}</p> : null;
}

function useForm(action: (p: FormState, f: FormData) => Promise<FormState>) {
  const [state, run, pending] = useActionState(action, null as FormState);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => { if (state?.ok) ref.current?.reset(); }, [state]);
  return { state, run, pending, ref };
}

export default function AdminForms() {
  const c = useForm(addClass), m = useForm(addMaterial), n = useForm(addNotice);
  return (
    <div className={a.forms}>
      <details className={a.card} open>
        <summary>+ Add class</summary>
        <form action={c.run} ref={c.ref} className={a.form}>
          <label>Subject<select name="subject" required defaultValue="">{<option value="" disabled>Choose…</option>}<SubjectOptions /></select></label>
          <label>Topic<input name="topic" required maxLength={120} /></label>
          <label>Teacher<input name="teacher" defaultValue="JK Sir" maxLength={60} /></label>
          <label>Start (IST)<input name="start" type="datetime-local" required /></label>
          <label>Duration (min)<input name="duration" type="number" min={10} max={300} defaultValue={60} /></label>
          <ForSelect />
          <label className={a.wide}>Live link (YouTube, Zoom or Google Meet)<input name="live" type="url" required placeholder="https://youtube.com/live/...  or  https://zoom.us/j/...  or  https://meet.google.com/..." /></label>
          <label className={a.wide}>Recording link (optional). YouTube classes record themselves; Zoom / Meet have no recording unless you paste one<input name="recording" type="url" /></label>
          <label className={a.wide}>Notes link (optional)<input name="notes" type="url" /></label>
          <label className={a.wide}>Caption (optional)<input name="caption" maxLength={200} /></label>
          <button disabled={c.pending}>{c.pending ? "Saving…" : "Add class"}</button>
          <Msg s={c.state} />
        </form>
      </details>

      <details className={a.card}>
        <summary>+ Add study material</summary>
        <form action={m.run} ref={m.ref} className={a.form}>
          <label className={a.wide}>Title<input name="title" required maxLength={120} /></label>
          <label>Subject<select name="subject" defaultValue="General"><option>General</option><SubjectOptions /></select></label>
          <label>Type<select name="type" defaultValue="notes"><option value="notes">Notes</option><option value="question bank">Question bank</option><option value="answer key">Answer key</option><option value="model exam">Model exam</option></select></label>
          <ForSelect />
          <label className={a.wide}>Link (Google Drive etc.)<input name="link" type="url" required placeholder="https://drive.google.com/..." /></label>
          <button disabled={m.pending}>{m.pending ? "Saving…" : "Add material"}</button>
          <Msg s={m.state} />
        </form>
      </details>

      <details className={a.card}>
        <summary>+ Add notice</summary>
        <form action={n.run} ref={n.ref} className={a.form}>
          <label className={a.wide}>English<textarea name="en" rows={2} maxLength={300} /></label>
          <label className={a.wide}>Tamil<textarea name="ta" rows={2} maxLength={300} /></label>
          <label>Show until (optional)<input name="until" type="date" /></label>
          <ForSelect />
          <label className={a.check}><input name="pinned" type="checkbox" /> Pin to top</label>
          <button disabled={n.pending}>{n.pending ? "Saving…" : "Add notice"}</button>
          <Msg s={n.state} />
        </form>
      </details>
    </div>
  );
}
