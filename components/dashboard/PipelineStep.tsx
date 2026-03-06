import { Check, Loader2, Circle, AlertCircle } from "lucide-react";

export type StepStatus = "idle" | "running" | "done" | "error";

interface Props {
  label: string;
  description: string;
  status: StepStatus;
}

const ICON: Record<StepStatus, React.ReactNode> = {
  idle: <Circle size={14} className="text-muted-foreground/40" />,
  running: <Loader2 size={14} className="text-primary animate-spin" />,
  done: <Check size={14} className="text-primary" />,
  error: <AlertCircle size={14} className="text-destructive" />,
};

const LABEL: Record<StepStatus, string> = {
  idle: "text-muted-foreground",
  running: "text-foreground",
  done: "text-foreground",
  error: "text-destructive",
};

export default function PipelineStep({ label, description, status }: Props) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <div className="mt-0.5 shrink-0">{ICON[status]}</div>
      <div className="flex-1 min-w-0">
        <p className={`font-display font-semibold text-sm ${LABEL[status]}`}>
          {label}
        </p>
        <p className="font-mono text-xs text-muted-foreground mt-0.5">
          {description}
        </p>
      </div>
      <div className="shrink-0 font-mono text-xs">
        {status === "running" && (
          <span className="text-muted-foreground">Running…</span>
        )}
        {status === "done" && <span className="text-primary">Done</span>}
        {status === "error" && <span className="text-destructive">Failed</span>}
      </div>
    </div>
  );
}
