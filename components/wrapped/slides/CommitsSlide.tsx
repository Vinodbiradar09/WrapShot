import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { WrappedData } from "@/app/types/types";

export default function CommitsSlide({ data }: { data: WrappedData }) {
  const max = Math.max(...data.monthlyHeatmap.map((m) => m.commits));

  return (
    <div className="slide flex flex-col justify-center bg-background px-8 sm:px-16 gap-8">
      <div>
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">
          Commits
        </p>
        <p className="font-display font-bold text-6xl sm:text-7xl text-foreground tracking-tight">
          {data.totalCommits.toLocaleString()}
        </p>
        <p className="font-mono text-sm text-muted-foreground mt-1">
          commits in {data.year}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-sm">
        <div className="p-4 rounded-lg border border-border bg-card">
          <p className="font-display font-bold text-2xl text-foreground">
            {data.longestStreak}d
          </p>
          <p className="font-mono text-xs text-muted-foreground mt-1">
            longest streak
          </p>
        </div>
        <div className="p-4 rounded-lg border border-border bg-card">
          <p className="font-display font-bold text-2xl text-foreground">
            {data.monthlyHeatmap.find((m) => m.commits === max)?.monthName ??
              "—"}
          </p>
          <p className="font-mono text-xs text-muted-foreground mt-1">
            most active month
          </p>
        </div>
      </div>

      <div className="h-32 max-w-lg">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.monthlyHeatmap} barSize={14}>
            <XAxis
              dataKey="monthName"
              tickFormatter={(v) => v.slice(0, 3)}
              tick={{
                fontSize: 10,
                fontFamily: "var(--font-mono)",
                fill: "#777",
              }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={false}
              contentStyle={{
                background: "#161616",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 6,
                fontFamily: "var(--font-mono)",
                fontSize: 12,
              }}
              formatter={(v: number | undefined) => [v ?? 0, "commits"]}
            />
            <Bar dataKey="commits" radius={[3, 3, 0, 0]}>
              {data.monthlyHeatmap.map((_, i) => (
                <Cell
                  key={i}
                  fill={
                    _.commits === max
                      ? "var(--primary)"
                      : "rgba(255,255,255,0.1)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
