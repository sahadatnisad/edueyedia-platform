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

export interface CartItem {
  slug: string;
  title: string;
  titleBn?: string;
  price: number;
  compareAt?: number;
  tag: string;
  cover: CoverStyle;
  kind: Resource["kind"];
}

interface SiteContextValue {
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  cart: CartItem[];
  addToCart: (r: Resource) => void;
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
    return Array.isArray(parsed) ? parsed : [];
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
