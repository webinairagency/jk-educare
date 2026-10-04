import { redirect } from "next/navigation";
import { portalStudent } from "../../../lib/portal-student";
import MaterialsList from "../../../components/portal/MaterialsList";
import { getMaterials, type Material } from "../../../lib/content";
import { isExam, tagsForGroup, visibleTo } from "../../../lib/classes";
import { getT } from "../../../lib/i18n";
import s from "../../../components/portal/portal.module.css";

export const dynamic = "force-dynamic";

export default async function MaterialsPage({ searchParams }: { searchParams: Promise<{ type?: string; track?: string }> }) {
  const { type, track } = await searchParams;
  const exam = track === "exam";
  const { st, preview } = await portalStudent();
  if (!st) redirect("/link");
  const { t } = await getT();

  const tags = tagsForGroup(st.group, st.languages);
  const all: Material[] = await getMaterials().catch(() => []);
  const items = all.filter(m => isExam(m.subject) === exam && visibleTo(m, tags)).sort((a, b) => b.added.localeCompare(a.added));

  return (
    <>
      <h1 className={s.hello}>{exam ? `${t.neetJee}: ${t.materials}` : t.materials}</h1>
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
