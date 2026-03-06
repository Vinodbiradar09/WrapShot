import NextAuth, { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { db } from "@/lib/prisma";
import { GitHubProfile } from "@/app/types/types";

export const auth: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ account, profile, token }) {
      if (account && profile) {
        const githubProfile = profile as GitHubProfile;

        const githubId = githubProfile.id.toString();

        const user = await db.user.upsert({
          where: { githubId },
          update: {
            accessToken: account.access_token!,
          },
          create: {
            githubId,
            username: githubProfile.login,
            accessToken: account.access_token!,
          },
        });

        token.userId = user.id;
        token.accessToken = account.access_token;
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user.id = token.userId as string;

      return session;
    },
  },
};
const handler = NextAuth(auth);

export { handler as GET, handler as POST };
