"use server";

import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("firebaseAuthToken")?.value;

  // const protectedRoutes = ["/profile", "/dashboard"];
  const protectedRoutes = ["/dashboard"];
  
  const currentPath = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((route) =>
    currentPath.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (currentPath.startsWith("/login") && token) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  //matcher: ["/profile", "/login"],
  matcher: ["/login"],
};
