"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { RoomManager } from "./room-manager";

export default function Home() {
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
            <RoomManager />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
