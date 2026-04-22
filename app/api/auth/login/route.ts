import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/config/mongodb";
import User from "@/models/userSchema";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/session";

// POST - Authenticate a user
export async function POST(request: NextRequest) {
  try {
    await connectMongoDB();
    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create session (sets httpOnly cookie)
    await createSession(
      user._id.toString(),
      user.name,
      user.email,
      user.role
    );

    // Return user data without password
    return NextResponse.json(
      {
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
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
