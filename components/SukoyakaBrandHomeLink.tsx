"use client";

import Image from "next/image";
import Link from "next/link";
import type { PointerEvent } from "react";

type SukoyakaBrandHomeLinkProps = {
  className?: string;
  priority?: boolean;
};

function moveOnigiri(event: PointerEvent<HTMLSpanElement>) {
  if (event.pointerType === "touch") return;

  const mascot = event.currentTarget;
  const bounds = mascot.getBoundingClientRect();
  const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
  const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;

  mascot.style.setProperty("--onigiri-shift-x", `${horizontal * 7}px`);
  mascot.style.setProperty("--onigiri-shift-y", `${vertical * 4}px`);
  mascot.style.setProperty("--onigiri-rotate", `${horizontal * 3.5}deg`);
}

function resetOnigiri(event: PointerEvent<HTMLSpanElement>) {
  const mascot = event.currentTarget;
  mascot.style.removeProperty("--onigiri-shift-x");
  mascot.style.removeProperty("--onigiri-shift-y");
  mascot.style.removeProperty("--onigiri-rotate");
}

export function SukoyakaBrandHomeLink({
  className = "",
  priority = false,
}: SukoyakaBrandHomeLinkProps) {
  return (
    <Link
      className={`sukoyaka-brand-home-link ${className}`.trim()}
      href="/"
      aria-label="子ども食堂 すこやか食堂 トップへ"
    >
      <span
        className="sukoyaka-brand-onigiri"
        onPointerMove={moveOnigiri}
        onPointerLeave={resetOnigiri}
      >
        <Image
          src="/images/brand/sukoyaka-onigiri-logo-transparent-clean.webp"
          alt=""
          width={1097}
          height={731}
          priority={priority}
          draggable={false}
        />
      </span>

      <svg
        className="sukoyaka-brand-wordmark"
        viewBox="188 36 350 112"
        aria-hidden="true"
        focusable="false"
        preserveAspectRatio="xMidYMid meet"
      >
        <image
          href="/images/brand/sukoyaka-site-design-wordmark.webp"
          width="1672"
          height="941"
        />
      </svg>
    </Link>
  );
}
