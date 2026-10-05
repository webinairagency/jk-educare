"use client";
import { useActionState, useMemo, useState } from "react";
import { generateCodes, resetStudent, type CodesState, type ResetState } from "../../app/admin/actions";
import type { AdminStudent } from "../../lib/admin";
import a from "./admin.module.css";

/** Student list with search, filters and a "reset Google link / new code" action. */
export default function StudentsTable({ students }: { students: AdminStudent[] }) {
  const [q, setQ] = useState("");
  const [group, setGroup] = useState("");
  const [link, setLink] = useState<"" | "linked" | "pending">("");
  const [state, run, pending] = useActionState(resetStudent, null as ResetState);
  const [codes, makeCodes, codesPending] = useActionState(generateCodes, null as CodesState);
  const waiting = students.filter(s => !s.linked).length;
  const noCode = students.filter(s => !s.linked && s.hasCode === false && s.status === "Shortlisted").length;

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
                  <form action={run} onSubmit={e => { if (!window.confirm(x.linked ? `Unlink ${x.name}'s Google account and make a new code?` : `Make a new access code for ${x.name}?`)) e.preventDefault(); }}>
                    <input type="hidden" name="regNo" value={x.regNo} />
                    <button className={a.mini} type="submit" disabled={pending}>{x.linked ? "Reset Google link" : "New code"}</button>
                  </form>
                </td>
              </tr>
            ))}
            {shown.length === 0 && <tr><td colSpan={11}>No students match.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
