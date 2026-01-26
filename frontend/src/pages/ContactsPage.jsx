import React from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const ContactsPage = () => {
  const { settings } = useSettings();
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero - Адаптовано */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl md:text-5xl font-bold mb-2 md:mb-3 text-center">
            Контакти
          </h1>
          <p className="text-sm md:text-xl text-center text-green-50 max-w-2xl mx-auto">
            Ми завжди раді відповісти на ваші запитання
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">

        {/* Contact Cards - Оптимізовано для мобільних */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-10">
          {[
            {
              icon: <Phone />,
              title: 'Телефон',
              content: (
                <>
                  <a href={`tel:${settings?.phone1?.replace(/\s/g, '')}`} className="block text-green-600 font-medium text-sm md:text-base">
                    {settings?.phone1 || '+380 (63) 650-74-49'}
                  </a>
                  <a href={`tel:${settings?.phone2?.replace(/\s/g, '')}`} className="block text-green-600 font-medium text-sm md:text-base">
                    {settings?.phone2 || '+380 (95) 251-03-47'}
                  </a>
                </>
              )
            },
            {
              icon: <Mail />,
              title: 'Email',
              content: (
                <a href={`mailto:${settings?.email}`} className="text-green-600 font-medium break-all text-sm md:text-base">
                  {settings?.email || 'info@platansad.ua'}
                </a>
              )
            },
            {
              icon: <MapPin />,
              title: 'Адреса',
              content: (
                <p className="text-gray-600 text-xs md:text-sm">
                  {settings?.address || 'Рівненська обл., Дубенський р-н, Смига, Україна'}
                </p>
              )
            },
            {
              icon: <Clock />,
              title: 'Графік роботи',
              content: (
                <p className="text-gray-600 text-xs md:text-sm">
                  {settings?.workingHours || 'Пн-Пт: 8:00 – 20:00'} <br />
                  {settings?.weekend || 'Нд: вихідний'}
                </p>
              )
            }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-lg md:rounded-xl shadow p-3 md:p-4">
              <div className="bg-green-100 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-2 md:mb-3">
                {React.cloneElement(item.icon, { className: 'w-5 h-5 md:w-6 md:h-6 text-green-600' })}
              </div>
              <h3 className="text-base md:text-lg font-semibold mb-1.5 md:mb-2">{item.title}</h3>
              {item.content}
            </div>
          ))}
        </div>

        {/* Contact Form - Оптимізовано */}
        <div className="bg-white rounded-lg md:rounded-2xl shadow p-5 md:p-10 mb-6 md:mb-10">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <Send className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
            <h2 className="text-xl md:text-2xl font-bold">Напишіть нам</h2>
          </div>

          <form className="max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
              <input
                type="text"
                placeholder="Ваше ім'я *"
                className="w-full px-3 py-2.5 md:px-4 md:py-3 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm md:text-base"
              />
              <input
                type="tel"
                placeholder="Телефон *"
                className="w-full px-3 py-2.5 md:px-4 md:py-3 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm md:text-base"
              />
            </div>

            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2.5 md:px-4 md:py-3 border rounded-lg mb-3 md:mb-4 focus:ring-2 focus:ring-green-500 text-sm md:text-base"
            />

            <textarea
              rows="4"
              placeholder="Ваше повідомлення *"
              className="w-full px-3 py-2.5 md:px-4 md:py-3 border rounded-lg mb-3 md:mb-4 resize-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
            />

            <button
              type="submit"
              className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 md:px-8 md:py-3 rounded-lg font-semibold text-sm md:text-base"
            >
              Відправити
            </button>
          </form>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-lg md:rounded-2xl shadow-lg p-4 md:p-8 mb-6 md:mb-10">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <MapPin className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
            <h2 className="text-xl md:text-2xl font-bold">Як нас знайти</h2>
          </div>
          
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2544.4573485641806!2d26.1875384!3d50.4014433!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x472f13c1e8b8e8e9%3A0x5e8f8e8f8e8f8e8f!2z0KHQvNC40LPQsCwg0KDRltCy0L3QtdC90YHRjNC60LAg0L7QsdC70LDRgdGC0YwsIDM1MjAw!5e0!3m2!1suk!2sua!4v1234567890123!5m2!1suk!2sua"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Розсадник PlatanSad на карті"
            ></iframe>
          </div>
          
          <div className="mt-4 p-3 md:p-4 bg-green-50 rounded-lg">
            <p className="text-sm md:text-base text-gray-700">
              <strong>Адреса:</strong> Рівненська обл., Дубенський р-н, смт. Смига, Україна
            </p>
            <p className="text-xs md:text-sm text-gray-600 mt-1">
              Ми знаходимося в мальовничому місці серед зелені. Завжди раді вашому візиту!
            </p>
          </div>
        </div>

        {/* Social Media - Оптимізовано */}
        <div className="bg-white rounded-lg md:rounded-2xl shadow-lg p-6 md:p-12">
          <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-5 md:mb-6 text-center">Ми в соціальних мережах</h2>
          <div className="flex items-center justify-center gap-5 md:gap-6">
            {/* Instagram */}
            <a 
              href="https://instagram.com/platansad.uaa?igsh=cmhhbG4zbjNkMTBr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
              data-testid="social-link"
            >
              <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            
            {/* TikTok */}
            <a 
              href="https://tiktok.com/@platansad.ua?_r=1&_t=ZM-932THO2LgYS" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-black flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
              data-testid="social-link"
            >
              <svg className="w-7 h-7 md:w-8 md:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
                 
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;