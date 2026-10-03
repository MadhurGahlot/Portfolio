"use client";

import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ExternalLink, Award } from "lucide-react";

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  image: string;
  credential_url?: string;
}

export interface CertificateMarqueeProps {
  items: CertificateItem[];
  className?: string;
}

/** A single certificate card with hover glass overlay */
function CertificateCard({ cert, index }: { cert: CertificateItem; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex-shrink-0 group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={cn(
          "relative w-[320px] sm:w-[360px] md:w-[400px] aspect-[1.45/1] rounded-2xl overflow-hidden border border-brand-300/40 dark:border-brand-700/50 transition-all duration-500",
          hovered
            ? "scale-[1.04] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] z-20 ring-2 ring-brand-950/30 dark:ring-brand-50/30"
            : "shadow-lg"
        )}
      >
        {/* Certificate Image */}
        <img
          src={cert.image}
          alt={cert.title}
          draggable={false}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Hover Glass Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-brand-950/95 via-brand-950/60 to-transparent flex flex-col justify-end p-5 transition-opacity duration-400",
            hovered ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-ultra text-brand-300 font-mono">
              <Award className="w-3 h-3" />
              <span>{cert.issuer}</span>
              <span className="text-brand-500">·</span>
              <span>{cert.date}</span>
            </div>
            <h4 className="text-brand-50 font-serif text-lg font-semibold leading-snug tracking-tight">
              {cert.title}
            </h4>
            {cert.credential_url && cert.credential_url.trim() && (
              <a
                href={cert.credential_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-brand-300 hover:text-brand-50 transition-colors font-medium mt-1"
                onClick={(e) => e.stopPropagation()}
              >
                Verify Credential
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Always-visible small badge */}
        <div
          className={cn(
            "absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider backdrop-blur-md border transition-opacity duration-300",
            hovered
              ? "opacity-0"
              : "opacity-100 bg-brand-950/70 text-brand-100 border-brand-700/50"
          )}
        >
          {cert.issuer}
        </div>
      </div>
    </div>
  );
}

/** Infinite scrolling marquee row */
function MarqueeRow({
  items,
  direction = "left",
  speed = 35,
}: {
  items: CertificateItem[];
  direction?: "left" | "right";
  speed?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  // We duplicate the items for seamless infinite loop
  const duplicated = [...items, ...items, ...items];
  const totalWidth = items.length * 420; // approximate card width + gap

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animFrame: number;
    let offset = direction === "left" ? 0 : -totalWidth;

    const step = () => {
      if (!paused) {
        if (direction === "left") {
          offset -= speed / 60;
          if (Math.abs(offset) >= totalWidth) offset = 0;
        } else {
          offset += speed / 60;
          if (offset >= 0) offset = -totalWidth;
        }
      }
      track.style.transform = `translateX(${offset}px)`;
      animFrame = requestAnimationFrame(step);
    };

    animFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrame);
  }, [paused, direction, speed, totalWidth]);

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        ref={trackRef}
        className="flex gap-5 will-change-transform"
        style={{ width: "max-content" }}
      >
        {duplicated.map((cert, i) => (
          <CertificateCard key={`${cert.id}-${i}`} cert={cert} index={i} />
        ))}
      </div>
    </div>
  );
}

export function CertificateMarquee({ items, className }: CertificateMarqueeProps) {
  // Split items into two rows for visual density
  const mid = Math.ceil(items.length / 2);
  const row1 = items.slice(0, mid);
  const row2 = items.slice(mid);

  return (
    <div className={cn("w-full space-y-10 md:space-y-14", className)}>
      {/* Section Heading */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-brand-950 dark:bg-brand-50" />
          <span className="text-[10px] uppercase tracking-ultra font-mono text-brand-500">
            Verified Achievements
          </span>
        </div>
        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-brand-950 dark:text-brand-50">
          Certificates <span className="italic font-light opacity-70">&</span> Credentials
        </h2>
        <p className="mt-3 text-sm text-brand-600 dark:text-brand-400 max-w-lg font-sans">
          Hover over any certificate to view details. The gallery scrolls continuously — pause it by hovering.
        </p>
      </div>

      {/* Row 1: Scrolls Left */}
      <MarqueeRow items={row1} direction="left" speed={30} />

      {/* Row 2: Scrolls Right (opposite direction for visual contrast) */}
      {row2.length > 0 && (
        <MarqueeRow items={row2} direction="right" speed={25} />
      )}

      {/* Bottom counter */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-ultra text-brand-400 dark:text-brand-500 font-mono">
          {items.length} Certificates
        </span>
        <span className="text-[11px] uppercase tracking-ultra text-brand-400 dark:text-brand-500 font-mono">
          Hover to pause · Auto-scrolling
        </span>
      </div>
    </div>
  );
}

export default CertificateMarquee;
