import React, { useEffect, useRef, useState } from "react";
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

  // Intersection observer (mobile friendly)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Autoplay logic
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

  const handleManualPlay = async () => {
    try {
      await videoRef.current.play();
      setAutoplayBlocked(false);
    } catch {}
  };

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

          {/* Responsive height */}
          <div className="relative w-full h-[52vw] sm:h-[38vw] lg:h-[320px] max-h-[360px]">

            {/* Poster blur while loading */}
            <div
              className={`absolute inset-0 transition-opacity duration-500 ${
                isReady ? "opacity-0" : "opacity-100"
              }`}
              style={{
                backgroundImage: "url(/nursery-poster.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            />

            {/* Video */}
            <video
              ref={videoRef}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                isReady ? "opacity-100" : "opacity-0"
              }`}
              src="/nursery.mp4"
              playsInline
              muted
              loop
              preload="metadata"
              onCanPlay={() => setIsReady(true)}
            />

            {/* Dark bottom fade */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />

            {/* Manual play overlay (if blocked) */}
            {autoplayBlocked && (
              <button
                onClick={handleManualPlay}
                className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
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

