// @clerk/nextjs ^6.39.5 (see package.json).
// In Clerk v6, auth.protect() is the canonical enforcement method — calling auth()
// alone returns the auth object without enforcing protection. auth.protect() throws
// an error caught by Clerk middleware and converted to a sign-in redirect for pages.
// API routes get explicit 401 JSON before auth.protect() is reached.
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/companies(.*)",
  "/api/sectors(.*)",
  "/companies(.*)",
]);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    if (request.nextUrl.pathname.startsWith('/api/')) {
      const { userId } = auth();
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    } else {
      auth.protect();
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};