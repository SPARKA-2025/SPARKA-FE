"use server";

import { cookies } from "next/headers";
import fetchApi from "../../fetch/fetchApi";

const logoutHandler = async () => {
  try {
    const response = await fetchApi({
      method: "post",
      endpoint: "/admin/logout",
      contentType: "application/json",
    });

    cookies().delete("token");
    cookies().delete("username");

    return response;
  } catch (error) {
    console.error("LogoutHandler Error:", error);
    return { message: error.message || "Terjadi kesalahan server saat logout" };
  }
};

export default logoutHandler;