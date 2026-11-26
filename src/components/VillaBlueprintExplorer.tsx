"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { BLUEPRINT_LAYERS, BRAND_NAME } from "@/data/siteContent";
import { ArchitecturalArt } from "./ArchitecturalArt";

const VillaBlueprintCanvas = dynamic(
  () => import("./VillaBlueprintCanvas").then((m) => m.VillaBlueprintCanvas),
  { ssr: false }
);

export function VillaBlueprintExplorer() {
  const sectionRef = useRef<HTMLElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLg, setIsLg] = useState(true);
  const [manualLayer, setManualLayer] = useState<number | null>(null);
  const [marqueePaused, setMarqueePaused] = useState(false);
  const [webglReady, setWebglReady] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [load3D, setLoad3D] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const manualTimeoutRef = useRef<number | null>(null);

  const scrollLayerIndex = Math.min(
    BLUEPRINT_LAYERS.length - 1,
    Math.max(0, Math.floor(((scrollProgress - 0.14) / 0.86) * BLUEPRINT_LAYERS.length))
  );
  const activeLayerIndex = manualLayer !== null ? manualLayer : scrollLayerIndex;
  const activeLayer = BLUEPRINT_LAYERS[activeLayerIndex];

  const handleWebglError = useCallback(() => {
    setWebglReady(false);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    let maxScroll = 1;
    let rafId = 0;
    let lastP = -1;
    let scrollListening = false;

    const updateLayout = () => {
      const vh = window.innerHeight || 900;
      setIsLg(window.innerWidth >= 1024);
      if (sectionRef.current) {
        maxScroll = Math.max(1, sectionRef.current.offsetHeight - vh);
      }
    };

    const measureScroll = () => {
      rafId = 0;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -rect.top / maxScroll));
      if (Math.abs(p - lastP) > 0.0015 || p === 0 || p === 1) {
        lastP = p;
        setScrollProgress(p);
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

    const section = sectionRef.current;
    const observer =
      section && typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (entries) => {
              const intersecting = Boolean(entries[0]?.isIntersecting);
              setIsVisible(intersecting);
              if (intersecting) {
                setLoad3D(true);
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
            { rootMargin: "450px" }
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

  function selectLayer(index: number) {
    setManualLayer(index);
    if (manualTimeoutRef.current) window.clearTimeout(manualTimeoutRef.current);
    manualTimeoutRef.current = window.setTimeout(() => setManualLayer(null), 6000);
  }

  const marqueeFade = Math.max(0, 1 - scrollProgress * 10);
  const expandT = Math.min(1, Math.max(0, scrollProgress / 0.13));
  const rawDissolve = Math.min(1, Math.max(0, (scrollProgress - 0.025) / 0.105));
  const smoothDissolve = rawDissolve * rawDissolve * (3 - 2 * rawDissolve);
  const photoOpacity = Math.max(0, 1 - smoothDissolve);
  const modelOpacity = smoothDissolve;
  const explorerOpacity = Math.min(1, Math.max(0, (scrollProgress - 0.12) * 18));
  const startW = isLg ? 34 : 68;
  const startH = isLg ? 32 : 28;
  const insetX = ((100 - startW) / 2) * (1 - expandT);
  const insetY = ((100 - startH) / 2) * (1 - expandT);
  const clipRadius = Math.round((1 - expandT) * 12);
  const progressRatio = activeLayerIndex / (BLUEPRINT_LAYERS.length - 1);

  return (
    <section
      id="marquee-transition"
      ref={sectionRef}
      className="relative h-[4600px] bg-[#EDE6D6] text-[#2A2725] lg:h-[9180px]"
    >
      <div className="relative h-full w-full">
        <div className="marquee-stage sticky top-0 h-[100dvh] w-full overflow-hidden lg:h-screen">
          {/* Horizontal brand marquee with accessible Pause control */}
          <div
            className="pointer-events-none absolute inset-0 z-10 flex items-center overflow-hidden transition-opacity duration-300"
            style={{ opacity: marqueeFade }}
          >
            <div
              data-paused={marqueePaused ? "true" : "false"}
              className="marquee-track marquee-ambient flex whitespace-nowrap font-sans text-[clamp(2.5rem,1.5rem+5vw,7.5rem)] font-medium leading-none tracking-[-0.07em] text-[#0f3a2e]"
            >
              {[0, 1, 2].map((chunk) => (
                <div key={chunk} className="flex shrink-0">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <span key={i} className="mx-[0.2em]">
                      {BRAND_NAME} · TURNKEY
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Accessible Pause/Play control for continuous marquee */}
          <div
            className="pointer-events-auto absolute bottom-16 left-1/2 z-30 -translate-x-1/2 transition-opacity duration-300 sm:bottom-8 sm:left-auto sm:right-24 sm:translate-x-0"
            style={{ opacity: marqueeFade, pointerEvents: marqueeFade > 0.1 ? "auto" : "none" }}
          >
            <button
              type="button"
              onClick={() => setMarqueePaused((p) => !p)}
              className="cursor-pointer rounded-full border border-[#0f3a2e]/25 bg-white/90 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0f3a2e] backdrop-blur-sm hover:bg-white"
            >
              {marqueePaused ? "Play Marquee" : "Pause Marquee"}
            </button>
          </div>

          {/* Expanding real-house-to-3D-model viewport (clip-path keeps WebGL canvas size constant for 60fps scroll) */}
          <div
            className="absolute inset-0 z-20 overflow-hidden"
            style={{
              clipPath:
                expandT >= 0.999
                  ? "none"
                  : `inset(${insetY.toFixed(2)}% ${insetX.toFixed(2)}% round ${clipRadius}px)`,
              background:
                "linear-gradient(180deg, #0b2d23 0%, #154d3c 44%, #0f3a2e 76%, #081e17 100%)",
            }}
          >
            {/* Interactive 3D wireframe canvas (lazy-loaded on approach) */}
            <div
              className="absolute inset-0 h-full w-full"
              style={{ opacity: modelOpacity }}
            >
              {load3D && webglReady && (
                <VillaBlueprintCanvas
                  activeLayerIndex={activeLayerIndex}
                  isVisible={isVisible}
                  reducedMotion={reducedMotion}
                  onWebglError={handleWebglError}
                />
              )}
            </div>

            {/* Real completed house photo visible at marquee start, dissolving into 3D model on scroll */}
            {photoOpacity > 0.005 && (
              <div
                className="pointer-events-none absolute inset-0 z-[5] overflow-hidden"
                style={{
                  opacity: photoOpacity,
                  transform: `scale(${1 + smoothDissolve * 0.05}) translateZ(0)`,
                }}
              >
                <ArchitecturalArt
                  variant="about-home-daytime"
                  alt="Completed Green Homes modern residence exterior transitioning into 3D structural blueprint"
                  className="h-full w-full object-cover"
                  sizes="(max-width: 1023px) 68vw, 34vw"
                  lazy
                />
              </div>
            )}

            {!webglReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0f3a2e] px-6 text-center text-white">
                <p className="text-xs uppercase tracking-[0.2em]">
                  3D Engineering Blueprint — {activeLayer.title}
                </p>
              </div>
            )}

            <div
              className="pointer-events-none absolute inset-0 z-10"
              style={{
                opacity: expandT >= 0.96 ? explorerOpacity : 0,
                display: expandT >= 0.96 && explorerOpacity > 0.01 ? "block" : "none",
              }}
            >
              {/* Right vertical 7-dot navigation rail */}
              <div className="pointer-events-none absolute right-3 top-[36%] z-10 -translate-y-1/2 lg:right-10 lg:top-1/2">
                <div className="pointer-events-auto relative flex flex-col items-center gap-3.5 lg:gap-4">
                  <div className="absolute left-1/2 top-2.5 h-[calc(100%-1.25rem)] w-px -translate-x-1/2 bg-white/20" />
                  <div
                    className="absolute left-1/2 top-2.5 h-[calc(100%-1.25rem)] w-px origin-top -translate-x-1/2 bg-white transition-transform duration-300"
                    style={{
                      transform: `scaleY(${Math.max(0.08, progressRatio)})`,
                      boxShadow: "0 0 8px rgba(255,255,255,0.45)",
                    }}
                  />
                  {BLUEPRINT_LAYERS.map((layer, idx) => {
                    const isCurrent = idx === activeLayerIndex;
                    return (
                      <button
                        key={layer.key}
                        type="button"
                        aria-current={isCurrent ? "true" : "false"}
                        aria-label={`Show ${layer.title}`}
                        title={layer.title}
                        onClick={() => selectLayer(idx)}
                        className="dot-rail-btn relative z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full"
                      >
                        <span
                          className={`block rounded-full border transition-all duration-300 ${
                            isCurrent
                              ? "h-3.5 w-3.5 border-white bg-white ring-4 ring-white/20"
                              : "h-2 w-2 border-white/40 bg-transparent hover:border-white"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Drag to rotate hint */}
              <div className="pointer-events-none absolute inset-x-0 bottom-28 z-10 hidden justify-center lg:flex">
                <div className="flex flex-col items-center gap-2 text-white/80">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-white/10 backdrop-blur-sm">
                    <svg
                      aria-hidden="true"
                      fill="none"
                      height="20"
                      width="20"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M16.466 7.5C15.643 4.237 13.952 2 12 2 9.239 2 7 6.477 7 12s2.239 10 5 10c.342 0 .677-.069 1-.2" />
                      <path d="m15.194 13.707 3.814 1.86-1.86 3.814" />
                      <path d="M19 15.57c-1.804.885-4.274 1.43-7 1.43-5.523 0-10-2.239-10-5s4.477-5 10-5c4.838 0 8.873 1.718 9.8 4" />
                    </svg>
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em]">
                    Drag to rotate
                  </span>
                </div>
              </div>

              {/* Bottom HUD matching reference mobile composition */}
              <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-16 text-white sm:px-6 lg:px-10 lg:pb-8 lg:pt-28">
                <div className="flex items-end justify-between gap-4">
                  <div role="status" aria-live="polite" className="min-w-0 pr-2 lg:pr-0">
                    <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#c9a86a] lg:mb-3">
                      <span className="h-px w-5 bg-[#c9a86a]" />
                      <span>Turnkey Engineering · 470+ Checks</span>
                    </div>
                    <h3 className="font-sans text-[clamp(1.75rem,1rem+3vw,3.75rem)] leading-none tracking-[-0.04em]">
                      {activeLayer.title}
                    </h3>
                    <p className="mt-2 max-w-md text-[11px] uppercase leading-snug tracking-[0.12em] text-white/85 md:text-sm">
                      {activeLayer.subtitle}
                    </p>
                  </div>

                  <div className="mr-14 shrink-0 text-right md:mr-16">
                    <div className="font-sans text-4xl leading-none tracking-[-0.05em] tabular-nums sm:text-5xl lg:text-8xl">
                      {activeLayer.index}
                    </div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/70">
                      of 07
                    </div>
                  </div>
                </div>

                <div className="pr-14 sm:pr-0">
                  <div
                    role="slider"
                    tabIndex={0}
                    aria-label="Turnkey engineering layer progress"
                    aria-valuemin={1}
                    aria-valuemax={BLUEPRINT_LAYERS.length}
                    aria-valuenow={activeLayerIndex + 1}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowRight")
                        selectLayer(Math.min(BLUEPRINT_LAYERS.length - 1, activeLayerIndex + 1));
                      if (e.key === "ArrowLeft") selectLayer(Math.max(0, activeLayerIndex - 1));
                    }}
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
                      selectLayer(Math.round(ratio * (BLUEPRINT_LAYERS.length - 1)));
                    }}
                    className="relative mt-5 h-[2px] w-full cursor-pointer bg-white/25 lg:mt-6"
                  >
                    <div
                      className="absolute inset-0 origin-left bg-white transition-transform duration-300"
                      style={{ transform: `scaleX(${progressRatio})` }}
                    />
                    {BLUEPRINT_LAYERS.map((_, idx) => (
                      <span
                        key={idx}
                        className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-white/50"
                        style={{ left: `${(idx / (BLUEPRINT_LAYERS.length - 1)) * 100}%` }}
                      />
                    ))}
                    <span
                      className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-all duration-300"
                      style={{
                        left: `${progressRatio * 100}%`,
                        boxShadow: "0 0 10px rgba(255,255,255,0.6)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="pointer-events-none absolute bottom-6 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap text-[10px] uppercase tracking-[0.18em] text-[#0f3a2e]/75 transition-opacity duration-300 sm:bottom-8"
            style={{ opacity: marqueeFade }}
          >
            Scroll to inspect structural layers
          </div>
        </div>
      </div>
    </section>
  );
}
