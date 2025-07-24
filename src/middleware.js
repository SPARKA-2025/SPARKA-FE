//middleware,js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const publicRoutes = ["/login", "/admin/login"];

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export default async function middleware(req) {
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);

  // Ambil cookie token
  const cookie = req.cookies.get("token")?.value;

  let isAuthorized = false;

  if (cookie) {
    try {
      const { payload } = await jwtVerify(cookie, encodedKey, {
        algorithms: ["HS256"],
      });
      
      isAuthorized = Boolean(payload?.iss); // Cek jika token valid
    } catch (error) {
      console.error("JWT Verify Error:", error);
      // Token tidak valid, hapus cookie
      const response = NextResponse.next();
      response.cookies.delete("token");
      response.cookies.delete("username");
    }
  }

  // Redirect jika belum login
  if (!isPublicRoute && !isAuthorized) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  
  if (isPublicRoute && isAuthorized) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = { matcher: "/((?!.*\\.).*)" };