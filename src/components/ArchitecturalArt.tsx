import React from "react";
import { PHOTO_SOURCES, type PhotoVariant } from "@/data/siteContent";

interface ArchitecturalArtProps {
  variant: PhotoVariant;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  priority?: "high" | "low";
  lazy?: boolean;
}

export function ArchitecturalArt({
  variant,
  alt = "",
  className = "h-full w-full object-cover",
  style,
  priority,
  lazy = false,
}: ArchitecturalArtProps) {
  return (
    <img
      src={PHOTO_SOURCES[variant]}
      alt={alt}
      className={className}
      style={style}
      draggable={false}
      loading={priority === "high" ? undefined : lazy ? "lazy" : undefined}
      fetchPriority={priority}
    />
  );
}
