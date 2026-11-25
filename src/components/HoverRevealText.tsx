"use client";

import React from "react";

interface HoverRevealTextProps {
  text: string;
  className?: string;
}

export function HoverRevealText({ text, className = "" }: HoverRevealTextProps) {
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
