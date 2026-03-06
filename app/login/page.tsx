import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import LoginClient from "./LoginClient";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Sign In" };

interface Props {
  searchParams: { callbackUrl?: string; error?: string };
}

export default async function LoginPage({ searchParams }: Props) {
  const session = await getServerSession(auth);
  if (session?.user) {
    redirect(searchParams.callbackUrl ?? "/dashboard");
  }

  return (
    <LoginClient
      callbackUrl={searchParams.callbackUrl ?? "/dashboard"}
      error={searchParams.error}
    />
  );
}
