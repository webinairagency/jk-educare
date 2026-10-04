import s from "../../components/portal/portal.module.css";

// Shown straight away while a portal page waits for the class sheet, so navigation never looks frozen.
export default function Loading() {
  return (
    <div className={s.skel} role="status" aria-label="Loading">
      <div className={s.skelBar} style={{ width: "55%", height: 32 }} />
      <div className={s.skelBar} style={{ width: "35%" }} />
      <div className={s.skelCard} style={{ height: 170 }} />
      <div className={s.skelCard} />
      <div className={s.skelCard} />
    </div>
  );
}
