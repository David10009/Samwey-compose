export default function Footer() {
  return (
    <footer className="bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <a href="#" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-white flex items-center justify-center text-black font-bold text-xs">
                S
              </div>
              <span className="text-base font-semibold text-white">
                Samvey
              </span>
            </a>
            <p className="text-xs text-white/40 leading-relaxed">
              Монтаж натяжных потолков по Иркутской области
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">
              Навигация
            </h4>
            <ul className="space-y-2">
              {[
                { label: 'Услуги', href: '#services' },
                { label: 'Галерея', href: '#gallery' },
                { label: 'О нас', href: '#about' },
                { label: 'Контакты', href: '#contact' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/40 hover:text-white/70 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">
              Контакты
            </h4>
            <ul className="space-y-2 text-sm text-white/40">
              <li>+7 (999) 123-45-67</li>
              <li>info@samvelsite.ru</li>
              <li>г. Москва, ул. Строителей, 15</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-center text-xs text-white/30">
          © {new Date().getFullYear()} Samvey. Все права защищены.
        </div>
      </div>
    </footer>
  );
}