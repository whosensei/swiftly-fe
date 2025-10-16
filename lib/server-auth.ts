import { auth } from "./auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Get the current session on the server side
 * Use this in Server Components, API Routes, and Server Actions
 */
export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
}

/**
 * Require authentication - redirect to sign-in if not authenticated
 * Use this in Server Components for protected pages
 */
export async function requireAuth() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return session;
}

/**
 * Get the current user or null if not authenticated
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

