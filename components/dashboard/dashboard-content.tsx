"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Link2,
  Copy,
  Check,
  QrCode,
  MoreVertical,
  MousePointerClick,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  LayoutGrid,
  ChevronDown,
  BarChart3,
  Tag,
  Plus,
  Table,
} from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { QRCodeDialog } from "@/components/qrcode";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface URL {
  short_code: string;
  long_url: string;
  clicks: number;
  expires_at?: string;
  created_at: string;
}

export function DashboardContent() {
  const [urls, setUrls] = useState<URL[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [selectedQRUrl, setSelectedQRUrl] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const { data: session } = authClient.useSession();

  const backendBaseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
  const shortUrlBase =
    process.env.NEXT_PUBLIC_FRONTEND_URL || backendBaseUrl;

  const getJWTToken = async () => {
    try {
      const { data } = await authClient.token();
      return data?.token;
    } catch (error) {
      console.error("Failed to get JWT token:", error);
      return null;
    }
  };

  const fetchAuthenticatedURLs = useCallback(async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }, [backendBaseUrl]);

  useEffect(() => {
    if (session?.user) {
      fetchAuthenticatedURLs();
    }
  }, [session, fetchAuthenticatedURLs]);

  async function deleteUrl(shortCode: string) {
    try {
      setDeleteLoading(shortCode);
      const jwtToken = await getJWTToken();
      if (!jwtToken) return;

      await axios.delete(`${backendBaseUrl}/urls/delete/${shortCode}`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      await fetchAuthenticatedURLs();
    } catch (e) {
      console.error("Failed to delete:", e);
    } finally {
      setDeleteLoading(null);
    }
  }

  async function handleCopy(shortCode: string) {
    try {
      const urlToCopy = `${shortUrlBase}/${shortCode}`.replace(/www\./i, "");
      await navigator.clipboard.writeText(urlToCopy);
      setCopied(shortCode);
      setTimeout(() => setCopied(null), 2000);
    } catch (e) {
      console.error("Failed to copy:", e);
    }
  }

  function handleQR(shortCode: string) {
    const urlForQR = `${shortUrlBase}/${shortCode}`.replace(/www\./i, "");
    setSelectedQRUrl(urlForQR);
    setShowQR(true);
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  function getFavicon(url: string) {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return null;
    }
  }

  // Filter URLs based on search query
  const filteredUrls = urls.filter(
    (url) =>
      url.short_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      url.long_url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-muted/30 p-3 font-mono">
      <QRCodeDialog
        url={selectedQRUrl}
        open={showQR}
        onOpenChange={setShowQR}
      />

      <div className="flex gap-3 h-[calc(100vh-24px)]">
        {/* Sidebar */}
        <aside className="w-64 bg-card rounded-lg border border-border flex flex-col overflow-hidden">
          {/* Logo */}
          <div className="h-16 px-5 flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-foreground rounded-lg flex items-center justify-center">
                <span className="text-background text-sm font-bold">S</span>
              </div>
              <span className="font-semibold text-base">Short Links</span>
            </Link>
          </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-2.5 text-base bg-accent text-accent-foreground rounded-md"
            >
              <Link2 className="w-5 h-5" />
              Links
            </Link>
          </div>

          {/* Insights Section */}
          <div className="mt-8">
            <p className="px-4 text-sm text-muted-foreground font-medium mb-3">
              Insights
            </p>
            <div className="space-y-1">
              <Link
                href="#"
                className="flex items-center gap-3 px-4 py-2.5 text-base text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
              >
                <BarChart3 className="w-5 h-5" />
                Analytics
              </Link>
            </div>
          </div>

          {/* Library Section */}
          <div className="mt-8">
            <p className="px-4 text-sm text-muted-foreground font-medium mb-3">
              Library
            </p>
            <div className="space-y-1">
              <Link
                href="#"
                className="flex items-center gap-3 px-4 py-2.5 text-base text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
              >
                <Tag className="w-5 h-5" />
                Tags
              </Link>
            </div>
          </div>
        </nav>

          {/* Bottom Section */}
          <div className="p-4 mt-auto">
            <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-4">
              <p className="mb-2 font-medium">Usage</p>
              <div className="flex items-center justify-between">
                <span>Links</span>
                <span className="font-semibold text-foreground">{urls.length}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-card rounded-lg border border-border flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-16 flex items-center justify-between px-8">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">Links</h1>
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </div>
            <Link href="/">
              <Button size="default" className="gap-2">
                Create link
                <Plus className="w-4 h-4" />
              </Button>
            </Link>
          </header>

          {/* Filter Bar */}
          <div className="flex items-center justify-between px-8 py-6 border-t border-border">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="default" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
                <ChevronDown className="w-4 h-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="default" className="gap-2">
                    {viewMode === "card" ? (
                      <LayoutGrid className="w-4 h-4" />
                    ) : (
                      <Table className="w-4 h-4" />
                    )}
                    {viewMode === "card" ? "Card" : "Table"}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => setViewMode("card")}>
                    <LayoutGrid className="w-4 h-4" />
                    Card View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setViewMode("table")}>
                    <Table className="w-4 h-4" />
                    Table View
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 px-4 py-2.5 border border-border rounded-lg bg-background w-80">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by short link or URL"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
                />
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>

        {/* Links List */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="pt-1 px-8 pb-8 space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 bg-muted/30 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : filteredUrls.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-24">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-5">
                <Link2 className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-3">
                {searchQuery ? "No links found" : "No links yet"}
              </h3>
              <p className="text-base text-muted-foreground mb-5">
                {searchQuery
                  ? "Try a different search term"
                  : "Create your first shortened link to get started"}
              </p>
              {!searchQuery && (
                <Link href="/">
                  <Button size="default" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Create link
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <>
              {viewMode === "card" ? (
                <div className="pt-1 px-8 pb-8 space-y-4">
                  {filteredUrls.map((url) => (
                    <div
                      key={url.short_code}
                      className="flex items-center p-5 border border-border rounded-lg bg-card cursor-pointer
                        hover:border-foreground/30 hover:shadow-md hover:-translate-y-0.5 
                        transition-all duration-200 ease-out group"
                    >
                      {/* Left: Favicon + Link Info */}
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        {/* Favicon */}
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {getFavicon(url.long_url) ? (
                            <img
                              src={getFavicon(url.long_url)!}
                              alt=""
                              className="w-6 h-6"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <Link2 className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>

                        {/* Link Details */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`${shortUrlBase}/${url.short_code}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-base font-medium hover:underline truncate"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {`${shortUrlBase}/${url.short_code}`
                                .replace(/^https?:\/\//, "")
                                .replace(/^www\./, "")}
                            </Link>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(url.short_code);
                              }}
                              className="p-1 hover:bg-muted rounded transition-colors opacity-0 group-hover:opacity-100"
                              aria-label="Copy URL"
                            >
                              {copied === url.short_code ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4 text-muted-foreground" />
                              )}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQR(url.short_code);
                              }}
                              className="p-1 hover:bg-muted rounded transition-colors opacity-0 group-hover:opacity-100"
                              aria-label="Show QR Code"
                            >
                              <QrCode className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                            <span>↳</span>
                            <span className="truncate max-w-md">
                              {url.long_url
                                .replace(/^https?:\/\//, "")
                                .replace(/^www\./, "")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Middle: Date Column */}
                      <div className="w-28 flex-shrink-0 text-center">
                        <span className="text-sm text-muted-foreground">
                          {formatDate(url.created_at)}
                        </span>
                      </div>

                      {/* Right: Clicks + Actions */}
                      <div className="flex items-center gap-4 flex-shrink-0">
                        {/* Clicks badge with bg like homepage */}
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded">
                          <MousePointerClick className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {url.clicks} clicks
                          </span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 hover:bg-muted rounded transition-colors"
                              aria-label="More options"
                              disabled={deleteLoading === url.short_code}
                            >
                              <MoreVertical className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleCopy(url.short_code)}
                            >
                              <Copy className="w-4 h-4" />
                              Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleQR(url.short_code)}>
                              <QrCode className="w-4 h-4" />
                              Show QR Code
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={url.long_url} target="_blank">
                                <ExternalLink className="w-4 h-4" />
                                Open Original
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => deleteUrl(url.short_code)}
                              disabled={deleteLoading === url.short_code}
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Table View */
                <div className="pt-1 px-8 pb-8">
                  <div className="border border-border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr className="text-left text-sm text-muted-foreground">
                          <th className="px-4 py-3 font-medium">Short Link</th>
                          <th className="px-4 py-3 font-medium">Original URL</th>
                          <th className="px-4 py-3 font-medium text-center">Date</th>
                          <th className="px-4 py-3 font-medium text-center">Clicks</th>
                          <th className="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredUrls.map((url) => (
                          <tr 
                            key={url.short_code}
                            className="hover:bg-muted/30 transition-colors group"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                                  {getFavicon(url.long_url) ? (
                                    <img
                                      src={getFavicon(url.long_url)!}
                                      alt=""
                                      className="w-4 h-4"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = "none";
                                      }}
                                    />
                                  ) : (
                                    <Link2 className="w-4 h-4 text-muted-foreground" />
                                  )}
                                </div>
                                <Link
                                  href={`${shortUrlBase}/${url.short_code}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm font-medium hover:underline"
                                >
                                  {`${shortUrlBase}/${url.short_code}`
                                    .replace(/^https?:\/\//, "")
                                    .replace(/^www\./, "")}
                                </Link>
                                <button
                                  onClick={() => handleCopy(url.short_code)}
                                  className="p-1 hover:bg-muted rounded transition-colors opacity-0 group-hover:opacity-100"
                                  aria-label="Copy URL"
                                >
                                  {copied === url.short_code ? (
                                    <Check className="w-3.5 h-3.5 text-green-500" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                                  )}
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm text-muted-foreground truncate block max-w-xs">
                                {url.long_url
                                  .replace(/^https?:\/\//, "")
                                  .replace(/^www\./, "")}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="text-sm text-muted-foreground">
                                {formatDate(url.created_at)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="inline-flex items-center gap-1 text-sm">
                                <MousePointerClick className="w-3.5 h-3.5 text-muted-foreground" />
                                {url.clicks}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleQR(url.short_code)}
                                  className="p-1.5 hover:bg-muted rounded transition-colors opacity-0 group-hover:opacity-100"
                                  aria-label="Show QR Code"
                                >
                                  <QrCode className="w-4 h-4 text-muted-foreground" />
                                </button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <button
                                      className="p-1.5 hover:bg-muted rounded transition-colors"
                                      aria-label="More options"
                                      disabled={deleteLoading === url.short_code}
                                    >
                                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => handleCopy(url.short_code)}
                                    >
                                      <Copy className="w-4 h-4" />
                                      Copy Link
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleQR(url.short_code)}>
                                      <QrCode className="w-4 h-4" />
                                      Show QR Code
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                      <Link href={url.long_url} target="_blank">
                                        <ExternalLink className="w-4 h-4" />
                                        Open Original
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      variant="destructive"
                                      onClick={() => deleteUrl(url.short_code)}
                                      disabled={deleteLoading === url.short_code}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {filteredUrls.length > 0 && (
          <footer className="flex items-center justify-center px-8 py-4 border-t border-border text-sm text-muted-foreground">
            Viewing 1-{filteredUrls.length} of {urls.length} links
          </footer>
        )}
        </main>
      </div>
    </div>
  );
}
