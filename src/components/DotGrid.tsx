"use client";

export function DotGrid() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        background:
          "radial-gradient(circle, var(--lab-dot-color) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    />
  );
}
