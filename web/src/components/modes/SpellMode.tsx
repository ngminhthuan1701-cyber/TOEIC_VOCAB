import { useState, useEffect } from 'react'
import { Word } from '../../types'
import { Volume2, CheckCircle2, XCircle, ArrowRight, Headphones } from 'lucide-react'

interface SpellModeProps {
  words: Word[]
  onFinish: () => void
}

export const SpellMode: React.FC<SpellModeProps> = ({ words, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [typedInput, setTypedInput] = useState('')
  const [isAnswered, setIsAnswered] = useState(false)

  const pool = words.slice(0, 10)
  const currentWord = pool[currentIndex] || pool[0]

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.85
      window.speechSynthesis.speak(utterance)
    }
  }

  // Tự động phát âm khi chuyển sang từ mới
  useEffect(() => {
    if (currentWord) {
      speak(currentWord.word)
    }
  }, [currentIndex])

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault()
    if (!typedInput.trim()) return
    setIsAnswered(true)
  }

  const handleNext = () => {
    setIsAnswered(false)
    setTypedInput('')
    if (currentIndex + 1 < pool.length) {
      setCurrentIndex(prev => prev + 1)
    } else {
      onFinish()
    }
  }

  const isCorrect = typedInput.trim().toLowerCase() === currentWord?.word.toLowerCase()

  return (
    <div className="bg-white rounded-3xl border border-[#e2e8f0] p-6 md:p-8 shadow-sm space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg uppercase">
            Nghe phát âm & Chính tả
          </span>
          <h3 className="text-base font-extrabold text-slate-800 mt-1">Chế độ Spell Mode (Quizlet Style)</h3>
        </div>
        <div className="text-xs font-bold text-slate-500">
          Câu {currentIndex + 1} / {pool.length}
        </div>
      </div>

      {/* Audio Prompter Box */}
      <div className="p-8 bg-[#f0f9ff] border border-[#bae6fd] rounded-3xl text-center space-y-4">
        <button
          onClick={() => speak(currentWord.word)}
          className="w-16 h-16 rounded-full bg-[#0284c7] hover:bg-[#0369a1] text-white flex items-center justify-center mx-auto shadow-lg shadow-sky-200 transition-transform active:scale-95 cursor-pointer"
          title="Bấm để nghe lại"
        >
          <Volume2 className="w-8 h-8" />
        </button>
        <div>
          <h4 className="text-xs font-bold text-sky-800 uppercase tracking-wider flex items-center justify-center gap-1.5">
            <Headphones className="w-4 h-4" /> Bấm nút trên để nghe phát âm
          </h4>
          <p className="text-xs text-slate-500 mt-1">Gợi ý nghĩa tiếng Việt: <strong>{currentWord.meaning_vn}</strong></p>
        </div>
      </div>

      {/* Input form */}
      <form onSubmit={handleCheck} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">
            Gõ chính xác từ tiếng Anh bạn vừa nghe:
          </label>
          <input
            type="text"
            autoFocus
            disabled={isAnswered}
            value={typedInput}
            onChange={(e) => setTypedInput(e.target.value)}
            placeholder="Type what you hear..."
            className={`w-full px-4 py-3 rounded-2xl border text-base font-bold transition-all focus:outline-none ${
              isAnswered
                ? isCorrect
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                  : 'border-rose-500 bg-rose-50 text-rose-900'
                : 'border-slate-200 bg-[#f8fafc] focus:border-sky-500 focus:bg-white'
            }`}
          />
        </div>

        {isAnswered && (
          <div className={`p-4 rounded-2xl text-xs space-y-1 ${
            isCorrect ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
          }`}>
            <div className="font-bold flex items-center gap-1.5">
              {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {isCorrect ? 'Tuyệt vời! Bạn nghe và gõ rất chuẩn.' : `Chưa chính xác! Từ đúng là: "${currentWord.word}" (${currentWord.ipa})`}
            </div>
          </div>
        )}

        {!isAnswered ? (
          <button
            type="submit"
            className="w-full py-3 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-2xl shadow-md shadow-sky-200 cursor-pointer"
          >
            Kiểm tra chính tả
          </button>
        ) : (
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-2xl shadow-md cursor-pointer"
            >
              <span>Từ tiếp theo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </form>
    </div>
  )
}
