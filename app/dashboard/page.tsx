import { getSession } from "../types/getSession";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/prisma";
import UserCard from "@/components/dashboard/UserCard";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };
export default async function Dashboard() {
  const session = await getSession();
  if (!session || !session.user) {
    redirect("/");
  }
  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      username: true,
      avatarUrl: true,
    },
  });
  if (!user) redirect("/");

  const existing = await db.yearlyStats.findMany({
    where: {
      userId: session.user.id,
    },
    select: { year: true },
    orderBy: { year: "desc" },
  });

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl text-foreground tracking-tight mb-1">
            Dashboard
          </h1>
          <p className="font-mono text-xs text-muted-foreground">
            Import your GitHub data and generate your Wrapped.
          </p>
        </div>
        <UserCard username={user.username} avatarUrl={user.avatarUrl} />
        {existing.length > 0 && (
          <>
            <Separator className="my-8" />
            <div>
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-4">
                Your wrapped years
              </p>
              <div className="flex flex-wrap gap-2">
                {existing.map(({ year }) => (
                  <Link
                    key={year}
                    href={`/wrapped/${year}`}
                    className="h-9 px-4 inline-flex items-center rounded-md border border-border font-mono text-sm text-foreground hover:bg-card transition-colors duration-150"
                  >
                    {year} →
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator className="my-8" />
        <DashboardClient />
      </div>
    </main>
  );
}
