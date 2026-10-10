import React, { useState } from 'react'
import { Word } from '../types'
import { 
  Volume2, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  BookmarkCheck,
  CheckCircle2, 
  Sparkles,
  Search
} from 'lucide-react'

interface VocabProps {
  words: Word[]
  savedWordIds: number[]
  onToggleSave: (id: number) => void
}

export const VocabSection: React.FC<VocabProps> = ({ words, savedWordIds, onToggleSave }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = ['all', ...Array.from(new Set(words.map(w => w.category).filter(Boolean)))]

  const filteredWords = words.filter(w => {
    const matchesCat = filterCategory === 'all' || w.category === filterCategory
    const matchesSearch = w.word.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          w.meaning_vn.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCat && matchesSearch
  })

  const currentWord = filteredWords[currentIndex] || filteredWords[0] || words[0]
  const isSaved = currentWord ? savedWordIds.includes(currentWord.id) : false

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.85
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleNext = () => {
    setIsFlipped(false)
    if (filteredWords.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % filteredWords.length)
    }
  }

  const handlePrev = () => {
    setIsFlipped(false)
    if (filteredWords.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Filter and Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-[#e2e8f0] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Categories pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setFilterCategory(cat as string)
                setCurrentIndex(0)
                setIsFlipped(false)
              }}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                filterCategory === cat
                  ? 'bg-[#0284c7] text-white shadow-sm shadow-sky-200'
                  : 'bg-[#f8fafc] text-slate-600 hover:bg-[#e0f2fe] hover:text-[#0284c7] border border-slate-100'
              }`}
            >
              {cat === 'all' ? 'Tất cả chủ đề' : cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentIndex(0)
            }}
            placeholder="Tìm từ vựng, nghĩa tiếng Việt..."
            className="w-full pl-9 pr-3 py-2 bg-[#f8fafc] border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {currentWord ? (
        <div className="flex flex-col items-center">
          {/* Header of card status */}
          <div className="w-full flex justify-between items-center text-xs text-slate-500 mb-3 px-2">
            <span className="font-semibold">
              Thẻ <span className="text-[#0284c7] font-bold">{currentIndex + 1}</span> / {filteredWords.length}
            </span>
            <span className="flex items-center gap-1.5 text-sky-600 font-bold bg-[#e0f2fe] px-3 py-1 rounded-full text-[11px]">
              <Sparkles className="w-3.5 h-3.5" /> Chạm vào thẻ hoặc bấm nút để lật nghĩa
            </span>
          </div>

          {/* Flashcard Box */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[380px] bg-white rounded-3xl p-8 md:p-10 border border-[#e2e8f0] shadow-xl shadow-slate-100 cursor-pointer transition-all duration-300 hover:border-sky-300 hover:shadow-sky-50 relative flex flex-col justify-between select-none"
          >
            {/* Top Row: Category badge & Actions */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-3 py-1.5 bg-[#f0f9ff] text-[#0284c7] border border-[#bae6fd] rounded-xl uppercase tracking-wider">
                {currentWord.category || 'TOEIC ETS 2023'}
              </span>

              <div className="flex items-center gap-2">
                {/* Audio Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    speak(currentWord.word)
                  }}
                  className="p-2.5 rounded-2xl bg-[#f0f9ff] hover:bg-[#0284c7] hover:text-white transition-colors text-[#0284c7] border border-[#bae6fd] cursor-pointer"
                  title="Nghe phát âm chuẩn"
                >
                  <Volume2 className="w-5 h-5" />
                </button>

                {/* Bookmark Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleSave(currentWord.id)
                  }}
                  className={`p-2.5 rounded-2xl border transition-colors cursor-pointer ${
                    isSaved
                      ? 'bg-amber-500 text-white border-amber-600'
                      : 'bg-[#f8fafc] text-slate-400 hover:text-amber-500 hover:bg-amber-50 border-slate-200'
                  }`}
                  title={isSaved ? "Bỏ lưu từ" : "Lưu vào sổ tay"}
                >
                  {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Middle Content */}
            <div className="py-6 text-center">
              {!isFlipped ? (
                <div>
                  <h3 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-3">
                    {currentWord.word}
                  </h3>
                  <p className="text-base text-slate-500 font-mono italic">
                    {currentWord.ipa || '/.../'} • <span className="font-sans font-bold text-[#0284c7] uppercase text-xs">{currentWord.pos || 'vocabulary'}</span>
                  </p>

                  {/* Collocations preview */}
                  {currentWord.collocations && (
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                      {currentWord.collocations.map((col, idx) => (
                        <span key={idx} className="text-xs px-3 py-1 bg-[#f8fafc] border border-slate-200 text-slate-600 rounded-xl font-medium">
                          ✦ {col}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-8 text-xs text-slate-400 flex items-center justify-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5 text-sky-500" /> Bấm để lật xem định nghĩa tiếng Việt & ví dụ ETS
                  </div>
                </div>
              ) : (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="inline-block px-5 py-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl">
                    <h4 className="text-2xl md:text-3xl font-extrabold">{currentWord.meaning_vn}</h4>
                  </div>

                  {currentWord.example_en && (
                    <div className="p-5 bg-[#f8fafc] rounded-2xl border border-slate-200 text-left space-y-2 mt-4 max-w-2xl mx-auto shadow-inner">
                      <p className="text-sm font-bold text-slate-800 leading-relaxed">
                        "{currentWord.example_en}"
                      </p>
                      {currentWord.example_vn && (
                        <p className="text-xs text-slate-500 leading-relaxed">
                          → {currentWord.example_vn}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Row */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Xuất hiện thường xuyên trong ETS 2023
              </span>
              <span className="font-medium text-sky-600">Phím mũi tên / Click để chuyển thẻ</span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={handlePrev}
              className="p-3.5 bg-white border border-[#e2e8f0] rounded-2xl hover:bg-[#f0f9ff] hover:text-[#0284c7] text-slate-700 shadow-sm transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-8 py-3 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-2xl shadow-md shadow-sky-200 transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCw className="w-4 h-4" /> {isFlipped ? 'Xem lại từ vựng' : 'Lật xem nghĩa tiếng Việt'}
            </button>
            <button
              onClick={handleNext}
              className="p-3.5 bg-white border border-[#e2e8f0] rounded-2xl hover:bg-[#f0f9ff] hover:text-[#0284c7] text-slate-700 shadow-sm transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-500 text-sm">
          Không tìm thấy từ vựng nào khớp với từ khóa tìm kiếm.
        </div>
      )}
    </div>
  )
}
