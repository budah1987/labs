"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface HeroVideoPlayerProps {
  src: string;
}

// Bar geometry
const BAR_W        = 2;     // px width of each bar
const REST_H       = 16;    // px height at rest (tall)
const DIP_H        = 4;     // px height at full dip (cursor proximity)
const TRACK_CENTER = 32;    // y of bar center in SVG
const SVG_H        = 56;    // total SVG height
const PX_PER_BAR   = 5;     // one bar every N px — consistent density at any width

// Gaussian influence radius (in bar-index units)
const SIGMA_BARS   = 4;

// Spring
const STIFFNESS    = 120;
const DAMPING      = 10;
const MASS         = 1.4;

// Tooltip
const TOOLTIP_Y    = 10;    // y center of tooltip text in SVG

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function HeroVideoPlayer({ src }: HeroVideoPlayerProps) {
  const videoRef          = useRef<HTMLVideoElement>(null);
  const containerRef      = useRef<HTMLDivElement>(null);
  const scrubberRef       = useRef<HTMLDivElement>(null);
  const svgRef            = useRef<SVGSVGElement>(null);
  const barsRef           = useRef<SVGRectElement[]>([]);
  const scrubLineRef      = useRef<SVGLineElement>(null);
  const tooltipRef        = useRef<SVGTextElement>(null);
  const tooltipBgRef      = useRef<SVGRectElement>(null);
  const timeDisplayRef    = useRef<HTMLSpanElement>(null);
  const containerWidthRef = useRef(0);
  const rafRef            = useRef<number>(0);
  const lastTickRef       = useRef(performance.now());
  const wasPlayingRef     = useRef(false);
  const hideTimerRef      = useRef<ReturnType<typeof setTimeout>>(null);

  // Spring state (refs → no re-renders)
  const peakAmp       = useRef(0);   // current spring value 0→1
  const peakVel       = useRef(0);
  const targetPeak    = useRef(0);
  const progressRef   = useRef(0);
  const hoverRatioRef = useRef(0);
  const durationRef   = useRef(0);
  const barCountRef   = useRef(0);
  const isDraggingRef = useRef(false);

  const [isPlaying,    setIsPlaying]    = useState(true);
  const [isEnded,      setIsEnded]      = useState(false);
  const [duration,     setDuration]     = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [isDragging,   setIsDragging]   = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => { durationRef.current = duration; }, [duration]);
  useEffect(() => { isDraggingRef.current = isDragging; }, [isDragging]);

  // ── rAF loop ──────────────────────────────────────────────────────────────
  const tick = useCallback(() => {
    const v = videoRef.current;
    if (v?.duration) progressRef.current = v.currentTime / v.duration;

    // Spring integrate
    const now = performance.now();
    const dt = Math.min((now - lastTickRef.current) / 1000, 0.05);
    lastTickRef.current = now;
    const spring = -STIFFNESS * (peakAmp.current - targetPeak.current);
    const damper = -DAMPING * peakVel.current;
    peakVel.current += ((spring + damper) / MASS) * dt;
    peakAmp.current += peakVel.current * dt;
    if (
      Math.abs(peakAmp.current - targetPeak.current) < 0.001 &&
      Math.abs(peakVel.current) < 0.001
    ) {
      peakAmp.current = targetPeak.current;
      peakVel.current = 0;
    }

    const svg = svgRef.current;
    if (!svg) { rafRef.current = requestAnimationFrame(tick); return; }

    const bars = barsRef.current;
    const n = barCountRef.current;
    if (bars.length === 0 || n === 0) { rafRef.current = requestAnimationFrame(tick); return; }

    const w = svg.getBoundingClientRect().width;
    if (w <= 0) { rafRef.current = requestAnimationFrame(tick); return; }

    const amp      = peakAmp.current;
    const hoverX   = hoverRatioRef.current * w;
    const thumbX   = progressRef.current * w;
    const dragging = isDraggingRef.current;

    // Integer bar positions — no subpixel blur
    const gap = n > 1 ? (w - n * BAR_W) / (n - 1) : 0;

    const secs = progressRef.current * durationRef.current;

    for (let i = 0; i < n && i < bars.length; i++) {
      const bar = bars[i];
      if (!bar) continue;

      const x  = Math.round(i * (BAR_W + gap));
      const cx = x + 1; // center of 2px bar

      // Gaussian dip centered on cursor
      const distPx = Math.abs(cx - hoverX);
      const sigPx  = SIGMA_BARS * (BAR_W + gap);
      const g = Math.exp(-(distPx * distPx) / (2 * sigPx * sigPx));
      const h = Math.round(REST_H - (REST_H - DIP_H) * g * amp);
      const y = Math.round(TRACK_CENTER - h / 2);

      bar.setAttribute("x", String(x));
      bar.setAttribute("y", String(y));
      bar.setAttribute("width", "2");
      bar.setAttribute("height", String(h));

      // Color & opacity — no blur filter on bars (keeps them crisp)
      const isPlayed = cx <= thumbX;
      if (isPlayed) {
        bar.setAttribute("fill", "var(--lab-accent)");
        bar.setAttribute("opacity", String(0.85 + 0.15 * g * amp));
        bar.removeAttribute("filter");
      } else {
        bar.setAttribute("fill", "rgba(255,255,255,0.22)");
        bar.setAttribute("opacity", String(0.75 + 0.15 * g * amp));
        bar.removeAttribute("filter");
      }
    }

    // Scrub line + tooltip — visible only while dragging
    const scrubLine = scrubLineRef.current;
    const tooltip = tooltipRef.current;
    const tooltipBg = tooltipBgRef.current;
    // Playhead line always at thumbX — dim at rest, bright during drag
    const lineX = Math.round(Math.max(1, Math.min(thumbX, w - 1)));
    const tipX  = Math.max(20, Math.min(hoverX, w - 20));
    const lineY1 = TRACK_CENTER - REST_H / 2 - 4;
    const lineY2 = TRACK_CENTER + REST_H / 2 + 4;

    if (scrubLine) {
      scrubLine.setAttribute("x1", String(lineX));
      scrubLine.setAttribute("x2", String(lineX));
      scrubLine.setAttribute("y1", String(lineY1));
      scrubLine.setAttribute("y2", String(lineY2));
      scrubLine.style.opacity = dragging ? "1" : "0.45";
      scrubLine.style.filter = dragging ? "url(#bar-glow)" : "none";
    }

    if (tooltip && tooltipBg) {
      if (dragging) {
        tooltip.setAttribute("x", String(tipX));
        tooltip.setAttribute("y", String(TOOLTIP_Y + 4));
        tooltip.textContent = fmt(secs);
        tooltip.style.opacity = "1";

        const textW = 30;
        tooltipBg.setAttribute("x", String(tipX - textW / 2 - 5));
        tooltipBg.setAttribute("y", String(TOOLTIP_Y - 8));
        tooltipBg.setAttribute("width", String(textW + 10));
        tooltipBg.setAttribute("height", "16");
        tooltipBg.style.opacity = "1";
      } else {
        tooltip.style.opacity = "0";
        tooltipBg.style.opacity = "0";
      }
    }

    // Bottom time display
    if (timeDisplayRef.current) {
      timeDisplayRef.current.textContent = `${fmt(secs)} / ${fmt(durationRef.current)}`;
    }

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  // ── Build bars at a fixed pixel density ──────────────────────────────────
  const buildBars = useCallback((w: number) => {
    const svg = svgRef.current;
    if (!svg || duration <= 0 || w <= 0) return;
    containerWidthRef.current = w;

    svg.querySelectorAll(".scrub-bar").forEach(el => el.remove());
    const n = Math.max(1, Math.round(w / PX_PER_BAR));
    barCountRef.current = n;

    const newBars: SVGRectElement[] = [];
    for (let i = 0; i < n; i++) {
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("class", "scrub-bar");
      rect.setAttribute("rx", "1");
      svg.appendChild(rect);
      newBars.push(rect);
    }
    barsRef.current = newBars;
  }, [duration]);

  // Rebuild on duration change
  useEffect(() => {
    if (duration <= 0 || !scrubberRef.current) return;
    buildBars(scrubberRef.current.getBoundingClientRect().width);
  }, [duration, buildBars]);

  // Rebuild on resize (handles fullscreen expand/contract)
  useEffect(() => {
    const el = scrubberRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width;
      if (w > 0 && (containerWidthRef.current === 0 || Math.abs(w - containerWidthRef.current) > 1)) buildBars(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [buildBars]);

  // ── IntersectionObserver ──────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(([entry]) => {
      const v = videoRef.current;
      if (!v) return;
      if (entry.isIntersecting) {
        if (!v.ended) { v.play().catch(() => {}); setIsPlaying(true); }
      } else {
        v.pause(); setIsPlaying(false);
      }
    }, { threshold: 0 });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // ── Fullscreen ────────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  useEffect(() => () => { if (hideTimerRef.current) clearTimeout(hideTimerRef.current); }, []);

  // ── Playback controls ─────────────────────────────────────────────────────
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused || v.ended) {
      if (v.ended) v.currentTime = 0;
      v.play().catch(() => {});
      setIsPlaying(true); setIsEnded(false);
    } else {
      v.pause(); setIsPlaying(false);
    }
  };

  const enterFullscreen = () => {
    const el = containerRef.current;
    if (el?.requestFullscreen) el.requestFullscreen();
  };

  const scheduleHide = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setShowControls(true);
    hideTimerRef.current = setTimeout(() => setShowControls(false), 2500);
  }, []);

  // ── Scrub ─────────────────────────────────────────────────────────────────
  const getRatio = useCallback((clientX: number) => {
    const el = scrubberRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  }, []);

  const applySeek = useCallback((ratio: number) => {
    const v = videoRef.current;
    if (!v?.duration) return;
    v.currentTime = ratio * v.duration;
    progressRef.current = ratio;
    if (v.ended) setIsEnded(false);
  }, []);

  const onScrubStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const v = videoRef.current;
    if (!v) return;
    wasPlayingRef.current = !v.paused;
    v.pause();
    setIsDragging(true);
    targetPeak.current = 1;
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    const r = getRatio(e.clientX);
    hoverRatioRef.current = r;
    applySeek(r);

    const onMove = (me: MouseEvent) => {
      const nr = getRatio(me.clientX);
      hoverRatioRef.current = nr;
      applySeek(nr);
    };
    const onUp = () => {
      setIsDragging(false);
      // Spring back to hover level (cursor still over scrubber) not zero
      targetPeak.current = 0.4;
      if (wasPlayingRef.current) {
        v.play().catch(() => {}); setIsPlaying(true); setIsEnded(false);
      }
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const showOverlay = showControls || (!isPlaying && !isEnded);

  return (
    <div
      ref={containerRef}
      onMouseMove={scheduleHide}
      onMouseEnter={scheduleHide}
      onMouseLeave={() => {
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        setShowControls(false);
        if (!isDragging) targetPeak.current = 0;
      }}
      style={{ position: "relative", width: "100%", height: "100%", background: "#000" }}
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        playsInline
        muted
        onLoadedMetadata={() => {
          const d = videoRef.current?.duration ?? 0;
          setDuration(d); durationRef.current = d;
        }}
        onEnded={() => { setIsPlaying(false); setIsEnded(true); }}
        style={{
          width: "100%", height: "100%",
          objectFit: isFullscreen ? "contain" : "cover",
          display: "block",
        }}
      />

      {/* Centered play button when manually paused */}
      {!isPlaying && !isEnded && (
        <div onClick={togglePlay} style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", background: "rgba(0,0,0,0.25)",
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: "50%",
            background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <PlayIcon />
          </div>
        </div>
      )}

      {/* Controls overlay */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        opacity: showOverlay ? 1 : 0,
        transition: "opacity 0.25s ease",
        pointerEvents: showOverlay ? "auto" : "none",
        background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)",
      }}>

        {/* Bar scrubber */}
        <div
          ref={scrubberRef}
          onMouseDown={onScrubStart}
          onMouseMove={(e) => {
            hoverRatioRef.current = getRatio(e.clientX);
          }}
          onMouseEnter={() => { if (!isDraggingRef.current) targetPeak.current = 0.4; }}
          onMouseLeave={() => { if (!isDraggingRef.current) targetPeak.current = 0; }}
          style={{
            margin: "0 16px",
            cursor: "pointer",
            position: "relative",
            height: SVG_H,
            userSelect: "none",
          }}
        >
          <svg
            ref={svgRef}
            width="100%"
            height={SVG_H}
            style={{ overflow: "visible", display: "block" }}
          >
            <defs>
              <filter id="bar-glow" x="-50%" y="-100%" width="200%" height="300%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Scrub position indicator — vertical line, dragging only */}
            <line
              ref={scrubLineRef}
              stroke="var(--lab-accent)"
              strokeWidth="1.5"
              strokeLinecap="round"
              style={{ opacity: 0, transition: "opacity 0.1s", filter: "url(#bar-glow)" }}
            />

            {/* Tooltip bg pill */}
            <rect
              ref={tooltipBgRef}
              rx="4"
              fill="rgba(0,0,0,0.7)"
              style={{ opacity: 0, transition: "opacity 0.12s" }}
            />

            {/* Tooltip text — visible only while dragging */}
            <text
              ref={tooltipRef}
              textAnchor="middle"
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "10px",
                fontWeight: 600,
                fill: "#fff",
                letterSpacing: "0.04em",
                pointerEvents: "none",
                opacity: 0,
                transition: "opacity 0.12s",
              }}
            />
          </svg>
        </div>

        {/* Button row */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 12px 12px" }}>
          <button onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"} style={btnStyle}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <span
            ref={timeDisplayRef}
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: 11,
              color: "rgba(255,255,255,0.7)",
              letterSpacing: "0.04em",
              flex: 1,
            }}
          />
          <button onClick={enterFullscreen} aria-label="Fullscreen" style={btnStyle}>
            <FullscreenIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  background: "none", border: "none", padding: 6, cursor: "pointer",
  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
  borderRadius: 4, lineHeight: 1,
};

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M3 2.5l10 5.5-10 5.5V2.5z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="3" y="2" width="4" height="12" rx="1" />
      <rect x="9" y="2" width="4" height="12" rx="1" />
    </svg>
  );
}

function FullscreenIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" />
    </svg>
  );
}
