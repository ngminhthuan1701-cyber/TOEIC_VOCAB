import React from 'react'
import { 
  LayoutDashboard, 
  BookMarked, 
  FileText, 
  BrainCircuit, 
  Sparkles, 
  TrendingUp, 
  FolderCheck, 
  Settings, 
  HelpCircle,
  Zap,
  Bookmark,
  Flame
} from 'lucide-react'

interface SidebarProps {
  currentTab: string
  setCurrentTab: (tab: string) => void
  savedCount: number
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab, savedCount }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'vocab', label: 'Từ vựng trọng tâm', icon: BookMarked, badge: '24 từ' },
    { id: 'reading', label: 'Luyện đề ETS 2023', icon: FileText, badge: 'Part 5, 6, 7' },
    { id: 'notebook', label: 'Sổ tay từ đã lưu', icon: Bookmark, badge: savedCount > 0 ? `${savedCount}` : undefined },
    { id: 'quiz', label: 'Luyện phản xạ nhanh', icon: BrainCircuit },
    { id: 'gamification', label: 'Streak & Đua Top', icon: Flame, badge: '5 ngày 🔥' },
    { id: 'progress', label: 'Tiến độ & Mục tiêu', icon: TrendingUp },
    { id: 'ai-coach', label: 'TOEIC AI Coach', icon: Sparkles, highlight: true },
    { id: 'materials', label: 'Tài liệu khoá học', icon: FolderCheck },
    { id: 'settings', label: 'Cài đặt hệ thống', icon: Settings },
  ]

  return (
    <aside className="w-64 bg-white border-r border-[#eef4f9] flex flex-col justify-between p-5 select-none shrink-0 min-h-screen">
      <div>
        {/* Brand Logo & Header */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0284c7] to-[#38bdf8] flex items-center justify-center text-white shadow-md shadow-sky-200">
            <Zap className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="text-sm font-black tracking-wider text-slate-800 uppercase">
              TOEIC OS
            </div>
            <div className="text-[10px] font-bold text-sky-500 uppercase tracking-widest">
              ETS 2023 EDITION
            </div>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#e0f2fe] text-[#0284c7] shadow-sm font-bold'
                    : 'text-slate-600 hover:bg-[#f0f9ff] hover:text-[#0284c7]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#0284c7]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-[#0284c7] text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.highlight && !item.badge && (
                  <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Bottom User Card */}
      <div className="p-3.5 bg-[#f0f9ff] rounded-2xl border border-[#e0f2fe] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#0284c7] text-white font-bold flex items-center justify-center text-xs shadow-sm">
            M
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Minh (Target 850)</div>
            <div className="text-[10px] text-slate-500">Học viên ETS 2023</div>
          </div>
        </div>
        <HelpCircle className="w-4 h-4 text-slate-400 hover:text-sky-600 cursor-pointer" />
      </div>
    </aside>
  )
}
