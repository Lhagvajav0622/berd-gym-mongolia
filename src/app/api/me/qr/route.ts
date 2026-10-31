import QRCode from "qrcode";
import { getCurrentUser } from "@/server/session";
import { makeEntryToken } from "@/server/qr-token";

export const dynamic = "force-dynamic";

/** Fresh short-lived entry QR for the signed-in member, as an SVG string. */
export async function GET() {
  const u = await getCurrentUser();
  if (!u) return Response.json({ error: "unauthorized" }, { status: 401 });
  const { token, expiresAt } = makeEntryToken(u.id);
  const svg = await QRCode.toString(token, { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: "#0E0E0E", light: "#FFFFFF" } });
  return Response.json({ svg, expiresAt }, { headers: { "Cache-Control": "no-store" } });
}
