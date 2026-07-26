"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Client } from "./app-client";
import { useEffect, useMemo, useState } from "react";
import { FirebaseClient } from "@/app/lib/firebase";

interface Props {
  id: string;
}

// room manager allows the user to either create or join a room
// and renders the game board when the room has 2 players.
export function RoomManager({ id }: Props) {
  const client = useMemo(() => new FirebaseClient(), []);
  const [roomData, setRoomData] = useState<Record<string, unknown> | null>(
    null,
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const firebaseData = await client.getDatabase();
        console.log("Firebase RTDB state:", firebaseData);

        const room = await client.getRoom(id);
        setRoomData(room);
      } catch (error) {
        console.error("Error fetching Firebase RTDB state:", error);
      }
    }
    fetchData();
  }, [id, client]);

  async function renderRoomIfExists() {
    try {
      if (roomData) {
        return <Client />;
      }
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
    return <div>Room {id} not found.</div>;
  }

  return (
    <Card>
      <CardHeader className="items-center text-left">
        <CardTitle className="text-3xl">Room Manager!</CardTitle>
        <p className="text-muted-foreground">Play against a player remotely.</p>
      </CardHeader>
      <CardContent className="space-y-6">{renderRoomIfExists()}</CardContent>
    </Card>
  );
}
