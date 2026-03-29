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
import { DocumentResultView } from "@/app/components/DocumentResultView";
import { HOME_ROUTE, requirePageAccess } from "@/lib/auth";

type DocumentPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DocumentPage({ params }: DocumentPageProps) {
  await requirePageAccess(HOME_ROUTE);

  const { id } = await params;

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
            <CardTitle>Document Tracking</CardTitle>
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
                  <Link href="/">Upload another PDF</Link>
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
