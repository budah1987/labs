"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScramble } from "use-scramble";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { Project } from "@/lib/projects";

const ease = [0.22, 1, 0.36, 1] as const;

interface ThumbnailStripProps {
  projects: Project[];
  activeId: string | null;
  selectedId: string | null;
  isExpanded: boolean;
  isVisible: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

export function ThumbnailStrip({
  projects,
  activeId,
  selectedId,
  isExpanded,
  isVisible,
  onHover,
  onSelect,
}: ThumbnailStripProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const thumbSize = isMobile ? 44 : 56;
  const indicatorSize = isMobile ? 20 : 24;

  // Track which thumbnail has its dropdown open (desktop expanded only)
  const [dropdownId, setDropdownId] = useState<string | null>(null);

  // Hide on mobile when expanded (bottom sheet handles navigation)
  if (isMobile && isExpanded) return null;

  return (
    <motion.div
      animate={{
        y: isVisible ? 0 : "-100%",
      }}
      transition={{ duration: 0.3, ease }}
      style={{
        display: "flex",
        justifyContent: "center",
        paddingTop: isMobile ? 60 : 80,
        position: isExpanded ? "sticky" : "relative",
        top: isExpanded ? 0 : undefined,
        zIndex: 10,
        overflow: "visible",
        background: isExpanded ? "var(--lab-bg)" : undefined,
      }}
    >
      <div
        className="hide-scrollbar"
        style={{
          display: "flex",
          gap: isMobile ? 10 : 12,
          overflowX: "auto",
          overflow: "visible",
          padding: isMobile
            ? "8px 16px 16px"
            : isExpanded
              ? "8px var(--lab-px) 64px"
              : "8px var(--lab-px) 20px",
          maxWidth: "100vw",
        }}
      >
        {projects.map((project) => {
          const isActive = activeId === project.id;
          const isSelected = selectedId === project.id;
          const showDropdown =
            isExpanded && dropdownId === project.id && !isMobile;

          return (
            <div
              key={project.id}
              style={{ position: "relative", flexShrink: 0 }}
              onMouseEnter={() => {
                onHover(project.id);
                if (isExpanded) setDropdownId(project.id);
              }}
              onMouseLeave={() => {
                onHover(null);
                if (isExpanded) setDropdownId(null);
              }}
              onClick={() => onSelect(project.id)}
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.15 : 1,
                  opacity: activeId && !isActive ? 0.4 : 1,
                }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.25, ease }}
                style={{
                  width: thumbSize,
                  height: thumbSize,
                  borderRadius: isMobile ? 8 : 10,
                  background: project.thumbnailColor,
                  cursor: "pointer",
                  border: isActive
                    ? "2px solid var(--lab-border-hover)"
                    : isSelected
                      ? "2px solid var(--lab-accent)"
                      : "2px solid var(--lab-border)",
                  transition: "border-color 0.2s",
                }}
              />

              {/* Hover label — "View" pill, desktop non-expanded only */}
              <AnimatePresence>
                {isActive && !isSelected && !isExpanded && !isMobile && (
                  <motion.span
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2, ease }}
                    style={{
                      position: "absolute",
                      top: thumbSize + 8,
                      left: 0,
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
                    }}
                  >
                    View ↗
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: "absolute",
                    bottom: -5,
                    right: -5,
                    width: indicatorSize,
                    height: indicatorSize,
                    borderRadius: "50%",
                    background: "var(--lab-accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: isMobile ? 9 : 11,
                    color: "#0a0a0a",
                    fontWeight: 700,
                  }}
                >
                  ↗
                </motion.div>
              )}

              {/* Dropdown preview — desktop expanded only */}
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.3, ease }}
                    style={{
                      position: "absolute",
                      top: thumbSize + 12,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 320,
                      background: "var(--lab-bg)",
                      border: "1px solid var(--lab-border)",
                      borderRadius: "var(--lab-radius-sm)",
                      padding: 16,
                      zIndex: 20,
                      cursor: "pointer",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(project.id);
                    }}
                  >
                    <DropdownTitle text={project.title} />
                    <div
                      style={{
                        width: "100%",
                        aspectRatio: "16 / 9",
                        borderRadius: 8,
                        background: project.thumbnailColor,
                        border: "1px solid var(--lab-border)",
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function DropdownTitle({ text }: { text: string }) {
  const { ref } = useScramble({
    text: text.toUpperCase(),
    speed: 0.6,
    tick: 1,
    step: 3,
    scramble: 4,
    seed: 3,
    range: [65, 90],
    ignore: [" "],
    playOnMount: true,
  });

  return (
    <div
      ref={ref}
      style={{
        fontFamily: "var(--font-cabinet), sans-serif",
        fontWeight: 900,
        fontSize: 20,
        color: "var(--lab-accent)",
        letterSpacing: "-0.02em",
        marginBottom: 12,
        textTransform: "uppercase",
      }}
    />
  );
}
