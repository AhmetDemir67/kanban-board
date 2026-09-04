import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function Card({ id, title }) {
  // Kartı hem sürüklenebilir hem de sıralanabilir yapan hook; id ile bu kartı diğerlerinden ayırt eder
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  // Sürükleme sırasında kartın fare ile birlikte hareket etmesi ve akıcı bir animasyon için transform/transition stilini oluşturur
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div className="card" ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <p>{title}</p>
    </div>
  )
}

export default Card
