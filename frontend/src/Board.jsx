import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import List from './List.jsx'
import { getBoardById } from './boardService.js'

function Board() {
  const { id } = useParams()
  const [board, setBoard] = useState(null)

  // URL'deki id değiştiğinde backend'den o board'u çeker
  useEffect(() => {
    async function loadBoard() {
      const data = await getBoardById(id)
      setBoard(data)
    }
    loadBoard()
  }, [id])

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