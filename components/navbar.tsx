"use client";

import { Button } from "./ui/button";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          setDropdownOpen(false);
        },
      },
    });
  };

  const getInitials = (name: string | undefined, email: string | undefined) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <div className="flex justify-center w-full py-4 px-4">
      <nav className="w-full max-w-3xl border border-border rounded-md shadow-lg bg-background">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl text-primary font-[family-name:var(--font-instrument-serif)]">
                Swiftly
              </span>
            </Link>
            
            <div className="flex justify-end items-center h-16">
              <div className="flex items-center gap-4">
                <Link href="#features" className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </Link>
                <ThemeToggle />
                {isPending ? (
                  <div className="w-20 h-9 bg-muted animate-pulse rounded-md"></div>
                ) : session?.user ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="w-9 h-9 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      {getInitials(session.user.name, session.user.email)}
                    </button>
                    
                    {dropdownOpen && (
                      <div className="absolute left-0 mt-2 w-64 bg-background border border-border rounded-md shadow-lg py-1 z-50">
                        <div className="px-4 py-3 border-b border-border">
                          <p className="text-sm font-medium">{session.user.name || "User"}</p>
                          <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                        </div>
                        
                        <Link
                          href="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="block w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors"
                        >
                          Dashboard
                        </Link>
                        
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors"
                        >
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/sign-in">
                    <Button size="sm" className="font-mono">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
