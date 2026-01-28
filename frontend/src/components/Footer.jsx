import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronUp,
  Phone,
  CreditCard,
  Info,
  MapPin,
  Send,
  ShieldCheck,
  Sparkles,
  Mail,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import AboutModal from './AboutModal';
import { useSettings } from '../context/SettingsContext';

/** Inline icons (no extra deps) */
const TelegramIcon = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path
      fill="currentColor"
      d="M21.8 4.2c.3-1.2-.9-2.1-2-1.7L3.1 9.2c-1.3.5-1.2 2.4.2 2.8l4.5 1.4 1.7 5.3c.4 1.2 2 1.5 2.8.6l2.6-2.9 4.6 3.4c1 .7 2.4.2 2.7-1l2.6-14.2Zm-4.4 3.7-7.9 7.2c-.2.2-.4.6-.3.9l.6 2.3c.1.5-.6.8-.9.3l-1.3-2.4a1 1 0 0 0-.5-.5L4 12l13.7-5.1c.5-.2.9.4.7.7Z"
    />
  </svg>
);

const ViberIcon = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path
      fill="currentColor"
      d="M16.3 2.5H7.7C5 2.5 2.8 4.7 2.8 7.4v6.4c0 2.7 2.2 4.9 4.9 4.9h1.1l2.3 2.3c.5.5 1.4.2 1.4-.6v-1.7h3.8c2.7 0 4.9-2.2 4.9-4.9V7.4c0-2.7-2.2-4.9-4.9-4.9Z"
    />
    <path
      fill="currentColor"
      d="M18.5 13.8c0 1.2-1 2.2-2.2 2.2H11.6v.9c0 .8-1 1.2-1.6.6l-1.5-1.5H7.7c-1.2 0-2.2-1-2.2-2.2V7.4c0-1.2 1-2.2 2.2-2.2h8.6c1.2 0 2.2 1 2.2 2.2v6.4Z"
    />
  </svg>
);

const TikTokIcon = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path
      fill="currentColor"
      d="M16.7 2h-2.3v13.1a3.3 3.3 0 1 1-2.3-3.1V9.7a5.6 5.6 0 1 0 4.6 5.5V8.1c1.2.9 2.7 1.5 4.3 1.6V7.4c-1.2-.1-2.3-.6-3-1.3-.8-.8-1.3-1.9-1.3-3.1Z"
    />
  </svg>
);

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path
      fill="currentColor"
      d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9A3.5 3.5 0 0 0 20 16.5v-9A3.5 3.5 0 0 0 16.5 4h-9Zm4.5 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm5.2-.9a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"
    />
  </svg>
);

