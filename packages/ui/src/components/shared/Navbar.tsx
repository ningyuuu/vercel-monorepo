"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "../../lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";

export type NavLink = {
  label: string;
  href: string;
};

export type NavItemWithSubItems = {
  label: string;
  subItems: NavLink[];
};

export type NavItem = NavLink | NavItemWithSubItems;

function isNavItemWithSubItems(item: NavItem): item is NavItemWithSubItems {
  return "subItems" in item;
}

export type NavbarProps = {
  title: string;
  links?: NavItem[];
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
          "mx-auto flex h-16 w-full max-w-4xl items-center justify-between px-6 sm:h-auto sm:px-6 sm:py-4",
          containerClassName,
        )}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6">
          <p className="m-0 text-lg font-semibold tracking-tight sm:text-xl">
            {title}
          </p>
          {links && links.length > 0 && (
            <div className="flex items-center gap-4">
              {links.map((item) => {
                if (isNavItemWithSubItems(item)) {
                  return (
                    <NavigationMenu key={item.label} viewport={false}>
                      <NavigationMenuList>
                        <NavigationMenuItem>
                          <NavigationMenuTrigger>
                            {item.label}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                              {item.subItems.map((subItem) => (
                                <li key={subItem.href}>
                                  <NavigationMenuLink asChild>
                                    <Link
                                      href={subItem.href}
                                      className={navigationMenuTriggerStyle()}
                                    >
                                      {subItem.label}
                                    </Link>
                                  </NavigationMenuLink>
                                </li>
                              ))}
                            </ul>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      </NavigationMenuList>
                    </NavigationMenu>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      navigationMenuTriggerStyle(),
                      item.href === pathname
                        ? "text-foreground font-medium underline underline-offset-4"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">{actions}</div>
      </div>
    </nav>
  );
}
