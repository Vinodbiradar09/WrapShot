import { WrappedData } from "@/app/types/types";

export default function RoastSlide({ data }: { data: WrappedData }) {
  const ai = data.aiSummary;
  if (!ai) return null;

  return (
    <div className="slide flex flex-col justify-center bg-background px-8 sm:px-16 gap-8">
      <div>
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-6">
          Honest feedback
        </p>

        <div className="p-5 rounded-lg border border-border bg-card mb-4 max-w-lg">
          <p className="font-mono text-xs text-muted-foreground mb-2">
            🔥 Roast
          </p>
          <p className="font-display font-semibold text-base text-foreground leading-snug">
            {ai.roastLine}
          </p>
        </div>

        <div className="p-5 rounded-lg border border-primary/20 bg-primary/5 max-w-lg">
          <p className="font-mono text-xs text-primary mb-2">✨ Real talk</p>
          <p className="font-display font-semibold text-base text-foreground leading-snug">
            {ai.complimentLine}
          </p>
        </div>
      </div>

      <div>
        <p className="font-mono text-xs text-muted-foreground mb-3">
          Fun facts
        </p>
        <div className="flex flex-col gap-2 max-w-md">
          {ai.funFacts.map((fact, i) => (
            <p key={i} className="font-mono text-sm text-foreground">
              → {fact}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
