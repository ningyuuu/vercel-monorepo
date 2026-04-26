import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { listAllPdfs } from "@repo/google-drive";
import { getToken } from "next-auth/jwt";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { AppNavbar } from "@/app/components/AppNavbar";
import { DriveSearchForm } from "@/app/components/DriveSearchForm";
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
    const headersList = await headers();
    const token = await getToken({
      req: { headers: headersList },
      secret: process.env.AUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
    });
    const accessToken = token?.accessToken as string | undefined;

    if (!accessToken) {
      const session = await auth();
      throw new Error(
        `No accessToken found. Session: ${JSON.stringify(session?.user)}. Please sign in again.`,
      );
    }

    if (folderId) {
      pdfs = await listAllPdfs(accessToken, folderId);
    }
  } catch (e) {
    error =
      e instanceof Error ? e.message : "An error occurred while searching";
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
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead className="text-right">View</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pdfs.map((pdf) => (
                        <TableRow key={pdf.id}>
                          <TableCell className="font-medium">
                            {pdf.name}
                          </TableCell>
                          <TableCell className="text-right">
                            <a
                              href={`https://drive.google.com/file/d/${pdf.id}/view`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline hover:text-blue-800"
                            >
                              View
                            </a>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
