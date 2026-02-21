"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import Timestable from "./Timestable";
import VisualMultiplication from "./VisualMultiplication";

type Question = { r: number; c: number };

export default function HelperPanel({
  completed,
  currentQuestion,
}: {
  completed: string[];
  currentQuestion: Question | null;
}): React.ReactElement {
  return (
    <div className="w-full self-start justify-self-start">
      <Tabs defaultValue="timestable" className="w-full flex-col items-start">
        <TabsList className="mx-3 mb-2 self-start sm:mx-6">
          <TabsTrigger value="hide">Hide all</TabsTrigger>
          <TabsTrigger value="timestable">Timestable</TabsTrigger>
          <TabsTrigger value="visual">Visual</TabsTrigger>
        </TabsList>
        <TabsContent value="hide" className="w-full" />
        <TabsContent value="timestable" className="w-full">
          <Timestable completed={completed} />
        </TabsContent>
        <TabsContent value="visual" className="w-full">
          <VisualMultiplication currentQuestion={currentQuestion} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
