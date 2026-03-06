import { WrappedData } from "@/app/types/types";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = [
  "#6d56fa",
  "#a78bfa",
  "#3b82f6",
  "#f97316",
  "#f04444",
  "#10b981",
  "#f59e0b",
  "#ec4899",
];

export default function LanguageSlide({ data }: { data: WrappedData }) {
  const langs = data.languageBreakdown.slice(0, 6);

  return (
    <div className="slide flex flex-col justify-center bg-background px-8 sm:px-16 gap-8">
      <div>
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">
          Top language
        </p>
        <p className="font-display font-bold text-5xl sm:text-6xl text-foreground tracking-tight">
          {data.topLanguage ?? "Unknown"}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-8">
        {/* Pie */}
        <div className="w-48 h-48 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={langs}
                dataKey="percentage"
                nameKey="language"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                strokeWidth={0}
              >
                {langs.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#161616",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 6,
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                }}
                formatter={(v: number | undefined) => [`${v ?? 0}%`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-3">
          {langs.map((lang, i) => (
            <div key={lang.language} className="flex items-center gap-3">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              <span className="font-mono text-sm text-foreground w-28 truncate">
                {lang.language}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {lang.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
