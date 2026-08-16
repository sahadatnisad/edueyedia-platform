import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useSite } from "@/components/site/SiteContext";
import { useAuth } from "@/hooks/use-auth";
import { useResourcesBySlugs } from "@/hooks/use-content";
import { BookCover } from "@/components/BookCover";
import { getResource } from "@/data/catalog";
import { ArrowRight, Lock, ShoppingBag, Trash2 } from "lucide-react";

export function CartDrawer() {
  const { cartOpen, setCartOpen, cart, removeFromCart, cartTotal } =
    useSite();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Resolve cart covers against published DB resources (legacy fallback).
  const dbResources = useResourcesBySlugs(cart.map((c) => c.slug));
  const resourceFor = (slug: string) =>
    dbResources?.find((r) => r.slug === slug) ?? getResource(slug);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setCartOpen(false);
    navigate(isAuthenticated ? "/checkout" : "/auth?returnTo=/checkout");
  };

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="flex w-full max-w-md flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-6 py-5">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <ShoppingBag className="size-4 text-teal" />
            Your cart
            <span className="rounded-full bg-teal/10 px-2 py-0.5 text-xs font-semibold text-teal">
              {cart.length}
            </span>
          </SheetTitle>
          <SheetDescription className="sr-only">
            Items in your Edueyedia cart
          </SheetDescription>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
              <ShoppingBag className="size-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-serif text-xl text-navy dark:text-slate-100">
                Your cart is empty
              </p>
              <p className="font-bangla mt-1 text-sm text-muted-foreground">
                গবেষণা ও স্কলারশিপ রিসোর্স দেখে শুরু করুন।
              </p>
            </div>
            <Button asChild className="rounded-full" onClick={() => setCartOpen(false)}>
              <Link to="/resources">
                Explore Resources <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="flex flex-col gap-4">
                {cart.map((item) => {
                  const resource = resourceFor(item.slug);
                  return (
                    <li key={item.slug} className="flex gap-4">
                      <Link
                        to={`/resources/${item.slug}`}
                        onClick={() => setCartOpen(false)}
                        className="w-16 shrink-0"
                      >
                        {resource ? (
                          <BookCover resource={resource} compact />
                        ) : (
                          <div className="aspect-[4/5] rounded-xl bg-muted" />
                        )}
                      </Link>
                      <div className="flex flex-1 flex-col gap-1">
                        <Link
                          to={`/resources/${item.slug}`}
                          onClick={() => setCartOpen(false)}
                          className="font-serif text-sm leading-snug font-semibold text-navy hover:text-teal dark:text-slate-100"
                        >
                          {item.titleBn ?? item.title}
                        </Link>
                        <p className="text-[11px] text-muted-foreground">
                          {item.tag} • Digital download
                        </p>
                        <p className="mt-auto font-serif text-base font-semibold text-navy dark:text-slate-100">
                          ৳{item.price}
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
            </div>

            <SheetFooter className="border-t border-border px-6 py-5">
              <div className="flex w-full flex-col gap-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-serif text-lg font-semibold text-navy dark:text-slate-100">
                    ৳{cartTotal}
                  </span>
                </div>
                <Button
                  className="w-full rounded-full"
                  size="lg"
                  onClick={handleCheckout}
                >
                  <Lock className="size-4" />
                  {isAuthenticated
                    ? "Continue to checkout"
                    : "Sign in to check out"}
                </Button>
                <p className="text-center text-[11px] text-muted-foreground">
                  Secure digital delivery — resources appear in your library
                  instantly after purchase.
                </p>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
