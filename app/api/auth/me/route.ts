import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

// GET - Return the current authenticated user from the session cookie
export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: session.userId,
          name: session.name,
          email: session.email,
          role: session.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
