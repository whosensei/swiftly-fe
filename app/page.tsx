"use client"
import { Hero } from "@/components/hero";
import { Shorten } from "@/components/shorten";
import { Navbar } from "@/components/navbar";
import { useAuthSync } from "@/hooks/useAuthSync";

export default function Home() {
  useAuthSync();
  return (
    <div className="relative flex flex-col min-h-screen w-full">
      <div className="absolute top-0 left-0 right-0 z-10">
        <Navbar />
      </div>
      <div className="flex justify-center flex-1 w-full overflow-x-hidden">
        <div className="flex flex-col flex-1 w-full max-w-3xl border-dashed overflow-x-hidden">
          <div className="flex flex-col items-center justify-center flex-1 gap-8">
            <Hero />
            <Shorten />
          </div>
        </div>
      </div>
    </div>
  );
}