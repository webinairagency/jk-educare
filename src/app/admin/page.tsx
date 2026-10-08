import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { signIn, signOut } from "../../auth";
import { adminSession, sheetLink, type AdminData } from "../../lib/admin";
import { callScript } from "../../lib/script";
import { audience, fmtDay, fmtTime, JOIN_EARLY_MIN } from "../../lib/classes-shared";
import { GROUPS } from "../../lib/groups";
import { PREVIEW_ALL } from "../../lib/portal-student";
import AdminForms from "../../components/admin/AdminForms";
import { EditClass, EditMaterial, EditNotice } from "../../components/admin/EditItems";
import StudentsTable from "../../components/admin/StudentsTable";
import { openPreview, setHidden } from "./actions";
import { display, body } from "../../components/portal/fonts";
import s from "../../components/portal/portal.module.css";
import a from "../../components/admin/admin.module.css";

export const metadata: Metadata = { title: "Admin | JK Edu-Care Services", robots: { index: false } };
export const dynamic = "force-dynamic";

const TZ = "Asia/Kolkata";
const dayKey = (ms: number) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(ms);

/** ISO time -> "YYYY-MM-DDTHH:mm" in IST, the format a datetime-local box wants. */
function localInput(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(d);
  const g = (t: string) => p.find(x => x.type === t)?.value ?? "";
  return `${g("year")}-${g("month")}-${g("day")}T${g("hour")}:${g("minute")}`;
}
const dateOnly = (iso: string) => (iso && !isNaN(new Date(iso).getTime()) ? dayKey(new Date(iso).getTime()) : "");

function Shell({ children, email }: { children: React.ReactNode; email?: string }) {
  return (
    <div className={`${s.shell} ${display.variable} ${body.variable}`}>
      <header className={s.bar}>
        <div className={s.barIn}>
          <Link href="/admin" className={s.logo}><Image src="/jk-logo-96.png" alt="JK Edu-Care Services" width={40} height={40} priority /> Admin</Link>
          {email && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Link href="/portal" className={s.signout}>Student view</Link>
              <form action={async () => { "use server"; await signOut({ redirectTo: "/admin" }); }}><button className={s.signout} type="submit">Sign out</button></form>
            </div>
          )}
        </div>
      </header>
      <main className={s.main}>{children}</main>
    </div>
  );
}

function Toggle({ tab, row, hidden }: { tab: string; row: number; hidden: boolean }) {
  return (
    <form action={setHidden}>
      <input type="hidden" name="tab" value={tab} /><input type="hidden" name="row" value={row} /><input type="hidden" name="hidden" value={hidden ? "0" : "1"} />
      <button className={a.mini} type="submit">{hidden ? "Show" : "Hide"}</button>
    </form>
  );
}

function SectionHead({ id, title, sheet }: { id: string; title: string; sheet?: string }) {
  return (
    <div className={a.secHead}>
      <h2 className={a.h2} id={id}>{title}</h2>
      {sheet && <a className={a.sheetLink} href={sheet} target="_blank" rel="noopener noreferrer">Open in Google Sheet ↗</a>}
    </div>
  );
}

