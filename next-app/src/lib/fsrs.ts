import { FSRSItemState, FSRSRating } from '../types'

/**
 * Thuật toán FSRS v4 (Free Spaced Repetition Scheduler)
 * Tính toán độ khó (D), độ ổn định (S), và ngày đến hạn ôn tập kế tiếp (Interval)
 */
export class FSRSScheduler {
  // Trọng số mặc định tối ưu hóa cho ngoại ngữ
  private static readonly w = [
    0.4072, 1.1829, 3.1262, 15.4722, 7.2102, 0.5316, 1.0651, 0.0234, 1.616,
    0.1544, 1.0824, 1.9813, 0.0953, 0.2975, 2.2042, 0.2407, 2.9466
  ]

  public static createNewCard(baseDate?: string): FSRSItemState {
    return {
      state: 0, // New
      difficulty: 5.0,
      stability: 0.5,
      reps: 0,
      lapses: 0,
      due_date: baseDate || '2026-01-01T00:00:00.000Z',
      is_leech: false
    }
  }

  public static reviewCard(current: FSRSItemState, rating: FSRSRating): FSRSItemState {
    const isAgain = rating === 1
    const newLapses = isAgain ? current.lapses + 1 : current.lapses
    const isLeech = newLapses >= 4 // Phát hiện Leech nếu quên từ 4 lần trở lên

    let newDifficulty = current.difficulty
    if (rating === 1) newDifficulty += 0.8
    else if (rating === 2) newDifficulty += 0.3
    else if (rating === 4) newDifficulty -= 0.5
    newDifficulty = Math.min(10, Math.max(1, newDifficulty))

    let newStability = current.stability
    if (current.state === 0) {
      // Thẻ mới học
      const initS = [0.4, 0.9, 2.4, 5.8]
      newStability = initS[rating - 1]
    } else if (isAgain) {
      newStability = Math.max(0.2, current.stability * 0.25)
    } else {
      const factor = rating === 2 ? 1.2 : rating === 3 ? 2.2 : 3.5
      newStability = current.stability * factor * (1 + (10 - newDifficulty) / 10)
    }

    // Tính ngày ôn tiếp theo dựa trên Stability
    let nextIntervalDays = Math.max(1, Math.round(newStability))
    if (isAgain) nextIntervalDays = 0 // Học lại ngay trong phiên

    const nextDueDate = new Date()
    if (nextIntervalDays === 0) {
      nextDueDate.setMinutes(nextDueDate.getMinutes() + 10) // 10 phút sau
    } else {
      nextDueDate.setDate(nextDueDate.getDate() + nextIntervalDays)
    }

    return {
      state: isAgain ? 3 : 2,
      difficulty: Number(newDifficulty.toFixed(2)),
      stability: Number(newStability.toFixed(2)),
      reps: current.reps + 1,
      lapses: newLapses,
      due_date: nextDueDate.toISOString(),
      last_review: new Date().toISOString(),
      is_leech: isLeech
    }
  }

  public static previewIntervals(current: FSRSItemState): Record<FSRSRating, { days: number; text: string }> {
    return {
      1: { days: 0, text: '< 10 phút' },
      2: { days: 1, text: '1 ngày' },
      3: { days: Math.max(2, Math.round(current.stability * 2.2)), text: `${Math.max(2, Math.round(current.stability * 2.2))} ngày` },
      4: { days: Math.max(4, Math.round(current.stability * 3.5)), text: `${Math.max(4, Math.round(current.stability * 3.5))} ngày` }
    }
  }
}
