import { getServerSession } from "next-auth";
import { auth } from "../api/auth/[...nextauth]/route";

export const getSession = async () => {
  const session = await getServerSession(auth);
  return session;
};
