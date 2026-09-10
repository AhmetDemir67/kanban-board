// Backend'e örnek (seed) veri yükleyen script.
// Çalıştırmak için backend'in http://localhost:8080 üzerinde ayakta olması gerekir:
//   node seed-data.js

const BASE_URL = 'http://localhost:8080'

// Kartlara sırayla dağıtılacak renk paleti
const COLORS = ['#6d5bd0', '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#f1c40f']

// Verilen isimle yeni bir board oluşturur ve dönen board nesnesini döndürür
async function createBoard(name) {
  const res = await fetch(`${BASE_URL}/boards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
  return res.json()
}

// Belirtilen board'daki, adı listName olan listeye verilen başlık, açıklama ve renkle bir kart ekler
async function addCard(boardId, listName, title, description, color) {
  // Kartı ekle; backend güncellenmiş board'u döndürür
  const res = await fetch(
    `${BASE_URL}/boards/${boardId}/lists/${encodeURIComponent(listName)}/cards`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    }
  )
  const board = await res.json()

  // Yeni kart ilgili listenin sonuna eklenir; onu bulup id'sini al
  const targetList = board.lists.find((list) => list.name === listName)
  const newCard = targetList.cards[targetList.cards.length - 1]

  // Kartın açıklamasını ayrı bir PATCH isteğiyle ayarla
  await fetch(`${BASE_URL}/boards/${boardId}/cards/${newCard.id}/description`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description }),
  })

  // Kartın rengini ayrı bir PATCH isteğiyle ayarla
  await fetch(`${BASE_URL}/boards/${boardId}/cards/${newCard.id}/color`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ color }),
  })

  return { title, id: newCard.id, description, color }
}

// Bir board oluşturur ve verilen kart tanımlarını ({ list, title, description, color }) sırayla ekler
async function seedBoard(name, cardDefs) {
  const board = await createBoard(name)
  console.log('Board oluşturuldu:', board.id, '-', board.name)

  // Varsayılan liste isimlerini board cevabından al
  const listNames = board.lists.map((list) => list.name)
  const [backlog, todo, inProgress, done] = listNames
  const listByKey = { backlog, todo, inProgress, done }

  for (const def of cardDefs) {
    console.log(
      await addCard(board.id, listByKey[def.list], def.title, def.description, def.color)
    )
  }
}

async function main() {
  // 1. Board'u oluştur
  const board = await createBoard('Kanban Board Projesi')
  console.log('Board oluşturuldu:', board.id, '-', board.name)

  // Oluşan board'un varsayılan listelerinin isimlerini kaydet
  const listNames = board.lists.map((list) => list.name)
  console.log('Listeler:', listNames.join(', '))

  // İsimlerinin doğru eşleştiğinden emin olmak için varsayılan liste adlarını kullan
  const [backlog, todo, inProgress, done] = listNames

  // 2. Backlog listesine 2 kart (mor, kırmızı)
  console.log(
    await addCard(
      board.id,
      backlog,
      'Kullanıcı girişi ekranı tasarımı',
      'Giriş ve kayıt formlarının wireframe ve mockup tasarımı hazırlanacak. Tasarımların ekip onayından geçmesi gerekiyor.',
      COLORS[0]
    )
  )
  console.log(
    await addCard(
      board.id,
      backlog,
      'Veritabanı şema planlaması',
      'Board, liste ve kart varlıkları için MongoDB koleksiyon yapısı belirlenecek. İlişkiler ve indeksleme stratejisi netleştirilecek.',
      COLORS[1]
    )
  )

  // 3. To Do listesine 2 kart (mavi, yeşil)
  console.log(
    await addCard(
      board.id,
      todo,
      'API dokümantasyonu yazma',
      'Tüm REST endpoint\'leri için istek/yanıt örnekleri içeren dokümantasyon hazırlanacak. Postman koleksiyonu güncel tutulacak.',
      COLORS[2]
    )
  )
  console.log(
    await addCard(
      board.id,
      todo,
      'Birim testlerinin yazılması',
      'Servis katmanındaki iş mantığı için JUnit testleri yazılacak. Hata senaryoları (404, validasyon) da kapsanacak.',
      COLORS[3]
    )
  )

  // 4. In Progress listesine 1 kart (turuncu)
  console.log(
    await addCard(
      board.id,
      inProgress,
      'Kullanıcı arayüzü geliştirme',
      'React ile board görünümü ve sürükle-bırak etkileşimi geliştiriliyor. Kart detay modalı ve renk seçimi üzerinde çalışılıyor.',
      COLORS[4]
    )
  )

  // 5. Done listesine 2 kart (sarı, mor)
  console.log(
    await addCard(
      board.id,
      done,
      'Proje planlaması',
      'Proje kapsamı, teslim tarihleri ve görev dağılımı belirlendi. Kanban panosu üzerinden ilerleme takip edilecek.',
      COLORS[5]
    )
  )
  console.log(
    await addCard(
      board.id,
      done,
      'Teknoloji seçimi',
      'Backend için Spring Boot + MongoDB, frontend için React + Vite seçildi. Sürükle-bırak için dnd-kit kütüphanesi tercih edildi.',
      COLORS[0]
    )
  )

  // 6. İkinci board: Mobil Uygulama Geliştirme (kendi konusuna özel kartlar)
  await seedBoard('Mobil Uygulama Geliştirme', [
    {
      list: 'backlog',
      title: 'Splash ekranı tasarımı',
      description: 'Uygulama açılışında gösterilecek logo animasyonunun hazırlanması.',
      color: '#3498db',
    },
    {
      list: 'backlog',
      title: 'Push notification altyapısı',
      description: 'Firebase Cloud Messaging entegrasyonunun kurulması.',
      color: '#2ecc71',
    },
    {
      list: 'todo',
      title: 'Offline mod desteği',
      description: 'İnternet bağlantısı olmadan temel özelliklerin çalışabilmesi.',
      color: '#f39c12',
    },
    {
      list: 'inProgress',
      title: 'Biyometrik giriş',
      description: 'Parmak izi ve yüz tanıma ile hızlı giriş özelliği.',
      color: '#6d5bd0',
    },
    {
      list: 'done',
      title: 'Uygulama ikonu tasarımı',
      description: 'App Store ve Play Store için ikon setinin hazırlanması.',
      color: '#e74c3c',
    },
  ])

  // 7. Üçüncü board: Website Yenileme Projesi (kendi konusuna özel kartlar)
  await seedBoard('Website Yenileme Projesi', [
    {
      list: 'backlog',
      title: 'Rakip analizi',
      description: 'Benzer sektördeki 5 web sitesinin incelenip rapor hazırlanması.',
      color: '#f1c40f',
    },
    {
      list: 'backlog',
      title: 'SEO anahtar kelime araştırması',
      description: 'Hedef kitlenin arama alışkanlıklarının analiz edilmesi.',
      color: '#f39c12',
    },
    {
      list: 'todo',
      title: "Ana sayfa wireframe'i",
      description: 'Yeni ana sayfanın düşük detaylı taslağının çizilmesi.',
      color: '#3498db',
    },
    {
      list: 'inProgress',
      title: 'Responsive header tasarımı',
      description: 'Mobil ve masaüstü için uyumlu menü yapısının kodlanması.',
      color: '#6d5bd0',
    },
    {
      list: 'done',
      title: 'Hosting altyapısının kurulması',
      description: 'Sunucu ve alan adı ayarlarının tamamlanması.',
      color: '#2ecc71',
    },
  ])

  console.log('Seed verisi başarıyla yüklendi.')
}

main().catch((err) => {
  console.error('Seed sırasında hata oluştu:', err)
  process.exit(1)
})
