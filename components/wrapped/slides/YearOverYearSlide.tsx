import { WrappedData } from "@/app/types/types";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

function Delta({ value, label }: { value: number; label: string }) {
  const positive = value > 0;
  const zero = value === 0;
  return (
    <div className="p-4 rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 mb-1">
        {zero ? (
          <Minus size={13} className="text-muted-foreground" />
        ) : positive ? (
          <TrendingUp size={13} className="text-primary" />
        ) : (
          <TrendingDown size={13} className="text-destructive" />
        )}
        <p
          className={`font-display font-bold text-xl ${
            zero
              ? "text-muted-foreground"
              : positive
                ? "text-primary"
                : "text-destructive"
          }`}
        >
          {positive ? "+" : ""}
          {value}
        </p>
      </div>
      <p className="font-mono text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export default function YearOverYearSlide({ data }: { data: WrappedData }) {
  const { yoy, year } = data;
  if (!yoy) return null;

  return (
    <div className="slide flex flex-col justify-center bg-background px-8 sm:px-16 gap-8">
      <div>
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">
          Year over year
        </p>
        <p className="font-display font-bold text-4xl text-foreground tracking-tight">
          vs {year - 1}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg">
        <Delta value={yoy.commitsDelta} label="commits" />
        <Delta value={yoy.prsDelta} label="pull requests" />
        <Delta value={yoy.streakDelta} label="streak days" />
      </div>
    </div>
  );
}
