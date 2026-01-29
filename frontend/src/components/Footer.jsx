import React, { useState } from "react";
import AboutModal from "./AboutModal";
import { useSettings } from "../context/SettingsContext";

const Footer = () => {
  const { settings } = useSettings();
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const phone1 = settings?.phone1 || "+380 (63) 650-74-49";
  const phone2 = settings?.phone2 || "+380 (95) 251-03-47";

  const tel1 = `tel:${String(phone1).replace(/\s/g, "")}`;
  const tel2 = `tel:${String(phone2).replace(/\s/g, "")}`;

  const year = 2026;
  const siteName = settings?.siteName || "PlatanSad";

  return (
    <>
      <footer
        className="relative text-white overflow-hidden"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.70)), url("/footer-bg.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* тонка віньєтка, щоб текст був читабельний на будь-якому фоні */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />

        {/* легкий декоративний листочок справа знизу (мінімально) */}
        <div className="pointer-events-none absolute right-3 bottom-3 opacity-90">
          <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
            <path
              d="M52 12c-9 2-18 8-23 15-4 5-6 11-6 17 7 0 13-2 18-6 7-5 13-14 15-26Z"
              fill="#5EEA7A"
              fillOpacity="0.55"
            />
            <path
              d="M12 28c7 1 13 4 17 8 4 4 6 9 6 14-6 0-11-2-15-5-5-4-9-10-8-17Z"
              fill="#34D399"
              fillOpacity="0.45"
            />
            <path
              d="M22 48c6-9 16-18 28-24"
              stroke="rgba(255,255,255,0.55)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-3">
          <div className="py-4 sm:py-5 text-center">
            {/* Phones (один рядок, як у прикладі) */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
              <a
                href={tel1}
                className="text-[13px] sm:text-sm font-semibold tracking-wide text-white/90 hover:text-white transition"
                data-testid="footer-phone-1"
              >
                {phone1}
              </a>
              <a
                href={tel2}
                className="text-[13px] sm:text-sm font-semibold tracking-wide text-white/90 hover:text-white transition"
                data-testid="footer-phone-2"
              >
                {phone2}
              </a>
            </div>

            {/* Про розсадник */}
            <div className="mt-3">
              <button
                onClick={() => setIsAboutOpen(true)}
                className="text-[12px] sm:text-sm font-semibold text-white/90 hover:text-white transition"
                data-testid="about-nursery-btn"
              >
                Про розсадник
              </button>
            </div>

            {/* Divider */}
            <div className="mx-auto mt-3 h-px w-44 bg-white/20" />

            {/* Copyright */}
            <div className="mt-3 text-[11px] sm:text-xs text-white/70">
              © {year} {siteName}. Усі права захищено.
            </div>
          </div>
        </div>
      </footer>

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </>
  );
};

export default Footer;

