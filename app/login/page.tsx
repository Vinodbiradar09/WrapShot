"use client";
import { signIn } from "next-auth/react";

export default function Login() {
  return (
    <button
      onClick={() => signIn("github")}
      className="bg-black text-white px-4 py-2 rounded"
    >
      Sign in with GitHub
    </button>
  );
}
