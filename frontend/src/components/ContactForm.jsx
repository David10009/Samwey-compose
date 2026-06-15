import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import LightLines from './LightLines';
import { submitContact } from '../api/client';

const fabricOptions = ['Сатин', 'Глянец', 'Мат', 'Другое'];

export default function ContactForm() {
  const [ref, isVisible] = useReveal();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    fabric_type: '',
    spotlight_count: 0,
    chandelier_count: 0,
    pipe_count: 0,
    corner_count: 0,
    description: '',
  });
  const [status, setStatus] = useState('idle');
  const [validationError, setValidationError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes('count') ? (value === '' ? 0 : Math.max(0, parseInt(value) || 0)) : value,
    }));
    if (name === 'corner_count') {
      setValidationError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError(null);

    const cornerVal = Number(formData.corner_count);
    if (cornerVal < 3) {
      setValidationError('Количество углов не может быть меньше 3');
      return;
    }

    setStatus('loading');
    const payload = {
      ...formData,
      spotlight_count: Number(formData.spotlight_count) || 0,
      chandelier_count: Number(formData.chandelier_count) || 0,
      pipe_count: Number(formData.pipe_count) || 0,
      corner_count: cornerVal || 0,
    };
    try {
      await submitContact(payload);
      setStatus('success');
      setFormData({
        name: '',
        phone: '',
        address: '',
        fabric_type: '',
        spotlight_count: 0,
        chandelier_count: 0,
        pipe_count: 0,
        corner_count: 0,
        description: '',
      });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section id="contact" className="relative bg-black py-16 sm:py-24 scroll-mt-20">
      <LightLines />
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
          <div>
            <h2 className={`text-2xl sm:text-4xl font-bold text-white mb-6 uppercase tracking-wider transition-all duration-800 ${
              isVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}>
              Оставьте заявку
            </h2>
            <p className={`text-white/50 mb-8 sm:mb-10 leading-relaxed text-xs sm:text-sm uppercase tracking-wider transition-all duration-800 delay-100 ${
              isVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}>
              Заполните форму, и наш специалист свяжется с вами в ближайшее время
              для уточнения деталей и бесплатного замера.
            </p>

            <div className={`space-y-4 sm:space-y-6 transition-all duration-800 delay-200 ${
              isVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}>
              <div className="flex items-center gap-3 text-white/50 hover:text-white/70 transition-colors">
                <div className="w-8 h-8 sm:w-10 sm:h-10 border border-white/20 flex items-center justify-center text-white/50 shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm">+7 (999) 123-45-67</span>
              </div>
              <div className="flex items-center gap-3 text-white/50 hover:text-white/70 transition-colors">
                <div className="w-8 h-8 sm:w-10 sm:h-10 border border-white/20 flex items-center justify-center text-white/50 shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm">г. Москва, ул. Строителей, 15</span>
              </div>
              <div className="flex items-center gap-3 text-white/50 hover:text-white/70 transition-colors">
                <div className="w-8 h-8 sm:w-10 sm:h-10 border border-white/20 flex items-center justify-center text-white/50 shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm">Ежедневно с 9:00 до 21:00</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={`border border-white/10 bg-black p-5 sm:p-8 space-y-4 sm:space-y-5 transition-all duration-800 delay-300 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Имя *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Ваше имя"
                  className="w-full px-3 py-2.5 bg-transparent border border-white/20 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Телефон *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+7 (---) --- -- --"
                  className="w-full px-3 py-2.5 bg-transparent border border-white/20 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Адрес</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="г. Москва, ул. Примерная, д. 1"
                className="w-full px-3 py-2.5 bg-transparent border border-white/20 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Тип полотна</label>
              <div className="flex gap-2 flex-wrap">
                {fabricOptions.map((fabric) => (
                  <button
                    key={fabric}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        fabric_type: prev.fabric_type === fabric ? '' : fabric,
                      }))
                    }
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm border transition-all duration-300 ${
                      formData.fabric_type === fabric
                        ? 'bg-white text-black border-white scale-105'
                        : 'bg-transparent border-white/20 text-white/50 hover:border-white/50'
                    }`}
                  >
                    {fabric}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[
                { label: 'Лампочки', name: 'spotlight_count' },
                { label: 'Люстры', name: 'chandelier_count' },
                { label: 'Трубы', name: 'pipe_count' },
                { label: 'Углы', name: 'corner_count' },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">{field.label}</label>
                  <input
                    type="number"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-3 py-2.5 bg-transparent border border-white/20 text-sm text-white text-center focus:outline-none focus:border-white transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider">Описание</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Дополнительные пожелания"
                className="w-full px-3 py-2.5 bg-transparent border border-white/20 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3 text-sm font-medium bg-white text-black hover:bg-white/80 disabled:bg-white/50 transition-all duration-300 uppercase tracking-wider"
            >
              {status === 'loading' ? 'Отправка...' : 'Отправить заявку'}
            </button>

            {validationError && (
              <p className="text-sm text-red-400 text-center">{validationError}</p>
            )}
            {status === 'success' && (
              <p className="text-sm text-white/70 text-center animate-fade-in">✓ Заявка отправлена! Мы свяжемся с вами.</p>
            )}
            {status === 'error' && (
              <p className="text-sm text-white/50 text-center animate-fade-in">✗ Ошибка отправки. Попробуйте позже.</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}