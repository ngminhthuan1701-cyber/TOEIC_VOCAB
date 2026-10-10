import { Word } from '../types'

export class AnkiCsvUtil {
  /**
   * Xuất danh sách từ vựng thành file CSV chuẩn Anki
   * Cấu trúc cột Anki: Front (Word + IPA), Back (Meaning + Sentence + Mnemonic), Category
   */
  public static exportToCsv(words: Word[], filename = 'ets_2023_anki_deck.csv'): void {
    const headers = ['Front', 'Back', 'Category', 'Test_Source', 'Audio_Word']
    const rows = words.map(w => {
      const front = `"${w.word} <br><span style='color:gray;'>${w.ipa || ''}</span>"`
      const back = `"<b style='font-size:18px;color:#0284c7;'>${w.meaning_vn}</b><br><br><i>${w.sentence_en || ''}</i><br><span style='color:gray;'>${w.sentence_vn || ''}</span><br><br>💡 Mẹo: ${w.mnemonic || ''}"`
      const category = `"${w.category || 'General'}"`
      const source = `"Test ${w.ets_source_test || 1} Part ${w.ets_source_part || 5}"`
      const audioWord = `"${w.word}"`
      return [front, back, category, source, audioWord].join('\t') // Dùng tab-separated chuẩn Anki
    })

    const csvContent = [headers.join('\t'), ...rows].join('\n')
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/tab-separated-values;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
  }

  /**
   * Đọc và phân tích file CSV/TSV tải lên từ máy tính
   */
  public static parseCsv(fileContent: string): Partial<Word>[] {
    const lines = fileContent.split('\n').filter(l => l.trim().length > 0)
    if (lines.length <= 1) return []

    // Bỏ qua dòng header nếu có
    const dataLines = lines[0].toLowerCase().includes('front') || lines[0].toLowerCase().includes('word') 
      ? lines.slice(1) 
      : lines

    return dataLines.map((line, idx) => {
      // Phân tách bằng tab hoặc dấu phẩy
      const delimiter = line.includes('\t') ? '\t' : ','
      const cols = line.split(delimiter).map(c => c.replace(/^["']|["']$/g, '').trim())

      return {
        id: Date.now() + idx,
        word: cols[0] || 'Unknown',
        meaning_vn: cols[1] || 'Chưa có nghĩa',
        category: cols[2] || 'Imported Deck',
        pos: 'từ vựng'
      }
    })
  }
}
