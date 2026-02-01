import React, { useEffect, useRef, useState } from "react";
import { LayoutGrid, Play, Pause, ArrowRight } from "lucide-react";
import Hero from "../components/Hero";
import ProductSection from "../components/ProductSection";
import CatalogModal from "../components/CatalogModal";

const VIDEO_URL = "/nursery.mp4";
const DESKTOP_BANNER_IMAGE =
  "https://eu-central-1.linodeobjects.com/list/production/412397/gallery/big/66068c720d2d0.jpg?1316609607";

const HomePage = () => {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  // VIDEO MOBILE
  const videoRef = useRef(null);
  const videoSectionRef = useRef(null);

  const [isVisible, setIsVisible] = useState(true);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const el = videoSectionRef.current;
    if (!el || typeof window === "undefined" || !("IntersectionObserver" in window))
      return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(!!entry?.isIntersecting),
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) setHasAnimatedIn(true);
  }, [isVisible]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoFailed) return;

    if (isVisible) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isVisible, videoFailed]);

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

  const togglePlay = async () => {
    const v = videoRef.current;
    if (!v) return;

    if (v.paused) {
      await v.play().catch(() => {});
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

      {/* DESKTOP 1:1 BANNER */}
      <section className="hidden lg:block max-w-7xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* BANNER */}
          <div className="col-span-12 lg:col-span-5">
            <div className="relative w-full aspect-square overflow-hidden rounded-3xl shadow-xl ring-1 ring-black/5">
              {/* image */}
              <img
                src={DESKTOP_BANNER_IMAGE}
                alt="PlatanSad розсадник"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />

              {/* overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent" />

              {/* content */}
              <div className="absolute inset-0 p-6 xl:p-8 flex flex-col justify-end">
                <div className="inline-flex items-center gap-2 self-start rounded-full bg-white/10 text-white px-3 py-1.5 backdrop-blur ring-1 ring-white/15">
                  <span className="text-xs font-semibold tracking-wide">
                    🌿 PlatanSad
                  </span>
                  <span className="text-xs text-white/80">розсадник</span>
                </div>

                <h3 className="mt-4 text-white text-2xl xl:text-3xl font-extrabold leading-tight">
                  Вирощено з любов’ю
                </h3>

                <p className="mt-2 text-white/85 text-sm xl:text-base leading-relaxed max-w-md">
                  Хвойні, нівакі та вічнозелені рослини — готові для твого саду.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={() => setIsCatalogOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-500 hover:bg-green-600 text-white px-5 py-3 font-bold shadow-lg active:scale-[0.98] transition"
                  >
                    Відкрити каталог
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href="/about"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 hover:bg-white/15 text-white px-5 py-3 font-bold ring-1 ring-white/15 backdrop-blur active:scale-[0.98] transition"
                  >
                    Про нас
                  </a>
                </div>

                <div className="pointer-events-none absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-white/10 blur-3xl" />
              </div>
            </div>
          </div>

          {/* INFO BLOCK */}
          <div className="col-span-12 lg:col-span-7">
            <div className="rounded-3xl border border-gray-100 shadow-sm p-6 xl:p-8 bg-white">
              <h4 className="text-xl xl:text-2xl font-extrabold text-gray-900">
                Преміум якість для вашого саду
              </h4>
              <p className="mt-2 text-gray-600 leading-relaxed">
                Наші рослини — це результат ретельного догляду та відбору.
                Підкажемо по догляду і підбору для твоїх умов.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <div className="text-sm font-bold text-gray-900">100+ видів</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Хвойні, нівакі, вічнозелені
                  </div>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <div className="text-sm font-bold text-gray-900">Нівакі</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Формовані дерева
                  </div>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <div className="text-sm font-bold text-gray-900">Пакування</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Акуратно та надійно
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setIsCatalogOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-900 hover:bg-black text-white px-5 py-3 font-bold active:scale-[0.98] transition"
                >
                  Перейти до каталогу
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE ONLY VIDEO */}
      <section
        ref={videoSectionRef}
        className="lg:hidden w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mt-5 sm:mt-7"
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
          <div className="relative w-screen h-[68vw] sm:h-[40vw] max-h-[520px] overflow-hidden">
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
                onError={() => setVideoFailed(true)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
                🌿 Відео тимчасово недоступне
              </div>
            )}

            {/* overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            <div className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded-lg">
              🌿 Відео з нашого розсадника
            </div>

            {!videoFailed && (
              <button
                onClick={togglePlay}
                className="absolute bottom-3 right-3 flex items-center gap-2 bg-white/15 text-white px-3.5 py-2.5 rounded-2xl backdrop-blur ring-1 ring-white/20"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? "Пауза" : "Play"}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* CATALOG MODAL */}
      <CatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
      />
    </div>
  );
};

export default HomePage;
