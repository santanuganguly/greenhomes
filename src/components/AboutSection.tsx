"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ABOUT_SLIDES,
  APPROACH_PILLARS,
  BRAND_NAME,
  CONTACT_INFO,
} from "@/data/siteContent";
import { ArchitecturalArt } from "./ArchitecturalArt";
import { CharReveal } from "./CharReveal";

const TILES = [
  { slideIndex: 0, pos: "left-[2%] top-[15%] h-[40%] w-[25%]", rot: "-4deg", side: -1 },
  { slideIndex: 1, pos: "left-[5%] top-[60%] h-[22%] w-[20%]", rot: "3deg", side: -1 },
  { slideIndex: 2, pos: "left-[28%] top-[67%] h-[25%] w-[22%]", rot: "-2deg", side: -1 },
  { slideIndex: 3, pos: "left-[46%] top-[6%] h-[21%] w-[18%]", rot: "-5deg", side: 1 },
  { slideIndex: 4, pos: "left-[70%] top-[16%] h-[29%] w-[26%]", rot: "7deg", side: 1 },
  { slideIndex: 5, pos: "left-[70%] top-[53%] h-[37%] w-[25%]", rot: "-4deg", side: 1 },
];

const MOBILE_TILES = [
  { slideIndex: 0, rot: "-2deg" },
  { slideIndex: 1, rot: "2deg" },
  { slideIndex: 2, rot: "-1.5deg" },
];

