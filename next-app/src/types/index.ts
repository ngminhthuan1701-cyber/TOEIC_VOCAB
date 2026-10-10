export interface WordContext {
  test_number: number
  part_number: number
  question_number?: number
  sentence_en: string
  sentence_vn: string
  passage_id?: number
}

export interface WordFamilyItem {
  pos: string
  word: string
}

export interface Word {
  id: number
  word: string
  ipa: string
  pos: string
  meaning_vn: string
  definition_en?: string
  frequency_count: number
  toeic_level: number // 450, 650, 800
  topic: string
  distractor_flag?: boolean
  word_family?: WordFamilyItem[]
  collocations?: string[]
  confusing_pairs?: string[]
  context: WordContext
  is_ocr_verified?: boolean
}

export interface FSRSItemState {
  state: number // 0: New, 1: Learning, 2: Review, 3: Relearning
  difficulty: number // 1..10
  stability: number // số ngày
  reps: number
  lapses: number
  due_date: string // ISO date
  last_review?: string
  is_leech?: boolean
}

export type FSRSRating = 1 | 2 | 3 | 4 // 1: Again, 2: Hard, 3: Good, 4: Easy

export interface UserDeck {
  id: string
  name: string
  description: string
  icon: string
  color: string
  wordCount?: number
  masteredCount?: number
}
