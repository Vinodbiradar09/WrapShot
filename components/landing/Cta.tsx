"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTA() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <section className="px-6 pb-24 border-t border-border">
      <div className="max-w-5xl mx-auto pt-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-1">
            Ready to see your year?
          </h2>
          <p className="font-mono text-xs text-muted-foreground">
            Free. Takes 2 minutes.
          </p>
        </div>
        <Button
          onClick={() =>
            session ? router.push("/dashboard") : signIn("github")
          }
          className="shrink-0 h-10 px-5 gap-2 text-sm font-display font-semibold"
        >
          <Github size={14} />
          {session ? "Go to Dashboard" : "Connect GitHub"}
        </Button>
      </div>
    </section>
  );
}
