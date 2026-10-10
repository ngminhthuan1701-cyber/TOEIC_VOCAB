import React, { useState } from 'react'
import { Word, WordFolder } from '../types'
import { 
  FolderPlus, 
  Plus, 
  Volume2, 
  Trash2, 
  BookMarked, 
  Brain, 
  Folder, 
  Search, 
  Award,
  Zap,
  X
} from 'lucide-react'

interface NotebookProps {
  words: Word[]
  folders: WordFolder[]
  savedWordIds: number[]
  onRemoveSave: (id: number) => void
  onAddWord: (word: Omit<Word, 'id'>) => void
  onCreateFolder: (folder: WordFolder) => void
  onUpdateMemoryLevel: (wordId: number, level: number) => void
}

export const NotebookView: React.FC<NotebookProps> = ({ 
  words, 
  folders, 
  savedWordIds, 
  onRemoveSave, 
  onAddWord, 
  onCreateFolder,
  onUpdateMemoryLevel 
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddWordModal, setShowAddWordModal] = useState(false)
  const [showAddFolderModal, setShowAddFolderModal] = useState(false)

  // New Word Form State
  const [newWord, setNewWord] = useState('')
  const [newIpa, setNewIpa] = useState('')
  const [newPos, setNewPos] = useState('noun')
  const [newMeaning, setNewMeaning] = useState('')
  const [newExampleEn, setNewExampleEn] = useState('')
  const [newExampleVn, setNewExampleVn] = useState('')
  const [newTargetFolder, setNewTargetFolder] = useState('f-important')

  // New Folder Form State
  const [newFolderName, setNewFolderName] = useState('')
  const [newFolderDesc, setNewFolderDesc] = useState('')
  const [newFolderColor, setNewFolderColor] = useState('#0284c7')

  const savedWords = words.filter(w => savedWordIds.includes(w.id))

  // Filter words
  const filteredWords = savedWords.filter(w => {
    const matchesFolder = selectedFolderId === 'all' || w.folderId === selectedFolderId
    const matchesSearch = w.word.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          w.meaning_vn.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFolder && matchesSearch
  })

  // Memory stats calculation
  const masteredCount = savedWords.filter(w => (w.memoryLevel || 1) >= 4).length
  const learningCount = savedWords.filter(w => (w.memoryLevel || 1) >= 2 && (w.memoryLevel || 1) < 4).length
  const newCount = savedWords.filter(w => (w.memoryLevel || 1) === 1).length
  const avgRetention = savedWords.length > 0
    ? Math.round((savedWords.reduce((acc, curr) => acc + (curr.memoryLevel || 1), 0) / (savedWords.length * 5)) * 100)
    : 0

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.85
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleCreateWordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newWord.trim() || !newMeaning.trim()) return

    onAddWord({
      word: newWord.trim(),
      ipa: newIpa.trim() || '/.../',
      pos: newPos,
      meaning_vn: newMeaning.trim(),
      example_en: newExampleEn.trim(),
      example_vn: newExampleVn.trim(),
      folderId: newTargetFolder,
      memoryLevel: 1,
      category: 'Từ thêm thủ công',
      collocations: []
    })

    // Reset & close
    setNewWord('')
    setNewIpa('')
    setNewMeaning('')
    setNewExampleEn('')
    setNewExampleVn('')
    setShowAddWordModal(false)
  }

  const handleCreateFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFolderName.trim()) return

    const newFolder: WordFolder = {
      id: `f-${Date.now()}`,
      name: newFolderName.trim(),
      description: newFolderDesc.trim(),
      icon: '📁',
      color: newFolderColor,
      createdAt: new Date().toISOString()
    }

    onCreateFolder(newFolder)
    setNewFolderName('')
    setNewFolderDesc('')
    setShowAddFolderModal(false)
  }

  const memoryLevelLabels = [
    { level: 1, label: 'Mới gặp', color: 'bg-rose-100 text-rose-700 border-rose-200' },
    { level: 2, label: 'Mơ hồ', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    { level: 3, label: 'Đang nhớ', color: 'bg-sky-100 text-sky-700 border-sky-200' },
    { level: 4, label: 'Ghi nhớ tốt', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    { level: 5, label: 'Thành thạo 🌟', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  ]

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. TOP HEADER & MEMORY RETENTION METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-3xl border border-[#e2e8f0] shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">TỔNG TỪ ĐÃ LƯU</div>
            <div className="text-2xl font-black text-slate-800 mt-1">{savedWords.length} từ</div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center font-bold">
            <BookMarked className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-3xl border border-[#e2e8f0] shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CHỈ SỐ GHI NHỚ</div>
            <div className="text-2xl font-black text-sky-600 mt-1">{avgRetention}%</div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center font-bold">
            <Brain className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-3xl border border-[#e2e8f0] shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ĐÃ THÀNH THẠO</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">{masteredCount} từ</div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-3xl border border-[#e2e8f0] shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">CẦN ÔN LẠI NGAY</div>
            <div className="text-2xl font-black text-amber-500 mt-1">{newCount + learningCount} từ</div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 2. FOLDERS / BỘ SỔ TAY BAR & ACTION BUTTONS */}
      <div className="bg-white p-5 rounded-3xl border border-[#e2e8f0] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Folders List */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <button
            onClick={() => setSelectedFolderId('all')}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              selectedFolderId === 'all'
                ? 'bg-[#0284c7] text-white shadow-sm'
                : 'bg-[#f8fafc] text-slate-600 hover:bg-[#e0f2fe] hover:text-[#0284c7] border border-slate-100'
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            <span>Tất cả ({savedWords.length})</span>
          </button>

          {folders.map(folder => {
            const count = savedWords.filter(w => w.folderId === folder.id).length
            return (
              <button
                key={folder.id}
                onClick={() => setSelectedFolderId(folder.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  selectedFolderId === folder.id
                    ? 'bg-[#0284c7] text-white shadow-sm'
                    : 'bg-[#f8fafc] text-slate-600 hover:bg-[#e0f2fe] hover:text-[#0284c7] border border-slate-100'
                }`}
              >
                <span>{folder.icon}</span>
                <span>{folder.name}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            )
          })}
        </div>

        {/* Action Buttons: Thêm bộ sổ tay & Thêm từ vựng */}
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <button
            onClick={() => setShowAddFolderModal(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-[#f0f9ff] text-[#0284c7] border border-[#bae6fd] hover:bg-sky-100 rounded-2xl text-xs font-bold transition-all cursor-pointer"
          >
            <FolderPlus className="w-4 h-4" />
            <span>+ Tạo bộ sổ tay</span>
          </button>

          <button
            onClick={() => setShowAddWordModal(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-2xl text-xs font-bold shadow-md shadow-sky-200 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Thêm từ vựng mới</span>
          </button>
        </div>
      </div>

      {/* 3. SEARCH BAR */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm từ vựng trong sổ tay theo từ tiếng Anh, phát âm hoặc nghĩa tiếng Việt..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-[#e2e8f0] rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 shadow-sm transition-all"
        />
      </div>

      {/* 4. WORD LIST WITH MEMORY LEVEL TRACKING */}
      {filteredWords.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-500 space-y-3">
          <BookMarked className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">Chưa có từ vựng nào trong mục này</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Bấm nút <strong>"+ Thêm từ vựng mới"</strong> ở góc trên hoặc lưu các từ bạn gặp khi đang làm đề thi ETS 2023!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredWords.map((word) => {
            const currentLevel = word.memoryLevel || 1
            const activeLevelInfo = memoryLevelLabels.find(l => l.level === currentLevel) || memoryLevelLabels[0]

            return (
              <div 
                key={word.id} 
                className="bg-white p-5 rounded-3xl border border-[#e2e8f0] shadow-sm hover:border-sky-300 transition-all flex flex-col justify-between space-y-4"
              >
                {/* Header: Word & Audio & Delete */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-slate-800">{word.word}</h3>
                      <span className="text-[10px] px-2 py-0.5 bg-[#f0f9ff] text-[#0284c7] rounded-md font-bold uppercase">
                        {word.pos || 'từ vựng'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono italic mt-0.5">
                      {word.ipa || '/.../'}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => speak(word.word)}
                      className="p-2 rounded-xl text-slate-500 hover:text-sky-600 hover:bg-[#f0f9ff] transition-colors cursor-pointer"
                      title="Phát âm"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRemoveSave(word.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Xóa khỏi sổ tay"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Vietnamese Meaning */}
                <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-xs font-bold text-emerald-800">
                  {word.meaning_vn}
                </div>

                {/* Example sentence if exists */}
                {word.example_en && (
                  <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl leading-relaxed">
                    <p className="font-semibold text-slate-800">"{word.example_en}"</p>
                    {word.example_vn && <p className="text-slate-500 mt-1">→ {word.example_vn}</p>}
                  </div>
                )}

                {/* MEMORY RETENTION LEVEL SLIDER / SELECTOR */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Brain className="w-3 h-3 text-sky-500" /> Cấp độ nhớ:
                    </span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${activeLevelInfo.color}`}>
                      {activeLevelInfo.label}
                    </span>
                  </div>

                  {/* 5-Star / 5-Box memory buttons */}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => onUpdateMemoryLevel(word.id, lvl)}
                        className={`w-6 h-6 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                          lvl <= currentLevel
                            ? 'bg-[#0284c7] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                        title={`Đánh giá mức ghi nhớ ${lvl}/5`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 5. MODAL: THÊM TỪ VỰNG MỚI */}
      {showAddWordModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-[#e0f2fe] text-[#0284c7]">
                  <Plus className="w-5 h-5" />
                </span>
                <h3 className="text-lg font-black text-slate-800">Thêm từ vựng vào sổ tay</h3>
              </div>
              <button 
                onClick={() => setShowAddWordModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWordSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Từ tiếng Anh *</label>
                <input
                  type="text"
                  required
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="Ví dụ: lucrative"
                  className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phiên âm IPA</label>
                  <input
                    type="text"
                    value={newIpa}
                    onChange={(e) => setNewIpa(e.target.value)}
                    placeholder="/ˈluː.krə.t̬ɪv/"
                    className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Từ loại</label>
                  <select
                    value={newPos}
                    onChange={(e) => setNewPos(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                  >
                    <option value="noun">Danh từ (n)</option>
                    <option value="verb">Động từ (v)</option>
                    <option value="adjective">Tính từ (adj)</option>
                    <option value="adverb">Trạng từ (adv)</option>
                    <option value="phrase">Cụm từ (phrase)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nghĩa tiếng Việt *</label>
                <input
                  type="text"
                  required
                  value={newMeaning}
                  onChange={(e) => setNewMeaning(e.target.value)}
                  placeholder="Ví dụ: sinh lợi, có lợi nhuận cao"
                  className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Thuộc bộ sổ tay</label>
                <select
                  value={newTargetFolder}
                  onChange={(e) => setNewTargetFolder(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                >
                  {folders.map(f => (
                    <option key={f.id} value={f.id}>{f.icon} {f.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Câu ví dụ tiếng Anh</label>
                <input
                  type="text"
                  value={newExampleEn}
                  onChange={(e) => setNewExampleEn(e.target.value)}
                  placeholder="The company signed a lucrative contract."
                  className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Dịch nghĩa câu ví dụ</label>
                <input
                  type="text"
                  value={newExampleVn}
                  onChange={(e) => setNewExampleVn(e.target.value)}
                  placeholder="Công ty đã ký một hợp đồng béo bở đầy lợi nhuận."
                  className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddWordModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-xl shadow-md shadow-sky-200 cursor-pointer"
                >
                  Lưu từ vựng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL: TẠO BỘ SỔ TAY MỚI */}
      {showAddFolderModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-sky-100 text-[#0284c7]">
                  <FolderPlus className="w-5 h-5" />
                </span>
                <h3 className="text-lg font-black text-slate-800">Tạo bộ sổ tay mới</h3>
              </div>
              <button 
                onClick={() => setShowAddFolderModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFolderSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tên bộ sổ tay *</label>
                <input
                  type="text"
                  required
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Ví dụ: Từ vựng bẫy Part 7, Cụm từ hay gặp..."
                  className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mô tả mục tiêu</label>
                <input
                  type="text"
                  value={newFolderDesc}
                  onChange={(e) => setNewFolderDesc(e.target.value)}
                  placeholder="Mục tiêu nắm vững trước khi thi..."
                  className="w-full px-3.5 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Màu sắc nhận diện</label>
                <div className="flex items-center gap-2">
                  {['#0284c7', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewFolderColor(c)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                        newFolderColor === c ? 'scale-110 border-slate-800' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddFolderModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-xl shadow-md shadow-sky-200 cursor-pointer"
                >
                  Tạo sổ tay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
