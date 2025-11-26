"use client"
import { Hero } from "@/components/hero";
import { Shorten } from "@/components/shorten";
import { Navbar } from "@/components/navbar";
import { Features } from "@/components/features";
import { useAuthSync } from "@/hooks/useAuthSync";

export default function Home() {
  useAuthSync();
  return (
    <div className="relative flex flex-col min-h-screen w-full">
      <div className="absolute top-0 left-0 right-0 z-10">
        <Navbar />
      </div>
      <div className="flex flex-col w-full overflow-x-hidden">
        {/* Hero Section */}
        <div className="flex justify-center flex-1 w-full min-h-screen">
          <div className="flex flex-col flex-1 w-full max-w-3xl border-dashed overflow-x-hidden">
            <div className="flex flex-col items-center justify-center flex-1 gap-8">
              <Hero />
              <Shorten />
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <Features />
      </div>
    </div>
  );
}