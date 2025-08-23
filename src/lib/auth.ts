import { cookies } from "next/headers";
import { createClient as createSupabaseServer } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { UserData } from "../types/types";
import { NextRequest } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function verifyAuth(
  request: NextRequest
): Promise<UserData | null> {
  try {
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.substring(7);

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error("Supabase auth error:", error);
      return null;
    }

    const isEmailVerified = !!user.email_confirmed_at;

    // Get user data from our database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!dbUser) {
      console.error("User not found in database:", user.id);
      return null;
    }

    return {
      ...dbUser,
      isEmailVerified: isEmailVerified,
      createdAt: dbUser.createdAt.toISOString(),
    };
  } catch (error) {
    console.error("Auth verification error:", error);
    return null;
  }
}

export async function getUser(): Promise<UserData | null> {
  try {
    const cookieStore = await cookies();
    const supabase = await createSupabaseServer(cookieStore);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const isEmailVerified = !!user.email_confirmed_at;

    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        email: true,
        createdAt: true,
      },
    });

    if (!dbUser) {
      console.error("User not found in database:", user.id);
      return null;
    }

    return {
      ...dbUser,
      isEmailVerified: isEmailVerified,
      createdAt: dbUser.createdAt.toISOString(),
    };
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}
