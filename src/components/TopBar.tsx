"use client";

import { useState } from "react";
import { useTheme } from "@/lib/ThemeContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";

function Tooltip({ label, visible }: { label: string; visible: boolean }) {
  return (
    <span
      style={{
        position: "absolute",
        top: "calc(100% + 6px)",
        left: "50%",
        transform: "translateX(-50%)",
        fontFamily: "var(--font-jetbrains), monospace",
        fontSize: 11,
        letterSpacing: "0.02em",
        color: "var(--lab-text-secondary)",
        background: "var(--lab-bg)",
        border: "1px solid var(--lab-border)",
        borderRadius: "var(--lab-radius-xs)",
        padding: "4px 8px",
        whiteSpace: "nowrap",
        pointerEvents: "none",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.15s ease",
      }}
    >
      {label}
    </span>
  );
}

export function TopBar() {
  const { theme, toggle } = useTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  const btnSize = isMobile ? 32 : 44;
  const iconSize = isMobile ? 16 : 20;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: isMobile ? "14px 16px" : "20px var(--lab-px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-cabinet), sans-serif",
          fontWeight: 900,
          fontSize: isMobile ? 14 : 20,
          letterSpacing: "-0.02em",
          pointerEvents: "auto",
        }}
      >
        amir <span style={{ color: "var(--lab-accent)" }}>lab</span>
      </span>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          pointerEvents: "auto",
        }}
      >
        {/* Theme toggle */}
        <div style={{ position: "relative" }}>
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            style={{
              background: "none",
              border: "1px solid var(--lab-border)",
              borderRadius: "var(--lab-radius-xs)",
              width: btnSize,
              height: btnSize,
              cursor: "pointer",
              color: "var(--lab-text)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "border-color var(--lab-transition)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--lab-border-hover)";
              setHoveredBtn("theme");
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--lab-border)";
              setHoveredBtn(null);
            }}
          >
            {theme === "dark" ? (
              <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
          {!isMobile && (
            <Tooltip
              label={theme === "dark" ? "Light mode" : "Dark mode"}
              visible={hoveredBtn === "theme"}
            />
          )}
        </div>

        {/* External link */}
        <div style={{ position: "relative" }}>
          <a
            href="https://amirhussain.xyz"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Main portfolio"
            style={{
              border: "1px solid var(--lab-border)",
              borderRadius: "var(--lab-radius-xs)",
              width: btnSize,
              height: btnSize,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--lab-text)",
              fontSize: isMobile ? 14 : 18,
              transition: "border-color var(--lab-transition)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--lab-border-hover)";
              setHoveredBtn("portfolio");
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--lab-border)";
              setHoveredBtn(null);
            }}
          >
            ↗
          </a>
          {!isMobile && (
            <Tooltip
              label="Portfolio"
              visible={hoveredBtn === "portfolio"}
            />
          )}
        </div>
      </div>
    </div>
  );
}
