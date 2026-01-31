import React, { useEffect, useState } from "react";
import AboutModal from "./AboutModal";
import { useSettings } from "../context/SettingsContext";
import { ChevronUp } from "lucide-react";

const Footer = () => {
  const { settings } = useSettings();
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);

  const year = new Date().getFullYear();
  const siteName = settings?.siteName || "PlatanSad";

  const phone1 = settings?.phone1 || "+380 (63) 650-74-49";
  const phone2 = settings?.phone2 || "+380 (95) 251-03-47";

  const normalizePhone = (phone) => phone.replace(/\s|\(|\)|-/g, "");

  // Show "scroll to top"
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* ---------- FOOTER ---------- */}
      <footer className="relative text-white overflow-hidden">

        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/assets/footer-soil.jpg"
            alt="PlatanSad background"
            className="w-full h-full object-cover object-center"
            loading="lazy"
            decoding="async"
          />
          {/* Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/65 to-black/80" />
        </div>

        {/* Content */}
        <div
          className="relative max-w-7xl mx-auto px-4"
          style={{
            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 14px)",
          }}
        >
          <div className="py-4 sm:py-6 text-center">

            {/* Phones */}
            <div className="flex justify-center flex-wrap gap-3 sm:gap-6">
              <a
                href={`tel:${normalizePhone(phone1)}`}
                className="rounded-full px-3 py-2 text-[13px] sm:text-sm font-semibold
                           bg-white/10 hover:bg-white/20 active:bg-white/25
                           text-white backdrop-blur-md transition"
              >
                {phone1}
              </a>

              <a
                href={`tel:${normalizePhone(phone2)}`}
                className="rounded-full px-3 py-2 text-[13px] sm:text-sm font-semibold
                           bg-white/10 hover:bg-white/20 active:bg-white/25
                           text-white backdrop-blur-md transition"
              >
                {phone2}
              </a>
            </div>

            {/* About */}
            <div className="mt-3">
              <button
                onClick={() => setIsAboutOpen(true)}
                className="rounded-full px-4 py-2 text-[12px] sm:text-sm font-semibold
                           bg-white/10 hover:bg-white/20 active:bg-white/25
                           text-white backdrop-blur-md transition"
              >
                Про розсадник
              </button>
            </div>

            {/* Divider */}
            <div className="mx-auto mt-4 h-px w-40 bg-white/30" />

            {/* Copyright */}
            <div className="mt-3 text-[11px] sm:text-xs text-white/80">
              © {year} {siteName}. Усі права захищено.
            </div>
          </div>
        </div>

        {/* ---------- SCROLL TO TOP ---------- */}
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className={[
            "fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-50",
            "p-3 rounded-full",
            "bg-white/20 hover:bg-white/30 active:bg-white/40",
            "text-white shadow-xl backdrop-blur-md",
            "transition-all duration-300",
            showTop
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 pointer-events-none",
          ].join(" ")}
        >
          <ChevronUp size={20} />
        </button>

      </footer>

      {/* ---------- ABOUT MODAL ---------- */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </>
  );
};

export default Footer;
