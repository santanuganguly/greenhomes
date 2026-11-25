"use client";

import React, { createContext, useContext, useState } from "react";
import { ContactDialog } from "./ContactDialog";

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
  const [preset, setPreset] = useState<ContactPreset | undefined>(undefined);

  function openContact(nextPreset?: ContactPreset) {
    setPreset(nextPreset);
    setOpen(true);
  }

  return (
    <ContactContext.Provider value={{ openContact }}>
      {children}
      <ContactDialog open={open} preset={preset} onClose={() => setOpen(false)} />
    </ContactContext.Provider>
  );
}

export function useContact() {
  return useContext(ContactContext);
}
