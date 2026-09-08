import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './Header.jsx'
import Board from './Board.jsx'
import BoardList from './BoardList.jsx'
import RecentBoards from './RecentBoards.jsx'

function App() {
  // Board her yüklendiğinde arttırılır; RecentBoards'a key olarak verilerek onun yeniden okunması sağlanır
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="app">
      <Header />
      <RecentBoards key={refreshKey} />
      <Routes>
        <Route path="/" element={<BoardList />} />
        <Route
          path="/boards/:id"
          element={<Board onBoardLoaded={() => setRefreshKey((prev) => prev + 1)} />}
        />
      </Routes>
    </div>
  )
}

export default App