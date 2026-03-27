"use server";

import { put } from "@vercel/blob";

import { auth } from "@/lib/auth";

const MAX_FILE_SIZE = 4.5 * 1024 * 1024;
const DOCUMENT_FIELD_NAME = "document";

export type UploadFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  pathname?: string;
};

function hasPdfExtension(fileName: string) {
  return fileName.trim().toLowerCase().endsWith(".pdf");
}

function sanitizePathSegment(value: string) {
  const sanitized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return sanitized || "file";
}

function buildBlobPath(fileName: string, userEmail?: string | null) {
  const datePrefix = new Date().toISOString().slice(0, 10);
  const safeEmail = sanitizePathSegment(userEmail ?? "anonymous");
  const safeFileName = sanitizePathSegment(fileName);

  return `document-data/${datePrefix}/${safeEmail}/${crypto.randomUUID()}-${safeFileName}`;
}

export async function uploadDocumentAction(
  _previousState: UploadFormState,
  formData: FormData,
): Promise<UploadFormState> {
  const session = await auth();

  if (!session?.user) {
    return {
      status: "error",
      message: "You must be signed in to upload a document.",
    };
  }

  const file = formData.get(DOCUMENT_FIELD_NAME);

  if (!(file instanceof File)) {
    return {
      status: "error",
      message: "Choose a PDF file before submitting.",
    };
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return {
      status: "error",
      message:
        "Missing BLOB_READ_WRITE_TOKEN. Add your Vercel Blob secret and try again.",
    };
  }

  if (
    !hasPdfExtension(file.name) ||
    (file.type && file.type !== "application/pdf")
  ) {
    return {
      status: "error",
      message: "Only PDF files can be uploaded.",
    };
  }

  if (file.size === 0) {
    return {
      status: "error",
      message: "The selected PDF is empty.",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      status: "error",
      message: "File must be smaller than 4.5 MB for server uploads on Vercel.",
    };
  }

  try {
    const blob = await put(buildBlobPath(file.name, session.user.email), file, {
      access: "private",
      addRandomSuffix: false,
      contentType: file.type || "application/pdf",
    });

    return {
      status: "success",
      message: "PDF uploaded to Vercel Blob.",
      pathname: blob.pathname,
    };
  } catch (error) {
    console.error("Failed to upload document to Vercel Blob", error);

    return {
      status: "error",
      message:
        "Upload failed. Verify the Blob token and storage permissions, then try again.",
    };
  }
}
