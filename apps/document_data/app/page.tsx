import { Card, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";

import { HOME_ROUTE, requirePageAccess } from "@/lib/auth";
import { AppNavbar } from "./components/AppNavbar";

export default async function Home() {
  await requirePageAccess(HOME_ROUTE);

  return (
    <div className="min-h-screen bg-background font-sans">
      <AppNavbar />
      <main className="flex min-h-screen items-center justify-center px-6 pb-8 pt-24 sm:pt-28">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Document Data App</CardTitle>
            <CardDescription>
              Select a type of document to be processed.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    </div>
  );
}
