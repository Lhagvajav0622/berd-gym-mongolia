import { NewMemberForm } from "./NewMemberForm";

export const metadata = { title: "Шинэ гишүүн" };

export default function NewMemberPage() {
  return (
    <div className="max-w-xl">
      <h1 className="display text-[32px]">Ресепшн дээр бүртгэх</h1>
      <p className="mt-1 text-[14px] text-grey">
        Утасгүй эсвэл онлайн бүртгүүлж чадахгүй хүнд. Гишүүн дараа нь энэ дугаараараа OTP-ээр нэвтэрч QR-аа харна.
      </p>
      <div className="mt-6">
        <NewMemberForm />
      </div>
    </div>
  );
}
