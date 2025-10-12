"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Link from "next/link";

export function Navbar() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <nav className="border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-[family-name:var(--font-instrument-serif)]">
              Swiftly
            </span>
          </Link>

          <div className="flex items-center gap-3">
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
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm" className="font-mono">
                    Sign in
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm" className="font-mono">
                    Sign up
                  </Button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

