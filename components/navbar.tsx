"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <div className="flex justify-center w-full py-4 px-4">
      <nav className="w-full max-w-3xl border border-border rounded-md shadow-lg bg-background">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              {/* <Image 
                src="/link-06-stroke-rounded.svg" 
                alt="Link icon" 
                width={20} 
                height={20}
                className="w-4 h-4"
              /> */}
              <span className="text-xl font-[family-name:var(--font-instrument-serif)]">
                Swiftly
              </span>
            </Link>
            
            <div className="flex justify-end items-center h-16">
            <div className="flex items-center gap-6">
              <Link href="#features" className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              {!isLoaded ? (
                <div className="w-20 h-9 bg-muted animate-pulse rounded-md"></div>
              ) : isSignedIn ? (
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9 rounded-md",
                      userButtonPopoverCard: "shadow-lg border border-border",
                      userButtonPopoverActionButton: "hover:bg-accent",
                    },
                  }}
                />
              ) : (
                <>
                  {/* <SignInButton mode="modal">
                    <Button variant="ghost" size="sm" className="font-mono">
                      Sign in
                    </Button>
                  </SignInButton> */}
                  <SignInButton mode="modal">
                    <Button size="sm" className="font-mono">
                      Sign In
                    </Button>
                  </SignInButton>
                </>
              )}
            </div>
          </div>
        </div>
        </div>
      </nav>
    </div>
  );
}

