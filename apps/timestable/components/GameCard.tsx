import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import type { LucideIcon } from "lucide-react";

interface GameMode {
  label: string;
  href: string;
  description: string;
}

interface GameCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  modes: GameMode[];
  accentColor: "primary" | "accent";
}

export function GameCard({
  title,
  description,
  icon: Icon,
  modes,
  accentColor,
}: GameCardProps) {
  return (
    <Card className="group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-lg hover:border-primary/30">
      <div
        className={`absolute inset-0 opacity-[0.03] transition-opacity duration-300 group-hover:opacity-[0.06] ${
          accentColor === "primary" ? "bg-primary" : "bg-accent"
        }`}
      />
      <CardHeader className="relative">
        <div className="flex items-center gap-5">
          <div
            className={`flex size-16 items-center justify-center rounded-2xl ${
              accentColor === "primary"
                ? "bg-primary/10 text-primary"
                : "bg-accent/10 text-accent"
            }`}
          >
            <Icon className="size-8" strokeWidth={1.8} />
          </div>
          <div className="flex flex-col gap-1.5">
            <CardTitle className="text-3xl font-heading tracking-tight">
              {title}
            </CardTitle>
            <p className="text-base leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative pt-0">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2.5">
            {modes.map((mode) => (
              <Link
                key={mode.label}
                href={mode.href}
                className="group/btn w-full md:w-auto md:flex-1 md:max-w-[calc(33.333%-0.5rem)]"
              >
                <Button
                  variant="outline"
                  className={`h-auto w-full flex-col items-start gap-1.5 px-5 py-4 text-left transition-all duration-200 hover:shadow-md ${
                    accentColor === "primary"
                      ? "hover:border-primary/50 hover:bg-primary/5"
                      : "hover:border-accent/50 hover:bg-accent/5"
                  }`}
                >
                  <span className="block text-base font-semibold">
                    {mode.label}
                  </span>
                  <span className="block text-sm text-muted-foreground font-normal">
                    {mode.description}
                  </span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
