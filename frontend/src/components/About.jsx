import { useReveal } from '../hooks/useReveal';
import LightLines from './LightLines';

const features = [
  {
    title: 'Гарантия качества',
    text: 'Предоставляем гарантию до 10 лет на монтаж и материалы',
  },
  {
    title: 'Быстрый монтаж',
    text: 'Стандартная установка от 2 часов, без пыли и грязи',
  },
  {
    title: 'Без посредников',
    text: 'Работаем напрямую — лучшие цены без наценок',
  },
  {
    title: 'Экологичность',
    text: 'Используем сертифицированные материалы без запаха',
  },
];

export default function About() {
  const [ref, isVisible] = useReveal();
  const [refStats, statsVisible] = useReveal();

  return (
    <section id="about" className="relative bg-black py-16 sm:py-24 scroll-mt-20">
      <LightLines />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
          <div ref={ref}>
            <h2 className={`text-2xl sm:text-4xl font-bold text-white mb-6 uppercase tracking-wider transition-all duration-800 ${
              isVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}>
              О компании
            </h2>
            <div className={`space-y-4 text-sm sm:text-base text-white/60 leading-relaxed transition-all duration-800 delay-100 ${
              isVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}>
              <p>
                Компания <span className="text-white font-medium">SamvelSite</span> 
                — профессиональный установщик натяжных потолков с опытом работы более 10 лет.
              </p>
              <p>
                Мы используем только качественные материалы от проверенных производителей 
                (Pongs, MSD, Clipso). Наши мастера проходят регулярное обучение и имеют 
                все необходимые сертификаты.
              </p>
              <p>
                Более 500 довольных клиентов — лучшая рекомендация нашей работы.
              </p>
            </div>

            <div ref={refStats} className={`grid grid-cols-3 gap-3 sm:gap-4 mt-8 sm:mt-10 transition-all duration-800 ${
              statsVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}>
              {[
                { value: '10+', label: 'Лет опыта' },
                { value: '500+', label: 'Проектов' },
                { value: '50+', label: 'Сотрудников' },
              ].map((stat) => (
                <div key={stat.label} className="border border-white/10 bg-black p-3 sm:p-4 text-center">
                  <div className="text-lg sm:text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-[10px] sm:text-xs text-white/40 mt-1 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 border border-white/10 bg-black">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={`border-b sm:border-r border-white/10 bg-black p-5 sm:p-6 transition-all duration-700 ${
                  isVisible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${200 + i * 100}ms` }}
              >
                <div className="w-8 h-px bg-white/30 mb-4" />
                <h3 className="text-sm font-semibold text-white mb-2 uppercase tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}