import { WrappedData } from "@/app/types/types";

export default function PullRequestsSlide({ data }: { data: WrappedData }) {
  return (
    <div className="slide flex flex-col justify-center bg-background px-8 sm:px-16 gap-8">
      <div>
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">
          Pull requests
        </p>
        <p className="font-display font-bold text-6xl sm:text-7xl text-foreground tracking-tight">
          {data.totalPRs}
        </p>
        <p className="font-mono text-sm text-muted-foreground mt-1">
          PRs opened in {data.year}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-sm">
        <div className="p-4 rounded-lg border border-border bg-card">
          <p className="font-display font-bold text-2xl text-foreground">
            {data.mergedPRs}
          </p>
          <p className="font-mono text-xs text-muted-foreground mt-1">merged</p>
        </div>
        <div className="p-4 rounded-lg border border-border bg-card">
          <p className="font-display font-bold text-2xl text-primary">
            {data.prMergeRate}%
          </p>
          <p className="font-mono text-xs text-muted-foreground mt-1">
            merge rate
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-sm">
        <div className="p-4 rounded-lg border border-border bg-card">
          <p className="font-display font-bold text-2xl text-foreground">
            {data.totalIssues}
          </p>
          <p className="font-mono text-xs text-muted-foreground mt-1">
            issues opened
          </p>
        </div>
        <div className="p-4 rounded-lg border border-border bg-card">
          <p className="font-display font-bold text-2xl text-foreground">
            {data.closedIssues}
          </p>
          <p className="font-mono text-xs text-muted-foreground mt-1">
            issues closed
          </p>
        </div>
      </div>
    </div>
  );
}
