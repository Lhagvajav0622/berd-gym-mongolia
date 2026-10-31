"use client";

import { useState, useTransition } from "react";
import { cancelPaymentAdmin, confirmCash } from "@/app/actions/admin";
import { Button } from "@/components/ui";

export function PaymentActions({ id }: { id: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        disabled={pending}
        onClick={() => {
          if (!confirm("Бэлэн мөнгийг бүрэн авсан уу?")) return;
          start(async () => {
            const r = await confirmCash(id);
            if (!r.ok) setError(r.error);
          });
        }}
      >
        Мөнгө авсан
      </Button>
      <Button
        variant="dark"
        size="sm"
        disabled={pending}
        onClick={() => {
          if (!confirm("Энэ захиалгыг цуцлах уу?")) return;
          start(async () => {
            const r = await cancelPaymentAdmin(id);
            if (!r.ok) setError(r.error);
          });
        }}
      >
        Цуцлах
      </Button>
      {error && <span className="text-[13px] text-bad">{error}</span>}
    </div>
  );
}
