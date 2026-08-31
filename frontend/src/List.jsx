import { useState } from 'react'
import Card from './Card.jsx'
import { addCardToList } from './boardService.js'

function List({ name, cards, boardId, onCardAdded }) {
  // Yeni kart input'unun değerini tutan state
  const [title, setTitle] = useState('')

  // Backend'e yeni kart ekleme isteği gönderir, input'u temizler ve üst component'e haber verir
  async function handleAddCard() {
    if (!title.trim()) return
    await addCardToList(boardId, name, title)
    setTitle('')
    onCardAdded()
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      handleAddCard()
    }
  }

  return (
    <div className="list">
      <h3>{name}</h3>
      {cards.map((card) => (
        <Card key={card.id} title={card.title} />
      ))}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Kart başlığı"
      />
      <button onClick={handleAddCard}>Ekle</button>
    </div>
  )
}

export default List
