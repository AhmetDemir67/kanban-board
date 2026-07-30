package com.rastmobile.backend;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BoardService {

    private final BoardRepository boardRepository; // constructor injection (ama bu sefer Repository)

    public BoardService(BoardRepository boardRepository) {
        this.boardRepository = boardRepository;
    }

    // Yeni bir board oluşturup MongoDB'ye kalıcı olarak kaydeder
    public Board createBoard(String name, String description) {
    Board board = new Board();
    board.setName(name);
    board.setDescription(description);
    return boardRepository.save(board);
    }

    // Veritabanındaki tüm board kayıtlarını getirir
    public List<Board> getAllBoards() {
    return boardRepository.findAll();
    }
}