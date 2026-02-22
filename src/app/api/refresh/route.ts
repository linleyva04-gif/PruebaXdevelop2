import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies(); // 👈 AQUÍ
  const refreshToken = cookieStore.get("refreshToken");

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  const newAccessToken = crypto.randomUUID();

  const response = NextResponse.json({ success: true });

  response.cookies.set("accessToken", newAccessToken, {
    httpOnly: false,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  return response;
}

