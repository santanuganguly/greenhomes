"use client";

import React, { useEffect, useRef, useState } from "react";
import { TURNKEY_SERVICES } from "@/data/siteContent";
import { ArchitecturalArt } from "./ArchitecturalArt";
import { CharReveal } from "./CharReveal";
import { useContact } from "./ContactContext";

export function Residence02Sections() {
  const res2Ref = useRef<HTMLElement>(null);
  const { openContact } = useContact();

  const [res2Progress, setRes2Progress] = useState(0);
  const [isLg, setIsLg] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let maxScroll = 1;
    let rafId = 0;
    let lastP = -1;
    let scrollListening = false;

    const updateLayout = () => {
      const vh = window.innerHeight || 900;
      setIsLg(window.innerWidth >= 1024);
      if (res2Ref.current) {
        maxScroll = Math.max(1, res2Ref.current.offsetHeight - vh);
      }
    };

    const measureScroll = () => {
      rafId = 0;
      if (mq.matches) {
        if (lastP !== 0.35) {
          lastP = 0.35;
          setRes2Progress(0.35);
        }
        return;
      }
      if (!res2Ref.current) return;
      const rect = res2Ref.current.getBoundingClientRect();
      const nextP = Math.min(1, Math.max(0, -rect.top / maxScroll));
      if (Math.abs(nextP - lastP) > 0.0015 || nextP === 0 || nextP === 1) {
        lastP = nextP;
        setRes2Progress(nextP);
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
    window.addEventListener("resize", onResize);

    const section = res2Ref.current;
    const observer =
      section && typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (entries) => {
              const intersecting = Boolean(entries[0]?.isIntersecting);
              if (intersecting) {
                measureScroll();
                if (!scrollListening) {
                  window.addEventListener("scroll", onScroll, { passive: true });
                  scrollListening = true;
                }
              } else if (scrollListening) {
                window.removeEventListener("scroll", onScroll);
                scrollListening = false;
              }
            },
            { rootMargin: "250px" }
          )
        : null;
    if (observer && section) {
      observer.observe(section);
    } else {
      window.addEventListener("scroll", onScroll, { passive: true });
      scrollListening = true;
    }

    return () => {
      if (observer) observer.disconnect();
      if (rafId) window.cancelAnimationFrame(rafId);
      if (scrollListening) window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const expandT = Math.min(1, res2Progress / 0.2);
  const serviceIndex = Math.min(
    2,
    Math.max(0, Math.floor(((res2Progress - 0.22) / 0.78) * 3))
  );
  const showSplit = res2Progress >= 0.2;

  return (
    <>
      {/* Transition Section */}
      <section
        aria-label="Transition to turnkey construction services"
        className="ap-transition relative z-30 w-full overflow-x-clip bg-white py-14 text-[#2A2725] sm:py-16 lg:h-[1320px] lg:py-0"
      >
        <div className="flex w-full items-center justify-center px-5 sm:px-6 lg:sticky lg:top-0 lg:z-40 lg:h-screen">
          <div className="ap-transition-copy flex flex-col items-center text-center">
            <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#155341] lg:mb-5 lg:text-xs">
              Services · Siliguri &amp; North Bengal
            </p>
            <h2 className="ap-transition-heading max-w-[15ch] font-serif text-[clamp(2.1rem,1rem+4.8vw,5.75rem)] leading-[1.02] text-[#0f3a2e] lg:leading-[0.96]">
              <CharReveal text="Complete construction solutions for every need." />
            </h2>
            <p className="mt-3.5 max-w-md text-sm leading-relaxed text-[#2A2725]/75 md:mt-4 md:max-w-lg md:text-base">
              Home design-to-build, structural renovation, and commercial construction — all backed by one clear agreement.
            </p>
          </div>
        </div>
      </section>

      {/* Services Sticky Split Showcase */}
      <section
        id="services"
        ref={res2Ref}
        className="relative z-30 h-[2500px] w-full bg-[#EDE6D6] text-[#2A2725] lg:h-[4600px]"
      >
        <div className="relative h-full w-full">
          <div className="ap-stage sticky top-0 h-[100dvh] w-full overflow-hidden bg-white text-[#2A2725] lg:h-screen">
            <div className="relative h-full w-full">
              {/* GPU-composited media frame: scales smoothly on entry, glides smoothly into split framing */}
              <div
                className={`ap-img-frame absolute left-0 top-0 h-full overflow-hidden will-change-transform ${
                  showSplit
                    ? "transition-[transform,border-radius] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:transition-[transform,width,border-radius]"
                    : ""
                }`}
                style={{
                  width: showSplit && isLg ? "66%" : "100%",
                  borderRadius: showSplit ? "0px" : `${Math.round((1 - expandT) * 24)}px`,
                  transform: showSplit
                    ? isLg
                      ? "translate3d(0, 0, 0) scale(1)"
                      : "translate3d(0, -14%, 0) scale(1)"
                    : `translate3d(0, ${(1 - expandT) * 4}%, 0) scale(${(isLg ? 0.88 : 0.92) + expandT * (isLg ? 0.12 : 0.08)})`,
                }}
              >
                {TURNKEY_SERVICES.map((svc, idx) => {
                  const isMain = !showSplit ? idx === 0 : idx === serviceIndex;
                  return (
                    <div
                      key={svc.id}
                      className="ap-img absolute inset-0 overflow-hidden will-change-[opacity,transform] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      style={{
                        zIndex: isMain ? 2 : 1,
                        opacity: isMain ? 1 : 0,
                        transform: isMain ? "scale(1) translateZ(0)" : "scale(1.03) translateZ(0)",
                      }}
                    >
                      <ArchitecturalArt
                        variant={svc.variant}
                        alt={svc.alt}
                        className="ap-img-inner h-full w-full object-cover"
                        sizes="(max-width: 1023px) 100vw, 66vw"
                        lazy
                      />
                    </div>
                  );
                })}
              </div>

              {/* Opening Services hero overlay */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col gap-3 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-6 text-white will-change-[opacity,transform] transition-[opacity,transform] duration-300 ease-out md:p-8 lg:gap-4 lg:p-12"
                style={{
                  opacity: showSplit ? 0 : 1,
                  transform: showSplit ? "translate3d(0, 12px, 0)" : "translate3d(0, 0, 0)",
                }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c9a86a]">
                  Turnkey Services
                </p>
                <h2 className="font-sans text-[clamp(2.25rem,1rem+4.5vw,5rem)] leading-[0.92] tracking-[-0.05em]">
                  <span className="-mb-[0.18em] block overflow-hidden pb-[0.18em]">
                    Built under
                  </span>
                  <span className="-mb-[0.18em] block overflow-hidden pb-[0.18em]">
                    one roof.
                  </span>
                </h2>
              </div>

              {/* Service narrative panel: GPU-composited card transition for smooth mobile scroll */}
              <div className="pointer-events-none absolute inset-x-3 bottom-3 top-[46%] z-20 lg:inset-y-[12%] lg:left-[68%] lg:right-[3%]">
                {TURNKEY_SERVICES.map((svc, idx) => {
                  const isActive = showSplit && idx === serviceIndex;
                  return (
                    <div
                      key={svc.id}
                      className="ap-text absolute inset-0 flex flex-col justify-between gap-2 overflow-y-auto rounded-2xl border border-[#0f3a2e]/12 bg-white p-4 shadow-lg will-change-[opacity,transform] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-5 lg:justify-center lg:gap-4 lg:overflow-visible lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none"
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? "translate3d(0, 0, 0)" : "translate3d(0, 22px, 0)",
                        pointerEvents: isActive ? "auto" : "none",
                      }}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <p className="ap-piece text-[10px] font-semibold uppercase tracking-[0.18em] text-[#155341]">
                            {svc.eyebrow}
                          </p>
                          <span className="text-[10px] font-semibold tabular-nums text-[#0f3a2e]/60 lg:hidden">
                            0{idx + 1} / 03
                          </span>
                        </div>
                        <h3 className="mt-1 font-sans text-[clamp(1.4rem,1rem+1.8vw,2.6rem)] leading-[0.98] tracking-[-0.04em] text-[#0f3a2e]">
                          {svc.lines.map((line, i) => (
                            <span key={i} className="block">
                              {line}
                            </span>
                          ))}
                        </h3>
                        <p className="ap-piece mt-2 max-w-[26rem] text-xs leading-[1.45] tracking-[-0.01em] text-[#2A2725]/85 md:text-sm">
                          {svc.copy}
                        </p>
                        <p className="ap-piece mt-1.5 text-[10px] uppercase leading-[1.45] tracking-[0.12em] text-[#155341]/85">
                          {svc.tags}
                        </p>
                      </div>

                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => openContact({ service: svc.id })}
                          className="cursor-pointer rounded-full bg-[#0f3a2e] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#155341]"
                        >
                          {svc.ctaLabel} →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom-left service counter */}
              <div
                className="ap-label absolute bottom-[3.4%] left-[2.6%] z-20 hidden items-center gap-4 rounded-full bg-black/55 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-opacity duration-300 lg:flex"
                style={{ opacity: showSplit ? 1 : 0 }}
              >
                <span>Turnkey Capabilities</span>
                <span className="flex items-center gap-1 tabular-nums">
                  <span>0{serviceIndex + 1}</span>
                  <span className="opacity-50">/ 03</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complete 3-Service Engineering Breakdown & Checklists */}
      <section className="deferred-section relative z-30 bg-white px-5 py-16 text-[#2A2725] sm:px-6 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1280px]">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#155341]">
              Full Scope &amp; Deliverables
            </p>
            <h2 className="mt-2 font-serif text-[clamp(1.85rem,1rem+3vw,3.5rem)] leading-[0.98] text-[#0f3a2e]">
              House designs, approvals, construction, and warranty under one contract.
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:mt-12 md:gap-8 lg:grid-cols-3">
            {TURNKEY_SERVICES.map((svc) => (
              <article
                key={svc.id}
                id={`service-${svc.id}`}
                className="flex flex-col justify-between rounded-[24px] border border-[#0f3a2e]/12 bg-[#FAF8F4] p-5 shadow-sm sm:p-6"
              >
                <div>
                  <div className="aspect-[16/10] overflow-hidden rounded-2xl">
                    <ArchitecturalArt
                      variant={svc.variant}
                      alt={svc.alt}
                      className="h-full w-full object-cover"
                      sizes="(max-width: 1023px) 100vw, 33vw"
                      lazy
                    />
                  </div>
                  <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#155341]">
                    {svc.eyebrow}
                  </p>
                  <h3 className="mt-1.5 font-serif text-2xl text-[#0f3a2e]">{svc.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#2A2725]/80">{svc.copy}</p>

                  <ul className="mt-5 space-y-2 border-t border-[#0f3a2e]/10 pt-4 text-xs leading-snug text-[#2A2725]/85">
                    {svc.checklist.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span aria-hidden="true" className="font-bold text-[#155341]">
                          ✓
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex flex-wrap gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => openContact({ service: svc.id })}
                    className="cursor-pointer rounded-full bg-[#0f3a2e] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#155341]"
                  >
                    Book Free Consultation
                  </button>
                  {svc.id === "home" && (
                    <a
                      href="#estimator"
                      className="inline-flex min-h-[44px] items-center rounded-full border border-[#0f3a2e]/25 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0f3a2e] transition-colors hover:bg-[#0f3a2e] hover:text-white"
                    >
                      Calculate Estimate
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
