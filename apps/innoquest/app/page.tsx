import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";
import { getTableData } from "@/lib/catalog";

export default async function Home() {
  const tableData = await getTableData();

  return (
    <div className="flex min-h-screen items-start justify-center bg-background font-sans">
      <main className="w-full max-w-4xl py-20 px-6 bg-transparent space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">
          Innoquest Test Profiles
        </h1>
        <Table className="w-full table-fixed">
          <caption className="text-muted-foreground mt-4 text-sm">
            {tableData.length} records loaded from records.
          </caption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Code</TableHead>
              <TableHead className="w-[200px] whitespace-normal">
                Full Name
              </TableHead>
              <TableHead className="w-[110px]">Cost</TableHead>
              <TableHead className="whitespace-normal">Test Contents</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((project) => (
              <TableRow key={project.code}>
                <TableCell className="font-medium">{project.code}</TableCell>
                <TableCell className="whitespace-normal break-words">
                  {project.full_name}
                </TableCell>
                <TableCell>{project.cost}</TableCell>
                <TableCell className="whitespace-normal break-words">
                  {project.test_contents}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </div>
  );
}
