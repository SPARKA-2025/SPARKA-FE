"use server";

import { cookies } from "next/headers";
import fetchApi from "../../fetch/fetchApi";
import { decrypt } from "../../utils/service/decrypt";

const loginHandler = async (formData) => {
  try {
    const response = await fetchApi({
      method: "post",
      endpoint: "/login-admin",
      data: {
        email: formData?.get("email")?.toString(),
        password: formData?.get("password")?.toString(),
      },
      contentType: "application/json",
    });

    const { access_token: accToken, expires_in: exIn } = response || {};

    if (!accToken) {
      return {
        message: response?.message || "Login gagal. Periksa email dan password Anda."
      };
    }

    // Decrypt token to get user info for username cookie
    const decrypted = await decrypt(accToken);
    
    if (!decrypted) {
      return { message: "Token verification failed" };
    }

    const cookieOptions = {
      httpOnly: false, // Changed to false so client-side JavaScript can access it
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      sameSite: "strict",
      path: "/",
    };

    // Store the raw token for middleware verification
    cookies().set("token", accToken, cookieOptions);

    // Store username from decrypted token
    cookies().set("username", decrypted?.nama || decrypted?.name || "", {
      ...cookieOptions,
      httpOnly: false,
    });

    return response;
  } catch (error) {
    console.error("LoginHandler Error:", error);
    return { message: error.message || "Terjadi kesalahan server" };
  }
};

export default loginHandler;
