"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const EXCLUDED_ORIGIN_ROUTES = new Set(["/login", "/signup"]);

function isExcludedOrigin(pathname: string): boolean {
  return EXCLUDED_ORIGIN_ROUTES.has(pathname);
}

function TopProgressBarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [opacity, setOpacity] = useState(1);

  const trickleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const safetyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isNavigatingRef = useRef(false);

  const clearAllTimers = () => {
    if (trickleTimerRef.current) {
      clearInterval(trickleTimerRef.current);
      trickleTimerRef.current = null;
    }
    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  };

  const startProgress = () => {
    // If the current page is an excluded route (/login or /signup), do not show top progress
    if (isExcludedOrigin(pathname)) {
      return;
    }

    clearAllTimers();
    isNavigatingRef.current = true;
    setOpacity(1);
    setVisible(true);
    setProgress(25);

    // Realistic trickle effect: progresses slower as it nears 85%
    trickleTimerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) return prev;
        const remaining = 85 - prev;
        const step = Math.max(1, Math.floor(remaining * 0.15));
        return Math.min(85, prev + step);
      });
    }, 250);

    // Safety timeout: auto-complete if navigation takes too long or cancels
    safetyTimerRef.current = setTimeout(() => {
      completeProgress();
    }, 8000);
  };

  const completeProgress = () => {
    if (!isNavigatingRef.current) return;
    isNavigatingRef.current = false;

    if (trickleTimerRef.current) {
      clearInterval(trickleTimerRef.current);
      trickleTimerRef.current = null;
    }
    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }

    // Complete to 100%
    setProgress(100);

    // Fade out and reset
    resetTimerRef.current = setTimeout(() => {
      setOpacity(0);
      resetTimerRef.current = setTimeout(() => {
        setVisible(false);
        setProgress(0);
        setOpacity(1);
      }, 250);
    }, 200);
  };

  // Complete progress on pathname or searchParams change
  useEffect(() => {
    completeProgress();
  }, [pathname, searchParams]);

  // Global click interception for client navigation
  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      // Ignore right clicks or modified clicks
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      ) {
        return;
      }

      // If currently on an excluded page (/login or /signup), do not start progress
      if (isExcludedOrigin(window.location.pathname)) {
        return;
      }

      // Find nearest <a> element
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;

      const rawHref = anchor.getAttribute("href");
      if (
        !rawHref ||
        rawHref.startsWith("#") ||
        rawHref.startsWith("javascript:") ||
        rawHref.startsWith("mailto:") ||
        rawHref.startsWith("tel:")
      ) {
        return;
      }

      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      try {
        const targetUrl = new URL(anchor.href, window.location.href);

        // Ignore external domains
        if (targetUrl.origin !== window.location.origin) return;

        // Ignore same page anchor navigation
        const currentPathWithSearch = `${window.location.pathname}${window.location.search}`;
        const targetPathWithSearch = `${targetUrl.pathname}${targetUrl.search}`;
        if (currentPathWithSearch === targetPathWithSearch) return;

        // Start progress bar
        startProgress();
      } catch {
        // Ignore invalid URLs
      }
    };

    // Listen to custom navigation events if triggered programmatically
    const handleCustomStart = () => startProgress();
    const handleCustomComplete = () => completeProgress();

    document.addEventListener("click", handleDocumentClick, { capture: true });
    window.addEventListener("fm:route-start", handleCustomStart);
    window.addEventListener("fm:route-complete", handleCustomComplete);

    return () => {
      clearAllTimers();
      document.removeEventListener("click", handleDocumentClick, { capture: true });
      window.removeEventListener("fm:route-start", handleCustomStart);
      window.removeEventListener("fm:route-complete", handleCustomComplete);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none h-[3px] overflow-hidden"
    >
      <div
        className="h-full transition-all duration-200 ease-out relative"
        style={{
          width: `${progress}%`,
          opacity,
          background: "linear-gradient(to right, #5B0E2D, #7A1740, #A63836)",
          boxShadow: "0 0 10px #A63836, 0 0 4px #5B0E2D",
        }}
      >
        {/* Glow point at leading edge */}
        <div
          className="absolute top-0 right-0 bottom-0 w-24 h-full"
          style={{
            boxShadow: "0 0 14px #A63836, 0 0 8px #A63836",
            opacity: 0.8,
            transform: "rotate(3deg) translate(0px, -4px)",
          }}
        />
      </div>
    </div>
  );
}

export function TopProgressBar() {
  return (
    <Suspense fallback={null}>
      <TopProgressBarContent />
    </Suspense>
  );
}
