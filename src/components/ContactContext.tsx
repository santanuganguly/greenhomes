"use client";

import React, { createContext, useContext, useState } from "react";
import dynamic from "next/dynamic";

const ContactDialog = dynamic(
  () => import("./ContactDialog").then((m) => m.ContactDialog),
  { ssr: false }
);

export interface ContactPreset {
  service?: "home" | "renovation" | "commercial";
  notes?: string;
}

interface ContactContextValue {
  openContact: (preset?: ContactPreset) => void;
}

const ContactContext = createContext<ContactContextValue>({
  openContact: () => {},
});

export function ContactProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [preset, setPreset] = useState<ContactPreset | undefined>(undefined);

  function openContact(nextPreset?: ContactPreset) {
    setPreset(nextPreset);
    setHasOpened(true);
    setOpen(true);
  }

  return (
    <ContactContext.Provider value={{ openContact }}>
      {children}
      {hasOpened && (
        <ContactDialog open={open} preset={preset} onClose={() => setOpen(false)} />
      )}
    </ContactContext.Provider>
  );
}

export function useContact() {
  return useContext(ContactContext);
}
