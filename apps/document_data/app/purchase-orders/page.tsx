import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { listFolder } from "@repo/google-drive";
import { getToken } from "next-auth/jwt";
import { headers } from "next/headers";

import { AppNavbar } from "@/app/components/AppNavbar";
import { PurchaseOrderUploadForm } from "@/app/components/PurchaseOrderUploadForm";
import { PURCHASE_ORDERS_ROUTE, requirePageAccess } from "@/lib/auth";

export default async function PurchaseOrdersPage() {
  await requirePageAccess(PURCHASE_ORDERS_ROUTE);

  const token = await getToken({
    req: { headers: await headers() },
    secret: process.env.AUTH_SECRET,
  });
  const accessToken = token?.accessToken as string | undefined;
  if (accessToken) {
    const files = await listFolder(
      accessToken,
      "17b56MwW_rcQ9Jk9Rqa7jzeqdHTGteFwK"
    );
    console.log("Drive folder contents:", JSON.stringify(files, null, 2));
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <AppNavbar />
      <main className="flex min-h-screen items-center justify-center px-6 pb-8 pt-24 sm:pt-28">
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
