"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/lib/projects";

const ease = [0.22, 1, 0.36, 1] as const;

const statusColor: Record<string, string> = {
  live: "#22c55e",
  wip: "var(--lab-accent)",
  concept: "var(--lab-text-secondary)",
};

interface ProjectSheetProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export function ProjectSheet({
  isOpen,
  onClose,
  projects,
  activeId,
  onSelect,
}: ProjectSheetProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
              zIndex: 100,
            }}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              damping: 28,
              stiffness: 300,
              mass: 0.8,
            }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.1}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 300) {
                onClose();
              }
            }}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              maxHeight: "70vh",
              background: "var(--lab-bg)",
              borderTop: "1px solid var(--lab-border)",
              borderRadius: "24px 24px 0 0",
              zIndex: 101,
              overflowY: "auto",
              padding: "12px 0 32px",
            }}
          >
            {/* Drag handle */}
            <div
              style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                background: "var(--lab-border-hover)",
                margin: "0 auto 20px",
              }}
            />

            {/* Project list */}
            {projects.map((project) => {
              const isActive = project.id === activeId;
              return (
                <button
                  key={project.id}
                  onClick={() => {
                    onSelect(project.id);
                    onClose();
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    width: "100%",
                    padding: "14px 24px",
                    background: "none",
                    border: "none",
                    borderLeft: isActive
                      ? "3px solid var(--lab-accent)"
                      : "3px solid transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.15s",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-jetbrains), monospace",
                      fontSize: 12,
                      color: "var(--lab-text-secondary)",
                      minWidth: 24,
                    }}
                  >
                    {project.number}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-cabinet), sans-serif",
                      fontWeight: 700,
                      fontSize: 16,
                      color: isActive
                        ? "var(--lab-accent)"
                        : "var(--lab-text)",
                      flex: 1,
                    }}
                  >
                    {project.title}
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 11,
                      fontFamily: "var(--font-jetbrains), monospace",
                      color: statusColor[project.status],
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: statusColor[project.status],
                      }}
                    />
                    {project.status}
                  </span>
                </button>
              );
            })}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/** Floating button that opens the sheet */
export function ProjectSheetTrigger({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease }}
      onClick={onClick}
      aria-label="Browse projects"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "var(--lab-accent)",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}
    >
      {/* Grid icon */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        stroke="#0a0a0a"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <rect x="2" y="2" width="6" height="6" rx="1" />
        <rect x="12" y="2" width="6" height="6" rx="1" />
        <rect x="2" y="12" width="6" height="6" rx="1" />
        <rect x="12" y="12" width="6" height="6" rx="1" />
      </svg>
    </motion.button>
  );
}
