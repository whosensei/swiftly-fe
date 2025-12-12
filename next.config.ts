import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
    return [
      {
        // Proxy short code redirects to the Go backend
        // Matches /{short_code} but not /dashboard, /sign-in, /api, etc.
        source: "/:short_code((?!dashboard|sign-in|sign-up|api|_next|favicon)\\w+)",
        destination: `${backendUrl}/:short_code`,
      },
    ];
  },
};

export default nextConfig;
