import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Document Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Placeholder page for document upload and data extraction.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
