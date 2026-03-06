"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import PipelineStep, { StepStatus } from "./PipelineStep";

interface Props {
  years: number[];
  onRunningChange: (v: boolean) => void;
}

type Pipeline = {
  repos: StepStatus;
  commits: StepStatus;
  prs: StepStatus;
  issues: StepStatus;
  stats: StepStatus;
};

const INITIAL: Pipeline = {
  repos: "idle",
  commits: "idle",
  prs: "idle",
  issues: "idle",
  stats: "idle",
};

async function post(url: string, body?: object) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${url} failed (${res.status})`);
  return res.json();
}

export default function ImportPipeline({ years, onRunningChange }: Props) {
  const router = useRouter();
  const [pipeline, setPipeline] = useState<Pipeline>(INITIAL);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof Pipeline, status: StepStatus) =>
    setPipeline((p) => ({ ...p, [key]: status }));

  const setIsRunning = (val: boolean) => {
    setRunning(val);
    onRunningChange(val);
  };

  const run = async () => {
    if (!years.length) return;
    setIsRunning(true);
    setError(null);
    setDone(false);
    setPipeline(INITIAL);

    try {
      set("repos", "running");
      await post("/api/github/import");
      set("repos", "done");
      for (const year of [...years].sort((a, b) => a - b)) {
        set("commits", "running");
        await post("/api/github/import/commits", { year });
        set("commits", "done");

        set("prs", "running");
        await post("/api/github/import/prs", { year });
        set("prs", "done");

        set("issues", "running");
        await post("/api/github/import/issues", { year });
        set("issues", "done");

        set("stats", "running");
        await post("/api/stats/generate", { year });
        set("stats", "done");
      }

      setDone(true);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      setError(msg);
      setPipeline((p) => {
        const next = { ...p };
        for (const k of Object.keys(next) as (keyof Pipeline)[]) {
          if (next[k] === "running") next[k] = "error";
        }
        return next;
      });
    } finally {
      setIsRunning(false);
    }
  };

  const latestYear = [...years].sort((a, b) => b - a)[0];

  const STEPS: { key: keyof Pipeline; label: string; description: string }[] = [
    {
      key: "repos",
      label: "Import repositories",
      description: "Fetch all your GitHub repos.",
    },
    {
      key: "commits",
      label: "Import commits",
      description: `Pull commit history for: ${years.join(", ") || "—"}`,
    },
    {
      key: "prs",
      label: "Import pull requests",
      description: "Fetch PRs and merge status.",
    },
    {
      key: "issues",
      label: "Import issues",
      description: "Fetch opened and closed issues.",
    },
    {
      key: "stats",
      label: "Generate stats",
      description: "Compute aggregates, streaks, and language breakdown.",
    },
  ];

  return (
    <div>
      <div className="mb-5">
        {STEPS.map(({ key, label, description }) => (
          <PipelineStep
            key={key}
            label={label}
            description={description}
            status={pipeline[key]}
          />
        ))}
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-md bg-destructive/10 border border-destructive/20">
          <p className="font-mono text-xs text-destructive">{error}</p>
        </div>
      )}
      {!done ? (
        <Button
          onClick={run}
          disabled={running || !years.length}
          className="h-9 px-5 text-sm font-display font-semibold gap-2"
        >
          {running ? (
            <>
              <span className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Importing…
            </>
          ) : (
            "Start Import"
          )}
        </Button>
      ) : (
        <Button
          onClick={() => router.push(`/wrapped/${latestYear}`)}
          className="h-9 px-5 text-sm font-display font-semibold gap-2"
        >
          View {latestYear} Wrapped
          <ArrowRight size={13} />
        </Button>
      )}

      {!years.length && !running && (
        <p className="mt-3 font-mono text-xs text-muted-foreground">
          Select at least one year above.
        </p>
      )}
    </div>
  );
}
