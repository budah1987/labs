"use client";

import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const TIERS = [
  { id: "outcome", label: "Outcome" },
  { id: "opportunities", label: "Opportunities" },
  { id: "sub", label: "Sub-opps" },
  { id: "solutions", label: "Solutions" },
  { id: "experiments", label: "Experiments" },
];

// ── Primitives ──

function FrameworkCallout({
  framework,
  question,
  mobile,
}: {
  framework: string;
  question?: string;
  mobile: boolean;
}) {
  return (
    <div
      style={{
        textAlign: "center",
        marginBottom: mobile ? 8 : 14,
        padding: mobile ? "0 4px" : 0,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "var(--lab-bg-secondary)",
          border: "1px solid var(--lab-border)",
          borderRadius: 999,
          padding: mobile ? "6px 14px" : "7px 16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          marginBottom: question ? 4 : 0,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "var(--lab-accent)",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: mobile ? 10 : 11,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            color: "var(--lab-accent)",
          }}
        >
          {framework}
        </span>
      </div>
      {question && (
        <div
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: mobile ? 11 : 12,
            color: "var(--lab-text-secondary)",
            marginTop: 2,
          }}
        >
          {question}
        </div>
      )}
    </div>
  );
}

function TierPill({
  label,
  active,
  onClick,
  index,
  mobile,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  index: number;
  mobile: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "var(--font-inter), sans-serif",
        fontSize: mobile ? 11 : 12,
        fontWeight: 500,
        color: active ? "var(--lab-accent)" : "var(--lab-text-secondary)",
        background: active ? "rgba(218,160,17,0.08)" : "var(--lab-bg-secondary)",
        border: active
          ? "1.5px solid var(--lab-accent)"
          : "1px solid var(--lab-border)",
        borderRadius: 999,
        padding: mobile ? "8px 14px" : "10px 18px",
        cursor: "pointer",
        transition: "all 250ms ease",
        whiteSpace: "nowrap",
        boxShadow: active
          ? "0 1px 4px rgba(218,160,17,0.1)"
          : "0 1px 3px rgba(0,0,0,0.04)",
        minHeight: mobile ? 36 : 40,
        display: "inline-flex",
        alignItems: "center",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: mobile ? 18 : 20,
          height: mobile ? 18 : 20,
          borderRadius: "50%",
          marginRight: mobile ? 6 : 8,
          background: active
            ? "var(--lab-accent)"
            : "var(--lab-text-secondary)",
          color: active ? "#0a0a0a" : "#fff",
          fontSize: mobile ? 9 : 10,
          fontWeight: 700,
          transition: "background 250ms ease",
        }}
      >
        {index + 1}
      </span>
      {label}
    </button>
  );
}

function Connector({ accent, mobile }: { accent?: boolean; mobile: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: `${mobile ? 5 : 8}px 0`,
      }}
    >
      <div
        style={{
          width: accent ? 2 : 1,
          height: mobile ? 16 : 24,
          background: accent ? "var(--lab-accent)" : "var(--lab-border)",
          borderRadius: 1,
        }}
      />
    </div>
  );
}

function FanConnector({
  count,
  highlightIdx,
}: {
  count: number;
  highlightIdx: number;
}) {
  return (
    <svg
      width="100%"
      height={28}
      style={{ display: "block", overflow: "visible" }}
    >
      <line
        x1="50%"
        y1="0"
        x2="50%"
        y2={14}
        stroke="var(--lab-accent)"
        strokeWidth={1.5}
      />
      {Array.from({ length: count }).map((_, i) => {
        const x = `${((i + 0.5) / count) * 100}%`;
        const hl = i === highlightIdx;
        return (
          <g key={i}>
            <line
              x1="50%"
              y1={14}
              x2={x}
              y2={14}
              stroke={hl ? "var(--lab-accent)" : "var(--lab-border)"}
              strokeWidth={hl ? 1.5 : 1}
            />
            <line
              x1={x}
              y1={14}
              x2={x}
              y2={28}
              stroke={hl ? "var(--lab-accent)" : "var(--lab-border)"}
              strokeWidth={hl ? 1.5 : 1}
            />
          </g>
        );
      })}
    </svg>
  );
}

