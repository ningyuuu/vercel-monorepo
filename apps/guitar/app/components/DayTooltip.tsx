"use client";

import { cloneElement, isValidElement, useCallback, useState } from "react";
import type { ReactElement } from "react";

interface DayTooltipProps {
  title: string;
  description: string;
  extra?: string;
  children: ReactElement<Record<string, unknown>>;
}

export function DayTooltip({ title, description, extra, children }: DayTooltipProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const handleMouseOver = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setPos({ x: rect.left + rect.width / 2, y: rect.top - 8 });
  }, []);

  const handleMouseOut = useCallback(() => {
    setPos(null);
  }, []);

  if (!isValidElement(children)) return children;

  const childProps = children.props as Record<string, unknown>;

  const child = cloneElement(children, {
    onMouseOver: (e: React.MouseEvent) => {
      if (typeof childProps.onMouseOver === "function") childProps.onMouseOver(e);
      handleMouseOver(e);
    },
    onMouseOut: (e: React.MouseEvent) => {
      if (typeof childProps.onMouseOut === "function") childProps.onMouseOut(e);
      handleMouseOut();
    },
  });

  return (
    <>
      {child}
      {pos && (
        <div
          className="fixed z-50 w-56 -translate-x-1/2 -translate-y-full rounded-lg border border-border bg-card p-3 text-sm space-y-1 shadow-lg pointer-events-none"
          style={{ left: pos.x, top: pos.y }}
        >
          <p className="font-medium">{title}</p>
          <p className="text-muted-foreground text-xs">{description}</p>
          {extra && <p className="text-xs text-muted-foreground">{extra}</p>}
        </div>
      )}
    </>
  );
}

