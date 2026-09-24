"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function TrafficTracker() {
  const pathname = usePathname();
  const trackedRef = useRef<string | null>(null);

  useEffect(() => {
    // Avoid tracking /count dashboard visits
    if (pathname.startsWith("/count") || pathname.startsWith("/api")) {
      return;
    }

    // Only track once per page route visit in single page navigation
    if (trackedRef.current === pathname) {
      return;
    }
    trackedRef.current = pathname;

    try {
      const payload = JSON.stringify({
        path: pathname,
        referer: typeof document !== "undefined" ? document.referrer : "",
      });

      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/traffic", blob);
      } else {
        fetch("/api/traffic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Ignore background tracking errors
    }
  }, [pathname]);

  return null;
}
