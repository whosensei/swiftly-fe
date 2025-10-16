import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);
  const path = request.nextUrl.pathname;

  // Public routes that don't require authentication
  // Allow single-segment short links like /abc123 while excluding reserved paths
  const isShortLinkPath =
    /^\/[A-Za-z0-9_-]+$/.test(path) &&
    !["/sign-in", "/sign-up", "/dashboard"].includes(path) &&
    !path.startsWith("/api") &&
    !path.startsWith("/_next");

  const isPublicRoute =
    path === "/" ||
    path.startsWith("/sign-in") ||
    path.startsWith("/sign-up") ||
    isShortLinkPath;

  // If the route is not public and there's no session, redirect to sign-in
  if (!isPublicRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
