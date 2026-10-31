import { AppShell } from "@/components/AppShell";
import { requirePage } from "@/server/session";
import { AdminNav } from "./AdminNav";

export const dynamic = "force-dynamic";
export const metadata = { title: { default: "Админ", template: "%s · Админ" } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const u = await requirePage(["admin"], "/admin");
  return (
    <AppShell user={u} wide>
      <AdminNav />
      <div className="mt-6">{children}</div>
    </AppShell>
  );
}
