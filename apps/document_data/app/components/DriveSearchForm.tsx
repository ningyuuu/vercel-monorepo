"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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

export function DriveSearchForm() {
  const router = useRouter();
  const [folderId, setFolderId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const extractedId = extractFolderId(folderId);
    if (!extractedId) return;

    setIsSubmitting(true);
    router.push(`/purchase-orders/drive-search?folderId=${encodeURIComponent(extractedId)}`);
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
      <Button type="submit" disabled={!folderId.trim() || isSubmitting}>
        {isSubmitting ? "Searching..." : "Search"}
      </Button>
    </form>
  );
}