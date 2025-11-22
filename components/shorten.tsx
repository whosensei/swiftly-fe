"use client";
import { useEffect, useState, useCallback } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import {
  Link2,
  Loader,
  Copy,
  Check,
  QrCode,
  MoreVertical,
  MousePointerClick,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { QRCodeDialog } from "./qrcode";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface URL {
  short_code: string;
  long_url: string;
  clicks: number;
  expires_at?: string;
  created_at: string;
}

export function Shorten() {
  const [value, setValue] = useState("");
  const [urls, setUrls] = useState<URL[]>([]);
  const [loading, setLoading] = useState(false);
  const [remainingUrls, setRemainingUrls] = useState<number>(5);
  const [copied, setCopied] = useState<number | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [deleteUrl, setDeleteUrl] = useState(false);
  const [selectedQRUrl, setSelectedQRUrl] = useState<string>("");
  const { data: session } = authClient.useSession();
  const backendBaseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
  const shortUrlBase =
    process.env.NEXT_PUBLIC_FRONTEND_URL || backendBaseUrl;

  const getAnonymousToken = () => {
    let token = localStorage.getItem("anon_session_token");
    if (!token) {
      token = crypto.randomUUID();
      localStorage.setItem("anon_session_token", token);
    }
    return token;
  };
  
  const getJWTToken = async () => {
    try {
      const { data } = await authClient.token();
      const jwtToken = data?.token;

      return jwtToken;
    } catch (error) {
      console.error("Failed to get JWT token:", error);
      return null;
    }
  };

  const fetchAnonymousURLs = useCallback(async () => {
    try {
      const response = await axios.get(`${backendBaseUrl}/urls/anonymous`, {
        headers: { "X-Anonymous-Token": getAnonymousToken() },
      });

      if (response.data) {
        setUrls(response.data);
        setRemainingUrls(Math.max(0, 5 - response.data.length));
      }
    } catch (error) {
      console.error("Failed to fetch anonymous URLs:", error);
    }
  }, []);

  const fetchAuthenticatedURLs = useCallback(async () => {
    try {
      const jwtToken = await getJWTToken();
      if (!jwtToken) return;

      const response = await axios.get(`${backendBaseUrl}/urls/authenticated`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      if (response.data) {
        setUrls(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch authenticated URLs:", error);
    }
  }, []);

  useEffect(() => {
    const isSignedIn = !!session?.user;
    if (isSignedIn) {
      fetchAuthenticatedURLs();
    } else {
      fetchAnonymousURLs();
    }
  }, [session, fetchAuthenticatedURLs, fetchAnonymousURLs]);

  async function HandleShorten() {
    try {
      setLoading(true);

      const isSignedIn = !!session?.user;
      let jwtToken = null;

      if (isSignedIn) {
        jwtToken = await getJWTToken();
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (jwtToken) {
        headers["Authorization"] = `Bearer ${jwtToken}`;
      } else {
        headers["X-Anonymous-Token"] = getAnonymousToken();
      }

      const response = await axios.post(
        `${backendBaseUrl}/shorten`,
        { longurl: value },
        { headers }
      );

      // Refresh URL list
      if (isSignedIn) {
        fetchAuthenticatedURLs();
      } else {
        fetchAnonymousURLs();
      }

      if (response.data.remaining !== undefined) {
        setRemainingUrls(response.data.remaining);
      }

      if (response.data.anonymous_token) {
        localStorage.setItem(
          "anon_session_token",
          response.data.anonymous_token
        );
      }

      setValue("");
    } catch (e: unknown) {
      console.error("Error shortening URL:", e);
      if (axios.isAxiosError(e) && e.response?.status === 429) {
        alert("Rate limit exceeded. Sign in for unlimited access!");
      }
    } finally {
      setLoading(false);
    }
  }

  async function DeleteUrl(shortCode: string) {
    try {
      setDeleteUrl(true);
      const isSignedIn = !!session?.user;
      let jwtToken = null;

      if (isSignedIn) {
        jwtToken = await getJWTToken();
      }
      const headers: Record<string, string> = {};
      if (jwtToken) {
        headers["Authorization"] = `Bearer ${jwtToken}`;
      } else {
        headers["X-Anonymous-Token"] = getAnonymousToken();
      }
      await axios.delete(`${backendBaseUrl}/urls/delete/${shortCode}`, {
        headers,
      });

      if (isSignedIn) {
        await fetchAuthenticatedURLs();
      } else {
        await fetchAnonymousURLs();
      }
    } catch (e) {
      console.error("Failed to delete :", e);
    } finally {
      setDeleteUrl(false);
    }
  }

  async function handleCopy(shortCode: string, index: number) {
    try {
      await navigator.clipboard.writeText(`${shortUrlBase}/${shortCode}`);
      setCopied(index);
      setTimeout(() => setCopied(null), 2000);
    } catch (e) {
      console.error("Failed to copy:", e);
    }
  }

  function handleQR(shortCode: string) {
    setSelectedQRUrl(`${shortUrlBase}/${shortCode}`);
    setShowQR(true);
  }

  return (
    <div className="w-full max-w-xl px-4 font-mono">
      <QRCodeDialog
        url={selectedQRUrl}
        open={showQR}
        onOpenChange={setShowQR}
      />
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-3 px-4 py-2.5 shadow-lg border border-border rounded-md flex-1">
          <Link2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            placeholder="Shorten any link..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && HandleShorten()}
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
          />
        </div>
        <Button
          onClick={HandleShorten}
          disabled={
            loading || !value.trim() || (!session?.user && remainingUrls <= 0)
          }
          className="px-4 py-2.5 font-medium text-sm h-auto"
        >
          {!loading ? (
            "Shorten Link"
          ) : (
            <Loader className="h-5 w-5 animate-spin" />
          )}
        </Button>
      </div>

      <div className="mt-4 space-y-3">
        {urls.map((url, index) => (
          <div
            key={url.short_code}
            className="bg-background border border-dashed rounded-lg overflow-hidden"
          >
            <div className="p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
                    <div className="w-4 h-4 rounded-full bg-background"></div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`${shortUrlBase}/${url.short_code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-medium truncate"
                      >
                        {`${shortUrlBase}/${url.short_code}`
                          .replace(/^https?:\/\//, "")
                          .replace(/^http:\/\//, "")}
                      </Link>
                      <button
                        onClick={() => handleCopy(url.short_code, index)}
                        className="p-1 hover:bg-muted rounded transition-colors flex-shrink-0"
                        aria-label="Copy URL"
                      >
                        {copied === index ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                      <button
                        onClick={() => handleQR(url.short_code)}
                        className="p-1 hover:bg-muted rounded transition-colors flex-shrink-0"
                        aria-label="Show QR Code"
                      >
                        <QrCode className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                      <span>↳</span>
                      <span className="truncate">
                        {url.long_url
                          .replace(/^https?:\/\//, "")
                          .replace(/^http:\/\//, "")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-muted rounded">
                    <MousePointerClick className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs font-medium">
                      {url.clicks} clicks
                    </span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="p-1 hover:bg-muted rounded transition-colors"
                        aria-label="More options"
                        disabled={deleteUrl}
                      >
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => DeleteUrl(url.short_code)}
                        disabled={deleteUrl}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!session?.user && remainingUrls < 3 && (
        <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-4 z-20 pointer-events-none">
          <div className="inline-block px-4 py-2 bg-muted/50 border border-border rounded-md text-sm text-center font-mono pointer-events-auto">
            <span className="text-muted-foreground">
              {remainingUrls} of 5 URLs left,{" "}
            </span>
            <Link href="/sign-in" className="text-foreground hover:underline">
              Sign in for more
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
