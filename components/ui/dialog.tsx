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
  open: controlledOpen,
  onOpenChange,
}: {
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = (newOpen: boolean) => {
    if (isControlled) {
      onOpenChange?.(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };
  
  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({ 
  children, 
  asChild = false 
}: { 
  children: ReactElement;
  asChild?: boolean;
}) {
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

export function DialogHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className} style={{ marginBottom: 16 }}>{children}</div>;
}

export function DialogFooter({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className} style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>{children}</div>;
}
