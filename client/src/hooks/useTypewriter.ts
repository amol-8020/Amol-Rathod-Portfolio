import { useEffect, useState } from 'react'

const ROLES = [
  'Final Year Computer Engineering Student',
  'Aspiring Game Developer',
  'GUI Design Enthusiast',
] as const

export function useTypewriter(enabled: boolean) {
  const [line, setLine] = useState('')

  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    let roleIndex = 0

    const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

    async function loop() {
      while (!cancelled) {
        const role = ROLES[roleIndex % ROLES.length]
        const prefix = 'I am a '
        for (let i = 0; i <= role.length; i++) {
          if (cancelled) return
          setLine(prefix + role.slice(0, i))
          await sleep(72)
        }
        await sleep(2000)
        for (let i = role.length; i >= 0; i--) {
          if (cancelled) return
          setLine(prefix + role.slice(0, i))
          await sleep(44)
        }
        await sleep(420)
        roleIndex += 1
      }
    }

    void loop()
    return () => {
      cancelled = true
    }
  }, [enabled])

  return line
}
