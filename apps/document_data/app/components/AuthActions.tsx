import type { ReactNode } from "react";

import { Button } from "@repo/ui/button";

import { auth } from "@/auth";
import { signOutAction } from "@/app/actions/auth";

type AuthActionsProps = {
  children?: ReactNode;
};

export async function AuthActions({ children }: AuthActionsProps) {
  const session = await auth();

  return (
    <>
      {session?.user ? (
        <form action={signOutAction}>
          <Button size="sm" type="submit" variant="outline">
            Sign out
          </Button>
        </form>
      ) : null}
      {children}
    </>
  );
}
