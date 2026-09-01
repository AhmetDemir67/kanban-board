import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { DndContext } from '@dnd-kit/core'
import List from './List.jsx'
import { getBoardById, moveCard } from './boardService.js'

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

  // Kart bir listenin üzerine bırakıldığında backend'e taşıma isteği gönderir ve board'u yeniden yükler
  async function onDragEnd(event) {
    // Kart geçerli bir alana bırakılmadıysa (liste dışına bırakıldıysa) hiçbir şey yapma
    if (!event.over) return

    const cardId = event.active.id
    const targetListName = event.over.id
    await moveCard(board.id, cardId, targetListName, 0)
    loadBoard()
  }

  return (
    <div className="board">
      <h2>{board.name}</h2>
      <DndContext onDragEnd={onDragEnd}>
        {board.lists.map((list) => (
          <List
            key={list.name}
            name={list.name}
            cards={list.cards}
            boardId={board.id}
            onCardAdded={loadBoard}
          />
        ))}
      </DndContext>
    </div>
  )
}

export default Board