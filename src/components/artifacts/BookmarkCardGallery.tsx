"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useTheme } from "@/lib/ThemeContext";


const CODE_LINES = [
  "async function middleware(request) {",
  '  const token = await getToken({',
  "    req: request,",
  "    secret: process.env.NEXTAUTH_SECRET,",
  "  });",
  "",
  "  const isAuthPage = request.nextUrl.pathname.startsWith('/login');",
  "  const isApiRoute = request.nextUrl.pathname.startsWith('/api');",
  "  const isPublicRoute = ['/pricing', '/about'].includes(",
  "    request.nextUrl.pathname",
  "  );",
  "",
  "  // Allow public routes and API routes through",
  "  if (isPublicRoute || isApiRoute) {",
  "    return NextResponse.next();",
  "  }",
  "",
  "  // Redirect authenticated users away from login",
  "  if (isAuthPage && token) {",
  "    return NextResponse.redirect(",
  "      new URL('/dashboard', request.url)",
  "    );",
  "  }",
  "",
  "  // Redirect unauthenticated users to login",
  "  if (!isAuthPage && !token) {",
  "    const loginUrl = new URL('/login', request.url);",
  "    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);",
  "    return NextResponse.redirect(loginUrl);",
  "  }",
  "",
  "  return NextResponse.next();",
  "}",
];

const colorize = (line: string) => {
  let r = line
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  r = r.replace(
    /(\/\/.*$)/gm,
    '<span style="color:#637777">$1</span>'
  );
  r = r.replace(
    /\b(const|let|var|function|return|async|await|if|else|new|require)\b/g,
    '<span style="color:#C792EA">$1</span>'
  );
  r = r.replace(
    /('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/g,
    '<span style="color:#C3E88D">$1</span>'
  );
  return r;
};

interface ThemeColors {
  cardBg: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textGhost: string;
  divider: string;
  codeBg: string;
  codeBorder: string;
  codeText: string;
  queryBg: string;
  queryBorder: string;
  queryText: string;
  noteBg: string;
  noteBorder: string;
  noteText: string;
  icBg: string;
  accent: string;
  copyOk: string;
  draftBg: string;
  draftBorder: string;
}

function getThemeColors(dark: boolean): ThemeColors {
  return dark
    ? {
        cardBg: "#1a1a18",
        border: "rgba(222,220,209,0.2)",
        textPrimary: "#FAF9F5",
        textSecondary: "#C2C0B6",
        textTertiary: "#9C9A92",
        textGhost: "rgba(156,154,146,0.5)",
        divider: "rgba(222,220,209,0.08)",
        codeBg: "#141413",
        codeBorder: "rgba(222,220,209,0.08)",
        codeText: "#C2C0B6",
        queryBg: "#262624",
        queryBorder: "rgba(222,220,209,0.08)",
        queryText: "#C2C0B6",
        noteBg: "#262624",
        noteBorder: "rgba(222,220,209,0.08)",
        noteText: "#9C9A92",
        icBg: "rgba(250,249,245,0.08)",
        accent: "#C5603E",
        copyOk: "#7AB948",
        draftBg: "#262624",
        draftBorder: "rgba(222,220,209,0.1)",
      }
    : {
        cardBg: "#FFFFFF",
        border: "rgba(31,30,29,0.15)",
        textPrimary: "#141413",
        textSecondary: "#3D3D3A",
        textTertiary: "#73726C",
        textGhost: "rgba(115,114,108,0.5)",
        divider: "rgba(30,30,28,0.08)",
        codeBg: "#1E1E1D",
        codeBorder: "rgba(255,255,255,0.10)",
        codeText: "#C2C0B2",
        queryBg: "#F5F4ED",
        queryBorder: "rgba(31,30,29,0.15)",
        queryText: "#141413",
        noteBg: "#F5F4ED",
        noteBorder: "rgba(31,30,29,0.15)",
        noteText: "#73726C",
        icBg: "rgba(20,20,19,0.05)",
        accent: "#C5603E",
        copyOk: "#437426",
        draftBg: "#FAFAF7",
        draftBorder: "rgba(31,30,29,0.08)",
      };
}

// ─── Shared Pieces ───

function BookmarkIcon({ size = 22, c }: { size?: number; c: ThemeColors }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={c.accent}
      stroke="none"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function Chevron({ open, color }: { open: boolean; color: string }) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transition: "transform 200ms",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ViewNoteToggle({
  open,
  onToggle,
  c,
}: {
  open: boolean;
  onToggle: () => void;
  c: ThemeColors;
}) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 10,
        gap: 4,
        cursor: "pointer",
      }}
    >
      <Chevron open={open} color={c.textPrimary} />
      <span
        style={{
          fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.44px",
          color: c.textTertiary,
        }}
      >
        {open ? "Hide Note" : "View Note"}
      </span>
    </div>
  );
}

