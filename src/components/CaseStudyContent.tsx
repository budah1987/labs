"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { CaseStudySection, CaseStudyCard, HoverListItem } from "@/lib/projects";

const OpportunityTree = dynamic(
  () => import("@/components/artifacts/OpportunityTree"),
  { ssr: false }
);
const BookmarkCardGallery = dynamic(
  () => import("@/components/artifacts/BookmarkCardGallery"),
  { ssr: false }
);
const PivotTimeline = dynamic(
  () => import("@/components/artifacts/PivotTimeline"),
  { ssr: false }
);
const ClaudeTokenAnnotation = dynamic(
  () => import("@/components/artifacts/ClaudeTokenAnnotation"),
  { ssr: false }
);
const ScrubPlayer = dynamic(
  () => import("@/components/ScrubPlayer").then(m => ({ default: m.ScrubPlayer })),
  { ssr: false }
);
const LightboxTrigger = dynamic(
  () => import("@/components/Lightbox").then((m) => ({ default: m.LightboxTrigger })),
  { ssr: false }
);

const ease = [0.22, 1, 0.36, 1] as const;

const sectionVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease },
  },
};

interface CaseStudyContentProps {
  sections: CaseStudySection[];
}

export function CaseStudyContent({ sections }: CaseStudyContentProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? 80 : 64,
        width: "100%",
        paddingTop: isMobile ? 40 : 40,
        paddingBottom: isMobile ? 80 : 80,
      }}
    >
      {sections.map((section, i) => (
        <motion.div
          key={i}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={sectionVariants}
        >
          {section.type === "text" && (
            <TextSection section={section} isMobile={isMobile} />
          )}
          {section.type === "text-image" && (
            <TextImageSection section={section} isMobile={isMobile} />
          )}
          {section.type === "full-image" && (
            <FullImageSection section={section} isMobile={isMobile} />
          )}
          {section.type === "two-column" && (
            <TwoColumnSection section={section} isMobile={isMobile} />
          )}
          {section.type === "quote" && (
            <QuoteSection section={section} isMobile={isMobile} />
          )}
          {section.type === "cta" && (
            <CtaSection section={section} isMobile={isMobile} />
          )}
          {section.type === "card-grid" && (
            <CardGridSection section={section} isMobile={isMobile} />
          )}
          {section.type === "hover-list" && (
            <HoverListSection section={section} isMobile={isMobile} />
          )}
          {section.type === "interactive" && (
            <InteractiveSection section={section} isMobile={isMobile} />
          )}
        </motion.div>
      ))}
    </div>
  );
}

function SectionHeader({
  header,
  subheader,
  isMobile,
}: {
  header: string;
  subheader?: string;
  isMobile: boolean;
}) {
  if (!header) return null;
  return (
    <>
      <h2
        style={{
          fontFamily: "var(--font-jetbrains), monospace",
          fontWeight: 500,
          fontSize: isMobile ? 24 : 32,
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
          color: "var(--lab-text)",
          textTransform: "uppercase",
          marginBottom: isMobile ? 24 : 16,
        }}
      >
        {header}
      </h2>
      {subheader && (
        <p
          style={{
            fontFamily: "var(--font-jetbrains), monospace",
            fontWeight: 400,
            fontSize: isMobile ? 14 : 16,
            color: "var(--lab-text-secondary)",
            lineHeight: 1.4,
            marginBottom: isMobile ? 20 : 12,
            textTransform: "uppercase",
            letterSpacing: "0.02em",
          }}
        >
          {subheader}
        </p>
      )}
    </>
  );
}

function BodyText({
  body,
  isMobile,
}: {
  body: string;
  isMobile: boolean;
}) {
  const paragraphs = body.split("\n\n");
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? 20 : 16,
      }}
    >
      {paragraphs.map((p, i) => {
        const isQuote =
          p.startsWith('"') || p.startsWith("\u201c");
        return (
          <p
            key={i}
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: isMobile ? 15 : 16,
              lineHeight: isMobile ? 1.75 : 1.6,
              color: isQuote
                ? "var(--lab-text)"
                : "var(--lab-text-secondary)",
              fontStyle: isQuote ? "italic" : "normal",
            }}
          >
            {p}
          </p>
        );
      })}
    </div>
  );
}

function ImageCaption({ caption, isMobile }: { caption: string; isMobile: boolean }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-inter), sans-serif",
        fontSize: isMobile ? 12 : 13,
        lineHeight: 1.6,
        letterSpacing: "0.01em",
        color: "var(--lab-text-secondary)",
        opacity: 0.7,
        textAlign: "center",
        marginTop: 16,
      }}
    >
      {caption}
    </p>
  );
}

