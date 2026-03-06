"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { WrappedData } from "@/app/types/types";
import SlideProgress from "./SlideProgress";
import IntroSlide from "./slides/IntroSlide";
import CommitsSlide from "./slides/CommitsSlide";
import LanguageSlide from "./slides/LanguageSlide";
import ReposSlide from "./slides/ReposSlide";
import PullRequestsSlide from "./slides/PullRequestsSlide";
import ConsistencySlide from "./slides/CommitsSlide";
import YearOverYearSlide from "./slides/YearOverYearSlide";
import PersonalitySlide from "./slides/PersonalitySlide";
import RoastSlide from "./slides/RoastSlide";
import RatingSlide from "./slides/RatingSlide";

interface Props {
  data: WrappedData;
  year: number;
}

export default function WrappedClient({ data, year }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [aiLoading, setAiLoading] = useState(!data.aiSummary);
  const [wrappedData, setWrappedData] = useState<WrappedData>(data);

  // Build slide list — skip YoY if no prior year data
  const slides = [
    <IntroSlide key="intro" data={wrappedData} />,
    <CommitsSlide key="commits" data={wrappedData} />,
    <LanguageSlide key="lang" data={wrappedData} />,
    <ReposSlide key="repos" data={wrappedData} />,
    <PullRequestsSlide key="prs" data={wrappedData} />,
    <ConsistencySlide key="streak" data={wrappedData} />,
    ...(wrappedData.yoy
      ? [<YearOverYearSlide key="yoy" data={wrappedData} />]
      : []),
    <PersonalitySlide key="personality" data={wrappedData} />,
    <RoastSlide key="roast" data={wrappedData} />,
    <RatingSlide key="rating" data={wrappedData} />,
  ];

  // Track active slide via IntersectionObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const slideEls = container.querySelectorAll(".slide");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Array.from(slideEls).indexOf(
              entry.target as HTMLElement,
            );
            if (idx !== -1) setCurrent(idx);
          }
        });
      },
      { root: container, threshold: 0.6 },
    );

    slideEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [slides.length]);

  // Scroll to slide on dot click
  const goTo = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const slideEls = container.querySelectorAll(".slide");
    slideEls[index]?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Generate AI summary if not cached
  useEffect(() => {
    if (data.aiSummary) return;

    const generate = async () => {
      try {
        const res = await fetch("/api/ai/summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            year,
            stats: {
              totalCommits: data.totalCommits,
              totalPRs: data.totalPRs,
              mergedPRs: data.mergedPRs,
              longestStreak: data.longestStreak,
              topLanguage: data.topLanguage,
              totalRepos: data.totalRepos,
              developerScore: data.developerScore,
            },
            topRepos: data.topRepos,
            yoy: data.yoy,
          }),
        });
        if (res.ok) {
          const json = await res.json();
          setWrappedData((prev) => ({ ...prev, aiSummary: json.summary }));
        }
      } finally {
        setAiLoading(false);
      }
    };

    generate();
  }, [
    data.aiSummary,
    data.developerScore,
    data.longestStreak,
    data.mergedPRs,
    data.topLanguage,
    data.topRepos,
    data.totalCommits,
    data.totalPRs,
    data.yoy,
    data.totalRepos,
    year,
  ]);

  return (
    <>
      {/* Dot navigation */}
      <SlideProgress
        total={slides.length}
        current={current}
        onDotClick={goTo}
      />

      {/* AI loading banner */}
      {aiLoading && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full border border-border bg-card">
          <p className="font-mono text-xs text-muted-foreground flex items-center gap-2">
            <span className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin" />
            Generating AI insights…
          </p>
        </div>
      )}

      {/* Slide container */}
      <div ref={containerRef} className="slide-container">
        {slides}
      </div>
    </>
  );
}
