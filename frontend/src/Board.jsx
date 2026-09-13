import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import List from './List.jsx'
import Card from './Card.jsx'
import CardModal from './CardModal.jsx'
import Toast from './Toast.jsx'
import { getBoardById, moveCard, deleteCard, updateBoardName } from './boardService.js'
import { addRecentBoard } from './recentBoards.js'

function Board({ onBoardLoaded }) {
  const { id } = useParams()
  const [board, setBoard] = useState(null)
  // Şu an sürüklenmekte olan kart; DragOverlay'de gösterilmek üzere tutulur
  const [activeCard, setActiveCard] = useState(null)
  // Tıklanarak detayı açılan kart; doluysa CardModal gösterilir
  const [selectedCard, setSelectedCard] = useState(null)
  // Board ismi düzenleme modunda mı; true ise başlık yerine input gösterilir
  const [isEditingName, setIsEditingName] = useState(false)
  // İsim düzenleme input'unun değerini tutan state
  const [nameInput, setNameInput] = useState('')
  // Backend istekleri sırasında oluşan hataları göstermek için kullanılan mesaj
  const [errorMessage, setErrorMessage] = useState(null)
  // Başarı bildirimlerini göstermek için kullanılan toast mesajı
  const [toastMessage, setToastMessage] = useState(null)
  // Toast'ın türü ("success" veya "error"); toastMessage ile birlikte ayarlanır
  const [toastType, setToastType] = useState('success')

  // Fare en az 8 piksel hareket etmeden sürükleme başlamasın; böylece kısa tıklamalar onClick'e ulaşabilir
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  // Backend'den board verisini çeker; kart eklendikten sonra güncel veriyi almak için de tekrar çağrılır
  async function loadBoard() {
    try {
      const data = await getBoardById(id)
      setBoard(data)
      // Bu board'u son görüntülenenler listesine ekler
      addRecentBoard(data.id, data.name)
      // Üst component'e board'un (yeniden) yüklendiğini haber verir, verilmişse
      if (onBoardLoaded) {
        onBoardLoaded()
      }
      setErrorMessage(null)
      return true
    } catch {
      setErrorMessage('Board yüklenirken bir hata oluştu.')
      return false
    }
  }

  // Kart eklendikten sonra board'u yeniden yükler ve başarılıysa toast bildirimi gösterir
  async function handleCardAdded() {
    const success = await loadBoard()
    if (success) {
      setToastMessage('Kart eklendi')
      setToastType('success')
    }
  }

  // Kart açıklaması güncellendikten sonra board'u yeniden yükler ve başarılıysa toast bildirimi gösterir
  async function handleDescriptionUpdated() {
    const success = await loadBoard()
    if (success) {
      setToastMessage('Açıklama güncellendi')
      setToastType('success')
    }
  }

  // URL'deki id değiştiğinde board'u çeker
  useEffect(() => {
    loadBoard()
  }, [id])

  if (!board) {
    return <div className="loading-spinner" />
  }

  // Düzenleme moduna girer ve input'u board'un güncel ismiyle başlatır
  function handleStartEditingName() {
    setNameInput(board.name)
    setIsEditingName(true)
  }

  // Yeni ismi backend'e kaydeder, board'u yeniden yükler ve düzenleme modundan çıkar
  async function handleSaveName() {
    try {
      await updateBoardName(board.id, nameInput)
      const success = await loadBoard()
      setIsEditingName(false)
      if (success) {
        setToastMessage('Board ismi güncellendi')
        setToastType('success')
      }
    } catch {
      setErrorMessage('Board ismi güncellenirken bir hata oluştu.')
    }
  }

  // Bir karta tıklandığında, o kartı tüm listeler arasında arayıp selectedCard state'ine kaydeder (modalı açar)
  function handleCardClick(cardId) {
    const found = board.lists.flatMap((list) => list.cards).find((card) => card.id === cardId)
    setSelectedCard(found)
  }

  // Bir kartın silme butonuna tıklandığında backend'den siler ve board'u yeniden yükler
  async function handleCardDelete(listName, cardId) {
    try {
      await deleteCard(board.id, listName, cardId)
      const success = await loadBoard()
      if (success) {
        setToastMessage('Kart silindi')
        setToastType('warning')
      }
    } catch {
      setErrorMessage('Kart silinirken bir hata oluştu.')
    }
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

    try {
      // Backend'i güncelle; ekran zaten güncel gösterdiği için burada loadBoard() çağırmaya gerek yok
      await moveCard(board.id, cardId, targetListName, newOrder)
    } catch {
      setErrorMessage('Kart taşınırken bir hata oluştu.')
      // Backend'e yazma başarısız oldu; gerçek veriyi tekrar çekerek yerel (optimistic) güncellemeyi düzelt
      loadBoard()
    }
    setActiveCard(null)
  }

  return (
    <div className="board">
      {/* Board ismine tıklanınca düzenleme moduna geçilir */}
      {isEditingName ? (
        <div>
          <input value={nameInput} onChange={(e) => setNameInput(e.target.value)} />
          <button onClick={handleSaveName}>Kaydet</button>
        </div>
      ) : (
        <h2 onClick={handleStartEditingName}>{board.name}</h2>
      )}
      {/* Backend istekleri sırasında bir hata oluştuysa mesajı göster */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        {board.lists.map((list) => (
          <List
            key={list.name}
            name={list.name}
            cards={list.cards}
            boardId={board.id}
            onCardAdded={handleCardAdded}
            onCardClick={handleCardClick}
            onCardDelete={handleCardDelete}
          />
        ))}
        {/* Sürüklenen kartın fareyle birlikte serbestçe hareket eden görsel kopyası */}
        <DragOverlay>{activeCard ? <Card title={activeCard.title} color={activeCard.color} isOverlay={true} /> : null}</DragOverlay>
      </DndContext>
      {/* Bir karta tıklandığında, kartın detayını gösteren ve description düzenlemeye izin veren modal */}
      {selectedCard && (
        <CardModal
          card={selectedCard}
          boardId={board.id}
          onClose={() => setSelectedCard(null)}
          onDescriptionUpdated={handleDescriptionUpdated}
        />
      )}
      {/* Başarı/hata bildirimi; 2 saniye sonra kendiliğinden kaybolur */}
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onExpire={() => setToastMessage(null)} />
      )}
    </div>
  )
}

export default Board