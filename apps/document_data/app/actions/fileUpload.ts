"use server";

import { auth } from "@/lib/auth";
import { uploadFileToBlob } from "@/lib/blob-upload";

const MAX_FILE_SIZE = 4.5 * 1024 * 1024;
const DOCUMENT_FIELD_NAME = "document";

export type UploadFormState = {
  status: "idle" | "success" | "error";
  documentId?: string;
  message?: string;
  pathname?: string;
  blobUrl?: string;
  fileName?: string;
};

function hasPdfExtension(fileName: string) {
  return fileName.trim().toLowerCase().endsWith(".pdf");
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
    const email = session.user.email ?? "anonymous";
    const { blobUrl, pathname, documentId } = await uploadFileToBlob(
      file,
      file.name,
      email,
    );

    return {
      status: "success",
      documentId,
      message: "PDF uploaded to Vercel Blob.",
      blobUrl,
      fileName: file.name,
      pathname,
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
