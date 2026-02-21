"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import Timestable from "./Timestable";

export default function HelperPanel({
  completed,
}: {
  completed: string[];
}): React.ReactElement {
  return (
    <div className="w-full self-start justify-self-start">
      <Tabs defaultValue="timestable" className="w-full flex-col items-start">
        <TabsList className="mx-3 mb-2 h-10 gap-1 rounded-xl p-1 self-start sm:mx-6">
          <TabsTrigger
            value="hide"
            className="flex-none border border-transparent px-4 py-1.5 hover:bg-accent hover:text-accent-foreground data-active:border-border data-active:bg-background data-active:text-foreground data-active:shadow-sm"
          >
            Hide all
          </TabsTrigger>
          <TabsTrigger
            value="timestable"
            className="flex-none border border-transparent px-4 py-1.5 hover:bg-accent hover:text-accent-foreground data-active:border-border data-active:bg-background data-active:text-foreground data-active:shadow-sm"
          >
            Timestable
          </TabsTrigger>
        </TabsList>
        <TabsContent value="hide" className="w-full" />
        <TabsContent value="timestable" className="w-full">
          <Timestable completed={completed} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
