// @clerk/nextjs ^6.39.5 (see package.json).
// In Clerk v6, auth.protect() is the canonical enforcement method — calling auth()
// alone returns the auth object without enforcing protection. auth.protect() throws
// an error caught by Clerk middleware and converted to a sign-in redirect for pages.
// API routes get explicit 401 JSON before auth.protect() is reached.
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// INTENTIONAL PRODUCT DECISION (open data philosophy):
// /api/companies(.*) and /api/sectors(.*) are deliberately public. Trikosh's
// mission is open financial research infrastructure — unauthenticated users
// can browse the company directory and sector list to evaluate the product.
// This is NOT a security oversight. Any future mutation endpoints or
// user-specific data (portfolios, watchlists) must require Clerk auth.
// Last reviewed: security hardening sprint, Day 2.
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/companies(.*)",
  "/api/sectors(.*)",
  "/companies(.*)",
]);

// CSP lives here (not in next.config.js headers()) because 'strict-dynamic' requires a
// per-request nonce, which only middleware can generate. The nonce is always our own
// crypto.randomUUID() output — never derived from request headers — and the CSP header
// on the outgoing request is always overwritten (not appended), so this is not subject to
// GHSA-ffhc-5mcf-pf4q (CVE-2026-44581, Next <=15.5.15 nonce-reflection XSS).
function buildCsp(nonce: string) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://*.clerk.accounts.dev https://*.clerk.trikosh.xyz https://clerk.trikosh.xyz`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://*.neon.tech https://*.clerk.com https://*.clerk.accounts.dev https://*.clerk.trikosh.xyz https://clerk.trikosh.xyz",
    "frame-src https://*.clerk.accounts.dev https://*.clerk.trikosh.xyz https://clerk.trikosh.xyz",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');
}

export default clerkMiddleware(async (auth, request) => {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const csp = buildCsp(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);

  if (!isPublicRoute(request)) {
    if (request.nextUrl.pathname.startsWith('/api/')) {
      const { userId } = await auth();
      if (!userId) {
        const res = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        res.headers.set('Content-Security-Policy', csp);
        return res;
      }
    } else {
      await auth.protect();
    }
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('Content-Security-Policy', csp);
  return response;
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};