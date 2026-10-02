import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth, signOut } from "../../auth";
import LinkForm from "./LinkForm";
import { display, body } from "../../components/portal/fonts";
import s from "../../components/portal/portal.module.css";

export const metadata: Metadata = {
  title: "Link your roll number | JK Edu-Care Services",
  icons: {
    icon: [
      { url: "/portal-favicon.ico", sizes: "any" },
      { url: "/portal-favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/portal-favicon-16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: "/portal-apple-touch-icon.png",
  },
};

export default async function LinkPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.student) redirect("/portal");

  return (
    <div className={`${s.shell} ${display.variable} ${body.variable}`}>
      <div className={s.gate}>
        <div className={s.gateCard}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}><Image src="/jk-logo-96.png" alt="JK Edu-Care Services" width={72} height={72} priority /></div>
          <h1>One last step</h1>
          <p>Connect <strong>{session.user.email}</strong> to your roll number. You only do this once.</p>
          <LinkForm />
          <form action={async () => { "use server"; await signOut({ redirectTo: "/login" }); }}>
            <p className={s.small}>Wrong Google account? <button type="submit" style={{ background: "none", border: 0, color: "var(--blue)", fontWeight: 600, cursor: "pointer", padding: 0 }}>Use a different one</button></p>
          </form>
        </div>
      </div>
    </div>
  );
}
