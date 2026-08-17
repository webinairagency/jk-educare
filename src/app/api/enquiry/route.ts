// ─────────────────────────────────────────────────────────────────────────────
//  /app/api/enquiry/route.ts
//
//  REV-001 — Visitor Details → Google Sheets
//
//  Receives the contact form submission, validates it server-side, then
//  forwards it to a Google Apps Script Web App tied to the enquiry Sheet.
//  The Apps Script URL lives only in the server environment (GOOGLE_SHEETS_WEBHOOK_URL)
//  and is never sent to the browser.
//
//  SETUP (one-time):
//  1. Open the destination Google Sheet → Extensions → Apps Script.
//  2. Paste the contents of `scripts/google-apps-script/Code.gs` (see repo).
//  3. Deploy → New deployment → type "Web app".
//     - Execute as: Me
//     - Who has access: Anyone
//  4. Copy the deployment URL (ends in /exec).
//  5. Set it as GOOGLE_SHEETS_WEBHOOK_URL in .env.local (dev) and in your
//     hosting provider's environment variables (production).
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server"

const VISITOR_TYPES = ["Student", "Parent", "Teacher", "Other"] as const

interface EnquiryPayload {
  name: string
  phone: string
  email?: string
  visitorType: (typeof VISITOR_TYPES)[number]
  otherType?: string
  subject: string
  message: string
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: Request) {
  let body: Partial<EnquiryPayload>

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 })
  }

  const name = (body.name ?? "").toString().trim()
  const phone = (body.phone ?? "").toString().trim()
  const email = (body.email ?? "").toString().trim()
  const visitorType = (body.visitorType ?? "").toString().trim() as EnquiryPayload["visitorType"]
  const otherType = (body.otherType ?? "").toString().trim()
  const subject = (body.subject ?? "").toString().trim()
  const message = (body.message ?? "").toString().trim()

  // Server-side validation mirrors the client-side rules — never trust the client.
  if (!name || !phone || !visitorType || !subject || !message) {
    return NextResponse.json(
      { success: false, error: "Please fill in all required fields." },
      { status: 400 },
    )
  }

  if (!VISITOR_TYPES.includes(visitorType)) {
    return NextResponse.json({ success: false, error: "Invalid visitor type." }, { status: 400 })
  }

  if (visitorType === "Other" && !otherType) {
    return NextResponse.json(
      { success: false, error: "Please specify the visitor type." },
      { status: 400 },
    )
  }

  if (email && !isValidEmail(email)) {
    return NextResponse.json({ success: false, error: "Please enter a valid email." }, { status: 400 })
  }

  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL

  if (!webhookUrl) {
    console.error("GOOGLE_SHEETS_WEBHOOK_URL is not configured.")
    return NextResponse.json(
      { success: false, error: "Enquiry service is not configured yet. Please try WhatsApp directly." },
      { status: 500 },
    )
  }

  const now = new Date()
  const date = now.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" })
  const time = now.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" })

  try {
    const sheetRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date,
        time,
        name,
        visitorType,
        otherType: visitorType === "Other" ? otherType : "",
        phone,
        email,
        subject,
        message,
      }),
      // Apps Script deployments can be slow to cold-start; give it a moment.
      signal: AbortSignal.timeout(10000),
    })

    if (!sheetRes.ok) {
      throw new Error(`Sheet webhook responded with ${sheetRes.status}`)
    }

    const sheetJson = await sheetRes.json().catch(() => null)

    if (sheetJson && sheetJson.result === "error") {
      throw new Error(sheetJson.error ?? "Unknown sheet error")
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Failed to record enquiry in Google Sheets:", err)
    return NextResponse.json(
      { success: false, error: "We couldn't save your details right now. Please try again in a moment." },
      { status: 502 },
    )
  }
}
