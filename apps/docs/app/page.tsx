import Image from "next/image";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Briefcase, Code2 } from "lucide-react";

export default function Home() {
  const placeholderProjects = [
    {
      title: "Quick Maffs",
      image: "/maffs.png",
      description:
        "Series of games to build arithmetic ability. Built with Next.js.",
    },
  ];

  return (
    <div className="min-h-screen">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-12">
        <Card>
          <CardHeader className="items-center text-center">
            <div className="mx-auto mb-3 h-[150px] w-[150px] overflow-hidden rounded-full bg-muted">
              <Image
                src="/profile.png"
                alt="Profile"
                width={150}
                height={150}
                className="h-full w-full scale-125 object-cover object-center -translate-x-1 -translate-y-1"
              />
            </div>
            <CardTitle className="text-3xl">Ning Yu</CardTitle>
            <p className="text-muted-foreground">Software Engineer</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <p className="text-left text-sm text-foreground">
              I am interested in solving complex problems and creating value
              through sustainable, pleasant digital products. I appreciate
              thoughtful design and minimalist, non-invasive interactions. In
              short, applications should do their job, and get out of the
              way.&nbsp;
              <span className="font-semibold">
                I am currently seeking freelance development projects.
              </span>
            </p>

            <p className="text-left text-sm text-foreground">
              As a relationship-oriented person, I value personal authenticity
              and empathy in relationships. Outside of work I enjoy bouldering,
              cooking and fingerstyle guitar.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button variant="outline" className="gap-2" asChild>
                <a
                  href="https://github.com/ningyuuu"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Code2 className="size-4" />
                  Github
                </a>
              </Button>
              <Button variant="outline" className="gap-2" asChild>
                <a
                  href="https://www.linkedin.com/in/ningyuuu/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Briefcase className="size-4" />
                  LinkedIn
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="items-center text-center">
            <CardTitle className="text-xl">Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {placeholderProjects.map((project) => (
                <Card
                  key={project.title}
                  className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)]"
                >
                  <CardHeader>
                    <CardTitle className="text-base">{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={project.image}
                        alt={project.title}
                        width={640}
                        height={360}
                        className="h-auto w-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {project.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
