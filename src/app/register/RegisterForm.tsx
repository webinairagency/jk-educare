"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Baloo_Thambi_2, Hind_Madurai } from "next/font/google";
import s from "./register.module.css";

const display = Baloo_Thambi_2({ subsets: ["tamil", "latin"], weight: ["600", "800"], variable: "--display" });
const body = Hind_Madurai({ subsets: ["tamil", "latin"], weight: ["400", "500", "600"], variable: "--body" });

/* ================= CONFIG ================= */
const LIMIT = 50;
const CONTACT = "919842463437";
const WA_BOYS = "https://chat.whatsapp.com/REPLACE_BOYS";
const WA_GIRLS = "https://chat.whatsapp.com/REPLACE_GIRLS";
/* ========================================== */

const DISTRICTS = ["Ariyalur","Chengalpattu","Chennai","Coimbatore","Cuddalore","Dharmapuri","Dindigul","Erode","Kallakurichi","Kancheepuram","Kanniyakumari","Karur","Krishnagiri","Madurai","Mayiladuthurai","Nagapattinam","Namakkal","Nilgiris","Perambalur","Pudukkottai","Ramanathapuram","Ranipet","Salem","Sivagangai","Tenkasi","Thanjavur","Theni","Thoothukudi","Tiruchirappalli","Tirunelveli","Tirupathur","Tiruppur","Tiruvallur","Tiruvannamalai","Tiruvarur","Vellore","Viluppuram","Virudhunagar","Puducherry","Outside Tamil Nadu"];
const GROUPS = ["XII – Bio-Maths", "XII – CS-Maths", "XII – Pure Science (Bio)", "XII – Other"];

type Pools = { STATE: number; CBSE: number };
type Form = {
  name: string; gender: string; board: string; group: string; school: string;
  place: string; district: string; phone: string; parent: string; consent: boolean; website: string;
};
type Result = { regNo: string; position: number; shortlisted: boolean; duplicate?: boolean; pools?: Pools };

const EMPTY: Form = { name: "", gender: "", board: "", group: "", school: "", place: "", district: "", phone: "", parent: "", consent: false, website: "" };
const mobile = (v: string) => /^[6-9]\d{9}$/.test(v);
const RULES: Record<string, [(f: Form) => boolean, string]> = {
  name: [f => f.name.trim().length >= 3, "Enter the name with initial, e.g. R. KAVYA"],
  gender: [f => !!f.gender, "Choose boy or girl so we add you to the right WhatsApp group"],
  board: [f => !!f.board, "Choose your board"],
  group: [f => !!f.group, "Select your group"],
  school: [f => f.school.trim().length >= 3, "Enter your school name"],
  place: [f => f.place.trim().length >= 2, "Enter your place"],
  district: [f => !!f.district, "Select your district"],
  phone: [f => mobile(f.phone), "Enter a valid 10-digit mobile number"],
  parent: [f => mobile(f.parent), "Enter a valid 10-digit mobile number"],
  consent: [f => f.consent, "Parent's agreement is needed to register"],
};

