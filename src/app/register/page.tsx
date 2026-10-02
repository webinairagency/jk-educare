import type { Metadata } from "next";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "+2 Batch I Registration | JK Edu-Care Services",
  description: "Free online classes for +2 students: all subjects, NEET & JEE. 50 seats per batch. Register now.",
  openGraph: {
    title: "+2 மாணவரா நீங்கள்? Free online classes – Batch I",
    description: "All subjects, NEET & JEE. Free material, question bank, answer keys and model exams. 50 seats only.",
    url: "https://www.jkeducareservices.com/register",
    siteName: "JK Edu-Care Services",
    type: "website",
  },
};

export default function RegisterPage() {
  return <RegisterForm />;
}