function NodeCard({
  children,
  variant,
  highlighted,
  faded,
  style: extra,
}: {
  children: ReactNode;
  variant: "outcome" | "opportunity" | "sub" | "solution" | "experiment";
  highlighted?: boolean;
  faded?: boolean;
  style?: React.CSSProperties;
}) {
  const base: React.CSSProperties = {
    borderRadius: 10,
    position: "relative",
    transition: "all 300ms ease, opacity 300ms ease",
    fontFamily: "var(--font-inter), sans-serif",
  };
  const variants: Record<string, React.CSSProperties> = {
    outcome: {
      background: "var(--lab-text)",
      color: "var(--lab-bg)",
      textAlign: "center",
    },
    opportunity: {
      background: "var(--lab-bg-secondary)",
      border: highlighted
        ? "1.5px solid var(--lab-accent)"
        : "0.5px solid var(--lab-border)",
      boxShadow: highlighted
        ? "0 2px 12px rgba(218,160,17,0.08)"
        : "none",
      opacity: faded ? 0.55 : 1,
    },
    sub: {
      background: highlighted
        ? "var(--lab-bg-secondary)"
        : "var(--lab-bg-glass)",
      border: highlighted
        ? "1.5px solid var(--lab-accent)"
        : "0.5px solid var(--lab-border)",
      opacity: faded ? 0.55 : 1,
    },
    solution: {
      background: "var(--lab-bg-secondary)",
      border: highlighted
        ? "1.5px solid var(--lab-accent)"
        : "0.5px solid var(--lab-border)",
      boxShadow: highlighted
        ? "0 2px 12px rgba(218,160,17,0.08)"
        : "none",
      opacity: faded ? 0.55 : 1,
    },
    experiment: {
      background: "var(--lab-bg-glass)",
      border: "0.5px solid var(--lab-border)",
    },
  };
  return (
    <div style={{ ...base, ...variants[variant], ...extra }}>{children}</div>
  );
}

function Label({
  children,
  color,
}: {
  children: ReactNode;
  color?: string;
}) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: color || "var(--lab-accent)",
        marginBottom: 3,
        fontFamily: "var(--font-inter), sans-serif",
      }}
    >
      {children}
    </div>
  );
}

function NodeText({
  children,
  size,
  weight,
  color,
}: {
  children: ReactNode;
  size?: number;
  weight?: number;
  color?: string;
}) {
  return (
    <div
      style={{
        fontSize: size || 13,
        fontWeight: weight || 500,
        lineHeight: 1.45,
        color: color || "var(--lab-text)",
        fontFamily: "var(--font-inter), sans-serif",
      }}
    >
      {children}
    </div>
  );
}

function SubText({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 400,
        lineHeight: 1.5,
        color: "var(--lab-text-secondary)",
        marginTop: 3,
        fontFamily: "var(--font-inter), sans-serif",
      }}
    >
      {children}
    </div>
  );
}

function Reveal({
  visible,
  delay,
  children,
}: {
  visible: boolean;
  delay: number;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: `opacity 400ms ease ${delay}ms, transform 400ms ease ${delay}ms`,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {visible && children}
    </div>
  );
}

// ── Scroll row with fade edges + auto-scroll to highlighted ──

