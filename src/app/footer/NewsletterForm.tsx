"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "done" | "error";

/**
 * Stands in for the Klaviyo embed the original page loaded. Posts to our own
 * /api/newsletter route so the form actually resolves instead of sitting inert.
 */
export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setStatus("done");
      setMessage(data.message);
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "done") {
    return <p className="newsletter-form__message small-text">{message}</p>;
  }

  return (
    <form className="newsletter-form" onSubmit={onSubmit} noValidate>
      <label className="newsletter-form__label small-text" htmlFor="newsletter-email">
        Email address
      </label>
      <div className="newsletter-form__row">
        <input
          id="newsletter-email"
          className="newsletter-form__input"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <button className="newsletter-form__submit text-cta" type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Joining..." : "Sign up"}
        </button>
      </div>
      {status === "error" && <p className="newsletter-form__error small-text">{message}</p>}
    </form>
  );
}
