import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useIsAdmin } from "@/hooks/use-content";
import { useAuth } from "@/hooks/use-auth";

/**
 * Frontend admin guard. This is NOT the security boundary — every admin
 * mutation/query in `src/convex/admin.ts` re-verifies the caller's role
 * server-side. This component only controls what the UI renders.
 */
export function RequireAdmin({ children }: { children: ReactNode }) {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const isAdmin = useIsAdmin();
  const location = useLocation();

  if (authLoading || isAdmin === undefined) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (!isAuthenticated) {
    const returnTo = `${location.pathname}${location.search}`;
    return (
      <Navigate
        to={`/auth?returnTo=${encodeURIComponent(returnTo)}`}
        replace
      />
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
