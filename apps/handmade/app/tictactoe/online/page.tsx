import { FirebaseAdminClient } from "@/app/lib/firebase-admin";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { redirect } from "next/navigation";

export default function Home() {
  async function createRoom(id: string) {
    "use server";
    const client = new FirebaseAdminClient();
    await client.createRoom(id);
    redirect(`/tictactoe/online/${id}`);
  }

  return (
    <div className="min-h-screen">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-12">
        <Card>
          <CardHeader className="items-center text-left">
            <CardTitle className="text-3xl">Online</CardTitle>
            <p className="text-muted-foreground">
              Play against a player remotely.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-row gap-2">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Create a room</CardTitle>
                </CardHeader>
                <CardContent>
                  <form action={createRoom.bind(null, "abc")}>
                    <button
                      type="submit"
                      className="rounded bg-primary px-4 py-2 text-primary-foreground"
                    >
                      Create
                    </button>
                  </form>
                </CardContent>
              </Card>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Join a room</CardTitle>
                </CardHeader>
                <CardContent></CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
