import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

// Protected routes that require authentication
const protectedRoutes = ["/dashboard", "/create-match", "/edit-properties", "/edit-results", "/search"];

// Public routes (login/signup pages)
const publicRoutes = ["/", "/signup"];

async function verifySession(sessionCookie: string | undefined) {
  if (!sessionCookie) return null;
  try {
    const { payload } = await jwtVerify(sessionCookie, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if the route is protected or public
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path);

  // Decrypt the session from the cookie
  const sessionCookie = request.cookies.get("session")?.value;
  const session = await verifySession(sessionCookie);

  // Redirect to login if accessing a protected route without a valid session
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  // Redirect to dashboard if accessing a public route with a valid session
  if (isPublicRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  return NextResponse.next();
}

// Only run proxy on page routes, not API routes or static files
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
