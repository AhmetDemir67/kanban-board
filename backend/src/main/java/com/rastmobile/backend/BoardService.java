package com.rastmobile.backend;

import org.springframework.stereotype.Service;
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
}