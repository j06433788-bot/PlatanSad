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
  const dragging = useRef(false);
  const lockAxis = useRef(null);

  const startX = useRef(0);
  const startY = useRef(0);
  const lastX = useRef(0);
  const startT = useRef(0);

  const [dx, setDx] = useState(0);
  const [isSettling, setIsSettling] = useState(false);

  const resumeAt = useRef(0);
  const [paused, setPaused] = useState(false);

  const pauseTemporarily = (ms = 4500) => {
    resumeAt.current = Date.now() + ms;
  };

  const next = () => setIndex((p) => (p + 1) % len);
  const prev = () => setIndex((p) => (p - 1 + len) % len);
  const go = (i) => setIndex(((i % len) + len) % len);

  useEffect(() => {
    if (index >= len) setIndex(0);
  }, [len, index]);

  // Auto slide
  useEffect(() => {
    if (len <= 1) return;

    const t = setInterval(() => {
      if (paused) return;
      if (isSettling) return;
      if (Date.now() < resumeAt.current) return;
      next();
    }, 5000);

    return () => clearInterval(t);
  }, [paused, isSettling, len]);

  const onPointerDown = (e) => {
    if (len <= 1) return;
    dragging.current = true;
    lockAxis.current = null;

    startX.current = e.clientX;
    startY.current = e.clientY;
    lastX.current = e.clientX;
    startT.current = performance.now();

    setPaused(true);
    pauseTemporarily();
  };

  const onPointerMove = (e) => {
    if (!dragging.current) return;

    const dxRaw = e.clientX - startX.current;
    const dyRaw = e.clientY - startY.current;

    if (!lockAxis.current) {
      if (Math.abs(dyRaw) > Math.abs(dxRaw) && Math.abs(dyRaw) > 10) {
        lockAxis.current = "y";
      } else if (Math.abs(dxRaw) > 10) {
        lockAxis.current = "x";
      }
    }

    if (lockAxis.current === "y") {
      dragging.current = false;
      setPaused(false);
      setDx(0);
      return;
    }

    lastX.current = e.clientX;

    const w = wrapRef.current?.clientWidth || 1;
    setDx(clamp(dxRaw, -w * 0.45, w * 0.45));

    if (e.cancelable) e.preventDefault();
  };

  const settle = (value, cb) => {
    setIsSettling(true);
    setDx(value);
    setTimeout(() => {
      cb?.();
      setDx(0);
      setIsSettling(false);
    }, 220);
  };

  const onPointerUp = () => {
    if (!dragging.current) {
      setPaused(false);
      return;
    }

    dragging.current = false;

    const w = wrapRef.current?.clientWidth || 1;
    const threshold = Math.max(40, w * 0.12);

    if (dx > threshold) {
      settle(w * 0.18, prev);
    } else if (dx < -threshold) {
      settle(-w * 0.18, next);
    } else {
      settle(0);
    }

    pauseTemporarily();
    setPaused(false);
  };

  const prevIdx = (index - 1 + len) % len;
  const nextIdx = (index + 1) % len;

  const parallax = clamp(-dx * 0.08, -14, 14);

  return (
    <section className="max-w-7xl mx-auto px-0 sm:px-4 py-0 sm:py-4">
      <div className="relative overflow-hidden rounded-none sm:rounded-2xl shadow-md">

        <div
          ref={wrapRef}
          className="relative h-[180px] xs:h-[200px] sm:h-auto sm:aspect-[2.5/1] bg-black touch-pan-y"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >

          <div
            className="absolute inset-0 flex w-[300%]"
            style={{
              transform: `translateX(calc(-33.3333% + ${dx}px))`,
              transition: isSettling ? "transform 220ms cubic-bezier(.16,1,.3,1)" : "none",
            }}
          >
            {[prevIdx, index, nextIdx].map((i, pos) => {
              const slide = slides[i];
              const center = pos === 1;

              return (
                <div key={i} className="relative w-1/3 h-full overflow-hidden">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    draggable={false}
                    className="w-full h-full object-cover select-none"
                    style={{
                      transform: center
                        ? `translateX(${parallax}px) scale(1.03)`
                        : "scale(1.03)",
                      transition: isSettling ? "transform 220ms cubic-bezier(.16,1,.3,1)" : "none",
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

                  {center && (
                    <div className="absolute inset-0 flex flex-col justify-center px-3 sm:px-10">
                      <h2 className="text-lg sm:text-4xl font-bold text-white drop-shadow">
                        {slide.title}
                      </h2>
                      <p className="text-green-400 text-xs sm:text-xl font-medium drop-shadow">
                        {slide.subtitle}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* PURE DOTS */}
          {len > 1 && (
            <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    go(i);
                    pauseTemporarily();
                  }}
                  className={`rounded-full transition-all duration-200 ${
                    i === index
                      ? "w-[7px] h-[7px] bg-green-500 shadow-[0_0_8px_rgba(34,197,94,.7)]"
                      : "w-[5px] h-[5px] bg-white/60 hover:bg-white"
                  }`}
                  aria-label={`Slide ${i + 1}`}
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
