"use client";

import { useState } from "react";

type Errors = Record<string, string>;

const REQUIRED: { name: string; label: string }[] = [
  { name: "email", label: "Email" },
  { name: "firstName", label: "First name" },
  { name: "lastName", label: "Last name" },
  { name: "address", label: "Address" },
  { name: "city", label: "City" },
  { name: "postcode", label: "Postal code" },
];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * The address, shipping and payment steps of checkout.
 *
 * The real storefront hands off to Shopify's hosted checkout at this point, so
 * there is no payment provider behind this. The fields validate for real and
 * then the form says plainly that the order cannot be placed, rather than
 * showing a card form that could be mistaken for a working one.
 */
export default function CheckoutForm({
  countries,
  defaultCountry,
}: {
  countries: { code: string; label: string }[];
  defaultCountry: string;
}) {
  const [errors, setErrors] = useState<Errors>({});
  const [blocked, setBlocked] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const next: Errors = {};

    for (const field of REQUIRED) {
      if (!String(data.get(field.name) ?? "").trim()) {
        next[field.name] = `${field.label} is required.`;
      }
    }

    const email = String(data.get("email") ?? "").trim();
    if (email && !EMAIL.test(email)) next.email = "Enter a valid email address.";

    setErrors(next);
    setBlocked(Object.keys(next).length === 0);

    if (Object.keys(next).length > 0) {
      document
        .querySelector(`[name="${Object.keys(next)[0]}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  const field = (
    name: string,
    label: string,
    type = "text",
    autoComplete?: string,
  ) => (
    <div className={`checkout-field${errors[name] ? " checkout-field--error" : ""}`}>
      <label className="checkout-field__label very-small-text" htmlFor={`co-${name}`}>
        {label}
      </label>
      <input
        id={`co-${name}`}
        name={name}
        type={type}
        autoComplete={autoComplete}
        className="checkout-field__input"
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `co-${name}-error` : undefined}
      />
      {errors[name] && (
        <span className="checkout-field__error very-small-text" id={`co-${name}-error`}>
          {errors[name]}
        </span>
      )}
    </div>
  );

  return (
    <form className="checkout-form" onSubmit={handleSubmit} noValidate>
      <section className="checkout-section">
        <h2 className="checkout-section__title h6">Contact</h2>
        {field("email", "Email", "email", "email")}
        <label className="checkout-check very-small-text">
          <input type="checkbox" name="newsletter" defaultChecked />
          <span>Email me with news and offers</span>
        </label>
      </section>

      <section className="checkout-section">
        <h2 className="checkout-section__title h6">Delivery</h2>

        <div className="checkout-field">
          <label className="checkout-field__label very-small-text" htmlFor="co-country">
            Country / Region
          </label>
          <select
            id="co-country"
            name="country"
            className="checkout-field__input"
            defaultValue={defaultCountry}
            autoComplete="country-name"
          >
            {countries.map((country) => (
              <option value={country.code} key={country.code}>
                {country.label}
              </option>
            ))}
          </select>
        </div>

        <div className="checkout-row">
          {field("firstName", "First name", "text", "given-name")}
          {field("lastName", "Last name", "text", "family-name")}
        </div>

        {field("address", "Address", "text", "street-address")}
        {field("apartment", "Apartment, suite, etc. (optional)", "text", "address-line2")}

        <div className="checkout-row">
          {field("city", "City", "text", "address-level2")}
          {field("postcode", "Postal code", "text", "postal-code")}
        </div>

        {field("phone", "Phone (optional)", "tel", "tel")}
      </section>

      <section className="checkout-section">
        <h2 className="checkout-section__title h6">Shipping method</h2>
        <div className="checkout-shipping">
          <label className="checkout-radio">
            <input type="radio" name="shipping" value="standard" defaultChecked />
            <span className="medium-text">Standard delivery</span>
            <span className="checkout-radio__price medium-text">Calculated at checkout</span>
          </label>
        </div>
      </section>

      <section className="checkout-section">
        <h2 className="checkout-section__title h6">Payment</h2>
        <p className="checkout-notice small-text">
          The live storefront hands off to Shopify&rsquo;s hosted checkout at this step. This rebuild
          has no payment provider connected, so no card details are collected and no order can be
          placed.
        </p>
      </section>

      <div className="checkout-actions">
        <button type="submit" className="button checkout-submit text-cta">
          Pay now
        </button>
        <a href="/cart" className="checkout-return text-cta">
          Return to cart
        </a>
      </div>

      {blocked && (
        <p className="checkout-blocked medium-text" role="status">
          Your details are valid, but there is no payment provider connected to this rebuild, so the
          order cannot be completed.
        </p>
      )}
    </form>
  );
}
