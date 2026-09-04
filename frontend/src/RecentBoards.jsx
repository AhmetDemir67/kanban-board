import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getRecentBoards } from './recentBoards.js'

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

  return (
    <div className="recent-boards">
      <h3>Son Gezdiklerim</h3>
      <ul>
        {recentBoards.map((board) => (
          <li key={board.id}>
            <Link to={`/boards/${board.id}`}>{board.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RecentBoards
