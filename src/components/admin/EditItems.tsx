"use client";
import { useActionState } from "react";
import { updateClass, updateMaterial, updateNotice, type FormState } from "../../app/admin/actions";
import type { AdminClass, AdminMaterial, AdminNotice } from "../../lib/admin";
import { ForSelect, SubjectOptions } from "./fields";
import a from "./admin.module.css";

function Msg({ s }: { s: FormState }) {
  return s ? <p className={s.ok ? a.ok : a.bad} role="status">{s.msg}</p> : null;
}

/** Edit an existing class in place; the same fields as "Add class". */
export function EditClass({ c, startLocal }: { c: AdminClass; startLocal: string }) {
  const [state, run, pending] = useActionState(updateClass, null as FormState);
  return (
    <details className={a.edit}>
      <summary>Edit</summary>
      <form action={run} className={a.form}>
        <input type="hidden" name="row" value={c.row} />
        <label>Subject<select name="subject" required defaultValue={c.subject}><SubjectOptions current={c.subject} /></select></label>
        <label>Topic<input name="topic" required maxLength={120} defaultValue={c.topic} /></label>
        <label>Teacher<input name="teacher" maxLength={60} defaultValue={c.teacher} /></label>
        <label>Start (IST)<input name="start" type="datetime-local" required defaultValue={startLocal} /></label>
        <label>Duration (min)<input name="duration" type="number" min={10} max={300} defaultValue={c.duration} /></label>
        <ForSelect current={c.for} />
        <label className={a.wide}>Live link (YouTube, Zoom or Google Meet)<input name="live" type="url" required defaultValue={c.live} /></label>
        <label className={a.wide}>Recording link (optional)<input name="recording" type="url" defaultValue={c.recording} /></label>
        <label className={a.wide}>Notes link (optional)<input name="notes" type="url" defaultValue={c.notes} /></label>
        <label className={a.wide}>Caption (optional)<input name="caption" maxLength={200} defaultValue={c.caption} /></label>
        <button disabled={pending}>{pending ? "Saving…" : "Save changes"}</button>
        <Msg s={state} />
      </form>
    </details>
  );
}

export function EditMaterial({ m }: { m: AdminMaterial }) {
  const [state, run, pending] = useActionState(updateMaterial, null as FormState);
  const type = m.type.trim().toLowerCase();
  return (
    <details className={a.edit}>
      <summary>Edit</summary>
      <form action={run} className={a.form}>
        <input type="hidden" name="row" value={m.row} />
        <label className={a.wide}>Title<input name="title" required maxLength={120} defaultValue={m.title} /></label>
        <label>Subject<select name="subject" defaultValue={m.subject || "General"}><option>General</option><SubjectOptions current={m.subject} /></select></label>
        <label>Type
          <select name="type" defaultValue={type}>
            <option value="notes">Notes</option><option value="question bank">Question bank</option>
            <option value="answer key">Answer key</option><option value="model exam">Model exam</option>
          </select>
        </label>
        <ForSelect current={m.for} />
        <label className={a.wide}>Link<input name="link" type="url" required defaultValue={m.link} /></label>
        <button disabled={pending}>{pending ? "Saving…" : "Save changes"}</button>
        <Msg s={state} />
      </form>
    </details>
  );
}

export function EditNotice({ n, untilDate }: { n: AdminNotice; untilDate: string }) {
  const [state, run, pending] = useActionState(updateNotice, null as FormState);
  return (
    <details className={a.edit}>
      <summary>Edit</summary>
      <form action={run} className={a.form}>
        <input type="hidden" name="row" value={n.row} />
        <label className={a.wide}>English<textarea name="en" rows={2} maxLength={300} defaultValue={n.en} /></label>
        <label className={a.wide}>Tamil<textarea name="ta" rows={2} maxLength={300} defaultValue={n.ta} /></label>
        <label>Show until (optional)<input name="until" type="date" defaultValue={untilDate} /></label>
        <ForSelect current={n.for || "All"} />
        <label className={a.check}><input name="pinned" type="checkbox" defaultChecked={n.pinned} /> Pin to top</label>
        <button disabled={pending}>{pending ? "Saving…" : "Save changes"}</button>
        <Msg s={state} />
      </form>
    </details>
  );
}
