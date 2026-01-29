import React, { useEffect, useMemo, useRef, useState } from "react";
import { Instagram, Send, MessageCircle, Music2, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";

/**
 * Premium mobile-first footer:
 * - Glass / blur background (Telegram mini-app vibe)
 * - iOS safe-area padding
 * - Auto-hide on scroll down, show on scroll up
 * - Floating messenger bubble (expandable)
 */
const Footer = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();

  const [hidden, setHidden] = useState(false);
  const [bubbleOpen, setBubbleOpen] = useState(false);

  const lastYRef = useRef(0);
  const tickingRef = useRef(false);

  const siteName = settings?.siteName || "PlatanSad";

  const phoneDigits = useMemo(() => {
    const raw = settings?.phone1 || "";
    const digits = raw.replace(/\D/g, "");
    // if user enters 380..., keep it; else try to keep as is
    return digits;
  }, [settings?.phone1]);

  // Social links (set your real ones in settings)
  const instagramUrl = settings?.instagram || "https://instagram.com";
  const tiktokUrl = settings?.tiktok || "https://tiktok.com";
  // Telegram: use your username like https://t.me/yourname
  const telegramUrl = settings?.telegram || "https://t.me/";
  // Viber deep-link
  const viberUrl = phoneDigits ? `viber://chat?number=${phoneDigits}` : "viber://chats";

  // Auto-hide footer on scroll down; show on scroll up
  useEffect(() => {
    lastYRef.current = window.scrollY || 0;

    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      window.requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const last = lastYRef.current;

        // Don't hide near top; don't jitter for small movements
        const delta = y - last;
        const nearTop = y < 40;

        if (!nearTop) {
          if (delta > 12) setHidden(true);   // scrolling down
          if (delta < -12) setHidden(false); // scrolling up
        } else {
          setHidden(false);
        }

        lastYRef.current = y;
        tickingRef.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close bubble when route changes (or when user taps outside via Escape)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setBubbleOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const year = new Date().getFullYear();

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      {/* Floating Messenger Bubble */}
      <div
        className="fixed right-3 sm:right-5 z-50"
        style={{
          bottom: "calc(76px + env(safe-area-inset-bottom))",
        }}
      >
        <div className="relative">
          {/* Expanded panel */}
          <div
            className={[
              "absolute bottom-14 right-0 w-[220px] sm:w-[240px] overflow-hidden rounded-2xl",
              "ring-1 ring-white/15 shadow-2xl",
              "bg-white/10 backdrop-blur-xl",
              "transition-all duration-200",
              bubbleOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none",
            ].join(" ")}
          >
            <div className="p-3">
              <p className="text-xs font-semibold text-white/90">Написати нам</p>
              <p className="mt-0.5 text-[11px] text-white/60">
                Оберіть месенджер — відповідаємо швидко
              </p>

              <div className="mt-3 grid grid-cols-3 gap-2">
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-1 rounded-xl bg-white/10 hover:bg-white/15 transition p-2"
                  aria-label="Telegram"
                  title="Telegram"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span className="text-[10px] text-white/80">TG</span>
                </a>

                <a
                  href={viberUrl}
                  className="flex flex-col items-center justify-center gap-1 rounded-xl bg-white/10 hover:bg-white/15 transition p-2"
                  aria-label="Viber"
                  title="Viber"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span className="text-[10px] text-white/80">Viber</span>
                </a>

                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-1 rounded-xl bg-white/10 hover:bg-white/15 transition p-2"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4 text-white" />
                  <span className="text-[10px] text-white/80">IG</span>
                </a>
              </div>

              <div className="mt-2">
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl bg-white/10 hover:bg-white/15 transition px-3 py-2"
                  aria-label="TikTok"
                  title="TikTok"
                >
                  <div className="flex items-center gap-2">
                    <Music2 className="w-4 h-4 text-white" />
                    <span className="text-xs text-white/85 font-semibold">TikTok</span>
                  </div>
                  <span className="text-[11px] text-white/55">відкрити</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bubble button */}
          <button
            onClick={() => setBubbleOpen((v) => !v)}
            className={[
              "w-12 h-12 rounded-2xl",
              "bg-white/10 backdrop-blur-xl ring-1 ring-white/15 shadow-2xl",
              "flex items-center justify-center transition active:scale-[0.98] hover:bg-white/15",
            ].join(" ")}
            aria-label="Месенджери"
            title="Месенджери"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Compact Glass Footer Bar (auto-hide) */}
      <footer
        className={[
          "fixed left-0 right-0 z-40",
          "transition-transform duration-200",
          hidden ? "translate-y-full" : "translate-y-0",
        ].join(" ")}
        style={{
          bottom: "env(safe-area-inset-bottom)",
        }}
      >
        {/* Glass background */}
        <div className="mx-auto max-w-7xl px-3 sm:px-4">
          <div
            className={[
              "mb-2",
              "rounded-2xl",
              "bg-white/8 backdrop-blur-xl",
              "ring-1 ring-white/12 shadow-[0_18px_60px_rgba(0,0,0,0.25)]",
            ].join(" ")}
            style={{
              paddingBottom: "calc(10px + env(safe-area-inset-bottom))",
            }}
          >
            <div className="flex items-center justify-between gap-3 px-3 py-2 sm:px-4 sm:py-3">
              {/* Left: mini brand */}
              <button
                onClick={() => navigate("/")}
                className="text-left"
                aria-label="На головну"
                title="На головну"
              >
                <div className="text-xs sm:text-sm font-bold text-white/90 leading-none">
                  {siteName}
                </div>
                <div className="text-[10px] sm:text-[11px] text-white/55 leading-none mt-1">
                  © {year}
                </div>
              </button>

              {/* Center: small social row */}
              <div className="flex items-center gap-2">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/15 transition"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4 text-white" />
                </a>

                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/15 transition"
                  aria-label="TikTok"
                  title="TikTok"
                >
                  <Music2 className="w-4 h-4 text-white" />
                </a>

                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/15 transition"
                  aria-label="Telegram"
                  title="Telegram"
                >
                  <Send className="w-4 h-4 text-white" />
                </a>
              </div>

              {/* Right: scroll top */}
              <button
                onClick={scrollTop}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/15 transition"
                aria-label="Вгору"
                title="Вгору"
              >
                <ChevronUp className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
