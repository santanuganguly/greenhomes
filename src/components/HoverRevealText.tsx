"use client";

import React, { useState } from "react";

interface HoverRevealTextProps {
  text: string;
  className?: string;
}

export function HoverRevealText({ text, className = "" }: HoverRevealTextProps) {
  const [enhanced, setEnhanced] = useState(false);

  function activateHover() {
    if (enhanced) return;
    if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
      setEnhanced(true);
    }
  }

  if (!enhanced) {
    return (
      <span
        data-hover-reveal="true"
        onMouseEnter={activateHover}
        className={`inline-block ${className}`}
      >
        {text}
      </span>
    );
  }

  const chars = Array.from(text);

  return (
    <span data-hover-reveal="true" className={`inline-block ${className}`}>
      <span className="hover-reveal-track">
        <span className="hover-reveal-line">
          {chars.map((char, i) => (
            <span
              key={`a-${i}`}
              className="hover-reveal-char"
              style={{ transitionDelay: `${i * 12}ms` }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
        <span className="hover-reveal-line" aria-hidden="true">
          {chars.map((char, i) => (
            <span
              key={`b-${i}`}
              className="hover-reveal-char"
              style={{ transitionDelay: `${i * 12}ms` }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
      </span>
    </span>
  );
}
