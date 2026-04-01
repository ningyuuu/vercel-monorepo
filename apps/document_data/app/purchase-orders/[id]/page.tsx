import Link from "next/link";

import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";

import { AppNavbar } from "@/app/components/AppNavbar";
import { PurchaseOrderResultView } from "@/app/components/PurchaseOrderResultView";
import { PURCHASE_ORDERS_ROUTE, requirePageAccess } from "@/lib/auth";

type PurchaseOrderPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PurchaseOrderPage({
  params,
}: PurchaseOrderPageProps) {
  await requirePageAccess(PURCHASE_ORDERS_ROUTE);

  const { id } = await params;

  return (
    <div className="min-h-screen bg-background font-sans">
      <AppNavbar />
      <main className="flex min-h-screen items-center justify-center px-6 pb-8 pt-24 sm:pt-28">
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <CardTitle>Purchase Order Tracking</CardTitle>
            <CardDescription>
              Follow purchase-order extraction task processing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">Task {id}</p>
                  <p className="text-sm text-muted-foreground">
                    Tracking extracted purchase-order items for the uploaded
                    file.
                  </p>
                </div>
                <Button asChild variant="outline">
                  <Link href="/purchase-orders">Upload another PDF</Link>
                </Button>
              </div>
              <PurchaseOrderResultView taskId={id} />
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
