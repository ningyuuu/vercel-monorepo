"use client";

import { useState } from "react";
import { FileText, Upload, X } from "lucide-react";

import { cn } from "lib/utils";
import { Button } from "../ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadList,
  FileUploadTrigger,
} from "../ui/file-upload";

const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024;

export type SingleFileDropzoneProps = {
  accept?: string;
  maxFileSize?: number;
  idleLabel?: string;
  idleDescription?: string;
  emptyMessage?: string;
  invalidTypeMessage?: string;
  invalidSizeMessage?: string;
  multipleFilesMessage?: string;
  className?: string;
  onFileSelect?: (file: File | null) => void;
};

function formatFileSize(size: number) {
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

function matchesAccept(file: File, accept: string) {
  const rules = accept
    .split(",")
    .map((rule) => rule.trim().toLowerCase())
    .filter(Boolean);

  if (rules.length === 0) {
    return true;
  }

  const lowerFileName = file.name.toLowerCase();
  const lowerFileType = file.type.toLowerCase();

  return rules.some((rule) => {
    if (rule.startsWith(".")) {
      return lowerFileName.endsWith(rule);
    }

    if (rule.endsWith("/*")) {
      const prefix = rule.slice(0, -1);
      return lowerFileType.startsWith(prefix);
    }

    return lowerFileType === rule;
  });
}

function normalizeRejectMessage(
  message: string,
  invalidTypeMessage: string,
  invalidSizeMessage: string,
  multipleFilesMessage: string,
) {
  if (message === "File type not accepted") {
    return invalidTypeMessage;
  }

  if (message === "File too large") {
    return invalidSizeMessage;
  }

  if (message.startsWith("Maximum ")) {
    return multipleFilesMessage;
  }

  return message;
}

export function SingleFileDropzone({
  accept = "application/pdf,.pdf",
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  idleLabel = "Drop a file here",
  idleDescription = "Or click to browse.",
  emptyMessage = "No file uploaded yet.",
  invalidTypeMessage = "This file type is not allowed.",
  invalidSizeMessage = "File is too large.",
  multipleFilesMessage = "Select a single file.",
  className,
  onFileSelect,
}: SingleFileDropzoneProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const selectedFile = files[0] ?? null;

  const handleValueChange = (nextFiles: File[]) => {
    if (nextFiles.length > 1) {
      setError(multipleFilesMessage);
      return;
    }

    const replacementFile = nextFiles[0] ?? null;

    setFiles(replacementFile ? [replacementFile] : []);
    setError(null);
    onFileSelect?.(replacementFile);
  };

  const handleFileValidate = (file: File) => {
    if (!matchesAccept(file, accept)) {
      return invalidTypeMessage;
    }

    if (file.size > maxFileSize) {
      return invalidSizeMessage;
    }

    return null;
  };

  const handleFileReject = (_file: File, message: string) => {
    setError(
      normalizeRejectMessage(
        message,
        invalidTypeMessage,
        invalidSizeMessage,
        multipleFilesMessage,
      ),
    );

    if (!selectedFile) {
      onFileSelect?.(null);
    }
  };

  return (
    <FileUpload
      value={files}
      onValueChange={handleValueChange}
      onFileValidate={handleFileValidate}
      onFileReject={handleFileReject}
      accept={accept}
      maxSize={maxFileSize}
      multiple={false}
      label={idleLabel}
      className={cn("space-y-4", className)}
    >
      <FileUploadDropzone
        className={cn(
          "min-h-56 rounded-xl border px-6 py-10 text-center transition-colors data-[dragging]:border-foreground data-[dragging]:bg-muted hover:border-foreground/40 hover:bg-muted/50",
        )}
        aria-label="Upload a file"
      >
        <div className="mb-4 rounded-full border border-border bg-background p-3">
          <Upload className="size-5" />
        </div>
        <p className="text-base font-medium">{idleLabel}</p>
        <p className="mt-2 text-sm text-muted-foreground">{idleDescription}</p>
        <FileUploadTrigger asChild>
          <Button type="button" variant="outline" className="mt-5">
            Choose file
          </Button>
        </FileUploadTrigger>
      </FileUploadDropzone>

      {selectedFile ? (
        <FileUploadList>
          <FileUploadItem
            value={selectedFile}
            className="justify-between rounded-xl bg-muted/40 px-4 py-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="rounded-lg bg-background p-2">
                <FileText className="size-4" />
              </div>
              <FileUploadItemMetadata>
                <p className="truncate text-sm font-medium">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </FileUploadItemMetadata>
            </div>
            <FileUploadItemDelete asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Remove selected file"
              >
                <X className="size-4" />
              </Button>
            </FileUploadItemDelete>
          </FileUploadItem>
        </FileUploadList>
      ) : null}

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      )}
    </FileUpload>
  );
}
