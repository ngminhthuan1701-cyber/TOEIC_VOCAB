export interface Word {
  id: number
  word: string
  ipa?: string
  pos?: string
  meaning_vn: string
  category?: string
  example_en?: string
  example_vn?: string
  collocations?: string[]
  folderId?: string // Thuộc bộ sổ tay nào
  memoryLevel?: number // 1 -> 5 (Spaced Repetition)
  lastReviewed?: string
  nextReviewDate?: string
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
