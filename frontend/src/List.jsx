import Card from './Card.jsx'

function List({ name, cards }) {
  return (
    <div className="list">
      <h3>{name}</h3>
      {cards.map((card) => (
        <Card key={card.id} title={card.title} />
      ))}
    </div>
  )
}

export default List