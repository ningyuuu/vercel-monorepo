"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { RoomManager } from "../room-manager";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { roomId } = useParams();

  useEffect(() => {
    if (!roomId) {
      router.replace("/tictactoe/online");
    }
  }, [roomId, router]);

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
            <RoomManager id={roomId as string} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
