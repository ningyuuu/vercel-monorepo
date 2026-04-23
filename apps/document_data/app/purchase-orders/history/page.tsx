import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

import { AppNavbar } from "@/app/components/AppNavbar";
import {
  PURCHASE_ORDERS_HISTORY_ROUTE,
  PURCHASE_ORDERS_ROUTE,
  requirePageAccess,
} from "@/lib/auth";
import { type TaskListItem } from "@/lib/extract-po-items";

async function getTasks(): Promise<TaskListItem[]> {
  const baseUrl = process.env.LLM_API_BASE_URL?.trim();

  if (!baseUrl) {
    return [];
  }

  try {
    const response = await fetch(`${baseUrl}/tasks/extract_po_items`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as { tasks: TaskListItem[] };
    return data.tasks;
  } catch {
    return [];
  }
}

export default async function PurchaseOrdersHistoryPage() {
  await requirePageAccess(PURCHASE_ORDERS_HISTORY_ROUTE);

  const tasks = await getTasks();

  return (
    <div className="min-h-screen bg-background font-sans">
      <AppNavbar />
      <main className="flex min-h-screen justify-center px-6 pb-8 pt-24 sm:pt-28">
        <div className="mx-auto max-w-[1800px] w-full">
          <h1 className="mb-6 text-2xl font-semibold tracking-tight">
            Purchase Orders History
          </h1>
          {tasks.length === 0 ? (
            <p className="text-muted-foreground">No tasks found.</p>
          ) : (
            <div className="w-full overflow-x-hidden">
              <Table className="table-fixed w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32 sm:w-40">Task ID</TableHead>
                    <TableHead className="w-24">Status</TableHead>
                    <TableHead className="w-40 sm:w-48">Created At</TableHead>
                    <TableHead>Error</TableHead>
                    <TableHead className="w-20">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.task_id}>
                      <TableCell className="font-mono text-xs w-32 sm:w-40 break-words whitespace-normal">
                        {task.task_id}
                      </TableCell>
                      <TableCell className="w-24 break-words whitespace-normal">{task.status}</TableCell>
                      <TableCell className="w-40 sm:w-48 break-words whitespace-normal">
                        {new Date(task.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="max-w-xs sm:max-w-sm break-words whitespace-normal text-destructive">
                        {task.error ?? "-"}
                      </TableCell>
                      <TableCell className="w-20 break-words whitespace-normal">
                      {task.status === "completed" && task.result ? (
                          <Link
                            href={`${PURCHASE_ORDERS_ROUTE}/${encodeURIComponent(task.task_id)}`}
                            className="text-primary underline hover:underline"
                          >
                            View
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}