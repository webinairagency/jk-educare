"use server";
import { redirect } from "next/navigation";
import { auth, unstable_update } from "../../auth";
import { callScript, ScriptError } from "../../lib/script";

export type LinkState = { error?: string };

export async function linkAccount(_prev: LinkState, fd: FormData): Promise<LinkState> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return { error: "Sign in with Google first." };

  const regNo = String(fd.get("regNo") || "").toUpperCase().replace(/\s+/g, "");
  const code = String(fd.get("code") || "").replace(/\D/g, "");
  if (!/^JK-(B\d+-)?\d{4,}$/.test(regNo)) return { error: "Roll number should look like JK-0007." };
  if (code.length !== 6) return { error: "The access code has 6 digits." };

  try {
    await callScript("link", { email, regNo, code });
  } catch (e) {
    return { error: e instanceof ScriptError ? e.message : "Couldn't link your account. Try again." };
  }
  await unstable_update({}); // re-reads the student record into the session
  redirect("/portal");
}
