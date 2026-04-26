import { AppNavbar } from "../components/AppNavbar";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <AppNavbar />
      <main className="max-w-2xl mx-auto pt-36 px-6">
        <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Last updated: April 2026
        </p>

        <section className="space-y-4">
          <h2 className="font-semibold">Data Collection</h2>
          <p>
            This app accesses your Google Drive to help you extract data from
            PDF purchase order files. We only access files you explicitly
            select.
          </p>

          <h2 className="font-semibold">Data Usage</h2>
          <p>
            Your files are processed locally. We do not store, share, or retain
            any of your documents outside your session.
          </p>

          <h2 className="font-semibold">Google Permissions</h2>
          <p>
            We request read-only access to your Google Drive solely to locate
            and view PDF files you choose to process.
          </p>

          <h2 className="font-semibold">Contact</h2>
          <p>For questions, contact: ningyu321@gmail.com</p>
        </section>
      </main>
    </div>
  );
}
