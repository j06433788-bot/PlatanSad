
import React, { useEffect, useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

/* Brand SVG icons (clean + modern) */
const BrandIcon = ({ name, className = "w-5 h-5 sm:w-6 sm:h-6" }) => {
  switch (name) {
    case "instagram":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M7.6 2h8.8A5.6 5.6 0 0 1 22 7.6v8.8A5.6 5.6 0 0 1 16.4 22H7.6A5.6 5.6 0 0 1 2 16.4V7.6A5.6 5.6 0 0 1 7.6 2Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M12 16.2a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M17.3 6.9h.01"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      );
    case "facebook":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M14 8.7V7.5c0-.8.5-1.5 1.6-1.5H17V3.2c-.6-.1-1.6-.2-2.8-.2-2.6 0-4.2 1.6-4.2 4.3v1.4H7.6V12H10v8.8h4V12h2.7l.4-3.3H14Z"
            fill="currentColor"
          />
        </svg>
      );
    case "tiktok":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M14.5 3c.6 3.4 2.5 5.4 5.6 5.6v3.1c-1.9.1-3.7-.6-5.5-1.9v6.6c0 3.6-2.7 6.3-6.3 6.3S2 20 2 16.8c0-3.5 2.8-6.3 6.3-6.3.5 0 1 .1 1.5.2v3.4c-.5-.2-1-.3-1.5-.3-1.7 0-3.1 1.4-3.1 3.1 0 1.7 1.3 3.1 3.1 3.1 1.9 0 3.2-1.2 3.2-3.7V3h2Z"
            fill="currentColor"
          />
        </svg>
      );
    case "viber":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M16.9 13.5c-.3-.2-.7-.2-1 0l-1.2.8c-.2.1-.4.1-.6 0-1.1-.8-2.1-1.8-2.9-2.9-.1-.2-.1-.4 0-.6l.8-1.2c.2-.3.2-.7 0-1l-1.1-1.6c-.2-.3-.6-.4-.9-.3-.9.3-1.9 1.1-2 2.4-.1 1.5.6 3.4 2.6 5.5 2.1 2.1 4 2.8 5.5 2.6 1.3-.1 2.1-1.1 2.4-2 .1-.3 0-.7-.3-.9l-1.6-1.1Z"
            fill="currentColor"
          />
          <path
            d="M13.2 5.2c2.3.4 4 2.1 4.4 4.4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            opacity=".85"
          />
        </svg>
      );
    default:
      return null;
  }
};

const Footer = () => {
  const { settings } = useSettings();
  const [open, setOpen] = useState(false);

  const phoneDigits = useMemo(() => {
    const raw = settings?.phone1 || "";
    return raw.replace(/\D/g, "");
  }, [settings?.phone1]);

  const instagramUrl = settings?.instagram || "https://instagram.com";
  const facebookUrl = settings?.facebook || "https://facebook.com";
  const tiktokUrl = settings?.tiktok || "https://tiktok.com";
  const viberUrl = phoneDigits ? `viber://chat?number=${phoneDigits}` : "viber://chats";

  const year = 2026;
  const siteName = settings?.siteName || "PlatanSad";

  // ESC closes
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // click outside closes
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

  const IconChip = ({ href, title, tint, children, external = true }) => (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-label={title}
      title={title}
      className="group flex items-center justify-center rounded-2xl bg-white/10 hover:bg-white/14 transition p-2 ring-1 ring-white/10 hover:ring-white/20"
    >
      <div
        className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl ring-1 ring-white/10 group-hover:ring-white/25 transition"
        style={{
          boxShadow: `0 16px 38px ${tint}26`,
          backgroundImage: `radial-gradient(120% 120% at 30% 20%, ${tint}2b 0%, rgba(255,255,255,0.08) 45%, rgba(0,0,0,0.12) 100%)`,
        }}
      >
        <span className="text-white">{children}</span>
      </div>
    </a>
  );

  return (
    <>
      {/* Minimal footer line */}
      <footer className="bg-[#08110c] text-white/70">
        <div
          className="max-w-7xl mx-auto px-3 py-3 text-center text-[11px] sm:text-xs"
          style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom))" }}
        >
          © {year} {siteName}. Усі права захищено.
        </div>
      </footer>

      {/* Floating button + compact panel */}
      <div
        className="fixed right-4 sm:right-6 z-50"
        style={{ bottom: "calc(18px + env(safe-area-inset-bottom))" }}
      >
        {/* Panel with spring pop + grain */}
        <div
          id="ms-panel"
          className={[
            "absolute bottom-16 right-0 w-[250px] sm:w-[270px] overflow-hidden rounded-3xl",
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
              "linear-gradient(180deg, rgba(16,185,129,0.22) 0%, rgba(5,46,22,0.45) 100%)",
          }}
        >
          {/* Grain overlay (light) */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E\")",
            }}
          />

          {/* Readability overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-black/28 to-black/40" />

          {/* Content (compact) */}
          <div className="relative p-3 sm:p-4">
            <p className="text-[13px] sm:text-sm font-extrabold text-white">
              Написати нам
            </p>
            <p className="mt-1 text-[11px] sm:text-[12px] text-white/80">
              Оберіть месенджер
            </p>

            <div className="mt-3 grid grid-cols-4 gap-2.5 sm:gap-3">
              <IconChip href={viberUrl} title="Viber" tint="#7C3AED" external={false}>
                <BrandIcon name="viber" />
              </IconChip>

              <IconChip href={instagramUrl} title="Instagram" tint="#EC4899">
                <BrandIcon name="instagram" />
              </IconChip>

              <IconChip href={facebookUrl} title="Facebook" tint="#3B82F6">
                <BrandIcon name="facebook" />
              </IconChip>

              <IconChip href={tiktokUrl} title="TikTok" tint="#22C55E">
                <BrandIcon name="tiktok" />
              </IconChip>
            </div>
          </div>
        </div>

        {/* Green pulse bubble */}
        <button
          id="ms-btn"
          onClick={() => setOpen((v) => !v)}
          className={[
            "relative w-14 h-14 rounded-[22px]",
            "flex items-center justify-center",
            "bg-emerald-600 hover:bg-emerald-600/90",
            "shadow-[0_18px_55px_rgba(16,185,129,0.45)]",
            "ring-1 ring-white/15",
            "transition active:scale-[0.98]",
          ].join(" ")}
          aria-label="Месенджери"
          title="Месенджери"
        >
          <span className="pointer-events-none absolute -inset-2 rounded-[26px] bg-emerald-400/18 blur-md animate-[pulse_1.6s_ease-in-out_infinite]" />
          <span className="pointer-events-none absolute inset-0 rounded-[22px] bg-gradient-to-b from-white/15 to-black/10" />
          <MessageCircle className="relative w-7 h-7 text-white" />
        </button>
      </div>
    </>
  );
};

export default Footer;

