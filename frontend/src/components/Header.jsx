import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: 'Услуги', href: '#services' },
    { label: 'Галерея', href: '#gallery' },
    { label: 'О нас', href: '#about' },
    { label: 'Контакты', href: '#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/90 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-20">
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white flex items-center justify-center text-black font-bold text-xs sm:text-sm group-hover:scale-105 transition-transform">
              S
            </div>
            <span className="text-base sm:text-lg font-semibold text-white tracking-tight">
              Samvel<span className="font-light">Site</span>
            </span>
          </a>

          {/* Десктоп навигация */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Кнопка бургера для мобильных */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Меню"
          >
            <span className={`block w-5 h-px bg-white transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
            <span className={`block w-5 h-px bg-white transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-px bg-white transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? 'max-h-64 border-t border-white/10' : 'max-h-0'
        }`}
      >
        <nav className="flex flex-col px-4 py-3 gap-2 bg-black/95">
          {links.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-white/60 hover:text-white transition-colors py-2"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}