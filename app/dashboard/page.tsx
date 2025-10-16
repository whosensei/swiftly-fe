import { requireAuth } from "@/lib/server-auth";

/**
 * Example protected page using server-side auth validation
 * This is the SECURE way - not just relying on middleware
 */
export default async function DashboardPage() {
  // This will redirect to /sign-in if not authenticated
  const session = await requireAuth();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome back, {session.user.name || session.user.email}!
      </p>
      
      <div className="mt-8 p-6 border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Your Account</h2>
        <div className="space-y-2 text-sm">
          <p><strong>Email:</strong> {session.user.email}</p>
          <p><strong>User ID:</strong> {session.user.id}</p>
          <p><strong>Session ID:</strong> {session.session.id}</p>
        </div>
      </div>

      {/* Add your dashboard content here */}
    </div>
  );
}

