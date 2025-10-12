"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import axios from "axios";

export function useAuthSync() {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const previousSignedInState = useRef<boolean | null>(null);
  const hasSynced = useRef(false);

  useEffect(() => {
    async function syncAnonymousUrls() {
      // Wait for auth to load
      if (!isLoaded) return;

      // Detect transition from anonymous to signed in
      if (
        previousSignedInState.current === false &&
        isSignedIn === true &&
        !hasSynced.current
      ) {
        try {
          hasSynced.current = true;
          const token = await getToken();

          if (token) {
            const response = await axios.post(
              "http://localhost:8080/api/urls/flush",
              {},
              {
                headers: {
                  Authorization: `Bearer ${token}`,
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
  }, [isSignedIn, isLoaded, getToken]);
}

