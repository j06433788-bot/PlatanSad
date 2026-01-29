import React from 'react';
import { TreePine, Award, Users, Target, Instagram, Star } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-8 sm:py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
            Про нас
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">

        {/* Values */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">

          <div className="bg-white rounded-xl shadow-sm md:shadow-md p-4 sm:p-5 md:p-6">
            <div className="bg-green-100 w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mx-auto mb-3">
              <TreePine className="w-6 h-6 md:w-7 md:h-7 text-green-600" />
            </div>
            <p className="text-sm sm:text-base md:text-xl font-bold text-gray-800 text-center">
              Якість
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm md:shadow-md p-4 sm:p-5 md:p-6">
            <div className="bg-green-100 w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 md:w-7 md:h-7 text-green-600" />
            </div>
            <p className="text-sm sm:text-base md:text-xl font-bold text-gray-800 text-center">
              Досвід
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm md:shadow-md p-4 sm:p-5 md:p-6">
            <div className="bg-green-100 w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 md:w-7 md:h-7 text-green-600" />
            </div>
            <p className="text-sm sm:text-base md:text-xl font-bold text-gray-800 text-center">
              Команда
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm md:shadow-md p-4 sm:p-5 md:p-6">
            <div className="bg-green-100 w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 md:w-7 md:h-7 text-green-600" />
            </div>
            <p className="text-sm sm:text-base md:text-xl font-bold text-gray-800 text-center">
              Підхід
            </p>
          </div>

        </div>

        {/* About block */}
        <div className="bg-white rounded-2xl shadow-sm md:shadow-lg p-5 sm:p-7 md:p-12 mb-8">

          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Про компанію
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed mb-6">
            Ми спеціалізуємося на вирощуванні декоративних рослин найвищої якості.
            Наша місія — допомогти створити унікальний сад мрії для кожного клієнта.
          </p>

          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4">
            Наші переваги:
          </h3>

          <ul className="space-y-3 text-gray-600">
            <li className="flex gap-3">
              <span className="text-green-500 font-bold">✓</span>
              <span>Широкий асортимент рослин</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-500 font-bold">✓</span>
              <span>Гарантія якості</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-500 font-bold">✓</span>
              <span>Професійні консультації</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-500 font-bold">✓</span>
              <span>Швидка доставка</span>
            </li>
            <li className="flex gap-3">
              <span className="text-green-500 font-bold">✓</span>
              <span>Індивідуальний підхід</span>
            </li>
          </ul>

        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 sm:p-8 text-center text-white">

          <h3 className="text-xl sm:text-2xl font-bold mb-3">
            Розвивайте свій сад разом із PlatanSad
          </h3>

          <p className="text-sm sm:text-base mb-5 opacity-90">
            Якісні рослини та професійний сервіс для вашого ідеального саду
          </p>

          <a
            href="https://www.instagram.com/platansad.uaa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white text-green-600 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition"
          >
            <Instagram className="w-5 h-5" />
            Наш Instagram
          </a>

        </div>

      </div>
    </div>
  );
};

export default AboutPage;
