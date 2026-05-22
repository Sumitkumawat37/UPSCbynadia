import { useEffect, useState } from 'react';

export const useScreenProtection = () => {
  const [isProtected, setIsProtected] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsProtected(true);
      } else {
        // Add a small delay before showing content again
        setTimeout(() => setIsProtected(false), 100);
      }
    };

    const handleBlur = () => {
      setIsProtected(true);
    };

    const handleFocus = () => {
      // Add a small delay before showing content again
      setTimeout(() => setIsProtected(false), 100);
    };

    // Page Visibility API
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Window focus/blur events
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    // Detect potential screen recording/screenshot attempts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect common screenshot shortcuts
      if (
        (e.metaKey || e.ctrlKey) &&
        (e.key === 'PrintScreen' || e.key === 'F12' || e.key === 'p' || e.key === 'P')
      ) {
        e.preventDefault();
        setIsProtected(true);
        setTimeout(() => setIsProtected(false), 2000);
      }
    };

    // Detect print screen key
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        setIsProtected(true);
        setTimeout(() => setIsProtected(false), 2000);
      }
    };

    // Detect context menu (right-click)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Detect drag attempts (could be for saving images)
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    // Detect copy attempts
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
    };

    // Detect select all attempts
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('selectstart', handleSelectStart);

    // Mobile-specific protections
    const handleMobileVisibility = () => {
      if (document.visibilityState === 'hidden' || document.hidden) {
        setIsProtected(true);
      } else {
        setTimeout(() => setIsProtected(false), 100);
      }
    };

    // Detect app switching on mobile
    const handlePageHide = () => {
      setIsProtected(true);
    };

    const handlePageShow = () => {
      setTimeout(() => setIsProtected(false), 100);
    };

    document.addEventListener('visibilitychange', handleMobileVisibility);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('pageshow', handlePageShow);

    // Detect orientation change (often indicates app switch on mobile)
    const handleOrientationChange = () => {
      setIsProtected(true);
      setTimeout(() => setIsProtected(false), 500);
    };

    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('visibilitychange', handleMobileVisibility);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return isProtected;
};
