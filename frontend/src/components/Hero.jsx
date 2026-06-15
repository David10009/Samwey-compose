import { useReveal } from '../hooks/useReveal';
import LightLines from './LightLines';

export default function Hero() {
  const [ref, isVisible] = useReveal({ threshold: 0.1 });

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <LightLines />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem',
        }}
      />

      <div ref={ref} className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 mb-6 border border-white/20 text-xs text-white/60 transition-all duration-1000 ${
            isVisible ? 'animate-fade-in' : 'opacity-0'
          }`}
        >
          <span className="w-1.5 h-1.5 bg-white animate-pulse-glow" />
          Работаем по всей Иркутской области
        </div>

        <h1
          className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight mb-6 transition-all duration-1000 delay-100 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          Идеальные натяжные
          <br />
          <span className="font-light italic">
            потолки для вашего дома
          </span>
        </h1>

        <p
          className={`max-w-2xl mx-auto text-base sm:text-xl text-white/60 mb-8 sm:mb-10 leading-relaxed transition-all duration-1000 delay-200 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          Профессиональный монтаж натяжных потолков. Гарантия качества, 
          доступные цены, более 500 выполненных проектов.
        </p>

        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 transition-all duration-1000 delay-300 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          <a
            href="#contact"
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-medium bg-white text-black hover:bg-white/80 transition-all"
          >
            Связаться с нами
          </a>
          <a
            href="#gallery"
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-medium bg-black border border-white/30 hover:border-white text-white/70 hover:text-white transition-colors"
          >
            Наши работы
          </a>
        </div>

        <div
          className={`mt-12 sm:mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto transition-all duration-1000 delay-500 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          {[
            { value: '500+', label: 'Проектов' },
            { value: '10 лет', label: 'На рынке' },
            { value: '98%', label: 'Довольных клиентов' },
          ].map((stat) => (
            <div key={stat.label} className="bg-black/80 px-2 py-2 sm:p-4">
              <div className="text-xl sm:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-[10px] sm:text-xs text-white/40 mt-0.5 sm:mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}