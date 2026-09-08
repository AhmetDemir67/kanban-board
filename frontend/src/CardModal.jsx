import { useState } from 'react'
import { updateCardDescription } from './boardService.js'

function CardModal({ card, boardId, onClose, onDescriptionUpdated }) {
  // Textarea'daki description değerini tutan state; card.description tanımsızsa boş string kullanılır
  const [description, setDescription] = useState(card.description ?? '')

  // Backend'e güncel description'ı gönderir, ardından üst component'i bilgilendirip modalı kapatır
  async function handleSave() {
    await updateCardDescription(boardId, card.id, description)
    onDescriptionUpdated()
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{card.title}</h2>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        <button onClick={handleSave}>Kaydet</button>
        <button onClick={onClose}>Kapat</button>
      </div>
    </div>
  )
}

export default CardModal
