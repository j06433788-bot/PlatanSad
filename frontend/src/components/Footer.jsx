import React, { useEffect, useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

/* Colored Brand Icons */

const InstagramIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <defs>
      <linearGradient id="ig" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F58529" />
        <stop offset="50%" stopColor="#DD2A7B" />
        <stop offset="100%" stopColor="#8134AF" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#ig)" />
    <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2" fill="none" />
    <circle cx="17" cy="7" r="1.2" fill="white" />
  </svg>
);

const FacebookIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <circle cx="12" cy="12" r="12" fill="#1877F2" />
    <path
      d="M13.8 12H12v7h-3v-7H7.5V9.3H9V7.6C9 5.8 10 4 12.6 4c1.1 0 1.9.1 1.9.1l-.1 2.5h-1.2c-.8 0-1 .4-1 1v1.7h2.3L13.8 12Z"
      fill="white"
    />
  </svg>
);

const TikTokIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <circle cx="12" cy="12" r="12" fill="#000" />
    <path
      d="M14 5c.6 1.9 2 3.1 3.8 3.2v2.2c-1.2.1-2.3-.3-3.4-1v4.4a4.5 4.5 0 1 1-4.5-4.5c.4 0 .7.1 1 .1v2.3c-.3-.1-.6-.2-1-.2a2.2 2.2 0 1 0 2.2 2.2V5h1.9Z"
      fill="#25F4EE"
    />
    <path
      d="M13.5 5v8.7a2.2 2.2 0 1 1-2.2-2.2c.3 0 .6.1.9.2V9.4c-.3-.1-.6-.1-.9-.1a4.5 4.5 0 1 0 4.5 4.5V5h-2.3Z"
      fill="#FE2C55"
    />
  </svg>
);

const ViberIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <circle cx="12" cy="12" r="12" fill="#7360F2" />
    <path
      d="M16.7 14.1c-.3-.2-.7-.2-1 0l-1 .7c-.2.1-.4.1-.6 0-1-.7-1.9-1.6-2.6-2.6-.1-.2-.1-.4 0-.6l.7-1c.2-.3.2-.7 0-1l-1-1.5c-.2-.3-.6-.4-.9-.3-.8.3-1.7 1-1.8 2.2-.1 1.4.6 3.1 2.3 4.9 1.9 1.9 3.5 2.5 4.9 2.3 1.2-.1 1.9-1 2.2-1.8.1-.3 0-.7-.3-.9l-1.5-1Z"
      fill="white"
    />
  </svg>
);

const Footer = () => {
  const { settings } = useSettings();
  const [open, setOpen] = useState(false);

  const phoneDigits = useMemo(() => {
    return (settings?.phone1 || "").replace(/\D/g, "");
  }, [settings?.phone1]);

  const viberUrl = phoneDigits ? `viber://chat?number=${phoneDigits}` : "viber://chats";

  const instagramUrl = settings?.instagram || "https://instagram.com";
  const facebookUrl = settings?.facebook || "https://facebook.com";
  const tiktokUrl = settings?.tiktok || "https://tiktok.com";

  // ESC close
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  const IconBtn = ({ href, children, external = true }) => (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="flex items-center justify-center rounded-2xl bg-white/10 hover:bg-white/15 transition p-2 ring-1 ring-white/10"
    >
      <div className="h-10 w-10 flex items-center justify-center">
        {children}
      </div>
    </a>
  );

  return (
    <>
      {/* Footer minimal */}
      <footer className="bg-[#08110c] text-white/70 text-center text-[11px] py-3">
        © 2026 PlatanSad. Усі права захищено.
      </footer>

      {/* Floating messenger */}
      <div className="fixed right-4 bottom-5 z-50">
        {/* Panel */}
        <div
          className={`absolute bottom-16 right-0 w-[240px] rounded-3xl overflow-hidden backdrop-blur-2xl transition-all duration-300 ${
            open
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-2 scale-[0.92] pointer-events-none"
          }`}
          style={{
            background:
              "linear-gradient(180deg, rgba(16,185,129,0.22), rgba(5,46,22,0.45))",
          }}
        >
          {/* Grain */}
          <div
            className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />

          <div className="relative p-3">
            <p className="text-white font-bold text-sm mb-2">Написати нам</p>

            <div className="grid grid-cols-4 gap-2">
              <IconBtn href={viberUrl} external={false}>
                <ViberIcon className="w-8 h-8" />
              </IconBtn>

              <IconBtn href={instagramUrl}>
                <InstagramIcon className="w-8 h-8" />
              </IconBtn>

              <IconBtn href={facebookUrl}>
                <FacebookIcon className="w-8 h-8" />
              </IconBtn>

              <IconBtn href={tiktokUrl}>
                <TikTokIcon className="w-8 h-8" />
              </IconBtn>
            </div>
          </div>
        </div>

        {/* Bubble */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="relative w-14 h-14 bg-emerald-600 rounded-[22px] flex items-center justify-center shadow-[0_20px_50px_rgba(16,185,129,.5)] ring-1 ring-white/20"
        >
          <span className="absolute -inset-2 rounded-[26px] bg-emerald-400/20 blur-md animate-pulse" />
          <MessageCircle className="relative w-7 h-7 text-white" />
        </button>
      </div>
    </>
  );
};

export default Footer;


