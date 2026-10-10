'use client'

import { useState, useEffect } from 'react'
import { INITIAL_ETS_WORDS } from '@/data/etsWords'
import { Word, FSRSItemState, FSRSRating } from '@/types'
import { FSRSScheduler } from '@/lib/fsrs'
import confetti from 'canvas-confetti'
import {
  Sparkles,
  BookOpen,
  Layers,
  Volume2,
  RotateCw,
  Flame,
  Award,
  Search,
  CheckCircle,
  FileText,
  Zap,
  ArrowRight
} from 'lucide-react'

export default function HomePage() {
  const [words, setWords] = useState<Word[]>(INITIAL_ETS_WORDS)
  const [cardsState, setCardsState] = useState<Record<number, FSRSItemState>>({})
  const [activeTab, setActiveTab] = useState<'study' | 'deck' | 'detail'>('study')
  const [selectedWord, setSelectedWord] = useState<Word>(INITIAL_ETS_WORDS[0])
  const [searchTerm, setSearchTerm] = useState('')

  // Trạng thái phiên học FSRS
  const [studyQueue, setStudyQueue] = useState<Word[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [sessionCompleted, setSessionCompleted] = useState(false)
  const [streak, setStreak] = useState(5)
  const [xp, setXp] = useState(350)

  // Khởi tạo thẻ FSRS
  useEffect(() => {
    const saved = localStorage.getItem('toeic_fsrs_cards')
    if (saved) {
      try {
        setCardsState(JSON.parse(saved))
      } catch (e) {
        console.error(e)
      }
    } else {
      const initial: Record<number, FSRSItemState> = {}
      INITIAL_ETS_WORDS.forEach((w) => {
        initial[w.id] = FSRSScheduler.createNewCard()
      })
      setCardsState(initial)
    }
  }, [])

  // Tạo hàng đợi học thông minh mỗi ngày (Trộn thẻ đến hạn + thẻ mới)
  const startDailySession = () => {
    const now = new Date()
    // Ưu tiên thẻ đến hạn ôn, sau đó đến thẻ mới
    const dueWords = words.filter((w) => {
      const card = cardsState[w.id]
      if (!card) return true
      return new Date(card.due_date) <= now || card.state === 0
    })

    const queue = dueWords.length > 0 ? dueWords.slice(0, 10) : words.slice(0, 10)
    setStudyQueue(queue)
    setCurrentIndex(0)
    setIsFlipped(false)
    setSessionCompleted(false)
    setActiveTab('study')
  }

  useEffect(() => {
    startDailySession()
  }, [words])

  // Phát âm Web Speech API
  const speak = (text: string, lang = 'en-US') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      utterance.rate = 0.88
      window.speechSynthesis.speak(utterance)
    }
  }

  // Đánh giá 4 mức FSRS
  const handleRating = (rating: FSRSRating) => {
    if (studyQueue.length === 0) return
    const currentWord = studyQueue[currentIndex]
    const currentCard = cardsState[currentWord.id] || FSRSScheduler.createNewCard()

    const updatedCard = FSRSScheduler.reviewCard(currentCard, rating)
    const updatedCardsState = {
      ...cardsState,
      [currentWord.id]: updatedCard
    }

    setCardsState(updatedCardsState)
    localStorage.setItem('toeic_fsrs_cards', JSON.stringify(updatedCardsState))

    // Cộng XP
    setXp((prev) => prev + (rating >= 3 ? 15 : 5))

    setIsFlipped(false)
    if (currentIndex + 1 < studyQueue.length) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      setSessionCompleted(true)
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }

  // Lọc từ cho màn hình kho từ vựng
  const filteredWords = words.filter(
    (w) =>
      w.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.meaning_vn.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const currentWord = studyQueue[currentIndex] || words[0]
  const currentCardState = cardsState[currentWord?.id] || FSRSScheduler.createNewCard()
  const intervals = FSRSScheduler.previewIntervals(currentCardState)

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto bg-white sm:shadow-xl sm:border sm:border-slate-100 sm:rounded-3xl sm:my-6 overflow-hidden">
      {/* 1. TOP APP BAR */}
      <header className="px-5 py-4 bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-sky-400 to-[#0284c7] flex items-center justify-center text-white font-black text-sm shadow-sm shadow-sky-200">
            T
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-800 tracking-tight">TOEIC VOCAB MASTER</h1>
            <p className="text-[10px] text-slate-400 font-semibold">ETS 2023 • FSRS Engine</p>
          </div>
        </div>

        {/* Streak & XP Badges */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-black text-amber-600">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
            <span>{streak}</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 bg-sky-50 border border-sky-200 rounded-full text-xs font-black text-[#0284c7]">
            <Award className="w-3.5 h-3.5 text-[#0284c7]" />
            <span>{xp} XP</span>
          </div>
        </div>
      </header>

      {/* 2. MAIN BODY */}
      <main className="flex-1 p-5 pb-24 overflow-y-auto">
        {/* TAB 1: PHIÊN HỌC FSRS HÀNG NGÀY */}
        {activeTab === 'study' && (
          <div className="space-y-4">
            {!sessionCompleted ? (
              <>
                {/* Progress bar */}
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>Hàng đợi hôm nay</span>
                  <span className="text-[#0284c7] font-black">
                    {currentIndex + 1} / {studyQueue.length} thẻ
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-400 to-[#0284c7] rounded-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / (studyQueue.length || 1)) * 100}%` }}
                  />
                </div>

                {/* FLASHCARD 3D TOUCH */}
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="mt-2 min-h-[360px] bg-gradient-to-b from-[#f8fbfe] to-white rounded-3xl p-6 border-2 border-sky-100 hover:border-sky-300 transition-all flex flex-col justify-between cursor-pointer shadow-sm select-none"
                >
                  {/* Top card metadata */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-lg bg-[#e0f2fe] text-[#0284c7]">
                      ETS 2023 • Part {currentWord.context.part_number}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        speak(currentWord.word)
                      }}
                      className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#0284c7] flex items-center justify-center shadow-2xs"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Card Center */}
                  <div className="text-center py-6">
                    {!isFlipped ? (
                      <div className="space-y-2">
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                          {currentWord.word}
                        </h2>
                        <p className="text-sm font-mono text-slate-400 italic">
                          {currentWord.ipa} • <span className="text-sky-600 font-bold">{currentWord.pos}</span>
                        </p>
                        <p className="text-xs text-slate-400 pt-6 font-semibold flex items-center justify-center gap-1">
                          <RotateCw className="w-3.5 h-3.5" /> Chạm vào thẻ để xem nghĩa & câu gốc ETS
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4 animate-in fade-in zoom-in-95">
                        <div className="text-2xl font-black text-emerald-700">
                          {currentWord.meaning_vn}
                        </div>
                        {currentWord.definition_en && (
                          <p className="text-xs text-slate-500 font-medium italic">
                            "{currentWord.definition_en}"
                          </p>
                        )}

                        {/* ETS 2023 REAL CONTEXT */}
                        <div className="bg-[#f0f9ff] p-3.5 rounded-2xl border border-sky-100 text-left space-y-1.5 mt-2">
                          <div className="text-[10px] font-black uppercase text-[#0284c7] flex items-center gap-1">
                            <FileText className="w-3 h-3" /> Ngữ cảnh trong đề ETS 2023 (Test {currentWord.context.test_number})
                          </div>
                          <div className="text-xs text-slate-700 font-medium leading-relaxed">
                            "{currentWord.context.sentence_en}"
                          </div>
                          <div className="text-[11px] text-slate-500 italic">
                            {currentWord.context.sentence_vn}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom FSRS Evaluation Buttons (Khi đã lật thẻ) */}
                  {isFlipped ? (
                    <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleRating(1)}
                        className="py-2.5 px-1 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-center transition-all cursor-pointer"
                      >
                        <div className="text-[11px] font-black">Quên</div>
                        <div className="text-[9px] opacity-75">{intervals[1].text}</div>
                      </button>
                      <button
                        onClick={() => handleRating(2)}
                        className="py-2.5 px-1 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-center transition-all cursor-pointer"
                      >
                        <div className="text-[11px] font-black">Khó</div>
                        <div className="text-[9px] opacity-75">{intervals[2].text}</div>
                      </button>
                      <button
                        onClick={() => handleRating(3)}
                        className="py-2.5 px-1 rounded-2xl bg-sky-50 hover:bg-sky-100 text-[#0284c7] border border-sky-200 text-center transition-all cursor-pointer"
                      >
                        <div className="text-[11px] font-black">Được</div>
                        <div className="text-[9px] opacity-75">{intervals[3].text}</div>
                      </button>
                      <button
                        onClick={() => handleRating(4)}
                        className="py-2.5 px-1 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-center transition-all cursor-pointer"
                      >
                        <div className="text-[11px] font-black">Dễ</div>
                        <div className="text-[9px] opacity-75">{intervals[4].text}</div>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-[11px] font-bold text-slate-400">
                      Bấm thẻ để hiển thị 4 mức đánh giá FSRS
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* MÀN HÌNH TỔNG KẾT PHIÊN HỌC */
              <div className="bg-white rounded-3xl p-8 border border-sky-100 text-center space-y-5 shadow-sm">
                <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
                  🎉
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800">Hoàn thành phiên học hôm nay!</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Thuật toán FSRS đã tự động cập nhật lịch ôn tập ngắt quãng tối ưu nhất cho bạn.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 py-2">
                  <div className="p-3 bg-[#f8fafc] rounded-2xl border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400">SỐ THẺ ĐÃ ÔN</div>
                    <div className="text-xl font-black text-slate-800 mt-0.5">{studyQueue.length} từ</div>
                  </div>
                  <div className="p-3 bg-sky-50 rounded-2xl border border-sky-100">
                    <div className="text-[10px] font-bold text-sky-500">XP NHẬN ĐƯỢC</div>
                    <div className="text-xl font-black text-[#0284c7] mt-0.5">+150 XP</div>
                  </div>
                </div>

                <button
                  onClick={startDailySession}
                  className="w-full py-3.5 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-2xl text-xs font-black transition-all cursor-pointer shadow-md shadow-sky-200"
                >
                  Ôn tập tiếp đợt mới →
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: KHO TỪ VỰNG ETS 2023 */}
        {activeTab === 'deck' && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tra cứu từ vựng tiếng Anh hoặc nghĩa tiếng Việt..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="space-y-2.5">
              {filteredWords.map((word) => (
                <div
                  key={word.id}
                  onClick={() => {
                    setSelectedWord(word)
                    setActiveTab('detail')
                  }}
                  className="p-4 bg-white hover:bg-[#f0f9ff] border border-slate-100 hover:border-sky-300 rounded-2xl transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-800">{word.word}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-[#e0f2fe] text-[#0284c7] rounded-md font-bold uppercase">
                        {word.pos}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{word.meaning_vn}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        speak(word.word)
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-[#0284c7] hover:bg-white"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TRANG CHI TIẾT TỪ VỰNG CHUYÊN SÂU */}
        {activeTab === 'detail' && selectedWord && (
          <div className="space-y-4">
            <button
              onClick={() => setActiveTab('deck')}
              className="text-xs font-bold text-[#0284c7] hover:underline flex items-center gap-1"
            >
              ← Quay lại danh sách từ
            </button>

            <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">{selectedWord.word}</h2>
                  <p className="text-sm font-mono text-slate-400 italic mt-0.5">
                    {selectedWord.ipa} • <span className="font-bold text-sky-600">{selectedWord.pos}</span>
                  </p>
                </div>
                <button
                  onClick={() => speak(selectedWord.word)}
                  className="p-2.5 rounded-2xl bg-[#e0f2fe] text-[#0284c7] hover:scale-105 transition-transform"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* Meaning */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl">
                <div className="text-[10px] font-black text-emerald-800 uppercase">Định nghĩa TOEIC</div>
                <div className="text-base font-bold text-emerald-900 mt-0.5">{selectedWord.meaning_vn}</div>
                {selectedWord.definition_en && (
                  <p className="text-xs text-emerald-700 italic mt-1">"{selectedWord.definition_en}"</p>
                )}
              </div>

              {/* Real Context */}
              <div className="space-y-1.5">
                <div className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#0284c7]" />
                  <span>CÂU GỐC TRONG ĐỀ THI ETS 2023 (Test {selectedWord.context.test_number})</span>
                </div>
                <div className="p-3.5 bg-[#f8fafc] border border-slate-200 rounded-2xl text-xs text-slate-700 leading-relaxed font-medium">
                  "{selectedWord.context.sentence_en}"
                </div>
                <div className="text-xs text-slate-500 italic pl-1">{selectedWord.context.sentence_vn}</div>
              </div>

              {/* Word Family */}
              {selectedWord.word_family && selectedWord.word_family.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#0284c7]" />
                    <span>HỌ TỪ VỰNG (WORD FAMILY - Part 5)</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedWord.word_family.map((wf, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 rounded-xl font-medium">
                        <strong className="text-[#0284c7]">{wf.pos}:</strong> {wf.word}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Collocations */}
              {selectedWord.collocations && selectedWord.collocations.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>CỤM TỪ HAY ĐI KÈM (COLLOCATIONS)</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedWord.collocations.map((c, i) => (
                      <span key={i} className="text-xs px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl font-bold">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* 3. BOTTOM NAVIGATION BAR (Mobile-First 1-Hand) */}
      <nav className="fixed sm:absolute bottom-0 left-0 right-0 max-w-lg mx-auto bg-white/95 backdrop-blur-md border-t border-slate-100 px-6 py-2.5 flex items-center justify-around z-30">
        <button
          onClick={() => setActiveTab('study')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
            activeTab === 'study' ? 'text-[#0284c7]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] font-black">Học FSRS</span>
        </button>

        <button
          onClick={() => setActiveTab('deck')}
          className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
            activeTab === 'deck' || activeTab === 'detail' ? 'text-[#0284c7]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-black">Kho từ ETS</span>
        </button>
      </nav>
    </div>
  )
}
