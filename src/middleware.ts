"use server";

import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("firebaseAuthToken")?.value;

  const protectedRoutes = ["/profile", "/activity", "/posts"];

  const currentPath = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((route) =>
    currentPath.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/",
    "/profile",
    "/profile/:path*",
    "/activity",
    "/posts",
    "/posts/:path*",
    "/comments",
    "/comments/:path*",
  ],
};
