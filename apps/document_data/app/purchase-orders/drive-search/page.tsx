import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { listAllPdfs, DriveSessionExpiredError } from "@repo/google-drive";
import { auth } from "@/lib/auth";

import { AppNavbar } from "@/app/components/AppNavbar";
import { DriveSearchForm } from "@/app/components/DriveSearchForm";
import { DriveSearchTable } from "@/app/components/DriveSearchTable";
import { PURCHASE_ORDERS_ROUTE, requirePageAccess } from "@/lib/auth";

interface DriveSearchPageProps {
  searchParams: Promise<{ folderId?: string }>;
}

export default async function DriveSearchPage({
  searchParams,
}: DriveSearchPageProps) {
  await requirePageAccess(PURCHASE_ORDERS_ROUTE);

  const params = await searchParams;
  const folderId = params.folderId;

  let pdfs: { id: string; name: string; mimeType: string }[] = [];
  let error: string | null = null;

  try {
    const session = await auth();
    const accessToken = session?.accessToken as string;

    if (!accessToken) {
      throw new Error(
        "No access token found. Please sign in again.",
      );
    }

    if (folderId) {
      pdfs = await listAllPdfs(accessToken, folderId);
    }
  } catch (e) {
    if (e instanceof DriveSessionExpiredError) {
      error =
        "Your Google Drive session has expired. Please sign out and sign in again to continue.";
    } else {
      error =
        e instanceof Error ? e.message : "An error occurred while searching";
    }
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <AppNavbar />
      <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 pb-8 pt-24 sm:pt-28">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Google Drive Search</CardTitle>
            <CardDescription>
              Enter a Google Drive folder URL or ID to search for PDFs
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <DriveSearchForm initialId={folderId} error={error} />

            {folderId && !error && (
              <>
                <div className="border-b" />
                <CardDescription>{pdfs.length} PDF(s) found</CardDescription>
                {pdfs.length === 0 ? (
                  <p className="text-muted-foreground">
                    No PDFs found in this folder.
                  </p>
                ) : (
                  <DriveSearchTable pdfs={pdfs} />
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
