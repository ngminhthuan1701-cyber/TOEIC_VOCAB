import React from 'react'
import { UserStats, Word } from '../types'
import { 
  TrendingUp, 
  Brain, 
  Flame, 
  BarChart3, 
  Target,
  Sparkles
} from 'lucide-react'

interface ProgressProps {
  stats: UserStats
  words: Word[]
  savedWordIds: number[]
  onNavigateTab: (tab: string) => void
}

export const ProgressView: React.FC<ProgressProps> = ({ 
  stats, 
  words, 
  savedWordIds, 
  onNavigateTab 
}) => {
  const savedWords = words.filter(w => savedWordIds.includes(w.id))

  // Distribution of memory levels (1 through 5)
  const levelCounts = [1, 2, 3, 4, 5].map(lvl => ({
    level: lvl,
    count: savedWords.filter(w => (w.memoryLevel || 1) === lvl).length,
    label: lvl === 1 ? 'Mới gặp' : lvl === 2 ? 'Mơ hồ' : lvl === 3 ? 'Đang nhớ' : lvl === 4 ? 'Nhớ tốt' : 'Thành thạo'
  }))

  const totalPoints = savedWords.reduce((sum, w) => sum + (w.memoryLevel || 1), 0)
  const maxPossiblePoints = Math.max(savedWords.length * 5, 1)
  const retentionPercent = Math.round((totalPoints / maxPossiblePoints) * 100)

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-[#e2e8f0] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-black text-slate-800">
              Phân tích Tiến độ & Khả năng Ghi nhớ Từ vựng
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Hệ thống tự động theo dõi chu kỳ quên (Ebbinghaus Forgetting Curve) và đo lường độ bền trí nhớ của bạn.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('quiz')}
          className="px-5 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-2xl shadow-md shadow-sky-200 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" /> Làm bài test phản xạ ngay
        </button>
      </div>

      {/* 2. Top Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Retention Index */}
        <div className="bg-white p-6 rounded-3xl border border-[#e2e8f0] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">CHỈ SỐ BỀN TRÍ NHỚ</span>
            <Brain className="w-5 h-5 text-sky-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-800">{retentionPercent}%</span>
            <span className="text-xs font-bold text-emerald-600">+12% tuần này</span>
          </div>
          <div className="w-full bg-[#f1f5f9] h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-sky-400 to-[#0284c7] h-full rounded-full transition-all duration-500"
              style={{ width: `${retentionPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Dựa trên 5 mức độ nhớ Spaced Repetition cho các từ vựng bạn đã lưu trong sổ tay.
          </p>
        </div>

        {/* Target TOEIC Score */}
        <div className="bg-white p-6 rounded-3xl border border-[#e2e8f0] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">TIẾN TRÌNH MỤC TIÊU</span>
            <Target className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-800">{stats.currentEstimatedScore}</span>
            <span className="text-xs font-bold text-slate-400">/ Mục tiêu {stats.targetScore} điểm</span>
          </div>
          <div className="w-full bg-[#f1f5f9] h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.round((stats.currentEstimatedScore / stats.targetScore) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Khoảng cách còn lại: <strong className="text-indigo-600">{stats.targetScore - stats.currentEstimatedScore} điểm</strong>. Tập trung rèn Part 7 để bứt phá.
          </p>
        </div>

        {/* Streak & Consistency */}
        <div className="bg-white p-6 rounded-3xl border border-[#e2e8f0] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">CHUỖI HỌC TẬP</span>
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-amber-500">{stats.streakDays} ngày 🔥</span>
            <span className="text-xs font-bold text-emerald-600">Đều đặn mỗi ngày</span>
          </div>
          <div className="w-full bg-[#f1f5f9] h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-amber-400 h-full rounded-full"
              style={{ width: '85%' }}
            />
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Học mỗi ngày 15 phút hiệu quả gấp 5 lần so với dồn học 3 tiếng vào cuối tuần.
          </p>
        </div>
      </div>

      {/* 3. MEMORY LEVEL BREAKDOWN & CHART */}
      <div className="bg-white p-6 rounded-3xl border border-[#e2e8f0] shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#0284c7]" />
            <h3 className="text-base font-extrabold text-slate-800">
              Phân bổ 5 cấp độ ghi nhớ từ vựng (Hộp nhớ Leitner)
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Tổng cộng: {savedWords.length} từ đã đánh dấu
          </span>
        </div>

        {/* Bars */}
        <div className="space-y-4">
          {levelCounts.map((item) => {
            const pct = savedWords.length > 0 ? Math.round((item.count / savedWords.length) * 100) : 0
            const colors = [
              'bg-rose-500',
              'bg-amber-500',
              'bg-sky-500',
              'bg-indigo-500',
              'bg-emerald-500'
            ]
            const barColor = colors[item.level - 1]

            return (
              <div key={item.level} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-700 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center text-[11px]">
                      {item.level}
                    </span>
                    {item.label}
                  </span>
                  <span className="text-slate-500 font-mono">
                    {item.count} từ ({pct}%)
                  </span>
                </div>
                <div className="w-full bg-[#f1f5f9] h-3 rounded-full overflow-hidden">
                  <div 
                    className={`${barColor} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Recommendation tip */}
        <div className="p-4 bg-[#f0f9ff] border border-[#bae6fd] rounded-2xl flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div className="text-xs text-sky-900 leading-relaxed">
            <strong>Lời khuyên thông minh:</strong> Bạn đang có{' '}
            <strong className="text-amber-700">{levelCounts[0].count + levelCounts[1].count} từ</strong> ở mức 1 & 2 (Mới gặp & Mơ hồ). Hãy vào mục <strong>Sổ tay từ vựng</strong> hoặc làm <strong>Luyện phản xạ</strong> để nâng các từ này lên cấp độ 4 và 5 trước ngày thi!
          </div>
        </div>
      </div>
    </div>
  )
}
