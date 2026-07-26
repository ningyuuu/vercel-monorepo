import { initializeApp, cert, getApps, App } from "firebase-admin/app";
import { Database, getDatabaseWithUrl } from "firebase-admin/database";

const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

export class FirebaseAdminClient {
  db: Database;

  constructor() {
    console.log({ url: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL });
    const app: App =
      getApps().length > 0
        ? (getApps()[0] as App)
        : initializeApp({
            credential: cert(serviceAccount),
          });

    this.db = getDatabaseWithUrl(
      process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ?? "",
      app,
    );
  }

  async createRoom(id: string) {
    await this.db.ref(`rooms/${id}`).set({
      test: true,
    });
  }
}
