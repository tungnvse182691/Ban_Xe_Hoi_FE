import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CompareState {
  ids: string[];
  add: (id: string) => { ok: boolean; message: string };
  remove: (id: string) => void;
  clear: () => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      add: (id) => {
        const { ids } = get();
        if (ids.includes(id)) return { ok: false, message: 'Xe đã có trong so sánh' };
        if (ids.length >= 3) return { ok: false, message: 'Chỉ so sánh tối đa 3 xe' };
        set({ ids: [...ids, id] });
        return { ok: true, message: 'Đã thêm vào so sánh' };
      },
      remove: (id) => set({ ids: get().ids.filter((x) => x !== id) }),
      clear: () => set({ ids: [] }),
    }),
    { name: 'tommycar-compare' },
  ),
);
