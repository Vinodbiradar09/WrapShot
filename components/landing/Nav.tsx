"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Nav() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-14 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-6 h-full flex items-center justify-between">
        <Link
          href="/"
          className="font-display font-bold text-sm text-foreground tracking-tight"
        >
          WrapShot
        </Link>

        <Button
          size="sm"
          className="h-8 px-4 text-xs font-mono"
          onClick={() => router.push(session ? "/dashboard" : "/login")}
        >
          {session ? "Dashboard" : "Sign in"}
        </Button>
      </div>
    </header>
  );
}
