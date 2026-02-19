import { useEffect, useState } from 'react'
import { getXP } from '../lib/xp'
import type { XPData } from '../lib/xp'

export function useXP(): XPData {
  const [xp, setXp] = useState<XPData>(() => getXP())

  useEffect(() => {
    const handler = () => setXp(getXP())
    window.addEventListener('petr-xp-update', handler)
    return () => window.removeEventListener('petr-xp-update', handler)
  }, [])

  return xp
}
