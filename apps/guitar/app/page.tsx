import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen items-start justify-center bg-background font-sans">
      <main className="w-full max-w-4xl bg-transparent px-6 pb-8 pt-20 space-y-4 sm:pt-24">
        <Card>
          <CardHeader>
            <CardTitle>Guitar</CardTitle>
            <CardDescription>Welcome to the Guitar app!</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Your guitar journey starts here.</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