/** Full-width text block, max-width for readability */
function TextSection({
  section,
  isMobile,
}: {
  section: CaseStudySection;
  isMobile: boolean;
}) {
  return (
    <div style={{ width: "100%" }}>
      <SectionHeader
        header={section.header}
        subheader={section.subheader}
        isMobile={isMobile}
      />
      <BodyText body={section.body} isMobile={isMobile} />
    </div>
  );
}

/** Text left (~45%) + Image right (~55%), stacked on mobile */
function TextImageSection({
  section,
  isMobile,
}: {
  section: CaseStudySection;
  isMobile: boolean;
}) {
  return (
    <div>
      <SectionHeader
        header={section.header}
        subheader={section.subheader}
        isMobile={isMobile}
      />
      <div
        style={{
          display: isMobile ? "flex" : "grid",
          gridTemplateColumns: isMobile ? undefined : "45fr 55fr",
          flexDirection: isMobile ? "column" : undefined,
          gap: isMobile ? 32 : 28,
        }}
      >
        <BodyText body={section.body} isMobile={isMobile} />
        {section.image && (
          <div>
            {section.image.startsWith("/") && section.lightbox ? (
              <LightboxTrigger src={section.image} type="image" alt={section.imageCaption}>
                <img
                  src={section.image}
                  alt={section.imageCaption || ""}
                  style={{
                    width: "100%",
                    aspectRatio: "16 / 9",
                    objectFit: "cover",
                    borderRadius: "var(--lab-radius-sm)",
                    border: "1px solid var(--lab-border)",
                    display: "block",
                    flexShrink: 0,
                  }}
                />
              </LightboxTrigger>
            ) : section.image.startsWith("/") ? (
              <img
                src={section.image}
                alt={section.imageCaption || ""}
                style={{
                  width: "100%",
                  aspectRatio: "16 / 9",
                  objectFit: "cover",
                  borderRadius: "var(--lab-radius-sm)",
                  border: "1px solid var(--lab-border)",
                  display: "block",
                  flexShrink: 0,
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  aspectRatio: "16 / 9",
                  borderRadius: "var(--lab-radius-sm)",
                  background: section.image,
                  border: "1px solid var(--lab-border)",
                  flexShrink: 0,
                }}
              />
            )}
            {section.imageCaption && (
              <ImageCaption caption={section.imageCaption} isMobile={isMobile} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/** Full-width image/video spanning entire content area */
function FullImageSection({
  section,
  isMobile,
}: {
  section: CaseStudySection;
  isMobile: boolean;
}) {
  return (
    <div>
      {section.header && (
        <SectionHeader
          header={section.header}
          subheader={section.subheader}
          isMobile={isMobile}
        />
      )}
      {section.video && (
        <>
          <div style={{
            borderRadius: "var(--lab-radius-sm)",
            border: "1px solid var(--lab-border)",
            overflow: "hidden",
          }}>
            <ScrubPlayer src={section.video} />
          </div>
          {section.imageCaption && (
            <ImageCaption caption={section.imageCaption} isMobile={isMobile} />
          )}
          {section.body && <BodyText body={section.body} isMobile={isMobile} />}
        </>
      )}
      {section.image && !section.video && (
        <>
          {section.image.startsWith("/") ? (
            section.lightbox ? (
              <LightboxTrigger src={section.image} type="image" alt={section.imageCaption}>
                <img
                  src={section.image}
                  alt={section.imageCaption || ""}
                  style={{
                    width: "100%",
                    borderRadius: "var(--lab-radius-sm)",
                    border: "1px solid var(--lab-border)",
                    display: "block",
                  }}
                />
              </LightboxTrigger>
            ) : (
              <img
                src={section.image}
                alt={section.imageCaption || ""}
                style={{
                  width: "100%",
                  borderRadius: "var(--lab-radius-sm)",
                  border: "1px solid var(--lab-border)",
                  display: "block",
                }}
              />
            )
          ) : (
            <div
              style={{
                width: "100%",
                aspectRatio: "16 / 9",
                borderRadius: "var(--lab-radius-sm)",
                background: section.image,
                border: "1px solid var(--lab-border)",
              }}
            />
          )}
          {section.imageCaption && (
            <ImageCaption caption={section.imageCaption} isMobile={isMobile} />
          )}
        </>
      )}
    </div>
  );
}

/** Two text columns side by side (desktop), stacked (mobile) */
function TwoColumnSection({
  section,
  isMobile,
}: {
  section: CaseStudySection;
  isMobile: boolean;
}) {
  // Split body on double newline for two columns
  const [col1, col2] = section.body.split("\n\n");
  return (
    <div style={{ width: "100%" }}>
      <SectionHeader
        header={section.header}
        subheader={section.subheader}
        isMobile={isMobile}
      />
      <div
        style={{
          display: isMobile ? "flex" : "grid",
          gridTemplateColumns: isMobile ? undefined : "1fr 1fr",
          flexDirection: isMobile ? "column" : undefined,
          gap: isMobile ? 36 : 32,
        }}
      >
        <BodyText body={col1 || ""} isMobile={isMobile} />
        {col2 && <BodyText body={col2} isMobile={isMobile} />}
      </div>
    </div>
  );
}

/** Highlighted pull-quote with accent left border */
function QuoteSection({
  section,
  isMobile,
}: {
  section: CaseStudySection;
  isMobile: boolean;
}) {
  return (
    <div
      style={{
        borderLeft: "3px solid var(--lab-accent)",
        background: "var(--lab-bg-glass)",
        padding: isMobile ? "28px 24px" : "28px 36px",
        borderRadius: "0 var(--lab-radius-xs) var(--lab-radius-xs) 0",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: isMobile ? 20 : 24,
          lineHeight: 1.5,
          color: "var(--lab-text)",
          fontStyle: "italic",
        }}
      >
        &ldquo;{section.quote}&rdquo;
      </p>
    </div>
  );
}

/** Call-to-action block — centered body text + styled link */
function CtaSection({
  section,
  isMobile,
}: {
  section: CaseStudySection;
  isMobile: boolean;
}) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: isMobile ? "48px 0" : "48px 0",
      }}
    >
      {section.body && (
        <p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: isMobile ? 16 : 18,
            lineHeight: 1.6,
            color: "var(--lab-text-secondary)",
            marginBottom: 20,
          }}
        >
          {section.body}
        </p>
      )}
      {section.ctaLabel && section.ctaHref && (
        <a
          href={section.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: isMobile ? 14 : 16,
            fontWeight: 500,
            color: "var(--lab-accent)",
            textDecoration: "none",
            borderBottom: "1px solid var(--lab-accent)",
            paddingBottom: 2,
          }}
        >
          {section.ctaLabel}
        </a>
      )}
    </div>
  );
}

