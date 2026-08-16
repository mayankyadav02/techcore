"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export function HomeHeroBackdrop({ images }: { images: string[] }) {
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

  const current = images[reduce ? 0 : index] ?? images[0];
  if (!current) return null;

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Image
        key={current}
        src={current}
        alt=""
        fill
        priority={current === images[0]}
        sizes="100vw"
        className={cn(
          "object-cover opacity-35",
          reduce ? "" : "motion-fade",
        )}
      />
      <div className="absolute inset-0 bg-navy-950/55" />
    </div>
  );
}
