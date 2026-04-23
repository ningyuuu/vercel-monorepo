"use client";

import { useState, useRef, useEffect } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

export type Column = {
  key: string;
  label: string;
};

type EditableCellProps = {
  value: string;
  onSave: (newValue: string) => void;
  placeholder?: string;
};

function EditableCell({ value, onSave, placeholder = "-" }: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && spanRef.current) {
      spanRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editValue !== value) {
      onSave(editValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <span
        ref={spanRef as React.RefObject<HTMLSpanElement>}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        onInput={(e) => setEditValue(e.currentTarget.textContent || "")}
        className="inline outline-none"
      >
        {value}
      </span>
    );
  }

  return (
    <span onClick={() => setIsEditing(true)} className="inline cursor-pointer">
      {value || placeholder}
    </span>
  );
}

type EditableTableProps<T extends Record<string, unknown>> = {
  rows: T[];
  columns: Column[];
  keyField?: keyof T;
  onCellSave?: (rowIndex: number, column: string, newValue: string) => void;
  emptyMessage?: string;
};

export function EditableTable<T extends Record<string, unknown>>({
  rows,
  columns,
  keyField,
  onCellSave,
  emptyMessage = "No items found.",
}: EditableTableProps<T>) {
  const [editableRows, setEditableRows] = useState<T[]>([]);
  const [hasEdited, setHasEdited] = useState(false);

  useEffect(() => {
    if (!hasEdited) {
      setEditableRows(rows);
    }
  }, [rows, hasEdited]);

  const handleCellSave = (
    rowIndex: number,
    column: string,
    newValue: string,
  ) => {
    setEditableRows((prev) => {
      const updated = [...prev];
      updated[rowIndex] = { ...updated[rowIndex], [column]: newValue };
      return updated;
    });
    setHasEdited(true);
    onCellSave?.(rowIndex, column, newValue);
  };

  const displayRows = hasEdited ? editableRows : rows;

  if (displayRows.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key}>{column.label}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {displayRows.map((row, rowIndex) => {
          const key =
            keyField && row[keyField]
              ? String(row[keyField])
              : `${rowIndex}-${Object.values(row).join("-")}`;
          return (
            <TableRow key={key}>
              {columns.map((column) => (
                <TableCell
                  key={`${column.key}-${rowIndex}`}
                  className="whitespace-normal break-words"
                >
                  <EditableCell
                    value={String(row[column.key] ?? "")}
                    onSave={(newValue) =>
                      handleCellSave(rowIndex, column.key, newValue)
                    }
                    placeholder="-"
                  />
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
