import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { settings } = useSettings();
  
  // Get active slides from settings
  const slides = settings?.heroSlides?.filter(slide => slide.active) || [
    { 
      id: 1,
      image: 'https://images.unsplash.com/photo-1494825514961-674db1ac2700', 
      title: 'PlatanSad',
      subtitle: 'Професійний розсадник рослин',
      active: true
    }
  ];

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
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              {/* Background image */}
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover relative z-10"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-20" />
              
              {/* Text content */}
              <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-10 md:px-16 z-30">
                <h2 className="text-xl sm:text-4xl md:text-5xl font-bold text-white mb-1.5 sm:mb-3 leading-tight">
                  {slide.title}
                </h2>
                <p className="text-green-400 text-sm sm:text-xl md:text-2xl font-medium">
                  {slide.subtitle}
                </p>
              </div>
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
