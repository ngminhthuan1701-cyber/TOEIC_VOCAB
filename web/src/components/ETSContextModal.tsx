import { Word, Question } from '../types'
import { X, Bookmark, BookmarkCheck, BookOpen, Volume2 } from 'lucide-react'

interface ETSContextModalProps {
  word: Word
  questions: Question[]
  isSaved: boolean
  onToggleSave: (id: number) => void
  onClose: () => void
}

export const ETSContextModal: React.FC<ETSContextModalProps> = ({
  word,
  questions,
  isSaved,
  onToggleSave,
  onClose
}) => {
  // Tìm câu hỏi tương ứng trong kho đề ETS
  const matchedQuestion = questions.find(q => 
    q.test_id === (word.ets_source_test || 1) &&
    q.part_number === (word.ets_source_part || 5) &&
    q.question_number === (word.ets_source_question || 101)
  ) || questions[0]

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.85
      window.speechSynthesis.speak(utterance)
    }
  }

  // Highlight từ khóa trong câu hoặc đoạn văn
  const highlightWord = (text: string, target: string) => {
    if (!text) return null
    const parts = text.split(new RegExp(`(${target})`, 'gi'))
    return parts.map((part, i) => 
      part.toLowerCase() === target.toLowerCase() ? (
        <mark key={i} className="bg-amber-200 text-amber-900 px-1 py-0.5 rounded font-extrabold">
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-800">{word.word}</h3>
                <span className="text-xs font-mono text-slate-400 italic">{word.ipa}</span>
                <span className="text-[10px] px-2 py-0.5 bg-sky-100 text-[#0284c7] rounded-md font-bold uppercase">
                  {word.pos || 'từ vựng'}
                </span>
              </div>
              <p className="text-xs text-emerald-700 font-bold mt-0.5">{word.meaning_vn}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => speak(word.word)}
              className="p-2 rounded-xl text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-colors cursor-pointer"
              title="Phát âm"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleSave(word.id)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isSaved ? 'bg-amber-500 text-white border-amber-600' : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50 border-slate-200'
              }`}
              title={isSaved ? "Bỏ lưu từ" : "Lưu vào sổ tay"}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Nguồn xuất hiện trong đề thi ETS 2023 */}
        <div className="p-4 bg-[#f0f9ff] border border-[#bae6fd] rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#0284c7] text-white flex items-center justify-center font-bold text-[11px]">
              ETS
            </span>
            <span className="font-bold text-sky-900">
              Đề thi ETS 2023 • Test {word.ets_source_test || 1} • Part {word.ets_source_part || 5} • Câu {word.ets_source_question || 101}
            </span>
          </div>
          <span className="px-2.5 py-1 bg-white text-[#0284c7] border border-sky-200 rounded-lg font-bold text-[11px]">
            Tần suất: {word.frequency || 15}+ lần
          </span>
        </div>

        {/* Đoạn văn gốc nếu là Part 6 hoặc Part 7 */}
        {matchedQuestion?.passage_text && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Đoạn văn bài đọc Part 7 chứa từ:</label>
            <div className="p-4 bg-[#f8fafc] border border-slate-200 rounded-2xl font-serif text-xs leading-relaxed text-slate-800 whitespace-pre-line shadow-inner max-h-48 overflow-y-auto">
              {highlightWord(matchedQuestion.passage_text, word.word)}
            </div>
          </div>
        )}

        {/* Câu văn gốc chứa từ trong đề */}
        <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-2xl space-y-2">
          <label className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
            Câu gốc trích xuất từ đề thi:
          </label>
          <p className="text-sm font-bold text-slate-800 leading-relaxed">
            "{highlightWord(word.sentence_en || matchedQuestion?.question_text || '', word.word)}"
          </p>
          {word.sentence_vn && (
            <p className="text-xs text-slate-600 leading-relaxed">
              → {word.sentence_vn}
            </p>
          )}
        </div>

        {/* Collocations & Word Family */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {word.collocations && word.collocations.length > 0 && (
            <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
              <span className="font-bold text-slate-700 block mb-1">Cụm từ đi kèm (Collocations):</span>
              <ul className="space-y-1 text-slate-600">
                {word.collocations.map((c, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="text-[#0284c7]">✦</span> {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {word.mnemonic && (
            <div className="p-3.5 bg-emerald-50/60 border border-emerald-100 rounded-2xl">
              <span className="font-bold text-emerald-800 block mb-1">Mẹo nhớ nhanh (Mnemonic):</span>
              <p className="text-slate-600 leading-relaxed">{word.mnemonic}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  )
}
