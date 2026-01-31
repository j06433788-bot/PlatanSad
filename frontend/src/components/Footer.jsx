import React, { useEffect, useRef, useState } from "react";
import AboutModal from "./AboutModal";
import { useSettings } from "../context/SettingsContext";
import { ChevronUp, TreePine } from "lucide-react";

const Footer = () => {
  const { settings } = useSettings();
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);

  const bgRef = useRef(null);

  const year = new Date().getFullYear();
  const siteName = settings?.siteName || "PlatanSad";

  const phone1 = settings?.phone1 || "+380 (63) 650-74-49";
  const phone2 = settings?.phone2 || "+380 (95) 251-03-47";

  const normalizePhone = (phone) => phone.replace(/\s|\(|\)|-/g, "");

  // Show “to top”
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lightweight parallax for footer background
  useEffect(() => {
    const el = bgRef.current;
    if (!el) return;

    let raf = 0;

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight || 800;
        const t = (vh - rect.top) / (vh + rect.height);
        const clamped = Math.max(0, Math.min(1, t));

        const offset = (clamped - 0.5) * 20; // -10..+10px
        el.style.transform = `translate3d(0, ${offset}px, 0) scale(1.05)`;
        raf = 0;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      {/* Premium animations */}
      <style>{`
        @keyframes psPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 16px 40px rgba(16,185,129,.28); }
          50% { transform: scale(1.04); box-shadow: 0 18px 52px rgba(16,185,129,.40); }
        }
        @keyframes psRing {
          0% { transform: scale(.85); opacity: .55; }
          100% { transform: scale(1.35); opacity: 0; }
        }

        /* Live shadow drift */
        @keyframes psShadowDrift {
          0%   { transform: translate3d(-10%, -6%, 0) rotate(0deg) scale(1.02); opacity: .55; }
          50%  { transform: translate3d(10%, 6%, 0) rotate(2deg)  scale(1.06); opacity: .70; }
          100% { transform: translate3d(-10%, -6%, 0) rotate(0deg) scale(1.02); opacity: .55; }
        }
        @keyframes psShadowBreath {
          0%, 100% { filter: blur(28px); }
          50%      { filter: blur(34px); }
        }

        /* Breathing green aura */
        @keyframes psAuraBreath {
          0%, 100% { transform: scale(1); opacity: .55; }
          50%      { transform: scale(1.08); opacity: .85; }
        }

        /* Gentle pine sway */
        @keyframes psPineSway {
          0%, 100% { transform: rotate(-2deg) translateY(0); }
          50%      { transform: rotate(2deg) translateY(-1px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .ps-anim, .ps-anim * { animation: none !important; transition: none !important; }
        }
      `}</style>

      {/* ---------- FOOTER ---------- */}
      <footer className="relative text-white overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 ps-anim">
          <img
            ref={bgRef}
            src="/assets/footer-soil.jpg"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-center will-change-transform"
            loading="lazy"
            decoding="async"
          />

          {/* Make image slightly lighter */}
          <div className="absolute inset-0 bg-white/10" />

          {/* Base overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/45 to-black/60" />

          {/* Subtle green glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(16,185,129,.20),transparent_55%)] pointer-events-none" />

          {/* Live moving shadow layer */}
          <div
            aria-hidden="true"
            className="absolute -inset-[30%] will-change-transform"
            style={{
              background:
                "radial-gradient(circle at 35% 35%, rgba(0,0,0,.45) 0%, rgba(0,0,0,.22) 35%, rgba(0,0,0,0) 62%)",
              animation: "psShadowDrift 14s ease-in-out infinite",
              mixBlendMode: "multiply",
              pointerEvents: "none",
            }}
          />

          {/* Second very soft shade (depth) */}
          <div
            aria-hidden="true"
            className="absolute -inset-[30%] will-change-transform"
            style={{
              background:
                "radial-gradient(circle at 70% 55%, rgba(0,0,0,.30) 0%, rgba(0,0,0,.14) 30%, rgba(0,0,0,0) 60%)",
              animation: "psShadowDrift 18s ease-in-out infinite reverse",
              mixBlendMode: "multiply",
              pointerEvents: "none",
            }}
          />

          {/* Gentle breathing blur to feel organic */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              animation: "psShadowBreath 6.5s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Content */}
        <div
          className="relative max-w-7xl mx-auto px-4"
          style={{
            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 14px)",
          }}
        >
          <div className="py-4 sm:py-6 text-center">
            {/* Phones - premium green */}
            <div className="flex justify-center flex-wrap gap-3 sm:gap-6">
              <a
                href={`tel:${normalizePhone(phone1)}`}
                className={[
                  "rounded-full px-3.5 py-2 text-[13px] sm:text-sm font-semibold",
                  "text-emerald-50",
                  "bg-gradient-to-r from-emerald-500/85 to-green-500/85",
                  "shadow-[0_14px_34px_rgba(16,185,129,.22)]",
                  "hover:from-emerald-500 hover:to-green-500",
                  "active:scale-[0.98] transition",
                  "backdrop-blur-md ring-1 ring-white/15 hover:ring-white/25",
                ].join(" ")}
                aria-label="Подзвонити за першим номером"
              >
                {phone1}
              </a>

              <a
                href={`tel:${normalizePhone(phone2)}`}
                className={[
                  "rounded-full px-3.5 py-2 text-[13px] sm:text-sm font-semibold",
                  "text-emerald-50",
                  "bg-gradient-to-r from-emerald-500/85 to-green-500/85",
                  "shadow-[0_14px_34px_rgba(16,185,129,.22)]",
                  "hover:from-emerald-500 hover:to-green-500",
                  "active:scale-[0.98] transition",
                  "backdrop-blur-md ring-1 ring-white/15 hover:ring-white/25",
                ].join(" ")}
                aria-label="Подзвонити за другим номером"
              >
                {phone2}
              </a>
            </div>

            {/* About - breathing aura + pine sway */}
            <div className="mt-3 flex justify-center ps-anim">
              <button
                onClick={() => setIsAboutOpen(true)}
                className="
                  relative inline-flex items-center gap-2
                  rounded-full px-4 py-2.5
                  text-[12px] sm:text-sm font-semibold
                  text-emerald-50
                  bg-gradient-to-r from-emerald-500/80 to-green-500/80
                  ring-1 ring-white/15 hover:ring-white/30
                  shadow-[0_12px_30px_rgba(16,185,129,.22)]
                  backdrop-blur-md
                  transition-all duration-300
                  active:scale-[0.97]
                  overflow-visible
                "
              >
                <span
                  aria-hidden="true"
                  className="absolute -inset-2 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 50%, rgba(16,185,129,.40) 0%, rgba(16,185,129,.18) 38%, rgba(16,185,129,0) 70%)",
                    filter: "blur(10px)",
                    animation: "psAuraBreath 2.8s ease-in-out infinite",
                    zIndex: -1,
                  }}
                />
                <TreePine
                  size={16}
                  className="text-emerald-100 drop-shadow-sm"
                  style={{ animation: "psPineSway 2.4s ease-in-out infinite" }}
                />
                <span className="tracking-wide">Про розсадник</span>
              </button>
            </div>

            {/* Divider */}
            <div className="mx-auto mt-4 h-px w-40 bg-white/25" />

            {/* Copyright */}
            <div className="mt-3 text-[11px] sm:text-xs text-white/80">
              © {year} {siteName}. Усі права захищено.
            </div>
          </div>
        </div>

        {/* Scroll to top - premium green + pulse */}
        <button
          onClick={scrollToTop}
          aria-label="Вгору"
          className={[
            "fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-50",
            "rounded-full p-3 sm:p-3.5",
            "text-white",
            "bg-gradient-to-r from-emerald-500 to-green-500",
            "shadow-[0_16px_40px_rgba(16,185,129,.28)]",
            "backdrop-blur-md",
            "transition-all duration-300",
            "focus:outline-none focus:ring-2 focus:ring-emerald-200/70",
            showTop
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 pointer-events-none",
          ].join(" ")}
          style={{
            animation: showTop ? "psPulse 1.8s ease-in-out infinite" : "none",
          }}
        >
          {showTop && (
            <span
              className="absolute inset-0 rounded-full"
              style={{
                animation: "psRing 1.6s ease-out infinite",
                boxShadow: "0 0 0 2px rgba(16,185,129,.35)",
              }}
              aria-hidden="true"
            />
          )}
          <span className="relative">
            <ChevronUp size={20} />
          </span>
        </button>
      </footer>

      {/* ---------- ABOUT MODAL ---------- */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </>
  );
};

export default Footer;
