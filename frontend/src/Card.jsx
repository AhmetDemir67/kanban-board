import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function Card({ id, title, isOverlay = false }) {
  // DragOverlay içindeki görsel kopya için: sürükleme özellikleri olmadan sade bir kart göster
  if (isOverlay) {
    return (
      <div className="card">
        <p>{title}</p>
      </div>
    )
  }

  // Kartı hem sürüklenebilir hem de sıralanabilir yapan hook; id ile bu kartı diğerlerinden ayırt eder
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  // Sürükleme sırasında kartın fare ile birlikte hareket etmesi ve akıcı bir animasyon için transform/transition stilini oluşturur
  // Kart sürükleniyorsa, orijinal konumundaki kopyası soluklaştırılır (asıl görünür kopya DragOverlay'dedir)
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? { opacity: 0.3 } : {}),
  }

  return (
    <div className="card" ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <p>{title}</p>
    </div>
  )
}

export default Card
