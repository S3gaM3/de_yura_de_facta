import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  ACHIEVEMENTS,
  getRewardsForUnlocked,
  getUnlocked,
  unlockAchievement as storeUnlock,
} from '../lib/achievements'

type AchievementContextValue = {
  unlocked: string[]
  rewards: Set<string>
  unlock: (id: string) => boolean
  isUnlocked: (id: string) => boolean
  achievements: typeof ACHIEVEMENTS
}

const AchievementContext = createContext<AchievementContextValue | null>(null)

export function AchievementProvider({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState<string[]>(() => getUnlocked())
  const rewards = useMemo(() => getRewardsForUnlocked(unlocked), [unlocked])

  const unlock = useCallback((id: string) => {
    const ok = storeUnlock(id)
    if (ok) setUnlocked((prev) => [...prev, id])
    return ok
  }, [])

  const isUnlocked = useCallback(
    (id: string) => unlocked.includes(id),
    [unlocked]
  )

  const value = useMemo(
    () => ({
      unlocked,
      rewards,
      unlock,
      isUnlocked,
      achievements: ACHIEVEMENTS,
    }),
    [unlocked, rewards, unlock, isUnlocked]
  )

  return (
    <AchievementContext.Provider value={value}>
      {children}
    </AchievementContext.Provider>
  )
}

export function useAchievements() {
  const ctx = useContext(AchievementContext)
  if (!ctx) throw new Error('useAchievements must be used within AchievementProvider')
  return ctx
}
