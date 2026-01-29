import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutGrid,
  Sparkles,
  ShieldCheck,
  Truck,
  Leaf,
  Play,
  Pause,
  VolumeX,
} from "lucide-react";
import Hero from "../components/Hero";
import ProductSection from "../components/ProductSection";
import CatalogModal from "../components/CatalogModal";

const HomePage = () => {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  // Video performance control
  const videoRef = useRef(null);
  const videoSectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // UX state for video (mobile-friendly)
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasUserGesture, setHasUserGesture] = useState(false);

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
      // Autoplay often works when muted; still can fail on some devices.
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

  // Keep isPlaying in sync if user uses native controls (desktop)
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

  const openCatalog = () => setIsCatalogOpen(true);
  const closeCatalog = () => setIsCatalogOpen(false);

  const perks = useMemo(
    () => [
      {
        icon: ShieldCheck,
        title: "Якість та приживлюваність",
        text: "Дбайливий догляд у розсаднику та відбір сильних рослин.",
      },
      {
        icon: Truck,
        title: "Зручна доставка",
        text: "Акуратне пакування, щоб рослини доїхали цілими.",
      },
      {
        icon: Leaf,
        title: "Професійні поради",
        text: "Підкажемо як посадити та доглядати саме під ваші умови.",
      },
    ],
    []
  );

  const toggleVideo = async () => {
    const video = videoRef.current;
    if (!video) return;

    setHasUserGesture(true);

    if (video.paused) {
      try {
        await video.play();
        setIsPlaying(true);
      } catch {
        // ignore
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Subtle modern background (safe for any Hero) */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-green-200/40 blur-3xl" />
        <div className="absolute top-[30vh] -right-24 h-[520px] w-[520px] rounded-full bg-emerald-200/35 blur-3xl" />
        <div className="absolute bottom-[-120px] left-[-120px] h-[560px] w-[560px] rounded-full bg-lime-200/30 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-white/70" />
      </div>

      {/* Hero */}
      <Hero />

      {/* Content container */}
      <main className="relative">
        {/* Primary CTA block */}
        <section className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 pt-5 sm:pt-7">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-black/5 bg-white/70 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 via-emerald-600/8 to-lime-500/10" />
            <div className="relative p-4 sm:p-6 lg:p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-1 text-[12px] sm:text-xs font-semibold text-black/70">
                    <Sparkles className="h-4 w-4" />
                    PlatanSad • приватний розсадник
                  </div>
                  <h2 className="mt-3 text-lg sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-black">
                    Обирайте рослини легко — каталог, підбір і консультація
                  </h2>
                  <p className="mt-2 text-sm sm:text-base text-black/70 leading-relaxed max-w-2xl">
                    Зробили сторінку максимально зручною для смартфонів: великі
                    клікабельні зони, правильні відступи, сучасні картки та
                    “липка” кнопка каталогу.
                  </p>
                </div>

                {/* Desktop helper badge */}
                <div className="hidden md:flex shrink-0 items-center rounded-2xl border border-black/5 bg-white/70 px-4 py-3 shadow-sm">
                  <div className="text-right">
                    <div className="text-xs font-semibold text-black/60">
                      Швидкий старт
                    </div>
                    <div className="text-sm font-bold text-black">
                      Відкрийте каталог нижче
                    </div>
                  </div>
                </div>
              </div>

              {/* Catalog Button (full width on mobile, compact on desktop) */}
              <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={openCatalog}
                  className="w-full sm:w-auto sm:min-w-[260px] bg-green-600 hover:bg-green-700 text-white py-3.5 sm:py-3.5 rounded-2xl font-extrabold text-base sm:text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_12px_26px_rgba(22,163,74,0.25)] hover:shadow-[0_14px_30px_rgba(22,163,74,0.32)] active:scale-[0.99] focus:outline-none focus-visible:ring-4 focus-visible:ring-green-500/30"
                >
                  <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6" />
                  Каталог рослин
                </button>

                <div className="w-full grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="rounded-2xl border border-black/5 bg-white/70 px-3 py-3 sm:px-4 sm:py-3.5 text-center">
                    <div className="text-[11px] sm:text-xs font-semibold text-black/60">
                      Сезон
                    </div>
                    <div className="mt-0.5 text-sm sm:text-base font-extrabold text-black">
                      Активний
                    </div>
                  </div>
                  <div className="rounded-2xl border border-black/5 bg-white/70 px-3 py-3 sm:px-4 sm:py-3.5 text-center">
                    <div className="text-[11px] sm:text-xs font-semibold text-black/60">
                      Підбір
                    </div>
                    <div className="mt-0.5 text-sm sm:text-base font-extrabold text-black">
                      Під ваш ґрунт
                    </div>
                  </div>
                  <div className="rounded-2xl border border-black/5 bg-white/70 px-3 py-3 sm:px-4 sm:py-3.5 text-center">
                    <div className="text-[11px] sm:text-xs font-semibold text-black/60">
                      Догляд
                    </div>
                    <div className="mt-0.5 text-sm sm:text-base font-extrabold text-black">
                      Поради
                    </div>
                  </div>
                </div>
              </div>

              {/* Perks */}
              <div className="mt-5 sm:mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                {perks.map((p, idx) => {
                  const Icon = p.icon;
                  return (
                    <div
                      key={idx}
                      className="group rounded-2xl sm:rounded-3xl border border-black/5 bg-white/70 backdrop-blur-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 rounded-2xl bg-green-600/10 p-3 ring-1 ring-green-600/15">
                          <Icon className="h-5 w-5 text-green-700" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm sm:text-base font-extrabold text-black">
                            {p.title}
                          </div>
                          <div className="mt-1 text-sm text-black/65 leading-relaxed">
                            {p.text}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="mt-6 sm:mt-8">
          <ProductSection />
        </section>

        {/* FULL WIDTH VIDEO – redesigned for mobile */}
        <section
          ref={videoSectionRef}
          className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mt-7 sm:mt-10"
        >
          <div className="w-screen">
            <div className="relative w-screen overflow-hidden bg-black">
              {/* responsive heights for all smartphones */}
              <div className="relative w-screen h-[62vw] sm:h-[44vw] md:h-[38vw] lg:h-[460px] max-h-[560px]">
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  src="/nursery.mp4"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  // Native controls only from md+ to avoid taking over screen on phones
                  controls={false}
                />

                {/* Gradient for readability */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Label */}
                <div className="pointer-events-none absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
                  <div className="bg-black/45 backdrop-blur-md px-3 py-1.5 rounded-2xl ring-1 ring-white/15 shadow-sm">
                    <p className="text-[11px] sm:text-xs font-semibold text-white">
                      🌿 Відео з нашого розсадника PlatanSad
                    </p>
                  </div>
                </div>

                {/* Minimal controls (mobile-friendly) */}
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={toggleVideo}
                      className="inline-flex items-center gap-2 rounded-2xl bg-white/10 hover:bg-white/15 active:bg-white/10 text-white px-3.5 py-2.5 sm:px-4 sm:py-2.5 backdrop-blur-md ring-1 ring-white/20 shadow-sm transition"
                      aria-label={isPlaying ? "Пауза відео" : "Відтворити відео"}
                    >
                      <span className="grid place-items-center rounded-xl bg-white/10 ring-1 ring-white/15 p-2">
                        {isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </span>
                      <span className="text-sm font-bold">
                        {isPlaying ? "Пауза" : "Відтворити"}
                      </span>
                    </button>

                    <div className="flex items-center gap-2">
                      <div className="hidden sm:flex items-center gap-2 rounded-2xl bg-white/10 px-3.5 py-2.5 backdrop-blur-md ring-1 ring-white/20">
                        <VolumeX className="h-4 w-4 text-white/90" />
                        <span className="text-xs font-semibold text-white/90">
                          Без звуку (muted)
                        </span>
                      </div>

                      {/* Show native controls on desktop only */}
                      <button
                        onClick={() => {
                          const v = videoRef.current;
                          if (!v) return;
                          setHasUserGesture(true);
                          // Toggle native controls for users who want scrubber (desktop/tablet)
                          v.controls = !v.controls;
                        }}
                        className="hidden md:inline-flex items-center justify-center rounded-2xl bg-white/10 hover:bg-white/15 active:bg-white/10 text-white px-3.5 py-2.5 backdrop-blur-md ring-1 ring-white/20 shadow-sm transition"
                        aria-label="Показати/сховати контролі"
                      >
                        Контролі
                      </button>
                    </div>
                  </div>

                  {/* Tiny hint if autoplay blocked until gesture */}
                  {!hasUserGesture && !isPlaying && (
                    <div className="mt-2 text-[11px] sm:text-xs text-white/75">
                      Якщо відео не стартує автоматично — натисніть “Відтворити”.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Under-video info strip */}
            <div className="w-screen bg-white">
              <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-5 sm:py-6">
                <div className="rounded-2xl sm:rounded-3xl border border-black/5 bg-white/80 backdrop-blur-xl p-4 sm:p-5 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="text-sm sm:text-base font-extrabold text-black">
                        Хочете підбір рослин під вашу ділянку?
                      </div>
                      <div className="mt-1 text-sm text-black/65">
                        Відкрийте каталог і оберіть — або напишіть нам, підкажемо
                        найкращий варіант.
                      </div>
                    </div>

                    <button
                      onClick={openCatalog}
                      className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-black text-white px-4 py-3 font-extrabold shadow-md hover:shadow-lg transition active:scale-[0.99]"
                    >
                      <LayoutGrid className="h-5 w-5" />
                      Відкрити каталог
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Spacer for floating mobile button */}
        <div className="h-20 sm:h-0" />
      </main>

      {/* Floating catalog button for phones (always reachable) */}
      <div
        className="sm:hidden fixed left-0 right-0 z-40 px-3"
        style={{
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)",
        }}
      >
        <div className="mx-auto max-w-7xl">
          <button
            onClick={openCatalog}
            className="w-full rounded-2xl bg-green-600 hover:bg-green-700 text-white py-3.5 font-extrabold text-base shadow-[0_18px_40px_rgba(22,163,74,0.35)] ring-1 ring-black/5 active:scale-[0.99] transition flex items-center justify-center gap-3"
          >
            <LayoutGrid className="h-5 w-5" />
            Каталог рослин
          </button>
          <div className="mt-2 text-center text-[11px] text-black/50">
            Кнопка завжди під рукою на смартфоні
          </div>
        </div>
      </div>

      {/* Catalog Modal */}
      <CatalogModal isOpen={isCatalogOpen} onClose={closeCatalog} />
    </div>
  );
};

export default HomePage;
