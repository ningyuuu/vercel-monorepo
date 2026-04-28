"use client";

import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";
import { Button } from "@repo/ui/button";
import { Upload } from "lucide-react";

import { DriveSearchUploadModal } from "./DriveSearchUploadModal";

type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
};

type Props = {
  pdfs: DriveFile[];
};

export function DriveSearchTable({ pdfs }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null);

  function handleUploadClick(file: DriveFile) {
    setSelectedFile(file);
    setModalOpen(true);
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pdfs.map((pdf) => (
            <TableRow key={pdf.id}>
              <TableCell className="font-medium">{pdf.name}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <a
                    href={`https://drive.google.com/file/d/${pdf.id}/view`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 underline hover:text-blue-800"
                  >
                    View
                  </a>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUploadClick(pdf)}
                  >
                    <Upload className="mr-1 h-4 w-4" />
                    Upload
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DriveSearchUploadModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        file={selectedFile}
      />
    </>
  );
}