"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import { Link2, Loader, Copy, QrCode, MoreVertical, Check } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";


interface urls {
  short : string,
  long : string,
  // clicks : number,
}

export function Shorten() {
  const [value, setValue] = useState("");
  const [anonurls,setAnonurls] = useState<urls[]>([])
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [remainingUrls, setRemainingUrls] = useState<number>(5);
  const [copied,setCopied] = useState<number|null>()
  const { getToken, isSignedIn } = useAuth();


  // // Mockup data for demonstration
  // const mockUrls = [
  //   { short: "https://swftly.dev/d4e5f6", long: "https://github.com/username/repository/pull/123/files", clicks: "10" },
  //   { short: "https://swftly.dev/g7h8i9", long: "https://docs.google.com/document/d/1234567890/edit", clicks: "0" },
  //   { short: "https://swftly.dev/j0k1l2", long: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", clicks: "12" },
  //   { short: "https://swftly.dev/m3n4o5", long: "https://stackoverflow.com/questions/12345/how-to-do-something", clicks: "6" },
  // ];


  useEffect(()=>{
    const storedurls = localStorage.getItem("anonurls");
    if(storedurls){
      const data = JSON.parse(storedurls)
      if(data.length >=5){
        setRemainingUrls(0);
      }
      setAnonurls(data)
    }
  },[])

  useEffect(()=>{
    localStorage.setItem("anonurls",JSON.stringify(anonurls))
  },[anonurls])

  async function HandleShorten() {
    try {
      setLoading(true);
      
      // Get auth token if user is signed in
      const token = isSignedIn ? await getToken() : null;
      
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      const destnurl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/shorten`
      console.log(destnurl)
      const response = await axios.post(
        destnurl,
        { longurl: value },
        // { headers, withCredentials: true }
      );
      
      setUrl(response.data.data);
      setRemainingUrls(remainingUrls=>remainingUrls-1)
      setAnonurls(prev => [...prev, { short: response.data.data, long: value}])           
      // Update remaining URLs count if returned by backend
      
      console.log("Shortened URL:", response.data.data);
    } catch (e: unknown) {
      console.error("Error shortening URL:", e);
      if (e && typeof e === 'object' && 'response' in e) {
        const axiosError = e as { response?: { status?: number; data?: { message?: string } } };
        if (axiosError.response?.status === 403) {
          alert(axiosError.response.data?.message || "Anonymous users are limited to 5 URLs per 30 minutes. Sign in for unlimited access.");
        }
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy(index : number) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(index);
      setTimeout(() => setCopied(null), 2000);
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
          disabled={loading || !value.trim() || !remainingUrls}
          className="px-4 py-2.5 font-medium text-sm h-auto"
        >
          {!loading ? (
            "Shorten Link"
          ) : (
            <Loader className="h-5 w-5 animate-spin" />
          )}
        </Button>
      </div>
      
      <div className="mt-4 space-y-3">
        {anonurls.map((item, index) => (
          <div key={index} className="bg-background border border-dashed rounded-lg overflow-hidden">
            <div className="p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
                    <div className="w-4 h-4 rounded-full bg-background"></div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <Link href={item.short} target="_blank" rel="noopener noreferrer" className="text-base font-medium truncate">{item.short.replace('https://', '')}</Link>
                      <button
                        onClick={()=>handleCopy(index)}
                        className="p-1 hover:bg-muted rounded transition-colors flex-shrink-0"
                        aria-label="Copy URL"
                      >
                        {copied==index ? (
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
                      <span className="truncate">{item.long.replace('http://', '').replace('https://', '')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* <div className="flex items-center gap-1.5 px-2.5 py-1 bg-muted">
                    <MousePointerClick className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs font-medium">{item.clicks} clicks</span>
                  </div> */}
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
        ))}
      </div>
      {remainingUrls < 3 && (
      <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-4 z-20 pointer-events-none">
        <div className="inline-block px-4 py-2 bg-muted/50 border border-border rounded-md text-sm text-center font-mono pointer-events-auto">
          <span className="text-muted-foreground">
            {remainingUrls} of 5 URLs left,{" "}
          </span>
          <Link href="/sign-in" className="text-foreground hover:underline">
          Sign in for more
          </Link>
        </div>
      </div>
      )}
    </div>
  );
}
