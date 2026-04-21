import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";

import { AppNavbar } from "@/app/components/AppNavbar";
import { PURCHASE_ORDERS_HISTORY_ROUTE, requirePageAccess } from "@/lib/auth";

export default async function PurchaseOrdersHistoryPage() {
  await requirePageAccess(PURCHASE_ORDERS_HISTORY_ROUTE);

  return (
    <div className="min-h-screen bg-background font-sans">
      <AppNavbar />
      <main className="flex min-h-screen items-center justify-center px-6 pb-8 pt-24 sm:pt-28">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Purchase Orders History</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">History page coming soon.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}