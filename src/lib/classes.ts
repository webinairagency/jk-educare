import { unstable_cache } from "next/cache";
import { callScript } from "./script";
import type { ClassRow } from "./classes-shared";

export * from "./classes-shared";

// Classes are shared by everyone, so cache them for 60s to keep the portal fast.
export const getClasses = unstable_cache(
  async () => (await callScript<{ classes?: ClassRow[] }>("classes")).classes ?? [],
  ["portal-classes"],
  { revalidate: 60 }
);

export async function getAttendance(regNo: string) {
  try {
    return new Set((await callScript<{ ids?: string[] }>("attendance", { regNo })).ids ?? []);
  } catch {
    return new Set<string>();
  }
}
