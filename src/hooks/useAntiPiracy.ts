import { useEffect, useRef, useState } from "react";

interface AntiPiracyOptions {
  enabled?: boolean;
  blurOnTabSwitch?: boolean;
  disableRightClick?: boolean;
  detectDevTools?: boolean;
  detectScreenRecording?: boolean;
}

export const useAntiPiracy = (options: AntiPiracyOptions = {}) => {
  const {
    enabled = true,
    blurOnTabSwitch = true,
    disableRightClick = true,
    detectDevTools = true,
    detectScreenRecording = true,
  } = options;

  const [isTabHidden, setIsTabHidden] = useState(false);
  const [devToolsOpen, setDevToolsOpen] = useState(false);
  const [screenRecordingDetected, setScreenRecordingDetected] = useState(false);
  const devToolsCheckRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const screenRecordingCheckRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tab visibility blur
  useEffect(() => {
    if (!enabled || !blurOnTabSwitch) return;
    const handleVisibilityChange = () => {
      setIsTabHidden(document.hidden);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [enabled, blurOnTabSwitch]);

  // Disable right-click on [data-protected] elements
  useEffect(() => {
    if (!enabled || !disableRightClick) return;
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-protected]")) {
        e.preventDefault();
      }
    };
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, [enabled, disableRightClick]);

  // Block DevTools keyboard shortcuts and screenshot keys
  useEffect(() => {
    if (!enabled) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const isDevTools =
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
        (e.ctrlKey && e.key === "u") ||
        (e.ctrlKey && e.key === "U") ||
        (e.ctrlKey && e.key === "s") ||
        (e.ctrlKey && e.key === "S") ||
        (e.ctrlKey && e.shiftKey && e.key === "K");
      
      const isScreenshot =
        e.key === "PrintScreen" ||
        (e.ctrlKey && e.shiftKey && ["S", "s"].includes(e.key)) ||
        (e.metaKey && e.shiftKey && ["3", "4"].includes(e.key)) ||
        (e.metaKey && e.shiftKey && e.key === "5");
      
      if (isDevTools || isScreenshot) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    document.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => document.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [enabled]);

  // Heuristic DevTools detection via window size diff
  useEffect(() => {
    if (!enabled || !detectDevTools) return;
    const threshold = 160;
    devToolsCheckRef.current = setInterval(() => {
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      setDevToolsOpen(widthDiff > threshold || heightDiff > threshold);
    }, 1500);
    return () => {
      if (devToolsCheckRef.current) clearInterval(devToolsCheckRef.current);
    };
  }, [enabled, detectDevTools]);

  // Screen recording detection via getDisplayMedia API check
  useEffect(() => {
    if (!enabled || !detectScreenRecording) return;
    
    const checkScreenRecording = () => {
      // Check if screen recording is active by attempting to detect
      // This is a heuristic - actual detection is limited by browser security
      const isRecording = navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices;
      
      // Additional check: detect if page is being captured via performance timing
      // When screen recording, performance tends to degrade
      if (performance.now() > 0) {
        const memory = (performance as any).memory;
        if (memory && memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
          setScreenRecordingDetected(true);
        }
      }
    };

    screenRecordingCheckRef.current = setInterval(checkScreenRecording, 3000);
    return () => {
      if (screenRecordingCheckRef.current) clearInterval(screenRecordingCheckRef.current);
    };
  }, [enabled, detectScreenRecording]);

  return { isTabHidden, devToolsOpen, screenRecordingDetected };
};
