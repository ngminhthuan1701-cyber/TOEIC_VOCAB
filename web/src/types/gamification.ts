export interface Badge {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: string
  progress: number // 0 -> 100%
  isUnlocked: boolean
}

export interface LeaderboardUser {
  rank: number
  name: string
  avatar: string
  xp: number
  streak: number
  level: number
  isCurrentUser?: boolean
}

export interface GamificationState {
  xp: number
  level: number
  streakDays: number
  streakFreezeCount: number
  lastActiveDate: string
  dailyCardsReviewed: number
  dailyCardsTarget: number
  badges: Badge[]
}
