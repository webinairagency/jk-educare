import { cache } from "react";
import { cookies } from "next/headers";
import { auth } from "../auth";
import { isAdminEmail } from "./admin";
import { GROUPS } from "./groups";
import type { Student } from "./script";

export const PREVIEW_COOKIE = "jk_preview_group";
export const PREVIEW_ALL = "All groups";

/**
 * The student a portal page is shown for. A signed-in linked student is themselves.
 * An admin who is not linked to a roll number gets a read-only "preview student" so they can
 * see the portal exactly as students do (no roll number, no attendance recorded).
 */
export const portalStudent = cache(async function portalStudent(): Promise<{ st: Student | null; preview: boolean; admin: boolean; previewGroup: string }> {
  const session = await auth();
  const admin = isAdminEmail(session?.user?.email);
  if (session?.student) return { st: session.student, preview: false, admin, previewGroup: "" };
  if (!admin) return { st: null, preview: false, admin, previewGroup: "" };

  const pick = (await cookies()).get(PREVIEW_COOKIE)?.value ?? "";
  const previewGroup = GROUPS.includes(pick) ? pick : PREVIEW_ALL;
  const st: Student = {
    regNo: "PREVIEW", name: "Admin preview", gender: "", status: "Shortlisted",
    board: "Preview",
    group: previewGroup === PREVIEW_ALL ? "All groups (admin preview)" : previewGroup,
  };
  return { st, preview: true, admin, previewGroup };
});
