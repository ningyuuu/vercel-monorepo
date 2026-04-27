import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Navbar } from "@repo/ui/shared/Navbar";
import { ThemeToggle } from "@repo/ui/shared/ThemeToggle";
import Link from "next/link";

import { LOGIN_ROUTE, requirePageAccess } from "@/lib/auth";
import { signInWithGoogle } from "@/app/actions/auth";

const isGoogleAuthConfigured = Boolean(
  process.env.AUTH_GOOGLE_ID &&
  process.env.AUTH_GOOGLE_SECRET &&
  process.env.AUTH_SECRET,
);

export default async function LoginPage() {
  await requirePageAccess(LOGIN_ROUTE);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar
        title="Document Data Extractor"
        actions={<ThemeToggle className="static right-auto top-auto z-auto" />}
      />
      <main className="flex min-h-screen items-center justify-center px-6 pb-8 pt-24 sm:pt-28">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Document Data Suite</CardTitle>
            <CardDescription>
              Extract structured data from PDF documents using AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This app helps you automatically extract line items from purchase
              orders and quotation PDFs. Sign in with Google to upload PDFs or
              search your Google Drive folder.
            </p>
            <form action={signInWithGoogle}>
              <Button className="w-full" size="lg" type="submit">
                Continue with Google
              </Button>
            </form>
            {!isGoogleAuthConfigured ? (
              <p className="text-sm text-muted-foreground">
                Google OAuth is not configured yet. Set AUTH_SECRET,
                AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, and optionally
                AUTH_ALLOWED_EMAILS in your local env file.
              </p>
            ) : null}
            
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
