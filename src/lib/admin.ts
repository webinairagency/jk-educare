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

export type AdminClass = { row: number; id: string; subject: string; topic: string; teacher: string; for: string; start: string; duration: number; live: string; recording: string; hidden: boolean };
export type AdminMaterial = { row: number; title: string; subject: string; type: string; for: string; link: string; added: string; hidden: boolean };
export type AdminNotice = { row: number; en: string; ta: string; date: string; pinned: boolean; until: string; hidden: boolean };
export type AdminStudent = { regNo: string; name: string; group: string; board: string; school: string; place: string; district: string; status: string; linked: boolean };
export type AdminData = { classes: AdminClass[]; materials: AdminMaterial[]; notices: AdminNotice[]; students: AdminStudent[] };
