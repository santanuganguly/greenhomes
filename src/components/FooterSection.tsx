"use client";

import React from "react";
import Link from "next/link";
import {
  BRAND_NAME,
  BRAND_SUBTITLE,
  BRAND_TAGLINE,
  CONTACT_INFO,
  withBasePath,
} from "@/data/siteContent";
import { HoverRevealText } from "./HoverRevealText";
import { useContact } from "./ContactContext";

export function FooterSection() {
  const { openContact } = useContact();

  return (
    <footer
      id="contact"
      className="deferred-section relative z-30 flex w-full flex-col bg-[#EDE6D6] px-4 pb-[calc(5.25rem+env(safe-area-inset-bottom))] pt-8 text-[#2A2725] md:px-10 md:py-12"
    >
      <div className="footer-frame flex flex-1 flex-col justify-between rounded-[20px] border border-[#0f3a2e]/20 px-5 py-6 md:rounded-[30px] md:px-10 md:py-10">
        <div className="flex flex-wrap items-center justify-between gap-6 text-xs uppercase tracking-[0.12em] md:text-sm">
          <Link href="/" className="inline-block">
            <picture>
              <source type="image/webp" srcSet={withBasePath("/images/green-homes-logo.webp")} />
              <img
                src={withBasePath("/images/green-homes-logo.png")}
                alt="Green Homes by Green Hill Group"
                width={448}
                height={160}
                loading="lazy"
                decoding="async"
                className="h-11 w-auto object-contain md:h-12"
              />
            </picture>
          </Link>
          <div className="text-right">
            <span className="block text-[11px] font-semibold tracking-[0.14em] text-[#155341]">
              Siliguri · North Bengal
            </span>
            <span className="block text-xs text-[#2A2725]/70">
              Building Dreams, One Home at a Time.
            </span>
          </div>
        </div>

        <div className="footer-rule my-8 h-px bg-[#0f3a2e]/20 md:my-12" />

        <div className="grid gap-10 lg:grid-cols-[1.2fr_auto] lg:gap-16">
          <div>
            <h2 className="max-w-[13ch] font-serif text-[clamp(2.5rem,10vw,5.5rem)] leading-[0.9] tracking-[-0.03em] text-[#0f3a2e]">
              {BRAND_TAGLINE}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-[1.4] text-[#2A2725]/85 md:text-lg">
              {BRAND_SUBTITLE}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3 md:gap-10 lg:text-base">
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#155341]">
                Services
              </p>
              <a href="#service-home" className="block py-0.5 transition-opacity hover:opacity-65">
                <HoverRevealText text="Home construction" />
              </a>
              <a
                href="#service-renovation"
                className="block py-0.5 transition-opacity hover:opacity-65"
              >
                <HoverRevealText text="Renovation" />
              </a>
              <a
                href="#service-commercial"
                className="block py-0.5 transition-opacity hover:opacity-65"
              >
                <HoverRevealText text="Commercial" />
              </a>
              <a
                href="#marquee-transition"
                className="block py-0.5 transition-opacity hover:opacity-65"
              >
                <HoverRevealText text="3D Blueprint" />
              </a>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#155341]">
                Company
              </p>
              <a href="#about" className="block py-0.5 transition-opacity hover:opacity-65">
                <HoverRevealText text="About" />
              </a>
              <a href="#process" className="block py-0.5 transition-opacity hover:opacity-65">
                <HoverRevealText text="How it works" />
              </a>
              <a href="#estimator" className="block py-0.5 transition-opacity hover:opacity-65">
                <HoverRevealText text="Cost Estimator" />
              </a>
              <a
                href={CONTACT_INFO.parentGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block py-0.5 transition-opacity hover:opacity-65"
              >
                Green Hill Group ↗
              </a>
              <a
                href={CONTACT_INFO.dashboardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block py-0.5 transition-opacity hover:opacity-65"
              >
                My Dashboard ↗
              </a>
            </div>

            <div className="col-span-2 flex flex-col gap-3 sm:col-span-1">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#155341]">
                Get in touch
              </p>
              <a
                href={CONTACT_INFO.phoneHref}
                className="block py-0.5 transition-opacity hover:opacity-65"
              >
                {CONTACT_INFO.phoneDisplay}
              </a>
              <a
                href={CONTACT_INFO.emailHref}
                className="block py-0.5 transition-opacity hover:opacity-65"
              >
                {CONTACT_INFO.email}
              </a>
              <a
                href={CONTACT_INFO.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block py-0.5 transition-opacity hover:opacity-65"
              >
                Facebook ↗
              </a>
              <a
                href={CONTACT_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block py-0.5 transition-opacity hover:opacity-65"
              >
                Instagram ↗
              </a>
              <button
                type="button"
                onClick={() => openContact()}
                className="block cursor-pointer py-0.5 text-left font-semibold text-[#0f3a2e] transition-opacity hover:opacity-65"
              >
                <HoverRevealText text="Book Consultation" />
              </button>
            </div>
          </div>
        </div>

        <div className="footer-rule my-8 h-px bg-[#0f3a2e]/20 md:my-12" />

        <div className="flex flex-col gap-4 text-xs uppercase tracking-[0.12em] lg:flex-row lg:items-center lg:justify-between lg:text-sm">
          <div className="flex flex-col gap-1">
            <p>© 2026 {BRAND_NAME} · All rights reserved by {CONTACT_INFO.legalEntity}.</p>
            <p className="text-[10px] tracking-[0.1em] text-[#2A2725]/65 md:text-[11px]">
              {CONTACT_INFO.officeAddress}
            </p>
          </div>

          <div>
            <button
              type="button"
              onClick={() => openContact()}
              className="flex cursor-pointer items-center gap-2.5 py-1 text-[11px] font-semibold tracking-[0.12em] text-[#0f3a2e] transition-opacity hover:opacity-70 lg:py-0"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span
                  aria-hidden="true"
                  className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3FA85B]/70"
                />
                <span
                  aria-hidden="true"
                  className="relative inline-flex h-2 w-2 rounded-full bg-[#3FA85B]"
                />
              </span>
              <HoverRevealText text="Taking Siliguri & North Bengal Bookings" />
            </button>
          </div>

          <div>
            <a href="#top" className="block py-1 transition-opacity hover:opacity-65 lg:py-0">
              <HoverRevealText text="Back to top ↑" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
