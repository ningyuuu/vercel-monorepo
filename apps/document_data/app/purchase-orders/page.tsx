import Link from "next/link";

import { Button } from "@repo/ui/button";
import { Navbar } from "@repo/ui/shared/Navbar";
import { ThemeToggle } from "@repo/ui/shared/ThemeToggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";

import { AuthActions } from "@/app/components/AuthActions";
import { PurchaseOrderUploadForm } from "@/app/components/PurchaseOrderUploadForm";
import { HOME_ROUTE, requirePageAccess } from "@/lib/auth";

export default async function PurchaseOrdersPage() {
  await requirePageAccess(HOME_ROUTE);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar
        title="Document Data Extractor"
        actions={
          <AuthActions>
            <ThemeToggle className="static right-auto top-auto z-auto" />
          </AuthActions>
        }
      />
      <main className="flex min-h-screen items-center justify-center px-6 pb-8 pt-24 sm:pt-28">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>Extract Purchase Orders</CardTitle>
                <CardDescription>
                  Upload a purchase-order PDF to extract line items.
                </CardDescription>
              </div>
              <Button asChild variant="outline">
                <Link href="/">Quote Extraction</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <PurchaseOrderUploadForm />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
