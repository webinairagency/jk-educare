import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { callScript, type Student } from "./lib/script";

declare module "next-auth" {
  interface Session {
    student?: Student | null;
  }
}

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
  providers: [Google],
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 60 }, // stay signed in 60 days
  pages: { signIn: "/login" },
  callbacks: {
    // Look the student up at sign-in, and again after linking (trigger === "update")
    async jwt({ token, account, trigger }) {
      if ((account || trigger === "update") && token.email) {
        try {
          const r = await callScript<{ student?: Student | null }>("student", { email: token.email });
          token.student = r.student ?? null;
        } catch {
          token.student = null;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.student = (token.student as Student | null | undefined) ?? null;
      return session;
    },
  },
});
