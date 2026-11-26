"use client";

import React, { useId, useState } from "react";
import { FAQ_ITEMS } from "@/data/siteContent";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section
      id="faq"
      className="deferred-section relative z-30 bg-white px-5 py-16 text-[#2A2725] sm:px-6 md:px-10 md:py-28"
    >
      <div className="mx-auto max-w-4xl">
        <div className="border-b border-[#0f3a2e]/15 pb-7 md:pb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#155341]">
            FAQ
          </p>
          <h2 className="mt-2 font-serif text-[clamp(2rem,1rem+3vw,3.75rem)] leading-[0.98] text-[#0f3a2e]">
            Common questions, answered.
          </h2>
        </div>

        <div className="mt-8 divide-y divide-[#0f3a2e]/12">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            const panelId = `${baseId}-panel-${idx}`;
            return (
              <div key={item.question} className="py-4">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 py-2 text-left font-sans text-base font-semibold text-[#0f3a2e] transition-colors hover:text-[#155341] md:text-lg"
                  >
                    <span>{item.question}</span>
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#0f3a2e]/20 text-lg leading-none"
                    >
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  hidden={!isOpen}
                  className="pt-2 pr-10 text-sm leading-relaxed text-[#2A2725]/80 md:text-base"
                >
                  {item.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
