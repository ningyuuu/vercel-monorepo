import { NextResponse } from "next/server";

import {
  auth,
  getAuthAccessState,
  getRedirectRouteForAccess,
} from "@/lib/auth";

export default auth((request) => {
  const accessState = getAuthAccessState({
    isAuthenticated: Boolean(request.auth),
    email: request.auth?.user?.email,
  });
  const redirectTarget = getRedirectRouteForAccess(
    request.nextUrl.pathname,
    accessState,
  );

  if (redirectTarget && redirectTarget !== request.nextUrl.pathname) {
    return NextResponse.redirect(new URL(redirectTarget, request.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
