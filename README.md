# Kanban Board Projesi

Rast Mobile Bilgi Teknolojileri LTD. ŞTİ staj task'ı kapsamında geliştirilen fullstack bir Kanban board uygulamasıdır. Kullanıcılar board oluşturabilir, her board'a özel bir link üzerinden erişebilir, kartlar ekleyip sürükle-bırak ile listeler arasında taşıyabilir, kart detaylarını (açıklama, renk) düzenleyebilir.

## İçindekiler

- [Özellikler](#özellikler)
- [Kullanılan Teknolojiler](#kullanılan-teknolojiler)
- [Gereksinimler](#gereksinimler)
- [Kurulum ve Çalıştırma](#kurulum-ve-çalıştırma)
- [Proje Yapısı](#proje-yapısı)
- [API Dokümantasyonu](#api-dokümantasyonu)
- [Ekran Görüntüleri](#ekran-görüntüleri)

## Özellikler

### Zorunlu Özellikler
- Benzersiz linke sahip, herkese açık board'lar (`/boards/:id`)
- Her board'da sabit 4 liste: **Backlog, To Do, In Progress, Done**
- Kart ekleme ve silme
- Sürükle-bırak ile kartların listeler arasında taşınması
- Aynı liste içinde kart sıralama
- Figma tasarımına uygun, responsive arayüz (mobil ve masaüstü)

### Ekstra Geliştirilen Özellikler
- **Kart detay modalı** — kartlara açıklama ekleme/düzenleme
- **Kart renk seçimi** — 6 renkten birini seçerek kartı özelleştirme
- **Board ismini düzenleme** — başlığa tıklayarak yerinde düzenleme
- **Boş liste mesajları** — kart olmayan listelerde yönlendirici mesaj
- **Yükleniyor animasyonu** ve **hata mesajları** ile kullanıcı geri bildirimi
- **Toast bildirimleri** — başarı/uyarı/hata durumlarında kısa süreli bildirimler
- **Ana sayfa** — tüm board'ları listeleme ve yeni board oluşturma

### Bonus Özellik
- Son gezilen board'ların tarayıcının `localStorage`'ında saklanıp gösterilmesi

## Kullanılan Teknolojiler

**Backend**
- Java 21, Spring Boot
- Spring Data MongoDB
- Spring Validation (`@Valid`, `@NotBlank`)

**Frontend**
- React (Vite ile)
- react-router-dom
- @dnd-kit (sürükle-bırak ve sıralama)

**Veritabanı**
- MongoDB (Docker container olarak çalıştırılır)

## Gereksinimler

Projeyi çalıştırmadan önce bilgisayarınızda şunların kurulu olması gerekir:

- Java 17 veya üzeri
- Node.js (v18 veya üzeri) ve npm
- Docker Desktop

## Kurulum ve Çalıştırma

### 1. Projeyi İndirin

```bash
git clone https://github.com/AhmetDemir67/kanban-board.git
cd kanban-board
```

### 2. Veritabanını Başlatın (MongoDB)

Docker Desktop'ın açık olduğundan emin olun, ardından terminalde:

```bash
docker run -d --name kanban-mongo -p 27017:27017 mongo
```

Container daha önce oluşturulduysa, sadece başlatmanız yeterlidir:

```bash
docker start kanban-mongo
```

### 3. Backend'i Çalıştırın

```bash
cd backend
./mvnw spring-boot:run
```

> Windows kullanıcıları için: `.\mvnw.cmd spring-boot:run`

Backend başarıyla başladığında `http://localhost:8080` adresinde çalışır.

### 4. Frontend'i Çalıştırın

**Yeni bir terminal penceresinde:**

```bash
cd frontend
npm install
npm run dev
```

Frontend `http://localhost:5173` adresinde çalışmaya başlar.

### 5. Uygulamayı Kullanın

Tarayıcıda `http://localhost:5173` adresine gidin. Ana sayfadan yeni bir board oluşturabilir veya mevcut board'ları görüntüleyebilirsiniz.

## Proje Yapısı

```
kanban-project/
├── backend/            → Spring Boot API (Java)
│   └── src/main/java/com/rastmobile/backend/
│       ├── Board.java, TaskList.java, Card.java      (modeller)
│       ├── BoardRepository.java                       (veritabanı erişimi)
│       ├── BoardService.java                          (iş mantığı)
│       ├── BoardController.java                       (API endpointleri)
│       └── GlobalExceptionHandler.java                (hata yönetimi)
├── frontend/            → React uygulaması (Vite)
│   └── src/
│       ├── Board.jsx, List.jsx, Card.jsx, CardModal.jsx
│       ├── BoardList.jsx, Header.jsx, RecentBoards.jsx, Toast.jsx
│       └── boardService.js, recentBoards.js
└── postman/             → API test koleksiyonu (Postman)
```

## API Dokümantasyonu

Projenin tüm API endpointlerini içeren Postman koleksiyonu `postman/` klasöründe bulunmaktadır. Postman'e import ederek (`File > Import`) tüm istekleri deneyebilirsiniz.

**Temel endpointler:**

| Metod | Endpoint | Açıklama |
|---|---|---|
| GET | `/boards` | Tüm board'ları listeler |
| POST | `/boards` | Yeni board oluşturur |
| GET | `/boards/{id}` | Belirli bir board'u getirir |
| PATCH | `/boards/{id}` | Board ismini günceller |
| POST | `/boards/{boardId}/lists/{listName}/cards` | Listeye yeni kart ekler |
| DELETE | `/boards/{boardId}/lists/{listName}/cards/{cardId}` | Kartı siler |
| PATCH | `/boards/{boardId}/cards/{cardId}` | Kartı taşır/sıralar |
| PATCH | `/boards/{boardId}/cards/{cardId}/description` | Kart açıklamasını günceller |
| PATCH | `/boards/{boardId}/cards/{cardId}/color` | Kart rengini günceller |

## Ekran Görüntüleri

_(Ekran görüntüleri buraya eklenecek.)_

## Geliştirici Notu

Bu proje, Rast Mobile'ın belirttiği teknoloji seçenekleri (Node.js/Express, Angular/Vue/React) yerine, şirketten alınan onayla Java Spring Boot ve React kullanılarak geliştirilmiştir.
