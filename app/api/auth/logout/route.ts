import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/session";

// POST - Log out the current user
export async function POST() {
  try {
    await deleteSession();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
