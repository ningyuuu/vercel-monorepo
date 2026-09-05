import { readFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "csv-parse/sync";

export type TableRowData = {
  code: string;
  full_name: string;
  cost: string;
  test_contents: string;
  test_items: string[];
  type: "Profile" | "Single Test" | "Single Allergy";
  remarks: string;
};

function normalizeTestItem(value: string) {
  const compact = value
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s*\/\s*/g, "/")
    .replace(/\s*,\s*/g, ", ")
    .trim();

  return compact;
}

function getItemDedupKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function parseTestItems(rawContents: string) {
  const items = rawContents
    .split(/\r?\n/)
    .map((value) => normalizeTestItem(value))
    .filter(Boolean);

  const deduped: string[] = [];
  const seen = new Set<string>();

  for (const item of items) {
    const key = getItemDedupKey(item);
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    deduped.push(item);
  }

  return deduped;
}

function parseCsv(content: string) {
  return parse(content, {
    bom: true,
    relax_column_count: true,
    skip_empty_lines: true,
  }) as string[][];
}

export async function getTableData(): Promise<TableRowData[]> {
  const filePath = path.join(process.cwd(), "lib", "data.csv");
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
  const typeIndex = normalizedHeader.indexOf("type");

  if (
    codeIndex === -1 ||
    costIndex === -1 ||
    fullNameIndex === -1 ||
    contentsIndex === -1 ||
    typeIndex === -1
  ) {
    return [];
  }

  return records
    .filter((record) => record.some((field) => field.trim().length > 0))
    .map((record) => {
      const testItems = parseTestItems(record[contentsIndex] ?? "");

      return {
        code: (record[codeIndex] ?? "").trim(),
        full_name: (record[fullNameIndex] ?? "").trim(),
        cost: (record[costIndex] ?? "").trim(),
        test_contents: testItems.join(", "),
        test_items: testItems,
        type: (record[typeIndex] ?? "").trim() as TableRowData["type"],
        remarks: (record[normalizedHeader.indexOf("remarks")] ?? "").trim(),
      };
    });
}
