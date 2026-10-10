import { useState } from 'react'
import { Word } from '../../types'
import { CheckCircle2, XCircle, Volume2, ArrowRight } from 'lucide-react'

interface LearnProps {
  words: Word[]
  onFinish: () => void
}

type QuestionStage = 'multiple_choice' | 'type_in'

export const LearnMode: React.FC<LearnProps> = ({ words, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [typedInput, setTypedInput] = useState('')
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [stage, setStage] = useState<QuestionStage>('multiple_choice')
  const [progressCount, setProgressCount] = useState(0)

  const pool = words.slice(0, 12)
  const currentWord = pool[currentIndex] || pool[0]

  // Trộn 4 đáp án cho dạng trắc nghiệm
  const getOptions = () => {
    if (!currentWord) return []
    const correct = currentWord.meaning_vn
    const distractors = words
      .filter(w => w.id !== currentWord.id)
      .map(w => w.meaning_vn)
      .slice(0, 3)
    return [correct, ...distractors].sort((a, b) => a.localeCompare(b))
  }

  const options = getOptions()

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.85
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return
    setSelectedOption(opt)
    setIsAnswered(true)
  }

  const handleCheckTypeIn = (e: React.FormEvent) => {
    e.preventDefault()
    if (!typedInput.trim()) return
    setIsAnswered(true)
  }

  const handleNext = () => {
    setIsAnswered(false)
    setSelectedOption(null)
    setTypedInput('')

    // Tiến hóa từ Multiple Choice sang Type-In khi sang nửa sau bộ từ
    if (currentIndex + 1 < pool.length) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      setProgressCount(prev => prev + 1)
      if (nextIndex >= 4) {
        setStage('type_in') // Chuyển sang tự gõ từ khi người học đã bắt đầu quen
      }
    } else {
      onFinish()
    }
  }

  const isTypeInCorrect = typedInput.trim().toLowerCase() === currentWord?.word.toLowerCase()

  return (
    <div className="bg-white rounded-3xl border border-[#e2e8f0] p-6 md:p-8 shadow-sm space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="text-[10px] font-bold px-2.5 py-1 bg-sky-100 text-[#0284c7] rounded-lg uppercase">
            {stage === 'multiple_choice' ? 'Giai đoạn 1: Trắc nghiệm nhận diện' : 'Giai đoạn 2: Tự gõ từ vựng (Nhớ sâu)'}
          </span>
          <h3 className="text-sm font-extrabold text-slate-800 mt-1">Chế độ Học Learn Mode (Quizlet Style)</h3>
        </div>
        <div className="text-xs font-bold text-slate-500">
          {progressCount + 1} / {pool.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
        <div 
          className="bg-[#0284c7] h-full rounded-full transition-all duration-300"
          style={{ width: `${((progressCount + 1) / pool.length) * 100}%` }}
        />
      </div>

      {/* Question presentation */}
      {stage === 'multiple_choice' ? (
        <div className="space-y-6">
          <div className="text-center py-4">
            <span className="text-xs font-bold text-slate-400 uppercase">{currentWord.category}</span>
            <div className="flex items-center justify-center gap-2 mt-1">
              <h2 className="text-3xl font-black text-slate-800">{currentWord.word}</h2>
              <button 
                onClick={() => speak(currentWord.word)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-sky-600 hover:bg-sky-50"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400 font-mono italic">{currentWord.ipa}</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {options.map((opt, idx) => {
              let btnStyle = 'border-slate-200 hover:border-sky-300 hover:bg-[#f0f9ff] text-slate-700 bg-white'
              if (isAnswered) {
                if (opt === currentWord.meaning_vn) {
                  btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold ring-2 ring-emerald-500'
                } else if (selectedOption === opt) {
                  btnStyle = 'border-rose-500 bg-rose-50 text-rose-800 font-bold ring-2 ring-rose-500'
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(opt)}
                  className={`p-4 rounded-2xl border text-left text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswered && opt === currentWord.meaning_vn && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  {isAnswered && selectedOption === opt && opt !== currentWord.meaning_vn && (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        <form onSubmit={handleCheckTypeIn} className="space-y-6">
          <div className="p-5 bg-[#f0f9ff] border border-[#bae6fd] rounded-2xl text-center space-y-2">
            <span className="text-xs font-bold text-sky-700 uppercase">Định nghĩa tiếng Việt</span>
            <h3 className="text-xl font-black text-slate-800">{currentWord.meaning_vn}</h3>
            <p className="text-xs text-slate-500">Từ loại: <strong className="uppercase">{currentWord.pos || 'từ vựng'}</strong></p>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Gõ từ tiếng Anh tương ứng:
            </label>
            <input
              type="text"
              autoFocus
              disabled={isAnswered}
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder="Nhập từ tiếng Anh..."
              className={`w-full px-4 py-3 rounded-2xl border text-sm font-bold transition-all focus:outline-none ${
                isAnswered
                  ? isTypeInCorrect
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                    : 'border-rose-500 bg-rose-50 text-rose-900'
                  : 'border-slate-200 bg-[#f8fafc] focus:border-sky-500 focus:bg-white'
              }`}
            />
          </div>

          {isAnswered && (
            <div className={`p-4 rounded-2xl text-xs space-y-1 ${
              isTypeInCorrect ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
            }`}>
              <div className="font-bold flex items-center gap-1.5">
                {isTypeInCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                {isTypeInCorrect ? 'Xuất sắc! Chính xác tuyệt đối.' : `Chưa đúng! Từ chính xác là: "${currentWord.word}"`}
              </div>
              <p className="text-slate-500">Phát âm: {currentWord.ipa}</p>
            </div>
          )}

          {!isAnswered && (
            <button
              type="submit"
              className="w-full py-3 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-2xl shadow-md shadow-sky-200 cursor-pointer"
            >
              Kiểm tra câu trả lời
            </button>
          )}
        </form>
      )}

      {/* Next button */}
      {isAnswered && (
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-2xl shadow-md shadow-sky-200 cursor-pointer"
          >
            <span>Tiếp tục</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
