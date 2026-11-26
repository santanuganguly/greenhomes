import React from "react";
import { PHOTO_META, type PhotoVariant } from "@/data/siteContent";

interface ArchitecturalArtProps {
  variant: PhotoVariant;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  priority?: "high" | "low";
  lazy?: boolean;
  sizes?: string;
}

export function ArchitecturalArt({
  variant,
  alt = "",
  className = "h-full w-full object-cover",
  style,
  priority,
  lazy = false,
  sizes = "100vw",
}: ArchitecturalArtProps) {
  const meta = PHOTO_META[variant];
  const loading = priority === "high" ? "eager" : lazy ? "lazy" : undefined;
  const fetchPriority = priority === "high" ? "high" : priority === "low" && !lazy ? "low" : undefined;

  return (
    <picture className="contents">
      <source
        type="image/webp"
        srcSet={`${meta.webp640} 640w, ${meta.webp} ${meta.width}w`}
        sizes={sizes}
      />
      <img
        src={meta.src}
        alt={alt}
        width={meta.width}
        height={meta.height}
        className={className}
        style={style}
        draggable={false}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding={priority === "high" ? "sync" : "async"}
      />
    </picture>
  );
}
