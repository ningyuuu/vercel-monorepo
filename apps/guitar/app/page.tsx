import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";

export default function Home() {
  return (
    <div>
      <main>
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
