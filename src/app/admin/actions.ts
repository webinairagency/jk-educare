"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "../../lib/admin";
import { GROUPS } from "../../lib/groups";
import { PREVIEW_ALL, PREVIEW_COOKIE } from "../../lib/portal-student";
import { callScript } from "../../lib/script";

export type FormState = { ok: boolean; msg: string } | null;

const val = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

async function save(action: "adminAdd" | "adminUpdate", kind: "class" | "material" | "notice", item: Record<string, unknown>, row?: number): Promise<FormState> {
  await requireAdmin();
  try {
    await callScript(action, { kind, item, ...(row ? { row } : {}) });
    revalidatePath("/admin");
    return { ok: true, msg: action === "adminAdd" ? "Saved. Students see it within a minute." : "Updated. Students see the change within a minute." };
  } catch (e) {
    return { ok: false, msg: e instanceof Error ? e.message : "Could not save" };
  }
}

const classItem = (f: FormData) => ({
  subject: val(f, "subject"), topic: val(f, "topic"), teacher: val(f, "teacher"), for: val(f, "for"),
  start: val(f, "start"), duration: val(f, "duration"), live: val(f, "live"), recording: val(f, "recording"),
  notes: val(f, "notes"), caption: val(f, "caption"),
});
const materialItem = (f: FormData) => ({ title: val(f, "title"), subject: val(f, "subject"), type: val(f, "type"), for: val(f, "for"), link: val(f, "link") });
const noticeItem = (f: FormData) => ({ en: val(f, "en"), ta: val(f, "ta"), until: val(f, "until"), for: val(f, "for"), pinned: f.get("pinned") === "on" });

export async function addClass(_: FormState, f: FormData) { return save("adminAdd", "class", classItem(f)); }
export async function addMaterial(_: FormState, f: FormData) { return save("adminAdd", "material", materialItem(f)); }
export async function addNotice(_: FormState, f: FormData) { return save("adminAdd", "notice", noticeItem(f)); }

export async function updateClass(_: FormState, f: FormData) { return save("adminUpdate", "class", classItem(f), Number(val(f, "row"))); }
export async function updateMaterial(_: FormState, f: FormData) { return save("adminUpdate", "material", materialItem(f), Number(val(f, "row"))); }
export async function updateNotice(_: FormState, f: FormData) { return save("adminUpdate", "notice", noticeItem(f), Number(val(f, "row"))); }

export async function setHidden(f: FormData) {
  await requireAdmin();
  const tab = val(f, "tab");
  if (!["classes", "materials", "notices"].includes(tab)) return;
  await callScript("adminSetHidden", { tab, row: Number(val(f, "row")), hidden: val(f, "hidden") === "1" });
  revalidatePath("/admin");
}

export type ResetState = { ok: boolean; msg: string; regNo?: string; code?: string } | null;

/** Frees a roll number for a different Google account and makes a new access code. */
export async function resetStudent(_: ResetState, f: FormData): Promise<ResetState> {
  await requireAdmin();
  const regNo = val(f, "regNo");
  try {
    const r = await callScript<{ code?: string; name?: string }>("adminResetStudent", { regNo });
    revalidatePath("/admin");
    return { ok: true, msg: `${r.name ?? regNo} can link a new Google account with this code:`, regNo, code: r.code };
  } catch (e) {
    return { ok: false, msg: e instanceof Error ? e.message : "Could not reset" };
  }
}

/** Opens the student portal as a student of the chosen group (nothing is recorded). */
export async function openPreview(f: FormData) {
  await requireAdmin();
  const g = val(f, "group");
  (await cookies()).set(PREVIEW_COOKIE, GROUPS.includes(g) ? g : PREVIEW_ALL, { maxAge: 60 * 60 * 8, path: "/", sameSite: "lax" });
  redirect("/portal");
}

export type CodesState = { ok: boolean; msg: string } | null;

/** Gives a code to every unlinked, shortlisted student who has none (e.g. registered before codes existed). */
export async function generateCodes(_: CodesState): Promise<CodesState> {
  await requireAdmin();
  try {
    const r = await callScript<{ count?: number }>("adminGenerateCodes");
    revalidatePath("/admin");
    return { ok: true, msg: r.count ? `Made new codes for ${r.count} student(s). Open the Google Sheet to see them and send them.` : "Every unlinked student already has a code." };
  } catch (e) {
    return { ok: false, msg: e instanceof Error ? e.message : "Could not make codes" };
  }
}

export type ContactState = { ok: boolean; error?: string; linked?: boolean; name?: string; regNo?: string; code?: string; phone?: string; parent?: string };

/** Fetches the phone numbers and code of one student for a WhatsApp message. Admin only; nothing is stored. */
export async function getStudentContact(regNo: string): Promise<ContactState> {
  await requireAdmin();
  try {
    const r = await callScript<ContactState>("adminStudentContact", { regNo });
    revalidatePath("/admin");
    return r;
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not load the student" };
  }
}
