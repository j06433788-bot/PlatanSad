import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronUp, Sprout } from 'lucide-react';
import AboutModal from './AboutModal';
import { useSettings } from '../context/SettingsContext';

const Footer = () => {
  const navigate = useNavigate();
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const { settings } = useSettings();

  return (
    <>
      <footer className="relative bg-[#1a1a1a] text-white overflow-hidden">
        {/* Background texture overlay */}
        <div className="absolute inset-0 opacity-30" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-6 md:py-8">
          <div className="flex flex-col items-center text-center space-y-4 md:space-y-5">
            
            {/* Phone numbers - horizontal on mobile with better size */}
            <div className="flex items-center justify-center gap-3 sm:gap-5 flex-wrap">
              <a 
                href="tel:+380636507449" 
                className="text-white hover:text-green-400 transition-colors font-semibold text-sm sm:text-base md:text-lg"
                data-testid="footer-phone-1"
              >
                +380 (63) 650-74-49
              </a>
              <span className="text-gray-500 text-base">•</span>
              <a 
                href="tel:+380952510347" 
                className="text-white hover:text-green-400 transition-colors font-semibold text-sm sm:text-base md:text-lg"
                data-testid="footer-phone-2"
              >
                +380 (95) 251-03-47
              </a>
            </div>

            {/* Payment methods - horizontal strip with better visibility */}
            <div className="flex flex-col items-center gap-2 md:gap-3">
              <p className="text-gray-400 text-xs sm:text-sm md:text-base">Приймаємо до оплати:</p>
              <div className="flex items-center justify-center">
                <img src="/mastercard.webp" alt="Mastercard" className="h-7 sm:h-8 md:h-9 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" />
              </div>
            </div>
            
            {/* Links - horizontal on all screens with better size */}
            <div className="flex items-center justify-center gap-4 sm:gap-5 text-xs sm:text-sm md:text-base flex-wrap">
              <button 
                onClick={() => setIsAboutModalOpen(true)}
                className="text-green-400 hover:text-green-300 transition-colors font-medium"
                data-testid="about-nursery-btn"
              >
                Про розсадник
              </button>
              <span className="text-gray-600">•</span>
              <button 
                onClick={() => navigate('/contacts')}
                className="text-green-400 hover:text-green-300 transition-colors font-medium"
                data-testid="contact-info-btn"
              >
                Контакти
              </button>
            </div>
            
            {/* Copyright - better visibility */}
            <div className="pt-2 md:pt-3">
              <p className="text-gray-400 text-xs sm:text-sm md:text-base">
                © 2026 PlatanSad
              </p>
            </div>
          </div>
        </div>

        {/* Scroll to top button - better positioning for mobile */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 sm:bottom-8 right-4 sm:right-6 w-12 h-12 sm:w-13 sm:h-13 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 z-50 group"
          aria-label="Вгору"
          data-testid="scroll-to-top"
        >
          <ChevronUp className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:animate-bounce" />
        </button>
      </footer>

      {/* About Modal */}
      <AboutModal 
        isOpen={isAboutModalOpen} 
        onClose={() => setIsAboutModalOpen(false)} 
      />
    </>
  );
};

export default Footer;