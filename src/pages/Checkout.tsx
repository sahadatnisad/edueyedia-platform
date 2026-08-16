import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { useAction, useMutation, useQuery } from "convex/react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { BookCover } from "@/components/BookCover";
import { CourseCover } from "@/components/CourseCover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSite } from "@/components/site/SiteContext";
import { useAuth } from "@/hooks/use-auth";
import { useResourcesBySlugs } from "@/hooks/use-content";
import { getResource } from "@/data/catalog";
import type { Course } from "@/data/courses";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookMarked,
  Check,
  CreditCard,
  Download,
  Lock,
  Mail,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  UserRound,
} from "lucide-react";

const formatTaka = (n: number) => `৳${n.toLocaleString("en-IN")}`;

interface CompletedOrder {
  orderId: string;
  total: number;
  titles: string[];
}

export default function Checkout() {
  const { cart, removeFromCart, clearCart, cartTotal } = useSite();
  const { user } = useAuth();
  const createOrder = useMutation(api.library.createOrder);
  const completeOrder = useMutation(api.library.completeVerifiedOrder);
  const createPaymentSession = useAction(api.payments.createPaymentSession);
  const gatewayStatus = useQuery(api.gateway.gatewayStatus);
  const gatewayConfigured = gatewayStatus?.configured === true;
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [mobile, setMobile] = useState("");
  const [placing, setPlacing] = useState(false);
  const [completed, setCompleted] = useState<CompletedOrder | null>(null);
  const returnVerified = useRef(false);

  // Resolve cart lines: resources against published DB rows (legacy fallback),
  // courses directly from the line (the server re-prices everything anyway).
  const dbResources = useResourcesBySlugs(cart.map((i) => i.slug));
  const items = useMemo(
    () =>
      cart.map((item) => {
        if (item.itemType === "course") {
          const course: Course = {
            id: item.courseId,
            slug: item.slug,
            title: item.title,
            titleBn: item.titleBn ?? item.title,
            category: item.tag,
            categoryBn: item.tag,
            level: "All levels",
            duration: "Self-paced",
            lessonCount: 0,
            isFree: item.price <= 0,
            price: item.price,
            compareAt: item.compareAt,
            status: "published",
            shortDescription: "",
            description: "",
            whatYouLearn: [],
            audience: [],
            cover: item.cover,
            modules: [],
          };
          return { item, resource: undefined, course };
        }
        return {
          item,
          course: undefined,
          resource:
            dbResources?.find((r) => r.slug === item.slug) ??
            getResource(item.slug),
        };
      }),
    [cart, dbResources],
  );

  const compareAtTotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + (item.compareAt && item.compareAt > item.price ? item.compareAt : item.price),
        0,
      ),
    [cart],
  );
  const savings = Math.max(compareAtTotal - cartTotal, 0);

  const isEmpty = cart.length === 0 || cartTotal <= 0;

  const handlePlaceOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (isEmpty) return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName) {
      toast.error("Please enter your full name");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setPlacing(true);
    try {
      // 1. Create the order — the total is computed server-side from the
      //    catalog, never from the client. Unified commerce: one order can
      //    hold paid resources and paid courses.
      const orderId = await createOrder({
        items: cart.map((item) => ({
          kind: item.itemType as "resource" | "course",
          id:
            item.itemType === "course"
              ? (item.courseId ?? item.slug)
              : item.slug,
        })),
        contactName: trimmedName,
        contactEmail: trimmedEmail,
        contactMobile: mobile.trim() || undefined,
        gateway: gatewayConfigured ? "sslcommerz" : "sandbox",
      });

      // 2. Start the payment session. When SSLCommerz credentials are not
      //    configured yet, the action reports sandbox mode and we verify the
      //    demo order directly. With credentials configured, the customer is
      //    redirected to the gateway (bKash / Nagad / card) and the payment is
      //    verified server-side when they return.
      const session = await createPaymentSession({
        orderId,
        contactName: trimmedName,
        contactEmail: trimmedEmail,
        contactMobile: mobile.trim() || undefined,
        returnUrl: window.location.origin,
        convexUrl: import.meta.env.VITE_CONVEX_URL as string,
      });

      if (session.mode === "live") {
        // Send the customer to the gateway. The cart stays populated until the
        // payment is confirmed on return (see the return-verification effect).
        window.location.assign(session.gatewayPageUrl);
        return;
      }

      // Sandbox (demo) path: verify server-side, then unlock the library.
      await completeOrder({
        orderId,
        gateway: "sandbox",
        transactionId: `demo-${Date.now()}`,
      });

      setCompleted({
        orderId,
        total: cartTotal,
        titles: cart.map((item) => item.titleBn ?? item.title),
      });
      clearCart();
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.success("Order confirmed", {
        description: "Your resources are now in your library.",
      });
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      toast.error("We couldn't complete your order", { description: message });
    } finally {
      setPlacing(false);
    }
  };

  /* ------------------- Return from payment gateway ------------------- */
  // SSLCommerz redirects the customer back to /checkout with tran_id/val_id/
  // status appended. Verify the payment server-side and complete the order.
  useEffect(() => {
    const tranId = searchParams.get("tran_id");
    const valId = searchParams.get("val_id");
    const status = searchParams.get("status");
    if (!tranId && !valId) return;
    if (returnVerified.current) return;
    returnVerified.current = true;

    if (status === "FAILED" || status === "CANCELLED") {
      toast.error("Payment was not completed", {
        description: "Your cart is still saved — you can try again.",
      });
      setSearchParams({}, { replace: true });
      return;
    }

    // Verification needs both references: the order (tran_id) and the
    // gateway transaction id (val_id), which only arrives on VALID payments.
    if (!tranId || !valId) {
      setSearchParams({}, { replace: true });
      return;
    }

    (async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_CONVEX_URL}/payments/verify`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: tranId,
              gateway: "sslcommerz",
              transactionId: valId,
            }),
          },
        );
        const data = (await response.json()) as {
          ok?: boolean;
          error?: string;
        };
        if (data.ok) {
          setCompleted({
            orderId: tranId,
            total: cartTotal,
            titles: cart.map((item) => item.titleBn ?? item.title),
          });
          clearCart();
          window.scrollTo({ top: 0, behavior: "smooth" });
          toast.success("Payment confirmed", {
            description: "Your resources are now in your library.",
          });
        } else {
          toast.error("We couldn't confirm your payment", {
            description: data.error ?? "Please try again.",
          });
        }
      } catch {
        toast.error("We couldn't confirm your payment", {
          description: "Please check your library again in a moment.",
        });
      } finally {
        setSearchParams({}, { replace: true });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ------------------------------ Success ------------------------------ */
  if (completed) {
    return (
      <div className="min-h-screen bg-ivory dark:bg-navy-deep">
        <Navbar />
        <main className="pt-36 pb-28 sm:pt-44">
          <div className="mx-auto max-w-2xl px-6">
            <Reveal>
              <div className="relative overflow-hidden rounded-[2rem] border border-hairline bg-white p-8 text-center shadow-[0_40px_90px_-40px_rgba(15,34,56,0.4)] sm:p-12 dark:border-white/10 dark:bg-navy-surface">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-20 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-teal/10 blur-3xl"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-gold/15 blur-3xl"
                />
                <div className="relative">
                  <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-teal/10 ring-8 ring-teal/5">
                    <Check className="size-8 text-teal dark:text-teal-bright" />
                  </span>
                  <p className="mt-6 text-[10px] font-bold tracking-[0.24em] text-gold uppercase">
                    Order confirmed
                  </p>
                  <h1 className="font-bangla mt-3 text-3xl leading-tight font-bold text-navy text-balance sm:text-4xl dark:text-slate-50">
                    আপনার অর্ডার সম্পন্ন হয়েছে
                  </h1>
                  <p className="font-serif mt-2 text-lg text-teal italic dark:text-teal-bright">
                    Research. Learn. Advance.
                  </p>
                  <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink-soft dark:text-slate-400">
                    Your resources are unlocked and waiting in your personal
                    library — download them anytime, from any device.
                  </p>

                  <div className="mx-auto mt-7 inline-flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-hairline bg-ivory px-4 py-3 dark:border-white/10 dark:bg-navy-deep">
                    <span className="text-[10px] font-bold tracking-[0.16em] text-ink-soft uppercase dark:text-slate-400">
                      Order
                    </span>
                    <span className="rounded-full bg-navy px-2.5 py-0.5 font-mono text-[11px] font-semibold text-gold dark:bg-teal dark:text-navy-deep">
                      #{completed.orderId.slice(-8).toUpperCase()}
                    </span>
                    <span className="h-3 w-px bg-hairline dark:bg-white/10" />
                    <span className="font-serif text-lg font-semibold text-navy dark:text-slate-100">
                      {formatTaka(completed.total)}
                    </span>
                  </div>

                  {completed.titles.length > 0 && (
                    <ul className="mx-auto mt-6 flex max-w-md flex-col gap-2 text-left">
                      {completed.titles.map((title) => (
                        <li
                          key={title}
                          className="flex items-center gap-2.5 rounded-2xl border border-hairline bg-white px-4 py-2.5 text-sm font-medium text-navy dark:border-white/10 dark:bg-navy-deep dark:text-slate-200"
                        >
                          <BadgeCheck className="size-4 shrink-0 text-teal dark:text-teal-bright" />
                          {title}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                    <Button
                      size="lg"
                      className="rounded-full"
                      onClick={() => navigate("/dashboard")}
                    >
                      <BookMarked className="size-4" /> Open my library
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="rounded-full"
                    >
                      <Link to="/resources">
                        Continue exploring <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  /* ------------------------------ Empty cart ------------------------------ */
  if (isEmpty) {
    return (
      <div className="min-h-screen bg-ivory dark:bg-navy-deep">
        <Navbar />
        <main className="pt-36 pb-28 sm:pt-44">
          <div className="mx-auto max-w-xl px-6">
            <Reveal>
              <div className="flex flex-col items-center gap-5 rounded-[2rem] border border-dashed border-hairline px-6 py-16 text-center dark:border-white/15">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-teal/10">
                  <ShoppingBag className="size-8 text-teal dark:text-teal-bright" />
                </div>
                <div>
                  <p className="font-serif text-2xl text-navy dark:text-slate-100">
                    Your cart is empty
                  </p>
                  <p className="font-bangla mt-2 max-w-md text-sm leading-relaxed text-ink-soft dark:text-slate-400">
                    গবেষণা গাইড, স্কলারশিপ ম্যাপ বা স্টাডি অ্যাব্রোড রিসোর্স — বেছে নিন এবং
                    চেকআউট সম্পন্ন করুন।
                  </p>
                </div>
                <Button asChild size="lg" className="rounded-full">
                  <Link to="/resources">
                    Explore Resources <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  /* ------------------------------ Checkout ------------------------------ */
  return (
    <div className="min-h-screen bg-ivory dark:bg-navy-deep">
      <Navbar />
      <main className="pt-32 pb-24 sm:pt-40">
        <div className="mx-auto max-w-6xl px-6">
          {/* Header */}
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-gold" />
              <p className="text-xs font-bold tracking-[0.24em] text-navy uppercase dark:text-gold">
                Secure checkout
              </p>
            </div>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
              <div>
                <h1 className="font-bangla text-3xl leading-tight font-bold text-navy text-balance sm:text-[40px] dark:text-slate-50">
                  আপনার অর্ডার চূড়ান্ত করুন
                </h1>
                <p className="font-serif mt-2 text-lg text-teal italic dark:text-teal-bright">
                  Complete your order — instant digital delivery.
                </p>
              </div>
              <Link
                to="/resources"
                className="link-underline inline-flex items-center gap-1.5 text-sm font-semibold text-navy dark:text-slate-100"
              >
                <ArrowLeft className="size-4" /> Keep browsing
              </Link>
            </div>
          </Reveal>

          {/* Stepper */}
          <Reveal delay={0.08}>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 text-navy dark:text-slate-100">
                <span className="flex size-5 items-center justify-center rounded-full bg-teal text-[10px] font-bold text-white">
                  <Check className="size-3" />
                </span>
                Order summary
              </span>
              <span className="h-px w-8 bg-hairline dark:bg-white/15" />
              <span className="inline-flex items-center gap-1.5 text-navy dark:text-slate-100">
                <span className="flex size-5 items-center justify-center rounded-full bg-navy text-[10px] font-bold text-gold dark:bg-teal dark:text-navy-deep">
                  2
                </span>
                Contact &amp; payment
              </span>
              <span className="h-px w-8 bg-hairline dark:bg-white/15" />
              <span className="inline-flex items-center gap-1.5 text-ink-soft dark:text-slate-400">
                <span className="flex size-5 items-center justify-center rounded-full border border-hairline text-[10px] dark:border-white/15">
                  3
                </span>
                Confirmation
              </span>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-12">
            {/* ------------------------------ Form ------------------------------ */}
            <div className="lg:col-span-7">
              <Reveal>
                <form
                  onSubmit={handlePlaceOrder}
                  className="rounded-[2rem] border border-hairline bg-white p-6 sm:p-8 dark:border-white/10 dark:bg-navy-surface"
                >
                  {/* Contact */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="flex size-7 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-gold dark:bg-teal dark:text-navy-deep">
                        1
                      </span>
                      <h2 className="font-serif text-xl text-navy dark:text-slate-100">
                        Contact details
                      </h2>
                      <span className="font-bangla text-xs text-ink-soft dark:text-slate-400">
                        যোগাযোগের তথ্য
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-ink-soft dark:text-slate-400">
                      We send your order confirmation and delivery instructions
                      to this address.
                    </p>

                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <Label htmlFor="checkout-name" className="text-[13px] font-semibold text-navy dark:text-slate-200">
                          Full name
                        </Label>
                        <div className="relative mt-1.5">
                          <UserRound className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-soft" />
                          <Input
                            id="checkout-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your full name"
                            className="h-12 rounded-2xl border-hairline pl-10 dark:border-white/15 dark:bg-navy-deep"
                            autoComplete="name"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="checkout-email" className="text-[13px] font-semibold text-navy dark:text-slate-200">
                          Email address
                        </Label>
                        <div className="relative mt-1.5">
                          <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-soft" />
                          <Input
                            id="checkout-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="h-12 rounded-2xl border-hairline pl-10 dark:border-white/15 dark:bg-navy-deep"
                            autoComplete="email"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="checkout-mobile" className="text-[13px] font-semibold text-navy dark:text-slate-200">
                          Mobile number{" "}
                          <span className="font-normal text-ink-soft dark:text-slate-400">
                            (optional)
                          </span>
                        </Label>
                        <Input
                          id="checkout-mobile"
                          type="tel"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          placeholder="+880 1X XXXX XXXX"
                          className="mt-1.5 h-12 rounded-2xl border-hairline dark:border-white/15 dark:bg-navy-deep"
                          autoComplete="tel"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="my-8 h-px bg-hairline dark:bg-white/10" />

                  {/* Payment */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="flex size-7 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-gold dark:bg-teal dark:text-navy-deep">
                        2
                      </span>
                      <h2 className="font-serif text-xl text-navy dark:text-slate-100">
                        Payment
                      </h2>
                      <span className="font-bangla text-xs text-ink-soft dark:text-slate-400">
                        পেমেন্ট
                      </span>
                    </div>

                    <div className="mt-6 flex items-center justify-between rounded-3xl border border-hairline bg-ivory px-5 py-4 dark:border-white/10 dark:bg-navy-deep">
                      <div className="flex items-center gap-3">
                        <span className="flex size-11 items-center justify-center rounded-2xl bg-teal/10 text-teal dark:text-teal-bright">
                          <CreditCard className="size-5" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-navy dark:text-slate-100">
                            Secure digital checkout
                          </p>
                          <p className="text-xs text-ink-soft dark:text-slate-400">
                            Resources unlock instantly after confirmation
                          </p>
                        </div>
                      </div>
                      <span className="font-serif text-2xl font-semibold text-navy dark:text-slate-50">
                        {formatTaka(cartTotal)}
                      </span>
                    </div>

                    {!gatewayConfigured ? (
                      <p className="font-bangla mt-4 rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 text-[13px] leading-relaxed text-[#7c5c16] dark:border-gold/30 dark:bg-gold/10 dark:text-gold">
                        ডেমো চেকআউট — কোনো প্রকৃত অর্থ লেনদেন হচ্ছে না। লাইভ পেমেন্ট
                        গেটওয়ে সংযুক্ত হলে bKash, Nagad ও কার্ড পেমেন্ট চালু হবে।
                      </p>
                    ) : (
                      <p className="mt-4 rounded-2xl border border-teal/20 bg-teal/5 px-4 py-3 text-[13px] leading-relaxed text-teal dark:border-teal/30 dark:bg-teal/10 dark:text-teal-bright">
                        You'll be redirected to the secure payment gateway to
                        complete the order with bKash, Nagad or card.
                      </p>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      className="mt-6 w-full rounded-full"
                      disabled={placing}
                    >
                      {placing ? (
                        <>
                          <Sparkles className="size-4 animate-pulse" />
                          Verifying order…
                        </>
                      ) : (
                        <>
                          <Lock className="size-4" />
                          Place order · {formatTaka(cartTotal)}
                        </>
                      )}
                    </Button>

                    <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-medium text-ink-soft dark:text-slate-400">
                      <li className="inline-flex items-center gap-1.5">
                        <ShieldCheck className="size-3.5 text-teal" /> Secure verification
                      </li>
                      <li className="inline-flex items-center gap-1.5">
                        <Download className="size-3.5 text-teal" /> Instant delivery
                      </li>
                      <li className="inline-flex items-center gap-1.5">
                        <BookMarked className="size-3.5 text-teal" /> Lifetime access
                      </li>
                    </ul>
                  </div>
                </form>
              </Reveal>
            </div>

            {/* ------------------------------ Summary ------------------------------ */}
            <div className="lg:col-span-5">
              <Reveal delay={0.1}>
                <div className="rounded-[2rem] border border-hairline bg-white p-6 sm:p-7 lg:sticky lg:top-28 dark:border-white/10 dark:bg-navy-surface">
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif text-xl text-navy dark:text-slate-100">
                      Order summary
                    </h2>
                    <span className="rounded-full bg-teal/10 px-2.5 py-1 text-xs font-bold text-teal dark:text-teal-bright">
                      {cart.length} {cart.length === 1 ? "item" : "items"}
                    </span>
                  </div>

                  <ul className="mt-5 flex max-h-[26rem] flex-col gap-4 overflow-y-auto pr-1">
                    {items.map(({ item, resource, course }) => {
                      const isCourse = item.itemType === "course";
                      const destination = isCourse
                        ? `/courses/${item.slug}`
                        : `/resources/${item.slug}`;
                      return (
                        <li key={item.slug} className="flex gap-3.5">
                          <Link to={destination} className="w-14 shrink-0">
                            {course ? (
                              <CourseCover course={course} className="rounded-xl" />
                            ) : resource ? (
                              <BookCover resource={resource} compact />
                            ) : (
                              <div className="aspect-[4/5] rounded-xl bg-muted" />
                            )}
                          </Link>
                          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <Link
                              to={destination}
                              className="line-clamp-2 font-serif text-[13px] leading-snug font-semibold text-navy transition-colors hover:text-teal dark:text-slate-100 dark:hover:text-teal-bright"
                            >
                              {item.titleBn ?? item.title}
                            </Link>
                            <p className="text-[10px] font-semibold tracking-[0.14em] text-ink-soft uppercase dark:text-slate-400">
                              {item.tag} · {isCourse ? "Course" : "Digital"}
                            </p>
                            <p className="mt-auto font-serif text-base font-semibold text-navy dark:text-slate-100">
                              {formatTaka(item.price)}
                            </p>
                          </div>
                          <button
                            type="button"
                            aria-label={`Remove ${item.title}`}
                            className="self-start rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                            onClick={() => removeFromCart(item.slug)}
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="mt-6 flex flex-col gap-2.5 border-t border-hairline pt-5 dark:border-white/10">
                    <div className="flex items-center justify-between text-sm text-ink-soft dark:text-slate-400">
                      <span>Subtotal</span>
                      <span className="text-navy dark:text-slate-200">
                        {formatTaka(compareAtTotal)}
                      </span>
                    </div>
                    {savings > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-ink-soft dark:text-slate-400">
                          Bundle savings
                        </span>
                        <span className="font-semibold text-teal dark:text-teal-bright">
                          −{formatTaka(savings)}
                        </span>
                      </div>
                    )}
                    <div className="mt-1 flex items-center justify-between border-t border-dashed border-hairline pt-3.5 dark:border-white/15">
                      <span className="text-sm font-bold text-navy dark:text-slate-100">
                        Total
                      </span>
                      <span className="font-serif text-2xl font-semibold text-navy dark:text-slate-50">
                        {formatTaka(cartTotal)}
                      </span>
                    </div>
                  </div>

                  <p className="mt-5 flex items-start gap-2 rounded-2xl border border-hairline bg-ivory px-4 py-3 text-[12px] leading-relaxed text-ink-soft dark:border-white/10 dark:bg-navy-deep dark:text-slate-400">
                    <BadgeCheck className="mt-0.5 size-4 shrink-0 text-teal" />
                    This is a digital product. No physical copy will be shipped —
                    downloads appear in your library immediately after purchase.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
