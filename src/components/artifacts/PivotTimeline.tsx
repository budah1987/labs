"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface PivotTimelineProps {
  isActive: boolean;
}

const spring = { type: "spring" as const, damping: 15, stiffness: 150 };
const springElastic = { type: "spring" as const, damping: 12, stiffness: 200 };
const springExit = { type: "spring" as const, damping: 20, stiffness: 100 };

type Phase = "idle" | "playing" | "held";

export default function PivotTimeline({ isActive }: PivotTimelineProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [beat, setBeat] = useState(0);
  const [counter, setCounter] = useState(1);
  const cancelRef = useRef(false);
  const prevActiveRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const delay = useCallback(
    (ms: number) =>
      new Promise<void>((resolve) => {
        const id = setTimeout(resolve, ms);
        timersRef.current.push(id);
      }),
    []
  );

  const runSequence = useCallback(async () => {
    cancelRef.current = false;
    setPhase("playing");
    setCounter(1);

    // Beat 1: DAY 1 + Building
    setBeat(1);
    await delay(1000);
    if (cancelRef.current) return;

    // Beat 2: Counter 1->6 + V1 Ready
    setBeat(2);
    for (let n = 2; n <= 6; n++) {
      await delay(80);
      if (cancelRef.current) return;
      setCounter(n);
    }
    await delay(600);
    if (cancelRef.current) return;

    // Beat 3: Tested.
    setBeat(3);
    await delay(800);
    if (cancelRef.current) return;

    // Beat 4: Strikethrough + Wrong abstraction
    setBeat(4);
    await delay(1200);
    if (cancelRef.current) return;

    // Beat 5: Everything exits
    setBeat(5);
    await delay(800);
    if (cancelRef.current) return;

    // Beat 6: DAY 7 + Reframed
    setBeat(6);
    await delay(1000);
    if (cancelRef.current) return;

    // Beat 7: DAY 14 + V2 Shipped (final frame)
    setBeat(7);
    setPhase("held");
  }, [delay]);

  // Auto-play on mount (component is remounted by AnimatePresence on each hover)
  const hasMountedRef = useRef(false);
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      if (isActive) {
        runSequence();
      }
      return;
    }

    const wasActive = prevActiveRef.current;
    prevActiveRef.current = isActive;

    if (isActive && !wasActive) {
      cancelRef.current = true;
      clearTimers();
      setBeat(0);
      setCounter(1);
      const id = setTimeout(() => {
        runSequence();
      }, 50);
      timersRef.current.push(id);
    }

    return () => {
      cancelRef.current = true;
      clearTimers();
    };
  }, [isActive, runSequence, clearTimers]);

  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "16 / 9",
        background: "var(--lab-bg-secondary)",
        borderRadius: "var(--lab-radius-sm)",
        border: "1px solid var(--lab-border)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Phase 1: DAY 1-6 sequence (beats 1-5) */}
      {beat >= 1 && beat <= 5 && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: beat === 5 ? 0 : 1, y: beat === 5 ? 40 : 0 }}
          transition={beat === 5 ? springExit : { duration: 0 }}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          {/* Day counter */}
          <motion.span
            key={beat <= 2 ? "day-counter" : "day-counter-static"}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0 }}
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: 14,
              fontWeight: 500,
              color: "var(--lab-accent)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            DAY {beat >= 2 ? counter : 1}
          </motion.span>

          {/* Main word */}
          <div style={{ position: "relative" }}>
            <motion.span
              key={`main-${beat <= 2 ? "building" : beat}`}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={springElastic}
              style={{
                fontFamily: "var(--font-cabinet), sans-serif",
                fontWeight: 700,
                fontSize: 44,
                lineHeight: 1.1,
                color: "var(--lab-text)",
                display: "block",
                textAlign: "center",
              }}
            >
              {beat <= 2 ? (beat === 1 ? "Building" : "V1 Ready") : "V1 Ready"}
            </motion.span>

            {/* Strikethrough line */}
            {beat >= 4 && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: "absolute",
                  left: -4,
                  right: -4,
                  top: "50%",
                  height: 3,
                  background: "var(--lab-accent)",
                  transformOrigin: "left",
                  borderRadius: 2,
                }}
              />
            )}
          </div>

          {/* Beat 3: Tested */}
          {beat >= 3 && (
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 20,
                color: "var(--lab-text-secondary)",
                marginTop: 8,
              }}
            >
              Tested.
            </motion.span>
          )}

          {/* Beat 4: Wrong abstraction with letter stagger */}
          {beat >= 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              style={{
                marginTop: 4,
                display: "flex",
                justifyContent: "center",
              }}
            >
              {"Wrong abstraction.".split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.03,
                    ...spring,
                  }}
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: 16,
                    color: "var(--lab-text-secondary)",
                    opacity: 0.7,
                    whiteSpace: "pre",
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Phase 2: DAY 7 + Reframed (beat 6) */}
      {beat === 6 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: 14,
              fontWeight: 500,
              color: "var(--lab-accent)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            DAY 7
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 }}
            style={{
              fontFamily: "var(--font-cabinet), sans-serif",
              fontWeight: 700,
              fontSize: 44,
              lineHeight: 1.1,
              color: "var(--lab-text)",
            }}
          >
            Reframed.
          </motion.span>
        </motion.div>
      )}

      {/* Phase 3: DAY 14 + V2 Shipped (beat 7 — final frame, holds) */}
      {beat >= 7 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: 14,
              fontWeight: 500,
              color: "var(--lab-accent)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            DAY 14
          </motion.span>
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={springElastic}
            style={{
              fontFamily: "var(--font-cabinet), sans-serif",
              fontWeight: 700,
              fontSize: 48,
              lineHeight: 1.1,
              color: "var(--lab-text)",
            }}
          >
            V2 Shipped.
          </motion.span>
        </motion.div>
      )}

      {/* Idle state — subtle hint */}
      {beat === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-cabinet), sans-serif",
              fontWeight: 700,
              fontSize: 32,
              color: "var(--lab-text)",
            }}
          >
            1 Pivot. 2 Weeks.
          </span>
          <span
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: 12,
              color: "var(--lab-text-secondary)",
            }}
          >
            Hover to play
          </span>
        </motion.div>
      )}
    </div>
  );
}
