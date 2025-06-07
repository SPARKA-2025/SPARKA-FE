"use server";

import { cookies } from "next/headers";
import fetchApi from "../../fetch/fetchApi";
import { NextResponse } from "next/server";
import { redirect } from "next/dist/server/api-utils";
import { decrypt } from "../../utils/service/decrypt";

const loginHandler = async (formData) => {
  try {
    const response = await fetchApi({
      method: "post",
      endpoint: "/login-admin",
      data: {
        email: formData?.get("email").toString(),
        password: formData?.get("password").toString(),
      },
      contentType: "application/json"
    });

    const { access_token: accToken, expires_in: exIn } = response;
    if (!accToken) return response;

    const decrypted = await decrypt(accToken)

    cookies().set("token", accToken, {
      httpOnly: true,
      secure: false,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      sameSite: "strict",
      path: "/",
    });

    cookies().set("username", decrypted?.name, {
      httpOnly: false,
      secure: false,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error(error);
  
    return error.message;
  }
};

export default loginHandler;