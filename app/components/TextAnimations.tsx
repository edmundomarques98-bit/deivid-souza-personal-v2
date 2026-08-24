"use client";

import { useEffect, useRef } from "react";

export function TextAnimations() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const startAnimations = () => {
      if (observerRef.current) return;

      const targets = Array.from(
        document.querySelectorAll<HTMLElement>(
          "main h1, main h2, main h3, main p",
        ),
      );

      observerRef.current = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            observer.unobserve(entry.target);
            const target = entry.target as HTMLElement;
            target.classList.add("text-focus-in");
            target.addEventListener(
              "animationend",
              () => target.style.removeProperty("will-change"),
              { once: true },
            );
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -7% 0px" },
      );

      targets.forEach((target) => {
        target.style.willChange = "filter, opacity";
        observerRef.current?.observe(target);
      });
    };

    if (document.querySelector(".name-intro")) {
      window.addEventListener("deivid:intro-complete", startAnimations, { once: true });
    } else {
      startAnimations();
    }

    return () => {
      window.removeEventListener("deivid:intro-complete", startAnimations);
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, []);

  return null;
}
