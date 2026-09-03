import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoriteState {
  ids: string[];
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set({
          ids: get().ids.includes(id)
            ? get().ids.filter((x) => x !== id)
            : [...get().ids, id],
        }),
      remove: (id) => set({ ids: get().ids.filter((x) => x !== id) }),
      clear: () => set({ ids: [] }),
      isFavorite: (id) => get().ids.includes(id),
    }),
    { name: 'tommycar-favorites' },
  ),
);
