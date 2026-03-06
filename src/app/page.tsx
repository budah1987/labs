"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { DotGrid } from "@/components/DotGrid";
import { TopBar } from "@/components/TopBar";
import { ThumbnailStrip } from "@/components/ThumbnailStrip";
import { CenterTitle } from "@/components/CenterTitle";
import { ProjectSheet, ProjectSheetTrigger } from "@/components/ProjectSheet";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { projects } from "@/lib/projects";

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const mainRef = useRef<HTMLElement>(null);
  const { scrollDirection, isAtTop } = useScrollDirection(
    isExpanded ? mainRef : undefined
  );

  // Hover takes priority for preview; falls back to clicked selection
  const activeId = hoveredId ?? selectedId;

  const activeProject = useMemo(
    () => projects.find((p) => p.id === activeId) ?? null,
    [activeId]
  );

  // Determine ThumbnailStrip visibility
  const stripVisible = !isExpanded || isAtTop || scrollDirection === "up";

  const handleSelect = useCallback(
    (id: string) => {
      if (isExpanded) {
        // Switching studies while expanded — crossfade
        if (id !== selectedId) {
          setSelectedId(id);
          window.history.replaceState(null, "", `#${id}`);
          mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          // Clicking same thumbnail — collapse
          collapse();
        }
      } else {
        // Click selects AND expands in one step
        setSelectedId(id);
        setIsExpanded(true);
        window.history.pushState(null, "", `#${id}`);
      }
    },
    [isExpanded, selectedId]
  );

  const expand = useCallback(() => {
    if (selectedId) {
      setIsExpanded(true);
      window.history.pushState(null, "", `#${selectedId}`);
    }
  }, [selectedId]);

  const collapse = useCallback(() => {
    // Scroll to top first
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });

    // Delay collapse to allow scroll, then reset to default state
    setTimeout(() => {
      setIsExpanded(false);
      setSelectedId(null);
      setHoveredId(null);
      window.history.replaceState(null, "", window.location.pathname);
    }, 200);
  }, []);

  // Escape key to collapse
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isExpanded) {
        collapse();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isExpanded, collapse]);

  // Browser back button (popstate)
  useEffect(() => {
    const onPopState = () => {
      if (isExpanded) {
        setIsExpanded(false);
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [isExpanded]);

  // Load from URL hash on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const project = projects.find((p) => p.id === hash);
      if (project) {
        setSelectedId(project.id);
        setIsExpanded(true);
      }
    }
  }, []);

  return (
    <>
      <DotGrid />
      <TopBar />
      <main
        ref={mainRef}
        style={{
          height: isExpanded ? "100vh" : "100vh",
          overflowY: isExpanded ? "auto" : "hidden",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <ThumbnailStrip
          projects={projects}
          activeId={activeId}
          selectedId={selectedId}
          isExpanded={isExpanded}
          isVisible={stripVisible}
          onHover={(id) => { if (!isExpanded) setHoveredId(id); }}
          onSelect={handleSelect}
        />
        <CenterTitle
          project={activeProject}
          isExpanded={isExpanded}
          onExpand={expand}
          onCollapse={collapse}
        />
      </main>

      {/* Mobile: floating button + bottom sheet when expanded */}
      <AnimatePresence>
        {isMobile && isExpanded && (
          <ProjectSheetTrigger onClick={() => setSheetOpen(true)} />
        )}
      </AnimatePresence>
      <ProjectSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        projects={projects}
        activeId={selectedId}
        onSelect={(id) => {
          setSelectedId(id);
          window.history.replaceState(null, "", `#${id}`);
          mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </>
  );
}
