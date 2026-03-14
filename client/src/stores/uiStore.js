import { create } from "zustand";

export const useUiStore = create((set) => ({
  isMobileMenuOpen: false,
  setMobileMenu: (value) => set({ isMobileMenuOpen: value }),
}));
