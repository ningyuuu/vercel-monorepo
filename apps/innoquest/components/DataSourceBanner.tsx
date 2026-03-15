export function DataSourceBanner() {
  return (
    <div className="border border-red-500 px-4 py-3 rounded mb-4">
      <div className="font-medium">Important Data Source Information</div>
      <div className="mt-1 text-xs text-muted-foreground">
        The data presented in this application is sourced from the{" "}
        <a
          href="https://www.innoquest.com.sg/test-menu/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Innoquest website&apos;s PDF
        </a>
        , and is cleaned by hand at a best effort. However, this is not medical
        advice and this database is not built by a medical professional. Users
        should refer to the source of truth for the most updated information.
      </div>
    </div>
  );
}
