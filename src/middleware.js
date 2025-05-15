import { NextResponse } from "next/server";
import { decrypt } from "./app/lib/utils/service/decrypt";
import { cookies } from "next/headers";

const publicRoutes = ['/login', '/admin/login'];

export default async function middleware(req) {
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);

  const rawToken = cookies().get('token')?.value;

  if (!rawToken) {
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
    return NextResponse.next();
  }

  let token;
  try {
    token = await decrypt(rawToken);
  } catch (err) {
    console.error("Failed to decrypt token:", err);
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  const isAuthorized = Boolean(token?.iss);

  if (!isAuthorized && !isPublicRoute) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  if (isAuthorized && isPublicRoute) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!.*\\.).*)',
};
