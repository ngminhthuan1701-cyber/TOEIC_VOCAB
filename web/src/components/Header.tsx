import React from 'react'
import { Sun, Download, CloudUpload, HardDrive, Smartphone, Share2 } from 'lucide-react'

interface HeaderProps {
  userName: string
}

export const Header: React.FC<HeaderProps> = ({ userName }) => {
  const todayStr = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date())

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 select-none">
      <div>
        <div className="text-[11px] font-bold text-sky-600 uppercase tracking-wider mb-0.5">
          HÔM NAY • {todayStr.toUpperCase()}
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 flex items-center gap-2">
          Chào ngày mới, {userName} <span className="animate-bounce inline-block">👋</span>
        </h1>
      </div>

      {/* Right Action Icons (like Fitness OS image) */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Quick action buttons with pastel rounded styling */}
        <div className="flex items-center bg-white border border-[#e2e8f0] p-1 rounded-2xl shadow-sm gap-1">
          <button 
            title="Đồng bộ Cloud Supabase" 
            className="p-2 hover:bg-[#f0f9ff] text-slate-600 hover:text-sky-600 rounded-xl transition-colors cursor-pointer"
          >
            <CloudUpload className="w-4 h-4" />
          </button>
          <button 
            title="Lưu trữ dữ liệu cục bộ" 
            className="p-2 hover:bg-[#f0f9ff] text-slate-600 hover:text-sky-600 rounded-xl transition-colors cursor-pointer"
          >
            <HardDrive className="w-4 h-4" />
          </button>
          <button 
            title="Tải từ vựng offline" 
            className="p-2 hover:bg-[#f0f9ff] text-slate-600 hover:text-sky-600 rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </button>
          <button 
            title="Chia sẻ kết quả học tập" 
            className="p-2 hover:bg-[#f0f9ff] text-slate-600 hover:text-sky-600 rounded-xl transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button 
            title="Chế độ hiển thị" 
            className="p-2 hover:bg-[#f0f9ff] text-slate-600 hover:text-sky-600 rounded-xl transition-colors cursor-pointer"
          >
            <Sun className="w-4 h-4" />
          </button>
        </div>

        {/* Install / PWA button */}
        <button className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-2xl text-xs font-bold shadow-md shadow-sky-200 transition-all cursor-pointer">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Học trên Mobile</span>
        </button>

        {/* User Avatar Circle */}
        <div className="w-9 h-9 rounded-2xl bg-[#0284c7] text-white font-extrabold flex items-center justify-center text-xs shadow-md shadow-sky-200 cursor-pointer">
          M
        </div>
      </div>
    </header>
  )
}
