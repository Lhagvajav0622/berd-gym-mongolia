import type { Metadata, Viewport } from "next";
import "@fontsource-variable/oswald";
import "@fontsource-variable/manrope";
import "./globals.css";
import { BRAND } from "@/brand";

export const metadata: Metadata = {
  title: { default: `${BRAND.name} — Гишүүнчлэл`, template: `%s · ${BRAND.short}` },
  description: `${BRAND.name} — ${BRAND.city}. Багцаа онлайн сонгоод QPay-ээр төлж, QR кодоор ороорой.`,
};

export const viewport: Viewport = { themeColor: "#0E0E0E", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
