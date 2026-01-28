import React, { useEffect, useRef, useState } from "react";
import { LayoutGrid } from "lucide-react";
import Hero from "../components/Hero";
import ProductSection from "../components/ProductSection";
import CatalogModal from "../components/CatalogModal";

const HomePage = () => {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  // Video optimization
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Observe visibility (pause when not visible)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.35 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Pause video if out of view
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (!isVisible && !v.paused) {
      v.pause();
    }
  }, [isVisible]);

  // Pause when tab/app goes background (mobile friendly)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onVis = () => {
      if (document.hidden) v.pause();
    };

    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <Hero />

      {/* Catalog Button */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 pt-6 pb-4">
        <button
          onClick={() => setIsCatalogOpen(true)}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2.5 sm:py-3 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-md hover:shadow-lg active:scale-[0.98]"
          data-testid="catalog-main-btn"
        >
          <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6" />
          <span>Каталог рослин</span>
        </button>
      </div>

      {/* Products */}
      <ProductSection />

      {/* FULL-BLEED VIDEO (UNDER PRODUCTS) */}
      <section ref={sectionRef} className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mt-5 sm:mt-7">
        {/* This wrapper forces true edge-to-edge even inside centered layouts */}
        <div className="w-screen bg-black">
          <div className="relative w-screen h-[62vw] sm:h-[42vw] lg:h-[520px] max-h-[560px] overflow-hidden">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              src="/nursery.mp4"
              playsInline
              controls
              preload="metadata"
            />
            {/* minimal label on top of video */}
            <div className="pointer-events-none absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
              <div className="bg-black/55 backdrop-blur-md px-3 py-1.5 rounded-xl ring-1 ring-white/15">
                <p className="text-[11px] sm:text-xs font-semibold text-white">
                  🌿 Відео з нашого розсадника PlatanSad
                </p>
              </div>
            </div>
          </div>

          {/* tiny description under full-width video, also full-bleed */}
          <div className="w-screen px-3 sm:px-4 py-2 bg-white">
            <p className="text-[11px] sm:text-xs text-black/55">
              Коротке відео з нашого розсадника — реальні рослини та якість пакування.
            </p>
          </div>
        </div>
      </section>

      {/* Catalog Modal */}
      <CatalogModal isOpen={isCatalogOpen} onClose={() => setIsCatalogOpen(false)} />
    </div>
  );
};

export default HomePage;
