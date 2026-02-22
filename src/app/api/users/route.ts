import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";

  try {
    const res = await fetch(
      `https://reqres.in/api/users?page=${page}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REQRES_API_KEY!,
        },
        cache: "no-store",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to fetch users" },
        { status: res.status }
      );
    }

    const admins = [1, 2, 3]; 

    const usersWithRoles = data.data.map((user: any) => ({
      ...user,
      role: admins.includes(user.id) ? "admin" : "user",
    }));

    return NextResponse.json({
      ...data,
      data: usersWithRoles,
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}