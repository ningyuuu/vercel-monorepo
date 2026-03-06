"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";

type Theme = "light" | "dark";

function getPreferredTheme(): Theme {
  const saved = window.localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") {
    return saved;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  window.localStorage.setItem("theme", theme);
}

export function ThemeToggle() {
  useEffect(() => {
    applyTheme(getPreferredTheme());
  }, []);

  const toggleTheme = () => {
    const currentTheme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";

    applyTheme(currentTheme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="fixed right-4 top-4 z-50"
      aria-label="Toggle light and dark mode"
    >
      <Sun className="hidden size-4 dark:block" />
      <Moon className="size-4 dark:hidden" />
    </Button>
  );
}
