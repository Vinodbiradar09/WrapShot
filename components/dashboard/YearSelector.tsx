"use client";

interface Props {
  selected: number[];
  onChange: (years: number[]) => void;
  disabled?: boolean;
}

const CURRENT = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT - 2019 }, (_, i) => CURRENT - i);

export default function YearSelector({ selected, onChange, disabled }: Props) {
  const toggle = (year: number) => {
    if (disabled) return;
    onChange(
      selected.includes(year)
        ? selected.filter((y) => y !== year)
        : [...selected, year],
    );
  };

  return (
    <div>
      <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-3">
        Select years
      </p>
      <div className="flex flex-wrap gap-2">
        {YEARS.map((year) => {
          const active = selected.includes(year);
          return (
            <button
              key={year}
              onClick={() => toggle(year)}
              disabled={disabled}
              className={`
                h-9 px-4 rounded-md font-mono text-sm border
                transition-all duration-150
                disabled:opacity-40 disabled:cursor-not-allowed
                ${
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                }
              `}
            >
              {year}
            </button>
          );
        })}
      </div>
    </div>
  );
}
