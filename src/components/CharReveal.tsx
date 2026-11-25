import React from "react";

interface CharRevealProps {
  text: string;
}

export function CharReveal({ text }: CharRevealProps) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, wi) => (
        <React.Fragment key={wi}>
          <span className="inline-block">
            {Array.from(word).map((ch, ci) => (
              <span key={ci} className="char-mask">
                <span className="char-inner">{ch}</span>
              </span>
            ))}
          </span>
          {wi < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </>
  );
}
