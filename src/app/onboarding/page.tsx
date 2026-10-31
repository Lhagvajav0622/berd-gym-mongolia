import { redirect } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { requirePage } from "@/server/session";
import { OnboardingForm } from "./OnboardingForm";

export const metadata = { title: "Бүртгэл" };

export default async function OnboardingPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const u = await requirePage(undefined, "/onboarding");
  const { next } = await searchParams;
  const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : "/me";
  if (u.profileComplete) redirect(safeNext);
  return (
    <AppShell user={u}>
      <h1 className="display text-[40px] leading-[0.95]">Бүртгэл</h1>
      <p className="mt-3 text-fg-2">
        Таны царайны зургийг ресепшн QR уншуулах бүрт харж, та өөрөө мөн эсэхийг шалгана. Ингэснээр таны эрхээр өөр хүн орох боломжгүй.
      </p>
      <div className="mt-8">
        <OnboardingForm next={safeNext} defaultName={u.name === u.phone ? "" : u.name} />
      </div>
    </AppShell>
  );
}
