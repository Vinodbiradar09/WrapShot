import { WrappedData } from "@/app/types/types";

export default function PersonalitySlide({ data }: { data: WrappedData }) {
  const ai = data.aiSummary;
  if (!ai) return null;

  return (
    <div className="slide flex flex-col justify-center bg-background px-8 sm:px-16 gap-8">
      <div>
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">
          Developer personality
        </p>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{ai.personalityEmoji}</span>
          <p className="font-display font-bold text-3xl sm:text-4xl text-foreground tracking-tight">
            {ai.personalityType}
          </p>
        </div>
        <p className="font-mono text-sm text-muted-foreground max-w-md leading-relaxed">
          {ai.personalityDescription}
        </p>
      </div>

      <div>
        <p className="font-mono text-xs text-muted-foreground mb-3">
          Code quality
        </p>
        <div className="flex items-center gap-4">
          <p className="font-display font-bold text-5xl text-primary">
            {ai.codeQualityScore}
          </p>
          <div>
            <p className="font-display font-semibold text-sm text-foreground">
              {ai.codeQualityLabel}
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              out of 100
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 max-w-md">
        {ai.strengths.map((s) => (
          <div
            key={s.title}
            className="p-3 rounded-lg border border-border bg-card"
          >
            <p className="font-display font-semibold text-sm text-foreground mb-0.5">
              {s.icon} {s.title}
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              {s.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
