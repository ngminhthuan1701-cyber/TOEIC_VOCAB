import { useState } from 'react'
import { Word } from '../../types'
import { CheckCircle2, XCircle, Award } from 'lucide-react'

interface TestModeProps {
  words: Word[]
  onFinish: () => void
}

type QuestionType = 'multiple_choice' | 'true_false' | 'fill_blank'

interface TestItem {
  id: number
  type: QuestionType
  word: Word
  prompt: string
  options?: string[]
  correctAnswer: string
  userAnswer?: string
  isCorrect?: boolean
}

export const TestMode: React.FC<TestModeProps> = ({ words, onFinish }) => {
  const [items, setItems] = useState<TestItem[]>(() => {
    const testPool = words.slice(0, 10)
    return testPool.map((w, idx) => {
      const type: QuestionType = idx % 3 === 0 ? 'multiple_choice' : idx % 3 === 1 ? 'true_false' : 'fill_blank'
      if (type === 'multiple_choice') {
        const distractors = words.filter(o => o.id !== w.id).map(o => o.meaning_vn).slice(0, 3)
        const allOpts = [w.meaning_vn, ...distractors].sort((a, b) => a.localeCompare(b))
        return {
          id: w.id,
          type,
          word: w,
          prompt: `Từ "${w.word}" có nghĩa là gì?`,
          options: allOpts,
          correctAnswer: w.meaning_vn
        }
      } else if (type === 'true_false') {
        const isTrue = idx % 2 === 0
        const fakeMeaning = words.find(o => o.id !== w.id)?.meaning_vn || 'không xác định'
        return {
          id: w.id,
          type,
          word: w,
          prompt: `Đúng hay Sai: "${w.word}" có nghĩa là "${isTrue ? w.meaning_vn : fakeMeaning}"?`,
          options: ['Đúng', 'Sai'],
          correctAnswer: isTrue ? 'Đúng' : 'Sai'
        }
      } else {
        return {
          id: w.id,
          type,
          word: w,
          prompt: `Điền từ thích hợp: "${w.meaning_vn}" trong tiếng Anh là gì?`,
          correctAnswer: w.word.toLowerCase()
        }
      }
    })
  })

  const [submitted, setSubmitted] = useState(false)

  const handleSelectAnswer = (index: number, ans: string) => {
    if (submitted) return
    setItems(prev => prev.map((item, i) => i === index ? { ...item, userAnswer: ans } : item))
  }

  const handleSubmit = () => {
    setItems(prev => prev.map(item => {
      const isCorrect = (item.userAnswer || '').trim().toLowerCase() === item.correctAnswer.toLowerCase()
      return { ...item, isCorrect }
    }))
    setSubmitted(true)
  }

  const correctCount = items.filter(i => (i.userAnswer || '').trim().toLowerCase() === i.correctAnswer.toLowerCase()).length

  return (
    <div className="bg-white rounded-3xl border border-[#e2e8f0] p-6 md:p-8 shadow-sm space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="text-[10px] font-bold px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-lg uppercase">
            Bài kiểm tra tổng hợp 10 câu
          </span>
          <h3 className="text-base font-extrabold text-slate-800 mt-1">Chế độ Test Mode (Trắc nghiệm + Đúng/Sai + Điền từ)</h3>
        </div>
        {submitted && (
          <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Điểm: {correctCount} / {items.length} ({Math.round((correctCount / items.length) * 100)}%)
          </span>
        )}
      </div>

      {/* Result summary banner */}
      {submitted && (
        <div className="p-5 rounded-2xl bg-[#0284c7] text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-amber-300" />
            <div>
              <h4 className="font-extrabold text-sm">Bạn đã hoàn thành bài kiểm tra Test Mode!</h4>
              <p className="text-xs text-sky-100">Đúng {correctCount}/{items.length} câu. Kết quả đã được ghi nhận vào tiến độ.</p>
            </div>
          </div>
          <button
            onClick={onFinish}
            className="px-4 py-2 bg-white text-[#0284c7] font-bold rounded-xl text-xs hover:bg-sky-50 cursor-pointer"
          >
            Quay lại bộ thẻ
          </button>
        </div>
      )}

      {/* Questions list */}
      <div className="space-y-6">
        {items.map((item, idx) => (
          <div key={item.id} className="p-5 rounded-2xl bg-[#f8fafc] border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">
                Câu {idx + 1} • <span className="uppercase text-sky-600">{item.type.replace('_', ' ')}</span>
              </span>
              {submitted && (
                <span className={`text-xs font-bold flex items-center gap-1 ${
                  item.isCorrect ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {item.isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  {item.isCorrect ? 'Đúng' : `Sai (Đáp án: ${item.correctAnswer})`}
                </span>
              )}
            </div>

            <p className="text-sm font-bold text-slate-800">{item.prompt}</p>

            {/* Render options or text input */}
            {item.options ? (
              <div className="grid grid-cols-2 gap-2 pt-1">
                {item.options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    disabled={submitted}
                    onClick={() => handleSelectAnswer(idx, opt)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                      item.userAnswer === opt
                        ? 'bg-[#0284c7] text-white border-[#0284c7]'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300 hover:bg-sky-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <input
                type="text"
                disabled={submitted}
                value={item.userAnswer || ''}
                onChange={(e) => handleSelectAnswer(idx, e.target.value)}
                placeholder="Nhập từ tiếng Anh..."
                className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 focus:outline-none focus:border-sky-500"
              />
            )}
          </div>
        ))}
      </div>

      {/* Submit / Finish */}
      <div className="flex justify-end pt-4">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-extrabold rounded-2xl shadow-md shadow-sky-200 cursor-pointer"
          >
            Nộp bài kiểm tra
          </button>
        ) : (
          <button
            onClick={onFinish}
            className="px-8 py-3 bg-slate-800 hover:bg-slate-900 text-white text-xs font-extrabold rounded-2xl shadow-md cursor-pointer"
          >
            Hoàn tất & Thoát
          </button>
        )}
      </div>
    </div>
  )
}
