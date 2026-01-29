import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const ContactsPage = () => {
  const { settings } = useSettings();

  const mapAddress = encodeURIComponent(
    settings?.address || 'Рівненська обл., Дубенський р-н, Смига'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-10 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 md:mb-3 text-center">
            Контакти
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-center text-green-50 max-w-2xl mx-auto">
            Ми завжди раді відповісти на ваші запитання
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Contact Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 md:mb-10">
          {[
            {
              icon: <Phone />,
              title: 'Телефон',
              content: (
                <>
                  <a
                    href={`tel:${(settings?.phone1 || '+380 (63) 650-74-49').replace(/\s/g, '')}`}
                    className="block text-green-600 font-medium text-xs sm:text-sm md:text-base"
                  >
                    {settings?.phone1 || '+380 (63) 650-74-49'}
                  </a>
                  <a
                    href={`tel:${(settings?.phone2 || '+380 (95) 251-03-47').replace(/\s/g, '')}`}
                    className="block text-green-600 font-medium text-xs sm:text-sm md:text-base"
                  >
                    {settings?.phone2 || '+380 (95) 251-03-47'}
                  </a>
                </>
              )
            },
            {
              icon: <Mail />,
              title: 'Email',
              content: (
                <a
                  href={`mailto:${settings?.email || 'info@platansad.ua'}`}
                  className="text-green-600 font-medium break-all text-xs sm:text-sm md:text-base"
                >
                  {settings?.email || 'info@platansad.ua'}
                </a>
              )
            },
            {
              icon: <MapPin />,
              title: 'Адреса',
              content: (
                <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                  {settings?.address || 'Рівненська обл., Дубенський р-н, Смига'}
                </p>
              )
            },
            {
              icon: <Clock />,
              title: 'Графік роботи',
              content: (
                <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                  {settings?.workingHours || 'Пн-Пт: 8:00 – 20:00'} <br />
                  {settings?.weekend || 'Нд: вихідний'}
                </p>
              )
            }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-4 md:p-5">
              <div className="bg-green-100 w-9 h-9 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-2 md:mb-3">
                {React.cloneElement(item.icon, {
                  className: 'w-4 h-4 md:w-6 md:h-6 text-green-600'
                })}
              </div>
              <h3 className="text-sm md:text-lg font-semibold mb-1 md:mb-2">
                {item.title}
              </h3>
              {item.content}
            </div>
          ))}
        </div>

        {/* Google Map - PlatanSad branded frame */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <MapPin className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
            <h2 className="text-lg md:text-2xl font-bold">Наше розташування</h2>
          </div>

          <div className="relative rounded-2xl p-[2px] bg-gradient-to-r from-green-400 via-green-500 to-green-600 shadow-xl">
            {/* Soft glow */}
            <div className="absolute inset-0 rounded-2xl blur-lg opacity-30 bg-green-500"></div>

            {/* Map container */}
            <div
              className="relative w-full h-[280px] sm:h-[340px] md:h-[420px] rounded-2xl overflow-hidden bg-white"
              data-testid="google-map-container"
            >
              <iframe
                src={`https://maps.google.com/maps?q=${mapAddress}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Розташування PlatanSad"
                data-testid="google-map-iframe"
              />
            </div>
          </div>

          <p className="text-gray-600 text-xs sm:text-sm mt-3 text-center">
            {settings?.address || 'Рівненська область, Дубенський район, с. Смига'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;
