import { FSRSItemState } from './lib/fsrs'

export interface Word {
  id: number
  word: string
  ipa?: string
  pos?: string
  meaning_vn: string
  category?: string
  frequency?: number // Tần suất xuất hiện trong đề ETS 2023
  example_en?: string
  example_vn?: string
  memoryLevel?: number // 1 -> 5 Leitner level
  
  // Ngữ cảnh gốc ETS 2023
  ets_source_test?: number // 1 -> 10
  ets_source_part?: number // 5, 6, 7
  ets_source_question?: number // 101 -> 200
  sentence_en?: string
  sentence_vn?: string
  
  // Mẹo nhớ & liên tưởng (Memrise)
  mnemonic?: string
  
  // Cấu trúc từ vựng TOEIC
  word_family?: { pos: string; word: string }[]
  collocations?: string[]
  confusing_pairs?: string[]
  paraphrase_pairs?: { question: string; passage: string }[]
  
  folderId?: string
  fsrs?: FSRSItemState // Quản lý vòng đời FSRS
}

export interface WordFolder {
  id: string
  name: string
  icon: string
  color: string
  description?: string
  createdAt: string
}

export interface Question {
  id: number
  test_id: number
  part_number: number
  question_number: number
  passage_text?: string
  passage_image_url?: string
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: string
  explanation?: string
  vocabulary_notes?: {
    word: string
    meaning: string
  }[]
}

export interface UserStats {
  name: string
  targetScore: number
  currentEstimatedScore: number
  streakDays: number
  vocabLearned: number
  vocabMastered: number
  totalVocabGoal: number
  readingAccuracy: number
  readingQuestionsDone: number
  dailyGoalDone: number
  dailyGoalTotal: number
}
