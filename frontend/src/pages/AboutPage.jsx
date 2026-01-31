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
          {[
            {
              icon: <TreePine className="w-6 h-6 md:w-7 md:h-7 text-green-600" />,
              title: 'Якість',
              text: 'Вирощуємо правильно — щоб рослини тішили роками',
            },
            {
              icon: <Award className="w-6 h-6 md:w-7 md:h-7 text-green-600" />,
              title: '20+ років',
              text: 'Досвід без “експериментів”',
            },
            {
              icon: <Users className="w-6 h-6 md:w-7 md:h-7 text-green-600" />,
              title: 'Підтримка',
              text: 'Після покупки теж на зв’язку',
            },
            {
              icon: <Target className="w-6 h-6 md:w-7 md:h-7 text-green-600" />,
              title: 'Чесність',
              text: 'Рекомендації під твій сад, не “аби продати”',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm md:shadow-md p-4 sm:p-5 md:p-6 hover:shadow-lg transition"
            >
              <div className="bg-green-100 w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                {item.icon}
              </div>
              <p className="text-sm sm:text-base md:text-xl font-bold text-gray-800 text-center">
                {item.title}
              </p>
              <p className="text-[12px] sm:text-sm text-gray-500 text-center mt-1 leading-snug">
                {item.text}
              </p>
            </div>
          ))}
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
            <span className="font-semibold text-gray-800"> тую</span>,{' '}
            <span className="font-semibold text-gray-800">ялинки</span>,{' '}
            <span className="font-semibold text-gray-800"> самшит</span> найвищої якості та допомагаємо створювати сади,
            які тішать роками.
          </p>

          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-4">
            Наші переваги
          </h3>

          <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
            {[
              {
                icon: <Star className="w-5 h-5 text-green-600" />,
                title: '20+ років досвіду',
                text: 'Ми працюємо з рослинами десятиліттями й знаємо, що реально приживається.',
              },
              {
                icon: <TreePine className="w-5 h-5 text-green-600" />,
                title: '1000+ нівакі',
                text: 'Ручне формування, правильна геометрія та здоровий ріст.',
              },
              {
                icon: <Target className="w-5 h-5 text-green-600" />,
                title: 'Чесні рекомендації',
                text: 'Репутація для нас важливіша за продаж.',
              },
              {
                icon: <Users className="w-5 h-5 text-green-600" />,
                title: 'Підтримка після покупки',
                text: 'Допомагаємо з посадкою, доглядом і формуванням.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:p-5 hover:shadow-md transition"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-base sm:text-lg">
                      {item.title}
                    </p>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed mt-1">
                      {item.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PREMIUM CTA */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 sm:p-8 text-center text-white relative overflow-hidden">

          {/* Glow background */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-yellow-500/20 blur-2xl" />

          <div className="relative z-10">
            <h3 className="text-xl sm:text-2xl font-bold mb-3">
              Розвивайте свій сад разом із PlatanSad
            </h3>

            <p className="text-sm sm:text-base mb-6 opacity-90">
              Надихаємось природою — показуємо процес, результати та новинки
            </p>

            {/* PREMIUM INSTAGRAM BUTTON */}
            <a
              href="https://www.instagram.com/platansad.uaa"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full font-bold text-white
              bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400
              shadow-lg shadow-pink-500/30
              hover:shadow-xl hover:shadow-pink-500/40
              hover:scale-[1.04] active:scale-95 transition-all duration-300"
            >
              {/* Pulse ring */}
              <span className="absolute -inset-1 rounded-full bg-pink-500/40 blur-md opacity-70 group-hover:opacity-100 animate-pulse" />

              <Instagram className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Наш Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
