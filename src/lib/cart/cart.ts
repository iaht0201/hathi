//  schema
export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  qty: number;
};

// --- Helpers ---
function parseJSON<T>(s: string | null, fallback: T): T {
  if (!s) return fallback;
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}
//  convert ve CartItem
function sanitizeCartItem(x: CartItem): CartItem | null {
  if (!x || typeof x !== "object") return null;
  const productId = String(x.productId ?? "");
  const name = String(x.name ?? "");
  const image = String(x.image ?? "");
  const price = Number(x.price);
  const qty = Math.trunc(x.qty);

  if (!productId || !name) return null;

  return {
    productId,
    name,
    image,
    price: Number.isFinite(price) && price >= 0 ? price : 0,
    qty: Number.isFinite(qty) && qty > 0 ? qty : 1,
  };
}
// merge lai san pham trung
export function mergeCartItems(list: CartItem[]): CartItem[] {
  const map = new Map<string, CartItem>();
  for (const it of list) {
    const ex = map.get(it.productId);
    if (ex) map.set(it.productId, { ...ex, qty: ex.qty + it.qty });
    else map.set(it.productId, { ...it });
  }
  return [...map.values()];
}

export function getCart(key = "cart"): CartItem[] {
  if (typeof window === "undefined") return [];
  const rawArr = parseJSON<CartItem[]>(localStorage.getItem(key), []);
  const cleaned = Array.isArray(rawArr)
    ? (rawArr.map(sanitizeCartItem).filter(Boolean) as CartItem[])
    : [];
  return cleaned;
}

//  set card
export function setCart(items: CartItem[], key = "cart") {
  if (typeof window === "undefined") return [];
  localStorage.setItem(key, JSON.stringify(items));
}

//  lay tong card
export function getCartTotals(list: CartItem[]) {
  const totalQty = list.reduce((s, it) => s + it.qty, 0);
  const subtotal = list.reduce((s, it) => s + it.price * it.qty, 0);
  return { totalQty, subtotal };
}

//  convert gia tien

export function formatVND(n: number, locale: string = "vi-VN") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "VND",
  }).format(n);
}

/**
 * Load -> merge -> (auto save) -> return cart & totals
 */
export function computeCart(key = "cart", autoSave = true) {
  const items = getCart(key);
  const cart = mergeCartItems(items);
  if (autoSave) setCart(cart, key);
  const { totalQty, subtotal } = getCartTotals(cart);
  return { cart, totalQty, subtotal, subtotalText: formatVND(subtotal) };
}

// --- (tuỳ chọn) các thao tác nhanh ---
export function addItem(newItem: CartItem, key = "cart") {
  const { cart } = computeCart(key, false);
  const next = mergeCartItems([...cart, newItem]);
  setCart(next, key);
  return computeCart(key);
}

export function setQty(productId: string, qty: number, key = "cart") {
  const { cart } = computeCart(key, false);
  const next = cart
    .map((it) =>
      it.productId === productId
        ? { ...it, qty: Math.max(1, Math.trunc(qty)) }
        : it
    )
    .filter((it) => it.qty > 0);
  setCart(next, key);
  return computeCart(key);
}

export function removeItem(productId: string, key = "cart") {
  const { cart } = computeCart(key, false);
  const next = cart.filter((it) => it.productId !== productId);
  setCart(next, key);
  return computeCart(key);
}
