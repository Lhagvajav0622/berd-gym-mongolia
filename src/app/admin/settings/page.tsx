import { getSettings } from "@/server/settings";
import { qpayMode } from "@/server/qpay";
import { SettingsForm } from "./SettingsForm";

export const metadata = { title: "Тохиргоо" };

export default async function SettingsPage() {
  const s = await getSettings();
  const qpay = qpayMode();
  const sms = process.env.SMS_PROVIDER ?? null;
  return (
    <div className="max-w-2xl">
      <h1 className="display text-[32px]">Тохиргоо</h1>
      <div className="mt-4 grid gap-2 text-[14px] sm:grid-cols-2">
        <div className="rounded-md bg-surface-1 px-4 py-3">
          QPay:{" "}
          <b className={qpay === "live" ? "text-ok" : "text-warn"}>{qpay === "live" ? "Жинхэнэ" : qpay === "sandbox" ? "Sandbox (тест)" : "Холбогдоогүй (тест горим)"}</b>
        </div>
        <div className="rounded-md bg-surface-1 px-4 py-3">
          SMS (OTP): <b className={sms ? "text-ok" : "text-warn"}>{sms === "callpro" ? "CallPro" : "Холбогдоогүй (тест горим)"}</b>
        </div>
      </div>
      <div className="mt-6">
        <SettingsForm initial={s} />
      </div>
    </div>
  );
}
