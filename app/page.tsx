"use client";

import { useState, useRef, useEffect } from "react";
import ReviewSection from "./components/ReviewSection";
import FAQSection from "./components/FAQSection";



const mediaItems = [
  {
    type: "video",
    src: "/products/capVideo.mp4",
    poster: "/products/breathableMesh.jpeg",
    alt: "Product demonstration video",
  },
  { type: "image", src: "/products/breathableMesh.jpeg", alt: "Close view of the breathable black mesh crown" },
  { type: "image", src: "/products/satinLined.jpeg", alt: "Smooth satin lining inside the cap" },
  { type: "image", src: "/products/elasticBand.jpeg", alt: "Expandable elastic band and hair pouch" },
  { type: "image", src: "/products/heightWide.jpeg", alt: "Shallow cap height shown beside a measuring tape" },
  { type: "image", src: "/products/lengthWide.jpeg", alt: "Form-fitting cap width shown beside a measuring tape" },
  { type: "image", src: "/products/heightZoom.jpeg", alt: "Detailed cap height measurement" },
  { type: "image", src: "/products/lenghtZoom.jpeg", alt: "Detailed cap width measurement" },
];

const features = [
  {
    eyebrow: "FORM-FITTING DESIGN",
    title: "Finally, a work cap made for smaller heads.",
    body: "Most work caps use a generic “one size fits most” shape, leaving extra fabric that looks bulky and feels awkward. We raised the band and reduced the circumference for a shallower, closer fit that stays professional through your entire shift.",
    src: "/products/heightWide.jpeg",
    alt: "Shallow cap profile measured beside a tape",
  },
  {
    eyebrow: "SATIN-LINED INTERIOR",
    title: "Take care of your hair while you work.",
    body: "Ordinary cap fabrics can create friction and absorb moisture during long shifts. The smooth satin lining helps retain your hair’s natural moisture while reducing friction, dryness, frizz, and hat hair—without needing a separate bonnet underneath.",
    src: "/products/satinLined.jpeg",
    alt: "Satin-lined interior of the cooking cap",
  },
  {
    eyebrow: "BREATHABLE MESH",
    title: "Cooling airflow. Nothing showing through.",
    body: "The micro-perforated crown promotes airflow in a hot, active kitchen while remaining non-transparent. Unlike thin mesh caps that reveal the hair or scalp beneath, this cap maintains the polished appearance of a solid, enclosed work cap.",
    src: "/products/breathableMesh.jpeg",
    alt: "Breathable non-see-through cap material",
  },
  {
    eyebrow: "SECURE ELASTIC BAND",
    title: "Stays firm, comfortable, and enclosed.",
    body: "An expandable elastic band keeps the cap secure as you move. A discreet pouch at the back gives short-to-medium hair a place to tuck in, keeping loose hair contained without the oversized shape of a traditional bouffant cap.",
    src: "/products/elasticBand.jpeg",
    alt: "Elastic band and discreet rear hair pouch",
  },
];

