"use client";

import { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Copy, HelpCircle, Check } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from './ui/dialog';
import { Button } from './ui/button';

interface QRCodeDialogProps {
  url: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QRCodeDialog({ url, open, onOpenChange }: QRCodeDialogProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 512;
    canvas.height = 512;

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, 512, 512);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'qrcode.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        });
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DialogTitle>QR Code Preview</DialogTitle>
              <HelpCircle className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDownload}
                className="h-8 w-8"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="h-8 w-8"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="flex justify-center items-center p-6">
          <div 
            className="relative bg-white p-8 rounded-lg"
            style={{
              backgroundImage: `radial-gradient(circle, #d1d5db 1px, transparent 1px)`,
              backgroundSize: '12px 12px'
            }}
          >
            <div ref={qrRef} className="bg-white p-4 rounded">
              <QRCodeSVG 
                value={url} 
                size={256}
                level="H"
                includeMargin={false}
              />
            </div>
          </div>
        </div>
        <div className="text-xs text-center text-muted-foreground break-all px-4 pb-2">
          {url}
        </div>
      </DialogContent>
    </Dialog>
  );
}