import { useState, useEffect } from 'react';
import { useReveal } from '../hooks/useReveal';
import LightLines from './LightLines';
import Lightbox from './Lightbox';

const API_BASE = import.meta.env.VITE_API_URL || '';

function Collage({ item, index, isVisible, onClick }) {
  const { title, subtitle, description, layout, images } = item;
  const hasImages = images && images.length > 0;

  const animClass = isVisible
    ? index % 2 === 0
      ? 'animate-slide-left'
      : 'animate-slide-right'
    : 'opacity-0';

  const baseClasses = 'relative w-full overflow-hidden bg-black group cursor-pointer border border-white/10';

  const handleClick = () => {
    if (onClick && hasImages) {
      onClick(images);
    }
  };

  if (layout === 'photo' && hasImages) {
    return (
      <div className={`${baseClasses} h-64 sm:h-80 md:h-96 ${animClass}`} style={{ animationDelay: `${index * 100}ms` }} onClick={handleClick}>
        <div className="absolute inset-0 grid grid-cols-2">
          {images.slice(0, 2).map((img, i) => (
            <img
              key={i}
              src={`${API_BASE}${img.url}`}
              alt={`${title} - фото ${i + 1}`}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
            />
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-24 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 border border-white/20 mx-auto mb-3 sm:mb-4 rotate-12 group-hover:rotate-45 transition-transform duration-500" />
            <h3 className="text-base sm:text-xl font-bold text-white mb-1 uppercase tracking-wide drop-shadow-lg">{title}</h3>
            {subtitle && <p className="text-xs sm:text-sm text-white/50">{subtitle}</p>}
          </div>
        </div>
        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 z-10">
          <p className="text-[10px] sm:text-xs text-white/60 line-clamp-1">{description}</p>
        </div>
      </div>
    );
  }

  if (layout === 'tall') {
    return (
      <div className={`${baseClasses} h-80 sm:h-[24rem] md:h-[28rem] ${animClass}`} style={{ animationDelay: `${index * 100}ms` }} onClick={handleClick}>
        <div className="absolute inset-0 grid grid-rows-3">
          <div className="bg-white/[0.03] group-hover:bg-white/[0.06] transition-colors duration-500" />
          <div className="bg-white/[0.06] group-hover:bg-white/[0.1] transition-colors duration-500" />
          <div className="bg-white/[0.03] group-hover:bg-white/[0.06] transition-colors duration-500" />
        </div>
        <div
          className="absolute inset-0 bg-white/[0.02]"
          style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border border-white/20 rotate-45 mb-4 sm:mb-6 mx-auto group-hover:rotate-[135deg] transition-transform duration-700" />
            <h3 className="text-base sm:text-xl font-bold text-white mb-1 uppercase tracking-wide">{title}</h3>
            {subtitle && <p className="text-xs sm:text-sm text-white/50">{subtitle}</p>}
          </div>
        </div>
        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
          <p className="text-[10px] sm:text-xs text-white/40 line-clamp-1">{description}</p>
        </div>
      </div>
    );
  }

  if (layout === 'wide') {
    return (
      <div className={`${baseClasses} h-64 sm:h-80 md:h-96 ${animClass}`} style={{ animationDelay: `${index * 100}ms` }} onClick={handleClick}>
        <div className="absolute inset-0 grid grid-cols-3">
          <div className="bg-white/[0.03] group-hover:bg-white/[0.06] transition-colors duration-500" />
          <div className="bg-white/[0.06] group-hover:bg-white/[0.1] transition-colors duration-500" />
          <div className="bg-white/[0.03] group-hover:bg-white/[0.06] transition-colors duration-500" />
        </div>
        <div className="absolute top-1/3 left-0 right-0 h-px bg-white/10" />
        <div className="absolute bottom-1/3 left-0 right-0 h-px bg-white/10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 border border-white/20 mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-500" />
            <h3 className="text-base sm:text-xl font-bold text-white mb-1 uppercase tracking-wide">{title}</h3>
            {subtitle && <p className="text-xs sm:text-sm text-white/50">{subtitle}</p>}
          </div>
        </div>
        <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
          <p className="text-[10px] sm:text-xs text-white/40 line-clamp-1">{description}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${baseClasses} h-64 sm:h-80 md:h-96 ${animClass}`} style={{ animationDelay: `${index * 100}ms` }} onClick={handleClick}>
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
        <div className="bg-white/[0.03] group-hover:bg-white/[0.06] transition-colors duration-500" />
        <div className="bg-white/[0.06] group-hover:bg-white/[0.1] transition-colors duration-500" />
        <div className="bg-white/[0.06] group-hover:bg-white/[0.1] transition-colors duration-500" />
        <div className="bg-white/[0.03] group-hover:bg-white/[0.06] transition-colors duration-500" />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-24 sm:h-24 border border-white/10 group-hover:scale-150 transition-transform duration-700" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 border border-white/20 mx-auto mb-3 sm:mb-4 rotate-12 group-hover:rotate-45 transition-transform duration-500" />
          <h3 className="text-base sm:text-xl font-bold text-white mb-1 uppercase tracking-wide">{title}</h3>
          {subtitle && <p className="text-xs sm:text-sm text-white/50">{subtitle}</p>}
        </div>
      </div>
      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
        <p className="text-[10px] sm:text-xs text-white/40 line-clamp-1">{description}</p>
      </div>
    </div>
  );
}

export default function Gallery() {
  const [ref, isVisible] = useReveal();
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/works/`)
      .then((res) => res.json())
      .then((data) => {
        setWorks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const openLightbox = (images) => {
    setLightbox({ images, index: 0 });
  };

  const closeLightbox = () => setLightbox(null);

  const prevImage = () => {
    setLightbox((prev) => {
      if (!prev) return prev;
      const newIndex = prev.index === 0 ? prev.images.length - 1 : prev.index - 1;
      return { ...prev, index: newIndex };
    });
  };

  const nextImage = () => {
    setLightbox((prev) => {
      if (!prev) return prev;
      const newIndex = prev.index === prev.images.length - 1 ? 0 : prev.index + 1;
      return { ...prev, index: newIndex };
    });
  };

  return (
    <section id="gallery" className="relative bg-black py-16 sm:py-24 scroll-mt-20">
      <LightLines />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="text-center mb-10 sm:mb-16">
          <h2 className={`text-2xl sm:text-4xl font-bold text-white mb-4 uppercase tracking-wider transition-all duration-800 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}>
            Наши работы
          </h2>
          <p className={`text-white/50 max-w-xl mx-auto text-xs sm:text-sm uppercase tracking-widest transition-all duration-800 delay-100 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}>
            {loading ? 'Загрузка...' : 'Нажмите на коллаж, чтобы посмотреть фото'}
          </p>
        </div>

        {!loading && works.length === 0 && (
          <div className="text-center text-white/30 text-sm uppercase tracking-widest py-20">
            Пока нет работ. Добавьте их в админ-панели.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2">
          {works.map((item, i) => (
            <Collage key={item.id} item={item} index={i} isVisible={isVisible} onClick={openLightbox} />
          ))}
        </div>
      </div>

      {lightbox && (
        <Lightbox
          images={lightbox.images.map((img) => `${API_BASE}${img.url}`)}
          currentIndex={lightbox.index}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </section>
  );
}