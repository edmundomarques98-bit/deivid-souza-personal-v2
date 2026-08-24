"use client";

import { animate } from "animejs";
import { useEffect, useRef } from "react";

export function PlanAnimations() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const startAnimations = () => {
      if (observerRef.current) return;

      const targets = Array.from(
        document.querySelectorAll<HTMLElement>(".plan-animated"),
      );

      observerRef.current = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            observer.unobserve(entry.target);
            const target = entry.target as HTMLElement;
            const endY =
              target.classList.contains("featured") &&
              window.matchMedia("(min-width: 821px)").matches
                ? -14
                : 0;

            target.style.willChange = "transform, opacity";

            animate(target, {
              y: { from: "100cqh", to: endY },
              opacity: { from: 0, to: 1 },
              duration: 1000,
              ease: "outElastic(1.5, 0.57)",
              onComplete: () => {
                target.style.removeProperty("will-change");
                target.style.removeProperty("transform");
                target.style.removeProperty("opacity");
              },
            });
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
      );

      targets.forEach((target) => observerRef.current?.observe(target));
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
