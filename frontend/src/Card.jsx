import { useDraggable } from '@dnd-kit/core'

function Card({ id, title }) {
  // Kartı sürüklenebilir yapan hook; id ile bu kartı diğerlerinden ayırt eder
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id })

  // Sürükleme sırasında kartın fare ile birlikte hareket etmesi için transform stilini oluşturur
  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined

  return (
    <div className="card" ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <p>{title}</p>
    </div>
  )
}

export default Card
