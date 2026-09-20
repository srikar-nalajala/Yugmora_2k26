// components/sections/Faq.tsx — FAQ accordion with FAQPage JSON-LD (§13)
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faqs } from "@/content/faq";
import { fadeInUp } from "@/lib/motion";

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // FAQPage JSON-LD schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 lg:py-32 relative bg-surface-1/30">
      {/* FAQPage JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="mono-label mb-4">[ KNOWLEDGE BASE ]</p>
          <h2 className="section-heading neon-text mb-4">
            Frequently Asked Questions
          </h2>
          <p className="section-subtitle mx-auto">
            Everything you need to know about eligibility, logistics, problem statements, and the internship mela.
          </p>
        </motion.div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="hud-card border border-line bg-surface-1/80 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-display font-semibold text-base sm:text-lg text-text">
                    {faq.q}
                  </span>
                  <span
                    className={`font-mono text-lg text-neon-cyan transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-45 text-neon-pink" : ""
                    }`}
                  >
                    +
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-0 border-t border-line/40 text-text-muted text-sm sm:text-base leading-relaxed">
                        <p>{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Have more questions banner */}
        <div className="text-center mt-12">
          <p className="font-mono text-xs text-text-muted">
            Still have queries? Reach out directly to our coordinators below or drop into our community channels.
          </p>
        </div>
      </div>
    </section>
  );
}
