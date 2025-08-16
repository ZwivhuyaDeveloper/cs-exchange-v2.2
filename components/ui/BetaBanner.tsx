"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

export function BetaBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage?.getItem("betaBannerDismissed") === "true";
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("betaBannerDismissed", "true");
    }
  };

  if (!isVisible) return null;

  return (
    <div className="w-full bg-yellow-50 dark:bg-yellow-900/30 border-b border-yellow-200 dark:border-yellow-800">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-yellow-500 mr-2">⚠️</span>
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              This application is still in beta. Things might not work as intended.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-yellow-500 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300"
            aria-label="Dismiss beta banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
