import Image from "next/image";
import Link from "next/link";
import type { Metadata, Viewport } from "next";
import { redirect } from "next/navigation";
import { auth, signOut } from "../../auth";
import { getT } from "../../lib/i18n";
import { setLang, setPreviewGroup } from "./actions";
import { portalStudent, PREVIEW_ALL } from "../../lib/portal-student";
import { GROUPS } from "../../lib/groups";
import NavLinks from "../../components/portal/NavLinks";
import { display, body } from "../../components/portal/fonts";
import s from "../../components/portal/portal.module.css";

export const metadata: Metadata = {
  title: "Class portal | JK Edu-Care Services",
  robots: { index: false },
  manifest: "/portal.webmanifest",
  appleWebApp: { capable: true, title: "JK Classes", statusBarStyle: "default" },
  icons: {
    icon: [
      { url: "/portal-favicon.ico", sizes: "any" },
      { url: "/portal-favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/portal-favicon-16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: "/portal-apple-touch-icon.png",
  },
};
export const viewport: Viewport = { themeColor: "#183A8F", viewportFit: "cover" };

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const { st, preview, admin, previewGroup } = await portalStudent();
  if (!st) redirect("/link");
  const { lang, t } = await getT();

  return (
    <div className={`${s.shell} ${display.variable} ${body.variable}`} lang={lang}>
      <header className={s.bar}>
        <div className={s.barIn}>
          <Link href="/portal" className={s.logo}><Image src="/jk-logo-96.png" alt="JK Edu-Care Services" width={40} height={40} priority /> Classes</Link>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className={s.who}>{st.name}<br />{st.regNo}</div>
            <form action={async () => { "use server"; await signOut({ redirectTo: "/login" }); }}>
              <button className={s.signout} type="submit">{t.signOut}</button>
            </form>
          </div>
        </div>
      </header>
      <nav className={s.nav} aria-label="Portal">
        <div className={s.navIn}>
          <NavLinks items={[
            { href: "/portal", label: t.home },
            { href: "/portal/materials", label: t.materials },
            { href: "/portal/neet-jee", label: t.neetJee },
            { href: "/portal/progress", label: t.progress },
          ]} />
          <form action={setLang} style={{ marginLeft: "auto" }}>
            <input type="hidden" name="lang" value={lang === "ta" ? "en" : "ta"} />
            <button className={s.langBtn} type="submit">{t.switchTo}</button>
          </form>
        </div>
      </nav>
      <main className={`${s.main} ${admin ? s.mainAdmin : ""}`}>{children}</main>
      {admin && (
        <div className={s.adminBar} role="region" aria-label="Admin">
          <Link href="/admin" className={s.adminBack}>← Admin portal</Link>
          {preview ? (
            <form action={setPreviewGroup} className={s.adminView}>
              <label>Viewing as
                <select name="group" defaultValue={previewGroup}>
                  {[PREVIEW_ALL, ...GROUPS].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </label>
              <button type="submit">Switch</button>
            </form>
          ) : <span className={s.adminNote}>You are signed in as admin</span>}
        </div>
      )}
    </div>
  );
}