export default function Home() {
  const [active, setActive] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const price = 24.99;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (mediaItems[active].type === "video") {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  }, [active]);

  const move = (direction: number) =>
    setActive((current) => (current + direction + mediaItems.length) % mediaItems.length);

  return (
    <main>
      <div className="announcement">FREE U.S. SHIPPING ON 2+ CAPS</div>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Form Fit home"><span>FORM</span> FIT</a>
        <div className="header-proof"><span className="stars">★★★★★</span> Made for real kitchen shifts</div>
      </header>

      <section className="hero" id="top">
        <div className="left-column">
          <div className="carousel" aria-label="Product image carousel">
            <button className="arrow" onClick={() => move(-1)} aria-label="Previous product image">‹</button>
            <div className="carousel-main">
              {mediaItems[active].type === "video" ? (
                <video ref={videoRef} src={mediaItems[active].src} poster={mediaItems[active].poster} autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <img src={mediaItems[active].src} alt={mediaItems[active].alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              )}
            </div>
            <button className="arrow" onClick={() => move(1)} aria-label="Next product image">›</button>
          </div>
          <div className="thumbs">
            {mediaItems.map((item, index) => (
              <button key={index} className={index === active ? "thumb active" : "thumb"} onClick={() => setActive(index)} aria-label={`View ${item.type} ${index + 1}`}>
                {item.type === "video" ? (
                  <div style={{ position: "relative", width: "100%", height: "100%" }}>
                    <img src={item.poster} alt={item.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "24px", color: "white" }}>▶</span>
                  </div>
                ) : (
                  <img src={item.src} alt={item.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                )}
              </button>
            ))}
          </div>
          <div className="hero-copy">
            <p className="kicker">SATIN-LINED • SHALLOW FIT • BREATHABLE</p>
            <h1>The Kitchen Cap That Actually Fits Smaller Heads.</h1>
            <p className="lead">No bulky fabric. No visible mesh. No extra bonnet underneath. Just a secure, high-and-tight fit built for long shifts.</p>
            <div className="trust-row">
              <span>✓ Hair-friendly satin</span><span>✓ Non-see-through mesh</span><span>✓ Secure elastic fit</span>
            </div>
          </div>
        </div>

        <aside className="checkout-card" aria-label="Mock checkout form">
          <div className="secure"><span>FORM FIT</span><span>🔒 Secure checkout</span></div>
          <div className="order-product">
            <img src="/products/elasticBand.jpeg" alt="Black satin-lined cooking cap" />
            <div><b>Form Fit Satin-Lined Cooking Cap</b><p>Black · Shallow Fit</p></div>
            <strong>${price.toFixed(2)}</strong>
          </div>
          <label>Quantity</label>
          <div className="quantity">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity">−</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity">+</button>
          </div>
          <label>Email</label><input type="email" placeholder="you@example.com" />
          <label>Card information</label>
          <div className="card-field"><input placeholder="1234 1234 1234 1234" /><div><input placeholder="MM / YY"/><input placeholder="CVC"/></div></div>
          <label>Name on card</label><input placeholder="Full name" />
          <label>Shipping address</label>
          <select aria-label="Country"><option>United States</option></select>
          <input placeholder="Address" />
          <div className="checkout-total"><span>Total</span><strong>${(price * quantity).toFixed(2)}</strong></div>
          <button className="buy-button">Complete Order</button>
          <p className="mock-note">Preview checkout — no payment will be processed.</p>
          <div className="payment-marks"><span>VISA</span><span>mastercard</span><span>AMEX</span><span>Pay</span></div>
        </aside>
      </section>

      <section className="proof-strip">
        <div><b>SHALLOW FIT</b><span>Less unnecessary fabric</span></div>
        <div><b>SATIN LINED</b><span>Gentler on your hair</span></div>
        <div><b>BREATHABLE</b><span>Made for hot kitchens</span></div>
        <div><b>SECURE</b><span>Built for active shifts</span></div>
      </section>

      <section className="story-intro">
        <p className="kicker">WHY WE MADE IT</p>
        <h2>Work headwear shouldn’t be something you simply put up with.</h2>
        <p>Generic caps are built to fit the widest range of people—not to fit you well. Form Fit was designed around the real problems restaurant workers face: excess fabric, trapped heat, slipping caps, and hair damage after long shifts.</p>
      </section>

      <section className="features">
        {features.map((feature, index) => (
          <article className={`feature ${index % 2 ? "reverse" : ""}`} key={feature.title}>
            <div className="feature-image"><img src={feature.src} alt={feature.alt} /></div>
            <div className="feature-copy"><p className="kicker">{feature.eyebrow}</p><h2>{feature.title}</h2><p>{feature.body}</p></div>
          </article>
        ))}
      </section>
          <ReviewSection />
        <FAQSection />

      <section className="for-work">
        <p className="kicker">UNIVERSAL WORK WEAR</p>
        <h2>Designed for the kitchen. Ready for any active workplace.</h2>
        <p>Cooks, bakers, food-prep teams, caterers, baristas, production workers, and anyone who needs secure hair coverage can enjoy a cooler, cleaner, more comfortable fit.</p>
        <a className="cta" href="#top">Shop the Form Fit Cap — $24.99</a>
        <small>Secure checkout · Easy ordering · Built for daily wear</small>
      </section>

      <footer><div className="brand"><span>FORM</span> FIT</div><div>123 Main St, San Antonio, TX</div><a href="tel:2106668888">210-666-8888</a><div>© 2026 Form Fit. All rights reserved.</div></footer>
    </main>
  );
}
