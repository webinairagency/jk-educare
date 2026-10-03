import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SCRIPT_URL = process.env.APPS_SCRIPT_URL;
const BOARDS = ["State Board", "Matriculation", "CBSE"];
const MOBILE = /^[6-9]\d{9}$/;

function fail(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

// GET /api/register -> seat counts per pool
export async function GET() {
  if (!SCRIPT_URL) return NextResponse.json({ ok: true, test: true, limit: 50, pools: { STATE: 0, CBSE: 0 } });
  try {
    const r = await fetch(`${SCRIPT_URL}?action=stats`, { cache: "no-store" });
    return NextResponse.json(await r.json());
  } catch {
    return fail("Seat count unavailable", 502);
  }
}

// POST /api/register -> validate, then forward to Google Sheet
export async function POST(req: Request) {
  let d: Record<string, unknown>;
  try {
    d = await req.json();
  } catch {
    return fail("Invalid request");
  }

  // Honeypot filled = bot. Pretend success, save nothing.
  if (d.website) return NextResponse.json({ ok: true, regNo: "JK-B1-0000", position: 999, shortlisted: false });

  const s = (k: string) => String(d[k] ?? "").trim();
  if (s("name").length < 3) return fail("Name is missing");
  if (!MOBILE.test(s("phone")) || !MOBILE.test(s("parent"))) return fail("Invalid mobile number");
  if (!BOARDS.includes(s("board"))) return fail("Invalid board");
  if (!s("group") || !s("school") || !s("place") || !s("district") || !s("gender")) return fail("Some details are missing");
  if (d.consent !== true) return fail("Parent consent is required");

  if (!SCRIPT_URL) return fail("APPS_SCRIPT_URL is not set on the server", 500);

  try {
    const r = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        name: s("name").toUpperCase(), gender: s("gender"), board: s("board"), group: s("group"),
        school: s("school"), place: s("place"), district: s("district"),
        phone: s("phone"), parent: s("parent"), consent: true,
      }),
      cache: "no-store",
    });
    const data = await r.json();
    return NextResponse.json(data, { status: data.ok ? 200 : 400 });
  } catch {
    return fail("Server busy, try again", 502);
  }
}
