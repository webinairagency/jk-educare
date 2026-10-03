import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import MaterialsList from "../../../components/portal/MaterialsList";
import { getMaterials, type Material } from "../../../lib/content";
import { tagsForGroup, visibleTo } from "../../../lib/classes";
import { getT } from "../../../lib/i18n";
import s from "../../../components/portal/portal.module.css";

export const dynamic = "force-dynamic";

export default async function MaterialsPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const session = await auth();
  const st = session?.student;
  if (!st) redirect("/link");
  const { t } = await getT();

  const tags = tagsForGroup(st.group);
  const all: Material[] = await getMaterials().catch(() => []);
  const items = all.filter(m => visibleTo(m, tags)).sort((a, b) => b.added.localeCompare(a.added));

  return (
    <>
      <h1 className={s.hello}>{t.materials}</h1>
      <p className={s.sub}>{t.tNotes} · {t.tQB} · {t.tKey} · {t.tExam}</p>
      <MaterialsList
        initialType={type}
        items={items}
        labels={{
          all: t.all, open: t.open, empty: t.noMaterials,
          types: { notes: t.tNotes, "question bank": t.tQB, "answer key": t.tKey, "model exam": t.tExam },
        }}
      />
    </>
  );
}
