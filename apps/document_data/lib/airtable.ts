import { createAirtableClient, FieldSet } from "@repo/airtable";
type ColumnType = "string" | "number";

type ColumnConfig = {
  displayName: string;
  type: ColumnType;
};

export const PURCHASE_ORDER_COLUMNS: Record<string, ColumnConfig> = {
  name: { displayName: "Name", type: "string" },
  unit_cost: { displayName: "Unit Cost", type: "number" },
  qty_count: { displayName: "Qty Count", type: "number" },
  unit_type: { displayName: "Unit Type", type: "string" },
  remarks: { displayName: "Remarks", type: "string" },
};

function convertColumn(value: unknown, type: ColumnType): string | number {
  if (value === undefined || value === null) {
    throw new Error("value is empty");
  }

  if (type === "number") {
    if (typeof value === "number") {
      return value;
    }
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed === "") {
        throw new Error("value is empty");
      }
      const parsed = Number(trimmed);
      if (Number.isNaN(parsed)) {
        throw new Error(`cannot convert "${value}" to number`);
      }
      return parsed;
    }
    throw new Error(`cannot convert ${typeof value} to number`);
  }

  return String(value);
}

function getAirtableConfig() {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableId = process.env.AIRTABLE_TABLE_ID;

  if (!apiKey || !baseId || !tableId) {
    throw new Error(
      "Missing required Airtable environment variables: AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_ID",
    );
  }

  return { apiKey, baseId, tableId };
}

async function getExistingFields(
  client: ReturnType<typeof createAirtableClient>,
  tableId: string,
): Promise<Set<string>> {
  const records = await client.viewTable(tableId);
  const fields = new Set<string>();

  for (const record of records) {
    for (const field of Object.keys(record.fields)) {
      fields.add(field);
    }
  }

  return fields;
}

export async function uploadToAirtable(
  data: Record<string, unknown>[],
): Promise<{ success: boolean; uploaded: number; errors: string[] }> {
  const { apiKey, baseId, tableId } = getAirtableConfig();
  const client = createAirtableClient({ apiKey, baseId });

  const errors: string[] = [];
  const transformedData: Record<string, unknown>[] = [];
  let rowIndex = 0;

  for (const row of data) {
    rowIndex++;
    const transformed: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(row)) {
      const config = PURCHASE_ORDER_COLUMNS[key];

      if (!config) {
        errors.push(
          `Row ${rowIndex}: Unknown field "${key}" - field must be one of: ${Object.keys(PURCHASE_ORDER_COLUMNS).join(", ")}`,
        );
        continue;
      }

      const displayName = config.displayName;

      try {
        transformed[displayName] = convertColumn(value, config.type);
      } catch (e) {
        errors.push(
          `Row ${rowIndex}: ${displayName} - ${e instanceof Error ? e.message : String(e)}`,
        );
        continue;
      }
    }
    transformedData.push(transformed);
  }

  if (errors.length > 0) {
    return { success: false, uploaded: 0, errors };
  }

  const dataFields = new Set<string>();
  for (const row of transformedData) {
    for (const key of Object.keys(row)) {
      dataFields.add(key);
    }
  }

  const existingFields = await getExistingFields(client, tableId);

  if (existingFields.size > 0) {
    const missingFields = Array.from(dataFields).filter(
      (field) => !existingFields.has(field),
    );

    if (missingFields.length > 0) {
      console.warn(
        `The following fields may not exist in Airtable: ${missingFields.join(", ")}`,
      );
    }
  } else {
    console.warn(
      `No existing records found, cannot verify columns. Proceeding with upload.`,
    );
  }

  let uploaded = 0;
  const uploadErrors: string[] = [];

  for (const row of transformedData) {
    try {
      await client.addRow(tableId, row as Partial<FieldSet>);
      uploaded++;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      uploadErrors.push(`Failed to upload row: ${message}`);
    }
  }

  return { success: uploadErrors.length === 0, uploaded, errors: uploadErrors };
}
