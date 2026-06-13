import { GraduationCap, Guitar, Music } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@repo/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen items-start justify-center bg-background font-sans sm:items-center">
      <main className="w-full max-w-4xl px-6 pb-12 pt-20 sm:pb-16 sm:pt-16">
        <div className="mb-10 text-center space-y-2">
          <h1 className="text-3xl font-heading tracking-tight sm:text-4xl">
            What would you like to practice?
          </h1>
          <p className="text-muted-foreground text-base">
            Choose a mode below to get started.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
          <Link href="/course" className="group">
            <Card className="h-full relative overflow-hidden rounded-2xl border-2 border-border transition-all duration-300 hover:shadow-xl hover:border-primary/40 hover:-translate-y-0.5">
              <div className="absolute inset-0 bg-primary/5 transition-opacity duration-300 group-hover:bg-primary/10" />
              <CardContent className="relative p-6">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4 group-hover:scale-105 transition-transform duration-300">
                  <GraduationCap className="size-6" strokeWidth={1.8} />
                </div>
                <h2 className="text-xl font-heading tracking-tight mb-2">
                  Course
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  60-day fretboard mastery curriculum.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/notes" className="group">
            <Card className="h-full relative overflow-hidden rounded-2xl border-2 border-border transition-all duration-300 hover:shadow-xl hover:border-primary/40 hover:-translate-y-0.5">
              <div className="absolute inset-0 bg-primary/5 transition-opacity duration-300 group-hover:bg-primary/10" />
              <CardContent className="relative p-6">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4 group-hover:scale-105 transition-transform duration-300">
                  <Guitar className="size-6" strokeWidth={1.8} />
                </div>
                <h2 className="text-xl font-heading tracking-tight mb-2">
                  Notes
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Identify individual notes across the fretboard.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/chords" className="group">
            <Card className="h-full relative overflow-hidden rounded-2xl border-2 border-border transition-all duration-300 hover:shadow-xl hover:border-primary/40 hover:-translate-y-0.5">
              <div className="absolute inset-0 bg-primary/5 transition-opacity duration-300 group-hover:bg-primary/10" />
              <CardContent className="relative p-6">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4 group-hover:scale-105 transition-transform duration-300">
                  <Music className="size-6" strokeWidth={1.8} />
                </div>
                <h2 className="text-xl font-heading tracking-tight mb-2">
                  Chords
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Major, minor, 7th, sus, and barre chords across the fretboard.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}
