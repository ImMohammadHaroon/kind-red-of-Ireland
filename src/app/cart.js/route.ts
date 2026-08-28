import { NextResponse } from "next/server";
import { buildPayload, readCart } from "@/lib/cart";

/** Stands in for Shopify's GET /cart.js, polled by drawer-cart.js after an add. */
export async function GET() {
  const payload = buildPayload(await readCart());
  return NextResponse.json(payload, {
    headers: { "Cache-Control": "no-store" },
  });
}
