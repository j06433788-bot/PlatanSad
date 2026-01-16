import React from 'react';
import { X, Sprout, Shield, Truck, Award, Users } from 'lucide-react';

const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 relative">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              PlatanSad – усе для вашого саду та городу
            </h2>
            <p className="text-green-100 text-sm md:text-base">
              Розсадник декоративних і садових рослин
            </p>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors z-20"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Intro */}
          <div className="mb-5">
            <p className="text-gray-700 leading-relaxed text-base md:text-lg">
              <strong className="text-green-600">PlatanSad</strong> — це місце, де
              любов до рослин поєднується з досвідом та якістю. Ми допомагаємо
              створювати сади, які тішать роками — від першої посадки до
              сформованого ландшафту.
            </p>
          </div>

          {/* What we offer */}
          <div className="mb-5">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              Що ви знайдете у нас?
            </h3>

            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Sprout className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    Декоративні та хвойні рослини
                  </p>
                  <p className="text-sm text-gray-600">
                    Туї, ялини, самшит, нівакі, формовані та класичні рослини
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Sprout className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    Листопадні дерева та кущі
                  </p>
                  <p className="text-sm text-gray-600">
                    Для саду, двору та ландшафтного дизайну
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    Засоби догляду та захисту
                  </p>
                  <p className="text-sm text-gray-600">
                    Підживки, захист, рекомендації по догляду
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Why choose us */}
          <div className="mb-5">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
              Чому обирають нас?
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-xl flex gap-3">
                <Award className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold">Якість та досвід</p>
                  <p className="text-sm text-gray-600">
                    Перевірені рослини з правильним доглядом
                  </p>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-xl flex gap-3">
                <Users className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold">Живі консультації</p>
                  <p className="text-sm text-gray-600">
                    Підкажемо, що саме підійде для вашої ділянки
                  </p>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-xl flex gap-3">
                <Truck className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold">Швидка доставка</p>
                  <p className="text-sm text-gray-600">
                    Надійне пакування по всій Україні
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-4 text-center text-white">
            <h3 className="text-lg font-bold mb-1">
              Розвивайте свій сад разом із PlatanSad
            </h3>
            <p className="text-green-100 text-sm mb-3">
              Якісні рослини та чесні поради
            </p>
            <button
              onClick={onClose}
              className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-green-50"
            >
              Перейти до каталогу
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
