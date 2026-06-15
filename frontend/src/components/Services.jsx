import { useReveal } from '../hooks/useReveal';
import LightLines from './LightLines';

const services = [
  {
    title: 'Матовые потолки',
    description: 'Классическое матовое покрытие без бликов. Идеально для спален и гостиных.',
  },
  {
    title: 'Глянцевые потолки',
    description: 'Зеркальный блеск, визуально увеличивает пространство. Отлично для небольших комнат.',
  },
  {
    title: 'Сатиновые потолки',
    description: 'Нежный перламутровый отлив, сочетает матовость и легкий блеск.',
  },
  {
    title: 'Многоуровневые',
    description: 'Сложные конструкции с подсветкой. Зонирование и уникальный дизайн.',
  },
  {
    title: 'Теневые потолки',
    description: 'Современный тренд — парящий потолок с подсветкой по периметру.',
  },
  {
    title: 'Трековые светильники',
    description: 'Модульное освещениеа — добавьте немного футуризма в ваш дом.',
  },
];

export default function Services() {
  const [ref, isVisible] = useReveal();

  return (
    <section id="services" className="relative bg-black py-16 sm:py-24 scroll-mt-20">
      <LightLines />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="text-center mb-10 sm:mb-16">
          <h2 className={`text-2xl sm:text-4xl font-bold text-white mb-4 uppercase tracking-wider transition-all duration-800 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}>
            Наши услуги
          </h2>
          <p className={`text-white/50 max-w-xl mx-auto text-xs sm:text-sm uppercase tracking-widest transition-all duration-800 delay-100 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}>
            Предлагаем полный спектр услуг по установке натяжных потолков 
            любой сложности
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border border-white/10">
          {services.map((service, i) => (
            <div
              key={service.title}
              className={`border-b sm:border-r border-white/10 bg-black p-6 sm:p-8 transition-all duration-700 ${
                isVisible ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${100 + i * 80}ms` }}
            >
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 uppercase tracking-wide">
                {service.title}
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}