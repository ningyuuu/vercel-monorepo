import { ThemeToggle } from "@repo/ui/shared/ThemeToggle";
import { Navbar } from "@repo/ui/shared/Navbar";
import { FileDropzone } from "@repo/ui/shared/FileDropzone";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar
        title="Document Data Extractor"
        actions={<ThemeToggle className="static right-auto top-auto z-auto" />}
      />
      <main className="flex min-h-screen items-center justify-center px-6 pb-8 pt-24 sm:pt-28">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Document Data</CardTitle>
            <CardDescription>
              Drop in a single PDF file to prepare it for extraction.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileDropzone
              idleLabel="Drop a PDF here"
              idleDescription="Or click to browse. Only one PDF under 10 MB is allowed."
              invalidTypeMessage="Only PDF files are allowed."
              invalidSizeMessage="File must be smaller than 10 MB."
              multipleFilesMessage="Select a single PDF file."
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
