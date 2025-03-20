import { jwtVerify } from "jose";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function decrypt(token) {
  try {
    const { payload: accToken } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    }).catch((e) => {
      throw e;
    });
    return accToken;
  } catch (e) {
    return false;
  }
}