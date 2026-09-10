import { useState } from 'react'
import { updateCardDescription, updateCardColor } from './boardService.js'

// Kartlara atanabilecek sabit renk paleti
const COLOR_PALETTE = ['#6d5bd0', '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#f1c40f']

function CardModal({ card, boardId, onClose, onDescriptionUpdated }) {
  // Textarea'daki description değerini tutan state; card.description tanımsızsa boş string kullanılır
  const [description, setDescription] = useState(card.description ?? '')

  // Backend'e güncel description'ı gönderir, ardından üst component'i bilgilendirip modalı kapatır
  async function handleSave() {
    await updateCardDescription(boardId, card.id, description)
    onDescriptionUpdated()
    onClose()
  }

  // Seçilen rengi backend'e gönderir ve board'u yeniler; modal açık kalır
  async function handleColorSelect(color) {
    await updateCardColor(boardId, card.id, color)
    onDescriptionUpdated()
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{card.title}</h2>

        {/* Renk paleti: her renk kendi arka planıyla küçük bir daire olarak gösterilir */}
        <div className="color-swatches">
          {COLOR_PALETTE.map((color) => (
            <button
              key={color}
              className="color-swatch"
              style={{ backgroundColor: color }}
              onClick={() => handleColorSelect(color)}
            />
          ))}
        </div>

        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        <button onClick={handleSave}>Kaydet</button>
        <button onClick={onClose}>Kapat</button>
      </div>
    </div>
  )
}

export default CardModal
