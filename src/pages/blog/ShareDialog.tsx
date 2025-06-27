import { useState } from "react";
import { Copy, Check, Instagram, Share2 } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/WhatsappIcons";

interface ShareDialogProps {
  slug: string;
  children: React.ReactNode;
}

export function ShareDialog({ slug, children }: ShareDialogProps) {
  const [isCopied, setIsCopied] = useState(false);
  const shareUrl = `${window.location.origin}/blog/${slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check this out!",
          text: "Here's a blog post you might like.",
          url: shareUrl,
        });
      } catch (err) {
        console.error("Sharing failed", err);
      }
    } else {
      alert("Web Share API is not supported in this browser.");
    }
  };

  return (
    <Dialog onOpenChange={() => setIsCopied(false)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[90vw] rounded-lg sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Link</DialogTitle>
          <DialogDescription>
            Anyone with this link can view the post.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <Input id="link" defaultValue={shareUrl} readOnly />
        </div>

        <div className="flex flex-wrap gap-3 mt-4 items-center">
          {/* === WhatsApp dengan Gradien Hover === */}
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full group hover:bg-gradient-to-br from-green-400 to-emerald-500"
            asChild
          >
            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on WhatsApp"
            >
              <WhatsAppIcon className="w-5 h-5 text-slate-700 group-hover:text-white transition-colors duration-300 ease-in-out" />
            </a>
          </Button>

          {/* === Instagram dengan Gradien Hover === */}
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full group hover:bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400"
            asChild
          >
            <a
              href="instagram://direct"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Instagram"
            >
              <Instagram className="w-5 h-5 text-slate-700 group-hover:text-white transition-colors duration-300 ease-in-out" />
            </a>
          </Button>

          {/* Web Share API */}
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full group hover:bg-gradient-to-br from-emerald-500 to-cyan-600"
            onClick={handleWebShare}
            aria-label="Share via Web Share API"
          >
            <Share2 className="w-5 h-5 text-slate-700 group-hover:text-white transition-colors duration-300 ease-in-out" />
          </Button>

          {/* Copy Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopy}
            className="ml-auto"
          >
            {isCopied ? (
              <Check className="w-4 h-4 mr-2" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            {isCopied ? "Copied!" : "Copy"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}