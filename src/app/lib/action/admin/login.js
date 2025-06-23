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

    if (!accToken) return response;

    const decrypted = await decrypt(accToken);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      sameSite: "strict",
      path: "/",
    };

    cookies().set("token", accToken, cookieOptions);

    cookies().set("username", decrypted?.name || "", {
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
