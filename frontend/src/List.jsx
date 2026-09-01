import { useState } from 'react'
import Card from './Card.jsx'
import { addCardToList } from './boardService.js'

function List({ name, cards, boardId, onCardAdded }) {
  const [title, setTitle] = useState('')

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
      <div className="add-card-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Kart başlığı"
        />
        <button onClick={handleAddCard}>Ekle</button>
      </div>
    </div>
  )
}

export default List