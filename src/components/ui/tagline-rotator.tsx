"use client";

import React, { useState, useEffect } from "react";

const TAGLINES = [
  "Chartered Academic Excellence Across Transnational Borders",
  "Cryptographically Verifiable Institutional Academic Registry",
  "Distinguished Postgraduate Curricula for Senior Educational Leaders",
];

export const TaglineRotator: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % TAGLINES.length);
        setFade(true);
      }, 500); // 500ms fade-out before switching text
    }, 7000); // 7-second restrained rotation interval

    return () => clearInterval(timer);
  }, []);

  return (
    <span
      className={`inline-block transition-opacity duration-500 ease-in-out ${
        fade ? "opacity-100" : "opacity-0"
      } ${className}`}
      aria-live="polite"
    >
      {TAGLINES[index]}
    </span>
  );
};
