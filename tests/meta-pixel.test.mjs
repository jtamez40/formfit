import assert from "node:assert/strict";
import test from "node:test";
import {
  FB_PIXEL_ID,
  pageview,
  event,
  trackViewContent,
  trackInitiateCheckout,
  trackPurchase,
} from "../lib/meta-pixel.ts";

test("FB_PIXEL_ID matches the expected Meta Pixel ID", () => {
  assert.equal(FB_PIXEL_ID, "2051072762253741");
});

test("pageview calls window.fbq with PageView", () => {
  const calls = [];
  global.window = {
    fbq: (...args) => calls.push(args),
  };

  try {
    pageview();
    assert.equal(calls.length, 1);
    assert.deepEqual(calls[0], ["track", "PageView"]);
  } finally {
    delete global.window;
  }
});

test("pageview does not crash when window or fbq is undefined", () => {
  // window undefined
  assert.doesNotThrow(() => pageview());

  // window defined but fbq undefined
  global.window = {};
  try {
    assert.doesNotThrow(() => pageview());
  } finally {
    delete global.window;
  }
});

test("event tracks generic custom event", () => {
  const calls = [];
  global.window = {
    fbq: (...args) => calls.push(args),
  };

  try {
    event("CustomEvent", { key: "value" });
    assert.equal(calls.length, 1);
    assert.deepEqual(calls[0], ["track", "CustomEvent", { key: "value" }]);
  } finally {
    delete global.window;
  }
});

test("trackViewContent calls window.fbq with ViewContent", () => {
  const calls = [];
  global.window = {
    fbq: (...args) => calls.push(args),
  };

  try {
    const params = {
      content_name: "Satin-Lined Cooking Cap",
      content_ids: ["prod_UzjsDw0hzgDKrA"],
      content_type: "product",
      value: 24.99,
      currency: "USD",
    };
    trackViewContent(params);
    assert.equal(calls.length, 1);
    assert.deepEqual(calls[0], ["track", "ViewContent", params]);
  } finally {
    delete global.window;
  }
});

test("trackInitiateCheckout calls window.fbq with InitiateCheckout", () => {
  const calls = [];
  global.window = {
    fbq: (...args) => calls.push(args),
  };

  try {
    const params = {
      content_ids: ["prod_UzjsDw0hzgDKrA"],
      content_type: "product",
      num_items: 2,
      value: 49.98,
      currency: "USD",
    };
    trackInitiateCheckout(params);
    assert.equal(calls.length, 1);
    assert.deepEqual(calls[0], ["track", "InitiateCheckout", params]);
  } finally {
    delete global.window;
  }
});

test("trackPurchase calls window.fbq with Purchase", () => {
  const calls = [];
  global.window = {
    fbq: (...args) => calls.push(args),
  };

  try {
    const params = {
      content_ids: ["prod_UzjsDw0hzgDKrA"],
      content_type: "product",
      num_items: 1,
      value: 24.99,
      currency: "USD",
    };
    trackPurchase(params);
    assert.equal(calls.length, 1);
    assert.deepEqual(calls[0], ["track", "Purchase", params]);
  } finally {
    delete global.window;
  }
});
