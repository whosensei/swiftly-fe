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
      <div className="flex justify-center flex-1 w-full overflow-x-hidden pt-[calc(var(--navbar-height,4rem))]">
        <div className="flex flex-col flex-1 w-full max-w-3xl border-dashed overflow-x-hidden">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-var(--navbar-height,4rem))]">
            <div className="sticky top-[calc(var(--navbar-height,4rem))] bg-background z-10 w-full flex flex-col items-center justify-center gap-8 pb-8">
              <Hero />
              <Shorten />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}