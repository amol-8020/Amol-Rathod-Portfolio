import { useMemo, useState } from 'react'
import { LoaderContext } from './LoaderContextCore'

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(false)
  const value = useMemo(() => ({ done, setDone }), [done])
  return <LoaderContext.Provider value={value}>{children}</LoaderContext.Provider>
}
