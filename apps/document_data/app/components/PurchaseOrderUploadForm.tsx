"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@repo/ui/button";
import { SingleFileDropzone } from "@repo/ui/shared/SingleFileDropzone";

import {
  uploadDocumentAction,
  type UploadFormState,
} from "@/app/actions/upload";
import {
  type ExtractPoItemsRequestBody,
  type ExtractPoItemsTaskAcceptedResponse,
} from "@/lib/extract-po-items";

const MAX_FILE_SIZE = 4.5 * 1024 * 1024;
const initialUploadFormState: UploadFormState = {
  status: "idle",
};

type ExtractPoItemsTaskErrorResponse = {
  error?: string;
};

function formatMaxFileSize(size: number) {
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function isExtractPoItemsTaskAcceptedResponse(
  value: ExtractPoItemsTaskAcceptedResponse | ExtractPoItemsTaskErrorResponse,
): value is ExtractPoItemsTaskAcceptedResponse {
  return "task_id" in value && "status" in value;
}

async function createExtractPoItemsTask(payload: ExtractPoItemsRequestBody) {
  const response = await fetch("/api/tasks/extract_po_items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = (await response.json()) as
    | ExtractPoItemsTaskAcceptedResponse
    | ExtractPoItemsTaskErrorResponse;

  return {
    ok: response.ok,
    data,
  };
}

export function PurchaseOrderUploadForm() {
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

      const blobUrl = nextState.blobUrl;
      const userLink = nextState.pathname ?? nextState.fileName ?? blobUrl;

      if (!blobUrl || !userLink) {
        setState({
          status: "error",
          message: "Upload finished but task setup data is missing.",
        });
        return;
      }

      const payload: ExtractPoItemsRequestBody = {
        user_link: userLink,
        blob_link: blobUrl,
        blob_type: "vercel",
      };
      const { ok, data } = await createExtractPoItemsTask(payload);

      if (!ok || !isExtractPoItemsTaskAcceptedResponse(data)) {
        setState({
          status: "error",
          message:
            (isExtractPoItemsTaskAcceptedResponse(data)
              ? undefined
              : data.error) ||
            "Unable to start purchase-order extraction task.",
        });
        return;
      }

      router.push(`/purchase-orders/${encodeURIComponent(data.task_id)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <SingleFileDropzone
        name="document"
        required
        disabled={isBusy}
        file={selectedFile}
        maxFileSize={MAX_FILE_SIZE}
        idleLabel="Drop a purchase-order PDF here"
        idleDescription={`Or click to browse. Only one PDF under ${formatMaxFileSize(MAX_FILE_SIZE)} is allowed.`}
        emptyMessage="No purchase-order PDF selected yet."
        invalidTypeMessage="Only PDF files are allowed."
        invalidSizeMessage={`File must be smaller than ${formatMaxFileSize(MAX_FILE_SIZE)}.`}
        multipleFilesMessage="Select a single PDF file."
        onFileSelect={handleFileSelect}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Files should be under {formatMaxFileSize(MAX_FILE_SIZE)}.
        </p>
        <Button
          type="submit"
          disabled={!selectedFile || isBusy}
          className="w-full sm:w-auto"
        >
          {isBusy ? "Processing..." : "Upload Purchase Order"}
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
