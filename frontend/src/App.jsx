import { Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './Header.jsx'
import Board from './Board.jsx'

function App() {
  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/boards/:id" element={<Board />} />
      </Routes>
    </div>
  )
}

export default App