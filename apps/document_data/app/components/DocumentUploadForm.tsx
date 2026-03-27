"use client";

import { useState, useTransition } from "react";

import { Button } from "@repo/ui/button";
import { SingleFileDropzone } from "@repo/ui/shared/SingleFileDropzone";

import {
  uploadDocumentAction,
  type UploadFormState,
} from "@/app/actions/upload";

const MAX_FILE_SIZE = 4.5 * 1024 * 1024;
const initialUploadFormState: UploadFormState = {
  status: "idle",
};

function formatMaxFileSize(size: number) {
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentUploadForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [state, setState] = useState<UploadFormState>(initialUploadFormState);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      void (async () => {
        const nextState = await uploadDocumentAction(state, formData);

        setState(nextState);

        if (nextState.status !== "success") {
          return;
        }

        setSelectedFile(null);
      })();
    });
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      <SingleFileDropzone
        name="document"
        required
        disabled={isPending}
        file={selectedFile}
        maxFileSize={MAX_FILE_SIZE}
        idleLabel="Drop a PDF here"
        idleDescription={`Or click to browse. Only one PDF under ${formatMaxFileSize(MAX_FILE_SIZE)} is allowed.`}
        emptyMessage="No PDF selected yet."
        invalidTypeMessage="Only PDF files are allowed."
        invalidSizeMessage={`File must be smaller than ${formatMaxFileSize(MAX_FILE_SIZE)}.`}
        multipleFilesMessage="Select a single PDF file."
        onFileSelect={setSelectedFile}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Submit uploads the PDF to a private Vercel Blob object. Keep files
          under {formatMaxFileSize(MAX_FILE_SIZE)} for Vercel server uploads.
        </p>
        <Button
          type="submit"
          disabled={!selectedFile || isPending}
          className="w-full sm:w-auto"
        >
          {isPending ? "Uploading..." : "Upload PDF"}
        </Button>
      </div>

      {state.status === "error" ? (
        <p className="text-sm text-destructive" role="alert">
          {state.message}
        </p>
      ) : null}

      {state.status === "success" ? (
        <div className="rounded-xl border border-border bg-muted/40 px-4 py-3">
          <p className="text-sm font-medium">{state.message}</p>
          {state.pathname ? (
            <p className="mt-1 break-all text-sm text-muted-foreground">
              Stored at {state.pathname}
            </p>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
