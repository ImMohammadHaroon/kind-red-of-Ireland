import { NextResponse } from "next/server";
import { buildPayload, cookieOptions, readCart, serializeCart, CART_COOKIE } from "@/lib/cart";
import { variants } from "@/lib/catalog";

type AddItem = { id?: number | string; quantity?: number | string };
type AddBody = AddItem & { items?: AddItem[] };

/**
 * Stands in for Shopify's POST /cart/add.js.
 *
 * drawer-cart.js posts `{ items: [{ id, quantity }] }` and then looks up the
 * matching entry in the returned `items` array by id, so the response echoes
 * back only the lines that were just added. Shopify also accepts a bare
 * `{ id, quantity }` and form encoding, so both are handled too.
 */
export async function POST(request: Request) {
  const body = await readBody(request);
  if (!body) {
    return NextResponse.json({ description: "Malformed request body." }, { status: 400 });
  }

  const submitted = body.items ?? (body.id === undefined ? [] : [body]);

  const requested = submitted
    .map((item) => ({
      variantId: String(item.id ?? ""),
      quantity: Math.max(1, Number(item.quantity) || 1),
    }))
    .filter((item) => item.variantId);

  if (!requested.length) {
    return NextResponse.json({ description: "No items were provided." }, { status: 422 });
  }

  const unknown = requested.filter((item) => !variants.has(item.variantId));
  if (unknown.length) {
    return NextResponse.json(
      { description: "That variant is no longer available." },
      { status: 422 },
    );
  }

  const lines = await readCart();
  for (const item of requested) {
    const existing = lines.find((line) => line.variantId === item.variantId);
    if (existing) existing.quantity += item.quantity;
    else lines.push({ ...item });
  }

  const payload = buildPayload(lines);
  const addedIds = new Set(requested.map((item) => item.variantId));

  const response = NextResponse.json({
    ...payload,
    items: payload.items.filter((item) => addedIds.has(item.key)),
  });
  response.cookies.set(CART_COOKIE, serializeCart(lines), cookieOptions);
  return response;
}

async function readBody(request: Request): Promise<AddBody | null> {
  const type = request.headers.get("content-type") ?? "";

  try {
    if (type.includes("form")) {
      const form = await request.formData();
      return {
        id: form.get("id")?.toString(),
        quantity: form.get("quantity")?.toString(),
      };
    }
    return await request.json();
  } catch {
    return null;
  }
}
