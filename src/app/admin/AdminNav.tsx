"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Самбар" },
  { href: "/admin/members", label: "Гишүүд" },
  { href: "/admin/payments", label: "Төлбөр" },
  { href: "/admin/checkins", label: "Ирц" },
  { href: "/admin/packages", label: "Багц" },
  { href: "/admin/lockers", label: "Шүүгээ" },
  { href: "/admin/gallery", label: "Зураг" },
  { href: "/admin/settings", label: "Тохиргоо" },
];

export function AdminNav() {
  const path = usePathname();
  return (
    <nav className="-mx-5 flex gap-1.5 overflow-x-auto px-5 pb-1">
      {LINKS.map((l) => {
        const on = l.href === "/admin" ? path === "/admin" : path.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`display shrink-0 rounded-full px-4 py-2 text-[13.5px] tracking-[.05em] ${on ? "bg-orange text-on-orange" : "bg-surface-1 text-fg-2 hover:text-fg"}`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
