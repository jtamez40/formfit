"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="order-success-card">
      <div className="success-icon-badge">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>

      <p className="kicker">ORDER CONFIRMED</p>
      <h1>Payment successful!</h1>
      <p className="lead-text">
        Thank you for your order. We are preparing it for store pickup. We will contact you when it is ready.
      </p>

      {sessionId && (
        <div className="order-reference">
          <span className="reference-label">Order Reference:</span>
          <code className="reference-id">{sessionId}</code>
        </div>
      )}

      <div className="store-info-box">
        <div className="store-info-header">📍 Store Pickup Location</div>
        <div className="store-info-details">
          <b>Satin Chef Kitchen Store</b>
          <p>123 Main St, San Antonio, TX</p>
          <p>Phone: 210-666-8888</p>
        </div>
      </div>

      <div className="actions">
        <Link href="/" className="continue-btn">
          Continue Shopping
        </Link>
      </div>

      <p className="email-note">
        Please check your email for your receipt and order confirmation details.
      </p>
    </div>
  );
}

export default function OrderSuccessPage() {
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

      <section className="order-success-container">
        <Suspense fallback={<div>Loading order details...</div>}>
          <OrderSuccessContent />
        </Suspense>
      </section>

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
