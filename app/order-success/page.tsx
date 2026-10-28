import Link from "next/link";
import { verifyCheckoutSession, type VerificationResult } from "@/lib/stripe";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function OrderSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const rawSessionId = params.session_id;
  const sessionId = typeof rawSessionId === "string" ? rawSessionId.trim() : undefined;

  const result: VerificationResult = await verifyCheckoutSession(sessionId);

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
          {result.verified ? (
            // ONLY displayed if Stripe verifies payment server-side
            <>
              <div className="success-icon-badge" aria-hidden="true">
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
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>

              <p className="kicker">ORDER CONFIRMED</p>
              <h1>Payment Successful!</h1>
              <p className="lead-text">
                Thank you for your order! We received your payment and are getting your Satin Chef cap ready.
              </p>

              <div className="order-summary-box">
                <div className="order-summary-title">Order Details</div>
                {result.formattedTotal && (
                  <div className="order-summary-row">
                    <span className="order-summary-label">Total Paid:</span>
                    <span className="order-summary-value">{result.formattedTotal}</span>
                  </div>
                )}
                <div className="order-summary-row">
                  <span className="order-summary-label">Payment Status:</span>
                  <span className="order-summary-value">
                    <span className="badge-status badge-paid">✓ Verified Paid</span>
                  </span>
                </div>
                {result.customerEmail && (
                  <div className="order-summary-row">
                    <span className="order-summary-label">Confirmation Email:</span>
                    <span className="order-summary-value">{result.customerEmail}</span>
                  </div>
                )}
                {result.sessionId && (
                  <div className="order-summary-row">
                    <span className="order-summary-label">Reference ID:</span>
                    <span className="order-summary-value" style={{ fontFamily: "monospace", fontSize: "12px" }}>
                      {result.sessionId.length > 28
                        ? `${result.sessionId.slice(0, 16)}...${result.sessionId.slice(-8)}`
                        : result.sessionId}
                    </span>
                  </div>
                )}
                {result.lineItems && result.lineItems.length > 0 && (
                  <div className="order-items-sublist">
                    {result.lineItems.map((item, index) => (
                      <div className="order-item-entry" key={index}>
                        <span>
                          {item.description} {item.quantity ? `(×${item.quantity})` : ""}
                        </span>
                        {item.formattedAmount && <span>{item.formattedAmount}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="store-info-box">
                <div className="store-info-header">📍 Store & Order Pickup</div>
                <div className="store-info-details">
                  <b>Satin Chef Kitchen Store</b>
                  <p>123 Main St, San Antonio, TX</p>
                  <p>Phone: 210-666-8888</p>
                </div>
              </div>

              <div className="order-actions">
                <Link href="/" className="btn-success">
                  Back to Home
                </Link>
              </div>

              <p className="email-note">
                Please check your email {result.customerEmail ? `(${result.customerEmail})` : ""} for your receipt and full tracking details.
              </p>
            </>
          ) : result.status === "unpaid" ? (
            // Stripe session found, but payment NOT verified as paid
            <>
              <div className="warning-icon-badge" aria-hidden="true">
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
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>

              <p className="kicker kicker-warning">PAYMENT NOT VERIFIED</p>
              <h1>Payment Incomplete</h1>
              <p className="lead-text">
                Stripe indicates this checkout session was not completed or payment is still pending. Your order has not been confirmed.
              </p>

              {result.sessionId && (
                <div className="order-reference">
                  <span className="reference-label">Session Reference:</span>
                  <code className="reference-id">{result.sessionId}</code>
                </div>
              )}

              <div className="order-actions">
                <Link href="/#top" className="btn-primary">
                  Try Again
                </Link>
                <Link href="/" className="btn-secondary">
                  Back to Home
                </Link>
              </div>

              <p className="email-note">
                If you believe this is an error or your card was charged, please check your bank or contact us at 210-666-8888.
              </p>
            </>
          ) : result.status === "placeholder" ? (
            // Literal placeholder from template
            <>
              <div className="warning-icon-badge" aria-hidden="true">
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
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>

              <p className="kicker kicker-warning">NOTICE</p>
              <h1>Placeholder Session ID</h1>
              <p className="lead-text">
                The URL contains an unpopulated session placeholder ({`{CHECKOUT_SESSION_ID}`}). In production, Stripe automatically substitutes this with your real session ID.
              </p>

              <div className="order-actions">
                <Link href="/" className="btn-secondary">
                  Back to Home
                </Link>
              </div>
            </>
          ) : result.status === "no_session" ? (
            // No session_id query param
            <>
              <div className="cancel-icon-badge" aria-hidden="true">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>

              <p className="kicker kicker-neutral">CHECKOUT STATUS</p>
              <h1>No Order Reference Found</h1>
              <p className="lead-text">
                We could not find an active checkout session for this visit. If you haven't placed an order yet, you can browse the Satin Chef cap below.
              </p>

              <div className="order-actions">
                <Link href="/" className="btn-primary">
                  Back to Home
                </Link>
              </div>
            </>
          ) : (
            // Error / unverified
            <>
              <div className="warning-icon-badge" aria-hidden="true">
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
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>

              <p className="kicker kicker-warning">ORDER VERIFICATION</p>
              <h1>Payment Verification Unavailable</h1>
              <p className="lead-text">
                We could not verify this session with Stripe at this moment. If you completed payment, please check your email for confirmation or contact our support team.
              </p>

              {result.sessionId && (
                <div className="order-reference">
                  <span className="reference-label">Reference ID:</span>
                  <code className="reference-id">{result.sessionId}</code>
                </div>
              )}

              <div className="order-actions">
                <Link href="/" className="btn-secondary">
                  Back to Home
                </Link>
              </div>

              <p className="email-note">
                Need help? Call us at 210-666-8888 or visit 123 Main St, San Antonio, TX.
              </p>
            </>
          )}
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
