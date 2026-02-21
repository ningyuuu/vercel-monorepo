import React from "react";
import Timestable from "./Timestable";

export default function HelperPanel({
  completed,
}: {
  completed: string[];
}): React.ReactElement {
  return (
    <div>
      <Timestable completed={completed} />
    </div>
  );
}