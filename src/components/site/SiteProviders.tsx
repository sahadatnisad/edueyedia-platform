import type { ReactNode } from "react";
import { SiteProvider } from "@/components/site/SiteContext";
import { SearchCommand } from "@/components/site/SearchCommand";
import { CartDrawer } from "@/components/site/CartDrawer";

export function SiteProviders({ children }: { children: ReactNode }) {
  return (
    <SiteProvider>
      {children}
      <SearchCommand />
      <CartDrawer />
    </SiteProvider>
  );
}
