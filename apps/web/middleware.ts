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

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    if (request.nextUrl.pathname.startsWith('/api/')) {
      const { userId } = await auth();
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    } else {
      await auth.protect();
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};