package com.rastmobile.backend;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class BoardService {

    private final BoardRepository boardRepository; // constructor injection (ama bu sefer Repository)

    public BoardService(BoardRepository boardRepository) {
        this.boardRepository = boardRepository;
    }

    // Yeni bir board oluşturur, varsayılan listeleri ekler ve MongoDB'ye kalıcı olarak kaydeder
    public Board createBoard(String name) {
        Board board = new Board();
        board.setName(name);
        board.getLists().add(new TaskList("Backlog"));
        board.getLists().add(new TaskList("To Do"));
        board.getLists().add(new TaskList("In Progress"));
        board.getLists().add(new TaskList("Done"));
        return boardRepository.save(board);
    }

    // Veritabanındaki tüm board kayıtlarını getirir
    public List<Board> getAllBoards() {
        return boardRepository.findAll();
    }

    // Id ile tek bir board getirir, bulunamazsa 404 fırlatır
    public Board getBoardById(String id) {
        return boardRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Board bulunamadı: " + id));
    }

    // Belirtilen board'daki, ismi listName olan listeye yeni bir kart ekler ve board'u günceller
    public Board addCardToList(String boardId, String listName, String cardTitle) {
        Board board = getBoardById(boardId);
        TaskList targetList = findListByName(board, listName);

        Card card = new Card();
        card.setTitle(cardTitle);
        // order alanı, listedeki mevcut kart sayısına eşitlenerek kart en sona yerleştirilir
        card.setOrder(targetList.getCards().size());
        targetList.getCards().add(card);

        return boardRepository.save(board);
    }

    // Belirtilen board'daki, ismi listName olan listeden id'si cardId olan kartı siler ve board'u günceller
    public Board deleteCardFromList(String boardId, String listName, String cardId) {
        Board board = getBoardById(boardId);
        TaskList targetList = findListByName(board, listName);
        targetList.getCards().removeIf(card -> card.getId().equals(cardId));
        return boardRepository.save(board);
    }

    // Bir kartı başka bir listeye taşır (veya aynı liste içinde sırasını değiştirir) ve board'u günceller
    public Board moveCard(String boardId, String cardId, String targetListName, int newOrder) {
        Board board = getBoardById(boardId);

        Card movingCard = findCardById(board, cardId);
        // Kartı bulunduğu listeden çıkar; movingCard nesnesi title/description gibi alanlarıyla birlikte korunur
        board.getLists().forEach(list -> list.getCards().remove(movingCard));
        movingCard.setOrder(newOrder);

        TaskList targetList = findListByName(board, targetListName);
        targetList.getCards().add(movingCard);

        return boardRepository.save(board);
    }

    // Belirtilen board'daki, id'si cardId olan kartın description alanını günceller
    public Board updateCardDescription(String boardId, String cardId, String description) {
        Board board = getBoardById(boardId);
        findCardById(board, cardId).setDescription(description);
        return boardRepository.save(board);
    }

    // Belirtilen board'un name alanını günceller
    public Board updateBoardName(String boardId, String newName) {
        Board board = getBoardById(boardId);
        board.setName(newName);
        return boardRepository.save(board);
    }

    // Board'un listeleri arasında ismi eşleşen TaskList'i bulur, bulunamazsa 404 fırlatır
    private TaskList findListByName(Board board, String name) {
        return board.getLists().stream()
                .filter(list -> list.getName().equals(name))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Liste bulunamadı: " + name));
    }

    // Board'un tüm listelerini gezip id'si cardId olan kartı bulur, bulunamazsa 404 fırlatır
    private Card findCardById(Board board, String cardId) {
        return board.getLists().stream()
                .flatMap(list -> list.getCards().stream())
                .filter(card -> card.getId().equals(cardId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Kart bulunamadı: " + cardId));
    }
}
