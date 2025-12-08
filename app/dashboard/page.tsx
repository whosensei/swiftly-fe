import { requireAuth } from "@/lib/server-auth";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default async function DashboardPage() {
  // This will redirect to /sign-in if not authenticated
  await requireAuth();

  return <DashboardContent />;
}
