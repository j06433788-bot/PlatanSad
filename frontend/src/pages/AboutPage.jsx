import React from 'react';
import { TreePine, Award, Users, Target, Instagram, Star } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section - Адаптовано для мобільних */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-6 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl md:text-5xl font-bold text-center" data-testid="about-title">
            Про нас
          </h1>
        </div>
      </div>

      {/* Main Content - Оптимізовано для мобільних */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
        
        {/* Values - Адаптовано для мобільних */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-3 md:p-6" data-testid="value-card">
            <div className="bg-green-100 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4">
              <TreePine className="w-6 h-6 md:w-7 md:h-7 text-green-600" />
            </div>
            <p className="text-sm md:text-xl font-bold text-gray-800 text-center leading-tight">Якість</p>
          </div>

          <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-3 md:p-6" data-testid="value-card">
            <div className="bg-green-100 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4">
              <Award className="w-6 h-6 md:w-7 md:h-7 text-green-600" />
            </div>
            <p className="text-sm md:text-xl font-bold text-gray-800 text-center leading-tight">Досвід</p>
          </div>

          <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-3 md:p-6" data-testid="value-card">
            <div className="bg-green-100 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4">
              <Users className="w-6 h-6 md:w-7 md:h-7 text-green-600" />
            </div>
            <p className="text-sm md:text-xl font-bold text-gray-800 text-center leading-tight">Команда</p>
          </div>

          <div className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-md p-3 md:p-6" data-testid="value-card">
            <div className="bg-green-100 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4">
              <Target className="w-6 h-6 md:w-7 md:h-7 text-green-600" />
            </div>
            <p className="text-sm md:text-xl font-bold text-gray-800 text-center leading-tight">Підхід</p>
          </div>
        </div>

        {/* Main Content - Оптимізовано */}
        <div className="bg-white rounded-lg md:rounded-2xl shadow-sm md:shadow-lg p-4 md:p-12">
          <h2 className="text-lg md:text-3xl font-bold text-gray-800 mb-3 md:mb-6">Про компанію</h2>
          <p className="text-sm md:text-lg text-gray-600 leading-relaxed mb-4 md:mb-6">
            Ми спеціалізуємося на вирощуванні декоративних рослин найвищої якості. 
            Наша місія - допомогти створити унікальний сад мрії.
          </p>

          <h3 className="text-base md:text-2xl font-bold text-gray-800 mb-3 md:mb-4">Наші переваги:</h3>
          <ul className="space-y-2 md:space-y-3 text-gray-600">
            <li className="flex items-center gap-2 md:gap-3">
              <span className="text-green-500 text-lg md:text-xl">✓</span>
              <span className="text-sm md:text-lg">Широкий асортимент</span>
            </li>
            <li className="flex items-center gap-2 md:gap-3">
              <span className="text-green-500 text-lg md:text-xl">✓</span>
              <span className="text-sm md:text-lg">Гарантія якості</span>
            </li>
            <li className="flex items-center gap-2 md:gap-3">
              <span className="text-green-500 text-lg md:text-xl">✓</span>
              <span className="text-sm md:text-lg">Консультація експертів</span>
            </li>
            <li className="flex items-center gap-2 md:gap-3">
              <span className="text-green-500 text-lg md:text-xl">✓</span>
              <span className="text-sm md:text-lg">Швидка доставка</span>
            </li>
            <li className="flex items-center gap-2 md:gap-3">
              <span className="text-green-500 text-lg md:text-xl">✓</span>
              <span className="text-sm md:text-lg">Індивідуальний підхід</span>
            </li>
          </ul>
        </div>

        {/* Instagram Reviews Section */}
        <div className="mt-6 md:mt-12">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-4">
              Відгуки наших клієнтів
            </h2>
            <p className="text-sm md:text-lg text-gray-600 mb-4 md:mb-6">
              Дивіться реальні відгуки та результати в нашому Instagram
            </p>
            <a
              href="https://www.instagram.com/platansad.uaa?igsh=cmhhbG4zbjNkMTBr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2.5 md:px-6 md:py-3 rounded-full text-sm md:text-base font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
            >
              <Instagram className="w-5 h-5" />
              Підписуйтесь на @platansad.uaa
            </a>
          </div>

          {/* Sample Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Review 1 */}
            <div className="bg-white rounded-lg md:rounded-xl shadow-md p-4 md:p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <Instagram className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm md:text-base">@kateryna_garden</p>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                "Чудові рослини! Замовила туї Смарагд - прийшли в ідеальному стані. 
                Прийнялися швидко, ростуть добре. Дуже задоволена якістю! 🌿"
              </p>
              <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">2 тижні тому</p>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-white rounded-lg md:rounded-xl shadow-md p-4 md:p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <Instagram className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm md:text-base">@oleg_landshaft</p>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                "Професійний підхід! Допомогли підібрати рослини для проекту. 
                Бонсай Нівакі просто неймовірні - клієнти в захваті! 👏"
              </p>
              <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">1 місяць тому</p>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-white rounded-lg md:rounded-xl shadow-md p-4 md:p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <Instagram className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm md:text-base">@natalia_plants</p>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                "Самшит Арборесценс - просто краса! Доставка швидка, упаковка надійна. 
                Рекомендую всім, хто шукає якісні рослини! 💚"
              </p>
              <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">3 тижні тому</p>
              </div>
            </div>

            {/* Review 4 */}
            <div className="bg-white rounded-lg md:rounded-xl shadow-md p-4 md:p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <Instagram className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm md:text-base">@ihor_sad</p>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                "Замовляв хвойні рослини для ділянки. Всі прийнялися на 100%! 
                Якість супер, ціни адекватні. Буду замовляти ще! 🌲"
              </p>
              <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">1 місяць тому</p>
              </div>
            </div>

            {/* Review 5 */}
            <div className="bg-white rounded-lg md:rounded-xl shadow-md p-4 md:p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <Instagram className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm md:text-base">@marina_green</p>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                "Дуже вдячна за консультацію! Підібрали рослини під мій сад. 
                Топіарі формовані - це щось неймовірне! ❤️"
              </p>
              <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">2 місяці тому</p>
              </div>
            </div>

            {/* Review 6 */}
            <div className="bg-white rounded-lg md:rounded-xl shadow-md p-4 md:p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <Instagram className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm md:text-base">@andriy_garden_design</p>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                "Співпрацюємо вже рік - завжди на висоті! Великий вибір, 
                якість гарантована. Рекомендую всім ландшафтним дизайнерам! 🌿"
              </p>
              <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">2 місяці тому</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-6 md:mt-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg md:rounded-2xl p-5 md:p-8 text-center text-white">
            <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-4">
              Приєднуйтесь до нашої спільноти!
            </h3>
            <p className="text-sm md:text-lg mb-4 md:mb-6 opacity-90">
              Слідкуйте за нами в Instagram, щоб бачити нові надходження, корисні поради 
              та реальні фото від наших клієнтів
            </p>
            <a
              href="https://www.instagram.com/platansad.uaa?igsh=cmhhbG4zbjNkMTBr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-green-600 px-5 py-2.5 md:px-8 md:py-4 rounded-full text-sm md:text-lg font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
            >
              <Instagram className="w-5 h-5 md:w-6 md:h-6" />
              Перейти в Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;