"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

const ease = [0.22, 1, 0.36, 1] as const;

/* ─── Expand Icon SVG ─── */
function ExpandIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─── Close Icon SVG ─── */
function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 5l10 10M15 5L5 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─── Play / Pause Icons ─── */
function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 2l10 6-10 6V2z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="2" width="3.5" height="12" rx="0.5" fill="currentColor" />
      <rect x="9.5" y="2" width="3.5" height="12" rx="0.5" fill="currentColor" />
    </svg>
  );
}

/* ─── Volume Icons ─── */
function VolumeOnIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 5.5h2.5L8 2.5v11L4.5 10.5H2a.5.5 0 01-.5-.5V6a.5.5 0 01.5-.5z"
        fill="currentColor"
      />
      <path
        d="M10.5 4.5a4.5 4.5 0 010 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function VolumeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 5.5h2.5L8 2.5v11L4.5 10.5H2a.5.5 0 01-.5-.5V6a.5.5 0 01.5-.5z"
        fill="currentColor"
      />
      <path
        d="M12 5.5l-3 5M9 5.5l3 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─── Video Controls ─── */
function VideoControls({ videoRef }: { videoRef: React.RefObject<HTMLVideoElement | null> }) {
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const scrubberRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const onTimeUpdate = () => {
      if (!isDragging.current && vid.duration) {
        setProgress(vid.currentTime / vid.duration);
      }
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    vid.addEventListener("timeupdate", onTimeUpdate);
    vid.addEventListener("play", onPlay);
    vid.addEventListener("pause", onPause);
    return () => {
      vid.removeEventListener("timeupdate", onTimeUpdate);
      vid.removeEventListener("play", onPlay);
      vid.removeEventListener("pause", onPause);
    };
  }, [videoRef]);

  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) vid.play();
    else vid.pause();
  };

  const toggleMute = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    setMuted(vid.muted);
  };

  const seek = useCallback(
    (clientX: number) => {
      const vid = videoRef.current;
      const bar = scrubberRef.current;
      if (!vid || !bar || !vid.duration) return;
      const rect = bar.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      vid.currentTime = ratio * vid.duration;
      setProgress(ratio);
    },
    [videoRef]
  );

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    seek(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (isDragging.current) seek(e.clientX);
  };

  const onPointerUp = () => {
    isDragging.current = false;
  };

  const btnStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    color: "rgba(255,255,255,0.85)",
    cursor: "pointer",
    padding: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 12px",
        background: "rgba(0,0,0,0.5)",
        borderRadius: 8,
        marginTop: 8,
        width: "100%",
        maxWidth: "90vw",
        boxSizing: "border-box",
      }}
    >
      <button onClick={togglePlay} style={btnStyle} aria-label={playing ? "Pause" : "Play"}>
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>

      {/* Scrubber */}
      <div
        ref={scrubberRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{
          flex: 1,
          height: 20,
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          touchAction: "none",
        }}
      >
        <div
          style={{
            width: "100%",
            height: 3,
            background: "rgba(255,255,255,0.2)",
            borderRadius: 2,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${progress * 100}%`,
              background: "var(--lab-accent, #6366f1)",
              borderRadius: 2,
              transition: isDragging.current ? "none" : "width 0.1s linear",
            }}
          />
        </div>
      </div>

      <button onClick={toggleMute} style={btnStyle} aria-label={muted ? "Unmute" : "Mute"}>
        {muted ? <VolumeOffIcon /> : <VolumeOnIcon />}
      </button>
    </div>
  );
}

/* ─── Lightbox Overlay ─── */
function LightboxOverlay({
  src,
  type,
  alt,
  onClose,
}: {
  src: string;
  type: "image" | "video";
  alt?: string;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [imgHovered, setImgHovered] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="lightbox-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        {/* Content */}
        <motion.div
          key="lightbox-content"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.35, ease }}
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: "90vw",
            maxHeight: "85vh",
          }}
        >
          {type === "image" ? (
            <div
              style={{ position: "relative", display: "inline-flex" }}
              onMouseEnter={() => setImgHovered(true)}
              onMouseLeave={() => setImgHovered(false)}
            >
              <img
                src={src}
                alt={alt || ""}
                onClick={onClose}
                style={{
                  maxWidth: "90vw",
                  maxHeight: "85vh",
                  objectFit: "contain",
                  borderRadius: 8,
                  display: "block",
                  cursor: "zoom-out",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  bottom: "calc(100% + 6px)",
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
                  opacity: imgHovered ? 1 : 0,
                  transition: "opacity 0.15s ease",
                }}
              >
                click to close
              </span>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                src={src}
                autoPlay
                loop
                playsInline
                style={{
                  maxWidth: "90vw",
                  maxHeight: "calc(85vh - 52px)",
                  objectFit: "contain",
                  borderRadius: 8,
                  display: "block",
                }}
              />
              <VideoControls videoRef={videoRef} />
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

/* ─── LightboxTrigger (public API) ─── */
export function LightboxTrigger({
  src,
  type,
  alt,
  children,
}: {
  src: string;
  type: "image" | "video";
  alt?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <div
        style={{ position: "relative", cursor: "pointer" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setOpen(true)}
      >
        {children}
        {/* Tooltip */}
        <span
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
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
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.15s ease",
          }}
        >
          click to expand
        </span>
      </div>

      {open && (
        <LightboxOverlay
          src={src}
          type={type}
          alt={alt}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
