"use client"
import { Hero } from "@/components/hero";
import { Shorten } from "@/components/shorten";
import { Navbar } from "@/components/navbar";
import { useAuthSync } from "@/hooks/useAuthSync";

export default function Home() {
  useAuthSync();
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
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
