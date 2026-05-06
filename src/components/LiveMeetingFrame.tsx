import { useEffect, useRef, useState } from "react";
import { Loader2, AlertTriangle, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LiveMeetingFrameProps {
  url: string;
  title: string;
}

export function LiveMeetingFrame({ url, title }: LiveMeetingFrameProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(false);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    // If iframe doesn't load in 12s, assume embedding is blocked
    timeoutRef.current = window.setTimeout(() => {
      setLoading(false);
      setError(true);
    }, 12000);
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [url, attempt]);

  const handleLoad = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setLoading(false);
  };

  const handleError = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setLoading(false);
    setError(true);
  };

  return (
    <div className="relative w-full h-full bg-black">
      {!error && (
        <iframe
          key={attempt}
          src={url}
          className="w-full h-full border-0"
          allow="camera; microphone; fullscreen; display-capture; autoplay"
          title={title}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {loading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-sm">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Connecting to live class…</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <p className="text-sm font-semibold">Couldn't load the meeting</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              The provider may block embedding (e.g. Google Meet, Zoom). Try reloading or open it externally.
            </p>
          </div>
          <div className="flex gap-2 mt-2">
            <Button size="sm" variant="secondary" onClick={() => setAttempt((a) => a + 1)}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
            </Button>
            <Button size="sm" onClick={() => window.open(url, "_blank", "noopener,noreferrer")}>
              <ExternalLink className="w-3.5 h-3.5 mr-1" /> Open externally
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
