"use client";

import { 
  BarChart3, 
  QrCode, 
  Link2, 
  Zap, 
  Clock, 
  LayoutDashboard,
  Globe,
  Shield
} from "lucide-react";

const features = [
  {
    title: "Link Analytics",
    description: "Track clicks, locations, referrers, and device types in real-time.",
    icon: BarChart3,
    className: "md:col-span-2 md:row-span-2",
    visual: "chart",
  },
  {
    title: "QR Codes",
    description: "Generate scannable QR codes for any shortened link instantly.",
    icon: QrCode,
    className: "md:col-span-1 md:row-span-1",
    visual: "",
  },
  {
    title: "Instant Redirects",
    description: "Sub-millisecond redirect speeds powered by edge infrastructure.",
    icon: Zap,
    className: "md:col-span-1 md:row-span-1",
    visual: "",
  },
  {
    title: "Custom Slugs",
    description: "Create memorable, branded short URLs with custom aliases.",
    icon: Link2,
    className: "md:col-span-1 md:row-span-1",
    visual: "link",
  },
  {
    title: "Link Expiration",
    description: "Set automatic expiry dates for temporary campaigns and content.",
    icon: Clock,
    className: "md:col-span-1 md:row-span-1",
    visual: "",
  },
  {
    title: "Dashboard",
    description: "Manage all your links from a single, unified control center.",
    icon: LayoutDashboard,
    className: "md:col-span-1 md:row-span-1",
    visual: "dashboard",
  },
  {
    title: "Global CDN",
    description: "Distributed worldwide for lightning-fast access anywhere.",
    icon: Globe,
    className: "md:col-span-1 md:row-span-1",
    visual: "globe",
  },
  {
    title: "Secure Links",
    description: "Enterprise-grade security with SSL encryption on all redirects.",
    icon: Shield,
    className: "md:col-span-2 md:row-span-1",
    visual: "security",
  },
];

function FeatureVisual({ type }: { type: string }) {
  switch (type) {
    case "chart":
      return (
        <div className="absolute inset-0 overflow-hidden opacity-10 dark:opacity-20">
          <div className="absolute bottom-4 left-4 right-4 flex items-end gap-2 h-32">
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-foreground transition-all duration-700"
                style={{ 
                  height: `${h}%`,
                  animationDelay: `${i * 100}ms`
                }}
              />
            ))}
          </div>
        </div>
      );
    case "qr":
      return (
        <div className="absolute top-4 right-4 opacity-10 dark:opacity-20">
          <div className="grid grid-cols-5 gap-0.5 w-12 h-12">
            {Array.from({ length: 25 }).map((_, i) => (
              <div
                key={i}
                className={`w-full aspect-square ${
                  [0,1,2,4,5,6,10,12,14,18,20,21,22,24].includes(i)
                    ? "bg-foreground"
                    : "bg-transparent"
                }`}
              />
            ))}
          </div>
        </div>
      );
    case "speed":
      return (
        <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-10 dark:opacity-20">
          <div className="flex flex-col gap-1">
            <div className="h-0.5 w-16 bg-foreground" />
            <div className="h-0.5 w-12 bg-foreground" />
            <div className="h-0.5 w-20 bg-foreground" />
          </div>
        </div>
      );
    case "link":
      return (
        <div className="absolute top-4 right-4 opacity-10 dark:opacity-20">
          <div className="font-mono text-[10px] leading-tight">
            <div className="text-foreground">/abc</div>
            <div className="text-foreground">/xyz</div>
          </div>
        </div>
      );
    case "clock":
      return (
        <div className="absolute top-4 right-4 opacity-10 dark:opacity-20">
          <div className="w-10 h-10 border-2 border-foreground rounded-full flex items-center justify-center">
            <div className="w-0.5 h-3 bg-foreground origin-bottom -rotate-45" />
          </div>
        </div>
      );
    case "dashboard":
      return (
        <div className="absolute top-4 right-4 opacity-10 dark:opacity-20">
          <div className="grid grid-cols-3 gap-1 w-12 h-8">
            <div className="col-span-2 bg-foreground" />
            <div className="bg-foreground" />
            <div className="bg-foreground" />
            <div className="col-span-2 bg-foreground" />
          </div>
        </div>
      );
    case "globe":
      return (
        <div className="absolute top-4 right-4 opacity-10 dark:opacity-20">
          <div className="w-10 h-10 border-2 border-foreground rounded-full relative overflow-hidden">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-foreground" />
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-foreground" />
            <div className="absolute inset-1 border border-foreground rounded-full" />
          </div>
        </div>
      );
    case "shield":
      return (
        <div className="absolute inset-0 overflow-hidden opacity-5 dark:opacity-10">
          <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-[120px] font-mono text-foreground">
            ✓
          </div>
        </div>
      );
    case "security":
      return (
        <div className="absolute inset-0 overflow-hidden opacity-10 dark:opacity-20">
          <div className="absolute bottom-4 right-4 font-mono text-xs leading-tight text-right">
            <div className="text-foreground">SSL/TLS</div>
            <div className="text-foreground">256-bit</div>
            <div className="text-foreground">HTTPS</div>
          </div>
        </div>
      );
    default:
      return null;
  }
}

export function Features() {
  return (
    <section id="features" className="w-full py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-normal font-[family-name:var(--font-instrument-serif)] mb-4">
            Everything you need
          </h2>
          <p className="text-sm text-muted-foreground font-mono max-w-lg mx-auto">
            A complete toolkit for modern link management. From analytics to automation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[160px]">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`
                  group relative bg-card border border-border p-5 
                  hover:border-foreground/40 transition-all duration-300
                  overflow-hidden
                  ${feature.className}
                `}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <FeatureVisual type={feature.visual} />
                
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-7 h-7 border border-border flex items-center justify-center group-hover:border-foreground/40 transition-colors">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                    <h3 className="font-mono text-sm font-medium tracking-tight">{feature.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Corner accents */}
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-border group-hover:border-foreground/50 transition-colors" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-border group-hover:border-foreground/50 transition-colors" />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-dashed border-border font-mono text-xs text-muted-foreground">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Free tier available • No credit card required
          </div>
        </div>
      </div>
    </section>
  );
}

