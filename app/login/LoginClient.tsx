"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { Github, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const ERRORS: Record<string, string> = {
  OAuthSignin: "Could not start GitHub sign in. Try again.",
  OAuthCallback: "GitHub sign in failed. Try again.",
  OAuthAccountNotLinked: "This account is already linked to another user.",
  default: "Something went wrong. Please try again.",
};

interface Props {
  callbackUrl: string;
  error?: string;
}

export default function LoginClient({ callbackUrl, error }: Props) {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    await signIn("github", { callbackUrl });
    // stays true — page redirects after OAuth
  };

  const errorMsg = error ? (ERRORS[error] ?? ERRORS.default) : null;

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="block font-display font-bold text-sm text-foreground mb-10"
        >
          WrapShot
        </Link>

        <h1 className="font-display font-bold text-2xl text-foreground tracking-tight mb-1">
          Sign in
        </h1>
        <p className="font-mono text-xs text-muted-foreground mb-8">
          Connect your GitHub to get started.
        </p>
        {errorMsg && (
          <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 mb-6">
            <AlertCircle
              size={13}
              className="text-destructive mt-0.5 shrink-0"
            />
            <p className="font-mono text-xs text-destructive">{errorMsg}</p>
          </div>
        )}
        <Button
          onClick={handleSignIn}
          disabled={loading}
          className="w-full h-10 gap-2.5 text-sm font-display font-semibold disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Connecting…
            </>
          ) : (
            <>
              <Github size={14} />
              Continue with GitHub
            </>
          )}
        </Button>

        <p className="mt-6 font-mono text-xs text-muted-foreground text-center">
          Read-only access. We never see your code.
        </p>
      </div>
    </main>
  );
}
