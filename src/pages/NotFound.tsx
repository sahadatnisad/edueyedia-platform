import { Link } from "react-router";
import { PageMeta } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-6 dark:bg-navy-deep">
      <PageMeta title="Page Not Found — NCTB AI Learning Hub" path="/404" />
      <p className="font-serif text-7xl font-bold text-navy/10 dark:text-white/10">
        404
      </p>
      <h1 className="mt-4 font-serif text-2xl font-bold text-navy dark:text-slate-50">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-ink-soft dark:text-slate-400">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild className="mt-8 rounded-full" size="lg">
        <Link to="/">
          <Home className="mr-2 size-4" />
          Back to Home
          <ArrowRight className="ml-2 size-4" />
        </Link>
      </Button>
    </div>
  );
}