const Footer = () => {
  const navigate = useNavigate();
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const { settings } = useSettings();

  const phone1 = settings?.phone1 || '+380 (63) 650-74-49';
  const phone2 = settings?.phone2 || '+380 (95) 251-03-47';

  const tel1 = useMemo(() => `tel:${(phone1 || '').replace(/\s/g, '')}`, [phone1]);
  const tel2 = useMemo(() => `tel:${(phone2 || '').replace(/\s/g, '')}`, [phone2]);

  const siteName = settings?.siteName || 'PlatanSad';

  // Newsletter demo state
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubmitting(true);
    try {
      // TODO: connect to backend
      await new Promise((r) => setTimeout(r, 450));
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 2800);
    } finally {
      setSubmitting(false);
    }
  };

  // Mobile accordion: ALL CLOSED by default (minimal height)
  const [openKey, setOpenKey] = useState(''); // '' | 'contacts' | 'info' | 'premium'
  const toggle = (key) => setOpenKey((prev) => (prev === key ? '' : key));

  // Messengers
  const telegramUrl = settings?.telegramUrl;
  const viberUrl = settings?.viberUrl;
  const instagramUrl = settings?.instagramUrl;
  const tiktokUrl = settings?.tiktokUrl;

  const messengerButtons = [
    {
      key: 'telegram',
      label: 'Telegram',
      href: telegramUrl,
      icon: TelegramIcon,
      ring: 'ring-sky-400/20',
      bg: 'bg-sky-500/15',
      text: 'text-sky-200',
      hover: 'hover:bg-sky-500/20',
    },
    {
      key: 'viber',
      label: 'Viber',
      href: viberUrl,
      icon: ViberIcon,
      ring: 'ring-violet-400/20',
      bg: 'bg-violet-500/15',
      text: 'text-violet-200',
      hover: 'hover:bg-violet-500/20',
    },
    {
      key: 'tiktok',
      label: 'TikTok',
      href: tiktokUrl,
      icon: TikTokIcon,
      ring: 'ring-white/15',
      bg: 'bg-white/10',
      text: 'text-white',
      hover: 'hover:bg-white/15',
    },
    {
      key: 'instagram',
      label: 'Instagram',
      href: instagramUrl,
      icon: InstagramIcon,
      ring: 'ring-pink-400/20',
      bg: 'bg-pink-500/15',
      text: 'text-pink-200',
      hover: 'hover:bg-pink-500/20',
    },
  ].filter((b) => !!b.href);

  return (
    <>
      <footer className="relative overflow-hidden bg-[#070b09] text-white">
        {/* Premium background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-80 w-[44rem] -translate-x-1/2 rounded-full bg-green-500/18 blur-3xl" />
          <div className="absolute -bottom-44 right-[-8rem] h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] via-transparent to-black/40" />
        </div>

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.16) 1px, transparent 1px)',
            backgroundSize: '38px 38px',
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4">
          {/* Top ribbon (tighter on mobile) */}
          <div className="pt-6 sm:pt-8 md:pt-12">
            <div className="flex flex-col gap-3 rounded-3xl bg-white/5 p-3 ring-1 ring-white/10 backdrop-blur-md sm:p-4 md:flex-row md:items-center md:justify-between md:p-6">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-green-500/15 ring-1 ring-green-400/20 md:h-10 md:w-10">
                  <Sparkles className="h-4 w-4 text-green-300 md:h-5 md:w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white/90 sm:text-base">
                    {siteName} — розсадник
                  </p>
                  <p className="mt-0.5 text-xs text-white/65 sm:text-sm">
                    Поради • Підбір • Підтримка
                  </p>
                </div>
              </div>

              {/* Buttons: compact row on modern phones */}
              <div className="grid w-full grid-cols-2 gap-2 md:w-auto">
                <button
                  onClick={() => navigate('/catalog')}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-3 py-2.5 text-xs font-semibold text-white shadow-[0_16px_34px_rgba(34,197,94,0.16)] ring-1 ring-green-400/20 transition hover:bg-green-600/90 active:scale-[0.98] sm:text-sm sm:px-4 sm:py-3"
                >
                  <Send className="h-4 w-4" />
                  Каталог
                </button>
                <button
                  onClick={() => navigate('/contacts')}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white/6 px-3 py-2.5 text-xs font-semibold text-white/90 ring-1 ring-white/12 transition hover:bg-white/10 active:scale-[0.98] sm:text-sm sm:px-4 sm:py-3"
                >
                  <MapPin className="h-4 w-4" />
                  Контакти
                </button>
              </div>
            </div>
          </div>

          {/* DESKTOP: premium columns */}
          <div className="hidden gap-8 py-10 md:grid md:grid-cols-12">
            {/* Brand */}
            <div className="md:col-span-4">
              <div className="inline-flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-2 ring-1 ring-white/10">
                <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_18px_rgba(34,197,94,0.45)]" />
                <p className="text-sm font-semibold tracking-wide">{siteName}</p>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-white/70">
                Приватний розсадник декоративних рослин. Підкажемо найкращі варіанти під ваші
                умови та бюджет.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsAboutModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-white/6 px-3 py-2 text-sm font-semibold text-green-300 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-green-200"
                >
                  <Info className="h-4 w-4" />
                  Про розсадник
                </button>

                <span className="inline-flex items-center gap-2 rounded-xl bg-white/6 px-3 py-2 text-sm font-semibold text-white/80 ring-1 ring-white/10">
                  <ShieldCheck className="h-4 w-4 text-green-300" />
                  Гарантія якості
                </span>
              </div>
            </div>

            {/* Contacts */}
            <div className="md:col-span-4">
              <p className="text-sm font-semibold text-white/90">Контакти</p>

              <div className="mt-4 space-y-3">
                <a
                  href={tel1}
                  className="group flex items-center justify-between gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 transition hover:bg-white/10"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-green-500/15 ring-1 ring-green-400/20">
                      <Phone className="h-4 w-4 text-green-300" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-white/60">Телефон</p>
                      <p className="truncate font-semibold tracking-wide text-white">{phone1}</p>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-white/60 transition group-hover:text-white/80">
                    Дзвінок
                  </span>
                </a>

                <a
                  href={tel2}
                  className="group flex items-center justify-between gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 transition hover:bg-white/10"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-green-500/15 ring-1 ring-green-400/20">
                      <Phone className="h-4 w-4 text-green-300" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-white/60">Телефон</p>
                      <p className="truncate font-semibold tracking-wide text-white">{phone2}</p>
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-white/60 transition group-hover:text-white/80">
                    Дзвінок
                  </span>
                </a>

                <button
                  onClick={() => navigate('/contacts')}
                  className="flex w-full items-center gap-3 rounded-2xl bg-white/5 p-4 text-left ring-1 ring-white/10 transition hover:bg-white/10"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/6 ring-1 ring-white/10">
                    <MapPin className="h-4 w-4 text-white/70" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-white/60">Адреса, графік, месенджери</p>
                    <p className="truncate font-semibold text-white/90">Відкрити “Контакти”</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Premium */}
            <div className="md:col-span-4">
              <p className="text-sm font-semibold text-white/90">Преміум-оновлення</p>

              <div className="mt-4 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-green-500/15 ring-1 ring-green-400/20">
                    <Mail className="h-4 w-4 text-green-300" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white/90">Добірки та акції</p>
                    <p className="mt-1 text-sm text-white/65">1–2 листи/місяць. Без спаму.</p>
                  </div>
                </div>

                <form onSubmit={handleSubscribe} className="mt-4 space-y-3">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="Email для підписки"
                      className="w-full flex-1 rounded-2xl bg-black/25 px-4 py-3 text-sm text-white placeholder:text-white/40 ring-1 ring-white/10 outline-none transition focus:ring-2 focus:ring-green-400/30"
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(34,197,94,0.18)] ring-1 ring-green-400/20 transition hover:bg-green-600/90 disabled:opacity-60 active:scale-[0.98] sm:w-auto"
                    >
                      <Send className="h-4 w-4" />
                      {submitting ? 'Надсилаю…' : 'Підписатися'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-3 text-xs text-white/55">
                    <span className="inline-flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-300" />
                      Відписка будь-коли
                    </span>
                    {subscribed && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-200 ring-1 ring-green-400/20">
                        Готово ✅
                      </span>
                    )}
                  </div>
                </form>
              </div>

              <div className="mt-3 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                <div className="flex items-center gap-2 text-white/80">
                  <CreditCard className="h-4 w-4" />
                  <p className="text-sm font-semibold">Оплата</p>
                </div>
                <p className="mt-2 text-sm text-white/65">Приймаємо до оплати:</p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <img
                    src="/mastercard.webp"
                    alt="Mastercard"
                    className="h-8 w-auto object-contain opacity-90 transition hover:opacity-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* MOBILE: ULTRA-MINIMAL height (all collapsed by default) */}
          <div className="py-3 md:hidden">
            {/* Quick icon row */}
            <div className="grid grid-cols-4 gap-2">
              <a
                href={tel1}
                className="flex items-center justify-center rounded-2xl bg-white/5 py-2.5 ring-1 ring-white/10"
                aria-label="Подзвонити"
              >
                <Phone className="h-5 w-5 text-green-300" />
              </a>

              <button
                onClick={() => navigate('/contacts')}
                className="flex items-center justify-center rounded-2xl bg-white/5 py-2.5 ring-1 ring-white/10"
                aria-label="Контакти"
              >
                <MapPin className="h-5 w-5 text-white/80" />
              </button>

              <button
                onClick={() => setIsAboutModalOpen(true)}
                className="flex items-center justify-center rounded-2xl bg-white/5 py-2.5 ring-1 ring-white/10"
                aria-label="Про розсадник"
              >
                <Info className="h-5 w-5 text-green-300" />
              </button>

              <button
                onClick={() => toggle('premium')}
                className="flex items-center justify-center rounded-2xl bg-white/5 py-2.5 ring-1 ring-white/10"
                aria-label="Підписка"
              >
                <Mail className="h-5 w-5 text-white/80" />
              </button>
            </div>

            {/* Accordion */}
            <div className="mt-3 space-y-2">
              {[
                { key: 'contacts', title: 'Контакти' },
                { key: 'info', title: 'Інформація' },
                { key: 'premium', title: 'Преміум-оновлення' },
              ].map((sec) => (
                <div key={sec.key} className="rounded-2xl bg-white/5 ring-1 ring-white/10">
                  <button
                    onClick={() => toggle(sec.key)}
                    className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left"
                  >
                    <span className="text-sm font-semibold text-white/90">{sec.title}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-white/70 transition ${
                        openKey === sec.key ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {openKey === sec.key && (
                    <div className="px-3 pb-3">
                      {sec.key === 'contacts' && (
                        <div className="space-y-2">
                          <a
                            href={tel1}
                            className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2.5 ring-1 ring-white/10"
                          >
                            <span className="text-xs text-white/70">Телефон 1</span>
                            <span className="text-xs font-semibold text-white">{phone1}</span>
                          </a>
                          <a
                            href={tel2}
                            className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2.5 ring-1 ring-white/10"
                          >
                            <span className="text-xs text-white/70">Телефон 2</span>
                            <span className="text-xs font-semibold text-white">{phone2}</span>
                          </a>
                          <button
                            onClick={() => navigate('/contacts')}
                            className="w-full rounded-2xl bg-white/6 px-3 py-2.5 text-xs font-semibold text-white/90 ring-1 ring-white/10"
                          >
                            Відкрити контакти/графік
                          </button>
                        </div>
                      )}

                      {sec.key === 'info' && (
                        <div className="space-y-2">
                          <button
                            onClick={() => setIsAboutModalOpen(true)}
                            className="w-full rounded-2xl bg-white/6 px-3 py-2.5 text-xs font-semibold text-green-300 ring-1 ring-white/10"
                          >
                            Про розсадник
                          </button>

                          <div className="flex items-center justify-between rounded-2xl bg-white/6 px-3 py-2.5 ring-1 ring-white/10">
                            <span className="text-xs font-semibold text-white/85">Гарантія якості</span>
                            <ShieldCheck className="h-4 w-4 text-green-300" />
                          </div>

                          <div className="flex items-center justify-between rounded-2xl bg-white/6 px-3 py-2.5 ring-1 ring-white/10">
                            <span className="text-xs text-white/70">Оплата</span>
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-white/70" />
                              <img
                                src="/mastercard.webp"
                                alt="Mastercard"
                                className="h-6 w-auto object-contain opacity-90"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {sec.key === 'premium' && (
                        <div className="space-y-2">
                          <form onSubmit={handleSubscribe} className="space-y-2">
                            <input
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              type="email"
                              placeholder="Email"
                              className="w-full rounded-2xl bg-black/25 px-3 py-2.5 text-xs text-white placeholder:text-white/40 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-green-400/30"
                            />
                            <button
                              type="submit"
                              disabled={submitting}
                              className="w-full rounded-2xl bg-green-600 px-3 py-2.5 text-xs font-semibold text-white ring-1 ring-green-400/20 disabled:opacity-60"
                            >
                              {submitting ? 'Надсилаю…' : 'Підписатися'}
                            </button>

                            <div className="flex items-center justify-between text-[11px] text-white/55">
                              <span className="inline-flex items-center gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-300" />
                                Без спаму
                              </span>
                              {subscribed && (
                                <span className="rounded-full bg-green-500/10 px-2 py-0.5 font-semibold text-green-200 ring-1 ring-green-400/20">
                                  ✅
                                </span>
                              )}
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pb-24 sm:pb-10">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="flex flex-col items-center justify-between gap-2 pt-4 text-center sm:flex-row sm:text-left">
              <p className="text-[11px] text-white/55">© 2026 {siteName}. Всі права захищено.</p>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/70 ring-1 ring-white/10">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_14px_rgba(34,197,94,0.55)]" />
                Онлайн
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating messengers (left) */}
      {messengerButtons.length > 0 && (
        <div className="fixed bottom-5 left-4 z-50 flex flex-col gap-2 sm:bottom-6 sm:left-6">
          {messengerButtons.map((b) => {
            const Icon = b.icon;
            return (
              <a
                key={b.key}
                href={b.href}
                target="_blank"
                rel="noreferrer"
                className={`group flex h-11 w-11 items-center justify-center rounded-2xl ${b.bg} ${b.text} shadow-2xl ring-1 ${b.ring} backdrop-blur-md transition ${b.hover} active:scale-95 sm:h-12 sm:w-12`}
                aria-label={b.label}
                title={b.label}
              >
                <Icon className="h-5 w-5" />
              </a>
            );
          })}
        </div>
      )}

      {/* Scroll to top (right) */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-5 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white shadow-2xl ring-1 ring-white/15 backdrop-blur-md transition hover:bg-white/15 active:scale-95 sm:bottom-6 sm:right-6 sm:h-12 sm:w-12"
        aria-label="Вгору"
        data-testid="scroll-to-top"
      >
        <ChevronUp className="h-6 w-6" />
      </button>

      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
    </>
  );
};

export default Footer;
