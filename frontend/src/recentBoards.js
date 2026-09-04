// Son görüntülenen board'ları tarayıcının localStorage'ında saklayan yardımcı fonksiyonlar

const STORAGE_KEY = 'recentBoards'
const MAX_RECENT_BOARDS = 5

// Verilen board'u son görüntülenenler listesinin başına ekler
export function addRecentBoard(id, name) {
  const recentBoards = getRecentBoards()

  // Aynı id zaten listedeyse, tekrar eklenmemesi için önce çıkar
  const filtered = recentBoards.filter((board) => board.id !== id)

  // Yeni board'u başa ekle ve listeyi en fazla 5 elemanla sınırla
  const updated = [{ id, name }, ...filtered].slice(0, MAX_RECENT_BOARDS)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

// Son görüntülenen board'ları localStorage'dan okur, hiç veri yoksa boş dizi döndürür
export function getRecentBoards() {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}
