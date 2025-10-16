"use client";

import { authClient } from "@/lib/auth-client";
import { useEffect, useRef } from "react";
import axios from "axios";

export function useAuthSync() {
  const { data: session, isPending } = authClient.useSession();
  const previousSignedInState = useRef<boolean | null>(null);
  const hasSynced = useRef(false);

  useEffect(() => {
    async function syncAnonymousUrls() {
      // Wait for auth to load
      if (isPending) return;

      const isSignedIn = !!session?.user;

      // Detect transition from anonymous to signed in
      if (
        previousSignedInState.current === false &&
        isSignedIn === true &&
        !hasSynced.current
      ) {
        try {
          hasSynced.current = true;
          
          // Get the session token
          const sessionData = await authClient.getSession();
          
          if (sessionData.data?.session) {
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"}/api/urls/flush`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${sessionData.data.session.token}`,
                },
                withCredentials: true,
              }
            );

            if (response.data.count > 0) {
              console.log(`Flushed ${response.data.count} anonymous URLs to your account`);
              // You can show a toast notification here if you have a toast library
            }
          }
        } catch (error) {
          console.error("Failed to sync anonymous URLs:", error);
          hasSynced.current = false; // Reset so it can retry
        }
      }

      // Update previous state
      previousSignedInState.current = isSignedIn;
    }

    syncAnonymousUrls();
  }, [session, isPending]);
}
