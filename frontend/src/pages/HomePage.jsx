import React, { useEffect, useMemo, useRef, useState } from "react";
import { LayoutGrid, Play } from "lucide-react";
import Hero from "../components/Hero";
import ProductSection from "../components/ProductSection";
import CatalogModal from "../components/CatalogModal";

const HomePage = () => {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  // Video logic
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  // Premium micro effects
  const [scrollY, setScrollY] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  const videoSrc = useMemo(() => "/nursery.mp4", []);
  const posterSrc = useMemo(() => "/nursery-poster.jpg", []);

  // Respect reduced motion
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(!!mq?.matches);
    apply();
    mq?.addEventListener?.("change", apply);
    return () => mq?.removeEventListener?.("change", apply);
  }, []);

  // Visibility observer
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.45 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Scroll for micro-parallax (only when visible to reduce work)
  useEffect(() => {
    if (!isVisible || reduceMotion) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrollY(window.scrollY || 0));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [isVisible, reduceMotion]);

  // Autoplay / pause when in view
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = async () => {
      try {
        setAutoplayBlocked(false);
        await video.play();
      } catch {
        setAutoplayBlocked(true);
      }
    };

    if (isVisible) {
      playVideo();
    } else {
      video.pause();
    }
  }, [isVisible]);

  // Pause when tab goes background (mobile-friendly)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onVisibility = () => {
      if (document.hidden) video.pause();
      else if (isVisible) {
        // Try resume (may be blocked)
        video.play().catch(() => setAutoplayBlocked(true));
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [isVisible]);

  const handleManualPlay = async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      await v.play();
      setAutoplayBlocked(false);
    } catch {}
  };

  // Premium transform: subtle zoom + parallax translate
  const parallax = reduceMotion ? 0 : Math.max(-10, Math.min(10, (scrollY % 240) / 12 - 10));
  const scale = reduceMotion ? 1 : isVisible ? 1.03 : 1.0;

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <Hero />

      {/* COMPACT PREMIUM VIDEO BLOCK */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4 pt-4 sm:pt-6">
        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-2xl bg-black ring-1 ring-black/10 shadow-lg"
        >
          {/* Soft premium glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 left-1/2 h-56 w-[34rem] -translate-x-1/2 rounded-full bg-green-500/18 blur-3xl" />
            <div className="absolute -bottom-28 right-[-6rem] h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] via-transparent to-black/55" />
          </div>

          {/* Responsive height (compact) */}
          <div className="relative w-full h-[50vw] sm:h-[34vw] lg:h-[300px] max-h-[340px]">
            {/* Poster layer */}
            <div
              className={`absolute inset-0 transition-opacity duration-500 ${
                isReady ? "opacity-0" : "opacity-100"
              }`}
              style={{
                backgroundImage: `url(${posterSrc})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transform: reduceMotion ? "none" : `scale(1.06) translateY(${parallax * 0.4}px)`,
                filter: "blur(2px)",
              }}
            />

            {/* Video */}
            <div
              className="absolute inset-0"
              style={{
                transform: reduceMotion
                  ? "none"
                  : `scale(${scale}) translateY(${parallax}px)`,
                transition: reduceMotion ? "none" : "transform 700ms cubic-bezier(.2,.8,.2,1)",
                willChange: "transform",
              }}
            >
              <video
                ref={videoRef}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  isReady ? "opacity-100" : "opacity-0"
                }`}
                src={videoSrc}
                poster={posterSrc}
                playsInline
                muted
                loop
                preload="metadata"
                onCanPlay={() => setIsReady(true)}
              />
            </div>

            {/* Bottom fade */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />

            {/* Manual play overlay (if blocked) */}
            {autoplayBlocked && (
              <button
                onClick={handleManualPlay}
                className="absolute inset-0 flex items-center justify-center bg-black/35 backdrop-blur-sm"
                aria-label="Відтворити відео"
              >
                <div className="flex items-center gap-2 bg-black/70 text-white px-4 py-2 rounded-xl ring-1 ring-white/20">
                  <Play className="w-5 h-5" />
                  <span className="text-sm font-semibold">Відтворити</span>
                </div>
              </button>
            )}

            {/* Minimal label */}
            <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3">
              <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl ring-1 ring-white/15">
                <p className="text-[11px] sm:text-xs font-semibold text-white">
                  🌿 Відео з нашого розсадника PlatanSad
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATALOG BUTTON */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 pt-5 pb-4">
        <button
          onClick={() => setIsCatalogOpen(true)}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2.5 sm:py-3 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98]"
          data-testid="catalog-main-btn"
        >
          <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6" />
          Каталог рослин
        </button>
      </div>

      {/* PRODUCTS */}
      <ProductSection />

      {/* MODAL */}
      <CatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
      />
    </div>
  );
};

export default HomePage;
