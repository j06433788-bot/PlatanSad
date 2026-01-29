import React, { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import AboutModal from "./AboutModal";
import { useSettings } from "../context/SettingsContext";

const Footer = () => {
  const { settings } = useSettings();

  const [open, setOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const instagramUrl = settings?.instagram || "https://instagram.com/";
  const facebookUrl = settings?.facebook || "https://facebook.com/";
  const tiktokUrl = settings?.tiktok || "https://tiktok.com/";

  const year = 2026;
  const siteName = settings?.siteName || "PlatanSad";

  /* Close on ESC */
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  /* Close on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      const panel = document.getElementById("social-panel");
      const btn = document.getElementById("social-btn");
      if (!panel || !btn) return;
      if (!panel.contains(e.target) && !btn.contains(e.target)) {
        setOpen(false);
      }
    };
    window.addEventListener("pointerdown", handler);
    return () => window.removeEventListener("pointerdown", handler);
  }, [open]);

  const SocialIcon = ({ href, iconId, label }) => (
    <a
      href={href}
      target="_blank"
      rel="nofollow"
      aria-label={label}
      title={label}
      className="group flex items-center justify-center rounded-2xl bg-white/10 hover:bg-white/15 transition p-2 ring-1 ring-white/10"
    >
      <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-b from-white/10 to-black/10 ring-1 ring-white/15">
        <svg className="w-6 h-6 text-white">
          <use xlinkHref={`/sprite.svg#${iconId}`} />
        </svg>
      </div>
    </a>
  );

  return (
    <>
      {/* ===== FOOTER ===== */}
      <footer
        className="relative text-white overflow-hidden"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.75)), url("/footer-bg.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/25 to-black/45 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-3">
          <div className="py-4 sm:py-5 text-center">

            {/* Phones */}
            <div className="flex justify-center flex-wrap gap-4 sm:gap-6">
              <a
                href={`tel:${(settings?.phone1 || "+380636507449").replace(/\s/g, "")}`}
                className="text-[13px] sm:text-sm font-semibold text-white/90 hover:text-white transition"
              >
                {settings?.phone1 || "+380 (63) 650-74-49"}
              </a>

              <a
                href={`tel:${(settings?.phone2 || "+380952510347").replace(/\s/g, "")}`}
                className="text-[13px] sm:text-sm font-semibold text-white/90 hover:text-white transition"
              >
                {settings?.phone2 || "+380 (95) 251-03-47"}
              </a>
            </div>

            {/* About */}
            <div className="mt-3">
              <button
                onClick={() => setIsAboutOpen(true)}
                className="text-[12px] sm:text-sm font-semibold text-white/90 hover:text-white transition"
              >
                Про розсадник
              </button>
            </div>

            {/* Divider */}
            <div className="mx-auto mt-3 h-px w-40 bg-white/20" />

            {/* Copyright */}
            <div className="mt-3 text-[11px] sm:text-xs text-white/70">
              © {year} {siteName}. Усі права захищено.
            </div>

          </div>
        </div>
      </footer>

      {/* ===== FLOATING SOCIAL BUTTON ===== */}
      <div
        className="fixed right-4 sm:right-6 z-50"
        style={{ bottom: "calc(18px + env(safe-area-inset-bottom))" }}
      >
        {/* Panel */}
        <div
          id="social-panel"
          className={`absolute bottom-16 right-0 w-[240px] overflow-hidden rounded-3xl backdrop-blur-2xl ring-1 ring-emerald-200/20 shadow-[0_25px_70px_rgba(0,0,0,.45)] transition-all duration-300
            ${
              open
                ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                : "opacity-0 translate-y-2 scale-[0.92] pointer-events-none"
            }
          `}
          style={{
            background:
              "linear-gradient(180deg, rgba(16,185,129,0.28), rgba(5,46,22,0.6))",
            transformOrigin: "calc(100% - 26px) calc(100% - 20px)",
          }}
        >
          {/* Grain */}
          <div
            className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />

          <div className="relative p-4">
            <p className="text-sm font-extrabold text-white mb-3">
              Ми в соцмережах
            </p>

            <div className="grid grid-cols-3 gap-3">
              <SocialIcon href={instagramUrl} iconId="icon-ig" label="Instagram" />
              <SocialIcon href={facebookUrl} iconId="icon-fb" label="Facebook" />
              <SocialIcon href={tiktokUrl} iconId="icon-tt" label="TikTok" />
            </div>
          </div>
        </div>

        {/* Floating button */}
        <button
          id="social-btn"
          onClick={() => setOpen((v) => !v)}
          className="relative w-14 h-14 rounded-[22px] bg-emerald-600 flex items-center justify-center ring-1 ring-white/20 shadow-[0_22px_60px_rgba(16,185,129,.55)] active:scale-[0.97]"
        >
          {/* Pulse layers */}
          <span className="absolute -inset-3 rounded-[30px] bg-emerald-400/25 blur-md animate-pulse" />
          <span
            className="absolute -inset-6 rounded-[36px] bg-emerald-300/10 blur-xl animate-pulse"
            style={{ animationDelay: "0.4s" }}
          />
          <span className="absolute inset-0 rounded-[22px] bg-gradient-to-b from-white/15 to-black/10" />

          <MessageCircle className="relative w-7 h-7 text-white" />
        </button>
      </div>

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </>
  );
};

export default Footer;

