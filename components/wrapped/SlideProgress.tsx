"use client";

interface Props {
  total: number;
  current: number;
  onDotClick: (index: number) => void;
}

export default function SlideProgress({ total, current, onDotClick }: Props) {
  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDotClick(i)}
          className={`
            rounded-full transition-all duration-200
            ${
              i === current
                ? "w-1.5 h-4 bg-primary"
                : "w-1.5 h-1.5 bg-foreground/20 hover:bg-foreground/40"
            }
          `}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  );
}
