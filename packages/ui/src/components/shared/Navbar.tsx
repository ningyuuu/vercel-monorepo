"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "../../lib/utils";

type NavLink = {
  label: string;
  href: string;
};

export type NavbarProps = {
  title: string;
  links?: NavLink[];
  actions?: React.ReactNode;
  className?: string;
  containerClassName?: string;
};

export function Navbar({
  title,
  links,
  actions,
  className,
  containerClassName,
}: NavbarProps) {
  const pathname = usePathname();
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
        <div className="flex items-center gap-6">
          <p className="text-lg font-semibold tracking-tight sm:text-xl">
            {title}
          </p>
          {links && links.length > 0 && (
            <div className="flex items-center gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm transition-colors no-underline",
                    link.href === pathname
                      ? "text-foreground font-medium underline underline-offset-4"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
        {actions ? (
          <div className="flex items-center gap-3">{actions}</div>
        ) : null}
      </div>
    </nav>
  );
}
