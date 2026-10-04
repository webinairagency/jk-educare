"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { LANG_COOKIE } from "../../lib/i18n";
import { requireAdmin } from "../../lib/admin";
import { GROUPS } from "../../lib/groups";
import { PREVIEW_COOKIE, PREVIEW_ALL } from "../../lib/portal-student";

export async function setLang(fd: FormData) {
  const lang = fd.get("lang") === "ta" ? "ta" : "en";
  (await cookies()).set(LANG_COOKIE, lang, { maxAge: 60 * 60 * 24 * 365, path: "/", sameSite: "lax" });
}

/** Admin preview: choose which group's view of the portal to see. */
export async function setPreviewGroup(fd: FormData) {
  await requireAdmin();
  const g = String(fd.get("group") ?? "");
  (await cookies()).set(PREVIEW_COOKIE, GROUPS.includes(g) ? g : PREVIEW_ALL, { maxAge: 60 * 60 * 8, path: "/", sameSite: "lax" });
  revalidatePath("/portal", "layout");
}