function CopyBtn({ text, c }: { text: string; c: ThemeColors }) {
  const [copied, setCopied] = useState(false);
  const go = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard)
      navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={go}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        background: "none",
        border: "none",
        cursor: "pointer",
        fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
        fontSize: 11,
        fontWeight: 500,
        color: copied ? c.copyOk : c.textGhost,
        padding: "2px 6px",
        borderRadius: 4,
        transition: "color 150ms",
      }}
    >
      {copied ? (
        <svg
          width={13}
          height={13}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg
          width={13}
          height={13}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}


function Query({ text, c }: { text: string; c: ThemeColors }) {
  return (
    <div
      style={{
        backgroundColor: c.queryBg,
        border: "1px solid " + c.queryBorder,
        borderRadius: 8,
        padding: "9px 14px 10px",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
          fontSize: 13,
          lineHeight: "20px",
          color: c.queryText,
          margin: 0,
        }}
      >
        {text}
      </p>
    </div>
  );
}

function Meta({
  date,
  project,
  savedCount,
  c,
}: {
  date: string;
  project?: string;
  savedCount?: string;
  c: ThemeColors;
}) {
  const [badgeHovered, setBadgeHovered] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        paddingTop: 8,
        borderTop: "1px solid " + c.divider,
        gap: 8,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
          fontSize: 12,
          fontWeight: 400,
          lineHeight: "15.6px",
          color: c.textTertiary,
        }}
      >
        {date}
      </span>
      {project && (
        <>
          <span style={{ color: c.textTertiary, fontSize: 11 }}>·</span>
          <span style={{ fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif", fontSize: 11, fontWeight: 400, color: c.textTertiary }}>
            Project:
          </span>
          <span
            onMouseEnter={() => setBadgeHovered(true)}
            onMouseLeave={() => setBadgeHovered(false)}
            style={{
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontSize: 12,
              fontWeight: 500,
              lineHeight: "16px",
              color: c.textTertiary,
              backgroundColor: badgeHovered
                ? (c.cardBg === "#1a1a18" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)")
                : c.queryBg,
              border: "1px solid " + c.border,
              borderRadius: 8,
              padding: "4px 14px",
              cursor: "default",
              transition: "background-color 150ms",
            }}
          >
            {project}
          </span>
        </>
      )}
      {savedCount && (
        <>
          <span style={{ color: c.textTertiary, fontSize: 11 }}>·</span>
          <span
            style={{
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontSize: 12,
              fontWeight: 400,
              color: c.textTertiary,
            }}
          >
            {savedCount}
          </span>
        </>
      )}
    </div>
  );
}

function Note({ text, c }: { text: string; c: ThemeColors }) {
  return (
    <div
      style={{
        backgroundColor: c.noteBg,
        border: "1px solid " + c.noteBorder,
        borderRadius: 8,
        padding: "9px 14px 10px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
        <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={c.noteText} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span
          style={{
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            fontSize: 11,
            fontWeight: 600,
            color: c.noteText,
            letterSpacing: "0.44px",
            textTransform: "uppercase" as const,
          }}
        >
          Strategic Note
        </span>
      </div>
      <p
        style={{
          fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
          fontSize: 13,
          lineHeight: "20px",
          color: c.textPrimary,
          margin: 0,
          fontStyle: "italic",
        }}
      >
        {text}
      </p>
    </div>
  );
}

function ViewConversationBtn({ c }: { c: ThemeColors }) {
  return (
    <div>
      <button
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
          fontSize: 12,
          color: c.textTertiary,
          background: c.queryBg,
          border: "1px solid " + c.border,
          borderRadius: 6,
          cursor: "pointer",
          padding: "8px 12px",
          transition: "border-color 150ms",
        }}
      >
        <span style={{ fontWeight: 500 }}>View full conversation</span>
        <span style={{ fontWeight: 400 }}>→</span>
      </button>
    </div>
  );
}

