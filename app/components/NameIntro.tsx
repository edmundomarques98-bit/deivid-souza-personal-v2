"use client";

import { useEffect, useState } from "react";
import { assetPath } from "../lib/assets";

type IntroPhase = "showing" | "leaving" | "gone";

let introPlayedInThisView = false;

export function NameIntro() {
  const [phase, setPhase] = useState<IntroPhase>(() =>
    introPlayedInThisView ? "gone" : "showing",
  );

  useEffect(() => {
    if (introPlayedInThisView) {
      setPhase("gone");
      window.dispatchEvent(new Event("deivid:intro-complete"));
      return;
    }

    introPlayedInThisView = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("gone");
      window.dispatchEvent(new Event("deivid:intro-complete"));
      return;
    }

    const leaveTimer = window.setTimeout(() => setPhase("leaving"), 2550);
    const removeTimer = window.setTimeout(() => {
      setPhase("gone");
      window.dispatchEvent(new Event("deivid:intro-complete"));
    }, 3050);

    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      className={`name-intro${phase === "leaving" ? " name-intro-leaving" : ""}`}
      aria-hidden="true"
    >
      <img
        className="name-intro-wordmark"
        src={assetPath("/brand/deivid-souza-name-outline.svg")}
        alt=""
      />
      <span className="name-intro-caption">Personal Trainer</span>
    </div>
  );
}
