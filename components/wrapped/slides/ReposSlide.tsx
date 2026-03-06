import { WrappedData } from "@/app/types/types";
import { Star, GitFork } from "lucide-react";

export default function ReposSlide({ data }: { data: WrappedData }) {
  return (
    <div className="slide flex flex-col justify-center bg-background px-8 sm:px-16 gap-8">
      <div>
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">
          Top repos
        </p>
        <p className="font-display font-bold text-4xl text-foreground tracking-tight">
          {data.totalRepos} repos active
        </p>
      </div>

      <div className="flex flex-col gap-3 max-w-lg">
        {data.topRepos.map((repo, i) => (
          <div
            key={repo.name}
            className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card"
          >
            <span className="font-mono text-xs text-muted-foreground w-5 shrink-0">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-sm text-foreground truncate">
                {repo.name}
              </p>
              <p className="font-mono text-xs text-muted-foreground mt-0.5">
                {repo.language ?? "—"} · {repo.commits} commits
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                <Star size={11} /> {repo.stars}
              </span>
              <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                <GitFork size={11} /> {repo.forks}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
