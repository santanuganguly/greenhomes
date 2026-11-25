"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { BRAND_NAME, BRAND_PARENT, CONTACT_INFO } from "@/data/siteContent";
import type { ContactPreset } from "./ContactContext";

interface ContactDialogProps {
  open: boolean;
  preset?: ContactPreset;
  onClose: () => void;
}

export function ContactDialog({ open, preset, onClose }: ContactDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nameId = useId();
  const phoneId = useId();
  const cityId = useId();
  const serviceId = useId();
  const notesId = useId();

  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Siliguri");
  const [service, setService] = useState<"home" | "renovation" | "commercial">("home");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (preset?.service) setService(preset.service);
    if (preset?.notes !== undefined) setNotes(preset.notes);
  }, [preset]);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) {
      setSubmitted(false);
      el.showModal();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) {
      onClose();
    }
  }

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

  const whatsappSummaryUrl = `https://wa.me/919046665257?text=${encodeURIComponent(
    `Hi Green Homes, I would like a site consultation.\nName: ${name}\nPhone: ${phone}\nPlot Location: ${city}\nType: ${service}${notes ? `\nDetails: ${notes}` : ""}`
  )}`;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      aria-labelledby="contact-dialog-title"
      className="contact-dialog m-auto w-[min(94vw,34rem)] rounded-[24px] border border-[#0f3a2e]/15 bg-[#EDE6D6] p-6 text-[#2A2725] shadow-2xl md:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#155341]">
            {BRAND_NAME} · {BRAND_PARENT}
          </p>
          <h2
            id="contact-dialog-title"
            className="mt-2 font-serif text-3xl leading-none tracking-tight text-[#0f3a2e] md:text-4xl"
          >
            Talk to a Senior Project Manager.
          </h2>
          <p className="mt-2 text-xs text-[#2A2725]/75">
            Same-day feasibility review &amp; preliminary per-sqft cost estimate. No sales cold calls.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close consultation dialog"
          className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#2A2725]/25 text-sm transition-colors hover:bg-[#0f3a2e] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f3a2e]"
        >
          ✕
        </button>
      </div>

      {submitted ? (
        <div
          role="status"
          aria-live="polite"
          className="mt-6 rounded-2xl border border-[#155341]/25 bg-white/85 p-5"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#155341]">
            Consultation Request Ready
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[#2A2725]/85">
            Thank you{name ? `, ${name}` : ""}. Our senior engineering team typically replies within 1–2 hours during business hours ({CONTACT_INFO.officeHours}). You can also send this directly on WhatsApp or call us now:
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={whatsappSummaryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#155341] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90"
            >
              Send via WhatsApp →
            </a>
            <a
              href={CONTACT_INFO.phoneHref}
              className="rounded-full border border-[#0f3a2e]/30 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-[#0f3a2e] hover:bg-[#0f3a2e] hover:text-white"
            >
              Call {CONTACT_INFO.phoneDisplay}
            </a>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-full px-4 py-2.5 text-xs uppercase tracking-[0.14em] text-[#2A2725]/70 hover:text-[#2A2725]"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3.5" noValidate>
          <div className="grid gap-3.5 sm:grid-cols-2">
            <div>
              <label
                htmlFor={nameId}
                className="block text-[11px] font-medium uppercase tracking-[0.14em] text-[#2A2725]/80"
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
                className="gh-input mt-1 w-full rounded-xl border border-[#2A2725]/25 bg-white/90 px-3.5 py-2.5 text-base text-[#2A2725] placeholder:text-[#2A2725]/40 focus:border-[#0f3a2e] focus:outline-none"
              />
              <span className="gh-error-msg">Please enter your full name.</span>
            </div>

            <div>
              <label
                htmlFor={phoneId}
                className="block text-[11px] font-medium uppercase tracking-[0.14em] text-[#2A2725]/80"
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
                className="gh-input mt-1 w-full rounded-xl border border-[#2A2725]/25 bg-white/90 px-3.5 py-2.5 text-base text-[#2A2725] placeholder:text-[#2A2725]/40 focus:border-[#0f3a2e] focus:outline-none"
              />
              <span className="gh-error-msg">Please enter a valid phone number.</span>
            </div>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2">
            <div>
              <label
                htmlFor={cityId}
                className="block text-[11px] font-medium uppercase tracking-[0.14em] text-[#2A2725]/80"
              >
                Plot Location <span aria-hidden="true">*</span>
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
                className="gh-input mt-1 w-full rounded-xl border border-[#2A2725]/25 bg-white/90 px-3.5 py-2.5 text-base text-[#2A2725] placeholder:text-[#2A2725]/40 focus:border-[#0f3a2e] focus:outline-none"
              />
              <span className="gh-error-msg">Please specify your plot city or area.</span>
            </div>

            <div>
              <label
                htmlFor={serviceId}
                className="block text-[11px] font-medium uppercase tracking-[0.14em] text-[#2A2725]/80"
              >
                Construction Type
              </label>
              <select
                id={serviceId}
                name="service"
                value={service}
                onChange={(e) =>
                  setService(e.target.value as "home" | "renovation" | "commercial")
                }
                className="gh-input mt-1 w-full rounded-xl border border-[#2A2725]/25 bg-white/90 px-3.5 py-2.5 text-base text-[#2A2725] focus:border-[#0f3a2e] focus:outline-none"
              >
                <option value="home">New Home Construction</option>
                <option value="renovation">Renovation &amp; Expansion</option>
                <option value="commercial">Commercial Construction</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor={notesId}
              className="block text-[11px] font-medium uppercase tracking-[0.14em] text-[#2A2725]/80"
            >
              Project Details (Optional)
            </label>
            <textarea
              id={notesId}
              name="notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Plot area, intended BHK, approximate timeline..."
              className="gh-input mt-1 w-full rounded-xl border border-[#2A2725]/25 bg-white/90 px-3.5 py-2 text-base text-[#2A2725] placeholder:text-[#2A2725]/40 focus:border-[#0f3a2e] focus:outline-none"
            />
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <a
              href={CONTACT_INFO.phoneHref}
              className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-[#155341] underline underline-offset-4 hover:opacity-80"
            >
              <span className="inline-block h-2 w-2 rounded-full bg-[#3FA85B]" />
              Call {CONTACT_INFO.phoneDisplay}
            </a>
            <button
              type="submit"
              className="cursor-pointer rounded-full bg-[#0f3a2e] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f3a2e]"
            >
              Book Free Consultation →
            </button>
          </div>
        </form>
      )}
    </dialog>
  );
}
