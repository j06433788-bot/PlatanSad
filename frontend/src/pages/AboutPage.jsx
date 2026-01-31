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
          <p className="text-sm sm:text-base md:text-lg text-white/90 text-center mt-3 max-w-3xl mx-auto leading-relaxed">
            Platansad — приватний розсадник, де рослини вирощують з любов’ю, терпінням і професіоналізмом.
          </p>
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
            <p className="text-[12px] sm:text-sm text-gray-500 text-center mt-1 leading-snug">
              Вирощуємо правильно — щоб рослини тішили роками
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm md:shadow-md p-4 sm:p-5 md:p-6">
            <div className="bg-green-100 w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 md:w-7 md:h-7 text-green-600" />
            </div>
            <p className="text-sm sm:text-base md:text-xl font-bold text-gray-800 text-center">
              20+ років
            </p>
            <p className="text-[12px] sm:text-sm text-gray-500 text-center mt-1 leading-snug">
              Досвід без “експериментів”
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm md:shadow-md p-4 sm:p-5 md:p-6">
            <div className="bg-green-100 w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 md:w-7 md:h-7 text-green-600" />
            </div>
            <p className="text-sm sm:text-base md:text-xl font-bold text-gray-800 text-center">
              Підтримка
            </p>
            <p className="text-[12px] sm:text-sm text-gray-500 text-center mt-1 leading-snug">
              Після покупки теж на зв’язку
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm md:shadow-md p-4 sm:p-5 md:p-6">
            <div className="bg-green-100 w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 md:w-7 md:h-7 text-green-600" />
            </div>
            <p className="text-sm sm:text-base md:text-xl font-bold text-gray-800 text-center">
              Чесність
            </p>
            <p className="text-[12px] sm:text-sm text-gray-500 text-center mt-1 leading-snug">
              Рекомендації під твій сад, не “аби продати”
            </p>
          </div>
        </div>

        {/* About block */}
        <div className="bg-white rounded-2xl shadow-sm md:shadow-lg p-5 sm:p-7 md:p-12 mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Про компанію
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed mb-5">
            Ми — <span className="font-semibold text-gray-800">Platansad</span>, приватний розсадник, де рослини
            вирощують з любов’ю, терпінням і професіоналізмом.
          </p>

          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed mb-7">
            Понад <span className="font-semibold text-gray-800">20 років</span> ми працюємо з декоративними та хвойними
            рослинами, формуємо <span className="font-semibold text-gray-800">нівакі</span>, вирощуємо
            <span className="font-semibold text-gray-800"> тую</span>, <span className="font-semibold text-gray-800">ялинки</span>,
            <span className="font-semibold text-gray-800"> самшит</span> найвищої якості та допомагаємо створювати сади,
            які тішать роками, а не «на сезон».
          </p>

          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4">
            Наші переваги
          </h3>

          <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-base sm:text-lg">
                    20+ років досвіду
                  </p>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed mt-1">
                    Ми не експериментуємо на клієнтах — ми працюємо з рослинами десятиліттями й знаємо, що приживається, а що ні.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                  <TreePine className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-base sm:text-lg">
                    Понад 1000 реалізованих нівакі
                  </p>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed mt-1">
                    Ручне формування, правильна геометрія, здорова крона та продуманий ріст на роки вперед.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-base sm:text-lg">
                    Чесні рекомендації
                  </p>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed mt-1">
                    Ми завжди скажемо, якщо рослина або формат не підходять саме вам. Репутація для нас важливіша за продаж.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-base sm:text-lg">
                    Підтримка після покупки
                  </p>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed mt-1">
                    Ми не зникаємо після продажу: підкажемо з посадкою, доглядом і подальшим формуванням.
                  </p>
                </div>
              </div>
            </div>
          </div>
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