const STATEMENT_WORDS = [
  "From",
  "land",
  "to",
  "landmark,",
  "we",
  "design,",
  "approve,",
  "and",
  "build",
  "your",
  "turnkey",
  "home",
  "with",
  "total",
  "clarity.",
];

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    let maxScroll = 1;
    let rafId = 0;
    let lastP = -1;

    const updateLayout = () => {
      const vh = window.innerHeight || 900;
      if (sectionRef.current) {
        maxScroll = Math.max(1, sectionRef.current.offsetHeight - vh);
      }
    };

    const measureScroll = () => {
      rafId = 0;
      const el = sectionRef.current;
      if (!el) return;
      if (mq.matches) {
        if (lastP !== 0.8) {
          lastP = 0.8;
          setProgress(0.8);
        }
        return;
      }
      const rect = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -rect.top / maxScroll));
      if (Math.abs(p - lastP) > 0.0015 || p === 0 || p === 1) {
        lastP = p;
        setProgress(p);
      }
    };

    const onScroll = () => {
      if (!rafId) rafId = window.requestAnimationFrame(measureScroll);
    };

    const onResize = () => {
      updateLayout();
      measureScroll();
    };

    updateLayout();
    measureScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const galleryOpacity = reducedMotion ? 0 : Math.max(0, 1 - Math.max(0, progress - 0.25) * 4.5);
  const textOpacity = reducedMotion ? 1 : Math.min(1, Math.max(0, (progress - 0.28) * 3.5));

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative z-20 h-[1520px] overflow-x-clip bg-[#EDE6D6] text-[#2A2725] lg:h-[3780px]"
    >
      <div className="relative h-full w-full">
        <div className="about-stage sticky top-0 z-40 h-[100dvh] w-full overflow-hidden lg:h-screen">
          {/* Phase 1: Scattered gallery (desktop + balanced centered collage on mobile) */}
          <div
            className="about-gallery pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-6 px-5 pb-12 pt-20 lg:block lg:p-0"
            style={{ opacity: galleryOpacity }}
          >
            <div className="about-tile pointer-events-none relative text-center lg:absolute lg:left-1/2 lg:top-[46%] lg:w-[min(34%,32rem)] lg:-translate-x-1/2 lg:-translate-y-1/2">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#155341] lg:mb-3 lg:text-xs">
                About · Green Hill Group
              </p>
              <p className="font-serif text-[clamp(2.15rem,1rem+4.2vw,3.85rem)] leading-[1.02] text-[#0f3a2e]">
                <CharReveal text="From land to landmark" />
              </p>
              <p className="mx-auto mt-2.5 max-w-xs text-xs leading-relaxed text-[#2A2725]/75 lg:text-sm">
                Design, approvals, and fixed-price turnkey construction across Siliguri &amp; North Bengal.
              </p>
            </div>

            {/* Mobile/Tablet 3-photo preview strip */}
            <div className="grid w-full max-w-md grid-cols-3 gap-3 sm:max-w-lg sm:gap-4 lg:hidden">
              {MOBILE_TILES.map((tile, idx) => {
                const slide = ABOUT_SLIDES[tile.slideIndex];
                const shiftY = reducedMotion ? 0 : progress * (idx === 1 ? -28 : 20);
                return (
                  <div
                    key={tile.slideIndex}
                    className={`overflow-hidden rounded-xl shadow-md ${
                      idx === 1 ? "mt-5 aspect-[3/4]" : "aspect-[3/4]"
                    }`}
                    style={{
                      transform: `translate3d(0, ${shiftY}px, 0) rotate(${tile.rot})`,
                    }}
                  >
                    <ArchitecturalArt
                      variant={slide.variant}
                      alt=""
                      className="h-full w-full object-cover"
                      sizes="(max-width: 1023px) 33vw, 25vw"
                      lazy
                    />
                  </div>
                );
              })}
            </div>

            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#155341]/70 lg:hidden">
              Scroll to explore ↓
            </p>

            {TILES.map((tile) => {
              const shiftX = reducedMotion ? 0 : progress * tile.side * 90;
              const slide = ABOUT_SLIDES[tile.slideIndex];
              return (
                <div
                  key={tile.slideIndex}
                  className={`about-tile absolute hidden overflow-hidden rounded-xl shadow-md lg:block ${tile.pos}`}
                  style={{
                    transform: `translate3d(${shiftX}px, 0, 0) rotate(${tile.rot})`,
                  }}
                >
                  <ArchitecturalArt
                    variant={slide.variant}
                    alt=""
                    className="h-full w-full object-cover"
                    sizes="25vw"
                    lazy
                  />
                </div>
              );
            })}
          </div>

          {/* Phase 2: Editorial statement & 15-year Green Hill Group heritage */}
          <div
            className="about-text-layer absolute inset-0 flex items-center px-5 pb-6 pt-20 sm:px-6 lg:px-10 lg:pt-10"
            style={{ opacity: textOpacity }}
          >
            <div className="grid w-full grid-cols-12 gap-3 lg:gap-6">
              <div className="col-span-12 lg:col-span-2">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#155341]">
                  About · Since 2010
                </div>
                <p className="mt-1 hidden text-xs text-[#2A2725]/70 lg:block">
                  10 major communities built across North Bengal
                </p>
              </div>

              <div className="col-span-12 lg:col-span-10">
                <h2 className="font-sans text-[clamp(1.35rem,1rem+2.8vw,3.35rem)] leading-[1.06] tracking-[-0.04em] text-[#0f3a2e] lg:leading-[0.9]">
                  <span className="relative mr-[0.18em] mb-[0.14em] inline-block h-[0.82em] w-[1.65em] overflow-hidden rounded-[6px] align-bottom">
                    {ABOUT_SLIDES.map((slide, idx) => (
                      <ArchitecturalArt
                        key={slide.variant}
                        variant={slide.variant}
                        alt={slide.alt}
                        priority={idx === activeSlide ? undefined : "low"}
                        lazy={idx !== activeSlide}
                        className="about-slide absolute inset-0 h-full w-full object-cover transition-transform duration-500"
                        style={{
                          transform: idx === activeSlide ? "translate(0%, 0%)" : "translate(-30%, 0%)",
                          zIndex: idx === activeSlide ? 2 : 1,
                          opacity: idx === activeSlide ? 1 : 0,
                        }}
                      />
                    ))}
                  </span>
                  {STATEMENT_WORDS.map((word, idx) => (
                    <span
                      key={idx}
                      className="-mb-[0.1em] -mt-[1em] mr-[0.22em] inline-block overflow-hidden pb-[0.2em] pt-[0.1em] align-bottom"
                    >
                      <span className="about-word inline-block">{word}</span>
                    </span>
                  ))}
                </h2>

                <div className="about-rule mt-3 h-px w-full bg-[#2A2725]/25 lg:mt-5" />

                <div className="mt-3 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end lg:mt-5">
                  <div className="max-w-xl">
                    <p className="about-supporting-copy text-xs leading-[1.45] tracking-[-0.01em] text-[#2A2725]/85 sm:text-sm lg:text-base">
                      As part of{" "}
                      <a
                        href={CONTACT_INFO.parentGroupUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[#0f3a2e] underline underline-offset-4"
                      >
                        Green Hill Group
                      </a>
                      , {BRAND_NAME} brings 15 years of local building experience — including{" "}
                      <strong>Green Escape</strong>, <strong>Landmark Residency</strong>, and{" "}
                      <strong>Green Aura</strong> — directly to your private plot with bulk-buying material savings and single-team accountability.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] uppercase tracking-[0.14em] text-[#2A2725]/70">
                      0{activeSlide + 1} / 0{ABOUT_SLIDES.length}
                    </span>
                    <button
                      type="button"
                      aria-label="Previous project image"
                      onClick={() =>
                        setActiveSlide((prev) => (prev - 1 + ABOUT_SLIDES.length) % ABOUT_SLIDES.length)
                      }
                      className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#0f3a2e]/25 bg-white/85 text-[#0f3a2e] transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f3a2e]"
                    >
                      <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16">
                        <path
                          d="M13 8H3M7.5 3.5 3 8l4.5 4.5"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </button>
                    <button
                      type="button"
                      aria-label="Next project image"
                      onClick={() => setActiveSlide((prev) => (prev + 1) % ABOUT_SLIDES.length)}
                      className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#0f3a2e]/25 bg-white/85 text-[#0f3a2e] transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f3a2e]"
                    >
                      <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16">
                        <path
                          d="M3 8h10M8.5 3.5 13 8l-4.5 4.5"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Our Approach 2x2 on mobile, 4-col on desktop */}
                <div className="mt-3 grid grid-cols-2 gap-2 lg:mt-4 lg:grid-cols-4 lg:gap-3">
                  {APPROACH_PILLARS.map((pillar) => (
                    <div
                      key={pillar.title}
                      className="rounded-xl border border-[#0f3a2e]/12 bg-white/70 p-2.5 sm:p-3.5"
                    >
                      <h3 className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#0f3a2e] sm:text-xs">
                        {pillar.title}
                      </h3>
                      <p className="mt-0.5 text-[11px] leading-snug text-[#2A2725]/75 sm:mt-1 sm:text-xs">
                        {pillar.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
