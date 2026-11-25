"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";
import { BRAND_NAME } from "@/data/siteContent";

type SofaPalette = "Linen" | "Espresso" | "Terracotta" | "Sage";
type WoodTone = "Natural Oak" | "Smoked Walnut" | "Pale Ash";

const SOFA_COLORS: Record<SofaPalette, number> = {
  Linen: 0xd9d0c1,
  Espresso: 0x3b332e,
  Terracotta: 0x9c4a38,
  Sage: 0x6f7d65,
};

const WOOD_COLORS: Record<WoodTone, number> = {
  "Natural Oak": 0xa88259,
  "Smoked Walnut": 0x5c422c,
  "Pale Ash": 0xcbb799,
};

export function ApartmentTourClient() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [looking, setLooking] = useState(false);
  const [doorOpen, setDoorOpen] = useState(false);
  const [lampOn, setLampOn] = useState(true);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [sofaPalette, setSofaPalette] = useState<SofaPalette>("Linen");
  const [woodTone, setWoodTone] = useState<WoodTone>("Natural Oak");
  const [webglReady, setWebglReady] = useState(true);

  const doorOpenRef = useRef(doorOpen);
  const lampOnRef = useRef(lampOn);
  const keysRef = useRef<Record<string, boolean>>({});
  const sofaMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const woodMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const lampLightRef = useRef<THREE.PointLight | null>(null);

  doorOpenRef.current = doorOpen;
  lampOnRef.current = lampOn;

  useEffect(() => {
    if (sofaMatRef.current) {
      sofaMatRef.current.color.setHex(SOFA_COLORS[sofaPalette]);
    }
  }, [sofaPalette]);

  useEffect(() => {
    if (woodMatRef.current) {
      woodMatRef.current.color.setHex(WOOD_COLORS[woodTone]);
    }
  }, [woodTone]);

  useEffect(() => {
    if (lampLightRef.current) {
      lampLightRef.current.intensity = lampOn ? 18 : 0;
    }
  }, [lampOn]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
        precision: "highp",
      });
    } catch {
      setWebglReady(false);
      return;
    }

    renderer.setPixelRatio(Math.min(3, Math.max(2, window.devicePixelRatio || 1)));
    renderer.setSize(host.clientWidth || window.innerWidth, host.clientHeight || window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.touchAction = "none";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x9ec5e4);
    scene.fog = new THREE.Fog(0xcbc6bd, 12, 46);

    const camera = new THREE.PerspectiveCamera(
      52,
      (host.clientWidth || window.innerWidth) / (host.clientHeight || window.innerHeight),
      0.1,
      180
    );
    // Match original framing: white facade spans left ~56% (door at ~47%), open lush grass & tiled patio on right
    camera.position.set(0.65, 1.48, 8.75);
    let yaw = 0.01;
    let pitch = -0.055;

    // Sky dome with crisp azure sky & multi-octave procedural cumulus clouds
    const skyGeo = new THREE.SphereGeometry(105, 48, 32);
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: {
        topColor: { value: new THREE.Color(0x185cb0) },
        midColor: { value: new THREE.Color(0x5fa7e2) },
        cloudColor: { value: new THREE.Color(0xfaf4ee) },
        cloudShadowColor: { value: new THREE.Color(0xdfd3cd) },
        bottomColor: { value: new THREE.Color(0xcbc6bd) },
      },
      vertexShader: `
        varying vec3 vWorldPos;
        void main() {
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vWorldPos = wp.xyz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 midColor;
        uniform vec3 cloudColor;
        uniform vec3 cloudShadowColor;
        uniform vec3 bottomColor;
        varying vec3 vWorldPos;

        float hash(vec3 p) {
          p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
          p *= 17.0;
          return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
        }

        float noise(vec3 x) {
          vec3 i = floor(x);
          vec3 f = fract(x);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
                mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
            mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
            f.z
          );
        }

        float fbm(vec3 p) {
          float v = 0.0;
          float a = 0.5;
          for (int i = 0; i < 5; i++) {
            v += a * noise(p);
            p = p * 2.07 + vec3(1.7, 9.2, 4.3);
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec3 dir = normalize(vWorldPos);
          float h = dir.y;
          vec3 col = mix(bottomColor, midColor, smoothstep(0.0, 0.14, h));
          col = mix(col, topColor, smoothstep(0.14, 0.65, h));

          vec3 cloudCoord = vec3(dir.x * 3.8, dir.y * 5.2, dir.z * 3.8);
          float n = fbm(cloudCoord);
          float detail = fbm(cloudCoord * 2.4 + vec3(3.1));
          float density = smoothstep(0.49, 0.69, n * 0.78 + detail * 0.28);
          float horizonFade = smoothstep(0.06, 0.25, h);
          float mask = density * horizonFade;

          float shade = smoothstep(0.35, 0.75, n);
          vec3 cloudCol = mix(cloudShadowColor, cloudColor, shade);
          col = mix(col, cloudCol, clamp(mask * 0.92, 0.0, 0.94));
          gl_FragColor = vec4(col, 1.0);
          #include <colorspace_fragment>
        }
      `,
    });
    scene.add(new THREE.Mesh(skyGeo, skyMat));

    scene.add(new THREE.HemisphereLight(0xffffff, 0x868d73, 1.55));
    const sun = new THREE.DirectionalLight(0xfff9f0, 1.85);
    sun.position.set(14, 18, 14);
    sun.castShadow = true;
    scene.add(sun);

    const warmLamp = new THREE.PointLight(0xffcf8b, lampOnRef.current ? 10 : 0, 8, 2.0);
    warmLamp.position.set(-2.5, 2.3, -1.6);
    scene.add(warmLamp);
    lampLightRef.current = warmLamp;

    // Ground & Tiled Patio (lush green lawn + sandy soil patches + darker stone pavers)
    const grassCanvas = document.createElement("canvas");
    grassCanvas.width = 512;
    grassCanvas.height = 512;
    const gctx = grassCanvas.getContext("2d");
    if (gctx) {
      gctx.fillStyle = "#567d39";
      gctx.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 28000; i++) {
        const rx = Math.abs(Math.sin(i * 12.9898 + 1.23) * 43758.5453) % 1;
        const ry = Math.abs(Math.sin(i * 78.233 + 4.56) * 28473.1923) % 1;
        const gx = Math.floor(rx * 512);
        const gy = Math.floor(ry * 512);
        gctx.fillStyle = i % 6 === 0 ? "#386022" : i % 6 === 1 ? "#4e7c31" : i % 6 === 2 ? "#6f9f49" : i % 6 === 3 ? "#ccb898" : i % 6 === 4 ? "#446e2a" : "#628f40";
        gctx.fillRect(gx, gy, 1.5, 4);
      }
    }
    const grassTex = new THREE.CanvasTexture(grassCanvas);
    grassTex.wrapS = THREE.RepeatWrapping;
    grassTex.wrapT = THREE.RepeatWrapping;
    grassTex.repeat.set(64, 64);
    grassTex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

    const grass = new THREE.Mesh(
      new THREE.PlaneGeometry(360, 360),
      new THREE.MeshStandardMaterial({ map: grassTex, roughness: 0.96 })
    );
    grass.rotation.x = -Math.PI / 2;
    grass.receiveShadow = true;
    scene.add(grass);

    // Tiled patio canvas texture
    const tileCanvas = document.createElement("canvas");
    tileCanvas.width = 256;
    tileCanvas.height = 256;
    const tctx = tileCanvas.getContext("2d");
    if (tctx) {
      tctx.fillStyle = "#484a4e";
      tctx.fillRect(0, 0, 256, 256);
      for (let row = 0; row < 16; row++) {
        for (let col = 0; col < 16; col++) {
          const shade = 64 + ((row * 7 + col * 13) % 28);
          tctx.fillStyle = `rgb(${shade},${shade + 1},${shade + 3})`;
          tctx.fillRect(col * 16 + 1, row * 16 + 1, 14, 14);
        }
      }
    }
    const tileTex = new THREE.CanvasTexture(tileCanvas);
    tileTex.wrapS = THREE.RepeatWrapping;
    tileTex.wrapT = THREE.RepeatWrapping;
    tileTex.repeat.set(5, 3.5);
    tileTex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());

    const patio = new THREE.Mesh(
      new THREE.BoxGeometry(11.6, 0.06, 9.0),
      new THREE.MeshStandardMaterial({ map: tileTex, roughness: 0.88 })
    );
    patio.position.set(-2.9, 0.03, -0.5);
    patio.receiveShadow = true;
    scene.add(patio);

    // Apartment Exterior & Interior (crisp white stucco matching original lighting)
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xf7f8fa, roughness: 0.82 });
    const soffitMat = new THREE.MeshStandardMaterial({ color: 0xeaecef, roughness: 0.8 });
    const interiorWallMat = new THREE.MeshStandardMaterial({ color: 0xede6d6, roughness: 0.9 });
    const woodMat = new THREE.MeshStandardMaterial({
      color: WOOD_COLORS[woodTone],
      roughness: 0.65,
    });
    woodMatRef.current = woodMat;

    const sofaMat = new THREE.MeshStandardMaterial({
      color: SOFA_COLORS[sofaPalette],
      roughness: 0.85,
    });
    sofaMatRef.current = sofaMat;

    // Interior Oak Floor
    const floor = new THREE.Mesh(new THREE.BoxGeometry(8.6, 0.08, 7.6), woodMat);
    floor.position.set(-3.4, 0.04, -2.5);
    floor.receiveShadow = true;
    scene.add(floor);

    // Roof overhang slab (flush parapet aligned at x = +1.00, clean corner join)
    const roof = new THREE.Mesh(new THREE.BoxGeometry(8.72, 0.2, 8.0), wallMat);
    roof.position.set(-3.36, 2.48, -2.35);
    roof.castShadow = true;
    scene.add(roof);

    const fascia = new THREE.Mesh(new THREE.BoxGeometry(8.92, 0.16, 0.42), wallMat);
    fascia.position.set(-3.36, 2.52, 1.78);
    scene.add(fascia);

    // Front wall positioned on the left (`x: -7.6` to `+1.0`), doorway at `x: -0.45 .. +0.41`
    const frontLeft = new THREE.Mesh(new THREE.BoxGeometry(7.2, 2.42, 0.24), wallMat);
    frontLeft.position.set(-4.0, 1.21, 1.65);
    scene.add(frontLeft);

    const frontRight = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2.42, 0.24), wallMat);
    frontRight.position.set(0.7, 1.21, 1.65);
    scene.add(frontRight);

    const frontLintel = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.44, 0.24), wallMat);
    frontLintel.position.set(-0.02, 2.2, 1.65);
    scene.add(frontLintel);

    // Architectural door casing trim
    const casingMat = new THREE.MeshStandardMaterial({ color: 0xd4d7dd, roughness: 0.45, metalness: 0.08 });
    const casingLeft = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.02, 0.28), casingMat);
    casingLeft.position.set(-0.46, 1.01, 1.65);
    scene.add(casingLeft);
    const casingRight = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.02, 0.28), casingMat);
    casingRight.position.set(0.42, 1.01, 1.65);
    scene.add(casingRight);
    const casingTop = new THREE.Mesh(new THREE.BoxGeometry(0.94, 0.06, 0.28), casingMat);
    casingTop.position.set(-0.02, 2.0, 1.65);
    scene.add(casingTop);

    // Side & back walls tucked cleanly behind front wall corner (no overlap seam)
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(8.8, 2.42, 0.24), interiorWallMat);
    backWall.position.set(-3.3, 1.21, -6.2);
    scene.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.24, 2.42, 7.8), wallMat);
    leftWall.position.set(-7.6, 1.21, -2.35);
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.24, 2.42, 7.8), wallMat);
    rightWall.position.set(0.88, 1.21, -2.35);
    scene.add(rightWall);

    // Hinged Entry Door flush in frame (no dark notch) with lever handle & peephole
    const doorPivot = new THREE.Group();
    doorPivot.position.set(-0.45, 0, 1.72);
    const doorLeaf = new THREE.Mesh(
      new THREE.BoxGeometry(0.86, 1.98, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xb1b4ba, roughness: 0.55, metalness: 0.12 })
    );
    doorLeaf.position.set(0.43, 0.99, 0);
    const handle = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.035, 0.14),
      new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.7, roughness: 0.3 })
    );
    handle.position.set(-0.26, -0.04, 0.06);
    doorLeaf.add(handle);
    const peephole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.028, 0.028, 0.09, 14),
      new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.3, roughness: 0.15 })
    );
    peephole.rotation.x = Math.PI / 2;
    peephole.position.set(0.2, 0.45, 0.01);
    doorLeaf.add(peephole);
    doorPivot.add(doorLeaf);
    scene.add(doorPivot);

    // Living Room Sofa
    const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.46, 1.0), sofaMat);
    sofaBase.position.set(-3.2, 0.31, -1.6);
    scene.add(sofaBase);
    const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.5, 0.2), sofaMat);
    sofaBack.position.set(-3.2, 0.7, -2.0);
    scene.add(sofaBack);

    const table = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.06, 0.65), woodMat);
    table.position.set(-3.2, 0.42, -0.4);
    scene.add(table);

    // Kitchen Counter
    const counter = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.88, 0.72),
      new THREE.MeshStandardMaterial({ color: 0xded9cf, roughness: 0.5 })
    );
    counter.position.set(-0.6, 0.48, -5.4);
    scene.add(counter);

    // Bedroom Bed
    const bedFrame = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.36, 2.1), woodMat);
    bedFrame.position.set(-5.8, 0.24, -4.6);
    scene.add(bedFrame);
    const mattress = new THREE.Mesh(
      new THREE.BoxGeometry(1.76, 0.24, 1.95),
      new THREE.MeshStandardMaterial({ color: 0xf4efe6, roughness: 0.9 })
    );
    mattress.position.set(-5.8, 0.52, -4.6);
    scene.add(mattress);

    // Floor Lamp
    const lampStem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.04, 1.65, 10),
      new THREE.MeshStandardMaterial({ color: 0x2a2725, metalness: 0.5 })
    );
    lampStem.position.set(-4.8, 0.88, -1.8);
    scene.add(lampStem);

    const keys = keysRef.current;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const onKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keys[k] = true;
      if (k === "e") {
        const distToDoor = Math.hypot(camera.position.x - 0, camera.position.z - 1.65);
        if (distToDoor < 4.5) {
          setDoorOpen((prev) => !prev);
        } else {
          setLampOn((prev) => !prev);
        }
      }
      if (k === "q") {
        setCustomizeOpen((prev) => !prev);
      }
      if (k === "escape") {
        setLooking(false);
        if (document.pointerLockElement) document.exitPointerLock();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = false;
    };

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (document.pointerLockElement === renderer.domElement) {
        yaw -= e.movementX * 0.0024;
        pitch = Math.max(-0.85, Math.min(0.85, pitch - e.movementY * 0.0024));
      } else if (dragging) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        yaw -= dx * 0.004;
        pitch = Math.max(-0.85, Math.min(0.85, pitch - dy * 0.004));
      }
    };

    const onPointerUp = () => {
      dragging = false;
    };

    const onPointerLockChange = () => {
      setLooking(document.pointerLockElement === renderer.domElement);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    document.addEventListener("pointerlockchange", onPointerLockChange);

    const onResize = () => {
      const w = host.clientWidth || window.innerWidth;
      const h = host.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    let rafId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const dt = Math.min(0.05, clock.getDelta());

      const targetAngle = doorOpenRef.current ? -Math.PI * 0.48 : 0;
      doorPivot.rotation.y += (targetAngle - doorPivot.rotation.y) * 0.1;

      const speed = 3.8 * dt;
      const forwardX = -Math.sin(yaw);
      const forwardZ = -Math.cos(yaw);
      const rightX = Math.cos(yaw);
      const rightZ = -Math.sin(yaw);

      if (keys["w"] || keys["arrowup"]) {
        camera.position.x += forwardX * speed;
        camera.position.z += forwardZ * speed;
      }
      if (keys["s"] || keys["arrowdown"]) {
        camera.position.x -= forwardX * speed;
        camera.position.z -= forwardZ * speed;
      }
      if (keys["a"] || keys["arrowleft"]) {
        camera.position.x -= rightX * speed;
        camera.position.z -= rightZ * speed;
      }
      if (keys["d"] || keys["arrowright"]) {
        camera.position.x += rightX * speed;
        camera.position.z += rightZ * speed;
      }

      camera.position.x = Math.max(-7.0, Math.min(4.2, camera.position.x));
      camera.position.z = Math.max(-5.8, Math.min(10.5, camera.position.z));

      camera.rotation.order = "YXZ";
      camera.rotation.y = yaw;
      camera.rotation.x = pitch;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointerlockchange", onPointerLockChange);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (host.contains(renderer.domElement)) host.removeChild(renderer.domElement);
    };
  }, []);

  function activateLook() {
    const canvas = hostRef.current?.querySelector("canvas");
    if (canvas && canvas.requestPointerLock) {
      try {
        canvas.requestPointerLock();
      } catch {
        setLooking(true);
      }
    } else {
      setLooking(true);
    }
  }

  function setVirtualKey(key: string, pressed: boolean) {
    keysRef.current[key] = pressed;
  }

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-[#9ec5e4] text-[#171717]">
      {/* Bottom-left BACK TO SITE pill */}
      <Link
        href="/"
        className="group pointer-events-auto fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-4 z-30 hidden items-center gap-2.5 rounded-full bg-[#EDE6D6]/90 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-[#0f3a2e] shadow-lg transition-colors duration-300 hover:bg-[#EDE6D6] md:left-10 lg:flex [@media(max-width:1023px)_and_(orientation:landscape)]:flex"
      >
        <span>← Back to Green Homes</span>
      </Link>

      {/* Mobile landscape touch movement & action controls */}
      <div className="pointer-events-none fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 hidden items-end justify-between [@media(max-width:1023px)_and_(orientation:landscape)]:flex">
        <div className="w-32" />
        <div className="pointer-events-auto flex items-center gap-2 rounded-2xl bg-[#EDE6D6]/85 p-2 shadow-lg backdrop-blur-md">
          <button
            type="button"
            aria-label="Move left"
            onPointerDown={() => setVirtualKey("a", true)}
            onPointerUp={() => setVirtualKey("a", false)}
            onPointerLeave={() => setVirtualKey("a", false)}
            onPointerCancel={() => setVirtualKey("a", false)}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-sm font-bold text-[#0f3a2e] active:bg-[#0f3a2e] active:text-white"
          >
            ←
          </button>
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              aria-label="Move forward"
              onPointerDown={() => setVirtualKey("w", true)}
              onPointerUp={() => setVirtualKey("w", false)}
              onPointerLeave={() => setVirtualKey("w", false)}
              onPointerCancel={() => setVirtualKey("w", false)}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-sm font-bold text-[#0f3a2e] active:bg-[#0f3a2e] active:text-white"
            >
              ↑
            </button>
            <button
              type="button"
              aria-label="Move backward"
              onPointerDown={() => setVirtualKey("s", true)}
              onPointerUp={() => setVirtualKey("s", false)}
              onPointerLeave={() => setVirtualKey("s", false)}
              onPointerCancel={() => setVirtualKey("s", false)}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-sm font-bold text-[#0f3a2e] active:bg-[#0f3a2e] active:text-white"
            >
              ↓
            </button>
          </div>
          <button
            type="button"
            aria-label="Move right"
            onPointerDown={() => setVirtualKey("d", true)}
            onPointerUp={() => setVirtualKey("d", false)}
            onPointerLeave={() => setVirtualKey("d", false)}
            onPointerCancel={() => setVirtualKey("d", false)}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-sm font-bold text-[#0f3a2e] active:bg-[#0f3a2e] active:text-white"
          >
            →
          </button>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDoorOpen((p) => !p)}
            className="rounded-full bg-[#EDE6D6]/90 px-3.5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0f3a2e] shadow-md"
          >
            {doorOpen ? "Close Door" : "Open Door"}
          </button>
          <button
            type="button"
            onClick={() => setCustomizeOpen((p) => !p)}
            className="rounded-full bg-[#0f3a2e] px-3.5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white shadow-md"
          >
            Finishes
          </button>
        </div>
      </div>

      <div
        ref={hostRef}
        role="img"
        aria-label="Interactive 3D turnkey residence walkthrough. Click to look around, use W A S D to move."
        className="h-full w-full cursor-grab text-[#171717] active:cursor-grabbing"
      />

      {!webglReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0f3a2e] text-[#EDE6D6]">
          <p className="text-sm uppercase tracking-[0.18em]">
            3D Turnkey Walkthrough Ready (WebGL fallback)
          </p>
        </div>
      )}

      {/* Top center pill: CLICK TO LOOK AROUND */}
      <div className="pointer-events-none fixed inset-x-0 top-5 z-30 hidden justify-center lg:flex [@media(orientation:landscape)]:flex">
        <button
          type="button"
          onClick={activateLook}
          className="pointer-events-auto cursor-pointer rounded-full bg-[#EDE6D6]/90 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0f3a2e] shadow-md backdrop-blur-sm transition-colors hover:bg-[#EDE6D6]"
        >
          {looking ? "Press ESC to release cursor" : "Click to look around · Press Q to customize finishes"}
        </button>
      </div>

      {/* Customize drawer opened via Q */}
      {customizeOpen && (
        <aside
          aria-label="Turnkey finish customizer"
          className="fixed bottom-24 right-6 z-40 w-72 rounded-2xl border border-[#0f3a2e]/15 bg-[#EDE6D6]/95 p-5 text-[#2A2725] shadow-2xl backdrop-blur-md md:right-10"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[#0f3a2e]">
              Customize Turnkey Finishes
            </h2>
            <button
              type="button"
              onClick={() => setCustomizeOpen(false)}
              aria-label="Close customizer"
              className="cursor-pointer text-xs opacity-70 hover:opacity-100"
            >
              ✕
            </button>
          </div>

          <div className="mt-4">
            <p className="text-[10px] uppercase tracking-[0.16em] text-[#2A2725]/65">
              Sofa Upholstery
            </p>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {(Object.keys(SOFA_COLORS) as SofaPalette[]).map((tone) => (
                <button
                  key={tone}
                  type="button"
                  onClick={() => setSofaPalette(tone)}
                  className={`cursor-pointer rounded-lg border px-2.5 py-1.5 text-left text-xs ${
                    sofaPalette === tone
                      ? "border-[#2A2725] bg-[#2A2725] text-[#EDE6D6]"
                      : "border-[#2A2725]/20 bg-white/60"
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-[10px] uppercase tracking-[0.16em] text-[#2A2725]/65">
              Timber Flooring
            </p>
            <div className="mt-2 flex flex-col gap-1.5">
              {(Object.keys(WOOD_COLORS) as WoodTone[]).map((tone) => (
                <button
                  key={tone}
                  type="button"
                  onClick={() => setWoodTone(tone)}
                  className={`cursor-pointer rounded-lg border px-2.5 py-1.5 text-left text-xs ${
                    woodTone === tone
                      ? "border-[#2A2725] bg-[#2A2725] text-[#EDE6D6]"
                      : "border-[#2A2725]/20 bg-white/60"
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#2A2725]/65">
              Floor Lamp
            </span>
            <button
              type="button"
              onClick={() => setLampOn((p) => !p)}
              className="cursor-pointer rounded-full border border-[#2A2725]/25 px-3 py-1 text-[11px] uppercase tracking-[0.12em]"
            >
              {lampOn ? "On" : "Off"}
            </button>
          </div>
        </aside>
      )}

      {/* Portrait Mobile / Tablet Orientation Gate */}
      <div className="fixed inset-0 z-[60] flex flex-col items-center justify-between bg-[#0e0e0e] px-6 py-8 text-white lg:hidden [@media(orientation:landscape)]:hidden">
        <div className="text-base font-bold tracking-tight">{BRAND_NAME}</div>

        <div className="flex flex-col items-center text-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/[0.04]">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/25">
              <svg
                aria-hidden="true"
                fill="none"
                height="24"
                width="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.6"
                viewBox="0 0 24 24"
              >
                <rect x="7" y="4" width="10" height="16" rx="2" />
                <path d="M12 17h.01" />
              </svg>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-white/60">
            <span className="h-px w-6 bg-white/30" />
            <span>Landscape mode</span>
            <span className="h-px w-6 bg-white/30" />
          </div>

          <h2 className="mt-4 font-serif text-[39px] leading-[1.02] text-white md:text-[56px]">
            Turn your device,
            <br />
            sideways.
          </h2>

          <p className="mt-4 max-w-xs text-[12px] uppercase leading-[1.5] tracking-[0.16em] text-white/75">
            This 3D interior experience is built for landscape mode.
          </p>
        </div>

        <Link
          href="/"
          className="text-[11px] uppercase tracking-[0.16em] text-white/60 underline underline-offset-4 hover:text-white"
        >
          ← Back to site
        </Link>
      </div>
    </div>
  );
}
