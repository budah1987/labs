"use client";

import { useEffect, useRef } from "react";
import { useScramble } from "use-scramble";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { CaseStudyContent } from "@/components/CaseStudyContent";
import { ScrubPlayer } from "@/components/ScrubPlayer";
import type { Project } from "@/lib/projects";

const DEFAULT_TITLE = "LAB";
const DEFAULT_SUBTITLE =
  "Experimental projects exploring AI, design systems, and creative development.";

const ease = [0.22, 1, 0.36, 1] as const;

interface CenterTitleProps {
  project: Project | null;
  isExpanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
}

export function CenterTitle({
  project,
  isExpanded,
  onExpand,
  onCollapse,
}: CenterTitleProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const titleText = project ? project.title.toUpperCase() : DEFAULT_TITLE;
  const subtitleText = project ? project.description : DEFAULT_SUBTITLE;

  const prevTitleRef = useRef(titleText);

  const { ref: titleRef, replay: replayTitle } = useScramble({
    text: titleText,
    speed: 0.6,
    tick: 1,
    step: 3,
    scramble: 4,
    seed: 3,
    range: [65, 90],
    ignore: [" "],
    playOnMount: true,
  });

  const { ref: subtitleRef, replay: replaySubtitle } = useScramble({
    text: subtitleText,
    speed: 1,
    tick: 1,
    step: 8,
    scramble: 1,
    seed: 2,
    range: [65, 122],
    ignore: [" ", ".", ","],
    playOnMount: true,
  });

  useEffect(() => {
    if (prevTitleRef.current !== titleText) {
      prevTitleRef.current = titleText;
      replayTitle();
      replaySubtitle();
    }
  }, [titleText, subtitleText, replayTitle, replaySubtitle]);

  const isActive = !!project;

  // Expanded state — full case study layout
  if (isExpanded && project) {
    return (
      <LayoutGroup>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            padding: isMobile ? "0 20px" : "0 var(--lab-px)",
            maxWidth: isMobile ? undefined : 1440,
            marginLeft: "auto",
            marginRight: "auto",
            width: "100%",
            position: "relative",
            zIndex: 5,
          }}
        >
          {/* Back button */}
          <motion.button
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease, delay: 0.15 }}
            onClick={onCollapse}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: isMobile ? 15 : 18,
              color: "var(--lab-text-secondary)",
              minHeight: isMobile ? 32 : 44,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "0 0 12px",
              letterSpacing: "0.02em",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--lab-accent)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--lab-text-secondary)")
            }
          >
            <span style={{ fontSize: isMobile ? 18 : 22, lineHeight: 1 }}>←</span> Back
          </motion.button>

          {/* Title — left-aligned, smaller */}
          <motion.h1
            ref={titleRef}
            layoutId="project-title"
            layout
            transition={{ duration: 0.6, ease }}
            style={{
              fontFamily: "var(--font-cabinet), sans-serif",
              fontWeight: 900,
              fontSize: isMobile
                ? "clamp(28px, 8vw, 48px)"
                : "clamp(40px, 4vw, 56px)",
              lineHeight: 1,
              letterSpacing: "-0.03em",
              color: "var(--lab-accent)",
              textAlign: "left",
              marginBottom: 8,
            }}
          />

          {/* Metadata row — slides in from left with blur */}
          <motion.div
            initial={{ opacity: 0, x: -16, filter: "blur(4px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -12, filter: "blur(4px)" }}
            transition={{ duration: 0.4, ease, delay: 0.25 }}
            style={{
              display: "flex",
              gap: isMobile ? 16 : 24,
              marginBottom: isMobile ? 20 : 28,
            }}
          >
            {project.content?.year && (
              <span
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontSize: isMobile ? 12 : 14,
                  color: "var(--lab-text-secondary)",
                }}
              >
                Year • {project.content.year}
              </span>
            )}
            {project.content?.duration && (
              <span
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontSize: isMobile ? 12 : 14,
                  color: "var(--lab-text-secondary)",
                }}
              >
                Duration • {project.content.duration}
              </span>
            )}
            {project.content?.role && (
              <span
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontSize: isMobile ? 12 : 14,
                  color: "var(--lab-text-secondary)",
                }}
              >
                Role • {project.content.role}
              </span>
            )}
          </motion.div>

          {/* Thumbnail — full width with glow pulse on arrival */}
          <motion.div
            layoutId="project-thumb"
            layout
            animate={{
              boxShadow: [
                "0 0 0 0px rgba(218,160,17,0)",
                "0 0 32px 0px rgba(218,160,17,0.12)",
                "0 0 0 0px rgba(218,160,17,0)",
              ],
            }}
            transition={{
              layout: { duration: 0.6, ease },
              boxShadow: { duration: 1, delay: 0.5, ease: "easeInOut" },
            }}
            style={{
              width: "100%",
              aspectRatio: "16 / 9",
              borderRadius: "var(--lab-radius-sm)",
              overflow: "hidden",
              border: "1px solid var(--lab-border)",
              background: "var(--lab-bg-glass)",
            }}
          >
            {project.heroVideo ? (
              <ScrubPlayer src={project.heroVideo} />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: [
                    "repeating-linear-gradient(0deg, var(--lab-border) 0px, var(--lab-border) 1px, transparent 1px, transparent 44px)",
                    "repeating-linear-gradient(90deg, var(--lab-border) 0px, var(--lab-border) 1px, transparent 1px, transparent 44px)",
                  ].join(", "),
                }}
              />
            )}
          </motion.div>

          {/* Case study content */}
          {project.content?.sections && (
            <CaseStudyContent sections={project.content.sections} />
          )}

          {/* Bottom accent bar */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease }}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              height: 3,
              background: "var(--lab-accent)",
              transformOrigin: "center",
            }}
          />
        </div>
      </LayoutGroup>
    );
  }

  // Default + Hover state — centered layout
  return (
    <LayoutGroup>
      <div
        style={{
          flex: 1,
          position: "relative",
          zIndex: 5,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          {/* Animated spacer */}
          <motion.div
            aria-hidden
            animate={{ height: isActive ? "8%" : "35%" }}
            transition={{ duration: 0.6, ease }}
            style={{ flexShrink: 0 }}
          />

          {/* Title — centered, large */}
          <motion.h1
            ref={titleRef}
            layoutId="project-title"
            layout
            animate={{
              color: isActive ? "var(--lab-accent)" : "var(--lab-text)",
            }}
            transition={{ duration: 0.6, ease }}
            style={{
              fontFamily: "var(--font-cabinet), sans-serif",
              fontWeight: 900,
              fontSize: isMobile
                ? "clamp(36px, 12vw, 80px)"
                : "clamp(80px, 16vw, 280px)",
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              textAlign: "center",
              padding: "0 var(--lab-px)",
              flexShrink: 0,
            }}
          />

          {/* Video thumbnail — hover state only */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                key="thumbnail"
                layoutId="project-thumb"
                layout
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.45, ease, delay: 0.12 },
                }}
                exit={{
                  opacity: 0,
                  y: -16,
                  scale: 0.97,
                  transition: { duration: 0.25, ease },
                }}
                style={{
                  marginTop: isMobile ? 16 : 24,
                  width: isMobile
                    ? "min(100%, calc(100vw - 40px))"
                    : "min(480px, 68vw)",
                  aspectRatio: "16 / 9",
                  borderRadius: "var(--lab-radius-sm)",
                  overflow: "hidden",
                  border: "1px solid var(--lab-border)",
                  background: "var(--lab-bg-glass)",
                  flexShrink: 0,
                }}
              >
                {project?.heroVideo ? (
                  <video
                    src={project.heroVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: [
                        "repeating-linear-gradient(0deg, var(--lab-border) 0px, var(--lab-border) 1px, transparent 1px, transparent 44px)",
                        "repeating-linear-gradient(90deg, var(--lab-border) 0px, var(--lab-border) 1px, transparent 1px, transparent 44px)",
                      ].join(", "),
                    }}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Description / subtitle */}
          <motion.p
            ref={subtitleRef}
            animate={{
              opacity: 1,
              marginTop: isActive ? (isMobile ? 12 : 20) : 16,
            }}
            transition={{ duration: 0.4, ease }}
            style={{
              fontSize: isActive
                ? "clamp(12px, 1.05vw, 14px)"
                : "clamp(13px, 1.2vw, 16px)",
              lineHeight: 1.6,
              color: "var(--lab-text-secondary)",
              textAlign: "center",
              maxWidth: isActive
                ? isMobile
                  ? "calc(100vw - 40px)"
                  : "min(480px, 68vw)"
                : "min(520px, calc(100vw - 56px))",
              fontFamily: "var(--font-jetbrains), monospace",
              letterSpacing: "0.01em",
              flexShrink: 0,
            }}
          />

          {/* Mobile: "View Study" button in hover state */}
          <AnimatePresence>
            {isActive && isMobile && (
              <motion.button
                key="view-study"
                initial={{ opacity: 0, y: 12 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.3, ease, delay: 0.3 },
                }}
                exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
                onClick={onExpand}
                style={{
                  marginTop: 16,
                  padding: "10px 24px",
                  borderRadius: 24,
                  background: "var(--lab-accent)",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#0a0a0a",
                  letterSpacing: "0.01em",
                  flexShrink: 0,
                }}
              >
                View Study ↓
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom accent bar */}
        <AnimatePresence>
          {project && (
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease }}
              style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                height: 3,
                background: "var(--lab-accent)",
                transformOrigin: "center",
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}
