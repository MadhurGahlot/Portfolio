"use client";

// A portfolio index built as a 3D interactive wheel with monochrome white & black fluid aesthetics.

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, Award, Sparkles } from "lucide-react";

export interface WorksWheelItem {
  /** Project/Certificate name. Shown beside the front card and in the index. */
  title: string;
  /** Cover art / image src. */
  image: string;
  /** Optional link URL. */
  href?: string;
  /** Optional issuer or category subtitle. */
  subtitle?: string;
}

export interface WorksWheelProps extends Omit<
  React.ComponentPropsWithoutRef<"section">,
  "children"
> {
  items: WorksWheelItem[];
  /** Sits in the middle of the ring. @default "Certificates" */
  label?: string;
  /** Label on the card's hover affordance. Omit to drop it. @default "Verify" */
  action?: string;
}

/* Geometry & Tuning for Snappy 3D Animation & Visual Depth */
const CARD_H = 0.42;
const CARD_MAX_W = 0.38;
const CARD_RATIO = 1.45;
const STEP = 36;
const DRUM = 2.1;
const LENS = 2.8;
const RING_R = 1.15;
const BOW = 1.6;
const TITLE_SCALE = 0.15;
const CULL = 1.8;

/** Scroll & Drag responsiveness limits */
const WHEEL_UNITS = 450;
const DRAG_UNITS = 250;
const SETTLE = 120;
const EASE = 0.18;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Stage = { w: number; h: number };

const rad = (deg: number) => (deg * Math.PI) / 180;

const bowAt = (drumDeg: number, bow: number) =>
  -bow * (1 - Math.cos(rad(drumDeg)));

function place(
  ringDeg: number,
  drumDeg: number,
  ringR: number,
  drumR: number,
  bow: number,
  m: number,
) {
  return (
    `translateX(${m * bowAt(drumDeg, bow)}px)` +
    ` rotateZ(${(1 - m) * ringDeg}deg) translateY(${-(1 - m) * ringR}px)` +
    ` rotateX(${m * drumDeg}deg) translateZ(${m * drumR}px)`
  );
}

