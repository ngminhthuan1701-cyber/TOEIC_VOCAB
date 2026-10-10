import React, { useState } from 'react'
import { GamificationState, LeaderboardUser } from '../types/gamification'
import { 
  Flame, 
  ShieldCheck, 
  Trophy, 
  Sparkles, 
  Zap, 
  Crown, 
  CheckCircle2, 
  Calendar,
  Lock
} from 'lucide-react'

interface GamificationViewProps {
  gamification: GamificationState
  onUseStreakFreeze: () => void
  onClaimDailyReward: () => void
}

const MOCK_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: "Khánh Linh", avatar: "KL", xp: 1850, streak: 21, level: 8 },
  { rank: 2, name: "Hoàng Nam", avatar: "HN", xp: 1620, streak: 14, level: 7 },
  { rank: 3, name: "Minh (Bạn)", avatar: "M", xp: 1380, streak: 5, level: 5, isCurrentUser: true },
  { rank: 4, name: "Thu Trang", avatar: "TT", xp: 1250, streak: 9, level: 5 },
  { rank: 5, name: "Quốc Anh", avatar: "QA", xp: 1100, streak: 4, level: 4 },
  { rank: 6, name: "Bảo Ngọc", avatar: "BN", xp: 950, streak: 3, level: 4 },
]

