"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { BLUEPRINT_LAYERS } from "@/data/siteContent";

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

interface VillaBlueprintCanvasProps {
  activeLayerIndex: number;
  isVisible: boolean;
  reducedMotion: boolean;
  onWebglError: () => void;
}

export function VillaBlueprintCanvas({
  activeLayerIndex,
  isVisible,
  reducedMotion,
  onWebglError,
}: VillaBlueprintCanvasProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const activeLayerRef = useRef(activeLayerIndex);
  const isVisibleRef = useRef(isVisible);
  const resumeRef = useRef<(() => void) | null>(null);

  activeLayerRef.current = activeLayerIndex;
  isVisibleRef.current = isVisible;

  useEffect(() => {
    if (isVisible && resumeRef.current) {
      resumeRef.current();
    }
  }, [isVisible]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        precision: "highp",
      });
    } catch {
      onWebglError();
      return;
    }

    const getPixelRatio = () => {
      const mobile = window.innerWidth < 768;
      return Math.min(mobile ? 1.5 : 2, window.devicePixelRatio || 1);
    };

    const initW = host.clientWidth || 800;
    const initH = host.clientHeight || 600;
    renderer.setPixelRatio(getPixelRatio());
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setSize(initW, initH, false);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.touchAction = "pan-y";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, initW / initH, 0.1, 100);

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

    let lastHostW = initW;
    let lastHostH = initH;

    const applyCanvasSize = (rawW: number, rawH: number) => {
      const w = Math.max(1, Math.round(rawW));
      const h = Math.max(1, Math.round(rawH));
      if (w === lastHostW && h === lastHostH) return;
      lastHostW = w;
      lastHostH = h;
      renderer.setPixelRatio(getPixelRatio());
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver((entries) => {
            const entry = entries[0];
            if (entry) applyCanvasSize(entry.contentRect.width, entry.contentRect.height);
          })
        : null;
    if (resizeObserver) resizeObserver.observe(host);

    let rafId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      if (!isVisibleRef.current) {
        rafId = 0;
        return;
      }
      rafId = requestAnimationFrame(animate);
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

    resumeRef.current = () => {
      if (rafId === 0 && isVisibleRef.current) {
        animate();
      }
    };

    // Render one initial frame, then continue animating only while visible
    if (isVisibleRef.current) {
      animate();
    } else {
      renderer.render(scene, camera);
    }

    return () => {
      resumeRef.current = null;
      if (resizeObserver) resizeObserver.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
      domEl.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      renderer.dispose();
      if (host.contains(domEl)) host.removeChild(domEl);
    };
  }, [reducedMotion, onWebglError]);

  return (
    <div
      ref={hostRef}
      role="img"
      aria-label="Interactive 3D turnkey structural engineering model. Swipe horizontally to rotate."
      className="h-full w-full cursor-grab active:cursor-grabbing"
    />
  );
}
