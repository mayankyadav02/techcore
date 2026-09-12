"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function HomeHeroBackdrop({
  images,
}: {
  images: string[];
}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce || images.length < 2) return;

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, 7000);

    return () => window.clearInterval(id);
  }, [images.length, reduce]);

  if (images.length === 0) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {images.map((src, imageIndex) => (
        <div
          key={src}
          className="
            absolute inset-0
            transition-opacity
            duration-[1400ms]
            ease-in-out
          "
          style={{
            opacity: imageIndex === index ? 1 : 0,
          }}
        >
          <Image
            src={src}
            alt=""
            fill
            priority={imageIndex === 0}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      ))}

      {/* Overall readability overlay */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-r
          from-white/25
          via-transparent
          to-transparent
          dark:from-navy-950/45
          dark:via-navy-950/15
          dark:to-transparent
        "
      />
    </div>
  );
}