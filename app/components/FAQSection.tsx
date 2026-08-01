"use client";
import { useState, type ReactNode } from "react";
import "./FAQSection.css";

interface FAQItem {
  question: string;
  answer: ReactNode;
}

const faqData: FAQItem[] = [
  {
    question: "Is this a children’s hat?",
    answer: (
      <>
        <p>No. This cap is designed as adult workwear for people with smaller heads or anyone who prefers a shallow, high-and-tight fit. However, its smaller size may also fit some older children.</p>
        <p>The cap measures approximately 20 inches around and provides about half an inch of stretch.</p>
      </>
    ),
  },
  { question: "Is this cap unisex?", answer: "Yes. The cap has a simple unisex design and can be worn by anyone who needs comfortable, secure hair coverage." },
  { question: "Is the entire cap satin-lined?", answer: "No. The inner band that rests against your hair is satin-lined to help reduce friction. The top of the cap uses breathable, non-see-through fabric to promote airflow and keep your head cooler during work." },
  { question: "Will the black fabric bleed or fade?", answer: "The cap is made with quality fabric intended for repeated use in hot, active work environments. For best results and to preserve the color, wash it with similar dark colors and avoid bleach." },
  { question: "Is this cap only for cooks?", answer: "No. Although it was designed with cooks and restaurant workers in mind, it can be used in many workplaces where hair must be covered. This includes kitchens, bakeries, catering, food preparation, healthcare, manufacturing, cleaning, beauty services, and other active work environments." },
  { question: "Is black the only available color?", answer: "Yes. Black is currently the only available color while we introduce and test the original design. We plan to offer additional colors and designs in the future." },
  { question: "Can I return the cap?", answer: "Yes. Returns are accepted as long as the cap is unused, unworn in a work environment, and returned in its original condition. For hygiene reasons, caps that have been worn during a work shift or show signs of use cannot be returned." },
  {
    question: "How can I tell whether the cap will fit me?",
    answer: (
      <>
        <p>Use a flexible measuring tape around your head where the cap’s band will sit, usually just above your eyebrows and ears.</p>
        <p>If you do not have a flexible measuring tape:</p>
        <ol>
          <li>Wrap a non-stretch string around your head.</li>
          <li>Mark where the ends meet.</li>
          <li>Lay the string flat against a ruler or measuring tape.</li>
          <li>Compare your measurement with the cap’s approximately 20-inch circumference and half inch of stretch.</li>
        </ol>
        <p>The cap is intended to fit closely. If your measurement is significantly larger than 20½ inches, it may feel too snug.</p>
      </>
    ),
  },
  {
    question: "Is the cap machine washable?",
    answer: (
      <>
        <p>Yes. The cap is machine washable. For best results:</p>
        <ul>
          <li>Wash with similar dark colors</li>
          <li>Use cold water</li>
          <li>Select a gentle cycle</li>
          <li>Avoid bleach</li>
          <li>Air-dry when possible to help protect the satin band and elastic</li>
        </ul>
      </>
    ),
  },
  {
    question: "How quickly will my order arrive?",
    answer: "Orders are prepared and shipped every day except Sunday. Most orders leave within 24 hours. After shipment, standard postal delivery generally takes approximately 1–7 business days. Actual delivery time depends on the postal service and the customer’s location.",
  },
  { question: "Do you offer express shipping?", answer: "Express shipping is not currently available. However, we prepare orders quickly and aim to ship every order within 24 hours, excluding Sundays." },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="faq-section-container" aria-labelledby="faq-section-header">
      <div className="faq-section-header">
        <h2 id="faq-section-header">Frequently Asked Questions</h2>
        <p className="faq-section-subtitle">Find quick answers about sizing, materials, care, returns, and shipping.</p>
      </div>
      <ul className="faq-section-list">
        {faqData.map((item, i) => (
          <li key={i} className="faq-section-item">
            <button
              className="faq-section-question"
              id={`faq-question-${i}`}
              aria-controls={`faq-answer-${i}`}
              aria-expanded={openIndex === i}
              onClick={() => toggle(i)}
            >
              <span>{item.question}</span>
              <span className="faq-section-icon" aria-hidden="true">
                {openIndex === i ? "−" : "+"}
              </span>
            </button>
            <div
              id={`faq-answer-${i}`}
              className="faq-section-answer"
              role="region"
              aria-labelledby={`faq-question-${i}`}
              hidden={openIndex !== i}
            >
              {item.answer}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
