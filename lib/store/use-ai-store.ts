import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isApplyingDesign?: boolean;
}

interface AIState {
  apiKey: string;
  messages: ChatMessage[];
  setApiKey: (key: string) => void;
  addMessage: (message: Omit<ChatMessage, 'id'>) => void;
  clearMessages: () => void;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
}

export const useAIStore = create<AIState>()(
  persist(
    (set) => ({
      apiKey: '',
      messages: [],
      setApiKey: (key) => set({ apiKey: key }),
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, { ...message, id: Date.now().toString() }]
      })),
      clearMessages: () => set({ messages: [] }),
      updateMessage: (id, updates) => set((state) => ({
        messages: state.messages.map((m) => m.id === id ? { ...m, ...updates } : m)
      })),
    }),
    {
      name: 'smartqr-ai-storage',
    }
  )
);
