import {
  GitCommit,
  Flame,
  Code2,
  GitPullRequest,
  BrainCircuit,
  TrendingUp,
} from "lucide-react";

const FEATURES = [
  {
    icon: GitCommit,
    title: "Commit history",
    description: "Total commits per year broken down by month and repo.",
  },
  {
    icon: Flame,
    title: "Streaks",
    description: "Longest streak, most active month, consistency score.",
  },
  {
    icon: Code2,
    title: "Languages",
    description: "Which languages you wrote most, weighted by commit count.",
  },
  {
    icon: GitPullRequest,
    title: "PRs & Issues",
    description: "Pull requests opened, merged, and your overall merge rate.",
  },
  {
    icon: BrainCircuit,
    title: "AI insights",
    description: "Developer personality, strengths, and honest feedback.",
  },
  {
    icon: TrendingUp,
    title: "Year over year",
    description: "Compare any two years. Watch yourself grow.",
  },
];

export default function Features() {
  return (
    <section className="px-6 pb-24 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border border-border rounded-xl overflow-hidden divide-y lg:divide-y-0 divide-border sm:divide-x divide-x-0">
          {FEATURES.map(({ icon: Icon, title, description }, i) => (
            <div
              key={title}
              className={`p-6 bg-background hover:bg-card transition-colors duration-150 ${
                i >= 3 ? "border-t border-border" : ""
              }`}
            >
              <Icon size={16} className="text-primary mb-4" />
              <p className="font-display font-semibold text-sm text-foreground mb-1">
                {title}
              </p>
              <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
