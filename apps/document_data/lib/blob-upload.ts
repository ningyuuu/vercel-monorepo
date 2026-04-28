import { put } from "@vercel/blob";

function sanitizePathSegment(value: string) {
  const sanitized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return sanitized || "file";
}

function buildBlobPath(
  fileName: string,
  documentId: string,
  userEmail: string,
) {
  const datePrefix = new Date().toISOString().slice(0, 10);
  const safeEmail = sanitizePathSegment(userEmail);
  const safeFileName = sanitizePathSegment(fileName);

  return `document-data/${datePrefix}/${safeEmail}/${documentId}-${safeFileName}`;
}

export async function uploadFileToBlob(
  file: File,
  fileName: string,
  userEmail: string,
): Promise<{ blobUrl: string; pathname: string; documentId: string }> {
  const documentId = crypto.randomUUID();
  const blob = await put(
    buildBlobPath(fileName, documentId, userEmail),
    file,
    {
      access: "private",
      addRandomSuffix: false,
      contentType: file.type || "application/pdf",
    },
  );

  return { blobUrl: blob.url, pathname: blob.pathname, documentId };
}
