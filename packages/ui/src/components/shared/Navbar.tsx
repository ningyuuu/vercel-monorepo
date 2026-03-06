import * as React from "react";

import { cn } from "../../lib/utils";

type NavbarProps = {
  title: string;
  actions?: React.ReactNode;
  className?: string;
  containerClassName?: string;
};

export function Navbar({
  title,
  actions,
  className,
  containerClassName,
}: NavbarProps) {
  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto flex h-16 w-full max-w-4xl items-center justify-between gap-4 px-6",
          containerClassName,
        )}
      >
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold tracking-tight sm:text-xl">
            {title}
          </p>
        </div>
        {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
      </div>
    </nav>
  );
}
