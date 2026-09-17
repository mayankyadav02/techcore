"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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
  const [navTarget, setNavTarget] = useState<string | null>(null);
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);

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
      setNavTarget(targetUrl.pathname + targetUrl.search + targetUrl.hash);
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, [isDirty]);

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return;
    if (navTarget && !node.open) {
      node.showModal();
    } else if (!navTarget && node.open) {
      node.close();
    }
  }, [navTarget]);

  return (
    <DirtyStateContext.Provider value={{ isDirty, setDirty }}>
      {children}
      <dialog
        ref={dialogRef}
        aria-labelledby="dirty-dialog-title"
        aria-describedby="dirty-dialog-desc"
        className="max-h-[min(32rem,calc(100dvh-2rem))] w-[min(28rem,calc(100%-2rem))] overflow-y-auto overscroll-contain rounded-[var(--radius-lg)] border border-line bg-elevated p-0 text-ink shadow-[var(--shadow-md)] backdrop:bg-navy-950/50"
        onClose={() => setNavTarget(null)}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <h2 id="dirty-dialog-title" className="text-base font-semibold">
            Unsaved changes
          </h2>
        </div>
        <div className="space-y-3 px-5 py-4 text-sm text-ink-muted">
          <p id="dirty-dialog-desc">
            You have unsaved changes. Leaving this page will discard them.
            Do you want to leave or stay and save?
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-2 border-t border-line px-5 py-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setNavTarget(null)}
          >
            Stay
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              setDirty(false);
              if (navTarget) {
                router.push(navTarget);
              }
              setNavTarget(null);
            }}
          >
            Leave
          </Button>
        </div>
      </dialog>
    </DirtyStateContext.Provider>
  );
}