/** Full-width grid of cards — used for Results, Challenges, Key Takeaways */
function CardGridSection({
  section,
  isMobile,
}: {
  section: CaseStudySection;
  isMobile: boolean;
}) {
  const cols = section.columns || 3;
  return (
    <div style={{ width: "100%" }}>
      <SectionHeader
        header={section.header}
        subheader={section.subheader}
        isMobile={isMobile}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : `repeat(${cols}, 1fr)`,
          gap: isMobile ? 24 : 20,
        }}
      >
        {section.cards?.map((card, i) => (
          <GridCard key={i} card={card} isMobile={isMobile} />
        ))}
      </div>
    </div>
  );
}

function GridCard({
  card,
  isMobile,
}: {
  card: CaseStudyCard;
  isMobile: boolean;
}) {
  const [revealed, setRevealed] = useState(false);
  const hasHover = !!card.hoverImage;

  return (
    <div
      onClick={hasHover && isMobile ? () => setRevealed((r) => !r) : undefined}
      onMouseEnter={hasHover && !isMobile ? () => setRevealed(true) : undefined}
      onMouseLeave={hasHover && !isMobile ? () => setRevealed(false) : undefined}
      style={{
        position: "relative",
        background: "var(--lab-bg-glass)",
        border: "1px solid var(--lab-border)",
        borderRadius: "var(--lab-radius-sm)",
        padding: 24,
        cursor: hasHover ? "pointer" : "default",
        overflow: "hidden",
        minHeight: isMobile ? undefined : 200,
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.2s",
      }}
    >
      {/* Default state: headline + body */}
      <div
        style={{
          opacity: hasHover && revealed ? 0 : 1,
          transition: "opacity 0.25s ease",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-jetbrains), monospace",
            fontWeight: 600,
            fontSize: isMobile ? 14 : 15,
            lineHeight: 1.3,
            color: "var(--lab-accent)",
            textTransform: "uppercase",
            letterSpacing: "0.01em",
            marginBottom: isMobile ? 8 : 10,
          }}
        >
          {card.headline}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: isMobile ? 13 : 14,
            lineHeight: 1.55,
            color: "var(--lab-text-secondary)",
          }}
        >
          {card.body}
        </p>
      </div>

      {/* Hover/tap reveal: placeholder image */}
      {hasHover && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: card.hoverImage,
            borderRadius: "var(--lab-radius-sm)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            padding: 16,
            opacity: revealed ? 1 : 0,
            transition: "opacity 0.25s ease",
            pointerEvents: revealed ? "auto" : "none",
          }}
        >
          {card.hoverCaption && (
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 12,
                color: "var(--lab-text-secondary)",
                opacity: 0.8,
                textAlign: "center",
              }}
            >
              {card.hoverCaption}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/** Vertical hover list — titles on left, media on right */
