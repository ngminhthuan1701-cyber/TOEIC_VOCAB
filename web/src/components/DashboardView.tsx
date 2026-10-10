import React from 'react'
import { Sparkles, ArrowRight, Target, Flame, BookCheck, CheckCircle2 } from 'lucide-react'
import { UserStats } from '../types'

interface DashboardProps {
  stats: UserStats
  onNavigate: (tab: string) => void
}

export const DashboardView: React.FC<DashboardProps> = ({ stats, onNavigate }) => {
  return (
    <div className="space-y-6">
      {/* 1. AI COACH BANNER (Exactly matching image "Gợi ý hôm nay từ AI Coach") */}
      <div className="bg-gradient-to-r from-[#e0f2fe] via-[#f0f9ff] to-white border border-[#bae6fd] rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0284c7] flex items-center justify-center text-white shadow-md shadow-sky-200 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-800">
              Gợi ý hôm nay từ TOEIC AI Coach
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-2xl">
              Hôm nay bạn có lịch rèn luyện <span className="font-bold text-sky-700">Part 5 (Đại từ & Cụm danh từ)</span> và ôn tập <span className="font-bold text-sky-700">12 từ vựng chủ đề Hợp đồng & Đàm phán</span>. Hãy hoàn thành 1 mini-test để duy trì chuỗi {stats.streakDays} ngày liên tiếp!
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('reading')}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-2xl shadow-md shadow-sky-200 transition-all shrink-0 cursor-pointer"
        >
          <span>Vào buổi luyện</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 2. STATS ROW (5 Cards: CÂN NẶNG, CALORIES... -> TOEIC Equivalent) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Card 1: Ước lượng điểm */}
        <div className="bg-white p-5 rounded-3xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">ĐIỂM DỰ KIẾN</span>
            <Target className="w-4 h-4 text-sky-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{stats.currentEstimatedScore}</div>
            <div className="text-[11px] font-semibold text-emerald-600 mt-1">
              +{stats.currentEstimatedScore - 650} đ / 4 tuần
            </div>
          </div>
        </div>

        {/* Card 2: Mục tiêu từ vựng */}
        <div className="bg-white p-5 rounded-3xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">TỪ VỰNG ETS</span>
            <BookCheck className="w-4 h-4 text-sky-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{stats.vocabLearned} / {stats.totalVocabGoal}</div>
            <div className="text-[11px] text-slate-500 mt-1">
              Còn {stats.totalVocabGoal - stats.vocabLearned} từ mục tiêu
            </div>
          </div>
        </div>

        {/* Card 3: Buổi học hôm nay */}
        <div className="bg-white p-5 rounded-3xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">BÀI HỌC</span>
            <span className="text-sky-500 text-xs">📖</span>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">Part 5 & 7</div>
            <div className="text-[11px] text-sky-600 font-medium mt-1">
              ETS Test 1 • Sẵn sàng
            </div>
          </div>
        </div>

        {/* Card 4: Độ chuẩn xác Reading */}
        <div className="bg-white p-5 rounded-3xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">ĐỘ CHÍNH XÁC</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{stats.readingAccuracy}%</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">
              Phong độ ổn định
            </div>
          </div>
        </div>

        {/* Card 5: Chuỗi ngày Streak */}
        <div className="bg-white p-5 rounded-3xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">CHUỖI NGÀY</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{stats.streakDays} ngày 🔥</div>
            <div className="text-[11px] text-amber-600 font-medium mt-1">
              Duy trì liên tục
            </div>
          </div>
        </div>
      </div>

      {/* 3. TWO BIG PANELS (Matching image: "Hôm nay tôi đã tập gì?" + "Hôm nay tôi đã ăn gì?") */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Panel Trái: Lộ trình rèn luyện hôm nay */}
        <div className="bg-white p-6 rounded-3xl border border-[#e2e8f0] shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🎯</span>
              <div>
                <h3 className="text-base font-extrabold text-slate-800">
                  Hôm nay tôi đã rèn luyện gì?
                </h3>
                <p className="text-xs text-slate-500">
                  Lộ trình: ETS 2023 Reading Comprehension
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-[#f0f9ff] p-1 rounded-2xl border border-[#e0f2fe]">
              <span className="px-3 py-1 bg-[#0284c7] text-white rounded-xl text-xs font-bold shadow-sm">
                Đang học
              </span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
              <span>Tiến độ bài học hôm nay (3/4 mục tiêu hoàn thành)</span>
              <span className="text-[#0284c7]">75%</span>
            </div>
            <div className="w-full bg-[#f1f5f9] h-2.5 rounded-full overflow-hidden">
              <div className="bg-[#0284c7] h-full rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div 
              onClick={() => onNavigate('reading')}
              className="p-3.5 rounded-2xl bg-[#f8fafc] border border-slate-100 flex items-center justify-between hover:border-sky-300 hover:bg-[#f0f9ff] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-sky-100 text-[#0284c7] flex items-center justify-center font-bold text-xs">
                  01
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-800">ETS 2023 - Part 5 Mini Test</div>
                  <div className="text-[11px] text-slate-500">8 câu ngữ pháp & từ vựng chọn lọc</div>
                </div>
              </div>
              <span className="text-xs font-bold text-[#0284c7]">Làm ngay →</span>
            </div>

            <div 
              onClick={() => onNavigate('reading')}
              className="p-3.5 rounded-2xl bg-[#f8fafc] border border-slate-100 flex items-center justify-between hover:border-sky-300 hover:bg-[#f0f9ff] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  02
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-800">ETS 2023 - Part 7 Reading Passage</div>
                  <div className="text-[11px] text-slate-500">Đọc hiểu đoạn văn Memorandum & Email</div>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600">Đã xong ✓</span>
            </div>
          </div>
        </div>

        {/* Panel Phải: Nạp từ vựng & Phân tích chuyên sâu */}
        <div className="bg-white p-6 rounded-3xl border border-[#e2e8f0] shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🧠</span>
              <div>
                <h3 className="text-base font-extrabold text-slate-800">
                  Nạp từ vựng & Ghi nhớ dài hạn
                </h3>
                <p className="text-xs text-slate-500">
                  Chu kỳ lặp lại ngắt quãng Spaced Repetition
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-[#e0f2fe] text-[#0284c7] rounded-xl text-xs font-bold">
              24 từ ETS
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                <span>Tiến độ từ vựng tuần này (142 / 200 từ)</span>
                <span className="text-amber-600">71%</span>
              </div>
              <div className="w-full bg-[#f1f5f9] h-2.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full" style={{ width: '71%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                <span>Từ vựng đã thành thạo (Mastered)</span>
                <span className="text-sky-600">60%</span>
              </div>
              <div className="w-full bg-[#f1f5f9] h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#0284c7] h-full rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#f0f9ff] rounded-2xl border border-[#bae6fd] flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-800">Bộ Flashcards hôm nay</div>
              <div className="text-[11px] text-slate-500">Hợp đồng, Đàm phán, Kế toán & Quy định</div>
            </div>
            <button
              onClick={() => onNavigate('vocab')}
              className="px-4 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
            >
              Học Flashcard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
