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
import { DocumentResultView } from "@/app/components/DocumentResultView";
import { QUOTATION_ITEMS_ROUTE, requirePageAccess } from "@/lib/auth";

type QuotationItemsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function QuotationItemsTaskPage({
  params,
}: QuotationItemsPageProps) {
  await requirePageAccess(QUOTATION_ITEMS_ROUTE);

  const { id } = await params;

  return (
    <div className="min-h-screen bg-background font-sans">
      <AppNavbar />
      <main className="flex min-h-screen items-center justify-center px-6 pb-8 pt-24 sm:pt-28">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Quotation Extraction</CardTitle>
            <CardDescription>
              Follow data extraction task processing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">Task {id}</p>
                  <p className="text-sm text-muted-foreground">
                    Tracking extracted quotation items for the uploaded file.
                  </p>
                </div>
                <Button asChild variant="outline">
                  <Link href={QUOTATION_ITEMS_ROUTE}>Upload another PDF</Link>
                </Button>
              </div>
              <DocumentResultView taskId={id} />
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
