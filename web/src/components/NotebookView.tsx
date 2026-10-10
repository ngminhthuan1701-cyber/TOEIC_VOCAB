import React from 'react'
import { Word } from '../types'
import { Bookmark, Volume2, Trash2, BookOpen } from 'lucide-react'

interface NotebookProps {
  words: Word[]
  savedWordIds: number[]
  onRemoveSave: (id: number) => void
  onNavigateVocab: () => void
}

export const NotebookView: React.FC<NotebookProps> = ({ 
  words, 
  savedWordIds, 
  onRemoveSave, 
  onNavigateVocab 
}) => {
  const savedWords = words.filter(w => savedWordIds.includes(w.id))

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.85
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-white p-6 rounded-3xl border border-[#e2e8f0] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <Bookmark className="w-4 h-4 fill-amber-500" />
            </span>
            <h2 className="text-lg font-black text-slate-800">
              Sổ tay từ vựng của bạn ({savedWords.length} từ)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Danh sách những từ vựng bạn đã đánh dấu cần chú ý hoặc hay quên trong quá trình luyện đề ETS 2023.
          </p>
        </div>

        <button
          onClick={onNavigateVocab}
          className="px-4 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-2xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <BookOpen className="w-4 h-4" /> Thêm từ mới từ Flashcard
        </button>
      </div>

      {savedWords.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-500 space-y-3">
          <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">Chưa có từ nào trong sổ tay</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Khi học từ vựng hoặc làm bài đọc, bấm biểu tượng chiếc cờ (Bookmark) để lưu các từ bạn hay quên vào đây nhé!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedWords.map((word) => (
            <div 
              key={word.id} 
              className="bg-white p-5 rounded-3xl border border-[#e2e8f0] shadow-sm hover:border-sky-300 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-800">{word.word}</h3>
                    <span className="text-[10px] px-2 py-0.5 bg-[#f0f9ff] text-[#0284c7] rounded-md font-bold uppercase">
                      {word.pos || 'từ vựng'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono italic mt-0.5">
                    {word.ipa || '/.../'}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => speak(word.word)}
                    className="p-2 rounded-xl text-slate-500 hover:text-sky-600 hover:bg-[#f0f9ff] transition-colors cursor-pointer"
                    title="Phát âm"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRemoveSave(word.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Xóa khỏi sổ tay"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-xs font-bold text-emerald-800">
                {word.meaning_vn}
              </div>

              {word.example_en && (
                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl leading-relaxed">
                  <p className="font-semibold text-slate-800">"{word.example_en}"</p>
                  {word.example_vn && <p className="text-slate-500 mt-1">→ {word.example_vn}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
