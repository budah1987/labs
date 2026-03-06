"use client";

import { useState, useRef, useEffect, useCallback, RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/lib/ThemeContext";

// ─── Token palettes ────────────────────────────────────────────────────────────

function getTokens(dark: boolean) {
  return dark
    ? {
        shellBg: "rgba(255,255,255,0.03)",
        shellBorder: "rgba(222,220,209,0.2)",
        divider: "rgba(222,220,209,0.08)",
        inputBg: "#31312F",
        inputBorder: "rgba(222,220,209,0.12)",
        pillBg: "#1C1C1A",
        pillBorder: "#5A5B56",
        textPrimary: "#FAF9F5",
        textSecondary: "#C2C0B6",
        textTertiary: "#9C9A92",
        textGhost: "rgba(156,154,146,0.5)",
        accent: "#C6613F",
        tooltipBg: "#2a2a27",
        tooltipBorder: "rgba(222,220,209,0.18)",
        annotationLabel: "#9C9A92",
        annotationValue: "#FAF9F5",
      }
    : {
        shellBg: "rgba(0,0,0,0.02)",
        shellBorder: "rgba(31,30,29,0.15)",
        divider: "rgba(30,30,28,0.08)",
        inputBg: "#F5F4ED",
        inputBorder: "rgba(31,30,29,0.12)",
        pillBg: "#EEEEE8",
        pillBorder: "rgba(31,30,29,0.15)",
        textPrimary: "#141413",
        textSecondary: "#3D3D3A",
        textTertiary: "#73726C",
        textGhost: "rgba(115,114,108,0.5)",
        accent: "#C5603E",
        tooltipBg: "#F0EFE8",
        tooltipBorder: "rgba(31,30,29,0.15)",
        annotationLabel: "#73726C",
        annotationValue: "#141413",
      };
}

type T = ReturnType<typeof getTokens>;

// ─── Claude icon ───────────────────────────────────────────────────────────────

function ClaudeAsterisk({
  size,
  color,
  elRef,
}: {
  size: number;
  color: string;
  elRef?: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={elRef} style={{ display: "flex", alignItems: "center" }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z"
          fill={color}
          fillRule="nonzero"
        />
      </svg>
    </div>
  );
}

// ─── Chat UI ───────────────────────────────────────────────────────────────────

interface ChatUIRefs {
  asteriskRef: RefObject<HTMLDivElement | null>;
  greetingRef: RefObject<HTMLSpanElement | null>;
  placeholderRef: RefObject<HTMLSpanElement | null>;
  opusRef: RefObject<HTMLDivElement | null>;
  inputBoxRef: RefObject<HTMLDivElement | null>;
}

function ChatUI({
  T,
  isMobile,
  refs,
}: {
  T: T;
  isMobile: boolean;
  refs: ChatUIRefs;
}) {
  const INNER_PAD = 16; // matches input inner horizontal padding

  return (
    <div style={{
      width: "100%",
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 18,
    }}>
      {/* Greeting */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <ClaudeAsterisk size={26} color={T.accent} elRef={refs.asteriskRef} />
        <span
          ref={refs.greetingRef}
          style={{
            fontFamily: "var(--font-source-serif), 'Source Serif 4', Georgia, serif",
            fontSize: 26, fontWeight: 400,
            color: T.textSecondary,
            letterSpacing: "-0.01em", lineHeight: 1,
          }}
        >
          Evening, Amir
        </span>
      </div>

      {/* Input box */}
      <div
        ref={refs.inputBoxRef}
        style={{
          width: "100%",
          backgroundColor: T.inputBg,
          borderRadius: 16,
          boxShadow: "0px 2px 8px rgba(0,0,0,0.06)",
          border: `1px solid ${T.inputBorder}`,
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}
      >
        <div style={{ padding: `14px ${INNER_PAD}px 8px` }}>
          <span ref={refs.placeholderRef} style={{ fontSize: 14, color: T.textGhost }}>
            How can Claude help you today?
          </span>
          <span style={{
            display: "inline-block", width: 2, height: 16,
            background: T.textTertiary, marginLeft: 1, verticalAlign: "middle",
          }} />
        </div>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: `0 ${INNER_PAD}px 12px`,
        }}>
          {/* + button */}
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: T.textTertiary,
          }}>
            <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          {/* Opus + send */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              ref={refs.opusRef}
              style={{
                display: "flex", alignItems: "center", gap: 3,
                padding: "0 7px", height: 26, borderRadius: 6,
                fontSize: 11, fontWeight: 500, color: T.textTertiary,
              }}
            >
              <span>Opus 4.6</span>
              <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              backgroundColor: T.accent,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Pills */}
      {isMobile ? (
        // Mobile: 3+2 centered wrap
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 8,
          width: `calc(100% - ${INNER_PAD * 2}px)`,
        }}>
          {PILLS.map(({ label, icon }) => (
            <PillItem key={label} label={label} icon={icon} T={T} />
          ))}
        </div>
      ) : (
        // Desktop: single row, pills stretch to fill, inset to match input padding
        <div style={{
          display: "flex",
          gap: 8,
          width: `calc(100% - ${INNER_PAD * 2}px)`,
        }}>
          {PILLS.map(({ label, icon }) => (
            <PillItem key={label} label={label} icon={icon} T={T} flex />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Pills data ────────────────────────────────────────────────────────────────

const PILLS = [
  {
    label: "Write",
    icon: (color: string) => (
      <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    label: "Learn",
    icon: (color: string) => (
      <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  {
    label: "From Drive",
    icon: (_color: string) => (
      <svg width={13} height={13} viewBox="0 0 87.3 78">
        <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da" />
        <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47" />
        <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335" />
        <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d" />
        <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc" />
        <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00" />
      </svg>
    ),
  },
  {
    label: "From Calendar",
    icon: (_color: string) => (
      <svg width={13} height={13} viewBox="0 0 32 32" fill="none">
        <path d="M24.4925 6H21.2412V10.7112H25.9987V7.32845C26 7.32845 25.7636 6.12848 24.4925 6Z" fill="#1967D2" />
        <path d="M21.2422 25.978V25.9895V25.9998L25.9997 21.2886H25.957L21.2422 25.978Z" fill="#1967D2" />
        <path d="M25.9993 21.2883V21.2461L25.957 21.2883H25.9993Z" fill="#FBBC05" />
        <path d="M25.9997 10.7114H21.2422V21.2465H25.9997V10.7114Z" fill="#FBBC05" />
        <path d="M25.957 21.2886H21.2422V25.978L25.957 21.2886Z" fill="#EA4335" />
        <path d="M21.2422 21.2883H25.957L25.9997 21.2461H21.2422V21.2883Z" fill="#EA4335" />
        <path d="M21.2305 25.9895H21.242V25.978L21.2305 25.9895Z" fill="#34A853" />
        <path d="M10.6504 21.2461V25.9895H21.231L21.2427 21.2461H10.6504Z" fill="#34A853" />
        <path d="M6 21.2461V24.5441C6.04263 25.6143 7.20002 25.9895 7.20002 25.9895H10.6503V21.2461H6Z" fill="#188038" />
        <path d="M10.6503 10.7112H21.2425V6H7.33437C7.33437 6 6.08525 6.12848 6 7.45564V21.2464H10.6503V10.7112Z" fill="#4285F4" />
        <path d="M14.1155 19.114C13.8732 19.114 13.6395 19.0824 13.4145 19.0193C13.1952 18.9562 12.9933 18.8615 12.8087 18.7352C12.624 18.6032 12.4596 18.4397 12.3153 18.2446C12.1769 18.0495 12.0701 17.8228 11.9951 17.5645L13.0596 17.1428C13.1346 17.4297 13.2616 17.6478 13.4404 17.797C13.6193 17.9404 13.8443 18.0122 14.1155 18.0122C14.2367 18.0122 14.3521 17.9949 14.4617 17.9605C14.5713 17.9203 14.6665 17.8658 14.7473 17.797C14.8281 17.7281 14.8915 17.6478 14.9377 17.5559C14.9896 17.4584 15.0156 17.3493 15.0156 17.2288C15.0156 16.9763 14.9204 16.7784 14.73 16.6349C14.5454 16.4914 14.2886 16.4197 13.9597 16.4197H13.4491V15.3953H13.9165C14.0318 15.3953 14.1444 15.381 14.254 15.3523C14.3636 15.3236 14.4588 15.2806 14.5396 15.2232C14.6261 15.1601 14.6925 15.0826 14.7386 14.9908C14.7906 14.8932 14.8165 14.7813 14.8165 14.6551C14.8165 14.4599 14.7473 14.3021 14.6088 14.1816C14.4703 14.0554 14.2828 13.9922 14.0463 13.9922C13.7924 13.9922 13.5962 14.0611 13.4578 14.1988C13.325 14.3308 13.2327 14.48 13.1808 14.6465L12.1422 14.2247C12.1942 14.0812 12.2721 13.9349 12.3759 13.7857C12.4798 13.6307 12.6096 13.493 12.7654 13.3725C12.9269 13.2462 13.1145 13.1458 13.3279 13.0712C13.5414 12.9909 13.7866 12.9507 14.0636 12.9507C14.3463 12.9507 14.6031 12.9909 14.8338 13.0712C15.0704 13.1515 15.2723 13.2634 15.4397 13.4069C15.607 13.5446 15.7368 13.7111 15.8291 13.9062C15.9214 14.0955 15.9676 14.3021 15.9676 14.5259C15.9676 14.6981 15.9445 14.853 15.8984 14.9908C15.858 15.1285 15.8032 15.2519 15.7339 15.3609C15.6647 15.4699 15.5839 15.5646 15.4916 15.645C15.4051 15.7196 15.3156 15.7798 15.2233 15.8257V15.8946C15.5003 16.0036 15.7282 16.1787 15.907 16.4197C16.0917 16.6607 16.184 16.9649 16.184 17.3321C16.184 17.5904 16.1349 17.8285 16.0368 18.0466C15.9388 18.2589 15.7974 18.4454 15.6128 18.6061C15.4339 18.7668 15.2175 18.8902 14.9637 18.9763C14.7098 19.0681 14.4271 19.114 14.1155 19.114Z" fill="#4285F4" />
        <path d="M18.2507 18.9763V14.414L17.2035 14.853L16.7881 13.8976L18.5277 13.0884H19.3845V18.9763H18.2507Z" fill="#4285F4" />
      </svg>
    ),
  },
  {
    label: "From Gmail",
    icon: (_color: string) => (
      <svg width={13} height={13} viewBox="0 0 24 24">
        <path d="M2 6 L2 18 L6 18 L6 10.5 L12 14.5 L18 10.5 L18 18 L22 18 L22 6 L12 12 Z" fill="#4285F4" />
        <path d="M2 6 L2 18 L6 18 L6 10.5 L12 14.5 L12 12 Z" fill="#34A853" />
        <path d="M18 10.5 L18 18 L22 18 L22 6 L12 12 L12 14.5 Z" fill="#FBBC05" />
        <path d="M2 6 L12 12 L22 6 Z" fill="#EA4335" />
      </svg>
    ),
  },
];

function PillItem({ label, icon, T, flex }: { label: string; icon: (c: string) => React.ReactNode; T: T; flex?: boolean }) {
  return (
    <div style={{
      ...(flex ? { flex: 1, justifyContent: "center" } : {}),
      display: "flex", alignItems: "center", gap: 6,
      padding: "6px 12px", borderRadius: 8,
      border: `1px solid ${T.pillBorder}`, background: T.pillBg,
      fontSize: 12, fontWeight: 500, color: T.textSecondary,
      whiteSpace: "nowrap", cursor: "default",
    }}>
      {icon(T.textSecondary)}{label}
    </div>
  );
}

// ─── Token dot definitions ─────────────────────────────────────────────────────

const TOKEN_DEFS = [
  { id: "accent",      name: "--accent-primary",  value: "#C6613F" },
  { id: "serif",       name: "--font-serif",       value: "Source Serif 4" },
  { id: "ghost",       name: "--text-ghost",       value: "rgba(156,154,146,.5)" },
  { id: "tertiary",    name: "--text-tertiary",    value: "#9C9A92" },
  { id: "radius",      name: "--chat-input-radius", value: "16px" },
];

type DotPos = { x: number; y: number };

// ─── Tooltip ───────────────────────────────────────────────────────────────────

function TooltipPanel({
  token, pos, containerW, containerH, T,
}: {
  token: typeof TOKEN_DEFS[number];
  pos: DotPos;
  containerW: number;
  containerH: number;
  T: T;
}) {
  const nearTop = pos.y < containerH * 0.5;
  // Estimate tooltip width conservatively to clamp left
  const estW = Math.max(token.name.length, token.value.length) * 7 + 24;
  const left = Math.max(4, Math.min(pos.x - estW / 2, containerW - estW - 4));
  const top = nearTop ? pos.y + 16 : pos.y - 52;

  return (
    <motion.div
      initial={{ opacity: 0, y: nearTop ? -6 : 6, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: nearTop ? -4 : 4, scale: 0.94 }}
      transition={{ type: "spring", stiffness: 420, damping: 26 }}
      style={{
        position: "absolute",
        left,
        top,
        width: "max-content",
        background: T.tooltipBg,
        border: `1px solid ${T.tooltipBorder}`,
        borderRadius: 10,
        padding: "7px 10px",
        zIndex: 20,
        pointerEvents: "none",
      }}
    >
      <div style={{
        fontFamily: "var(--font-jetbrains), monospace",
        fontSize: 8, letterSpacing: "0.04em",
        color: T.annotationLabel, textTransform: "uppercase", lineHeight: 1.5,
        whiteSpace: "nowrap",
      }}>
        {token.name}
      </div>
      <div style={{
        fontFamily: "var(--font-jetbrains), monospace",
        fontSize: 10.5, letterSpacing: "-0.01em",
        color: T.annotationValue, lineHeight: 1.3, marginTop: 1,
        whiteSpace: "nowrap",
      }}>
        {token.value}
      </div>
    </motion.div>
  );
}

// ─── Token dot ─────────────────────────────────────────────────────────────────

function TokenDot({
  pos, active, index, onActivate, T,
}: {
  pos: DotPos;
  active: boolean;
  index: number;
  onActivate: () => void;
  T: T;
}) {
  return (
    <motion.button
      onClick={(e) => { e.stopPropagation(); onActivate(); }}
      style={{
        position: "absolute",
        left: pos.x - 7,
        top: pos.y - 7,
        width: 14, height: 14,
        borderRadius: "50%",
        background: T.accent + "99",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        border: `1.5px solid rgba(255,255,255,0.35)`,
        cursor: "pointer",
        padding: 0,
        zIndex: 10,
        boxShadow: `0 0 0 0 ${T.accent}`,
      }}
      animate={active ? { scale: 1.5 } : {
        scale: [1, 1.35, 1],
        boxShadow: [
          `0 0 0 0px ${T.accent}44`,
          `0 0 0 5px ${T.accent}00`,
          `0 0 0 0px ${T.accent}00`,
        ],
      }}
      transition={active ? { duration: 0.15 } : {
        duration: 2.2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.45,
        repeatDelay: 0.3,
      }}
      whileTap={{ scale: 0.8 }}
    />
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────────

const MOBILE_THRESHOLD = 520;

export default function ClaudeTokenAnnotation() {
  const { theme } = useTheme();
  const T = getTokens(theme === "dark");

  const [activeDotId, setActiveDotId] = useState<string | null>(null);
  const [hintGone, setHintGone] = useState(false);
  const [containerW, setContainerW] = useState(700);
  const [containerH, setContainerH] = useState(200);
  const [dotPositions, setDotPositions] = useState<DotPos[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refs for the 5 annotated elements
  const asteriskRef = useRef<HTMLDivElement>(null);
  const greetingRef = useRef<HTMLSpanElement>(null);
  const placeholderRef = useRef<HTMLSpanElement>(null);
  const opusRef = useRef<HTMLDivElement>(null);
  const inputBoxRef = useRef<HTMLDivElement>(null);

  const measureDots = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const cr = container.getBoundingClientRect();
    setContainerW(cr.width);
    setContainerH(cr.height);

    const measure = (el: HTMLElement | null, mode: "center" | "topRight" = "center"): DotPos => {
      if (!el) return { x: 0, y: 0 };
      const r = el.getBoundingClientRect();
      if (mode === "topRight") {
        return {
          x: r.right - cr.left - 10,
          y: r.top - cr.top + 10,
        };
      }
      return {
        x: r.left - cr.left + r.width / 2,
        y: r.top - cr.top + r.height / 2,
      };
    };

    setDotPositions([
      measure(asteriskRef.current),           // accent-primary
      measure(greetingRef.current),            // font-serif
      measure(placeholderRef.current),         // text-ghost
      measure(opusRef.current),               // text-tertiary
      measure(inputBoxRef.current, "topRight"), // chat-input-radius
    ]);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => measureDots());
    ro.observe(container);
    // Initial measurement after paint
    const frame = requestAnimationFrame(measureDots);
    return () => { ro.disconnect(); cancelAnimationFrame(frame); };
  }, [measureDots]);

  const isMobile = containerW < MOBILE_THRESHOLD;

  const handleDotActivate = useCallback((id: string) => {
    setActiveDotId(id);
    if (!hintGone) setHintGone(true);
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    tooltipTimer.current = setTimeout(() => setActiveDotId(null), 2500);
  }, [hintGone]);

  const dismissTooltip = useCallback(() => {
    setActiveDotId(null);
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
  }, []);

  const refs: ChatUIRefs = { asteriskRef, greetingRef, placeholderRef, opusRef, inputBoxRef };

  return (
    <div
      ref={containerRef}
      style={{
        fontFamily: "var(--font-dm-sans), 'DM Sans', system-ui, sans-serif",
        background: T.shellBg,
        border: `1px solid ${T.shellBorder}`,
        borderRadius: 16,
        padding: "14px 18px 16px",
        width: "100%",
        boxSizing: "border-box",
        display: "flex", flexDirection: "column", gap: 10,
        overflow: "hidden",
        position: "relative",
      }}
      onClick={dismissTooltip}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{
          fontFamily: "var(--font-jetbrains), monospace",
          fontSize: 9, letterSpacing: "0.06em", textTransform: "uppercase",
          color: T.textTertiary,
        }}>
          Token Parity
        </span>
      </div>

      <div style={{ height: 1, background: T.shellBorder }} />

      {/* Hint */}
      <AnimatePresence>
        {!hintGone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 1 }}
            style={{
              textAlign: "center",
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: 8, letterSpacing: "0.08em", textTransform: "uppercase",
              color: T.textTertiary,
            }}
          >
            Tap the dots
          </motion.div>
        )}
      </AnimatePresence>

      {/* ChatUI */}
      <ChatUI T={T} isMobile={isMobile} refs={refs} />

      {/* Dot overlay — absolutely positioned over the whole shell */}
      {dotPositions.length === TOKEN_DEFS.length && TOKEN_DEFS.map((token, i) => (
        <TokenDot
          key={token.id}
          pos={dotPositions[i]}
          active={activeDotId === token.id}
          index={i}
          onActivate={() => handleDotActivate(token.id)}
          T={T}
        />
      ))}

      {/* Active tooltip */}
      <AnimatePresence>
        {activeDotId && (() => {
          const idx = TOKEN_DEFS.findIndex(d => d.id === activeDotId);
          const token = TOKEN_DEFS[idx];
          const pos = dotPositions[idx];
          return token && pos
            ? <TooltipPanel key={token.id} token={token} pos={pos} containerW={containerW} containerH={containerH} T={T} />
            : null;
        })()}
      </AnimatePresence>
    </div>
  );
}
