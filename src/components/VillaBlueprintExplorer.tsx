"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { BLUEPRINT_LAYERS, BRAND_NAME } from "@/data/siteContent";

interface LayerMeshes {
  walls: THREE.Group;
  floor: THREE.Group;
  roof: THREE.Group;
  pillars: THREE.Group;
  stairs: THREE.Group;
  openings: THREE.Group;
}

const CAMERA_TARGETS: Record<string, { yaw: number; pitch: number; dist: number }> = {
  full: { yaw: 0.65, pitch: 0.36, dist: 15.5 },
  walls: { yaw: 0.95, pitch: 0.32, dist: 14.5 },
  floor: { yaw: 0.55, pitch: 0.65, dist: 15.0 },
  roof: { yaw: 0.72, pitch: 0.58, dist: 14.8 },
  pillars: { yaw: 0.38, pitch: 0.24, dist: 13.8 },
  stairs: { yaw: -0.45, pitch: 0.44, dist: 13.0 },
  openings: { yaw: 1.15, pitch: 0.28, dist: 14.2 },
};

function addBoxPart(
  group: THREE.Group,
  w: number,
  h: number,
  d: number,
  x: number,
  y: number,
  z: number,
  solidColor: number,
  edgeColor: number,
  opacity = 0.28
) {
  const geom = new THREE.BoxGeometry(w, h, d);
  const mat = new THREE.MeshStandardMaterial({
    color: solidColor,
    transparent: true,
    opacity,
    roughness: 0.65,
    metalness: 0.1,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geom, mat);
  mesh.position.set(x, y, z);

  const edges = new THREE.EdgesGeometry(geom);
  const lineMat = new THREE.LineBasicMaterial({
    color: edgeColor,
    transparent: true,
    opacity: 0.85,
  });
  const wire = new THREE.LineSegments(edges, lineMat);
  mesh.add(wire);
  group.add(mesh);
}

export function VillaBlueprintExplorer() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [stageWidth, setStageWidth] = useState<number | null>(null);
  const [manualLayer, setManualLayer] = useState<number | null>(null);
  const [marqueePaused, setMarqueePaused] = useState(false);
  const [webglReady, setWebglReady] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  const activeLayerRef = useRef(0);
  const manualTimeoutRef = useRef<number | null>(null);

  const scrollLayerIndex = Math.min(
    BLUEPRINT_LAYERS.length - 1,
    Math.max(0, Math.floor(((scrollProgress - 0.12) / 0.88) * BLUEPRINT_LAYERS.length))
  );
  const activeLayerIndex = manualLayer !== null ? manualLayer : scrollLayerIndex;
  const activeLayer = BLUEPRINT_LAYERS[activeLayerIndex];
  activeLayerRef.current = activeLayerIndex;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    let stableVh = window.innerHeight || 900;
    let rafId = 0;
    let lastP = -1;

    const updateLayout = () => {
      stableVh = window.innerHeight || 900;
      if (sectionRef.current) setStageWidth(sectionRef.current.clientWidth);
    };

    const measureScroll = () => {
      rafId = 0;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const maxScroll = Math.max(1, el.offsetHeight - stableVh);
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
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const host = canvasHostRef.current;
    const section = sectionRef.current;
    if (!host || !section) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        precision: "highp",
      });
    } catch {
      setWebglReady(false);
      return;
    }

    const getPixelRatio = () => Math.min(3, Math.max(2, window.devicePixelRatio || 1));
    renderer.setPixelRatio(getPixelRatio());
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setSize(host.clientWidth || 800, host.clientHeight || 600, false);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    // Allow vertical page scroll on touch devices while horizontal swipe rotates the 3D model
    renderer.domElement.style.touchAction = "pan-y";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      (host.clientWidth || 800) / (host.clientHeight || 600),
      0.1,
      100
    );

    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const dirLight = new THREE.DirectionalLight(0xfff1dc, 1.4);
    dirLight.position.set(10, 14, 12);
    scene.add(dirLight);

    const villaRoot = new THREE.Group();
    scene.add(villaRoot);

    const layers: LayerMeshes = {
      floor: new THREE.Group(),
      walls: new THREE.Group(),
      roof: new THREE.Group(),
      pillars: new THREE.Group(),
      stairs: new THREE.Group(),
      openings: new THREE.Group(),
    };

    addBoxPart(layers.floor, 12.6, 0.24, 7.6, 0, -1.6, 0, 0x90b4df, 0xd9ebff, 0.25);
    addBoxPart(layers.floor, 8.2, 0.22, 6.0, 2.0, 0.7, -0.3, 0x90b4df, 0xd9ebff, 0.25);
    addBoxPart(layers.floor, 15.0, 0.08, 10.5, 0, -1.76, 0.8, 0x5c85bc, 0x9bc2ef, 0.16);

    addBoxPart(layers.walls, 0.24, 2.2, 5.6, 5.8, -0.4, -0.4, 0x587fb3, 0xe8f3ff, 0.24);
    addBoxPart(layers.walls, 5.4, 2.2, 0.24, 3.2, -0.4, -3.1, 0x587fb3, 0xe8f3ff, 0.24);
    addBoxPart(layers.walls, 0.24, 2.2, 4.4, 0.4, -0.4, -0.9, 0x587fb3, 0xe8f3ff, 0.22);
    addBoxPart(layers.walls, 5.8, 2.1, 0.24, 2.9, 1.85, -3.1, 0x587fb3, 0xe8f3ff, 0.24);
    addBoxPart(layers.walls, 0.24, 2.1, 5.6, 5.8, 1.85, -0.3, 0x587fb3, 0xe8f3ff, 0.24);
    addBoxPart(layers.walls, 0.24, 2.1, 5.6, -0.1, 1.85, -0.3, 0x587fb3, 0xe8f3ff, 0.24);

    addBoxPart(layers.roof, 12.8, 0.26, 7.2, 0, 0.82, -0.2, 0x87b3e6, 0xffffff, 0.22);
    addBoxPart(layers.roof, 6.4, 0.28, 6.0, 2.9, 2.95, -0.3, 0x87b3e6, 0xffffff, 0.24);
    addBoxPart(layers.roof, 6.2, 0.55, 0.08, -3.0, 1.22, 3.2, 0x6794cb, 0xd4e8ff, 0.35);

    for (let i = 0; i < 8; i++) {
      const px = -5.8 + i * 0.88;
      addBoxPart(layers.pillars, 0.2, 2.25, 0.2, px, -0.38, 3.3, 0xdcebff, 0xffffff, 0.35);
    }
    addBoxPart(layers.pillars, 0.24, 2.25, 0.24, 5.8, -0.38, 3.3, 0xdcebff, 0xffffff, 0.35);
    addBoxPart(layers.pillars, 0.24, 2.25, 0.24, 2.5, -0.38, 3.3, 0xdcebff, 0xffffff, 0.35);

    for (let s = 0; s < 10; s++) {
      addBoxPart(
        layers.stairs,
        1.4,
        0.14,
        0.34,
        1.4,
        -1.38 + s * 0.21,
        1.2 - s * 0.32,
        0xffe4bd,
        0xfff6e5,
        0.45
      );
    }

    addBoxPart(layers.openings, 5.2, 2.0, 0.06, -3.0, -0.45, 2.9, 0x1e2c44, 0xffe4b8, 0.42);
    addBoxPart(layers.openings, 2.2, 1.85, 0.06, 1.4, 1.85, 2.5, 0x1e2c44, 0xffe4b8, 0.48);
    addBoxPart(layers.openings, 1.5, 1.35, 0.06, 4.1, 1.9, 2.5, 0x1e2c44, 0xffe4b8, 0.48);
    addBoxPart(layers.openings, 1.2, 1.9, 0.06, 4.4, -0.5, 2.5, 0x1e2c44, 0xffe4b8, 0.48);

    Object.values(layers).forEach((g) => villaRoot.add(g));

    const grid = new THREE.GridHelper(24, 24, 0xbfdcf7, 0x5d8d80);
    grid.position.y = -1.8;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.32;
    villaRoot.add(grid);

    let targetYaw = CAMERA_TARGETS.full.yaw;
    let targetPitch = CAMERA_TARGETS.full.pitch;
    let targetDist = CAMERA_TARGETS.full.dist;
    let currentYaw = targetYaw;
    let currentPitch = targetPitch;
    let currentDist = targetDist;
    let lastLayerApplied = -1;

    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let userDragOffsetYaw = 0;
    let userDragOffsetPitch = 0;

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      userDragOffsetYaw -= dx * 0.007;
      userDragOffsetPitch = Math.max(-0.4, Math.min(0.65, userDragOffsetPitch + dy * 0.005));
    };
    const onPointerUp = () => {
      dragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    let lastHostW = 0;
    let lastHostH = 0;

    const syncCanvasSize = () => {
      if (!host) return;
      const rect = host.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width || host.clientWidth || 800));
      const h = Math.max(1, Math.round(rect.height || host.clientHeight || 600));
      if (w === lastHostW && h === lastHostH) return;
      lastHostW = w;
      lastHostH = h;
      renderer.setPixelRatio(getPixelRatio());
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      domEl.style.width = "100%";
      domEl.style.height = "100%";
    };
    syncCanvasSize();
    window.addEventListener("resize", syncCanvasSize);
    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(syncCanvasSize) : null;
    if (resizeObserver) resizeObserver.observe(host);

    let rafId = 0;
    let isVisible = true;
    const clock = new THREE.Clock();

    const animate = () => {
      if (!isVisible) {
        rafId = 0;
        return;
      }
      rafId = requestAnimationFrame(animate);
      syncCanvasSize();
      const t = clock.getElapsedTime();
      const idx = activeLayerRef.current;

      if (idx !== lastLayerApplied) {
        lastLayerApplied = idx;
        const key = BLUEPRINT_LAYERS[idx].key;
        const preset = CAMERA_TARGETS[key];
        targetYaw = preset.yaw;
        targetPitch = preset.pitch;
        targetDist = preset.dist;

        (Object.keys(layers) as Array<keyof LayerMeshes>).forEach((layerKey) => {
          const isFocused = key === "full" || key === layerKey;
          layers[layerKey].traverse((obj) => {
            if (obj instanceof THREE.Mesh) {
              const mat = obj.material as THREE.MeshStandardMaterial;
              mat.opacity = isFocused ? (key === "full" ? 0.34 : 0.58) : 0.14;
              mat.depthWrite = isFocused;
            }
            if (obj instanceof THREE.LineSegments) {
              const lmat = obj.material as THREE.LineBasicMaterial;
              lmat.opacity = isFocused ? 1.0 : 0.34;
            }
          });
        });
      }

      const ambientDrift = dragging || reducedMotion ? 0 : Math.sin(t * 0.35) * 0.08;
      currentYaw += (targetYaw + userDragOffsetYaw + ambientDrift - currentYaw) * 0.07;
      currentPitch += (targetPitch + userDragOffsetPitch - currentPitch) * 0.07;
      currentDist += (targetDist - currentDist) * 0.07;

      const clampedPitch = Math.max(0.08, Math.min(1.15, currentPitch));
      const portraitScale =
        camera.aspect < 1 ? Math.min(1.65, 0.88 / Math.max(0.42, camera.aspect)) : 1;
      const effectiveDist = currentDist * portraitScale;
      camera.position.set(
        Math.sin(currentYaw) * Math.cos(clampedPitch) * effectiveDist,
        Math.sin(clampedPitch) * effectiveDist + 0.3,
        Math.cos(currentYaw) * Math.cos(clampedPitch) * effectiveDist
      );
      camera.lookAt(0, camera.aspect < 1 ? -0.35 : 0.2, 0);
      renderer.render(scene, camera);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = Boolean(entry?.isIntersecting);
        if (isVisible && rafId === 0) {
          animate();
        } else if (!isVisible && rafId !== 0) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(section);

    animate();

    return () => {
      observer.disconnect();
      if (resizeObserver) resizeObserver.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
      domEl.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("resize", syncCanvasSize);
      renderer.dispose();
      if (host.contains(domEl)) host.removeChild(domEl);
    };
  }, [reducedMotion]);

  function selectLayer(index: number) {
    setManualLayer(index);
    if (manualTimeoutRef.current) window.clearTimeout(manualTimeoutRef.current);
    manualTimeoutRef.current = window.setTimeout(() => setManualLayer(null), 6000);
  }

  const marqueeFade = Math.max(0, 1 - scrollProgress * 11);
  const expandT = Math.min(1, Math.max(0, scrollProgress / 0.085));
  const explorerOpacity = Math.min(1, Math.max(0, (scrollProgress - 0.09) * 14));
  const progressRatio = activeLayerIndex / (BLUEPRINT_LAYERS.length - 1);

  return (
    <section
      id="marquee-transition"
      ref={sectionRef}
      className="relative h-[4600px] bg-[#EDE6D6] text-[#2A2725] lg:h-[9180px]"
    >
      <div className="relative h-full w-full">
        <div
          className="marquee-stage sticky top-0 h-[100dvh] w-full overflow-hidden lg:h-screen"
          style={{ maxWidth: stageWidth ? `${stageWidth}px` : "100%" }}
        >
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

          {/* Expanding 3D viewport */}
          <div
            className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 overflow-hidden"
            style={{
              width: `${34 + expandT * 66}%`,
              height: `${32 + expandT * 68}%`,
              minWidth: expandT > 0.8 ? "100%" : "260px",
              minHeight: expandT > 0.8 ? "100%" : "200px",
              borderRadius: `${Math.round((1 - expandT) * 10)}px`,
              background:
                "linear-gradient(180deg, #0b2d23 0%, #154d3c 44%, #0f3a2e 76%, #081e17 100%)",
            }}
          >
            <div
              ref={canvasHostRef}
              role="img"
              aria-label="Interactive 3D turnkey structural engineering model. Swipe horizontally to rotate."
              className="h-full w-full cursor-grab active:cursor-grabbing"
            />

            {!webglReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0f3a2e] px-6 text-center text-white">
                <p className="text-xs uppercase tracking-[0.2em]">
                  3D Engineering Blueprint — {activeLayer.title}
                </p>
              </div>
            )}

            <div
              className="pointer-events-none absolute inset-0"
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
