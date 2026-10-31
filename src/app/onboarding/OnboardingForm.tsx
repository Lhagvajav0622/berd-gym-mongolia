"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { saveProfile } from "@/app/actions/member";
import { PhotoCapture } from "@/components/PhotoCapture";
import { Button, ErrorText, Field, Input } from "@/components/ui";

export function OnboardingForm({ next, defaultName }: { next: string; defaultName: string }) {
  const router = useRouter();
  const [name, setName] = useState(defaultName);
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (!photo) return setError("Царайны зургаа авна уу.");
        start(async () => {
          const r = await saveProfile({ name, photo });
          if (!r.ok) return setError(r.error);
          router.replace(next);
          router.refresh();
        });
      }}
    >
      <Field label="Овог нэр">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Бат-Эрдэнэ Болд" autoComplete="name" />
      </Field>
      <div>
        <span className="eyebrow mb-3 block">Царайны зураг</span>
        <PhotoCapture value={photo} onChange={setPhoto} />
      </div>
      <ErrorText>{error}</ErrorText>
      <Button type="submit" full disabled={pending}>
        {pending ? "Хадгалж байна…" : "Үргэлжлүүлэх"}
      </Button>
    </form>
  );
}
