import { useState } from 'react'
import { Word, Question } from '../types'
import { CheckCircle2, XCircle, HelpCircle, BookOpen, Award, RotateCcw, Sparkles, Plus, BookmarkCheck, Volume2, X } from 'lucide-react'

interface ReadingProps {
  questions: Question[]
  words: Word[]
  savedWordIds: number[]
  onQuickAddWord: (word: Omit<Word, 'id'>) => void
  onToggleSave: (id: number) => void
}

export const ReadingSection: React.FC<ReadingProps> = ({ 
  questions,
  words,
  savedWordIds,
  onQuickAddWord,
  onToggleSave
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [activePartFilter, setActivePartFilter] = useState<number | 'all'>('all')

  // Tra từ 1 chạm Popover
  const [lookupWord, setLookupWord] = useState<string | null>(null)
  const [matchedDictWord, setMatchedDictWord] = useState<Word | null>(null)
  const [isWordSaved, setIsWordSaved] = useState(false)

  const filteredQuestions = activePartFilter === 'all'
    ? questions
    : questions.filter(q => q.part_number === activePartFilter)

  const handleSelectOption = (questionId: number, optionKey: string) => {
    if (submitted) return
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionKey }))
  }

  const calculateScore = () => {
    let correct = 0
    filteredQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.correct_answer) {
        correct++
      }
    })
    return {
      correct,
      total: filteredQuestions.length,
      percentage: Math.round((correct / filteredQuestions.length) * 100) || 0
    }
  }

  const scoreInfo = calculateScore()

  // Tra từ 1 chạm khi click vào từ
  const handleWordClick = (rawWord: string) => {
    const cleanWord = rawWord.replace(/[^a-zA-Z]/g, '').toLowerCase()
    if (!cleanWord || cleanWord.length <= 2) return

    setLookupWord(cleanWord)
    const found = words.find(w => w.word.toLowerCase() === cleanWord)
    if (found) {
      setMatchedDictWord(found)
      setIsWordSaved(savedWordIds.includes(found.id))
    } else {
      setMatchedDictWord(null)
      setIsWordSaved(false)
    }
  }

  // Tách văn bản thành từng từ có thể click
  const renderInteractiveText = (text: string) => {
    return text.split(/(\s+)/).map((segment, idx) => {
      const isWord = /^[a-zA-Z]{3,}/.test(segment)
      if (!isWord) return segment

      return (
        <span
          key={idx}
          onClick={() => handleWordClick(segment)}
          className="hover:bg-sky-100 hover:text-[#0284c7] hover:underline cursor-pointer rounded px-0.5 transition-colors"
          title="Chạm để tra từ & thêm vào sổ tay"
        >
          {segment}
        </span>
      )
    })
  }

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.85
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleQuickAdd = () => {
    if (!lookupWord) return
    if (matchedDictWord) {
      onToggleSave(matchedDictWord.id)
      setIsWordSaved(!isWordSaved)
    } else {
      onQuickAddWord({
        word: lookupWord,
        meaning_vn: 'Từ vựng lưu nhanh từ bài đọc ETS 2023',
        pos: 'từ vựng',
        category: 'Từ tra trong bài đọc',
        memoryLevel: 1
      })
      setIsWordSaved(true)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto relative">
      {/* Top Banner & Part Filters */}
      <div className="bg-white p-6 rounded-3xl border border-[#e2e8f0] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-black text-slate-800">
              ETS 2023 Reading Training & Exam Mode
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gồm {questions.length} câu hỏi chọn lọc chuẩn format thi thật (Part 5, 6, 7). Chấm điểm và phân tích ngữ pháp tức thì.
          </p>
        </div>

        {/* Part Filters */}
        <div className="flex items-center gap-1.5 bg-[#f8fafc] p-1.5 rounded-2xl border border-slate-100">
          <button
            onClick={() => setActivePartFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activePartFilter === 'all'
                ? 'bg-[#0284c7] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#0284c7]'
            }`}
          >
            Tất cả ({questions.length})
          </button>
          <button
            onClick={() => setActivePartFilter(5)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activePartFilter === 5
                ? 'bg-[#0284c7] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#0284c7]'
            }`}
          >
            Part 5 (Câu đơn)
          </button>
          <button
            onClick={() => setActivePartFilter(6)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activePartFilter === 6
                ? 'bg-[#0284c7] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#0284c7]'
            }`}
          >
            Part 6 (Điền đoạn)
          </button>
          <button
            onClick={() => setActivePartFilter(7)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activePartFilter === 7
                ? 'bg-[#0284c7] text-white shadow-sm'
                : 'text-slate-600 hover:text-[#0284c7]'
            }`}
          >
            Part 7 (Đọc hiểu)
          </button>
        </div>
      </div>

      {/* Result Card when submitted */}
      {submitted && (
        <div className="bg-gradient-to-r from-[#0284c7] to-[#0369a1] rounded-3xl p-6 text-white shadow-lg shadow-sky-100 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
              <Award className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <h3 className="text-lg font-black">Kết quả bài làm của bạn</h3>
              <p className="text-xs text-sky-100 mt-0.5">
                Chính xác: <span className="font-extrabold text-white text-sm">{scoreInfo.correct} / {scoreInfo.total}</span> câu ({scoreInfo.percentage}%) • Ước tính điểm Reading: ~{Math.min(495, scoreInfo.percentage * 4.9).toFixed(0)} / 495
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSubmitted(false)
              setSelectedAnswers({})
            }}
            className="flex items-center gap-2 px-6 py-3 bg-white text-[#0284c7] font-bold rounded-2xl text-xs hover:bg-sky-50 transition-colors shadow-sm cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Làm lại từ đầu
          </button>
        </div>
      )}

      {/* Question List */}
      <div className="space-y-6">
        {filteredQuestions.map((q) => {
          const userAnswer = selectedAnswers[q.id]
          const isCorrect = userAnswer === q.correct_answer

          return (
            <div
              key={q.id}
              className={`bg-white rounded-3xl border transition-all p-6 md:p-8 ${
                submitted
                  ? isCorrect
                    ? 'border-emerald-300 bg-emerald-50/15'
                    : 'border-rose-300 bg-rose-50/15'
                  : 'border-[#e2e8f0] hover:border-sky-300'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold px-3 py-1 bg-[#f0f9ff] text-[#0284c7] border border-[#bae6fd] rounded-xl">
                  Part {q.part_number} • Câu {q.question_number}
                </span>

                {submitted && (
                  <span className={`text-xs font-bold flex items-center gap-1.5 ${
                    isCorrect ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Đúng (+5 điểm)
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" /> Chưa đúng (Đáp án đúng: {q.correct_answer})
                      </>
                    )}
                  </span>
                )}
              </div>

              {/* Passage for Part 6 & Part 7 */}
              {q.passage_text && (
                <div className="mb-6 p-6 bg-[#f8fafc] border border-slate-200 rounded-2xl font-serif text-sm leading-relaxed text-slate-800 whitespace-pre-line shadow-inner select-text">
                  {renderInteractiveText(q.passage_text)}
                </div>
              )}

              {/* Question Text */}
              <p className="text-base font-bold text-slate-800 mb-6 leading-relaxed select-text">
                {renderInteractiveText(q.question_text)}
              </p>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {[
                  { key: 'A', text: q.option_a },
                  { key: 'B', text: q.option_b },
                  { key: 'C', text: q.option_c },
                  { key: 'D', text: q.option_d }
                ].map((opt) => {
                  let optStyle = 'border-[#e2e8f0] hover:border-sky-300 hover:bg-[#f0f9ff] text-slate-700 bg-white'

                  if (userAnswer === opt.key) {
                    optStyle = 'border-[#0284c7] bg-[#e0f2fe] text-[#0284c7] font-bold ring-2 ring-[#0284c7]'
                  }

                  if (submitted) {
                    if (opt.key === q.correct_answer) {
                      optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500'
                    } else if (userAnswer === opt.key && !isCorrect) {
                      optStyle = 'border-rose-500 bg-rose-50 text-rose-900 font-bold ring-2 ring-rose-500'
                    }
                  }

                  return (
                    <button
                      key={opt.key}
                      disabled={submitted}
                      onClick={() => handleSelectOption(q.id, opt.key)}
                      className={`text-left p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${optStyle}`}
                    >
                      <span className={`shrink-0 w-6 h-6 rounded-xl flex items-center justify-center text-xs font-black ${
                        userAnswer === opt.key 
                          ? 'bg-[#0284c7] text-white' 
                          : 'bg-[#f1f5f9] text-slate-600'
                      }`}>
                        {opt.key}
                      </span>
                      <span className="text-sm mt-0.5">{opt.text}</span>
                    </button>
                  )
                })}
              </div>

              {/* Explanation & Vocab Notes when submitted */}
              {submitted && (
                <div className="pt-5 border-t border-slate-100 space-y-3">
                  {q.explanation && (
                    <div className="text-xs bg-[#f0f9ff] border border-[#bae6fd] text-[#0369a1] p-4 rounded-2xl leading-relaxed">
                      <span className="font-extrabold flex items-center gap-1.5 mb-1.5 text-[#0284c7]">
                        <HelpCircle className="w-4 h-4" /> Giải thích chi tiết & Mẹo làm bài:
                      </span>
                      {q.explanation}
                    </div>
                  )}

                  {q.vocabulary_notes && q.vocabulary_notes.length > 0 && (
                    <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl text-xs">
                      <span className="font-bold text-emerald-900 block mb-2">
                        💡 Từ vựng trọng tâm trích từ đề:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {q.vocabulary_notes.map((vn, i) => (
                          <span key={i} className="px-3 py-1 bg-white border border-emerald-300 rounded-xl text-slate-800 font-medium shadow-xs">
                            <strong className="text-emerald-700">{vn.word}</strong>: {vn.meaning}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Submit Button */}
      {!submitted && (
        <div className="flex justify-center pt-4 pb-8">
          <button
            onClick={() => setSubmitted(true)}
            className="px-10 py-4 bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold rounded-2xl shadow-lg shadow-sky-200 transition-all text-sm flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> Nộp bài & Xem giải thích chi tiết
          </button>
        </div>
      )}

      {/* Click-to-Lookup Popover / Floating Card */}
      {lookupWord && (
        <div className="fixed bottom-6 right-6 z-40 bg-white border border-[#bae6fd] rounded-3xl p-5 shadow-2xl max-w-sm w-full animate-in fade-in slide-in-from-bottom-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-sky-100 text-[#0284c7] rounded uppercase">
                Tra từ nhanh 1-chạm
              </span>
              <h4 className="text-xl font-black text-slate-800 mt-1 capitalize">{lookupWord}</h4>
              <p className="text-xs text-slate-400 font-mono italic">
                {matchedDictWord?.ipa || '/.../'} • {matchedDictWord?.pos || 'từ vựng'}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => speak(lookupWord)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50"
                title="Nghe phát âm"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLookupWord(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs font-bold text-emerald-800">
            {matchedDictWord ? matchedDictWord.meaning_vn : 'Nghĩa đang được cập nhật từ điển TOEIC ETS.'}
          </div>

          {matchedDictWord?.mnemonic && (
            <p className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              💡 <strong>Mẹo nhớ:</strong> {matchedDictWord.mnemonic}
            </p>
          )}

          <div className="pt-1 flex items-center justify-between gap-2">
            <button
              onClick={handleQuickAdd}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isWordSaved
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#0284c7] hover:bg-[#0369a1] text-white shadow-md shadow-sky-200'
              }`}
            >
              {isWordSaved ? (
                <>
                  <BookmarkCheck className="w-4 h-4" />
                  <span>Đã lưu vào Sổ tay</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Thêm vào bộ thẻ (1 chạm)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
