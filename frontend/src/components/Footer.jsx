import React, { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import AboutModal from "./AboutModal";
import { useSettings } from "../context/SettingsContext";

/* --- Brand icons (original-like) --- */
const IG = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="igGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F58529" />
        <stop offset="45%" stopColor="#DD2A7B" />
        <stop offset="100%" stopColor="#8134AF" />
      </linearGradient>
    </defs>
    <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" fill="url(#igGrad)" />
    <circle cx="12" cy="12" r="4.2" stroke="#fff" strokeWidth="2" fill="none" />
    <circle cx="17.3" cy="6.8" r="1.15" fill="#fff" />
  </svg>
);

const FB = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="10.8" fill="#1877F2" />
    <path
      d="M13.6 12H12v7h-2.9v-7H7.8V9.6h1.3V7.9c0-2 1.2-3.9 4-3.9 1.1 0 1.9.1 1.9.1l-.1 2.3h-1.2c-1 0-1.1.5-1.1 1.1v1.1h2.4L13.6 12Z"
      fill="#fff"
    />
  </svg>
);

const TT = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="10.8" fill="#0b0b0b" />
    {/* cyan shadow */}
    <path
      d="M13.9 6.3c.6 1.5 1.9 2.6 3.6 2.7v2.2c-1.1.1-2.2-.2-3.3-.9v4.1a4.3 4.3 0 1 1-4.3-4.3c.3 0 .6 0 .9.1v2.3c-.3-.1-.6-.2-.9-.2a2 2 0 1 0 2 2V6.3h2Z"
      fill="#25F4EE"
      opacity=".95"
    />
    {/* pink note */}
    <path
      d="M12.9 5.9v8.2a3.6 3.6 0 1 1-3.6-3.6c.3 0 .6 0 .9.1v2.1c-.3-.1-.6-.1-.9-.1a1.6 1.6 0 1 0 1.6 1.6V5.9h2Z"
      fill="#FE2C55"
      opacity=".95"
    />
    {/* white highlight */}
    <path
      d="M13.9 6.3c.6 1.5 1.9 2.6 3.6 2.7v1c-1.1 0-2.2-.4-3.3-1.1v5.5a4.3 4.3 0 1 1-4.3-4.3c.3 0 .6 0 .9.1v1c-.3-.1-.6-.1-.9-.1a3.3 3.3 0 1 0 3.3 3.3V6.3h.7Z"
      fill="#fff"
      opacity=".18"
    />
  </svg>
);

