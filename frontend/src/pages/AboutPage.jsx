import React from "react";
import { Instagram, Star } from "lucide-react";

const IG_URL =
  "https://www.instagram.com/platansad.uaa?igsh=cmhhbG4zbjNkMTBr";

const AboutPage = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-8 sm:py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center"
            data-testid="about-title"
          >
            Про нас
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Instagram + QR block */}
        <div className="bg-white rounded-2xl shadow-sm md:shadow-lg p-5 sm:p-7 md:p-10 mb-6 md:mb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Text */}
            <div className="md:col-span-7">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                Наш Instagram
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed mb-4">
                Скануйте QR-код або переходьте за посиланням — там реальні фото,
                новинки та відгуки клієнтів.
              </p>

              <a
                href={IG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-3 sm:px-6 sm:py-3.5 rounded-full text-sm sm:text-base font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 w-full sm:w-auto"
              >
                <Instagram className="w-5 h-5" />
                Підписуйтесь на @platansad.uaa
              </a>
            </div>

            {/* QR (clickable) */}
            <div className="md:col-span-5">
              <div className="mx-auto w-full max-w-[260px] sm:max-w-[300px]">
                <a
                  href={IG_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl bg-gray-50 border border-gray-100 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow focus:outline-none focus-visible:ring-4 focus-visible:ring-green-200"
                  aria-label="Відкрити Instagram PlatanSad"
                >
                  <img
                    src="/qr-platansad.png"
                    alt="QR код Instagram PlatanSad"
                    className="w-full h-auto rounded-xl"
                    loading="lazy"
                  />
                  <p className="mt-3 text-center text-xs sm:text-sm text-gray-500">
                    Натисніть або наведіть камеру
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-2 md:mt-6">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Відгуки наших клієнтів
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600">
              Реальні враження від покупців PlatanSad
            </p>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Review 1 */}
            <div className="bg-white rounded-xl shadow-md p-5 md:p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 md:w-12 md:h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shrink-0">
                  <Instagram className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">
                    @kateryna_garden
                  </p>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 md:w-4 md:h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                "Чудові рослини! Замовила туї Смарагд - прийшли в ідеальному стані.
                Прийнялися швидко, ростуть добре. Дуже задоволена якістю! 🌿"
              </p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">2 тижні тому</p>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-white rounded-xl shadow-md p-5 md:p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 md:w-12 md:h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shrink-0">
                  <Instagram className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">
                    @oleg_landshaft
                  </p>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 md:w-4 md:h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                "Професійний підхід! Допомогли підібрати рослини для проекту.
                Бонсай Нівакі просто неймовірні - клієнти в захваті! 👏"
              </p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">1 місяць тому</p>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-white rounded-xl shadow-md p-5 md:p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 md:w-12 md:h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shrink-0">
                  <Instagram className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">
                    @natalia_plants
                  </p>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 md:w-4 md:h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                "Самшит Арборесценс - просто краса! Доставка швидка, упаковка надійна.
                Рекомендую всім, хто шукає якісні рослини! 💚"
              </p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">3 тижні тому</p>
              </div>
            </div>

            {/* Review 4 */}
            <div className="bg-white rounded-xl shadow-md p-5 md:p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 md:w-12 md:h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shrink-0">
                  <Instagram className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">
                    @ihor_sad
                  </p>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 md:w-4 md:h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                "Замовляв хвойні рослини для ділянки. Всі прийнялися на 100%!
                Якість супер, ціни адекватні. Буду замовляти ще! 🌲"
              </p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">1 місяць тому</p>
              </div>
            </div>

            {/* Review 5 */}
            <div className="bg-white rounded-xl shadow-md p-5 md:p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 md:w-12 md:h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shrink-0">
                  <Instagram className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">
                    @marina_green
                  </p>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 md:w-4 md:h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                "Дуже вдячна за консультацію! Підібрали рослини під мій сад.
                Топіарі формовані - це щось неймовірне! ❤️"
              </p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">2 місяці тому</p>
              </div>
            </div>

            {/* Review 6 */}
            <div className="bg-white rounded-xl shadow-md p-5 md:p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 md:w-12 md:h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center shrink-0">
                  <Instagram className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm sm:text-base">
                    @andriy_garden_design
                  </p>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 md:w-4 md:h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                "Співпрацюємо вже рік - завжди на висоті! Великий вибір,
                якість гарантована. Рекомендую всім ландшафтним дизайнерам! 🌿"
              </p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">2 місяці тому</p>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-8 md:mt-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 sm:p-7 md:p-8 text-center text-white">
            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">
              Приєднуйтесь до нашої спільноти!
            </h3>
            <p className="text-sm sm:text-base md:text-lg mb-5 md:mb-6 opacity-90">
              Слідкуйте за нами в Instagram, щоб бачити нові надходження, корисні
              поради та реальні фото від наших клієнтів
            </p>
            <a
              href={IG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-green-600 px-5 py-3 sm:px-7 sm:py-3.5 md:px-8 md:py-4 rounded-full text-sm sm:text-base md:text-lg font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 w-full sm:w-auto"
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
