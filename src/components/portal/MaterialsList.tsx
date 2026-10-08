"use client";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import type { Material } from "../../lib/content";
import { normSubject } from "../../lib/groups";
import { subjectColour } from "./Thumb";
import s from "./portal.module.css";

type Labels = {
  all: string; open: string; empty: string; search: string; folders: string; backAll: string; noResults: string;
  clear: string; showFolders: string; soon: string; file: string; files: string; types: Record<string, string>;
};
type Folder = { key: string; name: string; files: Material[] };

// One recognisable icon per subject; languages use their own script.
const ICONS: Record<string, string> = {
  physics: "⚛️", chemistry: "🧪", maths: "📐", biology: "🧬", botany: "🌿", zoology: "🐾", "computer science": "💻", "computer application": "🖥️",
  tamil: "அ", english: "Aa", french: "Fr", hindi: "अ", accountancy: "🧾", commerce: "💼", economics: "📊", history: "🏛️",
  "political science": "⚖️", neet: "🩺", jee: "🚀", general: "📚",
};
const iconFor = (subject: string) => ICONS[normSubject(subject)] ?? "📚";
const tint = (subject: string) => subjectColour(normSubject(subject));

function urlFor(subject: string) {
  const u = new URL(window.location.href);
  if (subject) u.searchParams.set("subject", subject); else u.searchParams.delete("subject");
  return u.pathname + (u.search || "");
}

