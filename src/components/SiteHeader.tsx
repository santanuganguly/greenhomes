"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND_NAME, CONTACT_INFO } from "@/data/siteContent";
import { HoverRevealText } from "./HoverRevealText";
import { useContact } from "./ContactContext";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { openContact } = useContact();

  const isTour = pathname?.startsWith("/tour");
  const anchor = (id: string) => (isTour ? `/#${id}` : `#${id}`);

  useEffect(() => {
    const el = menuContainerRef.current;
    if (!el) return;
    if (!menuOpen) {
      el.setAttribute("inert", "");
    } else {
      el.removeAttribute("inert");
    }
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    }

    function onPointerDown(e: PointerEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuOpen]);

  const menuLinks = [
    { label: "About", href: anchor("about") },
    { label: "3D Blueprint", href: anchor("marquee-transition") },
    { label: "Why Green Homes", href: anchor("why-green-homes") },
    { label: "Services", href: anchor("services") },
    { label: "How It Works", href: anchor("process") },
    { label: "Cost Estimator", href: anchor("estimator") },
    { label: "FAQ", href: anchor("faq") },
  ];

  return (
    <header>
      <nav
        ref={navRef}
        aria-label="Primary"
        className="fixed left-0 top-0 z-50 w-full px-6 py-4 md:px-10 md:py-4"
      >
        <div className="flex items-start justify-between gap-3">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="inline-flex min-h-[44px] shrink-0 items-center rounded-full border border-[#0f3a2e]/15 bg-[#EDE6D6]/92 px-4 py-2 text-sm font-bold tracking-[0.06em] text-[#0f3a2e] shadow-sm backdrop-blur-md transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f3a2e] sm:px-5 sm:text-base"
          >
            {BRAND_NAME}
          </Link>

          <div className="relative flex flex-col items-end">
            <div className="flex items-center gap-2 sm:gap-2.5">
              <a
                href={CONTACT_INFO.dashboardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center rounded-full border border-[#0f3a2e]/20 bg-[#0f3a2e] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-sm transition-colors hover:bg-[#155341] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a86a] sm:inline-flex"
              >
                My Dashboard
              </a>
              <button
                type="button"
                aria-expanded={menuOpen}
                aria-controls="site-menu"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex min-h-[44px] cursor-pointer items-center gap-2.5 rounded-full border border-[#0f3a2e]/15 bg-[#EDE6D6]/92 px-4 py-2 text-xs font-bold leading-none tracking-tight text-[#0f3a2e] shadow-sm backdrop-blur-md transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f3a2e] sm:text-sm"
              >
                <span>MENU</span>
                <span
                  aria-hidden="true"
                  className="grid grid-cols-2"
                  style={{
                    gap: menuOpen ? "5px" : "2px",
                    transform: menuOpen ? "rotate(45deg)" : "none",
                    transition:
                      "gap 500ms cubic-bezier(0.22,1,0.36,1), transform 500ms cubic-bezier(0.22,1,0.36,1)",
                  }}
                >
                  <i className="block h-[3px] w-[3px] rounded-full bg-current" />
                  <i className="block h-[3px] w-[3px] rounded-full bg-current" />
                  <i className="block h-[3px] w-[3px] rounded-full bg-current" />
                  <i className="block h-[3px] w-[3px] rounded-full bg-current" />
                </span>
              </button>
            </div>

            <div
              id="site-menu"
              ref={menuContainerRef}
              className="absolute right-0 top-full mt-2 w-[min(82vw,18rem)] overflow-y-auto rounded-2xl border border-[#0f3a2e]/15 bg-[#EDE6D6]/96 text-[#0f3a2e] shadow-xl backdrop-blur-md transition-[max-height,opacity] duration-300 ease-out sm:w-auto sm:min-w-[15rem]"
              style={{
                maxHeight: menuOpen ? "calc(100dvh - 5.5rem)" : "0px",
                opacity: menuOpen ? 1 : 0,
              }}
            >
              <ul className="flex flex-col items-end gap-1 px-5 py-4 text-right sm:px-6">
                {menuLinks.map((item, idx) => (
                  <li key={item.label} className="w-full overflow-hidden">
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="menu-item flex min-h-[42px] items-center justify-end text-sm font-bold uppercase leading-[1.2] tracking-tight transition-transform duration-300 md:text-base"
                      style={{
                        transitionDelay: `${idx * 20}ms`,
                        transform: menuOpen ? "translateY(0%)" : "translateY(110%)",
                      }}
                    >
                      <HoverRevealText text={item.label} />
                    </Link>
                  </li>
                ))}
                <li className="overflow-hidden pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      openContact();
                    }}
                    className="menu-item flex min-h-[44px] cursor-pointer items-center rounded-full bg-[#0f3a2e] px-5 py-2 text-xs font-bold uppercase leading-[1.2] tracking-[0.12em] text-white transition-transform duration-300 hover:bg-[#155341]"
                    style={{
                      transitionDelay: `${menuLinks.length * 20}ms`,
                      transform: menuOpen ? "translateY(0%)" : "translateY(110%)",
                    }}
                  >
                    Book Consultation →
                  </button>
                </li>
                <li className="overflow-hidden pt-1 sm:hidden">
                  <a
                    href={CONTACT_INFO.dashboardUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="menu-item flex min-h-[42px] items-center justify-end text-xs font-semibold uppercase tracking-[0.14em] text-[#155341] underline underline-offset-4"
                  >
                    My Dashboard ↗
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
