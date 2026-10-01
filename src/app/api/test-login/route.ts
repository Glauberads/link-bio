import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const email = "glauberads21@gmail.com";
    const password = "cf39dce0-e7cf-4dc5-89d7-74024a1f13fc";
    
    let dbStatus = "Connecting to DB...";
    const user = await prisma.adminUser.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found in database", dbStatus: "Connected successfully" });
    }

    dbStatus = "User found. Checking password...";
    
    const isValid = await bcrypt.compare(password, user.passwordHash as string);

    return NextResponse.json({
      success: true,
      message: "Credentials are valid",
      user: { id: user.id, email: user.email, role: user.role },
      passwordValid: isValid,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: "Exception occurred",
      message: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
