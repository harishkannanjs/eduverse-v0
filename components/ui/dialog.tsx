// components/ui/dialog.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  isValidElement,
  ReactElement,
} from "react";
import { createPortal } from "react-dom";

type DialogContextType = { open: boolean; setOpen: (v: boolean) => void };
const DialogContext = createContext<DialogContextType | undefined>(undefined);

/**
 * Usage:
 * <Dialog>
 *   <DialogTrigger><button>Open</button></DialogTrigger>
 *   <DialogContent>
 *     <DialogTitle>Title</DialogTitle>
 *     <DialogDescription>desc</DialogDescription>
 *     ... content ...
 *     <DialogClose><button>Close</button></DialogClose>
 *   </DialogContent>
 * </Dialog>
 */

export function Dialog({
  children,
  defaultOpen = false,
}: {
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({ children }: { children: ReactElement }) {
  const ctx = useContext(DialogContext);
  // If no dialog context, just render children
  if (!ctx) return children;
  const child = isValidElement(children) ? children : (children as any);
  return React.cloneElement(child as ReactElement, {
    onClick: (e: any) => {
      const orig = (child as any)?.props?.onClick;
      if (orig) orig(e);
      ctx.setOpen(true);
    },
  });
}

export function DialogClose({ children }: { children?: ReactNode }) {
  const ctx = useContext(DialogContext);
  if (!ctx) return (children as ReactNode) || null;
  const child = children && isValidElement(children) ? (children as ReactElement) : (
    <button aria-label="Close">Close</button>
  );
  return React.cloneElement(child as ReactElement, {
    onClick: (e: any) => {
      const orig = (child as any)?.props?.onClick;
      if (orig) orig(e);
      ctx.setOpen(false);
    },
  });
}

export function DialogContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ctx = useContext(DialogContext);
  if (!ctx || !ctx.open) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      style={{ position: "fixed", inset: 0, zIndex: 9999 }}
    >
      {/* overlay */}
      <div
        onClick={() => ctx.setOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.45)",
        }}
      />
      {/* content */}
      <div
        className={className || ""}
        style={{
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          background: "#fff",
          borderRadius: 8,
          padding: 20,
          maxWidth: "90%",
          maxHeight: "90%",
          overflow: "auto",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

export function DialogTitle({ children }: { children: ReactNode }) {
  return <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{children}</h2>;
}

export function DialogDescription({ children }: { children: ReactNode }) {
  return <p style={{ marginTop: 8, color: "#666" }}>{children}</p>;
}
