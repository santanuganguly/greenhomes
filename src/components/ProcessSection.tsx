"use client";

import React from "react";
import { PROCESS_STEPS } from "@/data/siteContent";
import { useContact } from "./ContactContext";

export function ProcessSection() {
  const { openContact } = useContact();

  return (
    <section
      id="process"
      className="deferred-section relative z-30 bg-[#FAF8F4] px-5 py-16 text-[#2A2725] sm:px-6 md:px-10 md:py-28"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-col justify-between gap-4 border-b border-[#0f3a2e]/15 pb-7 md:flex-row md:items-end md:gap-6 md:pb-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#155341]">
              Construction Process
            </p>
            <h2 className="mt-2 font-serif text-[clamp(2rem,1rem+3.2vw,4rem)] leading-[0.95] text-[#0f3a2e]">
              From first call to keys in your hand.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[#2A2725]/80 md:text-base">
            Six structured milestones with locked per-sqft pricing, contractual completion dates, and single-point engineering accountability.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PROCESS_STEPS.map((step) => (
            <article
              key={step.num}
              className="flex flex-col justify-between rounded-[24px] border border-[#0f3a2e]/12 bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1"
            >
              <div>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#155341]">
                    {step.code}
                  </span>
                  <span className="font-serif text-3xl font-semibold text-[#2fa37f]">
                    {step.num}
                  </span>
                </div>
                <h3 className="mt-3 font-sans text-lg font-semibold text-[#0f3a2e]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#2A2725]/80">
                  {step.summary}
                </p>
              </div>

              <ul className="mt-5 space-y-1.5 border-t border-dashed border-[#0f3a2e]/15 pt-4 text-xs text-[#2A2725]/80">
                {step.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2">
                    <span aria-hidden="true" className="font-bold text-[#155341]">
                      ✓
                    </span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#estimator"
            className="rounded-full bg-[#0f3a2e] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#155341]"
          >
            Estimate Project Cost →
          </a>
          <button
            type="button"
            onClick={() => openContact({ service: "home" })}
            className="cursor-pointer rounded-full border border-[#0f3a2e]/30 px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#0f3a2e] transition-colors hover:bg-[#0f3a2e] hover:text-white"
          >
            Schedule Site Consultation
          </button>
        </div>
      </div>
    </section>
  );
}
