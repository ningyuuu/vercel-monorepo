import Airtable, { FieldSet, Table } from "airtable";

interface AirtableConfig {
  apiKey: string;
  baseId: string;
}

type Base = ReturnType<InstanceType<typeof Airtable>["base"]>;

// Higher-order functions: take base, return curried functions
export function viewTable(base: Base) {
  return async (tableId: string) => {
    const table = base.table(tableId) as Table<FieldSet>;
    const records = await table.select().all();
    return records.map((record) => ({
      id: record.id,
      fields: record.fields,
    }));
  };
}

export function addRow(base: Base) {
  return async (tableId: string, fields: Partial<FieldSet>) => {
    const table = base.table(tableId) as Table<FieldSet>;
    const records = await table.create([{ fields }]);
    return records[0];
  };
}

// Consumes base to return methods
export function createAirtableClient(config: AirtableConfig) {
  const airtable = new Airtable({ apiKey: config.apiKey });
  const base = airtable.base(config.baseId);

  return {
    viewTable: viewTable(base),
    addRow: addRow(base),
  };
}

export type { AirtableConfig, FieldSet };
