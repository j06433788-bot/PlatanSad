import React, { useState, useEffect } from 'react';

const slides = [
  { 
    image: '/PLATAN.jpg', 
    title: '',
    subtitle: '',
    alt: 'PlatanSad - Професійний розсадник',
    noOverlay: true, // Без градієнта і тексту
    isPlatan: true // Спеціальне відображення для PLATAN
  },
  { 
    image: 'https://images.prom.ua/6510283244_w640_h640_bonsaj-nivaki-pinus.jpg', 
    title: 'Бонсай Нівакі',
    subtitle: 'Японський стиль для вашого саду',
    alt: 'PlatanSad - Бонсай Нівакі' 
  },
  { 
    image: 'https://images.prom.ua/5107353705_w640_h640_tuya-smaragd-smaragd.jpg', 
    title: 'Туя Смарагд',
    subtitle: 'Ідеальний живопліт',
    alt: 'PlatanSad - Туя Смарагд' 
  },
  { 
    image: 'https://images.prom.ua/713633902_w640_h640_hvojni-roslini.jpg', 
    title: 'Хвойні рослини',
    subtitle: 'Вічнозелена краса',
    alt: 'PlatanSad - Хвойні рослини' 
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-0 sm:px-4 py-0 sm:py-4">
      {/* Main banner with slider */}
      <div className="relative overflow-hidden rounded-none sm:rounded-2xl shadow-md">
        {/* Slides */}
        <div className="relative h-[280px] sm:h-auto sm:aspect-[2.5/1]">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'} ${slide.isPlatan ? 'bg-white' : ''}`}
            >
              {/* Background image */}
              <img
                src={slide.image}
                alt={slide.alt}
                className={`w-full h-full relative z-10 ${slide.isPlatan ? 'object-contain' : 'object-cover'}`}
              />
              {/* Overlay gradient - тільки якщо не noOverlay */}
              {!slide.noOverlay && (
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-20" />
              )}
              
              {/* Text content - тільки якщо є title */}
              {slide.title && (
                <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-10 md:px-16 z-30">
                  <h2 className="text-xl sm:text-4xl md:text-5xl font-bold text-white mb-1.5 sm:mb-3 leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-green-400 text-sm sm:text-xl md:text-2xl font-medium">
                    {slide.subtitle}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Slide indicators */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex gap-2 sm:gap-2.5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-green-500 w-8 sm:w-10' 
                  : 'bg-white/70 hover:bg-white w-2.5 sm:w-3'
              }`}
              aria-label={`Слайд ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
