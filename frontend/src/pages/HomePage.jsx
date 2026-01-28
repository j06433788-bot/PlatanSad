import React, { useEffect, useMemo, useRef, useState } from "react";
import { LayoutGrid, Leaf, ShieldCheck, Truck, Play, Pause } from "lucide-react";
import Hero from "../components/Hero";
import ProductSection from "../components/ProductSection";
import CatalogModal from "../components/CatalogModal";

const HomePage = () => {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  // Video UX states
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [isInView, setIsInView] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  const videoSrc = useMemo(() => "/nursery.mp4", []);
  const posterSrc = useMemo(() => "/nursery-poster.jpg", []);

  // Observe visibility (autoplay only when visible)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsInView(!!entry?.isIntersecting);
      },
      { root: null, threshold: 0.35 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Autoplay/pause logic
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const tryPlay = async () => {
      try {
        setAutoplayBlocked(false);
        await v.play();
        setIsPlaying(true);
      } catch {
        // Autoplay blocked (common on mobile until user gesture)
        setAutoplayBlocked(true);
        setIsPlaying(false);
      }
    };

    if (isInView) {
      // If in view: attempt autoplay (muted+playsInline for iOS)
      tryPlay();
    } else {
      // Out of view: pause to save battery/data
      v.pause();
      setIsPlaying(false);
    }
  }, [isInView]);

  // Track play/pause
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

  const handleUserPlay = async () => {
    const v = videoRef.current;
    if (!v) return;

    try {
      setAutoplayBlocked(false);
      await v.play();
      setIsPlaying(true);
    } catch {
      setAutoplayBlocked(true);
      setIsPlaying(false);
    }
  };

  const handleTogglePlay = async () => {
    const v = videoRef.current;
    if (!v) return;

    if (v.paused) {
      await handleUserPlay();
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <Hero />

      {/* Premium Video Section */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4 pt-5 sm:pt-8">
        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-3xl bg-[#070b09] text-white ring-1 ring-black/10 shadow-[0_22px_90px_rgba(0,0,0,0.18)]"
        >
          {/* Soft premium glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-36 left-1/2 h-80 w-[44rem] -translate-x-1/2 rounded-full bg-green-500/20 blur-3xl" />
            <div className="absolute -bottom-44 right-[-8rem] h-96 w-96 rounded-full bg-emerald-300/10 blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] via-transparent to-black/55" />
          </div>

          <div className="relative grid gap-4 p-4 sm:p-6 lg:grid-cols-12 lg:gap-8 lg:p-8">
            {/* Text */}
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2 ring-1 ring-white/15">
                <Leaf className="h-4 w-4 text-green-200" />
                <span className="text-xs font-semibold text-white/85">
                  Відео з нашого розсадника
                </span>
              </div>

              <h2 className="mt-4 text-xl sm:text-2xl font-extrabold tracking-tight">
                PlatanSad — приватний розсадник декоративних рослин 🌿
              </h2>

              <p className="mt-3 text-sm sm:text-base leading-relaxed text-white/80">
                Ми вирощуємо та підбираємо рослини під вашу ділянку, підказуємо догляд
                і відправляємо замовлення по Україні з надійним пакуванням.
                Подивіться коротке відео — тут видно якість та підхід у деталях.
              </p>

              <div className="mt-4 grid gap-2">
                <div className="flex items-center gap-2 rounded-2xl bg-white/8 px-3 py-2 ring-1 ring-white/10">
                  <ShieldCheck className="h-4 w-4 text-green-200" />
                  <span className="text-xs sm:text-sm text-white/85">
                    Ставка на приживлюваність та охайний посадковий матеріал
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl bg-white/8 px-3 py-2 ring-1 ring-white/10">
                  <Truck className="h-4 w-4 text-green-200" />
                  <span className="text-xs sm:text-sm text-white/85">
                    Відправка по Україні • акуратне пакування
                  </span>
                </div>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => setIsCatalogOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-3 text-sm font-bold text-white shadow-[0_18px_50px_rgba(34,197,94,0.18)] ring-1 ring-green-400/20 transition hover:bg-green-600/90 active:scale-[0.99]"
                >
                  <LayoutGrid className="h-5 w-5" />
                  Відкрити каталог
                </button>

                <button
                  onClick={() => navigateToContactsSafely()}
                  className="inline-flex items-center justify-center rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white/90 ring-1 ring-white/15 transition hover:bg-white/15 active:scale-[0.99]"
                >
                  Контакти
                </button>
              </div>

              <p className="mt-3 text-[11px] sm:text-xs text-white/55">
                Порада: якщо автозапуск не спрацює — натисніть “Відтворити”.
              </p>
            </div>

            {/* Video */}
            <div className="lg:col-span-7">
              <div className="relative overflow-hidden rounded-3xl ring-1 ring-white/15 bg-black/30">
                {/* Mobile-first nice height */}
                <div className="relative w-full h-[58vw] sm:h-[44vw] lg:h-[420px] max-h-[520px]">
                  {/* Poster layer (nice while loading) */}
                  <div
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      isReady ? "opacity-0" : "opacity-100"
                    }`}
                    style={{
                      backgroundImage: `url(${posterSrc})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />

                  <video
                    ref={videoRef}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                      isReady ? "opacity-100" : "opacity-0"
                    }`}
                    src={videoSrc}
                    // If poster doesn't exist, it's fine; browser will ignore
                    poster={posterSrc}
                    playsInline
                    muted
                    loop
                    preload="metadata"
                    controls={false}
                    onCanPlay={() => setIsReady(true)}
                  />

                  {/* Bottom fade for UI */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* Play overlay if autoplay blocked or paused */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {(autoplayBlocked || !isPlaying) && (
                      <button
                        onClick={handleUserPlay}
                        className="inline-flex items-center gap-2 rounded-2xl bg-black/55 px-5 py-3 text-sm font-bold text-white ring-1 ring-white/20 backdrop-blur-md transition hover:bg-black/65 active:scale-[0.99]"
                        aria-label="Відтворити відео"
                      >
                        <Play className="h-5 w-5" />
                        Відтворити
                      </button>
                    )}
                  </div>

                  {/* Top-right mini control */}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={handleTogglePlay}
                      className="inline-flex items-center justify-center rounded-2xl bg-white/10 p-2.5 ring-1 ring-white/15 backdrop-blur-md transition hover:bg-white/15 active:scale-[0.98]"
                      aria-label={isPlaying ? "Пауза" : "Відтворити"}
                      title={isPlaying ? "Пауза" : "Відтворити"}
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5 text-white" />
                      ) : (
                        <Play className="h-5 w-5 text-white" />
                      )}
                    </button>
                  </div>

                  {/* Badge */}
                  <div className="absolute bottom-3 left-3 right-3 sm:right-auto">
                    <div className="inline-flex w-full sm:w-auto items-center justify-between gap-3 rounded-2xl bg-black/55 px-4 py-3 ring-1 ring-white/15 backdrop-blur-md">
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-white">
                          Розсадник PlatanSad
                        </p>
                        <p className="mt-0.5 text-[11px] sm:text-xs text-white/75">
                          Якість • Догляд • Відправка по Україні
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-green-500/15 px-3 py-1 text-[11px] font-semibold text-green-200 ring-1 ring-green-400/20">
                        LIVE
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-3 text-xs sm:text-sm text-black/60">
                Якщо відео не стартує автоматично — це нормально: деякі браузери вимагають
                натискання. Кнопка “Відтворити” вирішує це.
              </p>
            </div>
          </div>
        </div>
      </section>

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

      {/* Catalog Modal */}
      <CatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
      />
    </div>
  );
};

// Small helper: scroll to footer/contacts section if exists, else to bottom
function navigateToContactsSafely() {
  const el =
    document.querySelector("#contacts") ||
    document.querySelector("[data-contacts]") ||
    document.querySelector("footer");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  else window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}

export default HomePage;
