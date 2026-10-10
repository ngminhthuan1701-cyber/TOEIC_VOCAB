import React, { useState } from 'react'
import { Word } from '../types'
import { CheckCircle2, XCircle, RotateCcw, BrainCircuit, Sparkles } from 'lucide-react'

interface QuizProps {
  words: Word[]
}

export const QuizView: React.FC<QuizProps> = ({ words }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [quizFinished, setQuizFinished] = useState(false)

  const quizPool = words.slice(0, 10)
  const currentWord = quizPool[currentIndex]

  // Generate 4 multiple-choice options (1 correct meaning + 3 distractors)
  const getOptions = () => {
    if (!currentWord) return []
    const correct = currentWord.meaning_vn
    const distractors = words
      .filter(w => w.id !== currentWord.id)
      .map(w => w.meaning_vn)
      .slice(0, 3)
    
    // Sort pseudo-randomly based on id
    return [correct, ...distractors].sort((a, b) => a.localeCompare(b))
  }

  const options = getOptions()

  const handleSelect = (option: string) => {
    if (isAnswered) return
    setSelectedOption(option)
    setIsAnswered(true)

    if (option === currentWord.meaning_vn) {
      setScore(prev => prev + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentIndex + 1 < quizPool.length) {
      setCurrentIndex(prev => prev + 1)
      setSelectedOption(null)
      setIsAnswered(false)
    } else {
      setQuizFinished(true)
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setSelectedOption(null)
    setIsAnswered(false)
    setScore(0)
    setQuizFinished(false)
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Quiz Banner */}
      <div className="bg-white p-6 rounded-3xl border border-[#e2e8f0] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center font-bold">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-800">
              Luyện phản xạ từ vựng ETS (10 câu)
            </h2>
            <p className="text-xs text-slate-500">
              Nhìn từ tiếng Anh và chọn nhanh nghĩa tiếng Việt tương ứng
            </p>
          </div>
        </div>
        <div className="text-xs font-bold px-3 py-1.5 bg-[#f0f9ff] text-[#0284c7] rounded-xl border border-[#bae6fd]">
          Điểm: {score} / {quizPool.length}
        </div>
      </div>

      {!quizFinished && currentWord ? (
        <div className="bg-white rounded-3xl border border-[#e2e8f0] p-8 shadow-sm space-y-6">
          {/* Progress */}
          <div className="flex justify-between items-center text-xs text-slate-500 font-semibold">
            <span>Câu {currentIndex + 1} / {quizPool.length}</span>
            <span>Tiến độ: {Math.round(((currentIndex + 1) / quizPool.length) * 100)}%</span>
          </div>

          <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
            <div 
              className="bg-[#0284c7] h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / quizPool.length) * 100}%` }}
            />
          </div>

          {/* Question Word */}
          <div className="text-center py-6">
            <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase">
              {currentWord.category}
            </span>
            <h3 className="text-4xl font-black text-slate-800 mt-3 mb-2">{currentWord.word}</h3>
            <p className="text-sm text-slate-400 font-mono italic">{currentWord.ipa}</p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-3">
            {options.map((opt, idx) => {
              let optStyle = 'border-slate-200 hover:border-sky-300 hover:bg-[#f0f9ff] text-slate-700 bg-white'

              if (isAnswered) {
                if (opt === currentWord.meaning_vn) {
                  optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold ring-2 ring-emerald-500'
                } else if (selectedOption === opt) {
                  optStyle = 'border-rose-500 bg-rose-50 text-rose-800 font-bold ring-2 ring-rose-500'
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelect(opt)}
                  className={`p-4 rounded-2xl border text-left text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${optStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswered && opt === currentWord.meaning_vn && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {isAnswered && selectedOption === opt && opt !== currentWord.meaning_vn && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Next Button */}
          {isAnswered && (
            <div className="pt-4 flex justify-end">
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-2xl text-xs shadow-md shadow-sky-200 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Câu tiếp theo</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#e2e8f0] p-10 text-center space-y-5 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center text-3xl mx-auto">
            🏆
          </div>
          <h3 className="text-2xl font-black text-slate-800">Hoàn thành bài luyện phản xạ!</h3>
          <p className="text-sm text-slate-600 max-w-sm mx-auto">
            Bạn trả lời đúng <span className="font-extrabold text-[#0284c7]">{score} / {quizPool.length}</span> câu. Phản xạ từ vựng của bạn rất tuyệt vời!
          </p>
          <div className="pt-2">
            <button
              onClick={handleRestart}
              className="px-8 py-3.5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold rounded-2xl text-xs shadow-md shadow-sky-200 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Thử lại lần nữa
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
