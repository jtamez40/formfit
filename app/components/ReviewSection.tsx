"use client";
import { useState, useEffect, useRef } from "react";
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
  const [collapsed, setCollapsed] = useState(false);
  const [modalReview, setModalReview] = useState<Review | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Load reviews
  useEffect(() => {
    fetch("/data/cap-reviews.json")
      .then((r) => r.json())
      .then((data) => setReviews(data))
      .catch(() => setReviews([]));
  }, []);

  // Filtered reviews
  const filtered = filter ? reviews.filter((r) => r.star_rating === filter) : reviews;

  // Ensure Janet appears first for All and 5‑Star filters
  const janet = filtered.find((r) => r.reviewer === "Janet");
  const others = filtered.filter((r) => r.reviewer !== "Janet");
  const ordered = (filter === null || filter === 5) && janet ? [janet, ...others] : others;

  const avg = ordered.reduce((sum, r) => sum + r.star_rating, 0) / (ordered.length || 1);
  const avgRounded = Math.round(avg * 10) / 10;

  const filterButtons = [
    { label: "All", value: null, count: reviews.length },
    { label: "5 Stars", value: 5, count: reviews.filter((r) => r.star_rating === 5).length },
    { label: "4 Stars", value: 4, count: reviews.filter((r) => r.star_rating === 4).length },
    { label: "3 Stars", value: 3, count: reviews.filter((r) => r.star_rating === 3).length },
    { label: "2 Stars", value: 2, count: reviews.filter((r) => r.star_rating === 2).length },
    { label: "1 Star", value: 1, count: reviews.filter((r) => r.star_rating === 1).length },
  ];

  // Reset scroll when filter changes
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, [filter]);

  const scrollCarousel = (direction: "prev" | "next") => {
    if (!carouselRef.current) return;
    const child = carouselRef.current.firstElementChild as HTMLElement | null;
    const cardWidth = child ? child.offsetWidth + 16 /* margin */ : 300;
    const amount = direction === "prev" ? -cardWidth : cardWidth;
    carouselRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  const renderStars = (rating: number) => (
    <span aria-label={`${rating} out of 5 stars`} className="customer-reviews-stars">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < rating ? STAR_GOLD : "#ccc" }}>★</span>
      ))}
    </span>
  );

  const openModal = (r: Review) => setModalReview(r);
  const closeModal = () => setModalReview(null);

  return (
    <section className="customer-reviews-section" aria-labelledby="customer-reviews-heading">
      <div className="customer-reviews-header-row">
        <h2 id="customer-reviews-heading" className="customer-reviews-header">
          Real Reviews From Real Customers
        </h2>
        <button
          className="customer-reviews-collapse-toggle"
          aria-expanded={!collapsed}
          onClick={() => setCollapsed((c) => !c)}
        >
          {collapsed ? "Show Reviews" : "Hide Reviews"}
        </button>
      </div>

      {collapsed ? (
        <div className="customer-reviews-collapsed-summary">
          <div className="customer-reviews-summary">
            {avgRounded} out of 5 based on {reviews.length} customer ratings
            <small className="customer-reviews-attribution">Originally reviewed on Etsy</small>
          </div>
        </div>
      ) : (
        <>
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

          {ordered.length === 0 ? (
            <div className="customer-reviews-no-results">No reviews with this rating yet.</div>
          ) : (
            <div className="customer-reviews-carousel-wrapper">
              <button
                className="customer-reviews-carousel-arrow prev"
                aria-label="Previous reviews"
                onClick={() => scrollCarousel("prev")}
                disabled={carouselRef.current?.scrollLeft === 0}
              >
                &#9664;
              </button>
              <div className="customer-reviews-carousel" ref={carouselRef}>
                {ordered.map((r, i) => (
                  <article key={i} className="customer-reviews-card" aria-label={`Review by ${r.reviewer}`}>
                    {renderStars(r.star_rating)}
                    {r.message ? (
                      <p className="customer-reviews-message">
                        {r.message.length > 200 ? (
                          <>
                            {r.message.slice(0, 200)}...
                            <button className="customer-reviews-readmore" onClick={() => openModal(r)}>
                              Read more
                            </button>
                          </>
                        ) : (
                          r.message
                        )}
                      </p>
                    ) : (
                      <p className="customer-reviews-rating-only">Rating only</p>
                    )}
                    <div className="customer-reviews-card-meta">
                      <span className="customer-reviews-card-author">{r.reviewer.split(' ')[0]}</span>
                      <time className="customer-reviews-card-date" dateTime={r.date_reviewed}>
                        {formatDate(r.date_reviewed)}
                      </time>
                      <span className="customer-reviews-verified">Verified customer</span>
                    </div>
                  </article>
                ))}
              </div>
              <button
                className="customer-reviews-carousel-arrow next"
                aria-label="Next reviews"
                onClick={() => scrollCarousel("next")}
                disabled={Boolean(carouselRef.current && carouselRef.current.scrollWidth - carouselRef.current.clientWidth <= carouselRef.current.scrollLeft + 1)}
              >
                &#9654;
              </button>
            </div>
          )}
        </>
      )}

      {modalReview && (
        <div className="customer-reviews-modal" role="dialog" aria-modal="true">
          <div className="customer-reviews-modal-content">
            <button className="customer-reviews-modal-close" aria-label="Close" onClick={closeModal}>
              &times;
            </button>
            <h3>{modalReview.reviewer}</h3>
            {renderStars(modalReview.star_rating)}
            <p>{modalReview.message}</p>
            <div className="customer-reviews-card-meta">
              <span className="customer-reviews-card-author">{modalReview.reviewer}</span>
              <time className="customer-reviews-card-date" dateTime={modalReview.date_reviewed}>
                {formatDate(modalReview.date_reviewed)}
              </time>
              <span className="customer-reviews-verified">Verified customer</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
