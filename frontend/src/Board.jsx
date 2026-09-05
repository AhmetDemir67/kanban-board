import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { DndContext, DragOverlay } from '@dnd-kit/core'
import List from './List.jsx'
import Card from './Card.jsx'
import { getBoardById, moveCard } from './boardService.js'
import { addRecentBoard } from './recentBoards.js'

function Board({ onBoardLoaded }) {
  const { id } = useParams()
  const [board, setBoard] = useState(null)
  // Şu an sürüklenmekte olan kart; DragOverlay'de gösterilmek üzere tutulur
  const [activeCard, setActiveCard] = useState(null)

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

  // Sürükleme başladığında, sürüklenen kartı tüm listeler arasında arayıp activeCard state'ine kaydeder
  function onDragStart(event) {
    const cardId = event.active.id
    for (const list of board.lists) {
      const found = list.cards.find((card) => card.id === cardId)
      if (found) {
        setActiveCard(found)
        break
      }
    }
  }

  // Kart bir listenin veya başka bir kartın üzerine bırakıldığında backend'e taşıma isteği gönderir ve board'u yeniden yükler
  async function onDragEnd(event) {
    // Kart geçerli bir alana bırakılmadıysa (liste dışına bırakıldıysa) hiçbir şey yapma
    if (!event.over) {
      setActiveCard(null)
      return
    }

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

    // Sürüklenen kartın kendisini bul (title gibi diğer alanları korumak için)
    const movingCard = board.lists.flatMap((list) => list.cards).find((card) => card.id === cardId)

    // Board'u backend'i beklemeden yerel olarak (optimistic) güncelle: kartı eski listeden çıkar, hedef listeye order'a göre sıralı ekle
    const updatedLists = board.lists.map((list) => {
      const cardsWithoutMoving = list.cards.filter((card) => card.id !== cardId)
      if (list.name === targetListName) {
        const updatedCard = { ...movingCard, order: newOrder }
        return {
          ...list,
          cards: [...cardsWithoutMoving, updatedCard].sort((a, b) => a.order - b.order),
        }
      }
      return { ...list, cards: cardsWithoutMoving }
    })
    setBoard({ ...board, lists: updatedLists })

    // Backend'i güncelle; ekran zaten güncel gösterdiği için burada loadBoard() çağırmaya gerek yok
    await moveCard(board.id, cardId, targetListName, newOrder)
    setActiveCard(null)
  }

  return (
    <div className="board">
      <h2>{board.name}</h2>
      <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        {board.lists.map((list) => (
          <List
            key={list.name}
            name={list.name}
            cards={list.cards}
            boardId={board.id}
            onCardAdded={loadBoard}
          />
        ))}
        {/* Sürüklenen kartın fareyle birlikte serbestçe hareket eden görsel kopyası */}
        <DragOverlay>{activeCard ? <Card title={activeCard.title} isOverlay={true} /> : null}</DragOverlay>
      </DndContext>
    </div>
  )
}

export default Board