import { redirect } from "next/navigation";
import { Logo } from "@/components/ui";
import { getCurrentUser } from "@/server/session";
import { LoginForm } from "./LoginForm";
import Link from "next/link";

export const metadata = { title: "Нэвтрэх" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/me";
  if (await getCurrentUser()) redirect(safeNext);
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-5 py-8">
      <Link href="/" className="self-start">
        <Logo className="h-8" />
      </Link>
      <div className="my-auto py-10">
        <h1 className="display text-[44px] leading-[0.95]">Нэвтрэх</h1>
        <p className="mt-3 text-fg-2">Утасны дугаараа оруулбал SMS-ээр 6 оронтой код ирнэ. Анх удаа бол автоматаар бүртгэл үүснэ.</p>
        <div className="mt-8">
          <LoginForm next={safeNext} />
        </div>
      </div>
    </main>
  );
}
