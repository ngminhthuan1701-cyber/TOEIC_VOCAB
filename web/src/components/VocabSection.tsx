import React, { useState } from 'react'
import { Word } from '../types'
import { FSRSScheduler, FSRSRating } from '../lib/fsrs'
import { LearnMode } from './modes/LearnMode'
import { TestMode } from './modes/TestMode'
import { MatchMode } from './modes/MatchMode'
import { SpellMode } from './modes/SpellMode'
import { ETSContextModal } from './ETSContextModal'
import { Question } from '../types'
import { 
  Volume2, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  BookmarkCheck,
  CheckCircle2, 
  Sparkles,
  Search,
  AlertTriangle,
  Lightbulb,
  Clock,
  Settings2,
  BookOpen,
  GraduationCap,
  FileCheck,
  Zap,
  Headphones,
  Layers,
  FileText
} from 'lucide-react'

interface VocabProps {
  words: Word[]
  questions: Question[]
  savedWordIds: number[]
  onToggleSave: (id: number) => void
  onUpdateFSRS: (wordId: number, rating: FSRSRating) => void
}

export const VocabSection: React.FC<VocabProps> = ({ 
  words, 
  questions,
  savedWordIds, 
  onToggleSave,
  onUpdateFSRS 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dailyLimit, setDailyLimit] = useState(20)
  const [showSettings, setShowSettings] = useState(false)
  const [showETSModal, setShowETSModal] = useState(false)
  const [activeStudyMode, setActiveStudyMode] = useState<'flashcard' | 'learn' | 'test' | 'match' | 'spell'>('flashcard')

  const categories = ['all', ...Array.from(new Set(words.map(w => w.category).filter(Boolean)))]

  const filteredWords = words.filter(w => {
    const matchesCat = filterCategory === 'all' || w.category === filterCategory
    const matchesSearch = w.word.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          w.meaning_vn.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCat && matchesSearch
  })

  const currentWord = filteredWords[currentIndex] || filteredWords[0] || words[0]
  const isSaved = currentWord ? savedWordIds.includes(currentWord.id) : false

  // FSRS calculations for current card
  const cardFsrs = currentWord?.fsrs || FSRSScheduler.createNewCard()
  const previewIntervals = FSRSScheduler.previewIntervals(cardFsrs)

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

  const handleRate = (rating: FSRSRating) => {
    if (!currentWord) return
    onUpdateFSRS(currentWord.id, rating)
    // Chuyển thẻ tiếp theo
    handleNext()
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 0. QUIZLET STUDY MODES BAR */}
      <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-[#e2e8f0] shadow-sm overflow-x-auto gap-1">
        <button
          onClick={() => setActiveStudyMode('flashcard')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeStudyMode === 'flashcard'
              ? 'bg-[#0284c7] text-white shadow-sm'
              : 'text-slate-600 hover:bg-[#f0f9ff] hover:text-[#0284c7]'
          }`}
        >
          <Layers className="w-4 h-4" /> Flashcard FSRS
        </button>

        <button
          onClick={() => setActiveStudyMode('learn')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeStudyMode === 'learn'
              ? 'bg-[#0284c7] text-white shadow-sm'
              : 'text-slate-600 hover:bg-[#f0f9ff] hover:text-[#0284c7]'
          }`}
        >
          <GraduationCap className="w-4 h-4" /> Learn (Học sâu)
        </button>

        <button
          onClick={() => setActiveStudyMode('test')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeStudyMode === 'test'
              ? 'bg-[#0284c7] text-white shadow-sm'
              : 'text-slate-600 hover:bg-[#f0f9ff] hover:text-[#0284c7]'
          }`}
        >
          <FileCheck className="w-4 h-4" /> Test (Kiểm tra)
        </button>

        <button
          onClick={() => setActiveStudyMode('match')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeStudyMode === 'match'
              ? 'bg-[#0284c7] text-white shadow-sm'
              : 'text-slate-600 hover:bg-[#f0f9ff] hover:text-[#0284c7]'
          }`}
        >
          <Zap className="w-4 h-4" /> Match (Ghép từ)
        </button>

        <button
          onClick={() => setActiveStudyMode('spell')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeStudyMode === 'spell'
              ? 'bg-[#0284c7] text-white shadow-sm'
              : 'text-slate-600 hover:bg-[#f0f9ff] hover:text-[#0284c7]'
          }`}
        >
          <Headphones className="w-4 h-4" /> Spell (Chính tả)
        </button>
      </div>

      {/* Render selected Study Mode */}
      {activeStudyMode === 'learn' && (
        <LearnMode words={filteredWords} onFinish={() => setActiveStudyMode('flashcard')} />
      )}

      {activeStudyMode === 'test' && (
        <TestMode words={filteredWords} onFinish={() => setActiveStudyMode('flashcard')} />
      )}

      {activeStudyMode === 'match' && (
        <MatchMode words={filteredWords} onFinish={() => setActiveStudyMode('flashcard')} />
      )}

      {activeStudyMode === 'spell' && (
        <SpellMode words={filteredWords} onFinish={() => setActiveStudyMode('flashcard')} />
      )}

      {activeStudyMode === 'flashcard' && (
        <>
      {/* 1. TOP BAR: FILTERS, SEARCH & FSRS SETTINGS */}
      <div className="bg-white p-5 rounded-3xl border border-[#e2e8f0] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category pills */}
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

        {/* Right tools */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 md:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentIndex(0)
              }}
              placeholder="Tìm từ vựng ETS..."
              className="w-full pl-9 pr-3 py-2 bg-[#f8fafc] border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
            />
          </div>

          {/* FSRS Settings Toggle */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2.5 rounded-2xl border transition-colors cursor-pointer ${
              showSettings ? 'bg-[#0284c7] text-white border-[#0284c7]' : 'bg-[#f8fafc] text-slate-600 border-slate-200 hover:bg-[#f0f9ff]'
            }`}
            title="Tùy chỉnh thuật toán FSRS / Anki"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* FSRS Daily Settings Panel (Expandable) */}
      {showSettings && (
        <div className="bg-[#f0f9ff] border border-[#bae6fd] p-5 rounded-3xl animate-in fade-in slide-in-from-top-2 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#0284c7]" />
            <div>
              <h4 className="text-xs font-bold text-slate-800">Cấu hình thuật toán FSRS / Anki</h4>
              <p className="text-[11px] text-slate-500">Giới hạn số thẻ ôn & phát hiện từ khó nhớ (Leech Detection)</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-600">Giới hạn từ mới/ngày:</span>
            <div className="flex items-center gap-1">
              {[10, 20, 30, 50].map(val => (
                <button
                  key={val}
                  onClick={() => setDailyLimit(val)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    dailyLimit === val
                      ? 'bg-[#0284c7] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {currentWord ? (
        <div className="flex flex-col items-center">
          {/* Header of card status */}
          <div className="w-full flex justify-between items-center text-xs text-slate-500 mb-3 px-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                Thẻ <span className="text-[#0284c7] font-bold">{currentIndex + 1}</span> / {filteredWords.length}
              </span>
              {cardFsrs.isLeech && (
                <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full border border-rose-200">
                  <AlertTriangle className="w-3 h-3" /> Từ hay quên (Leech)
                </span>
              )}
            </div>

            <span className="flex items-center gap-1.5 text-sky-600 font-bold bg-[#e0f2fe] px-3 py-1 rounded-full text-[11px]">
              <Sparkles className="w-3.5 h-3.5" /> Chạm vào thẻ để lật nghĩa & ngữ cảnh ETS
            </span>
          </div>

          {/* Flashcard Box */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[420px] bg-white rounded-3xl p-8 md:p-10 border border-[#e2e8f0] shadow-xl shadow-slate-100 cursor-pointer transition-all duration-300 hover:border-sky-300 hover:shadow-sky-50 relative flex flex-col justify-between select-none"
          >
            {/* Top Row: Category badge & Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1.5 bg-[#f0f9ff] text-[#0284c7] border border-[#bae6fd] rounded-xl uppercase tracking-wider">
                  {currentWord.category || 'TOEIC ETS 2023'}
                </span>
                {currentWord.frequency && (
                  <span className="text-[11px] font-bold px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl">
                    🔥 Tần suất: {currentWord.frequency} lần
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Nút Xem trong đề ETS 2023 */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowETSModal(true)
                  }}
                  className="px-3 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Xem trực tiếp câu hỏi & đoạn văn chứa từ trong đề ETS 2023"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Xem trong đề</span>
                </button>

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
                  {currentWord.collocations && currentWord.collocations.length > 0 && (
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                      {currentWord.collocations.map((col, idx) => (
                        <span key={idx} className="text-xs px-3 py-1 bg-[#f8fafc] border border-slate-200 text-slate-600 rounded-xl font-medium">
                          ✦ {col}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-8 text-xs text-slate-400 flex items-center justify-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5 text-sky-500" /> Bấm để lật xem định nghĩa, ngữ cảnh ETS & mẹo nhớ
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in duration-200 text-left max-w-2xl mx-auto">
                  {/* Meaning Box */}
                  <div className="inline-block px-5 py-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl">
                    <h4 className="text-2xl md:text-3xl font-extrabold">{currentWord.meaning_vn}</h4>
                  </div>

                  {/* Ngữ cảnh gốc ETS 2023 */}
                  {currentWord.sentence_en && (
                    <div className="p-4 bg-[#f8fafc] rounded-2xl border border-slate-200 space-y-1.5 shadow-inner">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-sky-700 uppercase">
                        <BookOpen className="w-3.5 h-3.5" /> Ngữ cảnh gốc đề ETS 2023 (Test {currentWord.ets_source_test || 1} • Part {currentWord.ets_source_part || 5})
                      </div>
                      <p className="text-xs font-bold text-slate-800 leading-relaxed">
                        "{currentWord.sentence_en}"
                      </p>
                      {currentWord.sentence_vn && (
                        <p className="text-xs text-slate-500 leading-relaxed">
                          → {currentWord.sentence_vn}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Mẹo nhớ Memrise (Mnemonic) */}
                  {currentWord.mnemonic && (
                    <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
                      <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Mẹo nhớ siêu tốc (Mnemonic):</strong> {currentWord.mnemonic}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Row: FSRS 4 RATINGS (Again / Hard / Good / Easy) */}
            <div className="pt-4 border-t border-slate-100">
              {isFlipped ? (
                <div className="space-y-2">
                  <div className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Đánh giá mức nhớ (FSRS Anki Scheduler)
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {/* 1. Again (Quên) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRate(1)
                      }}
                      className="p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex flex-col items-center transition-all cursor-pointer"
                    >
                      <span className="text-xs font-black">Quên</span>
                      <span className="text-[10px] font-mono mt-0.5 opacity-80">{previewIntervals[1].intervalText}</span>
                    </button>

                    {/* 2. Hard (Khó) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRate(2)
                      }}
                      className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 flex flex-col items-center transition-all cursor-pointer"
                    >
                      <span className="text-xs font-black">Khó</span>
                      <span className="text-[10px] font-mono mt-0.5 opacity-80">{previewIntervals[2].intervalText}</span>
                    </button>

                    {/* 3. Good (Được) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRate(3)
                      }}
                      className="p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 flex flex-col items-center transition-all cursor-pointer"
                    >
                      <span className="text-xs font-black">Được</span>
                      <span className="text-[10px] font-mono mt-0.5 opacity-80">{previewIntervals[3].intervalText}</span>
                    </button>

                    {/* 4. Easy (Dễ) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRate(4)
                      }}
                      className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 flex flex-col items-center transition-all cursor-pointer"
                    >
                      <span className="text-xs font-black">Dễ</span>
                      <span className="text-[10px] font-mono mt-0.5 opacity-80">{previewIntervals[4].intervalText}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 font-medium text-slate-500">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Xuất hiện thường xuyên trong ETS 2023
                  </span>
                  <span className="font-medium text-sky-600">Lật thẻ để xem các mức ôn tập FSRS</span>
                </div>
              )}
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
              <RotateCw className="w-4 h-4" /> {isFlipped ? 'Xem lại từ vựng' : 'Lật xem nghĩa tiếng Việt & FSRS'}
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
      </>
      )}
      {showETSModal && currentWord && (
        <ETSContextModal
          word={currentWord}
          questions={questions}
          isSaved={isSaved}
          onToggleSave={onToggleSave}
          onClose={() => setShowETSModal(false)}
        />
      )}
    </div>
  )
}
