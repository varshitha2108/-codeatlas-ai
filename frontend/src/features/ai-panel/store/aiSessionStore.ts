import { create } from 'zustand'

interface AICard {
  id: string
  actionType: string
  filePath: string
  content: string
  status: 'streaming' | 'done' | 'error'
}

interface AISessionState {
  cards: AICard[]
  addCard: (card: AICard) => void
  appendToken: (id: string, token: string) => void
  markDone: (id: string) => void
  markError: (id: string, message: string) => void
}

export const useAISessionStore = create<AISessionState>((set) => ({
  cards: [],
  addCard: (card) => set((state) => ({ cards: [card, ...state.cards] })),
  appendToken: (id, token) =>
    set((state) => ({
      cards: state.cards.map((c) =>
        c.id === id ? { ...c, content: c.content + token } : c
      ),
    })),
  markDone: (id) =>
    set((state) => ({
      cards: state.cards.map((c) => (c.id === id ? { ...c, status: 'done' } : c)),
    })),
  markError: (id, message) =>
    set((state) => ({
      cards: state.cards.map((c) =>
        c.id === id ? { ...c, content: message, status: 'error' } : c
      ),
    })),
}))