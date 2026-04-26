import { NextResponse } from "next/server";

import {
  auth,
  getAuthAccessState,
  getRedirectRouteForAccess,
} from "@/lib/auth";

const publicRoutes = ["/privacy", "/login", "/access-denied"];

export default auth((request) => {
  const pathname = request.nextUrl.pathname;

  if (publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))) {
    return NextResponse.next();
  }

  const accessState = getAuthAccessState({
    isAuthenticated: Boolean(request.auth),
    email: request.auth?.user?.email,
  });
  const redirectTarget = getRedirectRouteForAccess(pathname, accessState);

  if (redirectTarget && redirectTarget !== pathname) {
    return NextResponse.redirect(new URL(redirectTarget, request.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
