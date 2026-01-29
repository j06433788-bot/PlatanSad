import React, { useEffect, useMemo, useRef, useState } from "react";
import { Instagram, MessageCircle, Music2, Facebook } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

const Footer = () => {
  const { settings } = useSettings();

  const [bubbleOpen, setBubbleOpen] = useState(false);

  const phoneDigits = useMemo(() => {
    const raw = settings?.phone1 || "";
    return raw.replace(/\D/g, "");
  }, [settings?.phone1]);

  const instagramUrl = settings?.instagram || "https://instagram.com";
  const facebookUrl = settings?.facebook || "https://facebook.com";
  const tiktokUrl = settings?.tiktok || "https://tiktok.com";
  const viberUrl = phoneDigits ? `viber://chat?number=${phoneDigits}` : "viber://chats";

  // close on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setBubbleOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // close when click outside
  useEffect(() => {
    if (!bubbleOpen) return;
    const onDown = (e) => {
      const panel = document.getElementById("messenger-panel");
      const btn = document.getElementById("messenger-btn");
      if (!panel || !btn) return;
      if (!panel.contains(e.target) && !btn.contains(e.target)) setBubbleOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [bubbleOpen]);

  const year = 2026;
  const siteName = settings?.siteName || "PlatanSad";

  return (
    <>
      {/* Minimal compact footer (can be your horoshop-style footer below if needed) */}
      <footer className="bg-[#0b0f0d] text-white/70">
        <div
          className="max-w-7xl mx-auto px-3 py-3 text-center text-[11px] sm:text-xs"
          style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom))" }}
        >
          © {year} {siteName}. Усі права захищено.
        </div>
      </footer>

      {/* Floating pulse bubble */}
      <div
        className="fixed right-4 sm:right-6 z-50"
        style={{
          bottom: "calc(18px + env(safe-area-inset-bottom))",
        }}
      >
        {/* Panel */}
        <div
          id="messenger-panel"
          className={[
            "absolute bottom-14 right-0 w-[260px] overflow-hidden rounded-3xl",
            "bg-white/12 backdrop-blur-2xl ring-1 ring-white/18 shadow-2xl",
            "transition-all duration-200",
            bubbleOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-2 pointer-events-none",
          ].join(" ")}
        >
          <div className="p-4">
            <p className="text-sm font-extrabold text-white/95">Написати нам</p>
            <p className="mt-1 text-[12px] leading-snug text-white/70">
              Оберіть месенджер — відповідаємо швидко
            </p>

            {/* Icon grid (no labels) */}
            <div className="mt-4 grid grid-cols-4 gap-3">
              <a
                href={viberUrl}
                aria-label="Viber"
                title="Viber"
                className="flex items-center justify-center rounded-2xl bg-white/10 hover:bg-white/16 transition p-3 ring-1 ring-white/10"
              >
                <MessageCircle className="w-6 h-6 text-white" />
              </a>

              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram"
                className="flex items-center justify-center rounded-2xl bg-white/10 hover:bg-white/16 transition p-3 ring-1 ring-white/10"
              >
                <Instagram className="w-6 h-6 text-white" />
              </a>

              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                title="Facebook"
                className="flex items-center justify-center rounded-2xl bg-white/10 hover:bg-white/16 transition p-3 ring-1 ring-white/10"
              >
                <Facebook className="w-6 h-6 text-white" />
              </a>

              <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                title="TikTok"
                className="flex items-center justify-center rounded-2xl bg-white/10 hover:bg-white/16 transition p-3 ring-1 ring-white/10"
              >
                <Music2 className="w-6 h-6 text-white" />
              </a>
            </div>

            {/* Small hint row */}
            <div className="mt-4 text-[11px] text-white/55">
              Натисніть іконку — відкриється чат або сторінка
            </div>
          </div>
        </div>

        {/* Bubble button */}
        <button
          id="messenger-btn"
          onClick={() => setBubbleOpen((v) => !v)}
          className={[
            "relative w-14 h-14 rounded-[22px]",
            "flex items-center justify-center",
            // site green theme
            "bg-green-600 hover:bg-green-600/90",
            "shadow-[0_18px_50px_rgba(34,197,94,0.35)]",
            "ring-1 ring-white/15",
            "transition active:scale-[0.98]",
          ].join(" ")}
          aria-label="Месенджери"
          title="Месенджери"
        >
          {/* Pulse ring */}
          <span className="pointer-events-none absolute inset-0 rounded-[22px] animate-[pulse_1.6s_ease-in-out_infinite] bg-green-500/35 blur-[0.5px]" />
          <span className="pointer-events-none absolute -inset-2 rounded-[26px] animate-[pulse_1.6s_ease-in-out_infinite] bg-green-500/15" />

          <MessageCircle className="relative w-7 h-7 text-white" />
        </button>
      </div>
    </>
  );
};

export default Footer;

