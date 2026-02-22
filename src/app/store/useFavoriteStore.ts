"use client"
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface FavoriteState {
  favorites: string[];
  toggleFavorite: (userId: string, postId: string) => void;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set) => ({
      favorites: [],
      toggleFavorite: (userId: string, postId: string) => {
        const key = `${userId}-${postId}`;

        set((state) => {
          const exists = state.favorites.includes(key);

          return {
            favorites: exists
              ? state.favorites.filter((f) => f !== key)
              : [...state.favorites, key],
          };
        });
      },
    }),
    {
      name: "favorites-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);