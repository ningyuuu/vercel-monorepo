import { createAirtableClient, FieldSet } from "@repo/airtable";
import { COLUMN_MAPPING } from "./column-mapping";

export function getAirtableConfig() {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableId = process.env.AIRTABLE_TABLE_ID;
  console.log(
    `Airtable environment variables: ${apiKey}, ${baseId}, and ${tableId}.`,
  );

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

  // Transform data keys to Airtable column names
  const transformedData = data.map((row) => {
    const transformed: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(row)) {
      const airtableKey = COLUMN_MAPPING[key] || key;
      transformed[airtableKey] = value;
    }
    return transformed;
  });

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

  // Upload data and collate errors
  const errors: string[] = [];
  let uploaded = 0;

  for (const row of transformedData) {
    try {
      await client.addRow(tableId, row as Partial<FieldSet>);
      uploaded++;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`Failed to upload row: ${message}`);
    }
  }

  return { success: errors.length === 0, uploaded, errors };
}
