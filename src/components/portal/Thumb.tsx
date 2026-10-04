import { fmtDay, fmtTime } from "../../lib/classes-shared";

// One colour per subject so students recognise classes at a glance.
const COLOURS: Record<string, [string, string]> = {
  physics: ["#183A8F", "#FFDD1F"],
  chemistry: ["#B5441B", "#FFE3B0"],
  biology: ["#1C6B3A", "#C9F2A9"],
  botany: ["#1C6B3A", "#C9F2A9"],
  zoology: ["#2E5E2A", "#D8F5B8"],
  maths: ["#5B2A86", "#F3D7FF"],
  mathematics: ["#5B2A86", "#F3D7FF"],
  "computer science": ["#0E6B73", "#B8F3F0"],
  "computer application": ["#0B5F8A", "#C7E8FF"],
  english: ["#8A1C4A", "#FFD6E8"],
  tamil: ["#9A2B1F", "#FFE1C2"],
  "commerce & accountancy": ["#6B4E0B", "#FFF0B8"],
  commerce: ["#6B4E0B", "#FFF0B8"],
  accountancy: ["#6B4E0B", "#FFF0B8"],
  neet: ["#0F6B3A", "#FFDD1F"],
  jee: ["#7A1FA2", "#FFDD1F"],
};
const pick = (s: string): [string, string] => COLOURS[s.trim().toLowerCase()] ?? ["#0F2766", "#FFDD1F"];

function wrap(text: string, max: number, lines: number) {
  const words = text.split(/\s+/);
  const out: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > max) { out.push(cur.trim()); cur = w; } else cur += " " + w;
  }
  if (cur.trim()) out.push(cur.trim());
  if (out.length > lines) { out.length = lines; out[lines - 1] = out[lines - 1].replace(/.{0,2}$/, "…"); }
  return out;
}

/** Auto-generated 16:9 class thumbnail. No design work needed per class. */
export default function Thumb({ subject, topic, startMs }: { subject: string; topic: string; startMs: number }) {
  const [bg, fg] = pick(subject);
  const lines = wrap(topic, 26, 2);
  return (
    <svg viewBox="0 0 640 360" role="img" aria-label={`${subject}: ${topic}`} style={{ display: "block", width: "100%", height: "auto" }}>
      <rect width="640" height="360" fill={bg} />
      <circle cx="590" cy="-20" r="170" fill={fg} opacity="0.12" />
      <circle cx="560" cy="380" r="120" fill={fg} opacity="0.08" />
      <text x="40" y="78" fill={fg} style={{ font: "800 34px var(--display), sans-serif" }}>{subject}</text>
      {lines.map((l, i) => (
        <text key={i} x="40" y={160 + i * 56} fill="#fff" style={{ font: "800 48px var(--display), sans-serif" }}>{l}</text>
      ))}
      <text x="40" y="318" fill="#fff" opacity="0.85" style={{ font: "600 24px var(--body), sans-serif" }}>
        {fmtDay(startMs)} · {fmtTime(startMs)}
      </text>
      <rect x="548" y="286" width="56" height="40" rx="8" fill={fg} />
      <text x="576" y="314" textAnchor="middle" fill={bg} style={{ font: "800 22px var(--display), sans-serif" }}>JK</text>
    </svg>
  );
}
