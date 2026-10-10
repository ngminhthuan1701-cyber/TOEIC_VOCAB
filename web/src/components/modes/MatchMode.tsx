import { useState, useEffect } from 'react'
import { Word } from '../../types'
import { Timer, Trophy, RotateCcw } from 'lucide-react'

interface MatchModeProps {
  words: Word[]
  onFinish: () => void
}

interface Tile {
  id: string
  wordId: number
  text: string
  type: 'word' | 'meaning'
  isMatched: boolean
}

export const MatchMode: React.FC<MatchModeProps> = ({ words, onFinish }) => {
  const [tiles, setTiles] = useState<Tile[]>([])
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null)
  const [seconds, setSeconds] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false)
  const [personalBest, setPersonalBest] = useState<number | null>(() => {
    const saved = localStorage.getItem('toeic_match_pb')
    return saved ? parseFloat(saved) : null
  })

  // Khởi tạo 6 cặp thẻ ngẫu nhiên (12 tiles)
  const initGame = () => {
    const pool = [...words].sort(() => 0.5 - Math.random()).slice(0, 6)
    const newTiles: Tile[] = []

    pool.forEach(w => {
      newTiles.push({
        id: `w-${w.id}`,
        wordId: w.id,
        text: w.word,
        type: 'word',
        isMatched: false
      })
      newTiles.push({
        id: `m-${w.id}`,
        wordId: w.id,
        text: w.meaning_vn,
        type: 'meaning',
        isMatched: false
      })
    })

    // Trộn ngẫu nhiên
    setTiles(newTiles.sort(() => 0.5 - Math.random()))
    setSelectedTile(null)
    setSeconds(0)
    setIsGameOver(false)
  }

  useEffect(() => {
    initGame()
  }, [])

  // Timer tick
  useEffect(() => {
    if (isGameOver) return
    const interval = setInterval(() => {
      setSeconds(prev => +(prev + 0.1).toFixed(1))
    }, 100)
    return () => clearInterval(interval)
  }, [isGameOver])

  const handleTileClick = (tile: Tile) => {
    if (tile.isMatched || isGameOver) return

    if (!selectedTile) {
      setSelectedTile(tile)
      return
    }

    if (selectedTile.id === tile.id) {
      setSelectedTile(null)
      return
    }

    // Kiểm tra có khớp cặp từ - nghĩa không
    if (selectedTile.wordId === tile.wordId && selectedTile.type !== tile.type) {
      // Khớp thành công!
      setTiles(prev => prev.map(t => t.wordId === tile.wordId ? { ...t, isMatched: true } : t))
      setSelectedTile(null)

      // Kiểm tra hoàn thành tất cả
      const remaining = tiles.filter(t => !t.isMatched && t.wordId !== tile.wordId)
      if (remaining.length === 0) {
        setIsGameOver(true)
        const finalTime = +(seconds + 0.1).toFixed(1)
        if (!personalBest || finalTime < personalBest) {
          setPersonalBest(finalTime)
          localStorage.setItem('toeic_match_pb', finalTime.toString())
        }
      }
    } else {
      // Chọn sai -> reset
      setSelectedTile(tile)
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-[#e2e8f0] p-6 md:p-8 shadow-sm space-y-6 max-w-4xl mx-auto">
      {/* Header with Stopwatch */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="text-[10px] font-bold px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg uppercase">
            Ghép cặp Từ - Nghĩa tính giờ
          </span>
          <h3 className="text-base font-extrabold text-slate-800 mt-1">Chế độ Match Mode (Quizlet Style)</h3>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-4 py-2 bg-[#f0f9ff] text-[#0284c7] rounded-2xl font-mono font-bold text-sm border border-[#bae6fd]">
            <Timer className="w-4 h-4" />
            <span>{seconds.toFixed(1)}s</span>
          </div>
          {personalBest && (
            <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
              <Trophy className="w-3.5 h-3.5" /> Kỷ lục: {personalBest}s
            </div>
          )}
        </div>
      </div>

      {/* Tiles Grid */}
      {!isGameOver ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {tiles.map(tile => {
            const isSelected = selectedTile?.id === tile.id
            if (tile.isMatched) {
              return (
                <div 
                  key={tile.id} 
                  className="h-28 rounded-2xl border border-dashed border-slate-200 bg-slate-50 opacity-20 pointer-events-none"
                />
              )
            }

            return (
              <button
                key={tile.id}
                onClick={() => handleTileClick(tile)}
                className={`h-28 p-3 rounded-2xl border text-center transition-all flex items-center justify-center font-bold text-xs cursor-pointer select-none shadow-sm ${
                  isSelected
                    ? 'bg-[#0284c7] text-white border-[#0284c7] scale-105 shadow-md shadow-sky-200 ring-2 ring-sky-300'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-sky-300 hover:bg-[#f0f9ff]'
                }`}
              >
                {tile.text}
              </button>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center text-3xl mx-auto shadow-md">
            🏆
          </div>
          <h3 className="text-2xl font-black text-slate-800">Tuyệt đỉnh! Hoàn thành trong {seconds} giây!</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Khả năng liên kết từ vựng của bạn rất ấn tượng. Hãy tiếp tục thử thách để phá kỷ lục thời gian!
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={initGame}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-2xl shadow-md cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> Chơi lại ván mới
            </button>
            <button
              onClick={onFinish}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl cursor-pointer"
            >
              Thoát ra
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