// ─── Note Panel (chevron toggles this) ───

function NotePanel({
  initialNote,
  c,
}: {
  initialNote?: string;
  c: ThemeColors;
}) {
  const [value, setValue] = useState(initialNote ?? "");
  const [saved, setSaved] = useState(!!initialNote);
  const hasText = value.trim().length > 0;

  if (saved && value) {
    return <Note text={value} c={c} />;
  }

  return (
    <div
      style={{
        backgroundColor: c.noteBg,
        border: "1px solid " + c.noteBorder,
        borderRadius: 8,
        padding: "10px 12px 12px",
      }}
    >
      <span
        style={{
          display: "block",
          fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
          fontSize: 11,
          fontWeight: 600,
          color: c.textTertiary,
          letterSpacing: "0.08em",
          textTransform: "uppercase" as const,
          marginBottom: 8,
        }}
      >
        Note
      </span>
      <div style={{ position: "relative" }}>
        <textarea
          value={value}
          onChange={(e) => { setValue(e.target.value); setSaved(false); }}
          placeholder="Add note"
          rows={3}
          style={{
            width: "100%",
            resize: "none",
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            fontSize: 13,
            lineHeight: "20px",
            color: c.textPrimary,
            backgroundColor: c.cardBg,
            border: "1px solid " + c.border,
            borderRadius: 6,
            padding: "8px 12px",
            outline: "none",
            boxSizing: "border-box" as const,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            opacity: hasText ? 1 : 0,
            transform: hasText ? "scale(1)" : "scale(0.7)",
            transition: "opacity 200ms, transform 200ms cubic-bezier(0.34,1.56,0.64,1)",
            pointerEvents: hasText ? "auto" : "none",
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); if (hasText) setSaved(true); }}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              backgroundColor: c.accent,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Card 1: Single Text ───

function SingleTextCard({ c }: { c: ThemeColors }) {
  const [noteOpen, setNoteOpen] = useState(false);
  return (
    <div
      style={{
        backgroundColor: c.cardBg,
        border: "1px solid " + c.border,
        borderRadius: 12,
        padding: "20px 20px 16px",
        display: "flex",
        flexDirection: "column" as const,
        gap: 12,
        transition: "all 200ms",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <BookmarkIcon c={c} />
      </div>
      <Query
        text={`"What's the best approach for handling optimistic updates with React Query when the server response shape differs from the mutation payload?"`}
        c={c}
      />
      <div
        style={{
          fontFamily: "var(--font-source-serif), 'Source Serif 4', serif",
          fontSize: 14,
          lineHeight: "24px",
          color: c.textPrimary,
        }}
      >
        <p style={{ margin: "0 0 12px 0" }}>
          The cleanest pattern is to separate your optimistic shape from
          the server shape. In your mutation&rsquo;s onMutate callback,
          construct the optimistic object matching your cache shape, not
          the API payload. Then in onSettled, invalidate to let React
          Query refetch the canonical server version.
        </p>
        <p style={{ margin: "0 0 12px 0" }}>
          The key insight: your cache holds the &ldquo;display&rdquo;
          shape (what the UI renders), not the &ldquo;transport&rdquo;
          shape (what the API sends/receives). So your optimistic
          update should build a display-shaped object from the
          mutation variables.
        </p>
        <p style={{ margin: 0 }}>
          If the shapes diverge significantly, create a small transform
          function that maps mutation payload to cache shape. This
          keeps onMutate clean and testable. Avoid trying to make the
          API response and cache shape identical. They serve different
          purposes and forcing alignment creates fragile coupling.
        </p>
      </div>
      <ViewConversationBtn c={c} />
      <ViewNoteToggle open={noteOpen} onToggle={() => setNoteOpen(!noteOpen)} c={c} />
      <AnimatePresence initial={false}>
        {noteOpen && (
          <motion.div
            key="note"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <NotePanel c={c} />
          </motion.div>
        )}
      </AnimatePresence>
      <Meta date="Feb 12" c={c} />
    </div>
  );
}

// ─── Card 2: Single with Code ───

function CodeCard({ c }: { c: ThemeColors }) {
  const [noteOpen, setNoteOpen] = useState(false);
  const [codeExpanded, setCodeExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const VISIBLE_LINES = 6;
  const visible = codeExpanded ? CODE_LINES : CODE_LINES.slice(0, VISIBLE_LINES);
  const ic: React.CSSProperties = {
    fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
    fontSize: 12,
    backgroundColor: c.icBg,
    padding: "1px 5px",
    borderRadius: 4,
  };
  const handleCodeCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard)
      navigator.clipboard.writeText(CODE_LINES.join("\n")).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        backgroundColor: c.cardBg,
        border: "1px solid " + c.border,
        borderRadius: 12,
        padding: "20px 20px 16px",
        display: "flex",
        flexDirection: "column" as const,
        gap: 12,
        transition: "all 200ms",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <BookmarkIcon c={c} />
      </div>
      <Query
        text={`"My auth middleware isn't working with edge runtime. getServerSession returns null. How do I protect routes properly?"`}
        c={c}
      />
      <div
        style={{
          fontFamily: "var(--font-source-serif), 'Source Serif 4', serif",
          fontSize: 14,
          lineHeight: "24px",
          color: c.textPrimary,
        }}
      >
        <p style={{ margin: "0 0 12px 0" }}>
          The issue is that{" "}
          <code style={ic}>getServerSession</code> relies on Node.js
          APIs unavailable in edge runtime. Use{" "}
          <code style={ic}>getToken</code> from{" "}
          <code style={ic}>next-auth/jwt</code> instead. It decodes
          the JWT directly without a database call.
        </p>
        <p style={{ margin: "0 0 4px 0" }}>
          Here&rsquo;s a complete middleware setup with route
          protection and auth redirects:
        </p>
      </div>
      {/* Code block */}
      <div
        style={{
          backgroundColor: c.codeBg,
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 12px",
            borderBottom: "1px solid " + c.codeBorder,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                fontSize: 12,
                fontWeight: 400,
                color: "#637777",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              TYPESCRIPT
            </span>
            <span
              style={{
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                fontSize: 12,
                fontWeight: 400,
                color: "#637777",
              }}
            >
              •
            </span>
            <span
              style={{
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                fontSize: 12,
                fontWeight: 400,
                color: "#637777",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {CODE_LINES.length} LINES
            </span>
          </div>
          <button
            onClick={handleCodeCopy}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.10)",
              cursor: "pointer",
              fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
              fontSize: 11,
              fontWeight: 400,
              color: copied ? c.copyOk : c.codeText,
              padding: "4px 10px",
              borderRadius: 4,
              transition: "color 150ms",
            }}
          >
            {copied ? (
              <svg
                width={12}
                height={12}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg
                width={12}
                height={12}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect
                  x="9"
                  y="9"
                  width="13"
                  height="13"
                  rx="2"
                  ry="2"
                />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <div style={{ position: "relative" }}>
          <pre
            style={{
              fontFamily: "var(--font-jetbrains), 'JetBrains Mono', monospace",
              fontSize: 12,
              lineHeight: "20px",
              color: c.codeText,
              padding: "0 16px 16px",
              margin: 0,
              overflowX: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {visible.map((l, i) => (
              <div
                key={i}
                dangerouslySetInnerHTML={{
                  __html: colorize(l) || "\u00A0",
                }}
              />
            ))}
          </pre>
          {!codeExpanded && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 60,
                background: `linear-gradient(to top, ${c.codeBg}, transparent)`,
                pointerEvents: "none",
              }}
            />
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCodeExpanded(!codeExpanded);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "6px 12px",
            margin: "0 auto",
            fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
            fontSize: 11,
            fontWeight: 400,
            color: c.codeText,
            backgroundColor: c.codeBg,
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 4,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          <svg
            width={12}
            height={12}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: codeExpanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 200ms",
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
          {codeExpanded ? "Hide all" : `Show all ${CODE_LINES.length} lines`}
        </button>
      </div>
      <div>
        <p
          style={{
            fontFamily: "var(--font-source-serif), 'Source Serif 4', serif",
            fontSize: 14,
            lineHeight: "24px",
            color: c.textPrimary,
            margin: 0,
          }}
        >
          Key difference: <code style={ic}>getToken</code> reads the
          JWT cookie directly. No database round-trip, no Node.js
          dependency.
        </p>
      </div>
      <ViewConversationBtn c={c} />
      <ViewNoteToggle open={noteOpen} onToggle={() => setNoteOpen(!noteOpen)} c={c} />
      <AnimatePresence initial={false}>
        {noteOpen && (
          <motion.div
            key="note"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <NotePanel
              initialNote="Implemented this. Added role-based checks via token.role. Works for admin vs user routes."
              c={c}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <Meta
        date="Feb 8"
        project="Backend API"
        c={c}
      />
    </div>
  );
}

// ─── Card 3: Multi-Bookmark ───

function MultiBookmarkCard({ c }: { c: ThemeColors }) {
  const [expandedIdx, setExpandedIdx] = useState(0);
  const [noteOpen, setNoteOpen] = useState(false);
  const items = [
    {
      letter: "A",
      label: "Props vs separate components",
      saved: true,
      content:
        "For your primitives, use the props approach. A single Button with variant, size, and intent props is more maintainable than ButtonPrimary, ButtonSecondary, ButtonDanger. Keeps exports small and refactoring easier.",
    },
    {
      letter: "B",
      label: "File structure (flat then nest)",
      saved: true,
      content:
        'Start flat. Every component in one /components directory. Only create subdirectories at 20+ files. Premature nesting creates decision fatigue. "Flat then nest" scales better than upfront organization.',
    },
    {
      letter: "C",
      label: "Tokens as separate package",
      saved: false,
      content:
        "Extract tokens into their own package when you have 2+ consuming apps. For a single app, co-locate tokens in a /tokens directory. Overhead of a separate package isn't worth it until you have real multi-app consumption.",
    },
  ];
  return (
    <div
      style={{
        backgroundColor: c.cardBg,
        border: "1px solid " + c.border,
        borderRadius: 12,
        padding: "20px 20px 16px",
        display: "flex",
        flexDirection: "column" as const,
        gap: 12,
        transition: "all 200ms",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <BookmarkIcon c={c} />
      </div>
      <Query
        text={`"How should I structure the component library? Naming conventions, file organization, and should tokens be a separate package?"`}
        c={c}
      />
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            borderTop: "1px solid rgba(31,30,29,0.08)",
          }}
        >
          <button
            onClick={() =>
              setExpandedIdx(expandedIdx === i ? -1 : i)
            }
            style={{
              width: "100%",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              padding: "10px 0",
              background: "none",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              gap: 12,
            }}
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.44px",
                  color: item.saved ? c.accent : c.textTertiary,
                }}
              >
                Option {item.letter}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                  fontSize: 14,
                  lineHeight: "22px",
                  color: item.saved
                    ? c.textPrimary
                    : c.textTertiary,
                }}
              >
                {item.label}
              </span>
            </div>
            <svg
              width={14}
              height={14}
              viewBox="0 0 24 24"
              fill="none"
              stroke={item.saved ? c.textTertiary : c.textTertiary}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transition: "transform 200ms",
                transform:
                  expandedIdx === i
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                flexShrink: 0,
                marginTop: 16,
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {expandedIdx === i && (
            <div
              style={{
                paddingBottom: 14,
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-source-serif), 'Source Serif 4', serif",
                  fontSize: 14,
                  lineHeight: "24px",
                  color: item.saved
                    ? c.textPrimary
                    : c.textTertiary,
                  margin: 0,
                }}
              >
                {item.content}
              </p>
            </div>
          )}
        </div>
      ))}
      <ViewConversationBtn c={c} />
      <ViewNoteToggle open={noteOpen} onToggle={() => setNoteOpen(!noteOpen)} c={c} />
      <AnimatePresence initial={false}>
        {noteOpen && (
          <motion.div
            key="note"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <NotePanel c={c} />
          </motion.div>
        )}
      </AnimatePresence>
      <Meta
        date="Mar 5"
        project="Design System"
        savedCount="2 of 3 saved"
        c={c}
      />
    </div>
  );
}

