import Image from "next/image";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Github, FileText, BookOpen } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-12">
        <nav className="flex flex-wrap justify-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <a href="#">Home</a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href="#">Projects</a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href="#">Experience</a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href="#">Contact</a>
          </Button>
        </nav>

        <Card>
          <CardHeader className="items-center text-center">
            <div className="mb-3 h-[150px] w-[150px] overflow-hidden rounded-full bg-muted">
              <Image
                src="/profile-placeholder.svg"
                alt="Profile"
                width={150}
                height={150}
                className="h-full w-full object-cover"
              />
            </div>
            <CardTitle className="text-3xl">Ning Yu</CardTitle>
            <p className="text-muted-foreground">Full Stack Developer</p>
            <p className="text-sm text-muted-foreground">
              Rotorua, New Zealand
            </p>
            <p className="text-sm text-muted-foreground">
              BSc, Major in Computer Science
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <p className="text-center text-sm text-muted-foreground sm:text-base">
              I&apos;m Ning Yu. Who am I????
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button variant="outline" className="gap-2" asChild>
                <a
                  href="https://github.com/ningyuuu"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github className="size-4" />
                  Github
                </a>
              </Button>
              <Button variant="outline" className="gap-2" asChild>
                <a href="https://ningyu.dev/" target="_blank" rel="noreferrer">
                  <FileText className="size-4" />
                  Site
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
