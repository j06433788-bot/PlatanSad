import React, { useEffect, useRef, useState } from "react";
import { LayoutGrid, Play, Pause } from "lucide-react";
import Hero from "../components/Hero";
import ProductSection from "../components/ProductSection";
import CatalogModal from "../components/CatalogModal";

const HomePage = () => {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  // Video performance control
  const videoRef = useRef(null);
  const videoSectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Mobile UX controls
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDesktopControls, setIsDesktopControls] = useState(false);

  // Decide when to show native controls (sm+)
  useEffect(() => {
    // Tailwind sm breakpoint is 640px
    const mq = window.matchMedia("(min-width: 640px)");
    const apply = () => setIsDesktopControls(mq.matches);

    apply();
    if (mq.addEventListener) mq.addEventListener("change", apply);
    else mq.addListener(apply);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", apply);
      else mq.removeListener(apply);
    };
  }, []);

  // Observe visibility
  useEffect(() => {
    const el = videoSectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Autoplay when visible, pause when not
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = async () => {
      try {
        await video.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    };

    if (isVisible) {
      tryPlay();
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [isVisible]);

  // Pause when tab is hidden (mobile optimization)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
        setIsPlaying(false);
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  // Sync isPlaying with actual video state
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);

    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, []);

  // Toggle native controls on sm+ without duplicating video
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.controls = isDesktopControls;
  }, [isDesktopControls]);

  const togglePlay = async () => {
    const v = videoRef.current;
    if (!v) return;

    if (v.paused) {
      try {
        await v.play();
      } catch {}
    } else {
      v.pause();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <Hero />

      {/* Catalog Button */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 pt-6 pb-4">
        <button
          onClick={() => setIsCatalogOpen(true)}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2.5 sm:py-3 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98]"
        >
          <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6" />
          Каталог рослин
        </button>
      </div>

      {/* Products */}
      <ProductSection />

      {/* FULL WIDTH VIDEO (optimized for phones, single <video>) */}
      <section
        ref={videoSectionRef}
        className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mt-5 sm:mt-7"
      >
        <div className="w-screen bg-black">
          {/* phone-friendly height; desktop stays as you had */}
          <div className="relative w-screen h-[64vw] sm:h-[38vw] lg:h-[420px] max-h-[520px] overflow-hidden">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              src="/nursery.mp4"
              muted
              autoPlay
              loop
              playsInline
              preload="metadata"
            />

            {/* readability gradient */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            {/* Minimal label */}
            <div className="pointer-events-none absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
              <div className="bg-black/55 backdrop-blur-md px-3 py-1.5 rounded-xl ring-1 ring-white/15">
                <p className="text-[11px] sm:text-xs font-semibold text-white">
                  🌿 Відео з нашого розсадника PlatanSad
                </p>
              </div>
            </div>

            {/* Mobile play/pause (shown only when controls are hidden) */}
            {!isDesktopControls && (
              <div className="absolute bottom-3 right-3">
                <button
                  onClick={togglePlay}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 hover:bg-white/15 active:bg-white/10 text-white px-3.5 py-2.5 backdrop-blur-md ring-1 ring-white/20 shadow-sm transition"
                  aria-label={isPlaying ? "Пауза" : "Відтворити"}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  <span className="text-sm font-bold">
                    {isPlaying ? "Пауза" : "Play"}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Catalog Modal */}
      <CatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
      />
    </div>
  );
};

export default HomePage;

