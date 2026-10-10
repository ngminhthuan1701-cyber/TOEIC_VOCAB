import React, { useState } from 'react'
import { Word } from '../types'
import { Volume2, CheckCircle2, RotateCw, Sparkles, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react'

interface VocabProps {
  words: Word[]
}

export const VocabSection: React.FC<VocabProps> = ({ words }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>('all')

  const categories = ['all', ...Array.from(new Set(words.map(w => w.category).filter(Boolean)))]
  const filteredWords = filterCategory === 'all' 
    ? words 
    : words.filter(w => w.category === filterCategory)

  const currentWord = filteredWords[currentIndex] || words[0]

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleNext = () => {
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev + 1) % filteredWords.length)
  }

  const handlePrev = () => {
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length)
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Category selector */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-200">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2 flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5" /> Chủ đề:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setFilterCategory(cat as string)
              setCurrentIndex(0)
              setIsFlipped(false)
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              filterCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat === 'all' ? 'Tất cả từ vựng' : cat}
          </button>
        ))}
      </div>

      {currentWord && (
        <div className="flex flex-col items-center">
          {/* Progress indicator */}
          <div className="w-full flex justify-between items-center text-xs text-slate-500 mb-3 px-1">
            <span>Từ {currentIndex + 1} / {filteredWords.length}</span>
            <span className="flex items-center gap-1 text-indigo-600 font-medium">
              <Sparkles className="w-3.5 h-3.5" /> Chạm vào thẻ để lật nghĩa
            </span>
          </div>

          {/* Flashcard Box */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[340px] bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-100 cursor-pointer transition-all duration-300 hover:border-indigo-300 hover:shadow-indigo-50 relative flex flex-col justify-between select-none"
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md uppercase tracking-wider">
                {currentWord.category || 'TOEIC Core'}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  speak(currentWord.word)
                }}
                className="p-2.5 rounded-full bg-slate-100 hover:bg-indigo-100 hover:text-indigo-600 transition-colors text-slate-600"
                title="Phát âm từ"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Card Content */}
            <div className="py-6 text-center">
              {!isFlipped ? (
                <div>
                  <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-2">
                    {currentWord.word}
                  </h3>
                  <p className="text-sm text-slate-500 font-mono italic">
                    {currentWord.ipa || '/.../'} • <span className="font-sans font-medium text-indigo-600">{currentWord.pos || 'từ vựng'}</span>
                  </p>
                  <div className="mt-8 text-xs text-slate-400 flex items-center justify-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5" /> Bấm để xem định nghĩa tiếng Việt & ví dụ
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="inline-block px-4 py-2 bg-emerald-50 text-emerald-800 rounded-2xl">
                    <h4 className="text-2xl font-bold">{currentWord.meaning_vn}</h4>
                  </div>
                  {currentWord.example_en && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left space-y-1.5 mt-4">
                      <p className="text-sm font-semibold text-slate-800">
                        {currentWord.example_en}
                      </p>
                      {currentWord.example_vn && (
                        <p className="text-xs text-slate-500">
                          {currentWord.example_vn}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom row */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> ETS 2023 High Frequency
              </span>
              <span>Ấn Space hoặc click để lật thẻ</span>
            </div>
          </div>

          {/* Navigation controls */}
          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={handlePrev}
              className="p-3 bg-white border border-slate-200 rounded-full hover:bg-slate-50 text-slate-700 shadow-sm transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-full shadow transition-all flex items-center gap-2"
            >
              <RotateCw className="w-4 h-4" /> {isFlipped ? 'Hiện từ vựng' : 'Xem nghĩa'}
            </button>
            <button
              onClick={handleNext}
              className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-md shadow-indigo-200 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
