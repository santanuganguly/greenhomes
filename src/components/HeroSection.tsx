"use client";

import React, { useEffect, useState } from "react";
import { ArchitecturalArt } from "./ArchitecturalArt";
import { CharReveal } from "./CharReveal";
import { HoverRevealText } from "./HoverRevealText";
import { useContact } from "./ContactContext";

export function HeroSection() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const { openContact } = useContact();

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    let stableVh = window.innerHeight || 900;
    let rafId = 0;
    let lastP = -1;

    const measureScroll = () => {
      rafId = 0;
      if (mq.matches) return;
      const p = Math.min(1, Math.max(0, window.scrollY / stableVh));
      if (Math.abs(p - lastP) > 0.0015 || p === 0 || p === 1) {
        lastP = p;
        setScrollProgress(p);
      }
    };

    const onScroll = () => {
      if (!rafId) rafId = window.requestAnimationFrame(measureScroll);
    };

    const onResize = () => {
      stableVh = window.innerHeight || 900;
      measureScroll();
    };

    measureScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const scale = reducedMotion ? 1 : 1 + scrollProgress * 0.12;
  const contentOpacity = reducedMotion ? 1 : Math.max(0, 1 - scrollProgress * 1.45);
  const contentTranslateY = reducedMotion ? 0 : -scrollProgress * 80;

  return (
    <section className="sticky top-0 z-0 min-h-[100dvh] w-full overflow-hidden bg-black text-white lg:h-screen lg:min-h-screen select-none">
      <div
        className="hero-image-wrap pointer-events-none absolute inset-0 will-change-transform"
        style={{ transform: `scale(${scale}) translateZ(0)` }}
      >
        <ArchitecturalArt
          variant="hero-villa"
          alt="Modern luxury custom villa design and turnkey construction in Siliguri"
          className="hero-image h-full w-full object-cover"
          priority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/38 to-black/75" />
      </div>

      {/* Responsive flex layout on mobile/tablet so title, CTAs & metadata never overlap on short viewports */}
      <div
        className="hero-content pointer-events-auto relative z-10 flex min-h-[100dvh] flex-col justify-between px-5 pb-6 pt-28 sm:px-6 md:px-10 md:pt-32 lg:absolute lg:inset-0 lg:block lg:p-0"
        style={{
          opacity: contentOpacity,
          transform: `translate3d(0px, ${contentTranslateY}px, 0px)`,
        }}
      >
        <div className="lg:absolute lg:left-10 lg:top-[23%] [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1023px)]:pt-2">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c9a86a] sm:text-xs">
            Siliguri · North Bengal · Turnkey Construction
          </p>
          <h1 className="hero-title-line font-serif text-[clamp(2.5rem,1rem+7vw,4.5rem)] leading-[0.94] text-white md:text-[5rem] lg:text-[5.5rem] [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1023px)]:text-[2.25rem]">
            <span className="block">
              <CharReveal text="Trusted Home" />
            </span>
            <span className="block">
              <CharReveal text="Builders." />
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/90 sm:mt-5 md:text-base">
            We handle everything from building plans and government approvals to final handover — with fixed pricing, regular quality checks, and no hidden costs.
          </p>

          <div className="hero-actions mt-6 flex flex-col items-start gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1023px)]:mt-3 [@media(orientation:landscape)_and_(max-height:500px)_and_(max-width:1023px)]:flex-row">
            <button
              type="button"
              onClick={() => openContact({ service: "home" })}
              className="group pointer-events-auto inline-flex min-h-[46px] cursor-pointer items-center gap-3 rounded-full bg-[#0f3a2e] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-lg transition-colors hover:bg-[#155341] md:text-sm"
            >
              <HoverRevealText text="Request Site Consultation" />
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <a
                href="#estimator"
                className="group pointer-events-auto inline-flex min-h-[40px] items-center gap-2 text-xs font-medium uppercase tracking-[0.1em] sm:text-sm md:text-base"
              >
                <span className="-mb-[0.18em] block overflow-hidden border-b border-white pb-[0.18em]">
                  <HoverRevealText text="Calculate Cost" />
                </span>
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
              <a
                href="#marquee-transition"
                className="group pointer-events-auto inline-flex min-h-[40px] items-center gap-2 text-xs font-medium uppercase tracking-[0.1em] sm:text-sm md:text-base"
              >
                <span className="-mb-[0.18em] block overflow-hidden border-b border-white pb-[0.18em]">
                  <HoverRevealText text="3D Structural Model" />
                </span>
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4 lg:mt-0">
          <div className="hero-meta pointer-events-none lg:absolute lg:bottom-[15%] lg:left-0 lg:right-0 lg:px-10">
            <div className="hero-meta-inner grid w-full grid-cols-2 gap-x-4 gap-y-2 border-t border-white/25 pt-3.5 md:flex md:items-end md:justify-between md:gap-0">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/90 sm:text-xs lg:text-sm">
                15+ Years · Green Hill Group
              </p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/90 sm:text-xs lg:text-sm">
                470+ Quality Checks / Floor
              </p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/90 sm:text-xs lg:text-sm">
                Locked Per-Sqft Pricing
              </p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/90 sm:text-xs lg:text-sm">
                5-Year Warranty
              </p>
            </div>
          </div>

          <div className="hero-bottom px-12 text-center sm:px-0 lg:absolute lg:bottom-6 lg:w-full lg:px-6">
            <p className="text-xs leading-[1.35] text-white/85 md:text-sm lg:text-base">
              <CharReveal text="Same-day feasibility review and preliminary cost estimate." />{" "}
              <CharReveal text="Direct communication with our senior engineering team." />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
