import { readFile } from "node:fs/promises";
import path from "node:path";

export type TableRowData = {
  code: string;
  full_name: string;
  cost: string;
  test_contents: string;
};

function parseCsv(content: string) {
  const rows: string[][] = [];
  let currentField = "";
  let currentRow: string[] = [];
  let inQuotes = false;

  for (let index = 0; index < content.length; index++) {
    const char = content[index];
    const nextChar = content[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        index++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      currentRow.push(currentField);
      currentField = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        index++;
      }

      currentRow.push(currentField);
      currentField = "";

      if (currentRow.some((field) => field.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      continue;
    }

    currentField += char;
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  return rows;
}

export async function getTableData(): Promise<TableRowData[]> {
  const filePath = path.join(process.cwd(), "app", "data.csv");
  const csv = await readFile(filePath, "utf-8");
  const rows = parseCsv(csv);

  const [header, ...records] = rows;

  if (!header) {
    return [];
  }

  const normalizedHeader = header.map((field) =>
    field
      .replace(/^\uFEFF/, "")
      .trim()
      .toLowerCase(),
  );

  const codeIndex = normalizedHeader.indexOf("code");
  const costIndex = normalizedHeader.indexOf("cost");
  const fullNameIndex = normalizedHeader.indexOf("full name");
  const contentsIndex = normalizedHeader.indexOf("contents");

  if (
    codeIndex === -1 ||
    costIndex === -1 ||
    fullNameIndex === -1 ||
    contentsIndex === -1
  ) {
    return [];
  }

  return records
    .filter((record) => record.some((field) => field.trim().length > 0))
    .map((record) => ({
      code: (record[codeIndex] ?? "").trim(),
      full_name: (record[fullNameIndex] ?? "").trim(),
      cost: (record[costIndex] ?? "").trim(),
      test_contents: (record[contentsIndex] ?? "")
        .replaceAll("\n", ", ")
        .trim(),
    }));
}
