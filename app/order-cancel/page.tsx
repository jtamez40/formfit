import Link from "next/link";

export default function OrderCancelPage() {
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
        <div className="order-success-card">
          <div className="cancel-icon-badge" aria-hidden="true">
            <svg
              width="38"
              height="38"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>

          <p className="kicker kicker-neutral">CHECKOUT</p>
          <h1>Checkout Canceled.</h1>
          <p className="lead-text">
            Your order was not completed and you have not been charged. If you ran into an issue or simply want to try again, your cap is ready whenever you are.
          </p>

          <div className="store-info-box">
            <div className="store-info-header">Need Assistance?</div>
            <div className="store-info-details">
              <b>We are here to help</b>
              <p>Have questions about sizing, bulk orders, or kitchen specs? Give us a call.</p>
              <p>Phone: 210-666-8888</p>
            </div>
          </div>

          <div className="order-actions">
            <Link href="/#top" className="btn-primary">
              Try Again
            </Link>
            <Link href="/" className="btn-secondary">
              Back to Home
            </Link>
          </div>

          <p className="email-note">
            No payment has been processed. You can return to our shop at any time.
          </p>
        </div>
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
