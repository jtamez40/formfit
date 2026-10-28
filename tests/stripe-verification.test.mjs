import assert from "node:assert/strict";
import test from "node:test";
import { formatCurrency, verifyCheckoutSession, setStripeClient } from "../lib/stripe.ts";

test("formatCurrency handles valid and invalid inputs", () => {
  assert.equal(formatCurrency(2499, "usd"), "$24.99");
  assert.equal(formatCurrency(4998, "usd"), "$49.98");
  assert.equal(formatCurrency(0, "usd"), "$0.00");
  assert.equal(formatCurrency(null, "usd"), "");
  assert.equal(formatCurrency(undefined, "usd"), "");
});

test("verifyCheckoutSession returns no_session when missing session_id", async () => {
  const result = await verifyCheckoutSession("");
  assert.equal(result.verified, false);
  assert.equal(result.status, "no_session");
});

test("verifyCheckoutSession detects literal {CHECKOUT_SESSION_ID} placeholder", async () => {
  const result = await verifyCheckoutSession("{CHECKOUT_SESSION_ID}");
  assert.equal(result.verified, false);
  assert.equal(result.status, "placeholder");
});

test("verifyCheckoutSession does not verify if STRIPE_SECRET_KEY is not configured", async () => {
  const originalKey = process.env.STRIPE_SECRET_KEY;
  delete process.env.STRIPE_SECRET_KEY;
  setStripeClient(null);

  try {
    const result = await verifyCheckoutSession("cs_test_mock_12345");
    assert.equal(result.verified, false);
    assert.equal(result.status, "error");
    assert.match(result.errorMessage, /secret key/i);
  } finally {
    if (originalKey) {
      process.env.STRIPE_SECRET_KEY = originalKey;
    }
  }
});

test("verifyCheckoutSession parses verified paid session correctly", async () => {
  const mockStripe = {
    checkout: {
      sessions: {
        retrieve: async (id) => {
          assert.equal(id, "cs_test_paid_123");
          return {
            id,
            payment_status: "paid",
            status: "complete",
            amount_total: 2499,
            currency: "usd",
            customer_details: { email: "chef@example.com", name: "Chef Marcus" },
            line_items: {
              data: [
                {
                  description: "Form Fit Satin Cooking Cap",
                  quantity: 1,
                  amount_total: 2499,
                },
              ],
            },
          };
        },
      },
    },
  };

  setStripeClient(mockStripe);

  try {
    const result = await verifyCheckoutSession("cs_test_paid_123");
    assert.equal(result.verified, true);
    assert.equal(result.status, "paid");
    assert.equal(result.customerEmail, "chef@example.com");
    assert.equal(result.formattedTotal, "$24.99");
    assert.equal(result.lineItems?.length, 1);
    assert.equal(result.lineItems[0].formattedAmount, "$24.99");
  } finally {
    setStripeClient(null);
  }
});

test("verifyCheckoutSession does not verify unpaid sessions", async () => {
  const mockStripe = {
    checkout: {
      sessions: {
        retrieve: async (id) => {
          return {
            id,
            payment_status: "unpaid",
            status: "open",
            amount_total: 2499,
            currency: "usd",
            customer_details: null,
            line_items: { data: [] },
          };
        },
      },
    },
  };

  setStripeClient(mockStripe);

  try {
    const result = await verifyCheckoutSession("cs_test_unpaid_123");
    assert.equal(result.verified, false);
    assert.equal(result.status, "unpaid");
  } finally {
    setStripeClient(null);
  }
});
