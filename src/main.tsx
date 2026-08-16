import "@vly-ai/integrations";
import { Toaster } from "@/components/ui/sonner";
import { RequireAuth } from "@/components/RequireAuth";
import { RequireAdmin } from "@/components/RequireAdmin";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { SiteProviders } from "@/components/site/SiteProviders";
import { ThemeProvider } from "next-themes";
import React, { StrictMode, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router";
import "./index.css";

// Lazy load route components for better code splitting
const Landing = lazy(() => import("./pages/Landing.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const Resources = lazy(() => import("./pages/Resources.tsx"));
const ResourceDetail = lazy(() => import("./pages/ResourceDetail.tsx"));
const Research = lazy(() => import("./pages/Research.tsx"));
const Blog = lazy(() => import("./pages/Blog.tsx"));
const ArticlePage = lazy(() => import("./pages/ArticlePage.tsx"));
const Courses = lazy(() => import("./pages/Courses.tsx"));
const CourseDetail = lazy(() => import("./pages/CourseDetail.tsx"));
const CourseLearn = lazy(() => import("./pages/CourseLearn.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const FAQ = lazy(() => import("./pages/FAQ.tsx"));
const LegalPage = lazy(() => import("./pages/LegalPage.tsx"));
const Checkout = lazy(() => import("./pages/Checkout.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
// Admin
const AdminShell = lazy(() => import("./components/admin/AdminShell.tsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.tsx"));
const AdminResources = lazy(() => import("./pages/admin/AdminResources.tsx"));
const AdminResourceEditor = lazy(() =>
  import("./pages/admin/AdminResources.tsx").then((m) => ({ default: m.AdminResourceEditor })),
);
const AdminResearch = lazy(() => import("./pages/admin/AdminResearch.tsx"));
const AdminResearchEditor = lazy(() =>
  import("./pages/admin/AdminResearch.tsx").then((m) => ({ default: m.AdminResearchEditor })),
);
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog.tsx"));
const AdminBlogEditor = lazy(() =>
  import("./pages/admin/AdminBlog.tsx").then((m) => ({ default: m.AdminBlogEditor })),
);
const AdminCourses = lazy(() => import("./pages/admin/AdminCourses.tsx"));
const AdminCourseEditor = lazy(() =>
  import("./pages/admin/AdminCourses.tsx").then((m) => ({ default: m.AdminCourseEditor })),
);
const AdminAuthors = lazy(() => import("./pages/admin/AdminAuthors.tsx"));
const AdminAuthorEditor = lazy(() =>
  import("./pages/admin/AdminAuthors.tsx").then((m) => ({ default: m.AdminAuthorEditor })),
);
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders.tsx"));

// Simple loading fallback for route transitions
function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );
}

/** Silent error boundary — if VlyToolbar crashes it renders nothing instead of
 *  crashing the whole app (e.g. hook errors in WebContainer environment). */
class ToolbarErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: Error) {
    console.warn("[VlyToolbar] Caught error, toolbar disabled:", err.message);
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

/** Hard guard so runtime errors never leave the preview as a blank page. */
class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string; stack: string }
> {
  state = { hasError: false, message: "", stack: "" };
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      message: error.message || "Unknown runtime error",
      stack: error.stack || "",
    };
  }
  componentDidCatch(err: Error) {
    console.error("[WebContainer preview] Root crash:", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
          <div className="max-w-lg text-center">
            <p className="text-sm font-semibold">Preview runtime error</p>
            <p className="mt-2 text-xs text-muted-foreground break-words">
              {this.state.message}
            </p>
            {this.state.stack && (
              <pre className="mt-3 text-left text-[10px] leading-4 text-muted-foreground/80 max-h-40 overflow-auto rounded border border-border/60 p-2">
                {this.state.stack}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

/** Redirect legacy article URLs to the new blog/research structure. */
function LegacyArticleRedirect({ toBase }: { toBase: string }) {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={`${toBase}/${slug ?? ""}`} replace />;
}

function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootErrorBoundary>
      <ToolbarErrorBoundary>
        <VlyToolbar />
      </ToolbarErrorBoundary>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        <ConvexAuthProvider client={convex}>
          <BrowserRouter>
            <SiteProviders>
              <RouteSyncer />
              <Suspense fallback={<RouteLoading />}>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route
                    path="/auth"
                    element={<AuthPage redirectAfterAuth="/dashboard" />}
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <RequireAuth>
                        <Dashboard />
                      </RequireAuth>
                    }
                  />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/resources/:slug" element={<ResourceDetail />} />
                  <Route path="/research" element={<Research />} />
                  <Route path="/research/:slug" element={<ArticlePage />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<ArticlePage />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/courses/:slug" element={<CourseDetail />} />
                  <Route
                    path="/courses/:slug/learn"
                    element={
                      <RequireAuth>
                        <CourseLearn />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/courses/:slug/learn/:lessonId"
                    element={
                      <RequireAuth>
                        <CourseLearn />
                      </RequireAuth>
                    }
                  />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/privacy" element={<LegalPage page="privacy" />} />
                  <Route path="/terms" element={<LegalPage page="terms" />} />
                  <Route path="/refund-policy" element={<LegalPage page="refund" />} />
                  <Route path="/digital-product-policy" element={<LegalPage page="digital-product" />} />
                  <Route path="/copyright" element={<LegalPage page="copyright" />} />
                  <Route path="/disclaimer" element={<LegalPage page="disclaimer" />} />
                  <Route
                    path="/checkout"
                    element={
                      <RequireAuth>
                        <Checkout />
                      </RequireAuth>
                    }
                  />
                  {/* Legacy URL redirects — Insights/Learn now live under /blog */}
                  <Route path="/insights" element={<Navigate to="/blog" replace />} />
                  <Route
                    path="/insights/:slug"
                    element={<LegacyArticleRedirect toBase="/blog" />}
                  />
                  <Route path="/learn" element={<Navigate to="/blog" replace />} />
                  <Route
                    path="/learn/:slug"
                    element={<LegacyArticleRedirect toBase="/blog" />}
                  />
                  {/* Admin CMS — guarded by RequireAdmin (server re-verifies) */}
                  <Route
                    path="/admin"
                    element={
                      <RequireAdmin>
                        <AdminShell />
                      </RequireAdmin>
                    }
                  >
                    <Route index element={<AdminDashboard />} />
                    <Route path="resources" element={<AdminResources />} />
                    <Route path="resources/new" element={<AdminResourceEditor />} />
                    <Route path="resources/:id" element={<AdminResourceEditor />} />
                    <Route path="research" element={<AdminResearch />} />
                    <Route path="research/new" element={<AdminResearchEditor />} />
                    <Route path="research/:id" element={<AdminResearchEditor />} />
                    <Route path="blog" element={<AdminBlog />} />
                    <Route path="blog/new" element={<AdminBlogEditor />} />
                    <Route path="blog/:id" element={<AdminBlogEditor />} />
                    <Route path="courses" element={<AdminCourses />} />
                    <Route path="courses/new" element={<AdminCourseEditor />} />
                    <Route path="courses/:id" element={<AdminCourseEditor />} />
                    <Route path="authors" element={<AdminAuthors />} />
                    <Route path="authors/new" element={<AdminAuthorEditor />} />
                    <Route path="authors/:id" element={<AdminAuthorEditor />} />
                    <Route path="orders" element={<AdminOrders />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </SiteProviders>
          </BrowserRouter>
          <Toaster />
        </ConvexAuthProvider>
      </ThemeProvider>
    </RootErrorBoundary>
  </StrictMode>,
);
