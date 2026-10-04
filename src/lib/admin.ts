import { redirect } from "next/navigation";
import { auth } from "../auth";

/** Admins are the Google accounts listed (comma-separated) in the ADMIN_EMAILS env var. */
export function isAdminEmail(email?: string | null) {
  const list = (process.env.ADMIN_EMAILS || "").toLowerCase().split(",").map(s => s.trim()).filter(Boolean);
  return !!email && list.includes(email.toLowerCase());
}

export async function adminSession() {
  const session = await auth();
  return { session, ok: isAdminEmail(session?.user?.email) };
}

/** For server actions: throws unless the caller is an admin. */
export async function requireAdmin() {
  const { ok } = await adminSession();
  if (!ok) redirect("/admin");
}

export type AdminClass = { row: number; id: string; subject: string; topic: string; teacher: string; for: string; start: string; duration: number; live: string; recording: string; notes: string; caption: string; hidden: boolean };
export type AdminMaterial = { row: number; title: string; subject: string; type: string; for: string; link: string; added: string; hidden: boolean };
export type AdminNotice = { row: number; en: string; ta: string; date: string; pinned: boolean; until: string; for?: string; hidden: boolean };
export type AdminStudent = { regNo: string; name: string; group: string; board: string; school: string; place: string; district: string; status: string; linked: boolean; languages?: string };
export type AdminSheet = { url: string; gids: { students: number; classes: number; materials: number; notices: number } };
export type AdminData = { classes: AdminClass[]; materials: AdminMaterial[]; notices: AdminNotice[]; students: AdminStudent[]; sheet?: AdminSheet };

/** Link to the Google Sheet (or one of its tabs). ADMIN_SHEET_URL overrides what the script reports. */
export function sheetLink(sheet: AdminSheet | undefined, tab?: keyof AdminSheet["gids"]) {
  const base = (process.env.ADMIN_SHEET_URL || sheet?.url || "").split("#")[0];
  if (!base) return "";
  const gid = tab && sheet?.gids?.[tab];
  return gid !== undefined && gid !== null ? `${base}#gid=${gid}` : base;
}
