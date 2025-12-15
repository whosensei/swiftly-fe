"use client";

import { useState, useEffect, useRef } from "react";
import { Link2, Plus, X, Loader2, Tag } from "lucide-react";
import axios from "axios";
import { authClient } from "@/lib/auth-client";

interface CreateLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const TAG_COLORS = [
  { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400" },
  { bg: "bg-green-500/10", text: "text-green-600 dark:text-green-400" },
  { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400" },
  { bg: "bg-orange-500/10", text: "text-orange-600 dark:text-orange-400" },
  { bg: "bg-pink-500/10", text: "text-pink-600 dark:text-pink-400" },
];

export function CreateLinkDialog({ open, onOpenChange, onSuccess }: CreateLinkDialogProps) {
  const [url, setUrl] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [showTagInput, setShowTagInput] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  // Focus input when dialog opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Focus tag input when shown
  useEffect(() => {
    if (showTagInput && tagInputRef.current) {
      tagInputRef.current.focus();
    }
  }, [showTagInput]);

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 5) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
    setShowTagInput(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === "Escape") {
      setShowTagInput(false);
      setTagInput("");
    }
  };

  const handleSubmit = async () => {
    setError("");

    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    // Basic URL validation
    let urlToShorten = url.trim();
    if (!urlToShorten.startsWith("http://") && !urlToShorten.startsWith("https://")) {
      urlToShorten = "https://" + urlToShorten;
    }

    try {
      new URL(urlToShorten);
    } catch {
      setError("Invalid URL");
      return;
    }

    setLoading(true);

    try {
      const session = await authClient.getSession();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (session?.data?.session?.token) {
        headers["Authorization"] = `Bearer ${session.data.session.token}`;
      }

      await axios.post(
        `${backendBaseUrl}/shorten`,
        { 
          url: urlToShorten,
          tags: tags.length > 0 ? tags : undefined 
        },
        { headers }
      );

      // Reset and close
      handleClose();
      onSuccess?.();
    } catch (err) {
      console.error("Error shortening URL:", err);
      setError("Failed to create link");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      handleClose();
    }
  };

  const handleClose = () => {
    setUrl("");
    setTags([]);
    setTagInput("");
    setError("");
    setShowTagInput(false);
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-200"
        onClick={handleClose}
      />
      
      {/* Dialog */}
      <div className="absolute left-1/2 top-[20%] -translate-x-1/2 w-full max-w-xl px-4 animate-in fade-in-0 slide-in-from-top-4 duration-200">
        <div className="bg-background dark:bg-[#141414] rounded-xl border border-border/50 dark:border-white/[0.08] shadow-2xl overflow-hidden">
          {/* Main Input */}
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-foreground/[0.08] dark:bg-white/[0.08] flex items-center justify-center flex-shrink-0">
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              ) : (
                <Link2 className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <input
              ref={inputRef}
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
              placeholder="Paste a long URL to shorten..."
              className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/50"
              disabled={loading}
            />
            {url && !loading && (
              <button
                onClick={handleSubmit}
                className="px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded-md hover:opacity-90 transition-opacity"
              >
                Shorten
              </button>
            )}
          </div>

          {/* Tags Section */}
          <div className="border-t border-border/50 dark:border-white/[0.06] px-4 py-2.5 flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            
            {/* Existing Tags */}
            {tags.map((tag, index) => {
              const colorIndex = index % TAG_COLORS.length;
              const color = TAG_COLORS[colorIndex];
              return (
                <span 
                  key={tag}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded ${color.bg} ${color.text}`}
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:opacity-70 transition-opacity"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              );
            })}
            
            {/* Tag Input or Add Button */}
            {showTagInput ? (
              <input
                ref={tagInputRef}
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={handleAddTag}
                placeholder="Tag name..."
                className="w-20 bg-transparent border-none outline-none text-[11px] placeholder:text-muted-foreground/50"
              />
            ) : tags.length < 5 ? (
              <button
                onClick={() => setShowTagInput(true)}
                className="text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add tag
              </button>
            ) : null}
          </div>

          {/* Error */}
          {error && (
            <div className="border-t border-border/50 dark:border-white/[0.06] px-4 py-2 text-xs text-destructive">
              {error}
            </div>
          )}

          {/* Footer hint */}
          <div className="border-t border-border/50 dark:border-white/[0.06] px-4 py-2 flex items-center justify-between text-[11px] text-muted-foreground/60">
            <span>Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Enter</kbd> to create</span>
            <span>Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Esc</kbd> to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
