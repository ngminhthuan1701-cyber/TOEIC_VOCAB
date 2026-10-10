import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { Word, Question } from './types'
import { FALLBACK_WORDS, ETS_2023_TEST1_SAMPLE } from './sampleData'
import { VocabSection } from './components/VocabSection'
import { ReadingSection } from './components/ReadingSection'
import { BookOpen, Sparkles, GraduationCap, Database } from 'lucide-react'

export function App() {
  const [activeTab, setActiveTab] = useState<'vocab' | 'reading'>('vocab')
  const [words, setWords] = useState<Word[]>(FALLBACK_WORDS)
  const [questions, setQuestions] = useState<Question[]>(ETS_2023_TEST1_SAMPLE)
  const [isConnectedSupabase, setIsConnectedSupabase] = useState(false)

  // Tải dữ liệu từ Supabase (nếu bảng đã được khởi tạo, nếu chưa thì dùng fallback ETS 2023)
  useEffect(() => {
    async function fetchData() {
      try {
        const { data: vocabData, error: vocabErr } = await supabase
          .from('words')
          .select('*')
          .order('id', { ascending: true })

        if (!vocabErr && vocabData && vocabData.length > 0) {
          setWords(vocabData)
          setIsConnectedSupabase(true)
        }

        const { data: questionData, error: qErr } = await supabase
          .from('questions')
          .select('*')
          .order('question_number', { ascending: true })

        if (!qErr && questionData && questionData.length > 0) {
          setQuestions(questionData)
        }
      } catch (err) {
        console.log('Supabase tables not yet created, using bundled ETS 2023 data:', err)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                TOEIC MASTER <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">ETS 2023</span>
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">Chuyên sâu Từ vựng & Luyện đọc hiểu</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('vocab')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'vocab'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4" /> Từ vựng trọng tâm
            </button>
            <button
              onClick={() => setActiveTab('reading')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'reading'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" /> Luyện đọc ETS
            </button>
          </nav>

          {/* Database indicator */}
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-medium ${
              isConnectedSupabase 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
            }`}>
              <Database className="w-3.5 h-3.5" />
              {isConnectedSupabase ? 'Supabase Live' : 'Sẵn sàng kết nối Supabase'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        {activeTab === 'vocab' ? (
          <VocabSection words={words} />
        ) : (
          <ReadingSection questions={questions} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>© 2026 TOEIC Master • Thiết kế chuyên biệt ôn luyện đề ETS 2023 • Sẵn sàng triển khai GitHub & Vercel</p>
      </footer>
    </div>
  )
}
export default App