function HoverListSection({
  section,
  isMobile,
}: {
  section: CaseStudySection;
  isMobile: boolean;
}) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const items = section.items || [];

  return (
    <div style={{ width: "100%" }}>
      <SectionHeader
        header={section.header}
        subheader={section.subheader}
        isMobile={isMobile}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {items.map((item, i) => (
          <div key={i}>
            <button
              onClick={() =>
                setExpandedIndex(expandedIndex === i ? null : i)
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
                padding: "20px 0",
                background: "none",
                border: "none",
                borderBottom: "1px solid var(--lab-border)",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-cabinet), sans-serif",
                  fontWeight: 700,
                  fontSize: isMobile ? 24 : 28,
                  lineHeight: 1.2,
                  color:
                    expandedIndex === i
                      ? "var(--lab-text)"
                      : "var(--lab-text-secondary)",
                  transition: "color 0.3s",
                  flex: 1,
                }}
              >
                {item.title}
              </span>
              <motion.span
                animate={{ rotate: expandedIndex === i ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  color: "var(--lab-text-secondary)",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 5.5L8 10.5L13 5.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {expandedIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={{ padding: "20px 0" }}>
                    <p
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: isMobile ? 14 : 15,
                        lineHeight: 1.55,
                        color: "var(--lab-text-secondary)",
                        marginBottom: 20,
                      }}
                    >
                      {item.body}
                    </p>
                    <HoverListMedia item={item} isActive />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

function HoverListMedia({
  item,
  isActive,
}: {
  item: HoverListItem;
  isActive: boolean;
}) {
  if (item.mediaType === "component" && item.component === "pivot-timeline") {
    return <PivotTimeline isActive={isActive} />;
  }

  if (item.mediaType === "component" && item.component === "bookmark-card-gallery") {
    return <BookmarkCardGallery compact />;
  }

  if (item.mediaType === "component" && item.component === "claude-token-annotation") {
    return <ClaudeTokenAnnotation />;
  }

  if (item.mediaType === "video" && item.mediaSrc) {
    return (
      <div style={{
        borderRadius: "var(--lab-radius-sm)",
        border: "1px solid var(--lab-border)",
        overflow: "hidden",
      }}>
        <ScrubPlayer src={item.mediaSrc} />
      </div>
    );
  }

  // Placeholder for video/image that hasn't been added yet
  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "16 / 9",
        background: "var(--lab-bg-glass)",
        border: "1px solid var(--lab-border)",
        borderRadius: "var(--lab-radius-sm)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="24"
          cy="24"
          r="23"
          stroke="var(--lab-border-hover)"
          strokeWidth="1"
        />
        <path
          d="M20 16L32 24L20 32V16Z"
          fill="var(--lab-text-secondary)"
          opacity="0.3"
        />
      </svg>
      <span
        style={{
          fontFamily: "var(--font-jetbrains), monospace",
          fontSize: 12,
          color: "var(--lab-text-secondary)",
          opacity: 0.5,
        }}
      >
        Video coming soon
      </span>
    </div>
  );
}

/** Interactive embedded component (opportunity tree, bookmark gallery, etc.) */
function InteractiveSection({
  section,
  isMobile,
}: {
  section: CaseStudySection;
  isMobile: boolean;
}) {
  return (
    <div>
      {section.header && (
        <SectionHeader
          header={section.header}
          subheader={section.subheader}
          isMobile={isMobile}
        />
      )}
      <div
        style={{
          width: "100%",
          borderRadius: "var(--lab-radius-sm)",
          overflow: "hidden",
          border: "1px solid var(--lab-border)",
          background: "var(--lab-bg-glass)",
        }}
      >
        {section.component === "opportunity-tree" && <OpportunityTree />}
        {section.component === "bookmark-card-gallery" && (
          <BookmarkCardGallery />
        )}
        {section.imageCaption && (
          <ImageCaption caption={section.imageCaption} isMobile={isMobile} />
        )}
      </div>
    </div>
  );
}
