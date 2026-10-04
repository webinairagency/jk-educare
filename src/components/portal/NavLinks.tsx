"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import s from "./portal.module.css";

export function isNavActive(path: string, href: string) {
  return href === "/portal" ? path === "/portal" || path.startsWith("/portal/class") : path.startsWith(href);
}

/** Portal nav links with the current page marked (colour + aria-current). */
export default function NavLinks({ items }: { items: { href: string; label: string }[] }) {
  const path = usePathname();
  return (
    <>
      {items.map(i => {
        const on = isNavActive(path, i.href);
        return <Link key={i.href} href={i.href} className={on ? s.navOn : undefined} aria-current={on ? "page" : undefined}>{i.label}</Link>;
      })}
    </>
  );
}
