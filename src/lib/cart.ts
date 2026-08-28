import { cookies } from "next/headers";
import { variants } from "@/lib/catalog";

export const CART_COOKIE = "kindred_cart";

export type CartLine = { variantId: string; quantity: number };

/**
 * A Shopify `cart.js` line item. The drawer script reads these field names
 * directly when it builds cart rows, so they are kept as-is.
 */
export type CartItemPayload = {
  id: number;
  variant_id: number;
  key: string;
  quantity: number;
  title: string;
  product_title: string;
  variant_title: string;
  url: string;
  image: string | null;
  price: number;
  final_price: number;
  line_price: number;
  final_line_price: number;
  options_with_values: { name: string; value: string }[];
};

export type CartPayload = {
  token: string;
  note: string;
  item_count: number;
  total_price: number;
  original_total_price: number;
  items: CartItemPayload[];
  currency: string;
};

export function parseCart(raw: string | undefined): CartLine[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((line) => line && typeof line.variantId === "string")
      .map((line) => ({ variantId: line.variantId, quantity: Math.max(0, Number(line.quantity) || 0) }))
      .filter((line) => line.quantity > 0);
  } catch {
    return [];
  }
}

export function serializeCart(lines: CartLine[]): string {
  return JSON.stringify(lines.filter((line) => line.quantity > 0));
}

export async function readCart(): Promise<CartLine[]> {
  const store = await cookies();
  return parseCart(store.get(CART_COOKIE)?.value);
}

export function buildPayload(lines: CartLine[], note = ""): CartPayload {
  const items: CartItemPayload[] = [];

  for (const line of lines) {
    const variant = variants.get(line.variantId);
    if (!variant) continue;

    const { product, size } = variant;
    const numericId = Number(line.variantId);

    items.push({
      id: numericId,
      variant_id: numericId,
      key: line.variantId,
      quantity: line.quantity,
      title: `${product.title} - ${size.label}`,
      product_title: product.title,
      variant_title: size.label,
      url: product.href,
      image: size.featuredImage ?? product.image?.src ?? null,
      price: size.price,
      final_price: size.price,
      line_price: size.price * line.quantity,
      final_line_price: size.price * line.quantity,
      options_with_values: [{ name: "Size", value: size.label }],
    });
  }

  const total = items.reduce((sum, item) => sum + item.final_line_price, 0);

  return {
    token: "local-cart",
    note,
    item_count: items.reduce((sum, item) => sum + item.quantity, 0),
    total_price: total,
    original_total_price: total,
    items,
    currency: "PKR",
  };
}

/** Shared cookie options: readable by the client is unnecessary, the API is the only reader. */
export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};
