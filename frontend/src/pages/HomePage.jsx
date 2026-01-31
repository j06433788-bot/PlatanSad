import React, { useEffect, useRef, useState } from "react";
import { LayoutGrid, Play, Pause } from "lucide-react";
import Hero from "../components/Hero";
import ProductSection from "../components/ProductSection";
import CatalogModal from "../components/CatalogModal";

const VIDEO_URL = "/nursery.mp4"; // файл має бути в /var/www/PlatanSad/frontend/build/nursery.mp4

const HomePage = () => {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  // Video performance control
  const videoRef = useRef(null);
  const videoSectionRef = useRef(null);

  const [isVisible, setIsVisible] = useState(true); // safe default
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);

  // Mobile UX controls
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDesktopControls, setIsDesktopControls] = useState(false);

  const [videoFailed, setVideoFailed] = useState(false);

  // Detect desktop controls (>=640px) - safe for old Safari
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mq = window.matchMedia("(min-width: 640px)");
    const apply = () => setIsDesktopControls(!!mq.matches);

    apply();

    if (mq.addEventListener) {
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }

    if (mq.addListener) {
      mq.addListener(apply);
      return () => mq.removeListener(apply);
    }
  }, []);

  // Observe visibility (safe fallback if IntersectionObserver missing)
  useEffect(() => {
    const el = videoSectionRef.current;
    if (!el) return;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(!!entry?.isIntersecting),
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Animate once when first visible
  useEffect(() => {
    if (isVisible) setHasAnimatedIn(true);
  }, [isVisible]);

  // Sync state with video
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

  // Enable native controls on desktop
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.controls = !!isDesktopControls;
  }, [isDesktopControls]);

  // Autoplay when visible
  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoFailed) return;

    const tryPlay = async () => {
      try {
        await video.play();
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
  }, [isVisible, videoFailed]);

  // Pause when tab hidden
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

      {/* FULL WIDTH VIDEO */}
      <section
        ref={videoSectionRef}
        className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mt-5 sm:mt-7"
      >
        <div
          className={[
            "w-screen bg-black transform-gpu",
            "transition-[opacity,transform] duration-700 ease-out",
            hasAnimatedIn
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-[1.02] translate-y-3",
          ].join(" ")}
        >
          <div className="relative w-screen h-[68vw] sm:h-[40vw] lg:h-[420px] max-h-[520px] overflow-hidden">
            {!videoFailed ? (
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                src={VIDEO_URL}
                muted
                autoPlay
                loop
                playsInline
                preload="metadata"
                onError={() => {
                  setVideoFailed(true);
                  console.log("VIDEO ERROR: cannot load", VIDEO_URL);
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <div className="text-center px-4">
                  <div className="text-white/90 font-bold text-base sm:text-lg">
                    🌿 Відео тимчасово недоступне
                  </div>
                  <div className="text-white/60 text-sm mt-1">
                    Перевір файл{" "}
                    <span className="font-mono">{VIDEO_URL}</span> на сервері
                  </div>
                </div>
              </div>
            )}

            {/* Gradient overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            {/* Label */}
            <div className="pointer-events-none absolute bottom-2 left-2 sm:bottom-3 sm:left-3">
              <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg ring-1 ring-white/10">
                <p className="text-[10px] sm:text-[11px] font-medium text-white">
                  🌿 Відео з нашого розсадника
                </p>
              </div>
            </div>

            {/* Mobile Play Button */}
            {!isDesktopControls && !videoFailed && (
              <div className="absolute bottom-3 right-3">
                <button
                  onClick={togglePlay}
                  className="flex items-center gap-2 rounded-2xl bg-white/10 text-white px-3.5 py-2.5 backdrop-blur-md ring-1 ring-white/20 shadow transition active:scale-[0.98]"
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