// ─── Card 4: Draft/Message ───

function DraftCard({ c }: { c: ThemeColors }) {
  const [noteOpen, setNoteOpen] = useState(false);
  const draftText = `Hi Sarah,

I wanted to flag something about the March 1 deadline for the payments dashboard redesign. After scoping the accessibility audit findings, we've identified 14 WCAG AA violations that need resolution before launch. Shipping without fixing these creates legal exposure, especially for a payment interface.

I'd like to propose moving to March 15. That gives us two weeks to remediate the critical issues while keeping the rest of the timeline intact. I've already identified which fixes are quick wins vs. deeper refactors, so we can parallelize effectively.

Happy to walk through the breakdown in our Thursday 1:1 if that works.

Thanks,
Amir`;

  return (
    <div
      style={{
        backgroundColor: c.cardBg,
        border: "1px solid " + c.border,
        borderRadius: 12,
        padding: "20px 20px 16px",
        display: "flex",
        flexDirection: "column" as const,
        gap: 12,
        transition: "all 200ms",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <BookmarkIcon c={c} />
      </div>
      <Query
        text={`"I need to push the March 1 deadline for the payments dashboard. Help me write a message to my manager that's direct but doesn't damage the relationship."`}
        c={c}
      />

      {/* Draft container */}
      <div
        style={{
          backgroundColor: c.draftBg,
          border: "1px solid " + c.draftBorder,
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        {/* Draft header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 14px",
            borderBottom: "1px solid " + c.draftBorder,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <svg
              width={13}
              height={13}
              viewBox="0 0 24 24"
              fill="none"
              stroke={c.textGhost}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span
              style={{
                fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                fontSize: 11,
                fontWeight: 600,
                color: c.textGhost,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Draft Message
            </span>
          </div>
          <CopyBtn text={draftText} c={c} />
        </div>
        {/* Draft body — full text, no truncation */}
        <div
          style={{
            padding: "14px 14px",
            fontFamily: "var(--font-source-serif), 'Source Serif 4', serif",
            fontSize: 14,
            lineHeight: "24px",
            color: c.textPrimary,
            whiteSpace: "pre-wrap",
          }}
        >
          {draftText}
        </div>
      </div>

      <ViewConversationBtn c={c} />
      <ViewNoteToggle open={noteOpen} onToggle={() => setNoteOpen(!noteOpen)} c={c} />
      <AnimatePresence initial={false}>
        {noteOpen && (
          <motion.div
            key="note"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <NotePanel
              initialNote="This frames the delay around risk mitigation (accessibility + legal) rather than capacity, which positions you as protecting the company rather than asking for more time."
              c={c}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <Meta date="Feb 10" c={c} />
    </div>
  );
}

// ─── Card 5: Single Option from Multi ───

// ─── Carousel Dot Indicators ───

function DotIndicators({
  count,
  active,
  onSelect,
  c,
}: {
  count: number;
  active: number;
  onSelect: (i: number) => void;
  c: ThemeColors;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 6,
        paddingTop: 20,
        paddingBottom: 4,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          style={{
            width: i === active ? 20 : hovered === i ? 10 : 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: i === active ? c.accent : c.textGhost,
            opacity: i === active ? 1 : hovered === i ? 0.6 : 0.35,
            border: "none",
            padding: 0,
            cursor: "pointer",
            transition:
              "width 300ms cubic-bezier(0.34,1.56,0.64,1), opacity 200ms, background-color 200ms",
          }}
        />
      ))}
    </div>
  );
}

// ─── Main Gallery (Horizontal Carousel) ───

const CARDS = [SingleTextCard, CodeCard, MultiBookmarkCard, DraftCard];
const CARD_LABELS = ["Standard", "Code", "Multi-Option", "Draft"];

function ArrowButton({
  direction,
  onClick,
  c,
}: {
  direction: "left" | "right";
  onClick: () => void;
  c: ThemeColors;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        [direction === "left" ? "left" : "right"]: 8,
        zIndex: 2,
        width: 36,
        height: 36,
        borderRadius: "50%",
        backgroundColor: c.cardBg,
        border: "1px solid " + (hovered ? c.accent : c.border),
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 150ms, border-color 200ms, box-shadow 200ms",
        boxShadow: hovered
          ? "0 2px 12px rgba(0,0,0,0.12)"
          : "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke={hovered ? c.accent : c.textSecondary}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transition: "stroke 200ms" }}
      >
        {direction === "left" ? (
          <polyline points="15 18 9 12 15 6" />
        ) : (
          <polyline points="9 6 15 12 9 18" />
        )}
      </svg>
    </button>
  );
}

function ThemeToggleBtn({
  dark,
  onToggle,
  c,
}: {
  dark: boolean;
  onToggle: () => void;
  c: ThemeColors;
}) {
  return (
    <button
      onClick={onToggle}
      style={{
        position: "absolute",
        top: 12,
        right: 12,
        zIndex: 2,
        width: 32,
        height: 32,
        borderRadius: "50%",
        backgroundColor: c.cardBg,
        border: "1px solid " + c.border,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 200ms",
      }}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <svg
        width={14}
        height={14}
        viewBox="0 0 24 24"
        fill="none"
        stroke={c.textTertiary}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {dark ? (
          <>
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </>
        ) : (
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        )}
      </svg>
    </button>
  );
}

export default function BookmarkCardGallery({ compact = false }: { compact?: boolean }) {
  const { theme } = useTheme();
  const [localDark, setLocalDark] = useState<boolean | null>(null);
  const isDark = localDark !== null ? localDark : theme === "dark";
  const c = getThemeColors(isDark);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const cardWidth = compact
    ? Math.min(containerWidth || 300, 560)
    : isMobile ? 300 : 520;
  const gap = 16;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setContainerWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const go = (dir: -1 | 1) =>
    setActiveIdx((prev) => Math.max(0, Math.min(CARDS.length - 1, prev + dir)));

  const offset = compact
    ? -(activeIdx * (cardWidth + gap))
    : -(activeIdx * (cardWidth + gap)) + (containerWidth / 2 - cardWidth / 2);

  return (
    <div
      style={{
        fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
        background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
        border: "1px solid " + c.border,
        borderRadius: 16,
        transition: "background-color 200ms",
        padding: compact ? "20px 20px 16px" : "28px 28px 20px",
        position: "relative",
      }}
    >
      {/* Local theme toggle — hidden in compact mode */}
      {!compact && <ThemeToggleBtn dark={isDark} onToggle={() => setLocalDark(!isDark)} c={c} />}

      {/* Left/right fade edges — only in full carousel (not compact) */}
      {!compact && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: 40,
            background: `linear-gradient(to right, var(--lab-bg-glass), transparent)`,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      )}
      {!compact && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: 40,
            background: `linear-gradient(to left, var(--lab-bg-glass), transparent)`,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      )}

      {/* Arrow indicators */}
      {activeIdx > 0 && (
        <ArrowButton direction="left" onClick={() => go(-1)} c={c} />
      )}
      {activeIdx < CARDS.length - 1 && (
        <ArrowButton direction="right" onClick={() => go(1)} c={c} />
      )}

      {/* Peekaboo container */}
      <div
        ref={containerRef}
        style={{ overflow: "hidden", padding: "8px 0" }}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        }}
      >
        <div
          style={{
            display: "flex",
            gap,
            transform: `translateX(${offset}px)`,
            transition: "transform 400ms cubic-bezier(0.25, 1, 0.5, 1)",
          }}
        >
          {CARDS.map((Card, i) => {
            const isActive = i === activeIdx;
            return (
              <div
                key={i}
                style={{
                  minWidth: cardWidth,
                  maxWidth: cardWidth,
                  flexShrink: 0,
                  opacity: isActive ? 1 : 0.4,
                  transform: isActive ? "scale(1)" : "scale(0.95)",
                  transition: "opacity 400ms, transform 400ms",
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: c.textTertiary,
                    marginBottom: 8,
                    textAlign: "center",
                    opacity: isActive ? 1 : 0,
                    transition: "opacity 400ms",
                  }}
                >
                  {CARD_LABELS[i]}
                </span>
                <Card c={c} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Dot indicators */}
      <DotIndicators count={CARDS.length} active={activeIdx} onSelect={setActiveIdx} c={c} />
    </div>
  );
}
