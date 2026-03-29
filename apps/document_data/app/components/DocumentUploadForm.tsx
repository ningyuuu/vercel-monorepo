"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@repo/ui/button";
import { SingleFileDropzone } from "@repo/ui/shared/SingleFileDropzone";

import {
  uploadDocumentAction,
  type UploadFormState,
} from "@/app/actions/upload";
import { saveUploadState } from "@/lib/document-upload-store";

const MAX_FILE_SIZE = 4.5 * 1024 * 1024;
const initialUploadFormState: UploadFormState = {
  status: "idle",
};

function formatMaxFileSize(size: number) {
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentUploadForm() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [state, setState] = useState<UploadFormState>(initialUploadFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isBusy = isSubmitting;

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    setState(initialUploadFormState);
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);

    try {
      const nextState = await uploadDocumentAction(
        initialUploadFormState,
        formData,
      );

      setState(nextState);

      if (nextState.status !== "success") {
        return;
      }

      setSelectedFile(null);

      if (!nextState.documentId) {
        return;
      }

      saveUploadState(nextState);
      router.push(`/document/${encodeURIComponent(nextState.documentId)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      <SingleFileDropzone
        name="document"
        required
        disabled={isBusy}
        file={selectedFile}
        maxFileSize={MAX_FILE_SIZE}
        idleLabel="Drop a PDF here"
        idleDescription={`Or click to browse. Only one PDF under ${formatMaxFileSize(MAX_FILE_SIZE)} is allowed.`}
        emptyMessage="No PDF selected yet."
        invalidTypeMessage="Only PDF files are allowed."
        invalidSizeMessage={`File must be smaller than ${formatMaxFileSize(MAX_FILE_SIZE)}.`}
        multipleFilesMessage="Select a single PDF file."
        onFileSelect={handleFileSelect}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Submit uploads the PDF to a private Vercel Blob object, starts the
          summary task, and polls for the result. Keep files under{" "}
          {formatMaxFileSize(MAX_FILE_SIZE)} for Vercel server uploads.
        </p>
        <Button
          type="submit"
          disabled={!selectedFile || isBusy}
          className="w-full sm:w-auto"
        >
          {isBusy ? "Processing..." : "Upload PDF"}
        </Button>
      </div>

      {state.status === "error" ? (
        <p className="text-sm text-destructive" role="alert">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
