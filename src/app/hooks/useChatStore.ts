
import { CoreMessage } from "ai";
import { create } from "zustand";

interface State {
  base64Images: string[] | null;
  messages: CoreMessage[];
  isLoadingSubmit: boolean;
}

interface Actions {
  setBase64Images: (base64Images: string[] | null) => void;
  setMessages: (
    fn: (
      messages: CoreMessage[]
    ) => CoreMessage[]
  ) => void;
  setIsLoadingSubmit: (loading: boolean) => void;
}

const useChatStore = create<State & Actions>()(
  (set) => ({
    base64Images: null,
    setBase64Images: (base64Images) => set({ base64Images }),

    messages: [],
    setMessages: (fn) => set((state) => ({ messages: fn(state.messages) })),


    isLoadingSubmit: false,  // Initialize isLoadingSubmit
    setIsLoadingSubmit: (loading) => set({ isLoadingSubmit: loading }),  // Define setIsLoadingSubmit
  })
)

export default useChatStore;