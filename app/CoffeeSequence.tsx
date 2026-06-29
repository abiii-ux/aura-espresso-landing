"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";

/* ───────────────────────────────────────────
   Constants
   ─────────────────────────────────────────── */
const TOTAL_FRAMES = 120;

interface TextBeat {
  title: string;
  subtitle: string;
  /** Scroll range [fadeInStart, fullyVisible, startFadeOut, fullyGone] */
  range: [number, number, number, number];
  cta?: { label: string; href: string };
}

const BEATS: TextBeat[] = [
  {
    title: "MATCHA BLISS",
    subtitle: "Premium organic matcha latte made with the finest ceremonial-grade green tea powder.",
    range: [0.0, 0.1, 0.1, 0.2],
  },
  {
    title: "PRECISION FRACTURE",
    subtitle:
      "Micro-milled to the exact micron to unlock hidden aromatic profiles.",
    range: [0.25, 0.35, 0.35, 0.45],
  },
  {
    title: "9 BARS OF PRESSURE",
    subtitle:
      "Pure, temperature-controlled water binds with the core essence.",
    range: [0.5, 0.6, 0.6, 0.7],
  },
  {
    title: "ALCHEMY IN A CUP",
    subtitle: "Experience coffee in its absolute purest form.",
    range: [0.75, 0.85, 0.85, 0.95],
    cta: { label: "Order Aura Blend", href: "#order" },
  },
];

/* ───────────────────────────────────────────
   Preloader – loads every frame into an Image[]
   ─────────────────────────────────────────── */
