"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";

function extractFolderId(input: string): string | null {
  const trimmed = input.trim();

  if (!trimmed) return null;

  const urlMatch = trimmed.match(
    /(?:drive\.google\.com\/drive\/folders\/|drive\.google\.com\/open\?id=)([a-zA-Z0-9_-]+)/,
  );
  if (urlMatch) {
    return urlMatch[1];
  }

  if (trimmed.length >= 20 && !trimmed.includes("/")) {
    return trimmed;
  }

  return null;
}

interface Props {
  initialId?: string;
  error?: string | null;
}

export function DriveSearchForm({ initialId: id, error }: Props) {
  const router = useRouter();
  const [folderId, setFolderId] = useState(id ?? "");

  useEffect(() => {
    if (!id) {
      const saved = localStorage.getItem("document_data:last_drive_search");
      // loading without useEffect will cause a hydration mismatch
      // further optimization would be useSyncExternalStore
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setFolderId(saved);
    }
  }, [id]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const extractedId = extractFolderId(folderId);
    if (!extractedId) return;

    localStorage.setItem("document_data:last_drive_search", folderId);

    router.push(
      `/purchase-orders/drive-search?folderId=${encodeURIComponent(extractedId)}`,
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        name="folderId"
        placeholder="Enter Google Drive folder URL or ID"
        value={folderId}
        onChange={(e) => setFolderId(e.target.value)}
        required
      />
      <Button type="submit" disabled={!folderId.trim()}>
        {id ? "Search Again" : "Search"}
      </Button>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
