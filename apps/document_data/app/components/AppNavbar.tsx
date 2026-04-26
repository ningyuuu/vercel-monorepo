import { Navbar } from "@repo/ui/shared/Navbar";
import { ThemeToggle } from "@repo/ui/shared/ThemeToggle";

import { AuthActions } from "@/app/components/AuthActions";
import {
  PURCHASE_ORDERS_DRIVE_SEARCH_ROUTE,
  PURCHASE_ORDERS_HISTORY_ROUTE,
  PURCHASE_ORDERS_ROUTE,
  QUOTATION_ITEMS_ROUTE,
} from "@/lib/auth";

export async function AppNavbar() {
  return (
    <Navbar
      title="Document Data Extractor"
      links={[
        { label: "Quotation Items", href: QUOTATION_ITEMS_ROUTE },
        {
          label: "Purchase Orders",
          subItems: [
            { label: "New Task", href: PURCHASE_ORDERS_ROUTE },
            { label: "Drive Search", href: PURCHASE_ORDERS_DRIVE_SEARCH_ROUTE },
            { label: "View History", href: PURCHASE_ORDERS_HISTORY_ROUTE },
          ],
        },
      ]}
      actions={
        <AuthActions>
          <ThemeToggle className="static right-auto top-auto z-auto" />
        </AuthActions>
      }
    />
  );
}