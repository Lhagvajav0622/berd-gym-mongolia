import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "./ui";
import { SignOutButton } from "./SignOutButton";
import type { CurrentUser } from "@/server/session";

export function AppShell({ user, children, wide }: { user: CurrentUser | null; children: ReactNode; wide?: boolean }) {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-line bg-ink/85 backdrop-blur">
        <div className={`mx-auto flex items-center gap-4 px-5 py-3 ${wide ? "max-w-[1200px]" : "max-w-xl"}`}>
          <Link href="/">
            <Logo className="h-7" />
          </Link>
          <nav className="ml-auto flex items-center gap-4 text-[14px] text-fg-2">
            {user ? (
              <>
                <Link href="/me" className="hover:text-fg">Миний</Link>
                {user.role !== "member" && <Link href="/desk" className="hover:text-fg">Ресепшн</Link>}
                {user.role === "admin" && <Link href="/admin" className="hover:text-fg">Админ</Link>}
                <SignOutButton />
              </>
            ) : (
              <Link href="/login" className="text-orange">Нэвтрэх</Link>
            )}
          </nav>
        </div>
      </header>
      <main className={`mx-auto px-5 pt-6 pb-24 ${wide ? "max-w-[1200px]" : "max-w-xl"}`}>{children}</main>
    </div>
  );
}
