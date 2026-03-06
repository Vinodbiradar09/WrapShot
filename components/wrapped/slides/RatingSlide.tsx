"use client";

import { WrappedData } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Share2 } from "lucide-react";

export default function RatingSlide({ data }: { data: WrappedData }) {
  const ai = data.aiSummary;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `My ${data.year} GitHub Wrapped`,
        text: `I made ${data.totalCommits} commits in ${data.year}. Check out my WrapShot!`,
        url: `${window.location.origin}/wrapped/${data.year}/share`,
      });
    } else {
      navigator.clipboard.writeText(
        `${window.location.origin}/wrapped/${data.year}/share`,
      );
    }
  };

  return (
    <div className="slide flex flex-col justify-center bg-background px-8 sm:px-16 gap-8">
      <div>
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-2">
          {data.year} rating
        </p>
        {ai ? (
          <>
            <p className="font-display font-bold text-6xl text-primary tracking-tight">
              {ai.yearRating}
            </p>
            <p className="font-mono text-sm text-muted-foreground mt-2">
              {ai.yearVibes}
            </p>
            <p className="font-mono text-sm text-foreground/80 max-w-md mt-6 leading-relaxed">
              {ai.yearSummary}
            </p>
          </>
        ) : (
          <p className="font-display font-bold text-5xl text-foreground tracking-tight">
            {data.totalCommits.toLocaleString()} commits
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={handleShare}
          className="h-9 px-5 text-sm font-display font-semibold gap-2"
        >
          <Share2 size={13} />
          Share
        </Button>
        <Link
          href="/dashboard"
          className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Dashboard
        </Link>
      </div>
    </div>
  );
}
