import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { Word, Question, UserStats, WordFolder } from './types'
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
import { ProgressView } from './components/ProgressView'
import { GamificationView } from './components/GamificationView'
import { GamificationState } from './types/gamification'
import { FSRSScheduler, FSRSRating } from './lib/fsrs'

const INITIAL_FOLDERS: WordFolder[] = [
  { id: 'f-important', name: 'Từ vựng cốt lõi ETS', icon: '⭐', color: '#0284c7', createdAt: '2026-10-10' },
  { id: 'f-traps', name: 'Bẫy hay sai Part 5 & 7', icon: '⚠️', color: '#f59e0b', createdAt: '2026-10-10' },
  { id: 'f-business', name: 'Thuật ngữ Hợp đồng & Tài chính', icon: '💼', color: '#10b981', createdAt: '2026-10-10' }
]

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard')
  const [words, setWords] = useState<Word[]>(() => {
    // Assign default folderId and memoryLevel to comprehensive words
    return COMPREHENSIVE_WORDS.map((w, idx) => ({
      ...w,
      folderId: idx < 8 ? 'f-important' : idx < 16 ? 'f-business' : 'f-traps',
      memoryLevel: (idx % 5) + 1
    }))
  })
  const [folders, setFolders] = useState<WordFolder[]>(INITIAL_FOLDERS)
  const [questions, setQuestions] = useState<Question[]>(COMPREHENSIVE_QUESTIONS)
  const [savedWordIds, setSavedWordIds] = useState<number[]>([1, 2, 7, 8, 13, 14, 19, 20]) // 8 words in notebook
  const [userStats, setUserStats] = useState<UserStats>(INITIAL_USER_STATS)

  const [gamification, setGamification] = useState<GamificationState>({
    xp: 1380,
    level: 5,
    streakDays: 5,
    streakFreezeCount: 2,
    lastActiveDate: '2026-10-10',
    dailyCardsReviewed: 16,
    dailyCardsTarget: 20,
    badges: [
      { id: 'b1', title: 'Tập sự ETS', description: 'Hoàn thành 50 từ vựng đầu tiên', icon: '🌱', isUnlocked: true, progress: 100 },
      { id: 'b2', title: 'Chiến binh 7 Ngày', description: 'Duy trì streak 7 ngày liên tục', icon: '🔥', isUnlocked: false, progress: 71 },
      { id: 'b3', title: 'Bậc thầy Part 7', description: 'Thuộc vững 100 từ xuất hiện trong Part 7', icon: '🏆', isUnlocked: false, progress: 45 },
      { id: 'b4', title: 'Siêu phản xạ', description: 'Đạt dưới 15s trong Match Mode', icon: '⚡', isUnlocked: true, progress: 100 },
    ]
  })

  // Fetch words & questions from Supabase if online
  useEffect(() => {
    async function fetchData() {
      try {
        const { data: vocabData, error: vocabErr } = await supabase
          .from('words')
          .select('*')
          .order('id', { ascending: true })

        if (!vocabErr && vocabData && vocabData.length > 0) {
          setWords(vocabData.map((w: any) => ({
            ...w,
            folderId: 'f-important',
            memoryLevel: 2
          })))
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

  // Add new custom word to notebook
  const handleAddWord = (newWordData: Omit<Word, 'id'>) => {
    const newId = Date.now()
    const completeWord: Word = {
      ...newWordData,
      id: newId
    }
    setWords(prev => [completeWord, ...prev])
    setSavedWordIds(prev => [newId, ...prev])

    // Update stats
    setUserStats(prev => ({
      ...prev,
      vocabLearned: prev.vocabLearned + 1
    }))
  }

  // Import danh sách nhiều từ vựng (Excel/CSV)
  const handleAddMultipleWords = (newWordsData: Omit<Word, 'id'>[]) => {
    if (newWordsData.length === 0) return
    const baseId = Date.now()
    const completeWords: Word[] = newWordsData.map((data, idx) => ({
      ...data,
      id: baseId + idx
    }))
    const newIds = completeWords.map(w => w.id)

    setWords(prev => [...completeWords, ...prev])
    setSavedWordIds(prev => [...newIds, ...prev])

    // Update stats
    setUserStats(prev => ({
      ...prev,
      vocabLearned: prev.vocabLearned + completeWords.length
    }))
  }

  // Create new folder
  const handleCreateFolder = (newFolder: WordFolder) => {
    setFolders(prev => [...prev, newFolder])
  }

  // Update memory level (1 to 5)
  const handleUpdateMemoryLevel = (wordId: number, level: number) => {
    setWords(prev => prev.map(w => w.id === wordId ? { ...w, memoryLevel: level } : w))
  }

  // Cập nhật thẻ theo thuật toán FSRS (Again, Hard, Good, Easy)
  const handleUpdateFSRS = (wordId: number, rating: FSRSRating) => {
    setWords(prev => prev.map(w => {
      if (w.id === wordId) {
        const currentFsrs = w.fsrs || FSRSScheduler.createNewCard()
        const updatedFsrs = FSRSScheduler.reviewCard(currentFsrs, rating)
        return {
          ...w,
          fsrs: updatedFsrs
        }
      }
      return w
    }))

    // Tăng nhẹ điểm kinh nghiệm XP & tiến độ
    setUserStats(prev => ({
      ...prev,
      dailyGoalDone: Math.min(prev.dailyGoalTotal, prev.dailyGoalDone + 1)
    }))
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
              questions={questions}
              savedWordIds={savedWordIds} 
              onToggleSave={handleToggleSave} 
              onUpdateFSRS={handleUpdateFSRS}
            />
          )}

          {currentTab === 'reading' && (
            <ReadingSection 
              questions={questions} 
              words={words}
              savedWordIds={savedWordIds}
              onQuickAddWord={handleAddWord}
              onToggleSave={handleToggleSave}
            />
          )}

          {currentTab === 'notebook' && (
            <NotebookView 
              words={words} 
              folders={folders}
              savedWordIds={savedWordIds} 
              onRemoveSave={handleToggleSave} 
              onAddWord={handleAddWord}
              onAddMultipleWords={handleAddMultipleWords}
              onCreateFolder={handleCreateFolder}
              onUpdateMemoryLevel={handleUpdateMemoryLevel}
              onUpdateFSRS={handleUpdateFSRS}
            />
          )}

          {currentTab === 'quiz' && (
            <QuizView 
              words={words} 
            />
          )}

          {currentTab === 'gamification' && (
            <GamificationView 
              gamification={gamification}
              onUseStreakFreeze={() => {
                setGamification(prev => ({
                  ...prev,
                  streakFreezeCount: Math.max(0, prev.streakFreezeCount - 1)
                }))
              }}
              onClaimDailyReward={() => {
                setGamification(prev => ({
                  ...prev,
                  xp: prev.xp + 50,
                  dailyCardsReviewed: prev.dailyCardsTarget
                }))
              }}
            />
          )}

          {currentTab === 'progress' && (
            <ProgressView 
              stats={userStats} 
              words={words} 
              savedWordIds={savedWordIds} 
              onNavigateTab={(tab) => setCurrentTab(tab)} 
            />
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
