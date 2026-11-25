"use client";

import React, { useId, useState } from "react";
import { CONTACT_INFO } from "@/data/siteContent";

export function ConsultationSection() {
  const nameId = useId();
  const phoneId = useId();
  const cityId = useId();
  const serviceId = useId();
  const notesId = useId();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [service, setService] = useState("home");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      const firstInvalid = form.querySelector<HTMLElement>(":invalid");
      firstInvalid?.focus();
      form.reportValidity();
      return;
    }
    setSubmitted(true);
  }

  const whatsappUrl = `https://wa.me/919046665257?text=${encodeURIComponent(
    `Hi Green Homes, I would like a site consultation.\nName: ${name}\nPhone: ${phone}\nPlot Location: ${city}\nConstruction Type: ${service}${notes ? `\nDetails: ${notes}` : ""}`
  )}`;

  return (
    <section
      id="consultation"
      className="relative z-30 bg-[#0f3a2e] px-5 py-16 text-white sm:px-6 md:px-10 md:py-28"
    >
      <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
        <div className="lg:col-span-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c9a86a]">
            Consultation · Siliguri &amp; North Bengal
          </p>
          <h2 className="mt-3 font-serif text-[clamp(1.85rem,1rem+3.2vw,3.75rem)] leading-[0.98] text-white">
            Discuss your plot and construction goals with a project engineer.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85 md:text-base">
            No sales reps, no scripts. The same senior civil engineer who evaluates your plot dimensions and municipal setbacks will run your project.
          </p>

          <ul className="mt-7 space-y-3 text-sm text-white/90">
            <li className="flex items-start gap-2.5">
              <span aria-hidden="true" className="font-bold text-[#c9a86a]">
                ✓
              </span>
              <span>Fixed-price proposal delivered within 7 days of site inspection</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span aria-hidden="true" className="font-bold text-[#c9a86a]">
                ✓
              </span>
              <span>Complimentary initial plot consultation</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span aria-hidden="true" className="font-bold text-[#c9a86a]">
                ✓
              </span>
              <span>Direct consultation with a licensed civil engineer</span>
            </li>
          </ul>

          <div className="mt-8 grid gap-4 rounded-2xl border border-white/15 bg-white/6 p-5 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#c9a86a]">
                Direct Communication
              </p>
              <a
                href={CONTACT_INFO.phoneHref}
                className="mt-1.5 block text-sm font-semibold text-white hover:text-[#c9a86a]"
              >
                {CONTACT_INFO.phoneDisplay}
              </a>
              <a
                href={CONTACT_INFO.emailHref}
                className="mt-1 block text-xs text-white/80 hover:text-[#c9a86a]"
              >
                {CONTACT_INFO.email}
              </a>
              <p className="mt-2 text-xs text-white/65">
                Direct callback or WhatsApp reply within 1–2 hours.
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#c9a86a]">
                Siliguri Office &amp; Hours
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-white/85">
                {CONTACT_INFO.officeAddress}
              </p>
              <p className="mt-1 text-xs text-white/65">{CONTACT_INFO.officeHours}</p>
              <a
                href={CONTACT_INFO.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs font-semibold text-[#c9a86a] underline underline-offset-4"
              >
                Open in Google Maps →
              </a>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] bg-white p-6 text-[#2A2725] shadow-2xl md:p-8 lg:col-span-6">
          <h3 className="font-serif text-2xl text-[#0f3a2e]">Request Site Consultation</h3>
          <p className="mt-1 text-xs text-[#2A2725]/70">
            Same-day feasibility review and preliminary cost estimate.
          </p>

          {submitted ? (
            <div
              role="status"
              aria-live="polite"
              className="mt-6 rounded-2xl border border-[#155341]/25 bg-[#f3f9f6] p-5"
            >
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#155341]">
                Consultation Details Prepared
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#2A2725]/85">
                Thank you, {name}. Send your plot details directly to our Siliguri engineering team on WhatsApp or call us now:
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[#155341] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#0f3a2e]"
                >
                  Send via WhatsApp →
                </a>
                <a
                  href={CONTACT_INFO.phoneHref}
                  className="rounded-full border border-[#0f3a2e]/25 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#0f3a2e]"
                >
                  Call {CONTACT_INFO.phoneDisplay}
                </a>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="cursor-pointer px-3 py-2 text-xs text-[#2A2725]/70 underline"
                >
                  Edit details
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor={nameId}
                    className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2A2725]/80"
                  >
                    Full Name <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id={nameId}
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    enterKeyHint="next"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ronit Sharma"
                    className="gh-input mt-1 w-full rounded-xl border border-[#2A2725]/25 bg-[#FAF8F4] px-3.5 py-2.5 text-base text-[#2A2725] focus:border-[#0f3a2e] focus:outline-none"
                  />
                  <span className="gh-error-msg">Please enter your full name.</span>
                </div>

                <div>
                  <label
                    htmlFor={phoneId}
                    className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2A2725]/80"
                  >
                    Phone Number <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id={phoneId}
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    enterKeyHint="next"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="gh-input mt-1 w-full rounded-xl border border-[#2A2725]/25 bg-[#FAF8F4] px-3.5 py-2.5 text-base text-[#2A2725] focus:border-[#0f3a2e] focus:outline-none"
                  />
                  <span className="gh-error-msg">Please enter your phone number.</span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor={cityId}
                    className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2A2725]/80"
                  >
                    Plot Location (City / Area) <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id={cityId}
                    name="city"
                    type="text"
                    required
                    enterKeyHint="next"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Siliguri, Matigara, Jalpaiguri..."
                    className="gh-input mt-1 w-full rounded-xl border border-[#2A2725]/25 bg-[#FAF8F4] px-3.5 py-2.5 text-base text-[#2A2725] focus:border-[#0f3a2e] focus:outline-none"
                  />
                  <span className="gh-error-msg">Please enter your plot location.</span>
                </div>

                <div>
                  <label
                    htmlFor={serviceId}
                    className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2A2725]/80"
                  >
                    Construction Type
                  </label>
                  <select
                    id={serviceId}
                    name="service"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="gh-input mt-1 w-full rounded-xl border border-[#2A2725]/25 bg-[#FAF8F4] px-3.5 py-2.5 text-base text-[#2A2725] focus:border-[#0f3a2e] focus:outline-none"
                  >
                    <option value="home">New Home Construction</option>
                    <option value="renovation">Residential Renovation</option>
                    <option value="commercial">Commercial Construction</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor={notesId}
                  className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2A2725]/80"
                >
                  Project Details (Optional)
                </label>
                <textarea
                  id={notesId}
                  name="notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Plot area, intended BHK, approximate timeline..."
                  className="gh-input mt-1 w-full rounded-xl border border-[#2A2725]/25 bg-[#FAF8F4] px-3.5 py-2.5 text-base text-[#2A2725] focus:border-[#0f3a2e] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full cursor-pointer rounded-full bg-[#c9a86a] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-[#0f3a2e] transition-opacity hover:opacity-90"
              >
                Book Site Consultation →
              </button>

              <p className="text-center text-xs text-[#2A2725]/65">
                Direct communication with our senior engineering team. No sales cold calls.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
