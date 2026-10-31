"use client";

import { useState, useTransition } from "react";
import { pause, resume } from "@/app/actions/member";
import { Button } from "@/components/ui";

export function PauseButton({ membershipId, paused, pausesLeft, maxPauses }: { membershipId: string; paused: boolean; pausesLeft: number; maxPauses: number }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (paused)
    return (
      <div>
        <Button
          full
          disabled={pending}
          onClick={() =>
            start(async () => {
              const r = await resume(membershipId);
              if (!r.ok) setError(r.error);
            })
          }
        >
          {pending ? "…" : "Үргэлжлүүлэх"}
        </Button>
        {error && <p className="mt-2 text-[13px] text-bad">{error}</p>}
      </div>
    );

  return (
    <div>
      <Button
        variant="dark"
        size="md"
        full
        disabled={pending || pausesLeft <= 0}
        onClick={() => {
          if (!confirm(`Хоногоо зогсоох уу? Зогсоох эрх ${pausesLeft}/${maxPauses} үлдсэн. Зогссон хугацаанд хоног хасагдахгүй. Дахин ирэхэд QR уншуулбал автоматаар үргэлжилнэ.`)) return;
          start(async () => {
            const r = await pause(membershipId);
            if (!r.ok) setError(r.error);
          });
        }}
      >
        {pausesLeft > 0 ? `Хоног зогсоох (${pausesLeft}/${maxPauses})` : "Зогсоох эрх дууссан"}
      </Button>
      {error && <p className="mt-2 text-[13px] text-bad">{error}</p>}
    </div>
  );
}