function usePreloadImages(
  onProgress: (pct: number) => void
): [HTMLImageElement[], boolean] {
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loaded: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let count = 0;

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/sequence/frame_${i}.jpg`;
      img.onload = () => {
        if (cancelled) return;
        loaded[i] = img;
        count++;
        onProgress(count / TOTAL_FRAMES);
        if (count === TOTAL_FRAMES) {
          setImages(loaded);
          setReady(true);
        }
      };
      img.onerror = () => {
        if (cancelled) return;
        // still count it so progress completes
        count++;
        onProgress(count / TOTAL_FRAMES);
        if (count === TOTAL_FRAMES) {
          setImages(loaded);
          setReady(true);
        }
      };
    }

    return () => {
      cancelled = true;
    };
    // onProgress is stable via useCallback in parent
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [images, ready];
}

/* ───────────────────────────────────────────
   Canvas draw helper – "contain" scaling
   ─────────────────────────────────────────── */
function drawFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvasW: number,
  canvasH: number
) {
  ctx.clearRect(0, 0, canvasW, canvasH);

  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = canvasW / canvasH;

  let drawW: number;
  let drawH: number;

  if (imgRatio > canvasRatio) {
    // image wider → fit width
    drawW = canvasW;
    drawH = canvasW / imgRatio;
  } else {
    // image taller → fit height
    drawH = canvasH;
    drawW = canvasH * imgRatio;
  }

  const x = (canvasW - drawW) / 2;
  const y = (canvasH - drawH) / 2;

  ctx.drawImage(img, x, y, drawW, drawH);
}

/* ───────────────────────────────────────────
   TextOverlay – a single "beat" of text
   ─────────────────────────────────────────── */
function TextOverlay({
  beat,
  scrollProgress,
}: {
  beat: TextBeat;
  scrollProgress: ReturnType<typeof useSpring>;
}) {
  const [start, visIn, visOut, end] = beat.range;

  const opacity = useTransform(
    scrollProgress,
    [start, visIn, visOut, end],
    [0, 1, 1, 0]
  );
  const y = useTransform(
    scrollProgress,
    [start, visIn, visOut, end],
    [30, 0, 0, -30]
  );

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none z-10"
    >
      <h2
        className="font-playfair text-white/90 font-bold tracking-tight
                    text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl
                    leading-tight mb-4 md:mb-6"
      >
        {beat.title}
      </h2>
      <p
        className="font-inter text-white/60 font-light tracking-wide
                   text-sm sm:text-base md:text-lg lg:text-xl
                   max-w-md md:max-w-xl lg:max-w-2xl leading-relaxed"
      >
        {beat.subtitle}
      </p>
      {beat.cta && (
        <a
          href={beat.cta.href}
          className="pointer-events-auto mt-8 md:mt-10 inline-block
                     px-8 py-3 md:px-10 md:py-4
                     border border-[#D4AF37] text-[#D4AF37]
                     font-inter text-xs md:text-sm tracking-[0.25em] uppercase
                     hover:bg-[#D4AF37] hover:text-[#050505]
                     transition-all duration-500 ease-out
                     btn-glow"
        >
          {beat.cta.label}
        </a>
      )}
    </motion.div>
  );
}

/* ───────────────────────────────────────────
   Loading Screen
   ─────────────────────────────────────────── */
function LoadingScreen({ progress }: { progress: number }) {
  return (
    <div className="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center">
      {/* Bean silhouette */}
      <div className="mb-10 loading-shimmer">
        <svg
          width="48"
          height="64"
          viewBox="0 0 48 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse
            cx="24"
            cy="32"
            rx="18"
            ry="28"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="1.5"
            opacity="0.6"
          />
          <path
            d="M24 4 C22 20, 26 44, 24 60"
            stroke="#D4AF37"
            strokeWidth="1"
            opacity="0.4"
            fill="none"
          />
        </svg>
      </div>

      {/* Loading text */}
      <p className="font-inter text-white/40 text-xs tracking-[0.3em] uppercase mb-6">
        Perfecting the roast…
      </p>

      {/* Progress bar */}
      <div className="w-48 h-[1px] bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#D4AF37]"
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ ease: "easeOut", duration: 0.3 }}
        />
      </div>

      {/* Percentage */}
      <p className="mt-4 font-inter text-white/20 text-[10px] tracking-[0.2em] tabular-nums">
        {Math.round(progress * 100)}%
      </p>
    </div>
  );
}

/* ───────────────────────────────────────────
   Scroll-to-Explore Indicator
   ─────────────────────────────────────────── */
function ScrollIndicator({
  scrollProgress,
}: {
  scrollProgress: ReturnType<typeof useSpring>;
}) {
  const opacity = useTransform(scrollProgress, [0, 0.08], [1, 0]);

  return (
    <motion.div
      style={{ opacity }}
      className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
    >
      <p className="font-inter text-white/30 text-[10px] tracking-[0.3em] uppercase">
        Scroll to Explore
      </p>
      <div className="scroll-bounce">
        <svg
          width="16"
          height="24"
          viewBox="0 0 16 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="1"
            y="1"
            width="14"
            height="22"
            rx="7"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
          />
          <circle cx="8" cy="8" r="2" fill="#D4AF37" opacity="0.7" />
        </svg>
      </div>
    </motion.div>
  );
}

/* ───────────────────────────────────────────
   Main Component: CoffeeSequence
   ─────────────────────────────────────────── */
export default function CoffeeSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const currentFrameRef = useRef<number>(0);

  const [loadProgress, setLoadProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  const handleProgress = useCallback((pct: number) => {
    setLoadProgress(pct);
  }, []);

  const [images, ready] = usePreloadImages(handleProgress);

  // Fade in the content once loaded
  useEffect(() => {
    if (ready) {
      const timer = setTimeout(() => setShowContent(true), 400);
      return () => clearTimeout(timer);
    }
  }, [ready]);

  /* ── Scroll tracking ── */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.0001,
  });

  /* ── Canvas sizing ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function resize() {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    }

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ── Draw on scroll ── */
  useMotionValueEvent(smoothProgress, "change", (latest) => {
    const frameIndex = Math.min(
      Math.floor(latest * (TOTAL_FRAMES - 1)),
      TOTAL_FRAMES - 1
    );

    if (frameIndex === currentFrameRef.current) return;
    currentFrameRef.current = frameIndex;

    cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = images[frameIndex];
      if (!img) return;

      drawFrame(ctx, img, window.innerWidth, window.innerHeight);
    });
  });

  /* ── Draw first frame when ready ── */
  useEffect(() => {
    if (!ready || !images[0]) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawFrame(ctx, images[0], window.innerWidth, window.innerHeight);
  }, [ready, images]);

  /* ── Cleanup ── */
  useEffect(() => {
    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <>
      {/* Loading screen */}
      {!showContent && <LoadingScreen progress={loadProgress} />}

      {/* Main scrollytelling container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        <div
          ref={containerRef}
          className="relative"
          style={{ height: "400vh" }}
        >
          {/* Sticky viewport */}
          <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050505]">
            {/* Canvas */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              style={{ background: "#050505" }}
            />

            {/* Text Overlays */}
            {BEATS.map((beat, i) => (
              <TextOverlay
                key={i}
                beat={beat}
                scrollProgress={smoothProgress}
              />
            ))}

            {/* Scroll indicator */}
            <ScrollIndicator scrollProgress={smoothProgress} />
          </div>
        </div>
      </motion.div>
    </>
  );
}
