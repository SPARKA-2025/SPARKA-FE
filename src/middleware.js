//middleware,js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode"; // Ensure this is the correct import

const publicRoutes = ["/login", "/admin/login"];

export default async function middleware(req) {
  //console.log("Middleware is running...");

  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);

  // Ambil cookie token
  const cookie = cookies().get("token")?.value;
  //console.log("Raw Token:", cookie);

  let tokenData = null;
  let isAuthorized = false;

  if (cookie) {
    try {
      tokenData = jwtDecode(cookie); 
      // console.log("Decoded Token:", tokenData); -> debug only

      isAuthorized = Boolean(tokenData?.iss); // Cek jika token valid
    } catch (error) {
      console.error("JWT Decode Error:", error);
    }
  }

  //console.log("Is Authorized:", isAuthorized);

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