"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createMember } from "@/app/actions/admin";
import { PhotoCapture } from "@/components/PhotoCapture";
import { Button, ErrorText, Field, Input } from "@/components/ui";

export function NewMemberForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const r = await createMember({ phone, name, photo });
          if (!r.ok) return setError(r.error);
          router.push(`/admin/members/${r.data!.id}`);
        });
      }}
    >
      <Field label="Утас">
        <Input inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9911 2233" />
      </Field>
      <Field label="Овог нэр">
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <div>
        <span className="eyebrow mb-3 block">Царайны зураг</span>
        <PhotoCapture value={photo} onChange={setPhoto} />
      </div>
      <ErrorText>{error}</ErrorText>
      <Button type="submit" disabled={pending}>
        {pending ? "…" : "Бүртгэх"}
      </Button>
    </form>
  );
}
