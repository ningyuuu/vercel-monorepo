"use server";

import { auth } from "@/lib/auth";
import { uploadFileToBlob } from "@/lib/blob-upload";

export type DriveSearchUploadState = {
  status: "idle" | "success" | "error";
  blobUrl?: string;
  fileName?: string;
  message?: string;
};

export async function driveSearchUploadAction(
  _previousState: DriveSearchUploadState,
  formData: FormData,
): Promise<DriveSearchUploadState> {
  const session = await auth();

  if (!session?.user) {
    return {
      status: "error",
      message: "You must be signed in to upload a document.",
    };
  }

  if (!session.accessToken) {
    return {
      status: "error",
      message: "No Google Drive access token. Please sign in again.",
    };
  }

  const email = session.user.email?.trim().toLowerCase();

  if (!email) {
    return {
      status: "error",
      message: "Authenticated user is missing an email address.",
    };
  }

  const fileId = formData.get("fileId") as string | null;
  const fileName = formData.get("fileName") as string | null;

  if (!fileId || !fileName) {
    return {
      status: "error",
      message: "Missing file information.",
    };
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return {
      status: "error",
      message: "Missing BLOB_READ_WRITE_TOKEN.",
    };
  }

  const accessToken = session.accessToken;

  const downloadResponse = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&supportsAllDrives=true`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!downloadResponse.ok) {
    return {
      status: "error",
      message: `Failed to download file from Google Drive: ${downloadResponse.status}`,
    };
  }

  const fileBuffer = await downloadResponse.arrayBuffer();
  const fileSize = fileBuffer.byteLength;

  if (fileSize === 0) {
    return {
      status: "error",
      message: "The selected PDF is empty.",
    };
  }

  const maxSize = 4.5 * 1024 * 1024;
  if (fileSize > maxSize) {
    return {
      status: "error",
      message: "File must be smaller than 4.5 MB.",
    };
  }

  const blobFile = new File([fileBuffer], fileName, {
    type: "application/pdf",
  });

  try {
    const { blobUrl } = await uploadFileToBlob(blobFile, fileName, email);

    return {
      status: "success",
      blobUrl,
      fileName,
    };
  } catch (error) {
    console.error("Failed to upload document to Vercel Blob", error);
    return {
      status: "error",
      message: "Upload to blob storage failed.",
    };
  }
}
