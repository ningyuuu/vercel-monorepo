export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
}

export async function listFolder(accessToken: string, folderId: string): Promise<DriveFile[]> {
  const params = new URLSearchParams({
    q: `'${folderId}' in parents`,
    fields: "files(id,name,mimeType)",
    supportsAllDrives: "true",
    includeItemsFromAllDrives: "true",
  });

  const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error(`Drive API error: ${res.status}`);
  }

  const data = await res.json();
  return data.files ?? [];
}

export async function listAllPdfs(accessToken: string, rootFolderId: string): Promise<DriveFile[]> {
  const queue: string[] = [rootFolderId];
  const pdfs: DriveFile[] = [];

  while (queue.length > 0) {
    const folderId = queue.shift()!;
    const files = await listFolder(accessToken, folderId);

    for (const file of files) {
      if (file.mimeType === "application/pdf") {
        pdfs.push(file);
      } else if (file.mimeType === "application/vnd.google-apps.folder") {
        queue.push(file.id);
      }
    }
  }

  return pdfs;
}