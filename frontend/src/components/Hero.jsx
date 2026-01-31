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

  const len = slides.length;
  const [index, setIndex] = useState(0);

  const wrapRef = useRef(null);
  const raf = useRef(null);
  const dragging = useRef(false);
  const lockAxis = useRef(null);

  const startX = useRef(0);
  const startY = useRef(0);
  const startT = useRef(0);

  const lastX = useRef(0);
  const lastT = useRef(0);

  const [dx, setDx] = useState(0);
  const [isSettling, setIsSettling] = useState(false);

  const [paused, setPaused] = useState(false);
  const resumeAtRef = useRef(0);

  const pauseTemporarily = (ms = 4500) => {
    resumeAtRef.current = Date.now() + ms;
  };

  const go = (i) => setIndex(((i % len) + len) % len);
  const next = () => setIndex((p) => (p + 1) % len);
  const prev = () => setIndex((p) => (p - 1 + len) % len);

  useEffect(() => {
    if (index >= len) setIndex(0);
  }, [len, index]);

  useEffect(() => {
    if (len <= 1) return;

    const t = setInterval(() => {
      const now = Date.now();
      if (paused || isSettling || now < resumeAtRef.current) return;
      next();
    }, 5000);

    return () => clearInterval(t);
  }, [len, paused, isSettling]);

  const scheduleDx = (value) => {
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = null;
      setDx(value);
    });
  };

  const settleTo = (targetDx, cb) => {
    setIsSettling(true);
    setDx(targetDx);
    setTimeout(() => {
      cb?.();
      setIsSettling(false);
    }, 230);
  };

  const onPointerDown = (e) => {
    if (len <= 1) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;

    dragging.current = true;
    lockAxis.current = null;

    startX.current = e.clientX;
    startY.current = e.clientY;
    startT.current = performance.now();

    lastX.current = e.clientX;
    lastT.current = performance.now();

    setPaused(true);
    pauseTemporarily();
    setDx(0);

    try {
      wrapRef.current?.setPointerCapture?.(e.pointerId);
    } catch {}
  };

  const onPointerMove = (e) => {
    if (!dragging.current) return;

    const rawDx = e.clientX - startX.current;
    const rawDy = e.clientY - startY.current;

    if (!lockAxis.current) {
      const ax = Math.abs(rawDx);
      const ay = Math.abs(rawDy);
      if (ay > ax && ay > 10) lockAxis.current = "y";
      else if (ax > 10) lockAxis.current = "x";
    }

    if (lockAxis.current === "y") {
      dragging.current = false;
      setPaused(false);
      setDx(0);
      return;
    }

    lastX.current = e.clientX;
    lastT.current = performance.now();

    const w = wrapRef.current?.clientWidth || 1;
    const clamped = clamp(rawDx, -w * 0.45, w * 0.45);
    scheduleDx(clamped);

    e.preventDefault?.();
  };

  const onPointerUpOrCancel = () => {
    if (!dragging.current) {
      setPaused(false);
      return;
    }

    dragging.current = false;

    const w = wrapRef.current?.clientWidth || 1;
    const threshold = Math.max(40, w * 0.12);

    const vx =
      (lastX.current - startX.current) /
      (performance.now() - startT.current || 1);

    const fast = Math.abs(vx) > 0.55;

    if (dx > threshold || (fast && dx > 12)) {
      settleTo(w * 0.18, () => {
        prev();
        setDx(0);
      });
    } else if (dx < -threshold || (fast && dx < -12)) {
      settleTo(-w * 0.18, () => {
        next();
        setDx(0);
      });
    } else {
      settleTo(0, () => setDx(0));
    }

    pauseTemporarily();
    setPaused(false);
  };

  const prevIdx = (index - 1 + len) % len;
  const nextIdx = (index + 1) % len;

  const parallax = clamp(-dx * 0.08, -14, 14);

  return (
    <section className="max-w-7xl mx-auto px-0 sm:px-4 -mt-12 sm:-mt-16">
      <div className="relative overflow-hidden rounded-none sm:rounded-2xl shadow-md">
        <div
          ref={wrapRef}
          className="relative h-[230px] xs:h-[260px] sm:aspect-[2.1/1] touch-pan-y bg-black"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUpOrCancel}
          onPointerCancel={onPointerUpOrCancel}
        >
          <div
            className="absolute inset-0 flex h-full w-[300%]"
            style={{
              transform: `translateX(calc(-33.3333% + ${dx}px))`,
              transition: isSettling
                ? "transform 230ms cubic-bezier(.16,1,.3,1)"
                : "none",
            }}
          >
            {[prevIdx, index, nextIdx].map((i, pos) => {
              const slide = slides[i];
              const isCenter = pos === 1;

              return (
                <div
                  key={`${slide.id}-${pos}`}
                  className="relative w-1/3 h-full overflow-hidden"
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    draggable={false}
                    className="w-full h-full object-cover select-none"
                    style={{
                      transform: isCenter
                        ? `translateX(${parallax}px) scale(1.02)`
                        : "scale(1.02)",
                      transition: isSettling
                        ? "transform 230ms cubic-bezier(.16,1,.3,1)"
                        : "none",
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

                  {isCenter && (
                    <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-10">
                      <h2 className="text-xl sm:text-4xl font-bold text-white mb-2 drop-shadow">
                        {slide.title}
                      </h2>
                      <p className="text-green-400 text-sm sm:text-xl font-medium drop-shadow">
                        {slide.subtitle}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Ultra thin pills */}
          {len > 1 && (
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    go(i);
                    pauseTemporarily();
                  }}
                  className={`relative overflow-hidden rounded-full transition-all duration-300 ${
                    i === index
                      ? "w-6 sm:w-8 h-[1px]"
                      : "w-3 sm:w-4 h-[1px] opacity-60"
                  }`}
                >
                  {i === index ? (
                    <span className="absolute inset-0 bg-gradient-to-r from-emerald-300 via-green-500 to-lime-300">
                      <span className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_linear_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                    </span>
                  ) : (
                    <span className="absolute inset-0 bg-white/70" />
                  )}
                </button>
              ))}
            </div>
          )}

          <style>{`
            @keyframes shimmer {
              0% { transform: translateX(-120%); }
              100% { transform: translateX(120%); }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
};

export default Hero;
