import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import List from './List.jsx'
import { getBoardById } from './boardService.js'

function Board() {
  const { id } = useParams()
  const [board, setBoard] = useState(null)

  // Backend'den board verisini çeker; kart eklendikten sonra güncel veriyi almak için de tekrar çağrılır
  async function loadBoard() {
    const data = await getBoardById(id)
    setBoard(data)
  }

  // URL'deki id değiştiğinde board'u çeker
  useEffect(() => {
    loadBoard()
  }, [id])

  if (!board) {
    return <p>Yükleniyor...</p>
  }

  return (
    <div className="board">
      <h2>{board.name}</h2>
      {board.lists.map((list) => (
        <List
          key={list.name}
          name={list.name}
          cards={list.cards}
          boardId={board.id}
          onCardAdded={loadBoard}
        />
      ))}
    </div>
  )
}

export default Board