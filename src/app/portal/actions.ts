"use server";
import { cookies } from "next/headers";
import { LANG_COOKIE } from "../../lib/i18n";

export async function setLang(fd: FormData) {
  const lang = fd.get("lang") === "ta" ? "ta" : "en";
  (await cookies()).set(LANG_COOKIE, lang, { maxAge: 60 * 60 * 24 * 365, path: "/", sameSite: "lax" });
}
