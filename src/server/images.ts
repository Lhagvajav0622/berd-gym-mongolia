import "server-only";
import { RuleError } from "./membership";

/** Parses a data URL from the browser and checks type and size. */
export function parseImageDataUrl(dataUrl: string, maxBytes: number): { mime: string; data: string } {
  const m = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl ?? "");
  if (!m) throw new RuleError("Зургийн формат буруу байна.");
  const bytes = Math.floor((m[2].length * 3) / 4);
  if (bytes > maxBytes) throw new RuleError(`Зураг хэт том байна (${Math.round(bytes / 1024)} KB).`);
  return { mime: m[1], data: m[2] };
}
