// Backend'deki /boards endpoint'i ile ilgili istekleri barındıran servis dosyası

export async function getAllBoards() {
  const res = await fetch('http://localhost:8080/boards')
  return res.json()
}

export async function getBoardById(id) {
  const res = await fetch(`http://localhost:8080/boards/${id}`)
  return res.json()
}