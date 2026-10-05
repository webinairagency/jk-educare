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
          <details className={s.small} style={{ marginTop: 12 }}>
            <summary style={{ cursor: "pointer", fontWeight: 600 }}>Not working? / உதவி</summary>
            <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
              <li>Type the roll number as on your registration screen, e.g. JK-0012.</li>
              <li>The code is the 6 digits shown after you registered. It works once.</li>
              <li>Registered twice? Use the roll number and code from the <b>latest</b> registration.</li>
              <li>Lost your code or see an error? WhatsApp JK sir: <a href="https://wa.me/919842463437">98424 63437</a>.</li>
            </ul>
          </details>
          <form action={async () => { "use server"; await signOut({ redirectTo: "/login" }); }}>
            <p className={s.small}>Wrong Google account? <button type="submit" style={{ background: "none", border: 0, color: "var(--blue)", fontWeight: 600, cursor: "pointer", padding: 0 }}>Use a different one</button></p>
          </form>
        </div>
      </div>
    </div>
  );
}
