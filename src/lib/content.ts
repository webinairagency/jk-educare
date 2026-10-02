import { unstable_cache } from "next/cache";
import { callScript } from "./script";

export type Material = { title: string; subject: string; type: string; for: string; link: string; added: string };
export type Notice = { en: string; ta: string; date: string; pinned: boolean; for: string };

export const getMaterials = unstable_cache(
  async () => (await callScript<{ materials: Material[] }>("materials")).materials,
  ["portal-materials"], { revalidate: 60 }
);

export const getNotices = unstable_cache(
  async () => (await callScript<{ notices: Notice[] }>("notices")).notices,
  ["portal-notices"], { revalidate: 60 }
);
