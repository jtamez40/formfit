import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function setStripeClient(client: Stripe | null) {
  stripeInstance = client;
}

export function getStripe(): Stripe | null {
  if (stripeInstance) {
    return stripeInstance;
  }
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return null;
  }
  stripeInstance = new Stripe(secretKey);
  return stripeInstance;
}

export interface VerificationResult {
  verified: boolean;
  status: "paid" | "unpaid" | "no_session" | "placeholder" | "not_found" | "error";
  sessionId?: string;
  customerEmail?: string | null;
  customerName?: string | null;
  amountTotal?: number | null;
  currency?: string | null;
  formattedTotal?: string | null;
  lineItems?: Array<{
    description: string;
    quantity: number | null;
    amount: number;
    formattedAmount?: string;
  }>;
  errorMessage?: string;
}

export function formatCurrency(
  amountInCents: number | null | undefined,
  currency: string | null | undefined = "usd"
): string {
  if (typeof amountInCents !== "number") return "";
  const curr = (currency || "usd").toUpperCase();
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: curr,
    }).format(amountInCents / 100);
  } catch {
    return `$${(amountInCents / 100).toFixed(2)}`;
  }
}

export async function verifyCheckoutSession(
  sessionId?: string
): Promise<VerificationResult> {
  if (!sessionId || !sessionId.trim()) {
    return {
      verified: false,
      status: "no_session",
      errorMessage: "No checkout session ID was provided in the URL.",
    };
  }

  const cleanSessionId = sessionId.trim();

  // If literal placeholder was not substituted (e.g. {CHECKOUT_SESSION_ID})
  if (
    cleanSessionId === "{CHECKOUT_SESSION_ID}" ||
    cleanSessionId.includes("{") ||
    cleanSessionId.includes("}")
  ) {
    return {
      verified: false,
      status: "placeholder",
      sessionId: cleanSessionId,
      errorMessage:
        "The URL contains an unpopulated session placeholder ({CHECKOUT_SESSION_ID}).",
    };
  }

  const stripe = getStripe();
  if (!stripe) {
    console.warn("STRIPE_SECRET_KEY environment variable is not configured.");
    return {
      verified: false,
      status: "error",
      sessionId: cleanSessionId,
      errorMessage:
        "Stripe verification is currently unavailable because the server secret key is not configured.",
    };
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(cleanSessionId, {
      expand: ["line_items", "customer_details"],
    });

    const isPaid = session.payment_status === "paid";
    const currency = session.currency || "usd";

    const lineItems =
      session.line_items?.data.map((item) => ({
        description: item.description || "Form Fit Satin Cooking Cap",
        quantity: item.quantity,
        amount: item.amount_total,
        formattedAmount: formatCurrency(item.amount_total, currency),
      })) || [];

    return {
      verified: isPaid,
      status: isPaid ? "paid" : "unpaid",
      sessionId: session.id,
      customerEmail: session.customer_details?.email || null,
      customerName: session.customer_details?.name || null,
      amountTotal: session.amount_total,
      currency,
      formattedTotal: formatCurrency(session.amount_total, currency),
      lineItems,
    };
  } catch (err: any) {
    console.error("Error retrieving Stripe Checkout Session:", err?.message || err);
    const isNotFound = err?.statusCode === 404 || err?.code === "resource_missing";
    return {
      verified: false,
      status: isNotFound ? "not_found" : "error",
      sessionId: cleanSessionId,
      errorMessage:
        err?.message || "Failed to retrieve checkout session details from Stripe.",
    };
  }
}