const Footer = () => {
  const { settings } = useSettings();
  const [open, setOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const instagramUrl = settings?.instagram || "https://instagram.com/";
  const facebookUrl = settings?.facebook || "https://facebook.com/";
  const tiktokUrl = settings?.tiktok || "https://tiktok.com/";

  const year = 2026;
  const siteName = settings?.siteName || "PlatanSad";

  // ESC closes
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  // close when click outside
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      const panel = document.getElementById("ms-panel");
      const btn = document.getElementById("ms-btn");
      if (!panel || !btn) return;
      if (!panel.contains(e.target) && !btn.contains(e.target)) setOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [open]);

  const SocialChip = ({ href, label, glow, children }) => (
    <a
      href={href}
      rel="nofollow"
      target="_blank"
      aria-label={label}
      title={label}
      className="group flex items-center justify-center rounded-2xl bg-white/10 hover:bg-white/16 transition p-2 ring-1 ring-white/10"
    >
      <div
        className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-b from-white/10 to-black/10 ring-1 ring-white/12 group-hover:ring-white/25 transition"
        style={{
          boxShadow: `0 18px 55px ${glow}00`,
        }}
      >
        {/* hover glow */}
        <span
          className="pointer-events-none absolute -inset-2 rounded-3xl opacity-0 blur-xl transition-opacity duration-200 group-hover:opacity-100"
          style={{ backgroundColor: glow, opacity: 0.55 }}
        />
        <span className="relative">{children}</span>
      </div>
    </a>
  );

  return (
    <>
      {/* Footer with background image (like your reference) */}
      <footer
        className="relative text-white overflow-hidden"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.72)), url("/footer-bg.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* readability overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-black/25 to-black/45" />

        <div className="relative max-w-7xl mx-auto px-3">
          <div className="py-4 sm:py-5 text-center">
            {/* phones */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
              <a
                href={`tel:${(settings?.phone1 || "+380(63)650-74-49").replace(/\s/g, "")}`}
                className="text-[13px] sm:text-sm font-semibold tracking-wide text-white/90 hover:text-white transition"
              >
                {settings?.phone1 || "+380 (63) 650-74-49"}
              </a>
              <a
                href={`tel:${(settings?.phone2 || "+380(95)251-03-47").replace(/\s/g, "")}`}
                className="text-[13px] sm:text-sm font-semibold tracking-wide text-white/90 hover:text-white transition"
              >
                {settings?.phone2 || "+380 (95) 251-03-47"}
              </a>
            </div>

            {/* about */}
            <div className="mt-3">
              <button
                onClick={() => setIsAboutOpen(true)}
                className="text-[12px] sm:text-sm font-semibold text-white/90 hover:text-white transition"
              >
                Про розсадник
              </button>
            </div>

            {/* divider */}
            <div className="mx-auto mt-3 h-px w-44 bg-white/20" />

            {/* copyright */}
            <div className="mt-3 text-[11px] sm:text-xs text-white/70">
              © {year} {siteName}. Усі права захищено.
            </div>
          </div>
        </div>
      </footer>

      {/* Floating bubble (marketplace style) */}
      <div
        className="fixed right-4 sm:right-6 z-50"
        style={{ bottom: "calc(18px + env(safe-area-inset-bottom))" }}
      >
        {/* Panel: spring/pop + glass + grain */}
        <div
          id="ms-panel"
          className={[
            "absolute bottom-16 right-0 w-[230px] sm:w-[250px] overflow-hidden rounded-3xl",
            "backdrop-blur-2xl ring-1 ring-emerald-200/20",
            "shadow-[0_24px_70px_rgba(0,0,0,0.42)]",
            "transition-all duration-250",
            open
              ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
              : "opacity-0 translate-y-2 scale-[0.92] pointer-events-none",
          ].join(" ")}
          style={{
            transformOrigin: "calc(100% - 24px) calc(100% - 16px)",
            transitionTimingFunction: "cubic-bezier(.16, 1, .3, 1)",
            background:
              "linear-gradient(180deg, rgba(16,185,129,0.24) 0%, rgba(5,46,22,0.55) 100%)",
          }}
        >
          {/* Grain overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='110' height='110'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='110' height='110' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E\")",
            }}
          />
          {/* readability overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/40" />

          <div className="relative p-3 sm:p-4">
            <p className="text-[13px] sm:text-sm font-extrabold text-white">
              Ми в соцмережах
            </p>

            {/* icons only */}
            <div className="mt-3 grid grid-cols-3 gap-2.5">
              <SocialChip href={instagramUrl} label="Instagram" glow="#FF3EA5">
                <IG className="w-7 h-7" />
              </SocialChip>

              <SocialChip href={facebookUrl} label="Facebook" glow="#3B82F6">
                <FB className="w-7 h-7" />
              </SocialChip>

              <SocialChip href={tiktokUrl} label="TikTok" glow="#25F4EE">
                <TT className="w-7 h-7" />
              </SocialChip>
            </div>
          </div>
        </div>

        {/* Bubble button (green pulse) */}
        <button
          id="ms-btn"
          onClick={() => setOpen((v) => !v)}
          className="relative w-14 h-14 bg-emerald-600 hover:bg-emerald-600/90 rounded-[22px] flex items-center justify-center shadow-[0_20px_50px_rgba(16,185,129,.5)] ring-1 ring-white/20 transition active:scale-[0.98]"
          aria-label="Соцмережі"
          title="Соцмережі"
        >
          <span className="pointer-events-none absolute -inset-2 rounded-[26px] bg-emerald-400/20 blur-md animate-[pulse_1.6s_ease-in-out_infinite]" />
          <span className="pointer-events-none absolute inset-0 rounded-[22px] bg-gradient-to-b from-white/15 to-black/10" />
          <MessageCircle className="relative w-7 h-7 text-white" />
        </button>
      </div>

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </>
  );
};

export default Footer;
