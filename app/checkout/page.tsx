"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const PRODUCT_ID = "prod_UzjsDw0hzgDKrA";
const PRODUCT_PRICE = 24.99;
const PRODUCT_NAME = "Form Fit Satin-Lined Cooking Cap";

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

function CheckoutForm() {
  const searchParams = useSearchParams();
  const initialQty = parseInt(searchParams.get("quantity") || "1", 10);
  const [quantity, setQuantity] = useState(Number.isNaN(initialQty) || initialQty < 1 ? 1 : initialQty);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    apartment: "",
    city: "",
    state: "TX",
    zip: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (cleanPhone.length < 10) {
      newErrors.phone = "Please enter a valid 10-digit phone number.";
    }

    if (!formData.street.trim()) {
      newErrors.street = "Street address is required.";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required.";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required.";
    }

    if (!formData.zip.trim()) {
      newErrors.zip = "ZIP code is required.";
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zip.trim())) {
      newErrors.zip = "Please enter a valid 5-digit ZIP code.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setApiError(null);

    if (!validate()) {
      // Focus on first erroneous input
      const firstErrorKey = Object.keys(errors)[0];
      const el = document.getElementById(`field-${firstErrorKey}`);
      if (el) el.focus();
      return;
    }

    setLoading(true);

    const payload = {
      productId: PRODUCT_ID,
      quantity,
      customerName: formData.name.trim(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      customerEmail: formData.email.trim(),
      phone: formData.phone.trim(),
      customerPhone: formData.phone.trim(),
      shippingAddress: {
        name: formData.name.trim(),
        line1: formData.street.trim(),
        line2: formData.apartment.trim() || undefined,
        city: formData.city.trim(),
        state: formData.state.trim(),
        postalCode: formData.zip.trim(),
        country: "US",
      },
      address: {
        street: formData.street.trim(),
        apartment: formData.apartment.trim() || undefined,
        city: formData.city.trim(),
        state: formData.state.trim(),
        zip: formData.zip.trim(),
        country: "US",
      },
    };

    try {
      const response = await fetch("https://n8n.ebutap.xyz/webhook/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Checkout service returned status ${response.status}`);
      }

      const data = await response.json().catch(() => null);

      if (data && data.checkoutUrl) {
        window.location.assign(data.checkoutUrl);
        return;
      }

      setApiError("Unable to initiate payment session. The checkout link was not returned. Please try again.");
      setLoading(false);
    } catch (err) {
      console.error("Checkout creation error:", err);
      setApiError("We encountered an issue connecting to the payment service. Please try again in a moment.");
      setLoading(false);
    }
  };

  const subtotal = (PRODUCT_PRICE * quantity).toFixed(2);
  const freeShipping = quantity >= 2;
  const shippingCost = freeShipping ? 0 : 4.99;
  const grandTotal = (parseFloat(subtotal) + shippingCost).toFixed(2);

  return (
    <div className="checkout-wrapper">
      <Link href="/" className="checkout-back-link">
        ← Return to Product Overview
      </Link>

      {apiError && (
        <div className="checkout-error-banner" role="alert">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "2px" }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <strong>Checkout Error</strong>
            <p style={{ margin: "4px 0 0", fontSize: "13px" }}>{apiError}</p>
          </div>
        </div>
      )}

      <div className="checkout-grid">
        {/* Left Column: Customer & Shipping Form */}
        <section className="checkout-card" aria-label="Customer Checkout Details">
          <form onSubmit={handleSubmit} noValidate>
            <h2 className="checkout-section-title">
              <span>👤</span> Customer Information
            </h2>

            <div className="form-group">
              <label htmlFor="field-name">Full Name</label>
              <input
                id="field-name"
                name="name"
                type="text"
                placeholder="Marcus Vance"
                className={`form-input ${errors.name ? "has-error" : ""}`}
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
              {errors.name && <span className="field-error-text">{errors.name}</span>}
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="field-email">Email Address</label>
                <input
                  id="field-email"
                  name="email"
                  type="email"
                  placeholder="marcus@example.com"
                  className={`form-input ${errors.email ? "has-error" : ""}`}
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
                {errors.email && <span className="field-error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="field-phone">Phone Number</label>
                <input
                  id="field-phone"
                  name="phone"
                  type="tel"
                  placeholder="(210) 555-0199"
                  className={`form-input ${errors.phone ? "has-error" : ""}`}
                  value={formData.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  required
                />
                {errors.phone && <span className="field-error-text">{errors.phone}</span>}
              </div>
            </div>

            <hr className="checkout-section-divider" />

            <h2 className="checkout-section-title">
              <span>📦</span> Shipping Address
            </h2>

            <div className="form-group">
              <label htmlFor="field-street">Street Address</label>
              <input
                id="field-street"
                name="street"
                type="text"
                placeholder="123 Main Street"
                className={`form-input ${errors.street ? "has-error" : ""}`}
                value={formData.street}
                onChange={handleChange}
                autoComplete="street-address"
                required
              />
              {errors.street && <span className="field-error-text">{errors.street}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="field-apartment">
                Apartment, Suite, Unit <span className="optional-badge">(optional)</span>
              </label>
              <input
                id="field-apartment"
                name="apartment"
                type="text"
                placeholder="Apt 4B"
                className="form-input"
                value={formData.apartment}
                onChange={handleChange}
                autoComplete="address-line2"
              />
            </div>

            <div className="form-row-3">
              <div className="form-group">
                <label htmlFor="field-city">City</label>
                <input
                  id="field-city"
                  name="city"
                  type="text"
                  placeholder="San Antonio"
                  className={`form-input ${errors.city ? "has-error" : ""}`}
                  value={formData.city}
                  onChange={handleChange}
                  autoComplete="address-level2"
                  required
                />
                {errors.city && <span className="field-error-text">{errors.city}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="field-state">State</label>
                <select
                  id="field-state"
                  name="state"
                  className={`form-input ${errors.state ? "has-error" : ""}`}
                  value={formData.state}
                  onChange={handleChange}
                  autoComplete="address-level1"
                  required
                >
                  {US_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                {errors.state && <span className="field-error-text">{errors.state}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="field-zip">ZIP Code</label>
                <input
                  id="field-zip"
                  name="zip"
                  type="text"
                  placeholder="78201"
                  className={`form-input ${errors.zip ? "has-error" : ""}`}
                  value={formData.zip}
                  onChange={handleChange}
                  autoComplete="postal-code"
                  required
                />
                {errors.zip && <span className="field-error-text">{errors.zip}</span>}
              </div>
            </div>

            <button
              type="submit"
              className="continue-payment-btn"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" />
                  </svg>
                  <span>Connecting to Stripe...</span>
                </>
              ) : (
                <>
                  <span>🔒 Continue to Secure Payment</span>
                </>
              )}
            </button>

            <div className="secure-notice">
              <span>✓ 256-Bit SSL Encryption</span>
              <span>•</span>
              <span>Powered by Stripe Checkout</span>
            </div>
          </form>
        </section>

        {/* Right Column: Order Summary */}
        <aside className="checkout-card checkout-summary-card" aria-label="Order Summary">
          <h2 className="checkout-section-title" style={{ fontSize: "16px" }}>
            Order Summary
          </h2>

          <div className="checkout-summary-product">
            <img
              src="/products/satinLined.jpeg"
              alt="Form Fit Satin-Lined Cooking Cap"
              className="checkout-summary-thumb"
            />
            <div className="checkout-summary-details">
              <div className="checkout-summary-title">{PRODUCT_NAME}</div>
              <div className="checkout-summary-meta">Black · Shallow Fit · Satin Lined</div>
              <div className="checkout-qty-control">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  disabled={loading}
                >
                  −
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  disabled={loading}
                >
                  +
                </button>
              </div>
            </div>
            <div style={{ textAlign: "right", fontWeight: 800, fontSize: "15px" }}>
              ${(PRODUCT_PRICE * quantity).toFixed(2)}
            </div>
          </div>

          <div className="checkout-totals-block">
            <div className="checkout-totals-row">
              <span>Price per Cap</span>
              <span>${PRODUCT_PRICE.toFixed(2)}</span>
            </div>
            <div className="checkout-totals-row">
              <span>Quantity</span>
              <span>{quantity}</span>
            </div>
            <div className="checkout-totals-row">
              <span>Subtotal</span>
              <strong>${subtotal}</strong>
            </div>
            <div className="checkout-totals-row">
              <span>Shipping</span>
              <span style={{ color: freeShipping ? "var(--green)" : "var(--ink)", fontWeight: 700 }}>
                {freeShipping ? "FREE" : `$${shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div className="checkout-totals-row final-total">
              <span>Total Due</span>
              <span>${grandTotal}</span>
            </div>
          </div>

          <div className="checkout-trust-box">
            <div className="checkout-trust-item">
              <span>🛡️</span>
              <span>30-Day Kitchen Shift Guarantee</span>
            </div>
            <div className="checkout-trust-item">
              <span>✨</span>
              <span>Friction-Free Satin Interior Protection</span>
            </div>
            <div className="checkout-trust-item">
              <span>💨</span>
              <span>Breathable Micro-Perforated Crown</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <main>
      <div className="announcement">FREE U.S. SHIPPING ON 2+ CAPS</div>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Satin Chef home">
          <span>SATIN</span> CHEF
        </Link>
        <div className="header-proof">
          <span className="stars">★★★★★</span> Made for real kitchen shifts
        </div>
      </header>

      <Suspense fallback={<div style={{ textAlign: "center", padding: "60px 20px" }}>Loading checkout...</div>}>
        <CheckoutForm />
      </Suspense>

      <footer>
        <div className="brand">
          <span>SATIN </span> CHEF
        </div>
        <div>123 Main St, San Antonio, TX</div>
        <a href="tel:2106668888">210-666-8888</a>
        <div>© 2026 Satin Chef. All rights reserved.</div>
      </footer>
    </main>
  );
}
