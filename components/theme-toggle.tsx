"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="w-9 h-9 rounded-md border border-border bg-background flex items-center justify-center hover:bg-accent transition-colors"
        aria-label="Toggle theme"
      >
        <div className="w-4 h-4" />
      </button>
    );
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-9 h-9 rounded-md bg-background flex items-center justify-center hover:bg-accent transition-colors"
      aria-label={`Current theme: ${theme}. Click to toggle.`}
      title={`Current theme: ${theme}`}
    >
      {theme === "dark" ? (
        <Moon className="w-4 h-4 text-foreground" />
          ) : (
        <Sun className="w-4 h-4 text-foreground" />
      )}
    </button>
  );
}

