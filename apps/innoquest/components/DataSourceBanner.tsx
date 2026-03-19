import Link from "next/link";

export function DataSourceBanner() {
  return (
    <div className="border border-red-500 px-4 py-3 rounded mb-4">
      <div className="text-xs text-muted-foreground">
        Data sourced from{" "}
        <a
          href="https://www.innoquest.com.sg/test-menu/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Innoquest website
        </a>
        . This page does not offer any medical advice.{" "}
        <Link href="/about" className="underline">
          Click here to learn more about this project.
        </Link>
      </div>
    </div>
  );
}
