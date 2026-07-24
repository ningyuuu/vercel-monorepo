"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Client } from "./app-client";
import { useEffect } from "react";
import { getFirebaseDatabase } from "@/app/lib/firebase";

// room manager allows the user to either create or join a room
// and renders the game board when the room has 2 players.
export function RoomManager() {
  useEffect(() => {
    async function fetchData() {
      try {
        const firebaseData = await getFirebaseDatabase();
        console.log("Firebase RTDB state:", firebaseData);
      } catch (error) {
        console.error("Error fetching Firebase RTDB state:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader className="items-center text-left">
        <CardTitle className="text-3xl">Room Manager!</CardTitle>
        <p className="text-muted-foreground">Play against a player remotely.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <Client />
      </CardContent>
    </Card>
  );
  return <div></div>;
}
