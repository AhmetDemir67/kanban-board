package com.rastmobile.backend;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Optional;

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

    // Id ile tek bir board getirir
    public Optional<Board> getBoardById(String id) {
        return boardRepository.findById(id);
    }

    // Belirtilen board'daki, ismi listName olan listeye yeni bir kart ekler ve board'u günceller
    public Board addCardToList(String boardId, String listName, String cardTitle) {
        // 1. Board bulunamazsa 404 döndürecek şekilde exception fırlat
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Board bulunamadı: " + boardId));

        // 2. Board'un listeleri arasında ismi eşleşen TaskList'i bul
        TaskList targetList = board.getLists().stream()
                .filter(list -> list.getName().equals(listName))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Liste bulunamadı: " + listName));

        // 3. Bulunan listeye yeni kartı ekle
        Card card = new Card();
        card.setTitle(cardTitle);
        targetList.getCards().add(card);

        // 4. Güncellenmiş board'u kaydet ve geri döndür
        return boardRepository.save(board);
    }
}