import { NextResponse } from "next/server";
import { decrypt } from "./app/lib/utils/service/decrypt";
import { cookies } from "next/headers";

const publicRoutes = ['/login', '/admin/login']

export default async function middleware(req) {
  const path = req.nextUrl.pathname
  const isPublicRoute = publicRoutes.includes(path)

  const cookie = cookies().get('token')?.value
  const token = await decrypt(cookie)
  const isAuthorized = Boolean(token?.iss)

  if (!isPublicRoute && !isAuthorized)
    return NextResponse.redirect(new URL('/admin/login', req.url))

  if (isPublicRoute && isAuthorized) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = { matcher: '/((?!.*\\.).*)' }