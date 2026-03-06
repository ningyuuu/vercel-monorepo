import { getTableData } from "@/lib/catalog";
import { ProfilesTable } from "@/components/ProfilesTable";

export default async function Home() {
  const tableData = await getTableData();

  return (
    <div className="flex min-h-screen items-start justify-center bg-background font-sans">
      <main className="w-full max-w-4xl py-20 px-6 bg-transparent space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">
          Innoquest Test Profiles
        </h1>
        <ProfilesTable data={tableData} />
      </main>
    </div>
  );
}
