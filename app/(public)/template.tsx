"use client";

import { FadeIn } from "@/components/motion/fade-in";

export default function PublicTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FadeIn>{children}</FadeIn>;
}
