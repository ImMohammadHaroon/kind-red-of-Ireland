import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { CartLine } from "@/lib/cart";
import { buildPayload, cookieOptions, readCart, serializeCart, CART_COOKIE } from "@/lib/cart";

const NOTE_COOKIE = "kindred_cart_note";

/**
 * Stands in for Shopify's POST /cart/update.js.
 *
 * drawer-cart.js calls it two ways: as multipart form data with
 * `updates[variantId]=quantity` when the stepper changes, and as JSON with
 * `{ note }` when the order-note modal is confirmed.
 */
export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const lines = await readCart();
  let note: string | null = null;

  if (contentType.includes("application/json")) {
    try {
      const body = await request.json();
      if (typeof body.note === "string") note = body.note;

      if (body.updates && typeof body.updates === "object") {
        applyUpdates(lines, Object.entries(body.updates as Record<string, unknown>));
      }
    } catch {
      return NextResponse.json({ description: "Malformed request body." }, { status: 400 });
    }
  } else {
    const form = await request.formData();
    const updates: [string, unknown][] = [];

    for (const [key, value] of form.entries()) {
      const match = key.match(/^updates\[(.+)\]$/);
      if (match) updates.push([match[1], value]);
      else if (key === "note") note = String(value);
    }

    applyUpdates(lines, updates);
  }

  const remaining = lines.filter((line) => line.quantity > 0);
  const existingNote = note ?? (await readNote());
  const payload = buildPayload(remaining, existingNote);

  const response = NextResponse.json(payload);
  response.cookies.set(CART_COOKIE, serializeCart(remaining), cookieOptions);
  if (note !== null) response.cookies.set(NOTE_COOKIE, note, cookieOptions);
  return response;
}

function applyUpdates(lines: CartLine[], updates: [string, unknown][]) {
  for (const [variantId, rawQuantity] of updates) {
    const quantity = Math.max(0, Number(rawQuantity) || 0);
    const existing = lines.find((line) => line.variantId === variantId);

    if (existing) existing.quantity = quantity;
    else if (quantity > 0) lines.push({ variantId, quantity });
  }
}

async function readNote(): Promise<string> {
  const store = await cookies();
  return store.get(NOTE_COOKIE)?.value ?? "";
}
