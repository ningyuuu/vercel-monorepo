import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";

import { AppNavbar } from "@/app/components/AppNavbar";
import { PurchaseOrderUploadForm } from "@/app/components/PurchaseOrderUploadForm";
import { PURCHASE_ORDERS_ROUTE, requirePageAccess } from "@/lib/auth";

export default async function PurchaseOrdersPage() {
  await requirePageAccess(PURCHASE_ORDERS_ROUTE);

  return (
    <div className="min-h-screen bg-background font-sans">
      <AppNavbar />
      <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 pb-8 pt-24 sm:pt-28">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Extract Purchase Orders</CardTitle>
            <CardDescription>
              Upload a purchase-order PDF to extract line items.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PurchaseOrderUploadForm />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
