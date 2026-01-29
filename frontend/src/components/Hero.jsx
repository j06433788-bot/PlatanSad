import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSettings } from "../context/SettingsContext";

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const Hero = () => {
  const { settings } = useSettings();

  const slides = useMemo(() => {
    const active = settings?.heroSlides?.filter((s) => s.active) || [];
    return active.length
      ? active
      : [
          {
            id: 1,
            image: "https://images.unsplash.com/photo-1494825514961-674db1ac2700",
            title: "PlatanSad",
            subtitle: "Професійний розсадник рослин",
            active: true,
          },
        ];
  }, [settings?.heroSlides]);

  const [index, setIndex] = useState(0);

  // gesture state
  const wrapRef = useRef(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const lastDx = useRef(0);
  const dragging = useRef(false);
  const lockAxis = useRef(null); // "x" | "y" | null
  const raf = useRef(null);

  // animation offset in px (for drag)
  const [dx, setDx] = useState(0);
  const [isSettling, setIsSettling] = useState(false);
  const [paused, setPaused] = useState(false);
  const resumeAtRef = useRef(0);

  const len = slides.length;

  const go = (nextIdx) => setIndex((_) => ((nextIdx % len) + len) % len);
  const next = () => setIndex((p) => (p + 1) % len);
  const prev = () => setIndex((p) => (p - 1 + len) % len);

  // Safety on slides change
  useEffect(() => {
    if (index >= len) setIndex(0);
  }, [len, index]);

  const pauseTemporarily = (ms = 4500) => {
    resumeAtRef.current = Date.now() + ms;
  };

  // Auto-rotate (paused while interacting/settling)
  useEffect(() => {
    if (len <= 1) return;

    const t = setInterval(() => {
      const now = Date.now();
      if (paused) return;
      if (isSettling) return;
      if (now < resumeAtRef.current) return;
      next();
    }, 5000);

    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [len, paused, isSettling]);

  const scheduleDx = (value) => {
    lastDx.current = value;
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = null;
      setDx(lastDx.current);
    });
  };

  const onPointerDown = (e) => {
    if (len <= 1) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;

    dragging.current = true;
    lockAxis.current = null;
    startX.current = e.clientX;
    startY.current = e.clientY;
    scheduleDx(0);

    setPaused(true);
    pauseTemporarily(4500);

    // capture pointer for smoother interaction
    try {
      wrapRef.current?.setPointerCapture?.(e.pointerId);
    } catch {}
  };

  const onPointerMove = (e) => {
    if (!dragging.current) return;

    const rawDx = e.clientX - startX.current;
    const rawDy = e.clientY - startY.current;

    // Decide axis (prevent vertical scroll blocking)
    if (!lockAxis.current) {
      const ax = Math.abs(rawDx);
      const ay = Math.abs(rawDy);
      if (ay > ax && ay > 10) {
        lockAxis.current = "y";
      } else if (ax > 10) {
        lockAxis.current = "x";
      }
    }

    if (lockAxis.current === "y") {
      // release if user is scrolling
      dragging.current = false;
      setPaused(false);
      scheduleDx(0);
      return;
    }

    // Horizontal drag
    const el = wrapRef.current;
    const w = el?.clientWidth || 1;

    // clamp drag to feel “native”
    const clamped = clamp(rawDx, -w * 0.45, w * 0.45);
    scheduleDx(clamped);

    if (e.cancelable) e.preventDefault?.();
  };

  const settleTo = (targetDx, cb) => {
    setIsSettling(true);
    // animate via state and CSS transition
    scheduleDx(targetDx);
    // transition end roughly
    window.setTimeout(() => {
      cb?.();
      setIsSettling(false);
    }, 220);
  };

  const onPointerUpOrCancel = () => {
    if (!dragging.current) {
      setPaused(false);
      return;
    }

    dragging.current = false;

    const el = wrapRef.current;
    const w = el?.clientWidth || 1;

    const threshold = Math.max(40, w * 0.12);

    if (dx > threshold) {
      // swipe right => previous
      settleTo(w * 0.18, () => {
        prev();
        // snap back
        scheduleDx(0);
      });
    } else if (dx < -threshold) {
      // swipe left => next
      settleTo(-w * 0.18, () => {
        next();
        scheduleDx(0);
      });
    } else {
      // return to center
      settleTo(0, () => scheduleDx(0));
    }

    pauseTemporarily(4500);
    setPaused(false);
  };

  // indices for neighbor slides
  const prevIdx = (index - 1 + len) % len;
  const nextIdx = (index + 1) % len;

  // percent for tiny indicators
  const activePip = index;

  return (
    <section className="max-w-7xl mx-auto px-0 sm:px-4 py-0 sm:py-4">
      <div className="relative overflow-hidden rounded-none sm:rounded-2xl shadow-md">
        <div
          ref={wrapRef}
          className="relative h-[180px] xs:h-[200px] sm:h-auto sm:aspect-[2.5/1] touch-pan-y bg-black"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUpOrCancel}
          onPointerCancel={onPointerUpOrCancel}
          role="region"
          aria-label="Головний слайдер"
        >
          {/* Slide track: prev | current | next */}
          {len > 1 ? (
            <div
              className="absolute inset-0 flex h-full w-[300%]"
              style={{
                transform: `translateX(calc(-33.3333% + ${dx}px))`,
                transition: isSettling ? "transform 220ms cubic-bezier(.16,1,.3,1)" : "none",
              }}
            >
              {[prevIdx, index, nextIdx].map((i, pos) => {
                const slide = slides[i];
                const isCenter = pos === 1;
                return (
                  <div key={`${slide.id ?? i}-${pos}`} className="relative w-1/3 h-full">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover select-none"
                      draggable={false}
                      loading={isCenter ? "eager" : "lazy"}
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                    {isCenter && (
                      <div className="absolute inset-0 flex flex-col justify-center px-3 sm:px-10 md:px-16">
                        <h2 className="text-lg xs:text-xl sm:text-4xl md:text-5xl font-bold text-white mb-1 sm:mb-3 leading-tight drop-shadow">
                          {slide.title}
                        </h2>
                        <p className="text-green-400 text-xs xs:text-sm sm:text-xl md:text-2xl font-medium drop-shadow">
                          {slide.subtitle}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            // Single slide fallback
            <div className="absolute inset-0">
              <img
                src={slides[0].image}
                alt={slides[0].title}
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center px-3 sm:px-10 md:px-16">
                <h2 className="text-lg xs:text-xl sm:text-4xl md:text-5xl font-bold text-white mb-1 sm:mb-3 leading-tight drop-shadow">
                  {slides[0].title}
                </h2>
                <p className="text-green-400 text-xs xs:text-sm sm:text-xl md:text-2xl font-medium drop-shadow">
                  {slides[0].subtitle}
                </p>
              </div>
            </div>
          )}

          {/* Minimal indicators (tiny) */}
          {len > 1 && (
            <div className="absolute bottom-1.5 sm:bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    go(i);
                    pauseTemporarily(4500);
                  }}
                  aria-label={`Слайд ${i + 1}`}
                  className={[
                    "rounded-full transition-all duration-200",
                    i === activePip
                      ? "bg-green-500/90 w-4 sm:w-5 h-[3px]"
                      : "bg-white/55 hover:bg-white/80 w-1.5 sm:w-2 h-[3px]",
                  ].join(" ")}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
