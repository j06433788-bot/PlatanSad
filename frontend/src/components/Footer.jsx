import React, { useState } from "react";
import AboutModal from "./AboutModal";
import { useSettings } from "../context/SettingsContext";

const Footer = () => {
  const { settings } = useSettings();
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const year = 2026;
  const siteName = settings?.siteName || "PlatanSad";

  return (
    <>
      {/* ---------- FOOTER ---------- */}

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

      {/* ---------- ABOUT MODAL ---------- */}

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </>
  );
};

export default Footer;

