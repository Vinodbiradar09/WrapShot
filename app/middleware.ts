import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isLoggedIn = !!token?.accessToken;

  const isShareRoute = /^\/wrapped\/\d{4}\/share/.test(pathname);

  const isProtected =
    !isShareRoute &&
    (pathname.startsWith("/dashboard") || pathname.startsWith("/wrapped"));

  const isLoginPage = pathname === "/login";
  const isLanding = pathname === "/";

  if (isProtected && !isLoggedIn) {
    const url = new URL("/", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Already logged in → don't show login page or landing again
  if ((isLoginPage || isLanding) && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public|.*\\.(?:png|jpg|jpeg|gif|webp|svg|css|js)$).*)",
  ],
};
