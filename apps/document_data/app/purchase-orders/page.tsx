import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { listAllPdfs } from "@repo/google-drive";
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
  const pdfs = accessToken
    ? await listAllPdfs(accessToken, "1RN3Onb9MHTeDgG0zPw3rFth5i_lI6mQc")
    : [];

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

        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Google Drive PDFs</CardTitle>
            <CardDescription>{pdfs.length} PDF(s) found</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2">
              {pdfs.map((pdf) => (
                <li key={pdf.id}>
                  <a
                    href={`https://drive.google.com/file/d/${pdf.id}/view`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    {pdf.name}
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