export function WorksWheel({
  items,
  label = "Certificates",
  action = "Verify",
  className,
  ...props
}: WorksWheelProps) {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const wheelRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLElement | null)[]>([]);
  const labelRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLDivElement>(null);

  const turn = React.useRef(0);
  const target = React.useRef(0);
  const settling = React.useRef(0);
  const drag = React.useRef<number | null>(null);

  const [active, setActive] = React.useState(0);
  const [stage, setStage] = React.useState<Stage>({ w: 0, h: 0 });

  const count = items.length;
  const last = Math.max(count - 1, 0);

  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setReduced(query.matches);
    read();
    query.addEventListener("change", read);
    return () => query.removeEventListener("change", read);
  }, []);

  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const read = () => setStage({ w: el.clientWidth, h: el.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const metrics = React.useMemo(() => {
    const { w, h } = stage;
    const cardW = Math.min(h * CARD_H * CARD_RATIO, w * CARD_MAX_W);
    const cardH = cardW / CARD_RATIO;
    const drumR = cardH * DRUM;
    const ringR = cardH * RING_R;
    const ringScale = count
      ? clamp((((2 * Math.PI * ringR) / count) * 0.85) / (cardW || 1), 0.25, 1)
      : 1;
    return {
      cardW: Math.max(cardW, 180),
      cardH: Math.max(cardH, 120),
      ringR,
      ringScale,
      drumR,
      bow: cardH * BOW,
      depth: Math.max(cardH * LENS, 600),
      title: Math.max(22, Math.min(cardH * TITLE_SCALE, 44)),
    };
  }, [stage, count]);

  // Main animation loop
  React.useEffect(() => {
    if (!stage.h) return;
    let frame = 0;
    const { ringR, ringScale, drumR, bow } = metrics;

    const draw = () => {
      frame = requestAnimationFrame(draw);
      const gap = target.current - turn.current;
      if (Math.abs(gap) < 0.0003) turn.current = target.current;
      else turn.current += gap * (reduced ? 1 : EASE);

      const t = turn.current;
      const m = clamp(t, 0, 1);
      const pos = Math.max(0, t - 1);

      if (wheelRef.current) {
        wheelRef.current.style.transform = `translateZ(${-m * drumR}px)`;
      }

      for (let i = 0; i < count; i++) {
        const d = i - pos;
        const drumDeg = d * STEP;
        const card = cardRefs.current[i];
        if (card) {
          card.style.transform = place(
            d * (360 / count),
            drumDeg,
            ringR,
            drumR,
            bow,
            m,
          );
          const absD = Math.abs(d);
          card.style.opacity = m > 0.5 && absD > CULL ? "0" : String(clamp(1 - absD * 0.4, 0.15, 1));
          card.style.zIndex = String(Math.round(100 - absD * 10));
        }
        const face = card?.firstElementChild as HTMLElement | null;
        if (face) {
          const frontBonus = m > 0.5 ? lerp(1, 1.06, clamp(1 - Math.abs(d), 0, 1)) : 1;
          face.style.transform = `scale(${lerp(ringScale, 1, m) * frontBonus})`;
        }
      }

      if (labelRef.current) labelRef.current.style.opacity = String(1 - m);
      if (titleRef.current) titleRef.current.style.opacity = String(m);

      const near = clamp(Math.round(pos), 0, last);
      setActive((prev) => (prev === near ? prev : near));
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [metrics, stage.h, count, last, reduced]);

  const to = React.useCallback(
    (next: number) => {
      target.current = clamp(next, 0, last + 1);
    },
    [last],
  );

  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (event: WheelEvent) => {
      const delta = event.deltaY;
      const curr = target.current;
      const next = curr + delta / WHEEL_UNITS;

      if (
        (delta > 0 && curr < last + 0.95) ||
        (delta < 0 && curr > 0.05)
      ) {
        event.preventDefault();
        to(next);
      }

      window.clearTimeout(settling.current);
      settling.current = window.setTimeout(
        () => to(Math.round(target.current)),
        SETTLE,
      );
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.clearTimeout(settling.current);
    };
  }, [to, last]);

  return (
    <section
      aria-label={label}
      className={cn(
        "bg-brand-50 dark:bg-brand-950 text-foreground relative h-full min-h-[36rem] w-full overflow-hidden select-none transition-colors duration-500",
        className,
      )}
      {...props}
    >
      {/* Dynamic Ambient Blur Background (Monochrome Black & White) */}
      {items[active]?.image && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20 dark:opacity-30 transition-opacity duration-1000">
          <img
            key={items[active].image}
            src={items[active].image}
            alt=""
            className="w-full h-full object-cover blur-[120px] scale-150 transform transition-all duration-1000 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-50/90 via-brand-50/40 to-brand-50/90 dark:from-brand-950/90 dark:via-brand-950/40 dark:to-brand-950/90" />
        </div>
      )}

      {/* Cybernetic Monochrome Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-30 bg-[linear-gradient(to_right,#80808018_1px,transparent_1px),linear-gradient(to_bottom,#80808018_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_50%,#000_60%,transparent_100%)]" />

      {/* Monochrome Radiant Spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-white/20 via-zinc-400/15 to-black/30 dark:from-white/15 dark:via-zinc-500/10 dark:to-black/40 rounded-full blur-[130px] pointer-events-none animate-pulse-slow" />

      {/* Decorative Monochrome Watermark */}
      <div className="absolute top-6 left-6 md:left-12 z-30 pointer-events-none hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-ultra text-brand-400 dark:text-brand-500 font-mono">
        
        
      </div>

      <div
        ref={stageRef}
        tabIndex={0}
        role="listbox"
        aria-label={label}
        aria-activedescendant={`works-wheel-${active}`}
        className="focus-visible:outline-foreground absolute inset-0 cursor-grab touch-pan-x outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 active:cursor-grabbing z-10"
        style={{ perspective: `${metrics.depth}px` }}
        onPointerDown={(event) => {
          drag.current = event.clientY;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (drag.current === null) return;
          to(target.current + (drag.current - event.clientY) / DRAG_UNITS);
          drag.current = event.clientY;
        }}
        onPointerUp={() => {
          drag.current = null;
          if (target.current > 1) to(Math.round(target.current));
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") to(Math.round(target.current) + 1);
          else if (event.key === "ArrowUp") to(Math.round(target.current) - 1);
          else return;
          event.preventDefault();
        }}
      >
        <div
          ref={wheelRef}
          className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]"
        >
          {items.map((item, i) => {
            const isCurrent = i === active;
            const Tag = (item.href ? "a" : "div") as "a";
            return (
              <React.Fragment key={item.title + i}>
                <Tag
                  id={`works-wheel-${i}`}
                  role="option"
                  aria-selected={isCurrent}
                  href={item.href}
                  target={item.href?.startsWith("http") ? "_blank" : undefined}
                  rel={item.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                  onClick={(e) => {
                    if (i !== active) {
                      e.preventDefault();
                      to(i + 1);
                    }
                  }}
                  ref={(node: HTMLElement | null) => {
                    cardRefs.current[i] = node;
                  }}
                  className="group absolute [backface-visibility:hidden] cursor-pointer transition-all duration-300"
                  style={{
                    width: metrics.cardW,
                    height: metrics.cardH,
                    marginLeft: -metrics.cardW / 2,
                    marginTop: -metrics.cardH / 2,
                  }}
                >
                  <span className={cn(
                    "relative block size-full overflow-hidden rounded-xl border border-brand-400/40 dark:border-brand-600/60 bg-brand-100 dark:bg-brand-900/90 backdrop-blur-md transition-all duration-300",
                    isCurrent
                      ? "shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] ring-2 ring-brand-950/40 dark:ring-brand-50/50"
                      : "shadow-lg hover:shadow-2xl opacity-85 group-hover:opacity-100"
                  )}>
                    <img
                      src={item.image}
                      alt={item.title}
                      draggable={false}
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {action && item.href ? (
                      <span className="bg-brand-950/90 text-brand-50 dark:bg-brand-50/90 dark:text-brand-950 pointer-events-none absolute right-3 bottom-3 flex translate-y-1 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium opacity-0 backdrop-blur-md transition group-hover:translate-y-0 group-hover:opacity-100 shadow-xl">
                        <svg
                          viewBox="0 0 12 12"
                          className="size-3"
                          aria-hidden="true"
                        >
                          <path
                            d="M3 9 9 3M4 3h5v5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {action}
                      </span>
                    ) : null}
                  </span>
                </Tag>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Ring Header Title */}
      <div
        ref={labelRef}
        className="pointer-events-none absolute inset-0 grid place-items-center tracking-tight font-serif text-brand-950 dark:text-brand-50 drop-shadow-md z-20"
        style={{ fontSize: metrics.title * 1.2 }}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2 text-brand-950 dark:text-brand-50 text-xs font-mono tracking-widest uppercase mb-1">
            <Award className="w-4 h-4 text-brand-950 dark:text-brand-50" /> Verified Achievements
          </div>
          <span>{label}</span>
          <span className="text-xs uppercase tracking-ultra font-sans text-brand-500 font-normal">
            Scroll or Drag to Explore Wheel
          </span>
        </div>
      </div>

      {/* Front-Card Active Title Display */}
      <div
        ref={titleRef}
        className="pointer-events-none absolute top-1/2 left-[5%] md:left-[8%] -translate-y-1/2 opacity-0 max-w-[38vw] z-30 space-y-3"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] uppercase tracking-ultra bg-brand-200/90 dark:bg-brand-900/90 border border-brand-300/60 dark:border-brand-700/70 rounded-full text-brand-800 dark:text-brand-200 backdrop-blur-md shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-950 dark:bg-brand-50 animate-pulse" />
          Credential #{String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </span>
        <h3
          className="font-serif font-semibold tracking-tight leading-tight text-brand-950 dark:text-brand-50 drop-shadow-md break-words"
          style={{ fontSize: metrics.title }}
        >
          {items[active]?.title}
        </h3>
        {items[active]?.href && (
          <a
            href={items[active].href}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest bg-brand-950 text-brand-50 dark:bg-brand-50 dark:text-brand-950 rounded-full hover:opacity-90 transition-all shadow-md font-semibold"
          >
            <span>Verify Credential</span>
            <span>↗</span>
          </a>
        )}
      </div>

      {/* Right Side Certificate Index List */}
      <div className="absolute top-[8%] right-[3%] z-30 flex flex-col items-end max-h-[84vh]">
        <div className="text-[10px] uppercase tracking-ultra text-brand-400 dark:text-brand-500 font-medium mb-3 pr-3 flex items-center gap-1.5">
          <span>Index</span>
          <span className="px-1.5 py-0.5 rounded-full bg-brand-200 dark:bg-brand-800 text-[9px] font-mono">{count}</span>
        </div>
        <ol className="text-right leading-relaxed space-y-1.5 overflow-y-auto max-h-[75vh] pr-2 scrollbar-thin select-none">
          {items.map((item, i) => {
            const isCurrent = i === active;
            return (
              <li key={item.title + i} className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => to(i + 1)}
                  className={cn(
                    "cursor-pointer transition-all duration-300 text-right flex items-center justify-end gap-2.5 px-3.5 py-1.5 rounded-full tracking-wide text-xs sm:text-sm md:text-base font-sans",
                    isCurrent
                      ? "text-brand-950 dark:text-brand-50 font-bold bg-brand-200/90 dark:bg-brand-900/90 backdrop-blur-md shadow-md border border-brand-400/80 dark:border-brand-600/80 scale-105"
                      : "text-brand-600/80 dark:text-brand-400/80 hover:text-brand-950 dark:hover:text-brand-100 hover:bg-brand-200/40 dark:hover:bg-brand-800/40 opacity-80 hover:opacity-100"
                  )}
                >
                  <span className="text-[11px] font-mono text-brand-400 dark:text-brand-500">
                    {String(i + 1).padStart(2, '0')}.
                  </span>
                  <span className="truncate max-w-[160px] sm:max-w-[220px] md:max-w-[280px]">
                    {item.title}
                  </span>
                  {isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-brand-950 dark:bg-brand-50 animate-pulse shrink-0" />
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Up / Down Navigation Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-brand-100/90 dark:bg-brand-900/90 backdrop-blur-xl px-5 py-2.5 rounded-full border border-brand-300/60 dark:border-brand-800/60 shadow-xl">
        <button
          type="button"
          onClick={() => to(Math.max(1, target.current - 1))}
          aria-label="Previous Item"
          className="p-1.5 rounded-full hover:bg-brand-200 dark:hover:bg-brand-800 text-brand-800 dark:text-brand-200 transition-colors"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <span className="text-xs font-mono tracking-widest text-brand-600 dark:text-brand-300 font-semibold">
          {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </span>
        <button
          type="button"
          onClick={() => to(Math.min(last + 1, target.current + 1))}
          aria-label="Next Item"
          className="p-1.5 rounded-full hover:bg-brand-200 dark:hover:bg-brand-800 text-brand-800 dark:text-brand-200 transition-colors"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}

export default WorksWheel;
