import { WrappedData } from "@/app/types/types";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function ConsistencySlide({ data }: { data: WrappedData }) {
  const max = Math.max(...data.commitsByDayOfWeek.map((d) => d.commits));

  return (
    <div className="slide flex flex-col justify-center bg-background px-8 sm:px-16 gap-8">
      <div>
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">
          Consistency
        </p>
        <p className="font-display font-bold text-5xl sm:text-6xl text-foreground tracking-tight">
          {data.longestStreak} days
        </p>
        <p className="font-mono text-sm text-muted-foreground mt-1">
          longest commit streak
        </p>
      </div>

      <div>
        <p className="font-mono text-xs text-muted-foreground mb-3">
          Commits by day of week
        </p>
        <div className="h-28 max-w-sm">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.commitsByDayOfWeek} barSize={22}>
              <XAxis
                dataKey="day"
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
                {data.commitsByDayOfWeek.map((d, i) => (
                  <Cell
                    key={i}
                    fill={
                      d.commits === max
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
    </div>
  );
}
