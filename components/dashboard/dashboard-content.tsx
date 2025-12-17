"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader } from 'lucide-react';
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
  BarChart3,
  Tag,
  Plus,
  Table,
  Pencil,
  Share2,
  User,
  Moon,
  Sun,
  ChevronsUpDown,
  LogOut,
  Settings,
  CreditCard,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { authClient } from "@/lib/auth-client";
import { QRCodeDialog } from "@/components/qrcode";
import { AnalyticsSheet } from "@/components/dashboard/analytics-sheet";
import { CreateLinkDialog } from "@/components/dashboard/create-link-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

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
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedAnalyticsUrl, setSelectedAnalyticsUrl] = useState<URL | null>(null);
  const [showCreateLink, setShowCreateLink] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  function handleOpenAnalytics(url: URL) {
    setSelectedAnalyticsUrl(url);
    setShowAnalytics(true);
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
    <div className="min-h-screen bg-muted/40 dark:bg-[#0a0a0a] font-mono">
      <QRCodeDialog
        url={selectedQRUrl}
        open={showQR}
        onOpenChange={setShowQR}
      />
      <AnalyticsSheet
        url={selectedAnalyticsUrl}
        open={showAnalytics}
        onOpenChange={setShowAnalytics}
      />
      <CreateLinkDialog
        open={showCreateLink}
        onOpenChange={setShowCreateLink}
        onSuccess={fetchAuthenticatedURLs}
      />

      <div className="flex h-screen">
        {/* Mobile Menu Sheet */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-56 p-0">
            <SheetHeader className="p-4 border-b border-border/50">
              <SheetTitle className="text-left">
                <Link href="/" className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-foreground rounded-md flex items-center justify-center">
                    <Loader className="w-4 h-4 text-background" />
                  </div>
                  <span className="font-semibold text-sm tracking-tight">Swiftly</span>
                </Link>
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col h-full">
              <nav className="flex-1 px-3 py-4">
                <div className="space-y-0.5">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm bg-foreground/[0.06] dark:bg-white/[0.08] text-foreground rounded-md font-medium"
                  >
                    <Link2 className="w-4 h-4" />
                    Links
                  </Link>
                </div>
                <div className="mt-6">
                  <p className="px-3 text-[11px] uppercase tracking-wider text-muted-foreground/70 font-medium mb-2">
                    Library
                  </p>
                  <div className="space-y-0.5">
                    <div
                      className="flex items-center justify-between px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
                    >
                      <span className="flex items-center gap-2.5">
                        <Tag className="w-4 h-4" />
                        Tags
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-foreground/[0.06] dark:bg-white/[0.06] rounded text-muted-foreground/70 font-medium">
                        Soon
                      </span>
                    </div>
                  </div>
                </div>
              </nav>
              <div className="p-2 border-t border-border/50">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-full flex items-center gap-2.5 p-2 rounded-md hover:bg-foreground/[0.04] dark:hover:bg-white/[0.04] transition-colors">
                      <div className="w-8 h-8 rounded-full bg-foreground/[0.08] dark:bg-white/[0.08] flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {session?.user?.image ? (
                          <img 
                            src={session.user.image} 
                            alt="" 
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <User className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <p className="text-xs font-medium truncate">
                          {session?.user?.name || 'User'}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          {session?.user?.email || ''}
                        </p>
                      </div>
                      <ChevronsUpDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" align="start" className="w-[200px]">
                    <div className="px-2 py-1.5 border-b border-border mb-1">
                      <p className="text-sm font-medium">{session?.user?.name || 'User'}</p>
                      <p className="text-xs text-muted-foreground">{session?.user?.email || ''}</p>
                    </div>
                    <DropdownMenuItem>
                      <User className="w-4 h-4" />
                      Account
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CreditCard className="w-4 h-4" />
                      Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4" />
                      Settings
                    </DropdownMenuItem>
                    <div className="border-t border-border mt-1 pt-1">
                      <DropdownMenuItem 
                        onClick={() => authClient.signOut()}
                        className="text-destructive focus:text-destructive"
                      >
                        <LogOut className="w-4 h-4" />
                        Log out
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Sidebar - Hidden on mobile */}
        <aside className="hidden md:flex w-56 bg-background dark:bg-[#0a0a0a] border-r border-border/50 dark:border-white/[0.08] flex-col">
          {/* Logo */}
          <div className="h-14 px-4 flex items-center border-b border-border/50 dark:border-white/[0.08]">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-foreground rounded-md flex items-center justify-center">
                <Loader className="w-4 h-4 text-background" />
              </div>
              <span className="font-semibold text-sm tracking-tight">Swiftly</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4">
            <div className="space-y-0.5">
              <Link
                href="/dashboard"
                className="flex items-center gap-2.5 px-3 py-2 text-sm bg-foreground/[0.06] dark:bg-white/[0.08] text-foreground rounded-md font-medium"
              >
                <Link2 className="w-4 h-4" />
                Links
              </Link>
            </div>

            {/* Library Section */}
            <div className="mt-6">
              <p className="px-3 text-[11px] uppercase tracking-wider text-muted-foreground/70 font-medium mb-2">
                Library
              </p>
              <div className="space-y-0.5">
                <div
                  className="flex items-center justify-between px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
                >
                  <span className="flex items-center gap-2.5">
                    <Tag className="w-4 h-4" />
                    Tags
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-foreground/[0.06] dark:bg-white/[0.06] rounded text-muted-foreground/70 font-medium">
                    Soon
                  </span>
                </div>
              </div>
            </div>
          </nav>

          {/* User Profile Section */}
          <div className="p-2 border-t border-border/50 dark:border-white/[0.08]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center gap-2.5 p-2 rounded-md hover:bg-foreground/[0.04] dark:hover:bg-white/[0.04] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-foreground/[0.08] dark:bg-white/[0.08] flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {session?.user?.image ? (
                      <img 
                        src={session.user.image} 
                        alt="" 
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <User className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-xs font-medium truncate">
                      {session?.user?.name || 'User'}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {session?.user?.email || ''}
                    </p>
                  </div>
                  <ChevronsUpDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-[200px]">
                <div className="px-2 py-1.5 border-b border-border mb-1">
                  <p className="text-sm font-medium">{session?.user?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{session?.user?.email || ''}</p>
                </div>
                <DropdownMenuItem>
                  <User className="w-4 h-4" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="w-4 h-4" />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4" />
                  Settings
                </DropdownMenuItem>
                <div className="border-t border-border mt-1 pt-1">
                  <DropdownMenuItem 
                    onClick={() => authClient.signOut()}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-background dark:bg-[#0f0f0f] flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-14 flex items-center justify-between px-3 sm:px-6 border-b border-border/50 dark:border-white/[0.08]">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden h-8 w-8 p-0"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-4 h-4" />
              </Button>
              <h1 className="text-sm sm:text-base font-semibold">All Links</h1>
            </div>
            <Button 
              size="sm" 
              className="gap-1.5 h-8 text-xs px-2 sm:px-3"
              onClick={() => setShowCreateLink(true)}
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Create link</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </header>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 px-3 sm:px-6 py-2 sm:py-3 border-b border-border/50 dark:border-white/[0.08] bg-muted/30 dark:bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs border-border/60 dark:border-white/[0.1] px-2 sm:px-3">
                <Filter className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs border-border/60 dark:border-white/[0.1] px-2 sm:px-3">
                    {viewMode === "card" ? (
                      <LayoutGrid className="w-3.5 h-3.5" />
                    ) : (
                      <Table className="w-3.5 h-3.5" />
                    )}
                    <span className="hidden sm:inline">{viewMode === "card" ? "Cards" : "Table"}</span>
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
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 border border-border/60 dark:border-white/[0.1] rounded-md bg-background dark:bg-white/[0.02] flex-1 sm:flex-none sm:w-64 min-w-0">
                <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search links..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-xs placeholder:text-muted-foreground/60 min-w-0"
                />
              </div>
            </div>
          </div>

        {/* Links List */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-foreground/[0.03] dark:bg-white/[0.03] rounded-md animate-pulse"
                />
              ))}
            </div>
          ) : filteredUrls.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20">
              <div className="w-14 h-14 rounded-full bg-foreground/[0.05] dark:bg-white/[0.05] flex items-center justify-center mb-4">
                <Link2 className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-medium mb-1">
                {searchQuery ? "No links found" : "No links yet"}
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                {searchQuery
                  ? "Try a different search term"
                  : "Create your first shortened link"}
              </p>
              {!searchQuery && (
                <Link href="/">
                  <Button size="sm" className="gap-1.5 h-8 text-xs">
                    <Plus className="w-3.5 h-3.5" />
                    Create link
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <>
              {viewMode === "card" ? (
                <div className="p-3 sm:p-6 space-y-3">
                  {filteredUrls.map((url) => (
                    <div
                      key={url.short_code}
                      onClick={(e) => {
                        const target = e.target as HTMLElement;
                        if (
                          target.closest('button') ||
                          target.closest('a') ||
                          target.closest('[role="menuitem"]') ||
                          target.closest('[data-radix-dropdown-menu-trigger]')
                        ) {
                          return;
                        }
                        handleOpenAnalytics(url);
                      }}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-0 px-3 sm:px-5 py-3 sm:py-4 rounded-lg 
                        bg-foreground/[0.02] dark:bg-white/[0.025] 
                        border border-border/40 dark:border-white/[0.06]
                        hover:border-border dark:hover:border-white/[0.12]
                        hover:bg-foreground/[0.04] dark:hover:bg-white/[0.04]
                        cursor-pointer transition-all duration-150 group"
                    >
                      {/* Top row: Favicon + Link Details + Actions */}
                      <div className="flex items-start sm:items-center gap-3 w-full sm:flex-1 min-w-0">
                        {/* Favicon */}
                        <div className="w-10 h-10 rounded-full bg-foreground/[0.05] dark:bg-white/[0.06] flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {getFavicon(url.long_url) ? (
                            <img
                              src={getFavicon(url.long_url)!}
                              alt=""
                              className="w-5 h-5 dark:opacity-90"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <Link2 className="w-4.5 h-4.5 text-muted-foreground" />
                          )}
                        </div>

                        {/* Link Details */}
                        <div className="min-w-0 flex-1">
                          {/* Short URL */}
                          <div className="flex items-center gap-1.5">
                            <Link
                              href={`${shortUrlBase}/${url.short_code}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium hover:underline truncate"
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
                              className="p-1 hover:bg-foreground/[0.06] dark:hover:bg-white/[0.08] rounded transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                              aria-label="Copy URL"
                            >
                              {copied === url.short_code ? (
                                <Check className="w-3.5 h-3.5 text-green-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                              )}
                            </button>
                          </div>
                          
                          {/* Destination URL */}
                          <div className="mt-0.5">
                            <span className="text-xs text-muted-foreground/70 truncate block">
                              {url.long_url
                                .replace(/^https?:\/\//, "")
                                .replace(/^www\./, "")}
                            </span>
                          </div>
                          
                          {/* Date + Tags row */}
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className="text-[11px] text-muted-foreground">
                              {formatDate(url.created_at)}
                            </span>
                            <span className="text-muted-foreground/30 hidden sm:inline">•</span>
                            <div className="flex items-center gap-1 flex-wrap">
                              <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                marketing
                              </span>
                              <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-green-500/10 text-green-600 dark:text-green-400">
                                social
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Clicks stat - Mobile */}
                        <div className="flex sm:hidden items-center gap-1 px-2.5 py-1 bg-foreground/[0.04] dark:bg-white/[0.06] rounded text-xs flex-shrink-0">
                          <MousePointerClick className="w-3 h-3 text-muted-foreground" />
                          <span className="font-medium">{url.clicks}</span>
                        </div>

                        {/* Actions - Mobile */}
                        <div className="flex sm:hidden items-center gap-1 flex-shrink-0">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                onClick={(e) => e.stopPropagation()}
                                className="p-1.5 hover:bg-foreground/[0.06] dark:hover:bg-white/[0.08] rounded transition-colors"
                                aria-label="More options"
                                disabled={deleteLoading === url.short_code}
                              >
                                <MoreVertical className="w-3.5 h-3.5 text-muted-foreground" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleOpenAnalytics(url)}>
                                <BarChart3 className="w-4 h-4" />
                                View Analytics
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCopy(url.short_code)}>
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteUrl(url.short_code);
                                }}
                                disabled={deleteLoading === url.short_code}
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Desktop: Clicks stat + Actions */}
                      <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
                        {/* Clicks stat */}
                        <div className="flex items-center gap-1 px-2.5 py-1 bg-foreground/[0.04] dark:bg-white/[0.06] rounded text-xs flex-shrink-0 mr-2">
                          <MousePointerClick className="w-3 h-3 text-muted-foreground" />
                          <span className="font-medium">{url.clicks}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {/* Share button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(url.short_code);
                            }}
                            className="p-1.5 hover:bg-foreground/[0.06] dark:hover:bg-white/[0.08] rounded transition-colors"
                            aria-label="Share link"
                          >
                            <Share2 className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                          
                          {/* QR Code button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQR(url.short_code);
                            }}
                            className="p-1.5 hover:bg-foreground/[0.06] dark:hover:bg-white/[0.08] rounded transition-colors"
                            aria-label="Show QR Code"
                          >
                            <QrCode className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>

                          {/* Edit button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // TODO: Implement edit functionality
                            }}
                            className="p-1.5 hover:bg-foreground/[0.06] dark:hover:bg-white/[0.08] rounded transition-colors"
                            aria-label="Edit link"
                          >
                            <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                          
                          {/* More menu */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                onClick={(e) => e.stopPropagation()}
                                className="p-1.5 hover:bg-foreground/[0.06] dark:hover:bg-white/[0.08] rounded transition-colors"
                                aria-label="More options"
                                disabled={deleteLoading === url.short_code}
                              >
                                <MoreVertical className="w-3.5 h-3.5 text-muted-foreground" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleOpenAnalytics(url)}>
                                <BarChart3 className="w-4 h-4" />
                                View Analytics
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCopy(url.short_code)}>
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteUrl(url.short_code);
                                }}
                                disabled={deleteLoading === url.short_code}
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
              /* Table View - Hidden on mobile, show cards instead */
                <div className="p-3 sm:p-6">
                  <div className="hidden sm:block border border-border/50 dark:border-white/[0.08] rounded-md overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                      <thead className="bg-foreground/[0.02] dark:bg-white/[0.02]">
                        <tr className="text-left text-sm text-muted-foreground">
                          <th className="px-4 py-3 font-medium">Short Link</th>
                          <th className="px-4 py-3 font-medium">Original URL</th>
                          <th className="px-4 py-3 font-medium text-center">Date</th>
                          <th className="px-4 py-3 font-medium text-center">Clicks</th>
                          <th className="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50 dark:divide-white/[0.06]">
                        {filteredUrls.map((url) => (
                          <tr 
                            key={url.short_code}
                            onClick={(e) => {
                              const target = e.target as HTMLElement;
                              if (
                                target.closest('button') ||
                                target.closest('a') ||
                                target.closest('[role="menuitem"]') ||
                                target.closest('[data-radix-dropdown-menu-trigger]')
                              ) {
                                return;
                              }
                              handleOpenAnalytics(url);
                            }}
                            className="hover:bg-foreground/[0.02] dark:hover:bg-white/[0.02] transition-colors group cursor-pointer"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-md bg-foreground/[0.05] dark:bg-white/[0.06] flex items-center justify-center flex-shrink-0 overflow-hidden">
                                  {getFavicon(url.long_url) ? (
                                    <img
                                      src={getFavicon(url.long_url)!}
                                      alt=""
                                      className="w-4 h-4 dark:opacity-90"
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
                                  className="p-1 hover:bg-foreground/[0.06] dark:hover:bg-white/[0.08] rounded transition-colors opacity-0 group-hover:opacity-100"
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
                              <span className="text-sm text-muted-foreground/70 truncate block max-w-xs">
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
                            <td className="px-4 py-2.5 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleQR(url.short_code)}
                                  className="p-1 hover:bg-foreground/[0.06] dark:hover:bg-white/[0.08] rounded transition-colors opacity-0 group-hover:opacity-100"
                                  aria-label="Show QR Code"
                                >
                                  <QrCode className="w-3.5 h-3.5 text-muted-foreground" />
                                </button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <button
                                      className="p-1 hover:bg-foreground/[0.06] dark:hover:bg-white/[0.08] rounded transition-colors"
                                      aria-label="More options"
                                      disabled={deleteLoading === url.short_code}
                                    >
                                      <MoreVertical className="w-3.5 h-3.5 text-muted-foreground" />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleOpenAnalytics(url)}>
                                      <BarChart3 className="w-4 h-4" />
                                      View Analytics
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleCopy(url.short_code)}>
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
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteUrl(url.short_code);
                                      }}
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
                  {/* Mobile: Show cards instead of table */}
                  <div className="sm:hidden space-y-3">
                    {filteredUrls.map((url) => (
                      <div
                        key={url.short_code}
                        onClick={(e) => {
                          const target = e.target as HTMLElement;
                          if (
                            target.closest('button') ||
                            target.closest('a') ||
                            target.closest('[role="menuitem"]') ||
                            target.closest('[data-radix-dropdown-menu-trigger]')
                          ) {
                            return;
                          }
                          handleOpenAnalytics(url);
                        }}
                        className="flex flex-col gap-3 px-3 py-3 rounded-lg 
                          bg-foreground/[0.02] dark:bg-white/[0.025] 
                          border border-border/40 dark:border-white/[0.06]
                          hover:border-border dark:hover:border-white/[0.12]
                          hover:bg-foreground/[0.04] dark:hover:bg-white/[0.04]
                          cursor-pointer transition-all duration-150"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-md bg-foreground/[0.05] dark:bg-white/[0.06] flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {getFavicon(url.long_url) ? (
                              <img
                                src={getFavicon(url.long_url)!}
                                alt=""
                                className="w-4 h-4 dark:opacity-90"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <Link2 className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <Link
                              href={`${shortUrlBase}/${url.short_code}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium hover:underline truncate block"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {`${shortUrlBase}/${url.short_code}`
                                .replace(/^https?:\/\//, "")
                                .replace(/^www\./, "")}
                            </Link>
                            <span className="text-xs text-muted-foreground/70 truncate block mt-1">
                              {url.long_url
                                .replace(/^https?:\/\//, "")
                                .replace(/^www\./, "")}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{formatDate(url.created_at)}</span>
                            <span className="flex items-center gap-1">
                              <MousePointerClick className="w-3 h-3" />
                              {url.clicks}
                            </span>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                onClick={(e) => e.stopPropagation()}
                                className="p-1.5 hover:bg-foreground/[0.06] dark:hover:bg-white/[0.08] rounded transition-colors"
                                aria-label="More options"
                                disabled={deleteLoading === url.short_code}
                              >
                                <MoreVertical className="w-4 h-4 text-muted-foreground" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleOpenAnalytics(url)}>
                                <BarChart3 className="w-4 h-4" />
                                View Analytics
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCopy(url.short_code)}>
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteUrl(url.short_code);
                                }}
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
                </div>
              )}
            </>
          )}
          </div>
        </div>

        {/* Footer */}
        {filteredUrls.length > 0 && (
          <footer className="flex items-center justify-center px-3 sm:px-6 py-3 text-xs text-muted-foreground">
            Showing {filteredUrls.length} of {urls.length} links
          </footer>
        )}
        </main>
      </div>
    </div>
  );
}
