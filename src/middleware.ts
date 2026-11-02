import { NextResponse, type NextRequest } from "next/server";

/**
 * Keep everyone on one address in production. Logins are tied to the
 * address they were made on, and actions like sign-out are refused from any
 * address other than PUBLIC_URL, so old or extra domains (berd-gym.vercel.app,
 * per-deploy URLs) are redirected to PUBLIC_URL. Preview deploys are left alone.
 */
export function middleware(req: NextRequest) {
  const publicUrl = process.env.PUBLIC_URL;
  if (process.env.VERCEL_ENV !== "production" || !publicUrl) return NextResponse.next();
  const target = new URL(publicUrl);
  const host = req.headers.get("host");
  if (!host || host === target.host) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.protocol = target.protocol;
  url.host = target.host;
  url.port = target.port;
  return NextResponse.redirect(url, 308);
}

export const config = {
  // Static files don't need redirecting.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|img/).*)"],
};
