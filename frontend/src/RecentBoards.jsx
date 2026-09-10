import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getRecentBoards, clearRecentBoards } from './recentBoards.js'

function RecentBoards() {
  const [recentBoards, setRecentBoards] = useState([])

  // Component açıldığında son görüntülenen board'ları localStorage'dan okuyup state'e koyar
  useEffect(() => {
    setRecentBoards(getRecentBoards())
  }, [])

  // Hiç son gezilen board yoksa hiçbir şey gösterme
  if (recentBoards.length === 0) {
    return null
  }

  // Geçmişi localStorage'dan siler ve ekrandaki listeyi anında boşaltır
  function handleClear() {
    clearRecentBoards()
    setRecentBoards([])
  }

  return (
    <div className="recent-boards">
      <h3>Son Gezdiklerim</h3>
      {/* Her board, pill görünümlü bir link (chip) olarak yatay dizilir */}
      <div className="recent-boards-list">
        {recentBoards.map((board) => (
          <Link key={board.id} to={`/boards/${board.id}`} className="recent-board-chip">
            {board.name}
          </Link>
        ))}
      </div>
      {/* Geçmişi tamamen temizleyen küçük buton */}
      <button className="clear-recent-button" onClick={handleClear}>
        Geçmişi Temizle
      </button>
    </div>
  )
}

export default RecentBoards