export default function RegisterForm() {
  const [f, setF] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pools, setPools] = useState<Pools>({ STATE: 0, CBSE: 0 });
  const [busy, setBusy] = useState(false);
  const [formErr, setFormErr] = useState("");
  const [done, setDone] = useState<{ form: Form; res: Result } | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/register", { cache: "no-store" })
      .then(r => r.json()).then(j => j.ok && j.pools && setPools(j.pools)).catch(() => {});
  }, []);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setF(p => ({ ...p, [k]: v }));
    if (errors[k as string]) setErrors(e => { const n = { ...e }; delete n[k as string]; return n; });
  };
  const digits = (v: string) => v.replace(/\D/g, "").slice(0, 10);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setFormErr("");
    const errs: Record<string, string> = {};
    for (const [k, [ok, msg]] of Object.entries(RULES)) if (!ok(f)) errs[k] = msg;
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      document.getElementById(`f-${first}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setBusy(true);
    try {
      const payload = { ...f, name: f.name.toUpperCase().replace(/\s+/g, " ").trim() };
      const r = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "Registration failed");
      if (j.pools) setPools(j.pools);
      setDone({ form: payload, res: j });
      setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch (err) {
      setFormErr(`Couldn't register: ${(err as Error).message}. Check your internet and try again, or WhatsApp 98424 63437.`);
    } finally {
      setBusy(false);
    }
  }

  const field = (k: string) => `${s.field} ${errors[k] ? s.invalid : ""}`;
  const Err = ({ k }: { k: string }) => (errors[k] ? <div className={s.err}>{errors[k]}</div> : null);

  return (
    <div className={`${s.page} ${display.variable} ${body.variable}`}>
      <header className={s.band}>
        <div className={s.wrap}>
          <div className={s.brand}><b>JK</b> Edu-Care Services</div>
          <h1>+2 மாணவரா நீங்கள்?</h1>
          <p className={s.sub}>Free online classes for all subjects, NEET &amp; JEE. Weekends and holidays only, so school isn&apos;t disturbed.</p>
          <ul className={s.free}><li>Free material</li><li>Question bank</li><li>Answer keys</li><li>Model exams</li></ul>
        </div>
      </header>

      <main className={s.main}>
        <section className={s.seats} aria-live="polite" ref={topRef}>
          <h2>Batch I seats</h2>
          <p>50 students per board. First come, first shortlisted.</p>
          {(["STATE", "CBSE"] as const).map(p => {
            const taken = Math.min(pools[p] || 0, LIMIT);
            return (
              <div className={s.pool} key={p}>
                <div className={s.poolTop}>
                  <strong>{p === "STATE" ? "State Board & Matric" : "CBSE"}</strong>
                  <span><b>{LIMIT - taken}</b> left</span>
                </div>
                <div className={s.dots}>
                  {Array.from({ length: LIMIT }, (_, i) => <i key={i} className={i < taken ? s.on : ""} />)}
                </div>
              </div>
            );
          })}
        </section>

        {done ? (
          <section className={s.done} aria-live="polite">
            <div className={s.tick} aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
            </div>
            <h2>{done.res.duplicate ? "You're already registered" : "Registered for Batch I"}</h2>
            <p>{done.res.duplicate ? "This number was registered earlier. Your registration number:" : "Save or screenshot your registration number."}</p>
            <div className={s.regno}>{done.res.regNo}</div>
            {done.res.shortlisted
              ? <span className={`${s.status} ${s.ok}`}>Shortlisted: seat {done.res.position} of {LIMIT}</span>
              : <span className={`${s.status} ${s.wait}`}>Waitlist: position {done.res.position - LIMIT}. We&apos;ll contact you for the next batch.</span>}
            <a className={`${s.btn} ${s.wa}`} href={done.form.gender === "Girl" ? WA_GIRLS : WA_BOYS} target="_blank" rel="noopener noreferrer">
              {done.form.gender === "Girl" ? "Join the girls' WhatsApp group" : "Join the boys' WhatsApp group"}
            </a>
            <a className={`${s.btn} ${s.ghost}`} target="_blank" rel="noopener noreferrer"
              href={`https://wa.me/${CONTACT}?text=${encodeURIComponent(
                `Batch I Registration (${done.res.regNo})\nNAME: ${done.form.name}\nCLASS & GROUP: ${done.form.group}\nBOARD: ${done.form.board}\nSCHOOL: ${done.form.school}\nPLACE & DISTRICT: ${done.form.place}, ${done.form.district}`
              )}`}>
              Also send my details on WhatsApp
            </a>
            <button type="button" className={`${s.btn} ${s.ghost}`} onClick={() => { setDone(null); setF(EMPTY); setErrors({}); }}>
              Register another student
            </button>
          </section>
        ) : (
          <form className={s.form} onSubmit={submit} noValidate>
            {formErr && <div className={s.formErr} role="alert">{formErr}</div>}

            <div className={field("name")} id="f-name">
              <label htmlFor="name">Student name <span className={s.ta}>பெயர் – initial உடன்</span></label>
              <input id="name" className={s.upper} type="text" autoComplete="name" placeholder="e.g. R. KAVYA" maxLength={60}
                value={f.name} onChange={e => set("name", e.target.value)} />
              <Err k="name" />
            </div>

            <div className={field("gender")} id="f-gender">
              <span className={s.legend} id="lg-gender">Group to join <span className={s.ta}>மாணவர் / மாணவி</span></span>
              <div className={s.chips} role="radiogroup" aria-labelledby="lg-gender">
                {["Boy", "Girl"].map(v => (
                  <span key={v}>
                    <input type="radio" id={`g-${v}`} name="gender" checked={f.gender === v} onChange={() => set("gender", v)} />
                    <label htmlFor={`g-${v}`}>{v}</label>
                  </span>
                ))}
              </div>
              <Err k="gender" />
            </div>

            <div className={field("board")} id="f-board">
              <span className={s.legend} id="lg-board">Board <span className={s.ta}>பாடத்திட்டம்</span></span>
              <div className={s.chips} role="radiogroup" aria-labelledby="lg-board">
                {[["State Board", "State Board"], ["Matriculation", "Matric"], ["CBSE", "CBSE"]].map(([v, l]) => (
                  <span key={v}>
                    <input type="radio" id={`b-${l}`} name="board" checked={f.board === v} onChange={() => set("board", v)} />
                    <label htmlFor={`b-${l}`}>{l}</label>
                  </span>
                ))}
              </div>
              <Err k="board" />
            </div>

            <div className={field("group")} id="f-group">
              <label htmlFor="group">Class &amp; group <span className={s.ta}>வகுப்பு &amp; பிரிவு</span></label>
              <select id="group" value={f.group} onChange={e => set("group", e.target.value)}>
                <option value="">Select your group</option>
                {GROUPS.map(g => <option key={g}>{g}</option>)}
              </select>
              <Err k="group" />
            </div>

            <div className={field("school")} id="f-school">
              <label htmlFor="school">School name <span className={s.ta}>பள்ளி</span></label>
              <input id="school" type="text" placeholder="e.g. ABC Matric Hr. Sec. School" maxLength={100}
                value={f.school} onChange={e => set("school", e.target.value)} />
              <Err k="school" />
            </div>

            <div className={s.row}>
              <div className={field("place")} id="f-place">
                <label htmlFor="place">Place <span className={s.ta}>ஊர்</span></label>
                <input id="place" type="text" placeholder="e.g. Thirunagar" maxLength={60}
                  value={f.place} onChange={e => set("place", e.target.value)} />
                <Err k="place" />
              </div>
              <div className={field("district")} id="f-district">
                <label htmlFor="district">District <span className={s.ta}>மாவட்டம்</span></label>
                <select id="district" value={f.district} onChange={e => set("district", e.target.value)}>
                  <option value="">Select</option>
                  {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                </select>
                <Err k="district" />
              </div>
            </div>

            <div className={field("phone")} id="f-phone">
              <label htmlFor="phone">Student WhatsApp number <span className={s.ta}>வாட்ஸ் அப் எண்</span></label>
              <div className={s.prefix}><span>+91</span>
                <input id="phone" type="tel" inputMode="numeric" maxLength={10} placeholder="10-digit number" autoComplete="tel-national"
                  value={f.phone} onChange={e => set("phone", digits(e.target.value))} />
              </div>
              <Err k="phone" />
            </div>

            <div className={field("parent")} id="f-parent">
              <label htmlFor="parent">Parent&apos;s mobile number <span className={s.ta}>பெற்றோர் எண்</span></label>
              <div className={s.prefix}><span>+91</span>
                <input id="parent" type="tel" inputMode="numeric" maxLength={10} placeholder="10-digit number"
                  value={f.parent} onChange={e => set("parent", digits(e.target.value))} />
              </div>
              <Err k="parent" />
            </div>

            <div className={field("consent")} id="f-consent">
              <div className={s.consent}>
                <input type="checkbox" id="consent" checked={f.consent} onChange={e => set("consent", e.target.checked)} />
                <label htmlFor="consent">My parent/guardian agrees to share these details with JK Edu-Care Services for class updates. <span className={s.ta}>பெற்றோர் சம்மதத்துடன் பதிவு செய்கிறேன்.</span></label>
              </div>
              <Err k="consent" />
            </div>

            <div className={s.hp} aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input id="website" type="text" tabIndex={-1} autoComplete="off" value={f.website} onChange={e => set("website", e.target.value)} />
            </div>

            <button className={s.go} type="submit" disabled={busy}>{busy ? "Registering…" : "Register for Batch I"}</button>
          </form>
        )}

        <p className={s.foot}>Questions? Call or WhatsApp <a href="tel:+919842463437">98424 63437</a></p>
      </main>
    </div>
  );
}
