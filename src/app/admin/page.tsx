import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { signIn, signOut } from "../../auth";
import { adminSession, type AdminData } from "../../lib/admin";
import { callScript } from "../../lib/script";
import { fmtDay, fmtTime, JOIN_EARLY_MIN } from "../../lib/classes-shared";
import AdminForms from "../../components/admin/AdminForms";
import { setHidden } from "./actions";
import { display, body } from "../../components/portal/fonts";
import s from "../../components/portal/portal.module.css";
import a from "../../components/admin/admin.module.css";

export const metadata: Metadata = { title: "Admin | JK Edu-Care Services", robots: { index: false } };
export const dynamic = "force-dynamic";

const dayKey = (ms: number) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(ms);

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
  const subjects = Array.from(new Set([...data.classes.map(c => c.subject), ...data.materials.map(m => m.subject)].filter(Boolean))).sort();

  return (
    <Shell email={email}>
      <div className={a.wrap}>
        <h1 className={s.hello} style={{ margin: 0 }}>Manage JK Edu-Care</h1>

        <div className={a.stats}>
          <div className={a.stat}><b>{shortlisted.length}</b><span>Students in batch ({linked} signed in)</span></div>
          <div className={`${a.stat} ${live.length ? a.live : ""}`}><b>{live.length ? "LIVE" : "—"}</b><span>{live.length ? `${live[0].subject}: ${live[0].topic}` : "No class live now"}</span></div>
          <div className={a.stat}><b>{today.length}</b><span>Classes today</span></div>
          <div className={a.stat}><b>{upcoming.length}</b><span>Upcoming classes</span></div>
        </div>

        <section>
          <h2 className={a.h2}>Add new</h2>
          <AdminForms subjects={subjects} />
        </section>

        <section>
          <h2 className={a.h2}>Classes</h2>
          {classes.length === 0 ? <div className={s.empty}>No classes yet.</div> : (
            <ul className={a.list}>
              {classes.slice(0, 30).map(c => {
                const isLive = live.some(l => l.id === c.id);
                return (
                  <li key={c.id} className={`${a.row} ${c.hidden ? a.rowOff : ""}`}>
                    <div className={a.rowText}>
                      <strong>{c.subject}: {c.topic}</strong>
                      <span>{fmtDay(c.ms)}, {fmtTime(c.ms)} · {c.teacher} · For {c.for || "All"}{c.hidden ? " · hidden" : ""}</span>
                    </div>
                    {isLive && <span className={`${a.tag} ${a.tagLive}`}>LIVE</span>}
                    <Toggle tab="classes" row={c.row} hidden={c.hidden} />
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section>
          <h2 className={a.h2}>Study materials</h2>
          {data.materials.length === 0 ? <div className={s.empty}>No materials yet.</div> : (
            <ul className={a.list}>
              {[...data.materials].reverse().slice(0, 30).map(m => (
                <li key={m.row} className={`${a.row} ${m.hidden ? a.rowOff : ""}`}>
                  <div className={a.rowText}>
                    <strong>{m.title}</strong>
                    <span>{m.subject} · For {m.for || "All"}{m.hidden ? " · hidden" : ""}</span>
                  </div>
                  <span className={a.tag}>{m.type}</span>
                  <Toggle tab="materials" row={m.row} hidden={m.hidden} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className={a.h2}>Notices</h2>
          {data.notices.length === 0 ? <div className={s.empty}>No notices yet.</div> : (
            <ul className={a.list}>
              {[...data.notices].reverse().slice(0, 20).map(n => (
                <li key={n.row} className={`${a.row} ${n.hidden ? a.rowOff : ""}`}>
                  <div className={a.rowText}>
                    <strong>{n.pinned ? "📌 " : ""}{n.en || n.ta}</strong>
                    <span>{n.until ? `Until ${fmtDay(new Date(n.until).getTime())}` : "No end date"}{n.hidden ? " · hidden" : ""}</span>
                  </div>
                  <Toggle tab="notices" row={n.row} hidden={n.hidden} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className={a.h2}>Students ({data.students.length})</h2>
          <div className={a.tableWrap}>
            <table className={a.table}>
              <thead><tr><th>Roll no</th><th>Name</th><th>Group</th><th>Board</th><th>School</th><th>Place</th><th>District</th><th>Status</th><th>Signed in</th></tr></thead>
              <tbody>
                {data.students.map(x => (
                  <tr key={x.regNo}><td>{x.regNo}</td><td>{x.name}</td><td>{x.group}</td><td>{x.board}</td><td>{x.school}</td><td>{x.place}</td><td>{x.district}</td><td>{x.status}</td><td>{x.linked ? "Yes" : "—"}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <p className={a.hint}>To change the details of an existing row, edit it in the Google Sheet. Hiding a row removes it from the student portal without deleting it.</p>
      </div>
    </Shell>
  );
}
