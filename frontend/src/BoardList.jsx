import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAllBoards, createBoard } from './boardService.js'

function BoardList() {
  const [boards, setBoards] = useState([])
  // Yeni board oluşturma input'unun değerini tutan state
  const [newBoardName, setNewBoardName] = useState('')
  const navigate = useNavigate()

  // Component açıldığında tüm board'ları backend'den çekip state'e koyar
  useEffect(() => {
    getAllBoards().then(setBoards)
  }, [])

  // Yeni board'u backend'de oluşturur ve oluşan board'un sayfasına yönlendirir
  async function handleCreateBoard() {
    if (!newBoardName.trim()) return
    const board = await createBoard(newBoardName)
    setNewBoardName('')
    navigate(`/boards/${board.id}`)
  }

  return (
    <div className="board-list">
      {/* Yeni board oluşturma formu; add-card-form ile aynı görünümü paylaşır */}
      <div className="new-board-form">
        <input
          type="text"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          placeholder="Board adı"
        />
        <button onClick={handleCreateBoard}>Board Oluştur</button>
      </div>
      {boards.map((board) => (
        <Link key={board.id} to={`/boards/${board.id}`} className="board-list-item">
          {board.name}
        </Link>
      ))}
    </div>
  )
}

export default BoardList
