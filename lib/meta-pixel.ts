export const FB_PIXEL_ID =
  process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "2051072762253741";

/**
 * Trigger Meta Pixel standard PageView event.
 */
export const pageview = (): void => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "PageView");
  }
};

/**
 * Trigger custom or standard Meta Pixel events.
 */
export const event = (
  name: string,
  options: Record<string, unknown> = {}
): void => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", name, options);
  }
};

export interface ViewContentParams {
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  content_type?: string;
  value?: number;
  currency?: string;
  [key: string]: unknown;
}

export interface InitiateCheckoutParams {
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  content_type?: string;
  contents?: Array<{ id: string; quantity: number; item_price?: number }>;
  currency?: string;
  num_items?: number;
  value?: number;
  [key: string]: unknown;
}

export interface PurchaseParams {
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  content_type?: string;
  contents?: Array<{ id: string; quantity: number; item_price?: number }>;
  currency?: string;
  num_items?: number;
  value?: number;
  [key: string]: unknown;
}

/**
 * Track ViewContent event when viewing a product or key page content.
 */
export const trackViewContent = (params?: ViewContentParams): void => {
  event("ViewContent", params as Record<string, unknown>);
};

/**
 * Track InitiateCheckout event when a user enters the checkout funnel.
 */
export const trackInitiateCheckout = (params?: InitiateCheckoutParams): void => {
  event("InitiateCheckout", params as Record<string, unknown>);
};

/**
 * Track Purchase event on verified transactions.
 * Note: Keep inactive until verified Stripe payments are connected.
 */
export const trackPurchase = (params?: PurchaseParams): void => {
  event("Purchase", params as Record<string, unknown>);
};