function ScrollRow({
  children,
  gap,
  highlightIdx,
}: {
  children: ReactNode;
  gap?: number;
  highlightIdx: number | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const checkEdges = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 8);
    setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (highlightIdx != null && el.children[highlightIdx]) {
      const card = el.children[highlightIdx] as HTMLElement;
      const offset =
        card.offsetLeft - el.clientWidth / 2 + card.offsetWidth / 2;
      el.scrollTo({ left: Math.max(0, offset), behavior: "smooth" });
    }
    checkEdges();
  }, [highlightIdx, checkEdges]);

  return (
    <div style={{ position: "relative" }}>
      {showLeft && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 4,
            width: 32,
            zIndex: 2,
            pointerEvents: "none",
            background:
              "linear-gradient(to right, var(--lab-bg), transparent)",
          }}
        />
      )}
      {showRight && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 4,
            width: 32,
            zIndex: 2,
            pointerEvents: "none",
            background:
              "linear-gradient(to left, var(--lab-bg), transparent)",
          }}
        />
      )}
      <div
        ref={ref}
        onScroll={checkEdges}
        className="hide-scrollbar"
        style={{
          display: "flex",
          gap: gap || 8,
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          scrollSnapType: "x mandatory",
          padding: "0 4px 4px",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ── Main ──

export default function OpportunityTree() {
  const [activeTier, setActiveTier] = useState(0);
  const [autoPlaying, setAutoPlaying] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autoPlaying) return;
    timerRef.current = setTimeout(
      () => {
        if (activeTier < TIERS.length - 1) setActiveTier(activeTier + 1);
        else setAutoPlaying(false);
      },
      activeTier === 0 ? 1200 : 1800
    );
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeTier, autoPlaying]);

  const handleTierClick = (i: number) => {
    setAutoPlaying(false);
    setActiveTier(i);
  };

  useEffect(() => {
    if (navRef.current) {
      const btn = navRef.current.children[activeTier] as HTMLElement | undefined;
      if (btn) {
        const nav = navRef.current;
        const offset = btn.offsetLeft - nav.clientWidth / 2 + btn.offsetWidth / 2;
        nav.scrollTo({ left: Math.max(0, offset), behavior: "smooth" });
      }
    }
  }, [activeTier]);

  const show = (tier: number) => activeTier >= tier;
  const m = isMobile;
  const cardPad = m ? "12px 14px" : "14px 16px";
  const cardPadSm = m ? "10px 12px" : "10px 12px";

  const OPPS = [
    {
      label: "Opportunity 1",
      text: "Can\u2019t find which conversation it was in",
      faded: true,
    },
    {
      label: "Opportunity 2",
      text: "Found the conversation, can\u2019t find the specific message",
      highlighted: true,
    },
    {
      label: "Opportunity 3",
      text: "Don\u2019t remember it happened at all",
      faded: true,
    },
  ];

  const SUB_ITEMS = [
    { text: "Titles don\u2019t match memory", faded: true },
    { text: "Similar conversations blur together", faded: true },
    {
      text: "One conversation, many valuable things",
      highlighted: true,
    },
    { text: "Value was a tangent, not main topic", faded: true },
    { text: "Too much time passed", faded: true },
  ];

  const EXPERIMENTS = [
    "Can we identify the right context to pair with a saved response?",
    "Will users bookmark in the moment, or forget?",
    "Does the bookmark list stay useful or become a junk drawer?",
  ];

  return (
    <div
      style={{
        fontFamily: "var(--font-inter), sans-serif",
        padding: m ? "16px 24px 24px" : "24px 24px 32px",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        {/* ── Header ── */}
        <div
          style={{
            textAlign: "center",
            marginBottom: m ? 16 : 28,
            padding: 0,
          }}
        >
          <div
            style={{
              fontSize: m ? 17 : 22,
              fontWeight: 700,
              color: "var(--lab-text)",
              marginBottom: 4,
              lineHeight: 1.3,
            }}
          >
            How I got to bookmarks
          </div>
          <div
            style={{
              fontSize: m ? 12 : 13,
              color: "var(--lab-text-secondary)",
              lineHeight: 1.4,
            }}
          >
            Three frameworks applied to one design problem
          </div>
        </div>

        {/* ── Tier nav ── */}
        <div
          ref={navRef}
          className="hide-scrollbar"
          style={{
            display: "flex",
            gap: 6,
            justifyContent: m ? "flex-start" : "center",
            overflowX: "auto",
            paddingBottom: 6,
            marginBottom: m ? 14 : 24,
            WebkitOverflowScrolling: "touch",
            padding: "0 0 6px",
          }}
        >
          {TIERS.map((t, i) => (
            <TierPill
              key={t.id}
              label={t.label}
              active={activeTier >= i}
              onClick={() => handleTierClick(i)}
              index={i}
              mobile={m}
            />
          ))}
        </div>

        {/* Content wrapper */}
        <div style={{ padding: m ? "0 16px" : 0 }}>
          {/* ═══ TIER 1: Outcome ═══ */}
          <Reveal visible={show(0)} delay={0}>
            <FrameworkCallout
              framework="Opportunity Solution Tree"
              question="Start with the outcome, decompose into opportunities"
              mobile={m}
            />
            <div
              style={{
                maxWidth: m ? "100%" : 420,
                margin: "0 auto",
              }}
            >
              <NodeCard variant="outcome" style={{ padding: cardPad }}>
                <Label color="rgba(250,249,245,0.5)">
                  Desired Outcome
                </Label>
                <NodeText
                  size={m ? 13 : 15}
                  weight={600}
                  color="var(--lab-bg)"
                >
                  Easily retrieve valuable things from past conversations
                </NodeText>
              </NodeCard>
            </div>
          </Reveal>

          {/* ═══ TIER 2: Opportunities ═══ */}
          <Reveal visible={show(1)} delay={100}>
            <Connector accent mobile={m} />
            {!m && <FanConnector count={3} highlightIdx={1} />}
          </Reveal>
        </div>

        {/* Opportunities: full-bleed scroll on mobile */}
        <Reveal visible={show(1)} delay={100}>
          {m ? (
            <div style={{ padding: "0 12px" }}>
              <ScrollRow gap={10} highlightIdx={1}>
                {OPPS.map((item, i) => (
                  <NodeCard
                    key={i}
                    variant="opportunity"
                    highlighted={item.highlighted}
                    faded={item.faded}
                    style={{
                      padding: "14px 16px",
                      minWidth: 220,
                      maxWidth: 260,
                      flex: "0 0 auto",
                      scrollSnapAlign: "center",
                    }}
                  >
                    <Label
                      color={
                        item.highlighted
                          ? "var(--lab-accent)"
                          : "var(--lab-text-secondary)"
                      }
                    >
                      {item.label}
                    </Label>
                    <NodeText
                      size={12}
                      color={
                        item.highlighted
                          ? "var(--lab-text)"
                          : "var(--lab-text-secondary)"
                      }
                    >
                      {item.text}
                    </NodeText>
                  </NodeCard>
                ))}
              </ScrollRow>
            </div>
          ) : (
            <div style={{ padding: 0 }}>
              <div
                style={{
                  maxWidth: 760,
                  margin: "0 auto",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 12,
                }}
              >
                <NodeCard
                  variant="opportunity"
                  faded
                  style={{ padding: cardPad }}
                >
                  <Label color="var(--lab-text-secondary)">
                    Opportunity 1
                  </Label>
                  <NodeText size={12} color="var(--lab-text-secondary)">
                    Can&rsquo;t find which conversation it was in
                  </NodeText>
                </NodeCard>
                <NodeCard
                  variant="opportunity"
                  highlighted
                  style={{ padding: cardPad }}
                >
                  <Label>Opportunity 2</Label>
                  <NodeText>
                    Found the conversation, can&rsquo;t find the specific
                    message
                  </NodeText>
                </NodeCard>
                <NodeCard
                  variant="opportunity"
                  faded
                  style={{ padding: cardPad }}
                >
                  <Label color="var(--lab-text-secondary)">
                    Opportunity 3
                  </Label>
                  <NodeText size={12} color="var(--lab-text-secondary)">
                    Don&rsquo;t remember it happened at all
                  </NodeText>
                </NodeCard>
              </div>
            </div>
          )}
        </Reveal>

        <div style={{ padding: m ? "0 16px" : 0 }}>
          {/* ═══ TIER 3: Sub-opportunities ═══ */}
          <Reveal visible={show(2)} delay={100}>
            <Connector accent mobile={m} />
            <FrameworkCallout
              framework="5 Whys"
              question="Why can&rsquo;t they find the message?"
              mobile={m}
            />
          </Reveal>
        </div>

        {/* Sub-opps: full-bleed scroll on mobile */}
        <Reveal visible={show(2)} delay={100}>
          {m ? (
            <div style={{ padding: "0 12px" }}>
              <ScrollRow gap={8} highlightIdx={2}>
                {SUB_ITEMS.map((item, i) => (
                  <NodeCard
                    key={i}
                    variant="sub"
                    highlighted={item.highlighted}
                    faded={item.faded}
                    style={{
                      padding: "12px 14px",
                      minWidth: 170,
                      maxWidth: 200,
                      flex: "0 0 auto",
                      scrollSnapAlign: "center",
                    }}
                  >
                    <NodeText
                      size={12}
                      color={
                        item.highlighted
                          ? "var(--lab-text)"
                          : "var(--lab-text-secondary)"
                      }
                    >
                      {item.text}
                    </NodeText>
                  </NodeCard>
                ))}
              </ScrollRow>
            </div>
          ) : (
            <div style={{ padding: 0 }}>
              <div
                style={{
                  maxWidth: 760,
                  margin: "0 auto",
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: 8,
                }}
              >
                {SUB_ITEMS.map((item, i) => (
                  <NodeCard
                    key={i}
                    variant="sub"
                    highlighted={item.highlighted}
                    faded={item.faded}
                    style={{ padding: cardPadSm }}
                  >
                    <NodeText
                      size={11}
                      color={
                        item.highlighted
                          ? "var(--lab-text)"
                          : "var(--lab-text-secondary)"
                      }
                    >
                      {item.text}
                    </NodeText>
                  </NodeCard>
                ))}
              </div>
            </div>
          )}
        </Reveal>

        <div style={{ padding: m ? "0 16px" : 0 }}>
          {/* ═══ TIER 4: Solutions ═══ */}
          <Reveal visible={show(3)} delay={100}>
            <Connector accent mobile={m} />
            <FrameworkCallout
              framework="Occam&rsquo;s Razor"
              question="Which solution requires the fewest assumptions?"
              mobile={m}
            />

            {m ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <NodeCard
                  variant="solution"
                  highlighted
                  style={{ padding: "14px 16px" }}
                >
                  <Label>Solution A</Label>
                  <NodeText size={14} weight={600}>
                    Message-level bookmarks
                  </NodeText>
                  <SubText>
                    Save the response, not the conversation. Context
                    inherited from the Q&amp;A pair.
                  </SubText>
                </NodeCard>
                <div style={{ display: "flex", gap: 8 }}>
                  <NodeCard
                    variant="solution"
                    faded
                    style={{ padding: "10px 12px", flex: 1 }}
                  >
                    <Label color="var(--lab-text-secondary)">B</Label>
                    <NodeText
                      size={11}
                      color="var(--lab-text-secondary)"
                    >
                      Auto-split by topic shift
                    </NodeText>
                  </NodeCard>
                  <NodeCard
                    variant="solution"
                    faded
                    style={{ padding: "10px 12px", flex: 1 }}
                  >
                    <Label color="var(--lab-text-secondary)">C</Label>
                    <NodeText
                      size={11}
                      color="var(--lab-text-secondary)"
                    >
                      Table of contents
                    </NodeText>
                  </NodeCard>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 0.9fr 0.9fr",
                  gap: 10,
                }}
              >
                <NodeCard
                  variant="solution"
                  highlighted
                  style={{ padding: cardPad }}
                >
                  <Label>Solution A</Label>
                  <NodeText weight={600}>
                    Message-level bookmarks
                  </NodeText>
                  <SubText>
                    Save the response, not the conversation. Context
                    inherited from the Q&amp;A pair.
                  </SubText>
                </NodeCard>
                <NodeCard
                  variant="solution"
                  faded
                  style={{ padding: cardPad }}
                >
                  <Label color="var(--lab-text-secondary)">
                    Solution B
                  </Label>
                  <NodeText
                    size={12}
                    color="var(--lab-text-secondary)"
                  >
                    Auto-split by topic shift
                  </NodeText>
                </NodeCard>
                <NodeCard
                  variant="solution"
                  faded
                  style={{ padding: cardPad }}
                >
                  <Label color="var(--lab-text-secondary)">
                    Solution C
                  </Label>
                  <NodeText
                    size={12}
                    color="var(--lab-text-secondary)"
                  >
                    Table of contents
                  </NodeText>
                </NodeCard>
              </div>
            )}
          </Reveal>

          {/* ═══ TIER 5: Experiments ═══ */}
          <Reveal visible={show(4)} delay={100}>
            <Connector accent mobile={m} />
          </Reveal>
        </div>

        {/* Experiments: full-bleed scroll on mobile */}
        <Reveal visible={show(4)} delay={100}>
          {m ? (
            <div style={{ padding: "0 12px" }}>
              <ScrollRow gap={8} highlightIdx={null}>
                {EXPERIMENTS.map((text, i) => (
                  <NodeCard
                    key={i}
                    variant="experiment"
                    style={{
                      padding: "12px 14px",
                      minWidth: 220,
                      maxWidth: 260,
                      flex: "0 0 auto",
                      scrollSnapAlign: "center",
                    }}
                  >
                    <Label color="var(--lab-text-secondary)">
                      Experiment {i + 1}
                    </Label>
                    <NodeText size={12} color="var(--lab-text)">
                      {text}
                    </NodeText>
                  </NodeCard>
                ))}
              </ScrollRow>
            </div>
          ) : (
            <div style={{ padding: 0 }}>
              <div
                style={{
                  maxWidth: 760,
                  margin: "0 auto",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 10,
                }}
              >
                {EXPERIMENTS.map((text, i) => (
                  <NodeCard
                    key={i}
                    variant="experiment"
                    style={{ padding: cardPad }}
                  >
                    <Label color="var(--lab-text-secondary)">
                      Experiment {i + 1}
                    </Label>
                    <NodeText size={11} color="var(--lab-text)">
                      {text}
                    </NodeText>
                  </NodeCard>
                ))}
              </div>
            </div>
          )}
        </Reveal>

        {/* ═══ Insight ═══ */}
        <div style={{ padding: m ? "0 16px" : 0 }}>
          <Reveal visible={show(4)} delay={400}>
            <div
              style={{
                background: "rgba(218,160,17,0.06)",
                borderLeft: "3px solid var(--lab-accent)",
                borderRadius: "0 10px 10px 0",
                padding: m ? "14px 16px" : "16px 20px",
                marginTop: m ? 20 : 32,
              }}
            >
              <Label>The Insight</Label>
              <NodeText
                size={m ? 13 : 14}
                weight={500}
                color="var(--lab-text)"
              >
                The unit of value isn&rsquo;t the conversation. It&rsquo;s
                the specific response. People don&rsquo;t need to organize
                conversations. They need to save the answer they&rsquo;ll
                want again.
              </NodeText>
            </div>
          </Reveal>

          {/* Replay */}
          {activeTier >= TIERS.length - 1 && !autoPlaying && (
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <button
                onClick={() => {
                  setActiveTier(0);
                  setAutoPlaying(true);
                }}
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 11,
                  fontWeight: 500,
                  color: "var(--lab-text-secondary)",
                  background: "var(--lab-bg-secondary)",
                  border: "1px solid var(--lab-border)",
                  borderRadius: 999,
                  padding: "8px 20px",
                  cursor: "pointer",
                  transition: "all 200ms",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                ↻ Replay
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
