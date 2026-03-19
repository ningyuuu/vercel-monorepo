import { Navbar } from "@/components/Navbar";
import { ThemeToggle } from "@repo/ui/shared/ThemeToggle";

export default function About() {
  return (
    <div className="flex min-h-screen items-start justify-center bg-background font-sans">
      <main className="w-full max-w-4xl bg-transparent px-6 pb-8 pt-24 sm:pt-28">
        <Navbar
          title="Innoquest - 2026 Test Profiles"
          actions={
            <ThemeToggle className="static right-auto top-auto z-auto" />
          }
        />
        <div className="mt-8 space-y-6">
          <section>
            <h2 className="text-lg font-semibold mb-2">
              About This Application
            </h2>
            <p className="text-sm text-muted-foreground">
              This application presents a searchable database of medical test
              profiles and individual tests from Innoquest Singapore for 2026.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">Data Source</h2>
            <p className="text-sm text-muted-foreground">
              The data is sourced from the{" "}
              <a
                href="https://www.innoquest.com.sg/test-menu/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Innoquest website&apos;s PDF
              </a>
              . Data is cleaned by hand at best effort.
            </p>
          </section>

          <section className="border border-red-500 px-4 py-3 rounded">
            <h2 className="text-lg font-semibold mb-2 text-red-500">
              Important Disclaimer
            </h2>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>This is not medical advice</li>
              <li>This database is not built by a medical professional</li>
              <li>
                Users should refer to the source of truth for the most updated
                information
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
