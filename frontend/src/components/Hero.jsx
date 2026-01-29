import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSettings } from "../context/SettingsContext";

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

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);

  const resumeAtRef = useRef(0);
  const containerRef = useRef(null);

  // swipe refs
  const startX = useRef(0);
  const startY = useRef(0);
  const deltaX = useRef(0);
  const dragging = useRef(false);

  const next = () => setCurrentSlide((p) => (p + 1) % slides.length);
  const prev = () => setCurrentSlide((p) => (p - 1 + slides.length) % slides.length);

  // Safety: if slides change
  useEffect(() => {
    if (currentSlide >= slides.length) setCurrentSlide(0);
  }, [slides.length, currentSlide]);

  // Auto-rotate with pause on interaction
  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      const now = Date.now();
      if (isInteracting) return;
      if (now < resumeAtRef.current) return;
      next();
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length, isInteracting]);

  const pauseTemporarily = (ms = 4500) => {
    resumeAtRef.current = Date.now() + ms;
  };

  // Pointer events for swipe (works on iOS/Android + desktop)
  const onPointerDown = (e) => {
    // Only primary pointer
    if (e.pointerType === "mouse" && e.button !== 0) return;

    dragging.current = true;
    setIsInteracting(true);
    pauseTemporarily(4500);

    startX.current = e.clientX;
    startY.current = e.clientY;
    deltaX.current = 0;
  };

  const onPointerMove = (e) => {
    if (!dragging.current) return;

    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;

    // If user is clearly scrolling vertically, don't treat as swipe
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) {
      dragging.current = false;
      setIsInteracting(false);
      return;
    }

    deltaX.current = dx;

    // prevent browser back-swipe issues on iOS when inside element
    // (safe only while interacting)
    if (e.cancelable) e.preventDefault?.();
  };

  const onPointerUpOrCancel = () => {
    if (!dragging.current) {
      setIsInteracting(false);
      return;
    }

    dragging.current = false;

    const el = containerRef.current;
    const width = el?.clientWidth || 1;

    // Threshold: 10% of width or min 40px
    const threshold = Math.max(40, width * 0.1);

    if (deltaX.current > threshold) {
      prev();
    } else if (deltaX.current < -threshold) {
      next();
    }

    // keep paused a bit after releasing
    pauseTemporarily(4500);
    setIsInteracting(false);
  };

  return (
    <section className="max-w-7xl mx-auto px-0 sm:px-4 py-0 sm:py-4">
      <div className="relative overflow-hidden rounded-none sm:rounded-2xl shadow-md">
        {/* Slides wrapper */}
        <div
          ref={containerRef}
          className="relative h-[180px] xs:h-[200px] sm:h-auto sm:aspect-[2.5/1] touch-pan-y"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUpOrCancel}
          onPointerCancel={onPointerUpOrCancel}
          role="region"
          aria-label="Головний слайдер"
        >
          {slides.map((slide, index) => (
            <div
              key={slide.id ?? index}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                draggable={false}
              />

              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-center px-3 sm:px-10 md:px-16">
                <h2 className="text-lg xs:text-xl sm:text-4xl md:text-5xl font-bold text-white mb-1 sm:mb-3 leading-tight drop-shadow">
                  {slide.title}
                </h2>
                <p className="text-green-400 text-xs xs:text-sm sm:text-xl md:text-2xl font-medium drop-shadow">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          ))}

          {/* subtle hint for swipe on mobile */}
          {slides.length > 1 && (
            <div className="pointer-events-none absolute inset-x-0 top-2 flex justify-center z-20">
              <div className="rounded-full bg-black/25 px-2.5 py-1 text-[10px] text-white/80 backdrop-blur sm:hidden">
                Свайпніть ← →
              </div>
            </div>
          )}
        </div>

        {/* Indicators (smaller) */}
        {slides.length > 1 && (
          <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index);
                  pauseTemporarily(4500);
                }}
                className={`rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-green-500 w-7 sm:w-10 h-1.5 sm:h-2"
                    : "bg-white/70 hover:bg-white w-2.5 sm:w-3 h-1.5 sm:h-2"
                }`}
                aria-label={`Слайд ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;

