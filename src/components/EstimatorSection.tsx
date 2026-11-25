"use client";

import React, { useState } from "react";
import {
  ESTIMATOR_CITIES,
  ESTIMATOR_PACKAGES,
  ESTIMATOR_TYPES,
} from "@/data/siteContent";
import { useContact } from "./ContactContext";

const STEP_TITLES = [
  "Step 1 of 4: What are you building?",
  "Step 2 of 4: What's the built-up area?",
  "Step 3 of 4: Which package fits?",
  "Step 4 of 4: Where is the project?",
  "Your Construction Estimate",
];

function formatInr(amount: number) {
  return "₹" + Math.round(amount).toLocaleString("en-IN");
}

export function EstimatorSection() {
  const { openContact } = useContact();
  const [step, setStep] = useState(0);
  const [bhkType, setBhkType] = useState<string>("3BHK");
  const [sqft, setSqft] = useState<number>(1800);
  const [packageId, setPackageId] = useState<string>("comfort");
  const [city, setCity] = useState<string>("Siliguri");

  const selectedPkg =
    ESTIMATOR_PACKAGES.find((p) => p.id === packageId) || ESTIMATOR_PACKAGES[1];
  const baseTotal = sqft * selectedPkg.rate;
  const estimateLow = baseTotal * 0.95;
  const estimateHigh = baseTotal * 1.05;
  const midpoint = (estimateLow + estimateHigh) / 2;

  function handleSqftChange(val: number) {
    const clamped = Math.max(500, Math.min(20000, Number.isFinite(val) ? val : 500));
    setSqft(clamped);
  }

  function handleRestart() {
    setBhkType("3BHK");
    setSqft(1800);
    setPackageId("comfort");
    setCity("Siliguri");
    setStep(0);
  }

  return (
    <section
      id="estimator"
      className="relative z-30 bg-[#EDE6D6] px-5 py-16 text-[#2A2725] sm:px-6 md:px-10 md:py-28"
    >
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#155341]">
            Cost Estimator
          </p>
          <h2 className="mt-2 font-serif text-[clamp(1.85rem,1rem+3.2vw,3.75rem)] leading-[0.98] text-[#0f3a2e]">
            Get a realistic construction estimate in 60 seconds.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[#2A2725]/80 md:text-base">
            Four quick questions. We use the same rates our contracts are priced at, based on 120+ projects in North Bengal.
          </p>
        </div>

        {/* Step dots */}
        <div className="mt-8 flex items-center justify-center gap-3" aria-hidden="true">
          {STEP_TITLES.map((_, idx) => (
            <span
              key={idx}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === step
                  ? "w-8 bg-[#0f3a2e]"
                  : idx < step
                    ? "w-2.5 bg-[#2fa37f]"
                    : "w-2.5 bg-[#0f3a2e]/20"
              }`}
            />
          ))}
        </div>

        <p className="mt-4 text-center text-xs font-bold uppercase tracking-[0.14em] text-[#155341]">
          {STEP_TITLES[step]}
        </p>

        <div className="mt-6 rounded-[28px] border border-[#0f3a2e]/15 bg-white p-6 shadow-md md:p-10">
          {step === 0 && (
            <div>
              <h3 className="font-serif text-2xl text-[#0f3a2e]">What are you building?</h3>
              <p className="mt-1 text-sm text-[#2A2725]/70">
                Pick the option closest to your project. You can refine later.
              </p>
              <fieldset className="mt-6">
                <legend className="visually-hidden">Project configuration</legend>
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {ESTIMATOR_TYPES.map((item) => {
                    const active = bhkType === item.id;
                    return (
                      <label
                        key={item.id}
                        className={`flex cursor-pointer flex-col rounded-2xl border p-4 transition-all ${
                          active
                            ? "border-[#0f3a2e] bg-[#0f3a2e] text-white shadow-sm"
                            : "border-[#0f3a2e]/15 bg-[#FAF8F4] text-[#2A2725] hover:border-[#0f3a2e]/45"
                        }`}
                      >
                        <input
                          type="radio"
                          name="bhk_type"
                          value={item.id}
                          checked={active}
                          onChange={() => {
                            setBhkType(item.id);
                            setSqft(item.defaultSqft);
                          }}
                          className="visually-hidden"
                        />
                        <span className="text-base font-bold">{item.title}</span>
                        <span
                          className={`mt-1 text-xs ${
                            active ? "text-white/80" : "text-[#2A2725]/65"
                          }`}
                        >
                          {item.sub}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </div>
          )}

          {step === 1 && (
            <div>
              <h3 className="font-serif text-2xl text-[#0f3a2e]">What&apos;s the built-up area?</h3>
              <p className="mt-1 text-sm text-[#2A2725]/70">
                Total square feet across all floors. Roughly: built-up = carpet area × 1.3.
              </p>

              <div className="mt-6">
                <label
                  htmlFor="est-sqft"
                  className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#155341]"
                >
                  Built-up area (sqft)
                </label>
                <input
                  id="est-sqft"
                  type="number"
                  min={500}
                  max={20000}
                  step={100}
                  value={sqft}
                  onChange={(e) => handleSqftChange(Number(e.target.value))}
                  className="mt-2 w-full rounded-xl border border-[#0f3a2e]/25 bg-[#FAF8F4] px-4 py-3 text-center text-2xl font-bold text-[#0f3a2e] focus:border-[#0f3a2e] focus:outline-none"
                />
                <div className="mt-4">
                  <label htmlFor="est-sqft-slider" className="visually-hidden">
                    Built-up area slider
                  </label>
                  <input
                    id="est-sqft-slider"
                    type="range"
                    min={500}
                    max={10000}
                    step={100}
                    value={Math.min(10000, sqft)}
                    onChange={(e) => handleSqftChange(Number(e.target.value))}
                    className="w-full cursor-pointer accent-[#0f3a2e]"
                  />
                  <div className="mt-1.5 flex justify-between text-[11px] text-[#2A2725]/60">
                    <span>500 sqft</span>
                    <span>5,000 sqft</span>
                    <span>10,000 sqft</span>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {[1000, 1500, 2000, 3000, 4500].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setSqft(val)}
                      className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                        sqft === val
                          ? "border-[#0f3a2e] bg-[#0f3a2e] text-white"
                          : "border-[#0f3a2e]/20 bg-[#FAF8F4] text-[#0f3a2e] hover:border-[#0f3a2e]"
                      }`}
                    >
                      {val.toLocaleString("en-IN")} sqft
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="font-serif text-2xl text-[#0f3a2e]">Which package fits?</h3>
              <p className="mt-1 text-sm text-[#2A2725]/70">
                All packages include design, materials, labor, and project management. Higher tiers add finish quality and customisation.
              </p>

              <fieldset className="mt-6">
                <legend className="visually-hidden">Construction package</legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  {ESTIMATOR_PACKAGES.map((pkg) => {
                    const active = packageId === pkg.id;
                    return (
                      <label
                        key={pkg.id}
                        className={`flex cursor-pointer flex-col rounded-2xl border p-5 transition-all ${
                          active
                            ? "border-[#0f3a2e] bg-[#0f3a2e] text-white shadow-sm"
                            : "border-[#0f3a2e]/15 bg-[#FAF8F4] text-[#2A2725] hover:border-[#0f3a2e]/45"
                        }`}
                      >
                        <input
                          type="radio"
                          name="package"
                          value={pkg.id}
                          checked={active}
                          onChange={() => setPackageId(pkg.id)}
                          className="visually-hidden"
                        />
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-base font-bold">{pkg.name}</span>
                          {pkg.popular && (
                            <span className="rounded-full bg-[#c9a86a] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#0f3a2e]">
                              Popular
                            </span>
                          )}
                        </div>
                        <span
                          className={`mt-1 text-sm font-bold ${
                            active ? "text-[#c9a86a]" : "text-[#155341]"
                          }`}
                        >
                          ₹{pkg.rate.toLocaleString("en-IN")} / sqft
                        </span>
                        <ul
                          className={`mt-3 list-disc space-y-1 pl-4 text-xs ${
                            active ? "text-white/85" : "text-[#2A2725]/75"
                          }`}
                        >
                          {pkg.bullets.map((b) => (
                            <li key={b}>{b}</li>
                          ))}
                        </ul>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="font-serif text-2xl text-[#0f3a2e]">Where is the project?</h3>
              <p className="mt-1 text-sm text-[#2A2725]/70">
                We currently build across Siliguri and North Bengal.
              </p>

              <div className="mt-6">
                <label
                  htmlFor="est-city"
                  className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#155341]"
                >
                  City / Region
                </label>
                <select
                  id="est-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#0f3a2e]/25 bg-[#FAF8F4] px-4 py-3 text-base text-[#0f3a2e] focus:border-[#0f3a2e] focus:outline-none"
                >
                  {ESTIMATOR_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 className="font-serif text-2xl text-[#0f3a2e]">Your estimate</h3>
              <p className="mt-1 text-sm text-[#2A2725]/75">
                A preliminary range based on our standard rates. The final quote depends on site conditions, design, and finishes — we&apos;ll firm it up after a free site visit.
              </p>

              <div
                role="status"
                aria-live="polite"
                className="mt-6 rounded-2xl bg-[#0f3a2e] p-6 text-white md:p-8"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c9a86a]">
                  Estimated construction cost
                </p>
                <div className="mt-2 font-serif text-[clamp(2rem,5vw,3.25rem)] leading-tight">
                  {formatInr(estimateLow)} – {formatInr(estimateHigh)}
                </div>
                <p className="mt-1 text-sm text-white/80">
                  Approximately {formatInr(midpoint)} mid-point (inclusive of GST)
                </p>

                <div className="mt-6 grid gap-3 border-t border-white/15 pt-5 text-sm sm:grid-cols-2">
                  <div className="flex justify-between gap-2">
                    <span className="text-white/70">Package</span>
                    <span className="font-semibold">
                      {selectedPkg.name} (₹{selectedPkg.rate.toLocaleString("en-IN")}/sqft)
                    </span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-white/70">Built-up area</span>
                    <span className="font-semibold">{sqft.toLocaleString("en-IN")} sqft</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-white/70">City</span>
                    <span className="font-semibold">{city}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-white/70">Type</span>
                    <span className="font-semibold">{bhkType}</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      openContact({
                        service: "home",
                        notes: `Estimator Summary: ${bhkType}, ${sqft} sqft, ${selectedPkg.name} (₹${selectedPkg.rate}/sqft), Location: ${city}, Estimated Range: ${formatInr(estimateLow)} – ${formatInr(estimateHigh)}.`,
                      })
                    }
                    className="cursor-pointer rounded-full bg-[#c9a86a] px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#0f3a2e] transition-opacity hover:opacity-90"
                  >
                    Request Quote with This Estimate →
                  </button>
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="cursor-pointer rounded-full border border-white/45 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-white/10"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step navigation */}
          <div className="mt-8 flex items-center justify-between gap-4 border-t border-[#0f3a2e]/10 pt-5">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              style={{ visibility: step === 0 ? "hidden" : "visible" }}
              className="cursor-pointer rounded-full border border-[#0f3a2e]/25 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#0f3a2e] hover:bg-[#0f3a2e]/5"
            >
              ← Back
            </button>

            {step < 4 && (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(4, s + 1))}
                className="cursor-pointer rounded-full bg-[#0f3a2e] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#155341]"
              >
                {step === 3 ? "See estimate →" : "Next →"}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
