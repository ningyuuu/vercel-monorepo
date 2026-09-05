import { getTableData } from "@/lib/catalog";
import { InnoquestHome } from "@/components/InnoquestHome";
import testItems from "@/lib/test-items.json";
import { Badge } from "@repo/ui/badge";
import { Navbar } from "@/components/Navbar";
import { ThemeToggle } from "@repo/ui/shared/ThemeToggle";

export default async function Home() {
  const tableData = await getTableData();
  const profileCount = tableData.filter((row) => row.type === "Profile").length;
  const individualTestCount = new Set([
    ...testItems.profiles,
    ...testItems.single,
  ]).size;

  return (
    <div className="flex min-h-screen items-start justify-center bg-background font-sans">
      <main className="w-full max-w-4xl bg-transparent px-6 pb-8 pt-20 sm:pt-24">
        <Navbar
          title="Innoquest - 2026 Test Profiles"
          actions={
            <>
              <Badge
                variant="secondary"
                className="hidden shrink-0 sm:inline-flex"
              >
                {profileCount} profiles, {individualTestCount} individual tests
              </Badge>
              <ThemeToggle className="static right-auto top-auto z-auto" />
            </>
          }
        />
        <header className="mt-10 mb-8 sm:mt-14">
          <h1 className="font-display text-4xl font-semibold tracking-[-0.02em] text-balance sm:text-5xl">
            Innoquest <span className="text-primary">2026</span> Test Menu
          </h1>
        </header>
        <InnoquestHome data={tableData} testOptions={testItems} />
      </main>
    </div>
  );
}
