import { NextResponse } from "next/server";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Replaces the Klaviyo embed the original footer loaded. There is no email
 * provider wired up, so this validates the address and acknowledges it; swap the
 * body for a provider call to make it live.
 */
export async function POST(request: Request) {
  let email: unknown;

  try {
    ({ email } = await request.json());
  } catch {
    return NextResponse.json({ message: "Malformed request." }, { status: 400 });
  }

  if (typeof email !== "string" || !EMAIL.test(email.trim())) {
    return NextResponse.json({ message: "Please enter a valid email address." }, { status: 422 });
  }

  return NextResponse.json({
    message: "Thank you — you are on the list for the Kindred of Ireland Post.",
  });
}
