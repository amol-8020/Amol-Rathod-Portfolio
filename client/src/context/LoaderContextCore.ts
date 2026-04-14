import { createContext } from 'react'

type LoaderContextValue = {
  done: boolean
  setDone: (v: boolean) => void
}

export const LoaderContext = createContext<LoaderContextValue | null>(null)
export type { LoaderContextValue }
