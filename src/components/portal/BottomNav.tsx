"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isNavActive } from "./NavLinks";
import s from "./portal.module.css";

/** Tab bar fixed to the bottom of the screen on phones, so students can switch pages with one thumb. */
export default function BottomNav({ items }: { items: { href: string; label: string; icon: string }[] }) {
  const path = usePathname();
  return (
    <nav className={s.tabbar} aria-label="Portal">
      {items.map(i => {
        const on = isNavActive(path, i.href);
        return (
          <Link key={i.href} href={i.href} className={on ? s.tabOn : undefined} aria-current={on ? "page" : undefined}>
            <span aria-hidden="true">{i.icon}</span>
            <span>{i.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
