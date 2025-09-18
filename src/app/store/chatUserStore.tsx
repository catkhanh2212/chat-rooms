import { create } from "zustand";

interface ChatUserStore {
  chatUserId: number | null;
  setChatUserId: (id: number | null) => void;

  refreshMessages: number;
  triggerRefresh: () => void;
}

export const useChatUserStore = create<ChatUserStore>((set) => ({
  chatUserId: null,
  setChatUserId: (id) => set({ chatUserId: id }),

  refreshMessages: 0,
  triggerRefresh: () =>
    set((state) => ({ refreshMessages: state.refreshMessages + 1 })),
}));
