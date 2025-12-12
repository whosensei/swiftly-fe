"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { authClient } from "@/lib/auth-client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Globe,
  MapPin,
  Link2,
  Monitor,
  Smartphone,
  MousePointerClick,
  Loader2,
  ExternalLink,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";

interface GroupCount {
  value: string;
  count: number;
}

interface TimeSeries {
  date: string;
  clicks: number;
}

interface AnalyticsData {
  countries: GroupCount[];
  cities: GroupCount[];
  referrers: GroupCount[];
  devices: GroupCount[];
  browsers: GroupCount[];
  os: GroupCount[];
  timeseries: TimeSeries[];
  total_clicks: number;
  last_clicked_at: string | null;
}

interface URL {
  short_code: string;
  long_url: string;
  clicks: number;
  expires_at?: string;
  created_at: string;
}

interface AnalyticsSheetProps {
  url: URL | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Format date for display
function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Stats Card Component
function StatsCard({
  label,
  value,
  change,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  change?: number;
  icon?: React.ElementType;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
      </div>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-2xl font-bold">{value}</span>
        {change !== undefined && (
          <span
            className={`text-xs px-1.5 py-0.5 rounded ${
              change >= 0
                ? "bg-green-500/10 text-green-500"
                : "bg-red-500/10 text-red-500"
            }`}
          >
            {change >= 0 ? "+" : ""}
            {change}%
          </span>
        )}
      </div>
    </div>
  );
}

// Analytics List Item
function AnalyticsListItem({
  label,
  _value,
  percentage,
  icon,
}: {
  label: string;
  _value?: number;
  percentage: number;
  icon?: React.ReactNode;
}) {
  return (
    <div className="group">
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {icon}
          <span className="text-sm truncate">{label}</span>
        </div>
        <span className="text-sm text-muted-foreground ml-2 tabular-nums">
          {percentage.toFixed(0)}%
        </span>
      </div>
      <div className="h-1 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary/60 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Analytics Panel Component
function AnalyticsPanel({
  title,
  data,
  total,
  icon: Icon,
  emptyText = "No data yet",
}: {
  title: string;
  data: GroupCount[];
  total: number;
  icon: React.ElementType;
  emptyText?: string;
}) {
  if (!data || data.length === 0) {
    return (
      <Card className="py-0 overflow-hidden">
        <CardHeader className="py-3 px-4 border-b border-border">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Icon className="w-4 h-4" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <TrendingUp className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">{emptyText}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="py-0 overflow-hidden">
      <CardHeader className="py-3 px-4 border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Icon className="w-4 h-4" />
            {title}
          </CardTitle>
          <span className="text-xs text-muted-foreground uppercase tracking-wide">
            Visitors
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        {data.slice(0, 5).map((item) => {
          const percentage = total > 0 ? (item.count / total) * 100 : 0;
          return (
            <AnalyticsListItem
              key={item.value}
              label={item.value}
              _value={item.count}
              percentage={percentage}
            />
          );
        })}
        {data.length > 5 && (
          <p className="text-xs text-muted-foreground pt-2 text-center">
            +{data.length - 5} more
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// Custom Tooltip for Chart
interface TooltipPayload {
  value: number;
  dataKey: string;
  payload: TimeSeries;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg">
        <p className="text-xs text-muted-foreground">{formatDate(label || "")}</p>
        <p className="text-sm font-semibold">
          {payload[0].value} {payload[0].value === 1 ? "click" : "clicks"}
        </p>
      </div>
    );
  }
  return null;
}

export function AnalyticsSheet({ url, open, onOpenChange }: AnalyticsSheetProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState<string>("#3b82f6");

  const backendBaseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
  const shortUrlBase =
    process.env.NEXT_PUBLIC_FRONTEND_URL || backendBaseUrl;

  // Get primary color from CSS variable
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Create a temporary element to get computed color
      const tempEl = document.createElement("div");
      tempEl.style.color = "hsl(var(--primary))";
      tempEl.style.position = "absolute";
      tempEl.style.visibility = "hidden";
      document.body.appendChild(tempEl);
      const computedColor = getComputedStyle(tempEl).color;
      document.body.removeChild(tempEl);
      
      if (computedColor && computedColor !== "rgba(0, 0, 0, 0)") {
        setPrimaryColor(computedColor);
      }
    }
  }, []);

  const getJWTToken = async () => {
    try {
      const { data } = await authClient.token();
      return data?.token;
    } catch (error) {
      console.error("Failed to get JWT token:", error);
      return null;
    }
  };

  const fetchAnalytics = useCallback(async () => {
    if (!url) return;

    try {
      setLoading(true);
      setError(null);
      const jwtToken = await getJWTToken();

      const response = await axios.get(
        `${backendBaseUrl}/analytics/${url.short_code}`,
        {
          headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
        }
      );

      setAnalytics(response.data);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  }, [url, backendBaseUrl]);

  useEffect(() => {
    if (open && url) {
      fetchAnalytics();
    } else {
      setAnalytics(null);
      setError(null);
    }
  }, [open, url, fetchAnalytics]);

  const totalClicks = analytics?.total_clicks || url?.clicks || 0;
  
  // Calculate week-over-week change (simplified)
  const thisWeekClicks = analytics?.timeseries?.reduce((sum, d) => sum + d.clicks, 0) || 0;

  // Prepare chart data
  const chartData = analytics?.timeseries?.map((d) => ({
    date: d.date,
    clicks: d.clicks,
  })) || [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-3xl overflow-y-auto p-0"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border">
          <SheetHeader className="p-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenChange(false)}
                className="p-1 hover:bg-muted rounded-md transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-base font-semibold truncate">
                  Link Analytics
                </SheetTitle>
                {url && (
                  <SheetDescription className="truncate">
                    <a
                      href={`${shortUrlBase}/${url.short_code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:underline"
                    >
                      {`${shortUrlBase}/${url.short_code}`
                        .replace(/^https?:\/\//, "")
                        .replace(/^www\./, "")}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </SheetDescription>
                )}
              </div>
            </div>
          </SheetHeader>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center py-24">
            <p className="text-destructive">{error}</p>
            <button
              onClick={fetchAnalytics}
              className="mt-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="p-4 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3">
              <StatsCard
                label="Total Clicks"
                value={totalClicks}
                icon={MousePointerClick}
              />
              <StatsCard
                label="This Week"
                value={thisWeekClicks}
                icon={TrendingUp}
              />
              <StatsCard
                label="Unique Locations"
                value={analytics?.countries?.length || 0}
                icon={Globe}
              />
            </div>

            {/* Time Series Chart */}
            <Card className="py-0 overflow-hidden">
              <CardHeader className="py-3 px-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    Clicks over time
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">
                    Last 7 days
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {chartData.length > 0 ? (
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={primaryColor} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#404040" vertical={false} />
                        <XAxis
                          dataKey="date"
                          tickFormatter={formatDate}
                          tick={{ fontSize: 11 }}
                          tickLine={{ stroke: "#525252" }}
                          axisLine={{ stroke: "#525252", strokeWidth: 1 }}
                          dy={8}
                          stroke="#a3a3a3"
                        />
                        <YAxis
                          tick={{ fontSize: 11 }}
                          tickLine={{ stroke: "#525252" }}
                          axisLine={{ stroke: "#525252", strokeWidth: 1 }}
                          width={35}
                          allowDecimals={false}
                          stroke="#a3a3a3"
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="clicks"
                          stroke={primaryColor}
                          strokeWidth={2}
                          fill="url(#colorClicks)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No click data yet</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnalyticsPanel
                title="Countries"
                data={analytics?.countries || []}
                total={totalClicks}
                icon={Globe}
                emptyText="No location data yet"
              />
              <AnalyticsPanel
                title="Cities"
                data={analytics?.cities || []}
                total={totalClicks}
                icon={MapPin}
                emptyText="No location data yet"
              />
            </div>

            {/* Referrers */}
            <AnalyticsPanel
              title="Referrers"
              data={analytics?.referrers || []}
              total={totalClicks}
              icon={Link2}
              emptyText="No referrer data yet"
            />

            {/* Devices & Browsers with Tabs */}
            <Card className="py-0 overflow-hidden">
              <Tabs defaultValue="devices" className="w-full">
                <CardHeader className="py-3 px-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <TabsList className="h-8">
                      <TabsTrigger value="devices" className="text-xs px-3 py-1">
                        <Smartphone className="w-3 h-3 mr-1" />
                        Devices
                      </TabsTrigger>
                      <TabsTrigger value="browsers" className="text-xs px-3 py-1">
                        <Globe className="w-3 h-3 mr-1" />
                        Browsers
                      </TabsTrigger>
                    </TabsList>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">
                      Visitors
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <TabsContent value="devices" className="mt-0 space-y-2">
                    {analytics?.devices && analytics.devices.length > 0 ? (
                      analytics.devices.slice(0, 5).map((item) => (
                        <AnalyticsListItem
                          key={item.value}
                          label={item.value}
                          _value={item.count}
                          percentage={
                            totalClicks > 0 ? (item.count / totalClicks) * 100 : 0
                          }
                          icon={
                            item.value.toLowerCase().includes("mobile") ? (
                              <Smartphone className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <Monitor className="w-4 h-4 text-muted-foreground" />
                            )
                          }
                        />
                      ))
                    ) : (
                      <div className="py-8 text-center text-muted-foreground">
                        <Smartphone className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No device data yet</p>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="browsers" className="mt-0 space-y-2">
                    {analytics?.browsers && analytics.browsers.length > 0 ? (
                      analytics.browsers.slice(0, 5).map((item) => (
                        <AnalyticsListItem
                          key={item.value}
                          label={item.value}
                          _value={item.count}
                          percentage={
                            totalClicks > 0 ? (item.count / totalClicks) * 100 : 0
                          }
                          icon={<Globe className="w-4 h-4 text-muted-foreground" />}
                        />
                      ))
                    ) : (
                      <div className="py-8 text-center text-muted-foreground">
                        <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No browser data yet</p>
                      </div>
                    )}
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>

            {/* Operating Systems */}
            <AnalyticsPanel
              title="Operating Systems"
              data={analytics?.os || []}
              total={totalClicks}
              icon={Monitor}
              emptyText="No OS data yet"
            />

            {/* Last Click Info */}
            {analytics?.last_clicked_at && (
              <div className="text-center text-xs text-muted-foreground py-2">
                Last click:{" "}
                {new Date(analytics.last_clicked_at).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

