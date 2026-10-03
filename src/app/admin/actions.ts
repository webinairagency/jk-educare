"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "../../lib/admin";
import { callScript } from "../../lib/script";

export type FormState = { ok: boolean; msg: string } | null;

const val = (f: FormData, k: string) => String(f.get(k) ?? "").trim();

async function add(kind: "class" | "material" | "notice", item: Record<string, unknown>): Promise<FormState> {
  await requireAdmin();
  try {
    await callScript("adminAdd", { kind, item });
    revalidatePath("/admin");
    return { ok: true, msg: "Saved. Students see it within a minute." };
  } catch (e) {
    return { ok: false, msg: e instanceof Error ? e.message : "Could not save" };
  }
}

export async function addClass(_: FormState, f: FormData) {
  return add("class", {
    subject: val(f, "subject"), topic: val(f, "topic"), teacher: val(f, "teacher"), for: val(f, "for"),
    start: val(f, "start"), duration: val(f, "duration"), live: val(f, "live"), recording: val(f, "recording"), caption: val(f, "caption"),
  });
}
export async function addMaterial(_: FormState, f: FormData) {
  return add("material", { title: val(f, "title"), subject: val(f, "subject"), type: val(f, "type"), for: val(f, "for"), link: val(f, "link") });
}
export async function addNotice(_: FormState, f: FormData) {
  return add("notice", { en: val(f, "en"), ta: val(f, "ta"), until: val(f, "until"), for: val(f, "for"), pinned: f.get("pinned") === "on" });
}

export async function setHidden(f: FormData) {
  await requireAdmin();
  const tab = val(f, "tab");
  if (!["classes", "materials", "notices"].includes(tab)) return;
  await callScript("adminSetHidden", { tab, row: Number(val(f, "row")), hidden: val(f, "hidden") === "1" });
  revalidatePath("/admin");
}
