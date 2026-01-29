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

  const SocialChip = ({ href, label, iconId }) => (
    <a
      href={href}
      rel="nofollow"
      target="_blank"
      aria-label={label}
      title={label}
      className="group flex items-center justify-center rounded-2xl bg-white/10 hover:bg-white/16 transition p-2 ring-1 ring-white/10"
    >
      <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-b from-white/10 to-black/10 ring-1 ring-white/12 group-hover:ring-white/25 transition">
        {/* Monochrome sprite icon */}
        <svg className="w-6 h-6 text-white/95">
          <use xlinkHref={`#${iconId}`} />
        </svg>
      </div>
    </a>
  );

  return (
    <>
      {/* Footer with background image */}
      <footer
        className="relative text-white overflow-hidden"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.72)), url("/footer-bg.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
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

            <div className="mx-auto mt-3 h-px w-44 bg-white/20" />

            <div className="mt-3 text-[11px] sm:text-xs text-white/70">
              © {year} {siteName}. Усі права захищено.
            </div>
          </div>
        </div>
      </footer>

      {/* Floating bubble */}
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
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-black/25 to-black/40" />

          <div className="relative p-3 sm:p-4">
            <p className="text-[13px] sm:text-sm font-extrabold text-white">
              Ми в соцмережах
            </p>

            <div className="mt-3 grid grid-cols-3 gap-2.5">
              <SocialChip href={instagramUrl} label="Instagram" iconId="icon-ig" />
              <SocialChip href={facebookUrl} label="Facebook" iconId="icon-fb" />
              <SocialChip href={tiktokUrl} label="TikTok" iconId="icon-tt" />
            </div>
          </div>
        </div>

        {/* Stronger pulse bubble */}
        <button
          id="ms-btn"
          onClick={() => setOpen((v) => !v)}
          className="relative w-14 h-14 bg-emerald-600 hover:bg-emerald-600/90 rounded-[22px] flex items-center justify-center ring-1 ring-white/20 transition active:scale-[0.98]"
          aria-label="Соцмережі"
          title="Соцмережі"
          style={{
            boxShadow: "0 22px 60px rgba(16,185,129,.55)",
          }}
        >
          {/* Pulse #1 */}
          <span className="pointer-events-none absolute -inset-3 rounded-[30px] bg-emerald-400/25 blur-md animate-[pulse_1.15s_ease-in-out_infinite]" />
          {/* Pulse #2 (offset timing) */}
          <span className="pointer-events-none absolute -inset-6 rounded-[36px] bg-emerald-300/12 blur-xl animate-[pulse_1.15s_ease-in-out_infinite]" style={{ animationDelay: "0.35s" }} />
          {/* Radar ring */}
          <span className="pointer-events-none absolute -inset-4 rounded-[32px] ring-2 ring-emerald-200/25 animate-[ping_1.25s_cubic-bezier(0,0,0.2,1)_infinite]" />

          <span className="pointer-events-none absolute inset-0 rounded-[22px] bg-gradient-to-b from-white/15 to-black/10" />
          <MessageCircle className="relative w-7 h-7 text-white" />
        </button>
      </div>

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </>
  );
};

export default Footer;
