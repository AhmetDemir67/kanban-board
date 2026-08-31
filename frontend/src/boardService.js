// Backend'deki /boards endpoint'i ile ilgili istekleri barındıran servis dosyası

export async function getAllBoards() {
  const res = await fetch('http://localhost:8080/boards')
  return res.json()
}

export async function getBoardById(id) {
  const res = await fetch(`http://localhost:8080/boards/${id}`)
  return res.json()
}

// Belirtilen board'daki belirtilen listeye, verilen başlıkla yeni bir kart ekler
export async function addCardToList(boardId, listName, title) {
  const res = await fetch(
    `http://localhost:8080/boards/${boardId}/lists/${encodeURIComponent(listName)}/cards`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    }
  )
  return res.json()
}