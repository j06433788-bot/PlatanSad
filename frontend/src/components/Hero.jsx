          {/* Slide indicators — pills (smaller + shimmer) */}
          {len > 1 && (
            <div className="absolute bottom-1.5 sm:bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    go(i);
                    pauseTemporarily(4500);
                  }}
                  aria-label={`Слайд ${i + 1}`}
                  className={[
                    "relative overflow-hidden rounded-full transition-all duration-300",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                    i === index
                      ? "w-6 sm:w-8 h-[2px]"
                      : "w-3 sm:w-4 h-[2px] opacity-60 hover:opacity-90",
                  ].join(" ")}
                >
                  {i === index ? (
                    // Active pill — gradient + shimmer
                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-300 via-green-500 to-lime-300">
                      <span className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_linear_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                    </span>
                  ) : (
                    // Inactive pill
                    <span className="absolute inset-0 rounded-full bg-white/70" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* shimmer animation */}
          <style>{`
            @keyframes shimmer {
              0% { transform: translateX(-120%); }
              100% { transform: translateX(120%); }
            }
          `}</style>
