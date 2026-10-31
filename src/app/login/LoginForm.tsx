"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, ErrorText, Field, Input } from "@/components/ui";
import { authClient } from "@/lib/auth-client";

function normalize(input: string) {
  let d = input.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("976")) d = d.slice(3);
  return /^[6-9]\d{7}$/.test(d) ? d : null;
}

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wait, setWait] = useState(0);
  const [testCode, setTestCode] = useState<string | null>(null);

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  async function send() {
    const p = normalize(phone);
    if (!p) return setError("8 оронтой утасны дугаар оруулна уу.");
    setBusy(true);
    setError(null);
    const { error } = await authClient.phoneNumber.sendOtp({ phoneNumber: p });
    setBusy(false);
    if (error) return setError(error.message ?? "Код илгээж чадсангүй. Дахин оролдоно уу.");
    setStep("code");
    setWait(60);
    // Test mode (no SMS provider yet): the server reveals the code. 404 otherwise.
    const r = await fetch(`/api/test-otp?phone=${p}`, { cache: "no-store" }).catch(() => null);
    if (r?.ok) setTestCode(((await r.json()) as { code: string | null }).code);
  }

  async function verify() {
    const p = normalize(phone)!;
    if (!/^\d{6}$/.test(code)) return setError("6 оронтой кодоо оруулна уу.");
    setBusy(true);
    setError(null);
    const { error } = await authClient.phoneNumber.verify({ phoneNumber: p, code });
    if (error) {
      setBusy(false);
      return setError(error.message?.includes("attempt") ? "Хэт олон буруу оролдлого. Шинэ код авна уу." : "Код буруу эсвэл хугацаа нь дууссан байна.");
    }
    router.replace(next);
    router.refresh();
  }

  if (step === "phone")
    return (
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
      >
        <Field label="Утасны дугаар">
          <div className="relative">
            <span className="absolute top-1/2 left-3.5 -translate-y-1/2 font-semibold text-fg-2">+976</span>
            <Input
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="9911 2233"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="pl-16 text-lg tracking-wider"
              autoFocus
            />
          </div>
        </Field>
        <ErrorText>{error}</ErrorText>
        <Button type="submit" full disabled={busy}>
          {busy ? "Илгээж байна…" : "Код авах"}
        </Button>
      </form>
    );

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        void verify();
      }}
    >
      <p className="text-fg-2">
        <b className="text-fg">{normalize(phone)}</b> дугаарт код илгээлээ.{" "}
        <button type="button" className="text-orange underline" onClick={() => { setStep("phone"); setCode(""); setError(null); setTestCode(null); }}>
          Солих
        </button>
      </p>
      {testCode && (
        <div className="rounded-md border border-warn/40 bg-warn/10 p-3.5 text-[14px] text-warn">
          Туршилтын горим: SMS холбогдоогүй тул код энд харагдаж байна.
          <div className="mt-2 flex items-center justify-between">
            <span className="display text-[26px] tracking-[.3em] text-fg">{testCode}</span>
            <button type="button" className="text-orange underline" onClick={() => setCode(testCode)}>
              Бөглөх
            </button>
          </div>
        </div>
      )}
      <Field label="Баталгаажуулах код">
        <Input
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="••••••"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          className="text-center text-2xl tracking-[0.5em]"
          autoFocus
        />
      </Field>
      <ErrorText>{error}</ErrorText>
      <Button type="submit" full disabled={busy || code.length !== 6}>
        {busy ? "Шалгаж байна…" : "Нэвтрэх"}
      </Button>
      <Button variant="ghost" size="sm" full disabled={wait > 0 || busy} onClick={() => void send()}>
        {wait > 0 ? `Дахин код авах (${wait})` : "Дахин код авах"}
      </Button>
    </form>
  );
}
