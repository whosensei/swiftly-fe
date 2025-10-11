"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import { Link2, Loader, Copy, QrCode, MoreVertical, Check ,MousePointerClick} from "lucide-react";
import Link from "next/link";

export function Shorten() {
  const [value, setValue] = useState("");
  const [oldval,setOldval] = useState("")
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function HandleShorten() {
    try {
      setLoading(true);
      setOldval(value)
      const response = await axios.post("http://localhost:8080/shorten", { longurl: value });
      setUrl(response.data.data);
      console.log("Shortened URL:", response.data.data);
    } catch (e) {
      console.error("Error shortening URL:", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy:", e);
    }
  }

  return (
    <div className="w-full max-w-xl px-4 font-mono">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-3 px-4 py-2.5 shadow-lg border border-border rounded-md flex-1">
          <Link2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            placeholder="Shorten any link..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
          />
        </div>
        <Button
          onClick={HandleShorten}
          disabled={loading || !value.trim()}
          className="px-4 py-2.5 font-medium text-sm h-auto"
        >
          {!loading ? (
            "Shorten Link"
          ) : (
            <Loader className="h-5 w-5 animate-spin" />
          )}
        </Button>
      </div>
      {url && (
        <div className="mt-4 bg-background border border-dashed rounded-lg overflow-hidden">
          <div className="p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
                  <div className="w-4 h-4 rounded-full bg-background"></div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <Link href={url}className="text-base font-medium truncate">{url.replace('http://', '').replace('https://', '')}</Link>
                    <button
                      onClick={handleCopy}
                      className="p-1 hover:bg-muted rounded transition-colors flex-shrink-0"
                      aria-label="Copy URL"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                    <button
                      className="p-1 hover:bg-muted rounded transition-colors flex-shrink-0"
                      aria-label="Show QR Code"
                    >
                      <QrCode className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                    <span>↳</span>
                    <span className="truncate">{oldval.replace('http://', '').replace('https://', '')}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-muted">
                  <MousePointerClick className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs font-medium">70.5K clicks</span>
                </div>
                <button
                  className="p-1 hover:bg-muted rounded transition-colors"
                  aria-label="More options"
                >
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
