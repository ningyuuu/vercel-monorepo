import { redirect } from "next/navigation";

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

export const HOME_ROUTE = "/";
export const LOGIN_ROUTE = "/login";
export const ACCESS_DENIED_ROUTE = "/access-denied";
export const QUOTATION_ITEMS_ROUTE = "/quotation-items";
export const PURCHASE_ORDERS_ROUTE = "/purchase-orders";
export const PURCHASE_ORDERS_HISTORY_ROUTE = "/purchase-orders/history";
export const PURCHASE_ORDERS_DRIVE_SEARCH_ROUTE =
  "/purchase-orders/drive-search";
export const PRIVACY_ROUTE = "/privacy";
export const DEFAULT_AUTHENTICATED_ROUTE = QUOTATION_ITEMS_ROUTE;

export type AuthAccessState = "guest" | "allowed" | "denied";
export type AppRoute =
  | typeof HOME_ROUTE
  | typeof LOGIN_ROUTE
  | typeof ACCESS_DENIED_ROUTE
  | typeof QUOTATION_ITEMS_ROUTE
  | typeof PURCHASE_ORDERS_ROUTE
  | typeof PURCHASE_ORDERS_HISTORY_ROUTE
  | typeof PURCHASE_ORDERS_DRIVE_SEARCH_ROUTE
  | typeof PRIVACY_ROUTE;

export const allowedEmails = new Set(
  (process.env.AUTH_ALLOWED_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
);

export function isAllowedEmail(email?: string | null) {
  if (allowedEmails.size === 0) {
    return true;
  }

  const normalizedEmail = email?.trim().toLowerCase();

  return Boolean(normalizedEmail && allowedEmails.has(normalizedEmail));
}

export function getAuthAccessState(options: {
  isAuthenticated: boolean;
  email?: string | null;
}): AuthAccessState {
  if (!options.isAuthenticated) {
    return "guest";
  }

  return isAllowedEmail(options.email) ? "allowed" : "denied";
}

export function getRedirectRouteForAccess(
  pathname: string,
  accessState: AuthAccessState,
) {
  if (pathname === LOGIN_ROUTE) {
    if (accessState === "allowed") {
      return DEFAULT_AUTHENTICATED_ROUTE;
    }

    if (accessState === "denied") {
      return ACCESS_DENIED_ROUTE;
    }

    return;
  }

  if (pathname === ACCESS_DENIED_ROUTE) {
    if (accessState === "allowed") {
      return DEFAULT_AUTHENTICATED_ROUTE;
    }

    return;
  }

  if (accessState === "guest") {
    return LOGIN_ROUTE;
  }

  if (accessState === "denied") {
    return ACCESS_DENIED_ROUTE;
  }

  return;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? "",
      authorization: {
        params: {
          scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/drive.readonly",
          ].join(" "),
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: LOGIN_ROUTE,
  },
  callbacks: {
    jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    signIn({ user, account }) {
      if (account?.provider !== "google") {
        return false;
      }

      if (!isAllowedEmail(user.email)) {
        return ACCESS_DENIED_ROUTE;
      }

      return true;
    },
    session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
});

export async function requirePageAccess(currentRoute: AppRoute) {
  const session = await auth();
  const accessState = getAuthAccessState({
    isAuthenticated: Boolean(session?.user),
    email: session?.user?.email,
  });
  const redirectTarget = getRedirectRouteForAccess(currentRoute, accessState);

  if (redirectTarget && redirectTarget !== currentRoute) {
    redirect(redirectTarget);
  }

  return {
    accessState,
    session,
  };
}
