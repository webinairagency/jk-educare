"use client";
import { useActionState, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { generateCodes, getStudentContact, resetStudent, type CodesState, type ContactState, type ResetState } from "../../app/admin/actions";
import type { AdminStudent } from "../../lib/admin";
import { linkMessage, waNumber, whatsappUrl, type MsgLang } from "../../lib/messages";
import a from "./admin.module.css";

type Draft = { regNo: string; name: string; code: string; phone: string; parent: string };

/** Student list with search, filters, "reset Google link / new code", and a WhatsApp message with a preview. */
export default function StudentsTable({ students }: { students: AdminStudent[] }) {
  const [q, setQ] = useState("");
  const [group, setGroup] = useState("");
  const [link, setLink] = useState<"" | "linked" | "pending">("");
  const [state, run, pending] = useActionState(resetStudent, null as ResetState);
  const [codes, makeCodes, codesPending] = useActionState(generateCodes, null as CodesState);
  const waiting = students.filter(s => !s.linked).length;
  const noCode = students.filter(s => !s.linked && s.hasCode === false && s.status === "Shortlisted").length;

  // WhatsApp message: fetch the student's details, then show a preview before anything is sent
  const [draft, setDraft] = useState<Draft | null>(null);
  const [lang, setLang] = useState<MsgLang>("both");
  const [to, setTo] = useState<"student" | "parent">("student");
  const [text, setText] = useState("");
  const [loadErr, setLoadErr] = useState("");
  const [loadingReg, setLoadingReg] = useState("");
  const [, startTransition] = useTransition();
  const dlg = useRef<HTMLDialogElement>(null);

  function openMessage(s: AdminStudent) {
    setLoadErr(""); setLoadingReg(s.regNo);
    startTransition(async () => {
      const r: ContactState = await getStudentContact(s.regNo);
      setLoadingReg("");
      if (!r.ok) { setLoadErr(`${s.name}: ${r.error ?? "could not load"}`); return; }
      if (r.linked) { setLoadErr(`${s.name} has already linked a Google account. No message needed.`); return; }
      const d: Draft = { regNo: r.regNo ?? s.regNo, name: r.name ?? s.name, code: r.code ?? "", phone: r.phone ?? "", parent: r.parent ?? "" };
      setDraft(d);
      setTo(waNumber(d.phone) ? "student" : "parent");
      setText(linkMessage({ name: d.name, regNo: d.regNo, code: d.code, lang }));
    });
  }
  useEffect(() => {
    const el = dlg.current;
    if (!el) return;
    if (draft && !el.open) el.showModal();
    if (!draft && el.open) el.close();
  }, [draft]);
  function changeLang(l: MsgLang) {
    setLang(l);
    if (draft) setText(linkMessage({ name: draft.name, regNo: draft.regNo, code: draft.code, lang: l }));   // regenerates the text
  }
  const number = draft ? (to === "student" ? draft.phone : draft.parent) : "";
  const url = whatsappUrl(number, text);
  const tooLong = encodeURIComponent(text).length > 4000;

  const groups = useMemo(() => Array.from(new Set(students.map(s => s.group).filter(Boolean))).sort(), [students]);
  const needle = q.trim().toLowerCase();
  const shown = students.filter(s =>
    (!group || s.group === group) &&
    (!link || (link === "linked" ? s.linked : !s.linked)) &&
    (!needle || `${s.regNo} ${s.name} ${s.school} ${s.place} ${s.district}`.toLowerCase().includes(needle)));

  return (
    <div>
      <div className={a.filters}>
        <input type="search" className={a.search} placeholder="Search name, roll no, school, place" value={q} onChange={e => setQ(e.target.value)} aria-label="Search students" />
        <select value={group} onChange={e => setGroup(e.target.value)} aria-label="Filter by group">
          <option value="">All groups</option>
          {groups.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <select value={link} onChange={e => setLink(e.target.value as "" | "linked" | "pending")} aria-label="Filter by sign-in">
          <option value="">Signed in or not</option>
          <option value="linked">Signed in</option>
          <option value="pending">Not signed in yet</option>
        </select>
      </div>
      <p className={a.count}>{shown.length} of {students.length} students · {waiting} not signed in yet{noCode > 0 ? ` · ${noCode} have no code` : ""}</p>
      {noCode > 0 && (
        <form action={makeCodes} className={a.codeFix}>
          <span>{noCode} student(s) were never given an access code, so they cannot link.</span>
          <button className={a.mini} type="submit" disabled={codesPending}>{codesPending ? "Working…" : "Give them codes"}</button>
        </form>
      )}
      {codes && <p className={codes.ok ? a.ok : a.bad} role="status">{codes.msg}</p>}
      {loadErr && <p className={a.bad} role="alert">{loadErr}</p>}

      {state && (
        <div className={state.ok ? a.codeBox : a.bad} role="status">
          {state.msg}
          {state.code && <><b className={a.codeBig}>{state.code}</b><span>Roll number {state.regNo}. Send this to the student; it works once.</span></>}
        </div>
      )}

      <div className={a.tableWrap}>
        <table className={a.table}>
          <thead><tr><th>Roll no</th><th>Name</th><th>Group</th><th>Languages</th><th>Board</th><th>School</th><th>Place</th><th>District</th><th>Status</th><th>Signed in</th><th></th></tr></thead>
          <tbody>
            {shown.map(x => (
              <tr key={x.regNo}>
                <td>{x.regNo}</td><td>{x.name}</td><td>{x.group}</td><td>{x.languages || "—"}</td><td>{x.board}</td><td>{x.school}</td><td>{x.place}</td><td>{x.district}</td><td>{x.status}</td><td>{x.linked ? "Yes" : x.hasCode === false && x.status === "Shortlisted" ? "No code" : "—"}</td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    {!x.linked && x.status === "Shortlisted" && (
                      <button type="button" className={a.mini} onClick={() => openMessage(x)} disabled={loadingReg === x.regNo}>
                        {loadingReg === x.regNo ? "Loading…" : "Send message"}
                      </button>
                    )}
                    <form action={run} onSubmit={e => { if (!window.confirm(x.linked ? `Unlink ${x.name}'s Google account and make a new code?` : `Make a new access code for ${x.name}?`)) e.preventDefault(); }}>
                      <input type="hidden" name="regNo" value={x.regNo} />
                      <button className={a.mini} type="submit" disabled={pending}>{x.linked ? "Reset Google link" : "New code"}</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {shown.length === 0 && <tr><td colSpan={11}>No students match.</td></tr>}
          </tbody>
        </table>
      </div>

      <dialog ref={dlg} className={a.dlg} onClose={() => setDraft(null)} aria-labelledby="msg-title">
        {draft && (
          <div className={a.dlgBody}>
            <h3 id="msg-title">Preview: message to {draft.name}</h3>
            <p className={a.dlgMeta}>{draft.regNo} · access code {draft.code}. Nothing is sent until you press the green button.</p>
            <div className={a.dlgRow}>
              <label>Language
                <select value={lang} onChange={e => changeLang(e.target.value as MsgLang)}>
                  <option value="both">English + தமிழ்</option>
                  <option value="ta">தமிழ் only</option>
                  <option value="en">English only</option>
                </select>
              </label>
              <label>Send to
                <select value={to} onChange={e => setTo(e.target.value as "student" | "parent")}>
                  <option value="student" disabled={!waNumber(draft.phone)}>Student: {draft.phone || "no number"}</option>
                  <option value="parent" disabled={!waNumber(draft.parent)}>Parent: {draft.parent || "no number"}</option>
                </select>
              </label>
            </div>
            <textarea className={a.dlgText} value={text} onChange={e => setText(e.target.value)} aria-label="Message text (you can edit it)" />
            {tooLong && <p className={a.dlgWarn}>This message is long. If WhatsApp opens empty, use Copy message, or choose one language.</p>}
            {!url && <p className={a.bad}>There is no valid mobile number for this choice.</p>}
            <div className={a.dlgBtns}>
              <button type="button" className={a.dlgGhost} onClick={() => navigator.clipboard?.writeText(text)}>Copy message</button>
              <button type="button" className={a.dlgGhost} onClick={() => setDraft(null)}>Cancel</button>
              <a className={a.dlgSend} href={url || undefined} aria-disabled={!url} target="_blank" rel="noopener noreferrer">Send on WhatsApp</a>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