export const GamificationView: React.FC<GamificationViewProps> = ({
  gamification,
  onUseStreakFreeze,
  onClaimDailyReward
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'leaderboard' | 'badges'>('overview')
  const [freezeClaimed, setFreezeClaimed] = useState(false)

  const currentLevelProgress = Math.min(100, Math.round(((gamification.xp % 300) / 300) * 100))

  return (
    <div className="space-y-6 max-w-5xl mx-auto select-none">
      {/* 1. TOP HERO: DUOLINGO STYLE STREAK & LEVEL STATUS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Streak card with freeze support */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-6 text-white shadow-lg shadow-orange-100 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full backdrop-blur-xs">
              Chuỗi ngày học liên tục
            </span>
            <Flame className="w-6 h-6 text-yellow-200 fill-yellow-200 animate-bounce" />
          </div>

          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black">{gamification.streakDays}</span>
              <span className="text-sm font-bold text-amber-100">ngày liên tiếp 🔥</span>
            </div>
            <p className="text-xs text-amber-100 mt-1">
              Học mỗi ngày tối thiểu 10 thẻ từ để giữ lửa streak!
            </p>
          </div>

          <div className="pt-3 border-t border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-100">
              <ShieldCheck className="w-4 h-4 text-sky-200" />
              <span>Đóng băng streak: {gamification.streakFreezeCount} lượt</span>
            </div>
            {gamification.streakFreezeCount > 0 && !freezeClaimed && (
              <button
                onClick={() => {
                  onUseStreakFreeze()
                  setFreezeClaimed(true)
                }}
                className="px-3 py-1 bg-white text-orange-600 rounded-xl text-[11px] font-black hover:bg-amber-50 shadow-xs cursor-pointer"
              >
                Kích hoạt
              </button>
            )}
            {freezeClaimed && (
              <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded text-white">
                Đã bảo vệ ✓
              </span>
            )}
          </div>
        </div>

        {/* Level & XP card */}
        <div className="bg-gradient-to-br from-[#0284c7] to-[#0369a1] rounded-3xl p-6 text-white shadow-lg shadow-sky-100 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full backdrop-blur-xs">
              Cấp độ học viên
            </span>
            <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
          </div>

          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black">Lv.{gamification.level}</span>
              <span className="text-sm font-bold text-sky-200">{gamification.xp} XP</span>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-[11px] font-bold text-sky-100 mb-1">
                <span>Tiến trình lên Level {gamification.level + 1}</span>
                <span>{currentLevelProgress}%</span>
              </div>
              <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-400 h-full rounded-full transition-all duration-500 shadow-xs" 
                  style={{ width: `${currentLevelProgress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="text-[11px] text-sky-200 flex items-center justify-between border-t border-white/20 pt-3">
            <span>Mỗi thẻ học: +5 XP</span>
            <span>Mỗi bài Test: +20 XP</span>
          </div>
        </div>

        {/* Daily Goal card */}
        <div className="bg-white rounded-3xl p-6 border border-[#e2e8f0] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Mục tiêu hôm nay
            </span>
            <Calendar className="w-4 h-4 text-sky-500" />
          </div>

          <div className="my-3 text-center">
            <div className="text-4xl font-black text-slate-800">
              {gamification.dailyCardsReviewed} / {gamification.dailyCardsTarget}
            </div>
            <p className="text-xs text-slate-500 mt-1">thẻ từ vựng đã ôn luyện</p>
          </div>

          <div>
            <div className="w-full bg-[#f1f5f9] h-2.5 rounded-full overflow-hidden mb-3">
              <div 
                className="bg-[#0284c7] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.round((gamification.dailyCardsReviewed / gamification.dailyCardsTarget) * 100))}%` }}
              />
            </div>
            <button
              onClick={onClaimDailyReward}
              disabled={gamification.dailyCardsReviewed < gamification.dailyCardsTarget}
              className={`w-full py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                gamification.dailyCardsReviewed >= gamification.dailyCardsTarget
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200 hover:bg-emerald-700'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{gamification.dailyCardsReviewed >= gamification.dailyCardsTarget ? 'Nhận rương phần thưởng (+50 XP)' : 'Chưa hoàn thành'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SUB-TABS: LEADERBOARD VS BADGES */}
      <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-[#e2e8f0] shadow-sm w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'overview' ? 'bg-[#0284c7] text-white shadow-xs' : 'text-slate-600 hover:text-sky-600'
          }`}
        >
          Huy hiệu danh hiệu ({gamification.badges.filter(b => b.isUnlocked).length}/{gamification.badges.length})
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'leaderboard' ? 'bg-[#0284c7] text-white shadow-xs' : 'text-slate-600 hover:text-sky-600'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Bảng xếp hạng tuần (Top 10)</span>
        </button>
      </div>

      {/* 3. CONTENT AREA */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {gamification.badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-3 ${
                badge.isUnlocked
                  ? 'bg-white border-amber-200 shadow-md shadow-amber-50'
                  : 'bg-[#f8fafc] border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl">{badge.icon}</span>
                {badge.isUnlocked ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-400" />
                )}
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-slate-800">{badge.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{badge.description}</p>
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                  <span>Tiến độ</span>
                  <span>{badge.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${badge.isUnlocked ? 'bg-amber-400' : 'bg-slate-300'}`}
                    style={{ width: `${badge.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="bg-white rounded-3xl border border-[#e2e8f0] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" /> Bảng thi đua Tuần 41 • 2026
              </h3>
              <p className="text-[11px] text-slate-400">Top 3 sẽ nhận Huy hiệu Vàng và 200 XP thưởng cuối tuần</p>
            </div>
            <span className="text-[11px] font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
              Còn 2 ngày 14 giờ
            </span>
          </div>

          <div className="space-y-2">
            {MOCK_LEADERBOARD.map((user) => {
              const isTop1 = user.rank === 1
              const isTop2 = user.rank === 2
              const isTop3 = user.rank === 3

              return (
                <div
                  key={user.rank}
                  className={`p-4 rounded-2xl flex items-center justify-between transition-all ${
                    user.isCurrentUser
                      ? 'bg-[#e0f2fe] border-2 border-[#0284c7] font-bold shadow-sm'
                      : 'bg-[#f8fafc] border border-slate-100 hover:bg-[#f0f9ff]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                      isTop1 ? 'bg-amber-400 text-white' :
                      isTop2 ? 'bg-slate-300 text-slate-800' :
                      isTop3 ? 'bg-amber-700 text-white' : 'text-slate-400'
                    }`}>
                      {user.rank}
                    </span>

                    <div className="w-9 h-9 rounded-xl bg-[#0284c7] text-white flex items-center justify-center text-xs font-extrabold shadow-xs">
                      {user.avatar}
                    </div>

                    <div>
                      <div className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                        <span>{user.name}</span>
                        {isTop1 && <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                      </div>
                      <span className="text-[10px] text-slate-400">Level {user.level} • Chuỗi {user.streak} ngày</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-black text-slate-800">{user.xp} XP</div>
                    <span className="text-[10px] text-emerald-600 font-semibold">Tăng hạng ↗</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
