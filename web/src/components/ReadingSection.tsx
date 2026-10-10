import React, { useState } from 'react'
import { Question } from '../types'
import { CheckCircle2, XCircle, HelpCircle, BookOpen, Award } from 'lucide-react'

interface ReadingProps {
  questions: Question[]
}

export const ReadingSection: React.FC<ReadingProps> = ({ questions }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [activePartFilter, setActivePartFilter] = useState<number | 'all'>('all')

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

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Banner / Controls */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" /> ETS 2023 Reading Training
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Luyện tập các câu hỏi then chốt (Part 5: Ngữ pháp / Từ vựng, Part 7: Đọc hiểu văn bản thực tế)
          </p>
        </div>

        {/* Part Filters */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePartFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              activePartFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setActivePartFilter(5)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              activePartFilter === 5
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Part 5 (Incomplete Sentences)
          </button>
          <button
            onClick={() => setActivePartFilter(7)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              activePartFilter === 7
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Part 7 (Reading Comprehension)
          </button>
        </div>
      </div>

      {/* Result Card if submitted */}
      {submitted && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 backdrop-blur rounded-2xl">
              <Award className="w-8 h-8 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Kết quả bài làm của bạn</h3>
              <p className="text-xs text-indigo-100 mt-0.5">
                Đúng {scoreInfo.correct} / {scoreInfo.total} câu ({scoreInfo.percentage}%)
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSubmitted(false)
              setSelectedAnswers({})
            }}
            className="px-5 py-2.5 bg-white text-indigo-600 font-bold rounded-xl text-xs hover:bg-indigo-50 transition-colors shadow-sm"
          >
            Làm lại từ đầu
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
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : 'border-rose-300 bg-rose-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md">
                  Part {q.part_number} • Câu {q.question_number}
                </span>
                {submitted && (
                  <span className={`text-xs font-bold flex items-center gap-1 ${
                    isCorrect ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Chính xác
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" /> Chưa đúng (Đáp án: {q.correct_answer})
                      </>
                    )}
                  </span>
                )}
              </div>

              {/* Passage if exists (e.g. Part 7) */}
              {q.passage_text && (
                <div className="mb-6 p-5 bg-slate-50 border border-slate-200 rounded-2xl font-serif text-sm leading-relaxed text-slate-800 whitespace-pre-line shadow-inner">
                  {q.passage_text}
                </div>
              )}

              {/* Question Text */}
              <p className="text-base font-semibold text-slate-900 mb-6 leading-relaxed">
                {q.question_text}
              </p>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {[
                  { key: 'A', text: q.option_a },
                  { key: 'B', text: q.option_b },
                  { key: 'C', text: q.option_c },
                  { key: 'D', text: q.option_d }
                ].map((opt) => {
                  let optStyle = 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700'

                  if (userAnswer === opt.key) {
                    optStyle = 'border-indigo-600 bg-indigo-50/60 text-indigo-900 font-semibold ring-1 ring-indigo-500'
                  }

                  if (submitted) {
                    if (opt.key === q.correct_answer) {
                      optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-500'
                    } else if (userAnswer === opt.key && !isCorrect) {
                      optStyle = 'border-rose-500 bg-rose-50 text-rose-900 font-semibold ring-1 ring-rose-500'
                    }
                  }

                  return (
                    <button
                      key={opt.key}
                      disabled={submitted}
                      onClick={() => handleSelectOption(q.id, opt.key)}
                      className={`text-left p-4 rounded-2xl border transition-all flex items-start gap-3 ${optStyle}`}
                    >
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                        {opt.key}
                      </span>
                      <span className="text-sm mt-0.5">{opt.text}</span>
                    </button>
                  )
                })}
              </div>

              {/* Explanation & Vocab Notes (When Submitted) */}
              {submitted && (
                <div className="pt-5 border-t border-slate-200/60 space-y-3">
                  {q.explanation && (
                    <div className="text-xs bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-2xl leading-relaxed">
                      <span className="font-bold flex items-center gap-1.5 mb-1 text-amber-800">
                        <HelpCircle className="w-4 h-4" /> Giải thích chi tiết:
                      </span>
                      {q.explanation}
                    </div>
                  )}

                  {q.vocabulary_notes && q.vocabulary_notes.length > 0 && (
                    <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl text-xs">
                      <span className="font-bold text-indigo-900 block mb-2">
                        💡 Từ vựng quan trọng trong câu:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {q.vocabulary_notes.map((vn, i) => (
                          <span key={i} className="px-2.5 py-1 bg-white border border-indigo-200 rounded-lg text-slate-800">
                            <strong>{vn.word}</strong>: {vn.meaning}
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
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setSubmitted(true)}
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 transition-all text-sm"
          >
            Nộp bài & Xem giải thích chi tiết
          </button>
        </div>
      )}
    </div>
  )
}
