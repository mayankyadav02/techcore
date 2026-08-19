
"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export type CatalogueStat = {
  label: string;
  value: number;
};

const heroSlides = [
  "/images/home/hero-01.webp",
  "/images/home/hero-02.webp",
  "/images/home/hero-03.webp",
];

export function HeroVisual({ stats }: { stats: CatalogueStat[] }) {
  const reduce = useReducedMotion();
  const [activeImage, setActiveImage] = useState(0);

  const published = stats.filter((item) => item.value > 0);
  const max = Math.max(1, ...published.map((item) => item.value));

  useEffect(() => {
    if (reduce || heroSlides.length < 2) return;

    const interval = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [reduce]);

  return (
    <div
      className="
        relative overflow-hidden
        rounded-[24px]

        border border-brand/15
        bg-white/45

        shadow-[0_24px_80px_rgba(7,17,31,0.08)]
        backdrop-blur-sm

        dark:border-white/15
        dark:bg-white/[0.055]
        dark:shadow-[0_24px_80px_rgba(0,0,0,0.28)]
      "
    >
      {/* Premium grid */}
      <div
        className="
          pointer-events-none absolute inset-0
          opacity-30
          dark:opacity-20
        "
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(0 200 120 / 0.10) 1px, transparent 1px), linear-gradient(to bottom, rgb(0 200 120 / 0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <motion.div
        className="
          relative m-3
          overflow-hidden
          rounded-[20px]

          border border-brand/10
          bg-white/45

          p-4
          backdrop-blur-sm

          sm:m-5 sm:p-5

          dark:border-white/10
          dark:bg-navy-950/40
        "
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        {/* Header */}
        <div>
          <p
            className="
              text-[0.65rem]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-brand-dark
              dark:text-brand-bright
            "
          >
            TechCore Platform
          </p>

          <h2
            className="
              mt-1
              text-base
              font-semibold
              tracking-tight
              text-navy-950
              sm:text-lg
              dark:text-white
            "
          >
            Published Catalogue
          </h2>

          <p
            className="
              mt-1
              max-w-md
              text-xs
              leading-5
              text-ink-muted
              dark:text-white/55
            "
          >
            A live overview of the digital services, solutions, projects and
            content currently published by TechCore.
          </p>
        </div>

        {published.length === 0 ? (
          <p
            className="
              mt-6
              text-sm
              text-ink-muted
              dark:text-white/60
            "
          >
            No published catalogue records yet.
          </p>
        ) : (
          <>
            {/* Stats */}
            <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {published.slice(0, 6).map((item) => (
                <li
                  key={item.label}
                  className="
                    rounded-xl
                    border border-brand/10
                    bg-white/35

                    px-3 py-3

                    transition-all
                    duration-200

                    hover:border-brand/30
                    hover:bg-brand/[0.08]

                    dark:border-white/10
                    dark:bg-white/[0.035]
                    dark:hover:bg-brand/[0.07]
                  "
                >
                  <p
                    className="
                      text-[0.65rem]
                      text-ink-subtle
                      dark:text-white/45
                    "
                  >
                    {item.label}
                  </p>

                  <p
                    className="
                      mt-1
                      text-xl
                      font-semibold
                      tabular-nums
                      text-navy-950
                      dark:text-white
                    "
                  >
                    {item.value}
                  </p>
                </li>
              ))}
            </ul>

            {/* Graph */}
            <div
              className="
                mt-4
                rounded-xl
                border border-brand/10
                bg-white/30
                p-4

                dark:border-white/10
                dark:bg-navy-900/35
              "
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p
                    className="
                      text-[0.65rem]
                      font-semibold
                      uppercase
                      tracking-[0.12em]
                      text-ink-subtle
                      dark:text-white/45
                    "
                  >
                    Relative Volume
                  </p>

                  <p
                    className="
                      mt-1
                      text-[0.68rem]
                      text-ink-subtle
                      dark:text-white/40
                    "
                  >
                    Published content distribution
                  </p>
                </div>

                <div
                  className="
                    h-2 w-2
                    rounded-full
                    bg-brand
                    shadow-[0_0_12px_rgba(0,200,120,0.55)]
                    dark:bg-brand-bright
                    dark:shadow-[0_0_12px_rgba(0,240,106,0.75)]
                  "
                />
              </div>

              <div
                className="mt-5 flex h-24 items-end gap-2"
                aria-hidden="true"
              >
                {published.slice(0, 7).map((item) => {
                  const height = Math.max(
                    14,
                    Math.round((item.value / max) * 88),
                  );

                  return (
                    <div
                      key={item.label}
                      className="
                        group
                        flex h-full
                        flex-1
                        flex-col
                        justify-end
                      "
                    >
                      <div
                        className="
                          w-full
                          rounded-t-md

                          bg-gradient-to-t
                          from-brand/45
                          via-brand/90
                          to-brand-bright

                          transition-all
                          duration-300

                          group-hover:from-brand
                          group-hover:to-brand-bright
                        "
                        style={{ height: `${height}px` }}
                      />

                      <span
                        className="
                          mt-2
                          truncate
                          text-center
                          text-[0.55rem]
                          text-ink-subtle
                          dark:text-white/35
                        "
                      >
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Image Slider */}
            <div
              className="
                mt-4
                overflow-hidden
                rounded-xl
                border border-brand/10
                bg-white/20

                dark:border-white/10
                dark:bg-black/15
              "
            >
              <div className="relative aspect-[16/7] overflow-hidden">
                {heroSlides.map((src, index) => (
                  <motion.div
                    key={src}
                    className="absolute inset-0"
                    initial={false}
                    animate={{
                      opacity: index === activeImage ? 1 : 0,
                      scale: index === activeImage ? 1 : 1.03,
                    }}
                    transition={{
                      duration: reduce ? 0 : 0.7,
                      ease: "easeInOut",
                    }}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 90vw, 42vw"
                      className="object-cover"
                    />

                    {/* Light mode image readability */}
                    <div
                      className="
                        absolute inset-0
                        bg-gradient-to-t
                        from-white/15
                        via-transparent
                        to-transparent

                        dark:hidden
                      "
                    />

                    {/* Dark mode image readability */}
                    <div
                      className="
                        absolute inset-0 hidden
                        bg-gradient-to-t
                        from-navy-950/60
                        via-navy-950/5
                        to-transparent

                        dark:block
                      "
                    />
                  </motion.div>
                ))}

                {/* Slider dots */}
                <div
                  className="
                    absolute
                    bottom-3
                    left-1/2
                    flex
                    -translate-x-1/2
                    gap-1.5
                  "
                >
                  {heroSlides.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      aria-label={`Show hero image ${index + 1}`}
                      aria-current={index === activeImage}
                      onClick={() => setActiveImage(index)}
                      className={`
                        h-1.5
                        rounded-full
                        transition-all
                        duration-300
                        ${
                          index === activeImage
                            ? "w-6 bg-brand-bright shadow-[0_0_8px_rgba(0,240,106,0.55)]"
                            : "w-1.5 bg-white/65"
                        }
                      `}
                    />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
