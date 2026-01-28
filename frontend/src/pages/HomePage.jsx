import React, { useEffect, useRef, useState } from "react";
import { LayoutGrid } from "lucide-react";
import Hero from "../components/Hero";
import ProductSection from "../components/ProductSection";
import CatalogModal from "../components/CatalogModal";

const HomePage = () => {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  // Video performance (pause when not visible)
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

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

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // If out of view -> pause (saves battery/CPU)
    if (!isVisible) v.pause();
  }, [isVisible]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Pause if tab goes background (mobile)
    const onVis = () => {
      if (document.hidden) v.pause();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <Hero />

      {/* Catalog Button - Opens modal */}
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

      {/* Product Tabs Section (Хіти / Розпродаж / Новинки) */}
      <ProductSection />

      {/* FULL-WIDTH VIDEO (UNDER PRODUCTS) */}
      <section ref={sectionRef} className="w-full pt-5 sm:pt-7">
        {/* edge-to-edge container */}
        <div className="relative w-full overflow-hidden bg-black">
          {/* compact height but wide */}
          <div className="relative w-full h-[58vw] sm:h-[40vw] lg:h-[420px] max-h-[520px]">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              src="/nursery.mp4"
              playsInline
              // IMPORTANT: sound enabled (no muted)
              controls
              preload="metadata"
            />
            {/* small minimal label */}
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
              <div className="bg-black/55 backdrop-blur-md px-3 py-1.5 rounded-xl ring-1 ring-white/15">
                <p className="text-[11px] sm:text-xs font-semibold text-white">
                  🌿 Відео з нашого розсадника PlatanSad
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ultra small description */}
        <div className="px-3 sm:px-4 pt-2">
          <p className="text-[11px] sm:text-xs text-black/55">
            Коротке відео з нашого розсадника — реальні рослини та якість пакування.
          </p>
        </div>
      </section>

      {/* Catalog Modal */}
      <CatalogModal isOpen={isCatalogOpen} onClose={() => setIsCatalogOpen(false)} />
    </div>
  );
};

export default HomePage;
