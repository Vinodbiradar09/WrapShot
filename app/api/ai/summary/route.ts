import { getSession } from "@/app/types/getSession";
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { WrappedStats, TopRepo, YoY, AISummary } from "@/app/types/types";
import { buildPrompt } from "@/lib/ai/prompt";
import { callGemini } from "@/lib/ai/call";
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.accessToken) {
      return NextResponse.json(
        { message: "Unauthorized user", success: false },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { year, stats, topRepos, yoy, forceRefresh } = body as {
      year: number;
      stats: WrappedStats;
      topRepos: TopRepo[];
      yoy: YoY | null;
      forceRefresh?: boolean;
    };

    if (!year || !stats) {
      return NextResponse.json(
        { message: "year and stats are required", success: false },
        { status: 400 },
      );
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 },
      );
    }
    // cache check
    if (!forceRefresh) {
      const existing = await db.yearlyStats.findUnique({
        where: { userId_year: { userId: user.id, year } },
        select: { aiSummary: true },
      });

      if (existing?.aiSummary) {
        return NextResponse.json(
          {
            success: true,
            summary: JSON.parse(existing.aiSummary) as AISummary,
            cached: true,
          },
          { status: 200 },
        );
      }
    }
    const prompt = buildPrompt(
      user.username,
      year,
      stats,
      topRepos ?? [],
      yoy ?? null,
    );
    const raw = await callGemini(prompt);
    let summary: AISummary;
    try {
      // strip any accidental markdown
      const cleaned = raw
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      summary = JSON.parse(cleaned) as AISummary;
    } catch {
      console.error("Gemini raw response could not be parsed:", raw);
      return NextResponse.json(
        {
          message: "AI returned malformed response. Please try again.",
          success: false,
        },
        { status: 502 },
      );
    }
    const requiredKeys: (keyof AISummary)[] = [
      "personalityType",
      "personalityEmoji",
      "codeQualityScore",
      "strengths",
      "improvements",
      "roastLine",
      "complimentLine",
      "yearSummary",
      "funFacts",
      "yearRating",
      "yearVibes",
    ];
    for (const key of requiredKeys) {
      if (summary[key] == null) {
        return NextResponse.json(
          {
            message: `AI response missing field: ${key}`,
            success: false,
          },
          { status: 502 },
        );
      }
    }

    // cache in DB
    await db.yearlyStats.update({
      where: { userId_year: { userId: user.id, year } },
      data: { aiSummary: JSON.stringify(summary) },
    });

    return NextResponse.json(
      { success: true, summary, cached: false },
      { status: 200 },
    );
  } catch (e) {
    console.error(e);
    const message =
      e instanceof Error && e.message.startsWith("Gemini")
        ? e.message
        : "Internal server error";

    return NextResponse.json({ message, success: false }, { status: 500 });
  }
}
