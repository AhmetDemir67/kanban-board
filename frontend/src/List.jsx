import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import Card from './Card.jsx'
import { addCardToList } from './boardService.js'

function List({ name, cards, boardId, onCardAdded }) {
  const [title, setTitle] = useState('')

  // Listeyi bırakma (drop) hedefi yapan hook; id olarak liste adı kullanılır
  const { setNodeRef } = useDroppable({ id: name })

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
    <div className="list" ref={setNodeRef}>
      <h3>{name}</h3>
      {cards.map((card) => (
        <Card key={card.id} id={card.id} title={card.title} />
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