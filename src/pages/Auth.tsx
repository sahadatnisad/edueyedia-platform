import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Link } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { PageMeta } from "@/components/seo";
import { ArrowLeft, ArrowRight, BookOpen, Loader2, Mail, UserX } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

interface AuthProps {
  redirectAfterAuth?: string;
}

function resolveRedirectAfterAuth(returnTo: string | null, fallback = "/dashboard") {
  if (returnTo?.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }
  return fallback;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirectAfterAuth(searchParams.get("returnTo"), redirectAfterAuth);
  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirect]);

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      setStep({ email: formData.get("email") as string });
      setIsLoading(false);
    } catch (error) {
      console.error("Email sign-in error:", error);
      setError(error instanceof Error ? error.message : "Failed to send verification code.");
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      navigate(redirect);
    } catch (error) {
      console.error("OTP verification error:", error);
      setError("The verification code you entered is incorrect.");
      setIsLoading(false);
      setOtp("");
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("anonymous");
      navigate(redirect);
    } catch (error) {
      console.error("Guest login error:", error);
      setError(error instanceof Error ? error.message : "Failed to sign in as guest.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-ivory dark:bg-navy-deep">
      <PageMeta title="Sign in — NCTB AI Learning Hub" path="/auth" />
      <div aria-hidden className="pointer-events-none absolute inset-0 line-grid text-navy opacity-[0.05] dark:text-white" />
      <div aria-hidden className="pointer-events-none absolute -top-32 right-[-10%] h-96 w-96 rounded-full bg-teal/10 blur-3xl" />

      <div className="relative px-6 pt-6">
        <Link to="/" className="flex w-fit items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-teal font-serif text-base text-white">
            N
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-[0.18em] text-navy dark:text-slate-100">
              NCTB HUB
            </span>
            <span className="mt-0.5 text-[9px] font-semibold tracking-[0.14em] text-ink-soft uppercase dark:text-slate-400">
              Learn &middot; Practice &middot; Master
            </span>
          </span>
        </Link>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="border-hairline shadow-[0_32px_64px_-32px_rgba(15,34,56,0.35)] dark:border-white/10 dark:bg-navy-surface">
            {step === "signIn" ? (
              <>
                <CardHeader className="text-center">
                  <CardTitle className="font-serif text-3xl text-navy dark:text-slate-50">
                    {isAuthenticated ? "Welcome back" : "Start Learning"}
                  </CardTitle>
                  <CardDescription className="text-[15px] leading-relaxed dark:text-slate-400">
                    Sign in to track your progress and access all lessons.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleEmailSubmit}>
                  <CardContent>
                    <label htmlFor="auth-email" className="mb-2 block text-xs font-semibold tracking-wide text-ink-soft dark:text-slate-400">
                      Email address
                    </label>
                    <div className="relative flex items-center gap-2">
                      <div className="relative flex-1">
                        <Mail className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="auth-email"
                          name="email"
                          placeholder="name@example.com"
                          type="email"
                          className="h-12 rounded-full border-hairline bg-white pl-10 dark:border-white/15 dark:bg-white/5"
                          disabled={isLoading}
                          required
                        />
                      </div>
                      <Button type="submit" size="icon" className="size-12 rounded-full" disabled={isLoading} aria-label="Send code">
                        {isLoading ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
                      </Button>
                    </div>
                    {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

                    <div className="relative mt-6">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-hairline dark:border-white/10" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-3 text-muted-foreground">Or</span>
                      </div>
                    </div>

                    <Button type="button" variant="outline" className="mt-5 h-12 w-full rounded-full" onClick={handleGuestLogin} disabled={isLoading}>
                      <UserX className="mr-2 size-4" />
                      Try as Guest
                    </Button>
                  </CardContent>
                </form>
              </>
            ) : (
              <>
                <CardHeader className="text-center">
                  <CardTitle className="font-serif text-3xl text-navy dark:text-slate-50">
                    Check your email
                  </CardTitle>
                  <CardDescription className="text-[15px] dark:text-slate-400">
                    We sent a code to{" "}
                    <span className="font-semibold text-navy dark:text-slate-200">{step.email}</span>
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleOtpSubmit}>
                  <CardContent className="pb-4">
                    <input type="hidden" name="email" value={step.email} />
                    <input type="hidden" name="code" value={otp} />
                    <div className="flex justify-center">
                      <InputOTP value={otp} onChange={setOtp} maxLength={6} disabled={isLoading}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && otp.length === 6 && !isLoading) {
                            const form = (e.target as HTMLElement).closest("form");
                            if (form) form.requestSubmit();
                          }
                        }}
                      >
                        <InputOTPGroup>
                          {Array.from({ length: 6 }).map((_, index) => (
                            <InputOTPSlot key={index} index={index} />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    {error && <p className="mt-2 text-center text-sm text-red-500">{error}</p>}
                    <p className="mt-5 text-center text-sm text-muted-foreground">
                      Didn't receive a code?{" "}
                      <Button variant="link" className="h-auto p-0" onClick={() => setStep("signIn")}>
                        Try again
                      </Button>
                    </p>
                  </CardContent>
                  <CardFooter className="flex-col gap-2">
                    <Button type="submit" className="h-12 w-full rounded-full" disabled={isLoading || otp.length !== 6}>
                      {isLoading ? (
                        <><Loader2 className="mr-2 size-4 animate-spin" />Verifying...</>
                      ) : (
                        <>Verify code <ArrowRight className="ml-2 size-4" /></>
                      )}
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => setStep("signIn")} disabled={isLoading} className="w-full rounded-full">
                      Use different email
                    </Button>
                  </CardFooter>
                </form>
              </>
            )}
          </Card>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
            <BookOpen className="size-3 text-teal" />
            Your progress is saved to your account.
          </p>
        </div>
      </div>

      <div className="relative px-6 pb-6">
        <Link to="/" className="mx-auto flex w-fit items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-navy dark:hover:text-slate-200">
          <ArrowLeft className="size-3.5" /> Back to NCTB Hub
        </Link>
      </div>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}
