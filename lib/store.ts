import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserState = {
  user: any | null;
  setUser: (user: any) => void;
  resetUser: () => void;
};

export const useUser = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user: user }),
      resetUser: () => set({ user: null }),
    }),
    {
      name: "user",
    }
  )
);
