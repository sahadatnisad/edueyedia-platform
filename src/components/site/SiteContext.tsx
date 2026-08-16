import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { CoverStyle, Resource } from "@/data/catalog";
import type { Course } from "@/data/courses";

export interface CartItem {
  /** "resource" | "course" — unified commerce line item kind. */
  itemType: "resource" | "course";
  /** Resource slug or course slug (used as the cart key). */
  slug: string;
  /** Course DB id — present only for course lines. */
  courseId?: string;
  title: string;
  titleBn?: string;
  price: number;
  compareAt?: number;
  tag: string;
  cover: CoverStyle;
  /** Resource kind (e.g. PDF/Guide) — resource lines only. */
  kind?: Resource["kind"];
}

interface SiteContextValue {
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  cart: CartItem[];
  addToCart: (r: Resource) => void;
  addCourseToCart: (c: Course) => void;
  removeFromCart: (slug: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const SiteContext = createContext<SiteContextValue | null>(null);

const CART_KEY = "edueyedia-cart";

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    // Migrate pre-unified-cart entries (no itemType) to resource lines.
    return parsed.map((item) =>
      item.itemType === undefined
        ? { ...item, itemType: "resource" as const }
        : item,
    );
  } catch {
    return [];
  }
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      /* storage unavailable */
    }
  }, [cart]);

  const addToCart = useCallback((r: Resource) => {
    setCart((prev) => {
      if (prev.some((item) => item.slug === r.slug)) return prev;
      return [
        ...prev,
        {
          itemType: "resource" as const,
          slug: r.slug,
          title: r.title,
          titleBn: r.titleBn,
          price: r.price,
          compareAt: r.compareAt,
          tag: r.tag,
          cover: r.cover,
          kind: r.kind,
        },
      ];
    });
  }, []);

  const addCourseToCart = useCallback((c: Course) => {
    setCart((prev) => {
      if (prev.some((item) => item.slug === c.slug)) return prev;
      return [
        ...prev,
        {
          itemType: "course" as const,
          slug: c.slug,
          courseId: c.id,
          title: c.title,
          titleBn: c.titleBn,
          price: c.price,
          compareAt: c.compareAt,
          tag: c.category,
          cover: c.cover,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((slug: string) => {
    setCart((prev) => prev.filter((item) => item.slug !== slug));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const value = useMemo(
    () => ({
      searchOpen,
      setSearchOpen,
      cartOpen,
      setCartOpen,
      cart,
      addToCart,
      addCourseToCart,
      removeFromCart,
      clearCart,
      cartCount: cart.length,
      cartTotal: cart.reduce((sum, item) => sum + item.price, 0),
    }),
    [
      searchOpen,
      cartOpen,
      cart,
      addToCart,
      addCourseToCart,
      removeFromCart,
      clearCart,
    ],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}
