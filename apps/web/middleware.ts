// SECURITY AUDIT 2026-06-07: Public routes explicitly whitelisted. All other routes require Clerk auth.
// Uses clerkMiddleware (v5 API — not deprecated authMiddleware).
// auth.protect() is called for all non-public routes, which redirects unauthenticated users to sign-in.
// Matcher excludes static assets (paths with dots) and _next/* via the negative lookahead regex.
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

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
    auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};