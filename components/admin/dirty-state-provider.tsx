"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface DirtyStateContextType {
  isDirty: boolean;
  setDirty: (value: boolean) => void;
}

const DirtyStateContext = createContext<DirtyStateContextType>({
  isDirty: false,
  setDirty: () => {},
});

export function useDirtyState() {
  return useContext(DirtyStateContext);
}

export function DirtyStateProvider({ children }: { children: ReactNode }) {
  const [isDirty, setDirty] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (!isDirty) return;

    const handleClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
        return;
      }

      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (!anchor || !anchor.href) return;

      if (
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        !anchor.href.startsWith(window.location.origin) ||
        anchor.href.includes("mailto:") ||
        anchor.href.includes("tel:")
      ) {
        return;
      }

      const currentUrl = new URL(window.location.href);
      const targetUrl = new URL(anchor.href);

      if (currentUrl.pathname === targetUrl.pathname && currentUrl.search === targetUrl.search) {
        return;
      }

      e.preventDefault();
      if (window.confirm("You have unsaved changes. Leave this page?")) {
        setDirty(false);
        router.push(targetUrl.pathname + targetUrl.search + targetUrl.hash);
      }
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, [isDirty, router]);

  return (
    <DirtyStateContext.Provider value={{ isDirty, setDirty }}>
      {children}
    </DirtyStateContext.Provider>
  );
}