export default function MaterialsList({ items, folders, labels, initialType = "", initialSubject = "" }: {
  items: Material[]; folders: string[]; labels: Labels; initialType?: string; initialSubject?: string;
}) {
  const typeLabel = (x: string) => labels.types[x.toLowerCase()] ?? x;
  const count = (n: number) => `${n} ${n === 1 ? labels.file : labels.files}`;

  // Folders: the student's subjects in order (those with files first), plus any other subject that has files.
  const list = useMemo<Folder[]>(() => {
    const by = new Map<string, Material[]>();
    for (const m of [...items].sort((a, b) => b.added.localeCompare(a.added))) {
      const k = normSubject(m.subject) || "general";
      by.set(k, [...(by.get(k) ?? []), m]);
    }
    const seen = new Set<string>();
    const out: Folder[] = [];
    for (const name of folders) {
      const key = normSubject(name);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ key, name, files: by.get(key) ?? [] });
    }
    for (const [key, files] of by) if (!seen.has(key)) out.push({ key, name: files[0].subject || "General", files });
    return [...out.filter(f => f.files.length), ...out.filter(f => !f.files.length)];
  }, [items, folders]);

  const types = useMemo(() => Array.from(new Set(items.map(i => i.type))), [items]);
  const [q, setQ] = useState("");
  const [folderKey, setFolderKey] = useState(() => {
    const k = normSubject(initialSubject);
    return list.some(f => f.key === k && f.files.length) ? k : "";
  });
  const [type, setType] = useState(() => types.find(x => x.toLowerCase() === initialType.toLowerCase()) ?? "");

  // The browser's back button returns from a folder to the folder list
  useEffect(() => {
    const onPop = () => {
      const k = normSubject(new URLSearchParams(window.location.search).get("subject") ?? "");
      setFolderKey(list.some(f => f.key === k && f.files.length) ? k : "");
      setType("");
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [list]);

  function open(f: Folder | null) {
    setFolderKey(f?.key ?? "");
    setType("");
    try { window.history.pushState(null, "", urlFor(f?.name ?? "")); } catch { /* history blocked: state still works */ }
  }

  const folder = list.find(f => f.key === folderKey) ?? null;
  const needle = q.trim().toLowerCase();
  const words = needle.split(/\s+/).filter(Boolean);
  const typeOnly = !!type && !folder && !needle;     // arrived from a "Question bank" style link
  const flat = !!needle || typeOnly;

  const pool = flat ? items : folder?.files ?? [];
  const shown = pool.filter(m =>
    (!type || m.type === type) &&
    words.every(w => `${m.title} ${m.subject} ${typeLabel(m.type)} ${m.type}`.toLowerCase().includes(w)));
  const poolTypes = Array.from(new Set(pool.map(m => m.type)));

  const Chips = () => poolTypes.length > 1 ? (
    <div className={s.filters} role="group">
      {["", ...poolTypes].map(v => (
        <button key={v || "all"} type="button" className={`${s.filter} ${type === v ? s.filterOn : ""}`} aria-pressed={type === v} onClick={() => setType(v)}>
          {v ? typeLabel(v) : labels.all}
        </button>
      ))}
    </div>
  ) : null;

  const Rows = ({ showSubject }: { showSubject: boolean }) => (
    <ul className={s.fileList}>
      {shown.map((m, i) => {
        const c = tint(m.subject);
        return (
          <li key={`${m.link}-${i}`}>
            <a className={s.file} href={m.link} target="_blank" rel="noopener noreferrer">
              <span className={s.fileIcon} aria-hidden="true">PDF</span>
              <span className={s.fileText}>
                <strong>{m.title}</strong>
                <span className={s.fileMeta}>
                  {showSubject && <span className={s.subjTag} style={{ background: c[1], color: c[0] }}><span aria-hidden="true">{iconFor(m.subject)}</span>{m.subject}</span>}
                  <span>{typeLabel(m.type)}</span>
                </span>
              </span>
              <span className={s.fileOpen}>{labels.open} ↗</span>
            </a>
          </li>
        );
      })}
    </ul>
  );

  if (list.length === 0) return <div className={s.empty}>{labels.empty}</div>;

  return (
    <>
      <div className={s.mSearch} role="search">
        <span className={s.mSearchIcon} aria-hidden="true">🔍</span>
        <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder={labels.search} aria-label={labels.search}
          autoComplete="off" enterKeyHint="search" />
        {q && <button type="button" className={s.mClear} onClick={() => setQ("")} aria-label={labels.clear}>✕</button>}
      </div>

      {flat ? (
        <>
          {typeOnly && !needle && (
            <p className={s.resultNote}>{typeLabel(type)} · <button type="button" className={s.linkBtn} onClick={() => setType("")}>{labels.showFolders}</button></p>
          )}
          {needle && <p className={s.resultNote} aria-live="polite">{count(shown.length)}</p>}
          {needle && <Chips />}
          {shown.length === 0 ? <div className={s.empty}>{labels.noResults}</div> : <Rows showSubject />}
        </>
      ) : folder ? (
        <>
          <button type="button" className={s.crumb} onClick={() => open(null)}>‹ {labels.backAll}</button>
          <div className={s.folderTitle}>
            <span className={s.folderIcon} style={{ background: tint(folder.name)[1], color: tint(folder.name)[0] }} aria-hidden="true">{iconFor(folder.name)}</span>
            <div><h2>{folder.name}</h2><span>{count(folder.files.length)}</span></div>
          </div>
          <Chips />
          {shown.length === 0 ? <div className={s.empty}>{labels.noResults}</div> : <Rows showSubject={false} />}
        </>
      ) : (
        <>
          <h2 className={s.mHead}>{labels.folders} <small>{list.length}</small></h2>
          <ul className={s.folderGrid}>
            {list.map(f => {
              const c = tint(f.name);
              const style = { "--fc": c[0] } as CSSProperties;
              const body = (
                <>
                  <span className={s.folderIcon} style={{ background: c[1], color: c[0] }} aria-hidden="true">{iconFor(f.name)}</span>
                  <strong>{f.name}</strong>
                  <span className={s.folderCount}>{f.files.length ? count(f.files.length) : labels.soon}</span>
                  {f.files.length > 0 && <span className={s.folderGo} aria-hidden="true">›</span>}
                </>
              );
              return (
                <li key={f.key}>
                  {f.files.length > 0
                    ? <button type="button" className={s.folder} style={style} onClick={() => open(f)}>{body}</button>
                    : <div className={`${s.folder} ${s.folderEmpty}`} style={style}>{body}</div>}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
}
