import React from "react";
import { FOUR_PROMISES } from "@/data/siteContent";

export function WhyGreenHomesSection() {
  return (
    <section
      id="why-green-homes"
      className="deferred-section relative z-30 bg-[#EDE6D6] px-5 py-16 text-[#2A2725] sm:px-6 md:px-10 md:py-28"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-col justify-between gap-4 border-b border-[#0f3a2e]/15 pb-7 md:flex-row md:items-end md:gap-6 md:pb-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#155341]">
              Why Green Homes
            </p>
            <h2 className="mt-2 font-serif text-[clamp(2rem,1rem+3.2vw,4rem)] leading-[0.95] text-[#0f3a2e]">
              Built on four promises.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[#2A2725]/80 md:text-base">
            Every contract locks your rate per square foot, your bill of materials, and your handover date before excavation begins.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FOUR_PROMISES.map((promise) => (
            <article
              key={promise.number}
              className="flex flex-col justify-between rounded-[24px] border border-[#0f3a2e]/12 bg-white/85 p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-serif text-3xl text-[#0f3a2e]">{promise.number}</span>
                  <span className="rounded-full bg-[#0f3a2e]/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#155341]">
                    {promise.metric}
                  </span>
                </div>
                <h3 className="mt-5 font-sans text-xl font-semibold tracking-tight text-[#0f3a2e]">
                  {promise.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[#2A2725]/80">
                  {promise.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
