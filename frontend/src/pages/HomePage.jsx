import React, { useEffect, useRef, useState } from "react";
import { LayoutGrid } from "lucide-react";
import Hero from "../components/Hero";
import ProductSection from "../components/ProductSection";
import CatalogModal from "../components/CatalogModal";

const HomePage = () => {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  // Video performance control
  const videoRef = useRef(null);
  const videoSectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

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

    if (isVisible) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isVisible]);

  // Pause when tab is hidden (mobile optimization)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onVisibilityChange = () => {
      if (document.hidden) video.pause();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
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
        >
          <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6" />
          Каталог рослин
        </button>
      </div>

      {/* Products */}
      <ProductSection />

      {/* FULL WIDTH AUTOPLAY VIDEO (muted) */}
      <section
        ref={videoSectionRef}
        className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mt-5 sm:mt-7"
      >
        <div className="w-screen bg-black">
          <div className="relative w-screen h-[54vw] sm:h-[38vw] lg:h-[420px] max-h-[520px] overflow-hidden">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              src="/nursery.mp4"
              muted
              autoPlay
              loop
              playsInline
              controls
              preload="metadata"
            />

            {/* Minimal label */}
            <div className="pointer-events-none absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
              <div className="bg-black/55 backdrop-blur-md px-3 py-1.5 rounded-xl ring-1 ring-white/15">
                <p className="text-[11px] sm:text-xs font-semibold text-white">
                  🌿 Відео з нашого розсадника PlatanSad
                </p>
              </div>
            </div>
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
