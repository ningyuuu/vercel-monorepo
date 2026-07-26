import { initializeApp } from "firebase/app";
import {
  DataSnapshot,
  get,
  getDatabase,
  ref,
  Database,
} from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID + ".firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID + ".firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export class FirebaseClient {
  db: Database;

  constructor() {
    const app = initializeApp(firebaseConfig);
    this.db = getDatabase(app);
  }

  returnSnapshotIfExists(snapshot: DataSnapshot) {
    if (snapshot.exists()) {
      return snapshot.val();
    }

    throw new Error("Snapshot does not exist");
  }

  async getDatabase() {
    const snapshot = await get(ref(this.db, "/"));
    return this.returnSnapshotIfExists(snapshot);
  }

  async getRoom(roomId: string) {
    const snapshot = await get(ref(this.db, `/rooms/${roomId}`));
    return this.returnSnapshotIfExists(snapshot);
  }

  async getGame(gameId: string) {
    const snapshot = await get(ref(this.db, `/games/${gameId}`));
    return this.returnSnapshotIfExists(snapshot);
  }
}
