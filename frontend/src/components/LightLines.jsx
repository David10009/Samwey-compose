import { useReveal } from '../hooks/useReveal';

const LINE_COUNT = 5;

export default function LightLines({ className = '' }) {
  const [ref, isVisible] = useReveal({ threshold: 0.05 });

  return (
    <div
      ref={ref}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {/* Горизонтальные линии */}
      {[25, 50, 75].map((top, i) => (
        <div
          key={`h-${i}`}
          className={`absolute left-0 right-0 transition-opacity duration-1000 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            top: `${top}%`,
            height: '1px',
            background: 'rgba(255,255,255,0.2)',
            transitionDelay: `${i * 100}ms`,
          }}
        />
      ))}

      {/* Вертикальные линии */}
      {Array.from({ length: LINE_COUNT }).map((_, i) => {
        const left = (100 / (LINE_COUNT + 1)) * (i + 1);
        return (
          <div
            key={`v-${i}`}
            className={`absolute top-0 bottom-0 transition-opacity duration-1000 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              left: `${left}%`,
              transform: 'translateX(-50%)',
              width: '1px',
              background: 'rgba(255,255,255,0.2)',
              transitionDelay: `${i * 150}ms`,
            }}
          />
        );
      })}
    </div>
  );
}