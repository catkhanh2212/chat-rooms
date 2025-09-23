import { create } from "zustand";

interface ChatRoomStore {
  activeRoomId: number | null;
  setActiveRoomId: (id: number | null) => void;

  refreshMessages: number;
  triggerRefresh: () => void;
}

export const useChatUserStore = create<ChatRoomStore>((set) => ({
  activeRoomId: null,
  setActiveRoomId: (id) => {
    console.log("🟢 setActiveRoomId called with:", id)
    set({ activeRoomId: id })
  },

  refreshMessages: 0,
  triggerRefresh: () =>
    set((state) => ({ refreshMessages: state.refreshMessages + 1 })),
}));
