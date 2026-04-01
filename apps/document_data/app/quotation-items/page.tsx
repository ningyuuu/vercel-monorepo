import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";

import { AppNavbar } from "@/app/components/AppNavbar";
import { DocumentUploadForm } from "@/app/components/DocumentUploadForm";
import { QUOTATION_ITEMS_ROUTE, requirePageAccess } from "@/lib/auth";

export default async function QuotationItemsPage() {
  await requirePageAccess(QUOTATION_ITEMS_ROUTE);

  return (
    <div className="min-h-screen bg-background font-sans">
      <AppNavbar />
      <main className="flex min-h-screen items-center justify-center px-6 pb-8 pt-24 sm:pt-28">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Extract Quotations</CardTitle>
            <CardDescription>Select a PDF to be uploaded.</CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentUploadForm />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
