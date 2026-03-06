"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Hero() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <section className="pt-36 pb-28 px-6">
      <div className="max-w-5xl mx-auto">
        <Badge
          variant="secondary"
          className="mb-6 font-mono text-xs text-muted-foreground"
        >
          GitHub Year in Review
        </Badge>

        <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl tracking-tight leading-[1.05] mb-6">
          <span className="text-muted-foreground">See your</span> GitHub
          <br />
          year, <span className="text-primary">clearly.</span>
        </h1>

        <p className="font-mono text-sm text-muted-foreground max-w-sm mb-10 leading-relaxed">
          Connect GitHub and get a full breakdown of your commits, streaks,
          languages, and AI insights — year by year.
        </p>

        <div className="flex items-center gap-4">
          <Button
            className="h-10 px-5 gap-2 text-sm font-display font-semibold"
            onClick={() => router.push(session ? "/dashboard" : "/login")}
          >
            {session ? "Go to Dashboard" : "Get Started"}
          </Button>
          <span className="font-mono text-xs text-muted-foreground">
            Free · No credit card
          </span>
        </div>
      </div>
    </section>
  );
}
