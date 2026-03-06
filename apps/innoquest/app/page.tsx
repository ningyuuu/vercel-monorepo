import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

const mockProjects = [
  {
    code: "INQ-101",
    full_name: "Customer Onboarding Workflow Revamp",
    cost: "$12,500",
    test_contents: "Unit tests, integration tests",
  },
  {
    code: "INQ-102",
    full_name: "Idea Prioritization Engine",
    cost: "$8,900",
    test_contents: "Smoke tests, regression tests",
  },
  {
    code: "INQ-103",
    full_name: "Weekly Feedback Digest Automation",
    cost: "$6,300",
    test_contents: "E2E tests, accessibility checks",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen items-start justify-center bg-background font-sans">
      <main className="w-full max-w-4xl py-20 px-6 bg-transparent space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">Innoquest</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Test Contents</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockProjects.map((project) => (
              <TableRow key={project.code}>
                <TableCell className="font-medium">{project.code}</TableCell>
                <TableCell>{project.full_name}</TableCell>
                <TableCell>{project.cost}</TableCell>
                <TableCell>{project.test_contents}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </div>
  );
}
