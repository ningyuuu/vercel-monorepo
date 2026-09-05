import Link from "next/link";

export function DataSourceBanner() {
  return (
    <div className="rounded-lg border border-blue-200/70 bg-blue-50/60 px-4 py-3 dark:border-blue-400/20 dark:bg-blue-950/30">
      <p className="text-xs text-blue-900/80 dark:text-blue-200/80">
        Data sourced from{" "}
        <a
          href="https://www.innoquest.com.sg/test-menu/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2 hover:text-primary/80"
        >
          Innoquest website
        </a>
        . This page does not offer any medical advice.{" "}
        <Link
          href="/about"
          className="text-primary underline underline-offset-2 hover:text-primary/80"
        >
          Click here to learn more about this project.
        </Link>
      </p>
    </div>
  );
}
