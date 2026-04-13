import { createContext, useContext, useMemo, useState } from 'react'

type LoaderContextValue = {
  done: boolean
  setDone: (v: boolean) => void
}

const LoaderContext = createContext<LoaderContextValue | null>(null)

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(false)
  const value = useMemo(() => ({ done, setDone }), [done])
  return <LoaderContext.Provider value={value}>{children}</LoaderContext.Provider>
}

export function useLoader() {
  const ctx = useContext(LoaderContext)
  if (!ctx) throw new Error('useLoader must be used within LoaderProvider')
  return ctx
}
