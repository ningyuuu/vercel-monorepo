"use client";

import { useId, useMemo, useState } from "react";
import { ProfilesTable } from "@/components/ProfilesTable";
import { DataSourceBanner } from "@/components/DataSourceBanner";
import type { TableRowData } from "@/lib/catalog";
import { Checkbox } from "@repo/ui/checkbox";

type TestOptions = {
  profiles: string[];
  single: string[];
};

type InnoquestHomeProps = {
  data: TableRowData[];
  testOptions: TestOptions;
};

export function InnoquestHome({ data, testOptions }: InnoquestHomeProps) {
  const [showSingleTests, setShowSingleTests] = useState(false);
  const checkboxId = useId();

  const profileData = useMemo(
    () => data.filter((row) => row.type === "Profile"),
    [data],
  );

  const visibleData = showSingleTests ? data : profileData;

  const visibleTestOptions = useMemo(() => {
    if (!showSingleTests) {
      return testOptions.profiles;
    }

    return [...testOptions.profiles, ...testOptions.single].filter(
      (item, index, items) => items.indexOf(item) === index,
    );
  }, [showSingleTests, testOptions.profiles, testOptions.single]);

  return (
    <div className="space-y-4">
      <DataSourceBanner />
      <label
        htmlFor={checkboxId}
        className="flex w-fit items-start gap-3 rounded-lg border px-3 py-2 text-sm"
      >
        <Checkbox
          id={checkboxId}
          checked={showSingleTests}
          onCheckedChange={(checked) => setShowSingleTests(checked === true)}
          aria-label="Show Single Tests (Experimental)"
          className="mt-0.5 data-[state=checked]:text-white dark:data-[state=checked]:text-white [&_[data-slot=checkbox-indicator]>svg]:stroke-[3]"
        />
        <span className="space-y-0.5">
          <span className="block font-medium">
            Show Single Tests (Experimental)
          </span>
          <span className="text-muted-foreground block text-xs">
            Include single-test and single-allergy options. <br />
            Data is not yet perfect and may include errors as scraped from PDF.
          </span>
        </span>
      </label>

      <ProfilesTable data={visibleData} testOptions={visibleTestOptions} />
    </div>
  );
}
