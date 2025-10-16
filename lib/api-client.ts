import axios, { AxiosRequestConfig } from "axios";
import { authClient } from "./auth-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

/**
 * API client with automatic JWT token injection
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/**
 * Get authenticated headers with JWT token
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  try {
    const sessionData = await authClient.getSession();
    const token = sessionData.data?.session?.token;
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Failed to get auth token:", error);
  }

  return headers;
}

/**
 * Make an authenticated API request
 */
export async function authenticatedRequest<T = unknown>(
  config: AxiosRequestConfig
): Promise<T> {
  const headers = await getAuthHeaders();
  
  const response = await apiClient.request<T>({
    ...config,
    headers: {
      ...headers,
      ...config.headers,
    },
  });

  return response.data;
}

