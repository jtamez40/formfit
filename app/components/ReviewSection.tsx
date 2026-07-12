// app/components/ReviewSection.tsx
"use client";
import { useState, useEffect } from "react";
import "./ReviewSection.css";

interface Review {
  reviewer: string;
  date_reviewed: string; // mm/dd/yyyy
  star_rating: number;
  message?: string;
}

const STAR_GOLD = "#DAA520"; // gold color

function formatDate(dateStr: string) {
  const [month, day, year] = dateStr.split("/");
  const date = new Date(`${year}-${month}-${day}`);
  return date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
}

export default function ReviewSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<number | null>(null); // null = All
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetch("/data/cap-reviews.json")
      .then((r) => r.json())
      .then((data) => setReviews(data))
      .catch(() => setReviews([]));
  }, []);

  const filtered = filter ? reviews.filter((r) => r.star_rating === filter) : reviews;
  const avg = filtered.reduce((sum, r) => sum + r.star_rating, 0) / (filtered.length || 1);
  const avgRounded = Math.round(avg * 10) / 10;

  const featured = reviews.find((r) => r.reviewer === "Janet");
  const previews = filtered.filter((r) => r !== featured).slice(0, 3);

  const starElements = (rating: number) => (
    <span aria-label={`${rating} out of 5 stars`} className="customer-reviews-stars">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < rating ? STAR_GOLD : "#ccc" }}>★</span>
      ))}
    </span>
  );

  const filterButtons = [
    { label: "All", value: null, count: reviews.length },
    { label: "5 Stars", value: 5, count: reviews.filter((r) => r.star_rating === 5).length },
    { label: "4 Stars", value: 4, count: reviews.filter((r) => r.star_rating === 4).length },
    { label: "3 Stars", value: 3, count: reviews.filter((r) => r.star_rating === 3).length },
    { label: "2 Stars", value: 2, count: reviews.filter((r) => r.star_rating === 2).length },
    { label: "1 Star", value: 1, count: reviews.filter((r) => r.star_rating === 1).length },
  ];

  return (
    <section className="customer-reviews-section" aria-labelledby="customer-reviews-heading">
      <h2 id="customer-reviews-heading" className="customer-reviews-header">
        Real Reviews From Real Customers
      </h2>
      <div className="customer-reviews-summary">
        {avgRounded} out of 5 based on {reviews.length} customer ratings
        <small className="customer-reviews-attribution">Originally reviewed on Etsy</small>
      </div>
      <div className="customer-reviews-filters" role="tablist" aria-label="Review rating filter">
        {filterButtons.map((btn) => (
          <button
            key={btn.label}
            role="tab"
            aria-selected={filter === btn.value}
            className={`customer-reviews-pill ${filter === btn.value ? "active" : ""}`}
            onClick={() => setFilter(btn.value)}
          >
            {btn.label} ({btn.count})
          </button>
        ))}
      </div>

      {featured && (
        <article className="customer-reviews-card customer-reviews-featured" aria-label="Featured review">
          <div className="customer-reviews-featured-stars">{starElements(featured.star_rating)}</div>
          <p className="customer-reviews-message">{featured.message}</p>
          <footer className="customer-reviews-meta">
            <span className="customer-reviews-reviewer">{featured.reviewer}</span>,{' '}
            <time dateTime={featured.date_reviewed}>{formatDate(featured.date_reviewed)}</time>
            <span className="customer-reviews-verified">Verified customer</span>
          </footer>
        </article>
      )}

      <div className="customer-reviews-preview-grid">
        {previews.map((r, i) => (
          <article key={i} className="customer-reviews-card" aria-label={`Review by ${r.reviewer}`}>
            <div className="customer-reviews-stars">{starElements(r.star_rating)}</div>
            {r.message ? (
              <p className="customer-reviews-message">
                {r.message.length > 120 ? r.message.slice(0, 117) + "..." : r.message}
              </p>
            ) : (
              <p className="customer-reviews-rating-only">Rating only</p>
            )}
            <footer className="customer-reviews-meta">
              <span className="customer-reviews-reviewer">{r.reviewer.split(' ')[0]}</span>,{' '}
              <time dateTime={r.date_reviewed}>{formatDate(r.date_reviewed)}</time>
              <span className="customer-reviews-verified">Verified customer</span>
            </footer>
          </article>
        ))}
      </div>

      {reviews.length > 3 && (
        <button
          className="customer-reviews-expand-toggle"
          aria-expanded={expanded}
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? `Show Fewer Reviews` : `Read All ${reviews.length} Reviews`}
        </button>
      )}

      {expanded && (
        <div className="customer-reviews-expanded" role="region" aria-label="All reviews">
          {filtered.map((r, i) => (
            <article key={i} className="customer-reviews-card" aria-label={`Review by ${r.reviewer}`}>
              <div className="customer-reviews-stars">{starElements(r.star_rating)}</div>
              {r.message ? (
                <p className="customer-reviews-message">{r.message}</p>
              ) : (
                <p className="customer-reviews-rating-only">Rating only</p>
              )}
              <footer className="customer-reviews-meta">
                <span className="customer-reviews-reviewer">{r.reviewer}</span>,{' '}
                <time dateTime={r.date_reviewed}>{formatDate(r.date_reviewed)}</time>
                <span className="customer-reviews-verified">Verified customer</span>
              </footer>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
