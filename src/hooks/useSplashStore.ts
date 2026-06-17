import { create } from 'zustand'

interface SplashState {
  isDone: boolean
  finish: () => void
}

export const useSplashStore = create<SplashState>((set) => ({
  isDone: false,
  finish: () => set({ isDone: true })
}))
