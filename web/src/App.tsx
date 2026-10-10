import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { Word, Question, UserStats } from './types'
import { 
  COMPREHENSIVE_WORDS, 
  COMPREHENSIVE_QUESTIONS, 
  INITIAL_USER_STATS 
} from './sampleData'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { DashboardView } from './components/DashboardView'
import { VocabSection } from './components/VocabSection'
import { ReadingSection } from './components/ReadingSection'
import { NotebookView } from './components/NotebookView'
import { QuizView } from './components/QuizView'

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard')
  const [words, setWords] = useState<Word[]>(COMPREHENSIVE_WORDS)
  const [questions, setQuestions] = useState<Question[]>(COMPREHENSIVE_QUESTIONS)
  const [savedWordIds, setSavedWordIds] = useState<number[]>([1, 7, 13]) // Default 3 bookmarked words
  const [userStats] = useState<UserStats>(INITIAL_USER_STATS)

  // Fetch words & questions from Supabase if online
  useEffect(() => {
    async function fetchData() {
      try {
        const { data: vocabData, error: vocabErr } = await supabase
          .from('words')
          .select('*')
          .order('id', { ascending: true })

        if (!vocabErr && vocabData && vocabData.length > 0) {
          setWords(vocabData)
        }

        const { data: qData, error: qErr } = await supabase
          .from('questions')
          .select('*')
          .order('question_number', { ascending: true })

        if (!qErr && qData && qData.length > 0) {
          setQuestions(qData)
        }
      } catch (err) {
        console.log('Using local ETS 2023 curated data:', err)
      }
    }
    fetchData()
  }, [])

  // Toggle bookmark word
  const handleToggleSave = (wordId: number) => {
    setSavedWordIds(prev => 
      prev.includes(wordId) 
        ? prev.filter(id => id !== wordId) 
        : [...prev, wordId]
    )
  }

  return (
    <div className="min-h-screen bg-[#f4f9fd] flex text-slate-800 font-sans antialiased selection:bg-sky-500 selection:text-white">
      {/* 1. Left Sidebar (Pastel Blue UI Theme) */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        savedCount={savedWordIds.length} 
      />

      {/* 2. Main Body Container */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {/* Top Header */}
          <Header userName={userStats.name} />

          {/* Tab Views */}
          {currentTab === 'dashboard' && (
            <DashboardView 
              stats={userStats} 
              onNavigate={(tab) => setCurrentTab(tab)} 
            />
          )}

          {currentTab === 'vocab' && (
            <VocabSection 
              words={words} 
              savedWordIds={savedWordIds} 
              onToggleSave={handleToggleSave} 
            />
          )}

          {currentTab === 'reading' && (
            <ReadingSection 
              questions={questions} 
            />
          )}

          {currentTab === 'notebook' && (
            <NotebookView 
              words={words} 
              savedWordIds={savedWordIds} 
              onRemoveSave={handleToggleSave} 
              onNavigateVocab={() => setCurrentTab('vocab')} 
            />
          )}

          {currentTab === 'quiz' && (
            <QuizView 
              words={words} 
            />
          )}

          {currentTab === 'progress' && (
            <div className="bg-white p-8 rounded-3xl border border-[#e2e8f0] shadow-sm text-center max-w-2xl mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#e0f2fe] text-[#0284c7] text-2xl flex items-center justify-center mx-auto">
                📈
              </div>
              <h3 className="text-xl font-black text-slate-800">Báo cáo tiến độ chi tiết</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Hệ thống đang đồng bộ kết quả làm bài của bạn với Supabase. Bạn đã học {userStats.vocabLearned} từ vựng và hoàn thành {userStats.readingQuestionsDone} câu đọc hiểu ETS 2023!
              </p>
              <button 
                onClick={() => setCurrentTab('dashboard')}
                className="px-6 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-2xl shadow-sm cursor-pointer"
              >
                Quay lại Tổng quan
              </button>
            </div>
          )}

          {currentTab === 'ai-coach' && (
            <div className="bg-white p-8 rounded-3xl border border-[#e2e8f0] shadow-sm text-center max-w-2xl mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0284c7] to-[#38bdf8] text-white text-2xl flex items-center justify-center mx-auto shadow-md shadow-sky-200">
                ✨
              </div>
              <h3 className="text-xl font-black text-slate-800">TOEIC AI Coach 2026</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Huấn luyện viên AI phân tích bạn hay bị bẫy ở câu hỏi từ loại (noun/adj) hay liên từ (conjunctions). Hãy tiếp tục làm bài ở mục "Luyện đề ETS 2023" để AI chẩn đoán chính xác hơn!
              </p>
              <button 
                onClick={() => setCurrentTab('reading')}
                className="px-6 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-2xl shadow-sm cursor-pointer"
              >
                Vào luyện đề ngay
              </button>
            </div>
          )}

          {currentTab === 'materials' && (
            <div className="bg-white p-8 rounded-3xl border border-[#e2e8f0] shadow-sm text-center max-w-2xl mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 text-2xl flex items-center justify-center mx-auto">
                📁
              </div>
              <h3 className="text-xl font-black text-slate-800">Kho tài liệu ETS 2023</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Trọn bộ 10 Test ETS 2023 (PDF Reading & Listening, Audio MP3, Đáp án và Transcript) đã được tích hợp sẵn trong cấu trúc hệ thống của bạn.
              </p>
            </div>
          )}

          {currentTab === 'settings' && (
            <div className="bg-white p-8 rounded-3xl border border-[#e2e8f0] shadow-sm text-center max-w-2xl mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-700 text-2xl flex items-center justify-center mx-auto">
                ⚙️
              </div>
              <h3 className="text-xl font-black text-slate-800">Cài đặt hệ thống</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Supabase URL: <code className="bg-slate-100 px-2 py-0.5 rounded text-sky-700">dqbhginmdwkvckyyzlkv.supabase.co</code><br/>
                Chế độ giao diện: <span className="font-bold text-sky-600">Pastel Blue System OS</span>
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
export default App
