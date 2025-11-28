// src/lib/hooks/useModal.ts
'use client';

import { useState } from 'react';

type Modal = {
  open: boolean;
  // other modal state if needed
};

export function useModal() {
  const [open, setOpen] = useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return { open, openModal, closeModal };
}
