import { NextResponse } from "next/server";

export default async function handler(req, res) {
    const { session } = req.body;
    return NextResponse.next().cookies.set('session', session, {
        httpOnly: true,
        secure: false,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        sameSite: "lax",
        path: "/",  
    });
};