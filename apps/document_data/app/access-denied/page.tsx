import Link from "next/link";

import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Navbar } from "@repo/ui/shared/Navbar";
import { ThemeToggle } from "@repo/ui/shared/ThemeToggle";

import { signOutAction } from "@/app/actions/auth";
import {
  ACCESS_DENIED_ROUTE,
  LOGIN_ROUTE,
  requirePageAccess,
} from "@/lib/auth";

export default async function AccessDeniedPage() {
  const { session } = await requirePageAccess(ACCESS_DENIED_ROUTE);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar
        title="Document Data Extractor"
        actions={<ThemeToggle className="static right-auto top-auto z-auto" />}
      />
      <main className="flex min-h-screen items-center justify-center px-6 pb-8 pt-24 sm:pt-28">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access denied</CardTitle>
            <CardDescription>
              This Google account is not allowed to access this environment.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Use a different allowed Google account or contact the team that
              manages access for this environment.
            </p>
          </CardContent>
          <CardFooter className="flex gap-3">
            {session?.user ? (
              <form action={signOutAction}>
                <Button type="submit" variant="outline">
                  Sign out
                </Button>
              </form>
            ) : (
              <Button asChild variant="outline">
                <Link href={LOGIN_ROUTE}>Back to login</Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
