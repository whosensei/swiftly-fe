import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getSession } from "@/lib/server-auth";

/**
 * Example API route with proper server-side authentication
 */
export async function GET() {
  // Validate session on the server side
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // User is authenticated - proceed with logic
  return NextResponse.json({
    message: "This is protected data",
    user: {
      id: session.user.id,
      email: session.user.email,
    },
  });
}

export async function POST(request: NextRequest) {
  // Validate session
  const session = await getSession()

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Get request body if needed
  // const body = await request.json();

  // Your logic here with authenticated user
  // session.user.id is available

  return NextResponse.json({
    success: true,
    userId: session.user.id,
  });
}

