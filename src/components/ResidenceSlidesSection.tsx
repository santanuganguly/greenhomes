"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArchitecturalArt } from "./ArchitecturalArt";

export function ResidenceSlidesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [stageWidth, setStageWidth] = useState<number | null>(null);
  const [isLg, setIsLg] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    let stableVh = window.innerHeight || 900;
    let rafId = 0;
    let lastP = -1;

    const updateLayout = () => {
      stableVh = window.innerHeight || 900;
      setIsLg(window.innerWidth >= 1024);
      if (sectionRef.current) setStageWidth(sectionRef.current.clientWidth);
    };

    const measureScroll = () => {
      rafId = 0;
      const el = sectionRef.current;
      if (!el) return;
      if (mq.matches) {
        if (lastP !== 0) {
          lastP = 0;
          setProgress(0);
        }
        return;
      }
      const rect = el.getBoundingClientRect();
      const maxScroll = Math.max(1, el.offsetHeight - stableVh);
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

  const slide2T = reducedMotion ? 0 : Math.min(1, Math.max(0, (progress - 0.32) / 0.38));

  return (
    <section
      id="turnkey-craft"
      ref={sectionRef}
      className="relative z-20 h-[2100px] w-full bg-[#EDE6D6] text-[#2A2725] lg:h-[2880px]"
    >
      <div className="relative h-full w-full">
        <div
          className="rs-stage sticky top-0 h-[100dvh] w-full overflow-hidden p-3 pt-20 md:p-5 md:pt-22 lg:h-screen lg:p-8"
          style={{ maxWidth: stageWidth ? `${stageWidth}px` : "100%" }}
        >
          <div className="relative h-full w-full">
            <div className="absolute inset-0">
              {/* Slide 1 */}
              <div className="rs-slide pointer-events-none absolute inset-0 z-[1] grid grid-rows-2 gap-3 lg:grid-cols-2 lg:grid-rows-1">
                <div className="rs-text pointer-events-auto relative flex flex-col justify-between overflow-hidden rounded-[24px] bg-[#0f3a2e] p-5 text-white md:rounded-[36px] md:p-8 lg:col-start-1 lg:p-10">
                  <div>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c9a86a] md:mb-3">
                      Quality Control
                    </p>
                    <h2 className="font-sans text-[clamp(1.65rem,1rem+2.8vw,3.6rem)] leading-[0.96] tracking-[-0.04em]">
                      <span className="-mb-[0.15em] -mt-[0.05em] block overflow-hidden pb-[0.15em] pt-[0.05em]">
                        470+ quality
                      </span>
                      <span className="-mb-[0.15em] -mt-[0.05em] block overflow-hidden pb-[0.15em] pt-[0.05em]">
                        checks on every
                      </span>
                      <span className="-mb-[0.15em] -mt-[0.05em] block overflow-hidden pb-[0.15em] pt-[0.05em]">
                        single floor.
                      </span>
                    </h2>
                  </div>

                  <div className="flex items-end justify-between gap-4 sm:gap-6">
                    <div
                      aria-label="Slide 1 of 2"
                      className="rs-counter flex shrink-0 -space-x-px text-xs md:text-sm"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-current md:h-14 md:w-14">
                        01
                      </span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-current opacity-40 md:h-14 md:w-14">
                        02
                      </span>
                    </div>
                    <p className="rs-copy max-w-[23rem] text-xs leading-[1.4] tracking-[-0.01em] text-white/90 md:text-base">
                      Concrete grade, Fe550 steel binding, plumbing pressure, electrical continuity, and waterproofing — every check is photographed and uploaded to your live dashboard.
                    </p>
                  </div>
                </div>
              </div>

              {/* Slide 2 */}
              <div
                className="rs-slide pointer-events-none absolute inset-0 z-[2] grid grid-rows-2 gap-3 lg:grid-cols-2 lg:grid-rows-1"
                style={{
                  pointerEvents: slide2T > 0.5 ? "auto" : "none",
                }}
              >
                <div
                  className="rs-text pointer-events-auto relative flex flex-col justify-between overflow-hidden rounded-[24px] bg-white p-5 text-[#2A2725] shadow-sm will-change-transform md:rounded-[36px] md:p-8 lg:col-start-2 lg:p-10"
                  style={{
                    transform: `translate3d(0, ${(1 - slide2T) * 105}%, 0)`,
                  }}
                >
                  <div>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#155341] md:mb-3">
                      On-Time Handover
                    </p>
                    <h2 className="font-sans text-[clamp(1.65rem,1rem+2.8vw,3.6rem)] leading-[0.96] tracking-[-0.04em] text-[#0f3a2e]">
                      <span className="-mb-[0.15em] -mt-[0.05em] block overflow-hidden pb-[0.15em] pt-[0.05em]">
                        Guaranteed
                      </span>
                      <span className="-mb-[0.15em] -mt-[0.05em] block overflow-hidden pb-[0.15em] pt-[0.05em]">
                        handover date,
                      </span>
                      <span className="-mb-[0.15em] -mt-[0.05em] block overflow-hidden pb-[0.15em] pt-[0.05em]">
                        zero excuses.
                      </span>
                    </h2>
                  </div>

                  <div className="flex items-end justify-between gap-4 sm:gap-6">
                    <div
                      aria-label="Slide 2 of 2"
                      className="rs-counter flex shrink-0 -space-x-px text-xs md:text-sm"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-current md:h-14 md:w-14">
                        02
                      </span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-current opacity-40 md:h-14 md:w-14">
                        02
                      </span>
                    </div>
                    <p className="rs-copy max-w-[23rem] text-xs leading-[1.4] tracking-[-0.01em] text-[#2A2725]/85 md:text-base">
                      Milestone-tracked schedules with daily site photos and weekly inspection logs. Delays trigger credit, backed by a comprehensive 5-year structural and workmanship warranty.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Swiping architectural image box: stays anchored on bottom half on mobile, swipes horizontally on desktop */}
            <div
              className="rs-swiper absolute inset-x-0 bottom-0 isolate z-50 h-[calc(50%-6px)] overflow-hidden rounded-[24px] md:rounded-[36px] lg:inset-y-0 lg:h-auto lg:w-[calc(50%-6px)]"
              style={{
                right: 0,
                left: isLg ? "auto" : 0,
                transform: isLg ? `translate3d(${-slide2T * 100}%, 0, 0)` : "translate3d(0, 0, 0)",
              }}
            >
              <div className="absolute inset-0">
                <ArchitecturalArt
                  variant="about-home-daytime"
                  alt="Modern residential courtyard and exterior built in North Bengal"
                  className="h-full w-full object-cover"
                  lazy
                />
              </div>
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  transform: `translate3d(0, ${(1 - slide2T) * -100}%, 0)`,
                }}
              >
                <ArchitecturalArt
                  variant="about-home-evening"
                  alt="Turnkey custom villa architecture in Siliguri lit at evening"
                  className="h-full w-full object-cover"
                  lazy
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
