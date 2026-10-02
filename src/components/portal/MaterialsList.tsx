"use client";
import { useMemo, useState } from "react";
import type { Material } from "../../lib/content";
import s from "./portal.module.css";

type Labels = { all: string; open: string; empty: string; types: Record<string, string> };

export default function MaterialsList({ items, labels }: { items: Material[]; labels: Labels }) {
  const subjects = useMemo(() => Array.from(new Set(items.map(i => i.subject))).sort(), [items]);
  const types = useMemo(() => Array.from(new Set(items.map(i => i.type))), [items]);
  const [subject, setSubject] = useState("");
  const [type, setType] = useState("");
  const shown = items.filter(i => (!subject || i.subject === subject) && (!type || i.type === type));
  const typeLabel = (x: string) => labels.types[x.toLowerCase()] ?? x;

  const Chips = ({ list, value, set, render }: { list: string[]; value: string; set: (v: string) => void; render: (v: string) => string }) => (
    <div className={s.filters} role="group">
      {["", ...list].map(v => (
        <button key={v || "all"} type="button" className={`${s.filter} ${value === v ? s.filterOn : ""}`} aria-pressed={value === v} onClick={() => set(v)}>
          {v ? render(v) : labels.all}
        </button>
      ))}
    </div>
  );

  return (
    <>
      {subjects.length > 1 && <Chips list={subjects} value={subject} set={setSubject} render={v => v} />}
      {types.length > 1 && <Chips list={types} value={type} set={setType} render={typeLabel} />}
      {shown.length === 0 ? <div className={s.empty}>{labels.empty}</div> : (
        <ul className={s.matList}>
          {shown.map((m, i) => (
            <li key={i} className={s.mat}>
              <span className={s.matIcon} aria-hidden="true">PDF</span>
              <div className={s.matText}>
                <strong>{m.title}</strong>
                <span>{m.subject} · {typeLabel(m.type)}</span>
              </div>
              <a className={`${s.btn} ${s.btnGhost} ${s.matOpen}`} href={m.link} target="_blank" rel="noopener noreferrer">{labels.open}</a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
