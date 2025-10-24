"use client";

import { QRCodeSVG } from 'qrcode.react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from './ui/dialog';

interface QRCodeDialogProps {
  url: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QRCodeDialog({ url, open, onOpenChange }: QRCodeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">QR Code</DialogTitle>
          <DialogDescription className="text-center">
            Scan this code to access your shortened link
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center items-center p-6">
          <div className="bg-white p-4 rounded-lg shadow-inner">
            <QRCodeSVG 
              value={url} 
              size={256}
              level="H"
              includeMargin={true}
            />
          </div>
        </div>
        <div className="text-xs text-center text-muted-foreground break-all px-4">
          {url}
        </div>
      </DialogContent>
    </Dialog>
  );
}