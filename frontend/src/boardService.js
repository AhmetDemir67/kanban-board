  // Backend'deki /boards endpoint'i ile ilgili istekleri barındıran servis dosyası

  export async function getAllBoards() {
    const res = await fetch('http://localhost:8080/boards')
    return res.json()
  }

  export async function getBoardById(id) {
    const res = await fetch(`http://localhost:8080/boards/${id}`)
    return res.json()
  }

  // Verilen isimle yeni bir board oluşturur
  export async function createBoard(name) {
    const res = await fetch('http://localhost:8080/boards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
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

  // Bir kartı belirtilen listeye taşır (yeni sırası şimdilik sabit olarak backend'e gönderilir)
  export async function moveCard(boardId, cardId, targetListName, newOrder) {
    const res = await fetch(`http://localhost:8080/boards/${boardId}/cards/${cardId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetListName, newOrder }),
    })
    return res.json()
  }

  // Bir kartın description alanını günceller
  export async function updateCardDescription(boardId, cardId, description) {
    const res = await fetch(`http://localhost:8080/boards/${boardId}/cards/${cardId}/description`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description }),
    })
    return res.json()
  }

  // Belirtilen listedeki bir kartı siler
  export async function deleteCard(boardId, listName, cardId) {
    const res = await fetch(
      `http://localhost:8080/boards/${boardId}/lists/${encodeURIComponent(listName)}/cards/${cardId}`,
      { method: 'DELETE' }
    )
    return res.json()
  }

  // Board'un ismini günceller
  export async function updateBoardName(boardId, name) {
    const res = await fetch(`http://localhost:8080/boards/${boardId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    return res.json()
  }