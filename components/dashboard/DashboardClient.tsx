"use client";

import { useState } from "react";
import YearSelector from "./YearSelector";
import ImportPipeline from "./ImportPipeline";

export default function DashboardClient() {
  const [years, setYears] = useState<number[]>([new Date().getFullYear()]);
  const [running, setRunning] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      <YearSelector selected={years} onChange={setYears} disabled={running} />
      <div>
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-4">
          Import pipeline
        </p>
        <ImportPipeline years={years} onRunningChange={setRunning} />
      </div>
    </div>
  );
}
