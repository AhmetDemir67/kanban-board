import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { DndContext } from '@dnd-kit/core'
import List from './List.jsx'
import { getBoardById, moveCard } from './boardService.js'
import { addRecentBoard } from './recentBoards.js'

function Board({ onBoardLoaded }) {
  const { id } = useParams()
  const [board, setBoard] = useState(null)

  // Backend'den board verisini çeker; kart eklendikten sonra güncel veriyi almak için de tekrar çağrılır
  async function loadBoard() {
    const data = await getBoardById(id)
    setBoard(data)
    // Bu board'u son görüntülenenler listesine ekler
    addRecentBoard(data.id, data.name)
    // Üst component'e board'un (yeniden) yüklendiğini haber verir, verilmişse
    if (onBoardLoaded) {
      onBoardLoaded()
    }
  }

  // URL'deki id değiştiğinde board'u çeker
  useEffect(() => {
    loadBoard()
  }, [id])

  if (!board) {
    return <p>Yükleniyor...</p>
  }

  // Kart bir listenin veya başka bir kartın üzerine bırakıldığında backend'e taşıma isteği gönderir ve board'u yeniden yükler
  async function onDragEnd(event) {
    // Kart geçerli bir alana bırakılmadıysa (liste dışına bırakıldıysa) hiçbir şey yapma
    if (!event.over) return

    const cardId = event.active.id
    const overId = event.over.id

    // event.over.id bir liste ismiyle eşleşiyorsa, boş bir alana ya da doğrudan listenin üzerine bırakılmıştır
    const overList = board.lists.find((list) => list.name === overId)

    let targetListName
    let newOrder

    if (overList) {
      // Liste ismine bırakıldı: hedef liste budur, kart listenin sonuna eklenir
      targetListName = overList.name
      newOrder = overList.cards.length
    } else {
      // Bir kartın üzerine bırakıldı: o kartın bulunduğu listeyi ve sıradaki index'ini bul
      const targetList = board.lists.find((list) =>
        list.cards.some((card) => card.id === overId)
      )
      targetListName = targetList.name
      newOrder = targetList.cards.findIndex((card) => card.id === overId)
    }

    await moveCard(board.id, cardId, targetListName, newOrder)
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