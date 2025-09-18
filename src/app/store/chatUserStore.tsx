import { create } from "zustand";

interface ChatUserStore {
  chatUserId: number | null; 
  setChatUserId: (id: number | null) => void;
}

export const useChatUserStore = create<ChatUserStore>((set) => ({
  chatUserId: null,
  setChatUserId: (id) => set({ chatUserId: id }),
}));
