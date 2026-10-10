/**
 * Thuật toán FSRS v4 (Free Spaced Repetition Scheduler) thu nhỏ chuẩn Anki
 * Cho phép tính toán chính xác chu kỳ ôn tập tiếp theo dựa trên 4 mức đánh giá:
 * 1: Again (Quên)
 * 2: Hard (Khó)
 * 3: Good (Được)
 * 4: Easy (Dễ)
 */

export type FSRSRating = 1 | 2 | 3 | 4 // 1: Again, 2: Hard, 3: Good, 4: Easy

export interface FSRSItemState {
  stability: number   // Độ bền trí nhớ (S) tính theo ngày
  difficulty: number  // Độ khó (D) từ 1 (rất dễ) đến 10 (rất khó)
  reps: number        // Tổng số lần đã ôn tập
  lapses: number      // Số lần bấm Again (Quên)
  state: 'new' | 'learning' | 'review' | 'mastered'
  lastReview?: string
  nextReview: string  // ISO date string
  isLeech: boolean    // Quên từ 4 lần trở lên -> Leech
}

export interface ScheduledInterval {
  rating: FSRSRating
  label: string       // "Quên", "Khó", "Được", "Dễ"
  intervalText: string // "< 10 phút", "1 ngày", "3 ngày", "7 ngày"
  intervalDays: number
  nextDate: string
}

export class FSRSScheduler {

  /**
   * Tạo trạng thái khởi tạo cho một thẻ từ vựng mới
   */
  public static createNewCard(): FSRSItemState {
    return {
      stability: 0,
      difficulty: 5.0,
      reps: 0,
      lapses: 0,
      state: 'new',
      nextReview: new Date().toISOString(),
      isLeech: false
    }
  }

  /**
   * Dự tính khoảng thời gian ôn tập cho cả 4 lựa chọn (hiển thị trực tiếp trên nút bấm)
   */
  public static previewIntervals(card: FSRSItemState): Record<FSRSRating, ScheduledInterval> {
    return {
      1: this.calculateNextState(card, 1, true),
      2: this.calculateNextState(card, 2, true),
      3: this.calculateNextState(card, 3, true),
      4: this.calculateNextState(card, 4, true),
    }
  }

  /**
   * Cập nhật thẻ sau khi người dùng bấm chọn 1 trong 4 mức
   */
  public static reviewCard(card: FSRSItemState, rating: FSRSRating): FSRSItemState {
    const preview = this.calculateNextState(card, rating, false)
    const now = new Date()

    let newDifficulty = card.difficulty
    if (rating === 1) newDifficulty = Math.min(10, card.difficulty + 1.2)
    else if (rating === 2) newDifficulty = Math.min(10, card.difficulty + 0.5)
    else if (rating === 3) newDifficulty = Math.max(1, card.difficulty - 0.2)
    else if (rating === 4) newDifficulty = Math.max(1, card.difficulty - 0.8)

    let newStability = preview.newStability
    const newReps = card.reps + 1
    const newLapses = rating === 1 ? card.lapses + 1 : card.lapses
    const isLeech = newLapses >= 4

    let newState: FSRSItemState['state'] = card.state
    if (rating === 1) {
      newState = 'learning'
    } else if (newStability >= 21) {
      newState = 'mastered'
    } else {
      newState = 'review'
    }

    return {
      stability: Number(newStability.toFixed(2)),
      difficulty: Number(newDifficulty.toFixed(2)),
      reps: newReps,
      lapses: newLapses,
      state: newState,
      lastReview: now.toISOString(),
      nextReview: preview.nextDate,
      isLeech
    }
  }

  private static calculateNextState(
    card: FSRSItemState, 
    rating: FSRSRating, 
    _isPreview: boolean
  ): ScheduledInterval & { newStability: number } {
    const now = new Date()
    let days = 0
    let text = ''
    let label = ''
    let newStability = card.stability

    switch (rating) {
      case 1: // Again
        label = 'Quên'
        days = 0.007 // ~10 phút
        text = '< 10 phút'
        newStability = Math.max(0.4, card.stability * 0.4)
        break

      case 2: // Hard
        label = 'Khó'
        days = Math.max(1, card.stability * 1.2 || 1)
        text = days <= 1 ? '1 ngày' : `${Math.round(days)} ngày`
        newStability = Math.max(1, (card.stability || 1) * 1.2)
        break

      case 3: // Good
        label = 'Được'
        days = Math.max(2.5, (card.stability || 1) * 2.5)
        text = `${Math.round(days)} ngày`
        newStability = Math.max(2.5, (card.stability || 1) * 2.5)
        break

      case 4: // Easy
        label = 'Dễ'
        days = Math.max(5, (card.stability || 1) * 4.0 + 3)
        text = `${Math.round(days)} ngày`
        newStability = Math.max(5, (card.stability || 1) * 4.0 + 3)
        break
    }

    const nextDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString()

    return {
      rating,
      label,
      intervalText: text,
      intervalDays: days,
      nextDate,
      newStability
    }
  }
}
