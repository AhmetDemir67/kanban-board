import { useState, useEffect } from 'react'
import List from './List.jsx'

function Board() {
  const [board, setBoard] = useState(null)

  // Component açıldığında backend'den tüm board'ları çekip ilk board'u state'e kaydeder
  useEffect(() => {
    fetch('http://localhost:8080/boards')
      .then((res) => res.json())
      .then((boards) => {
        if (boards.length > 0) {
          setBoard(boards[0])
        }
      })
  }, [])

  // Board verisi henüz gelmediyse yükleniyor mesajı göster
  if (!board) {
    return <p>Yükleniyor...</p>
  }

  return (
    <div className="board">
      <h2>{board.name}</h2>
      {board.lists.map((list) => (
        <List key={list.name} name={list.name} cards={list.cards} />
      ))}
    </div>
  )
}

export default Board
