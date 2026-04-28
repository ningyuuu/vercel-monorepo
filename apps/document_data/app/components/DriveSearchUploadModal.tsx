"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/dialog";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";

import {
  driveSearchUploadAction,
  type DriveSearchUploadState,
} from "@/app/actions/driveSearchUpload";
import {
  createExtractPoItemsTask,
  type ExtractPoItemsRequestBody,
} from "@/lib/extract-po-items";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: {
    id: string;
    name: string;
  } | null;
};

const initialState: DriveSearchUploadState = {
  status: "idle",
};

export function DriveSearchUploadModal({ open, onOpenChange, file }: Props) {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [state, setState] = useState<DriveSearchUploadState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (!file) return;

    setIsSubmitting(true);
    setState({ status: "idle" });

    try {
      const formData = new FormData();
      formData.set("fileId", file.id);
      formData.set("fileName", file.name);

      const uploadState = await driveSearchUploadAction(initialState, formData);

      if (uploadState.status !== "success") {
        setState(uploadState);
        return;
      }

      const blobUrl = uploadState.blobUrl;
      const userLink = notes || uploadState.fileName || blobUrl;

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
      const result = await createExtractPoItemsTask(payload);

      if (!result.ok) {
        setState({
          status: "error",
          message: result.error,
        });
        return;
      }

      router.push(`/purchase-orders/${encodeURIComponent(result.data.task_id)}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleOpenChange(newOpen: boolean) {
    if (!newOpen) {
      setNotes("");
      setState(initialState);
      setIsSubmitting(false);
    }
    onOpenChange(newOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload &amp; Extract PO</DialogTitle>
          <DialogDescription>
            Upload <strong>{file?.name}</strong> to start purchase order
            extraction.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <label htmlFor="notes" className="text-sm font-medium">
            Notes (optional)
          </label>
          <Input
            id="notes"
            placeholder="Add any notes for context..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        {state.status === "error" ? (
          <p className="text-sm text-destructive" role="alert">
            {state.message}
          </p>
        ) : null}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Upload & Extract"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
