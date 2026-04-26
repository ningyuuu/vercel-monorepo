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