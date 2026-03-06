import { getTableData } from "@/lib/catalog";
import { ProfilesTable } from "@/components/ProfilesTable";
import testItems from "@/lib/test-items.json";
import { Badge } from "@repo/ui/badge";
import { Navbar } from "@repo/ui/shared/Navbar";
import { ThemeToggle } from "@repo/ui/shared/ThemeToggle";

export default async function Home() {
  const tableData = await getTableData();

  return (
    <div className="flex min-h-screen items-start justify-center bg-background font-sans">
      <main className="w-full max-w-4xl bg-transparent px-6 pb-8 pt-24 space-y-4 sm:pt-28">
        <Navbar
          title="Innoquest - 2026 Test Profiles"
          actions={
            <>
              <Badge
                variant="secondary"
                className="hidden shrink-0 sm:inline-flex"
              >
                {tableData.length} profiles
              </Badge>
              <ThemeToggle className="static right-auto top-auto z-auto" />
            </>
          }
        />
        <ProfilesTable data={tableData} testOptions={testItems} />
      </main>
    </div>
  );
}
