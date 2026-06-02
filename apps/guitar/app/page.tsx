import { Guitar, Music } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@repo/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen items-start justify-center bg-background font-sans sm:items-center">
      <main className="w-full max-w-3xl px-6 pb-12 pt-20 sm:pb-16 sm:pt-16">
        <div className="mb-10 text-center space-y-2">
          <h1 className="text-3xl font-heading tracking-tight sm:text-4xl">
            What would you like to practice?
          </h1>
          <p className="text-muted-foreground text-base">
            Choose a mode below to get started.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Link href="/notes" className="group block">
            <Card className="relative overflow-hidden rounded-2xl border-2 border-border transition-all duration-300 hover:shadow-xl hover:border-primary/40 hover:-translate-y-0.5">
              <div className="absolute inset-0 bg-primary/5 transition-opacity duration-300 group-hover:bg-primary/10" />
              <CardContent className="relative p-8">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-5 group-hover:scale-105 transition-transform duration-300">
                  <Guitar className="size-7" strokeWidth={1.8} />
                </div>
                <h2 className="text-2xl font-heading tracking-tight mb-2">
                  Notes
                </h2>
                <p className="text-base leading-relaxed text-muted-foreground">
                  Identify individual notes across the fretboard. Learn, recall,
                  sweep, and quiz modes.
                </p>
                <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-primary">
                  Browse notes
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                    &rarr;
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/chords" className="group block">
            <Card className="relative overflow-hidden rounded-2xl border-2 border-border transition-all duration-300 hover:shadow-xl hover:border-accent/40 hover:-translate-y-0.5">
              <div className="absolute inset-0 bg-accent/5 transition-opacity duration-300 group-hover:bg-accent/10" />
              <CardContent className="relative p-8">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-5 group-hover:scale-105 transition-transform duration-300">
                  <Music className="size-7" strokeWidth={1.8} />
                </div>
                <h2 className="text-2xl font-heading tracking-tight mb-2">
                  Chords
                </h2>
                <p className="text-base leading-relaxed text-muted-foreground">
                  Recognize chords by their shapes. Open, bar, power, 7th, and
                  advanced voicings.
                </p>
                <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-accent-foreground">
                  Browse chords
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
                    &rarr;
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}
