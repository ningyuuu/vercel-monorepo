import Image from "next/image";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Briefcase, Code2, Mail } from "lucide-react";

export default function Home() {
  const placeholderProjects = [
    {
      title: "Quick Maffs",
      image: "/maffs.png",
      url: "https://maffs.ningyu.dev",
      description:
        "Series of games to build arithmetic ability. Built with Next.js.",
    },
    {
      title: "Guitar Note Quiz",
      image: "/guitar.png",
      url: "https://guitar.ningyu.dev",
      description:
        "Interactive fretboard trainer for memorizing guitar note positions.",
    },
    {
      title: "Innoquest Explorer",
      image: "/innoquest.png",
      url: "https://innoquest.ningyu.dev",
      description: "Explore Innoquest's lab tests with a better UI.",
    },
    {
      title: "Document Data Extractor",
      image: "/docdata.png",
      url: "https://document-data.ningyu.dev",
      description:
        "Extract structured data from documents in a user-friendly flow (gated by authentication due to costs of LLMs).",
    },
  ];

  return (
    <div className="min-h-screen">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-12">
        <Card>
          <CardHeader className="items-center text-left">
            <CardTitle className="text-3xl">Handmade</CardTitle>
            <p className="text-muted-foreground">
              Games and apps made by hand without the use of AI.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-base">Tic Tac Toe</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  A simple Tic Tac Toe game
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