export default async function AdminPage() {
  const { session, ok } = await adminSession();
  const email = session?.user?.email ?? undefined;

  if (!session?.user) {
    return (
      <Shell>
        <div className={s.gateCard} style={{ maxWidth: 420, margin: "24px auto" }}>
          <h1 className={s.hello}>Admin sign in</h1>
          <p className={s.sub}>For JK sir and approved helpers.</p>
          <form action={async () => { "use server"; await signIn("google", { redirectTo: "/admin" }); }}>
            <button className={s.google} type="submit">Sign in with Google</button>
          </form>
        </div>
      </Shell>
    );
  }
  if (!ok) {
    return (
      <Shell email={email}>
        <div className={s.empty}>This Google account ({email}) is not an admin. Ask JK sir to add it to ADMIN_EMAILS.</div>
      </Shell>
    );
  }

  let data: AdminData | null = null;
  let err = "";
  try { data = await callScript<AdminData & { ok: boolean }>("adminData"); }
  catch (e) { err = e instanceof Error ? e.message : "Could not load"; }

  if (!data) {
    return (
      <Shell email={email}>
        <div className={s.err}>Could not load admin data: {err}. If this says &quot;Unknown action&quot;, paste the new Code.gs into Apps Script and deploy a new version.</div>
      </Shell>
    );
  }

  const now = Date.now();
  const classes = data.classes.map(c => ({ ...c, ms: new Date(c.start).getTime() })).sort((x, y) => y.ms - x.ms);
  const visible = classes.filter(c => !c.hidden);
  const end = (c: { ms: number; duration: number }) => c.ms + c.duration * 60_000;
  const live = visible.filter(c => now >= c.ms - JOIN_EARLY_MIN * 60_000 && now <= end(c));
  const today = visible.filter(c => dayKey(c.ms) === dayKey(now));
  const upcoming = visible.filter(c => now < c.ms - JOIN_EARLY_MIN * 60_000);
  const shortlisted = data.students.filter(x => x.status === "Shortlisted");
  const linked = shortlisted.filter(x => x.linked).length;
  const byGroup = Object.entries(data.students.reduce<Record<string, number>>((m, x) => { const k = x.group || "—"; m[k] = (m[k] ?? 0) + 1; return m; }, {})).sort((x, y) => y[1] - x[1]);
  const sheetHome = sheetLink(data.sheet);
  const tab = (k: "students" | "classes" | "materials" | "notices") => sheetLink(data.sheet, k);

  return (
    <Shell email={email}>
      <div className={a.wrap}>
        <h1 className={s.hello} style={{ margin: 0 }}>Manage JK Edu-Care</h1>

        <section className={a.tools} aria-label="Quick tools">
          <form action={openPreview} className={a.preview}>
            <label>Preview the student portal as
              <select name="group" defaultValue={PREVIEW_ALL}>
                {[PREVIEW_ALL, ...GROUPS].map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </label>
            <button type="submit">Open student view →</button>
          </form>
          {sheetHome
            ? <a className={a.sheetBtn} href={sheetHome} target="_blank" rel="noopener noreferrer">Open Google Sheet ↗</a>
            : <span className={a.hint}>The Google Sheet link shows here once the new Apps Script is deployed.</span>}
        </section>
        <p className={a.note}>Student view needs no roll number or linking. Nothing you do there is recorded (no attendance). Use the yellow &quot;Admin portal&quot; button at the bottom to come back.</p>

        <nav className={a.jump} aria-label="Sections">
          <a href="#overview">Overview</a><a href="#add">Add new</a><a href="#classes">Classes</a>
          <a href="#materials">Materials</a><a href="#notices">Notices</a><a href="#students">Students</a>
        </nav>

        <section aria-labelledby="overview">
          <SectionHead id="overview" title="Overview" />
          <div className={a.stats}>
            <div className={a.stat}><b>{shortlisted.length}</b><span>Students in batch ({linked} signed in)</span></div>
            <div className={`${a.stat} ${live.length ? a.live : ""}`}><b>{live.length ? "LIVE" : "—"}</b><span>{live.length ? `${live[0].subject}: ${live[0].topic}` : "No class live now"}</span></div>
            <div className={a.stat}><b>{today.length}</b><span>Classes today</span></div>
            <div className={a.stat}><b>{upcoming.length}</b><span>Upcoming classes</span></div>
          </div>
          {byGroup.length > 0 && (
            <ul className={a.chips} aria-label="Students by group">
              {byGroup.map(([g, n]) => <li key={g}>{g} <b>{n}</b></li>)}
            </ul>
          )}
        </section>

        <section aria-labelledby="add">
          <SectionHead id="add" title="Add new" />
          <p className={a.note} style={{ margin: "0 0 10px" }}>Pick the subject and students see it automatically: each group only gets the subjects it studies (NEET and JEE go to everyone). Use &quot;Show to&quot; only to limit something to one group.</p>
          <AdminForms />
        </section>

        <section aria-labelledby="classes">
          <SectionHead id="classes" title="Classes" sheet={tab("classes")} />
          {classes.length === 0 ? <div className={s.empty}>No classes yet.</div> : (
            <ul className={a.list}>
              {classes.slice(0, 30).map(c => {
                const isLive = live.some(l => l.id === c.id);
                return (
                  <li key={c.id} className={`${a.item} ${c.hidden ? a.rowOff : ""}`}>
                    <div className={a.row}>
                      <div className={a.rowText}>
                        <strong>{c.subject}: {c.topic}</strong>
                        <span>{fmtDay(c.ms)}, {fmtTime(c.ms)} · {c.teacher}{c.hidden ? " · hidden" : ""}</span>
                        <span>👥 {audience(c)}</span>
                      </div>
                      {isLive && <span className={`${a.tag} ${a.tagLive}`}>LIVE</span>}
                      <Toggle tab="classes" row={c.row} hidden={c.hidden} />
                    </div>
                    <EditClass c={c} startLocal={localInput(c.start)} />
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section aria-labelledby="materials">
          <SectionHead id="materials" title="Study materials" sheet={tab("materials")} />
          {data.materials.length === 0 ? <div className={s.empty}>No materials yet.</div> : (
            <ul className={a.list}>
              {[...data.materials].reverse().slice(0, 30).map(m => (
                <li key={m.row} className={`${a.item} ${m.hidden ? a.rowOff : ""}`}>
                  <div className={a.row}>
                    <div className={a.rowText}>
                      <strong>{m.title}</strong>
                      <span>{m.subject}{m.hidden ? " · hidden" : ""}</span>
                      <span>👥 {audience(m)}</span>
                    </div>
                    <span className={a.tag}>{m.type}</span>
                    <Toggle tab="materials" row={m.row} hidden={m.hidden} />
                  </div>
                  <EditMaterial m={m} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="notices">
          <SectionHead id="notices" title="Notices" sheet={tab("notices")} />
          {data.notices.length === 0 ? <div className={s.empty}>No notices yet.</div> : (
            <ul className={a.list}>
              {[...data.notices].reverse().slice(0, 20).map(n => (
                <li key={n.row} className={`${a.item} ${n.hidden ? a.rowOff : ""}`}>
                  <div className={a.row}>
                    <div className={a.rowText}>
                      <strong>{n.pinned ? "📌 " : ""}{n.en || n.ta}</strong>
                      <span>{n.until ? `Until ${fmtDay(new Date(n.until).getTime())}` : "No end date"}{n.hidden ? " · hidden" : ""}</span>
                    </div>
                    <Toggle tab="notices" row={n.row} hidden={n.hidden} />
                  </div>
                  <EditNotice n={n} untilDate={dateOnly(n.until)} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="students">
          <SectionHead id="students" title={`Students (${data.students.length})`} sheet={tab("students")} />
          <StudentsTable students={data.students} />
        </section>
        <p className={a.hint}>Everything here is saved to the Google Sheet, and you can still edit the sheet directly. Hiding a row removes it from the student portal without deleting it.</p>
      </div>
    </Shell>
  );
}
