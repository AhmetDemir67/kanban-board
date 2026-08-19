package com.rastmobile.backend;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/boards")
public class BoardController {

    private final BoardService boardService;

    public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }

    @PostMapping
    public Board createBoard(@Valid @RequestBody BoardRequest request) {
        return boardService.createBoard(request.getName());
    }

    @GetMapping
    public List<Board> getAllBoards() {
    return boardService.getAllBoards();
    }

    @GetMapping("/{id}")
    public Board getBoardById(@PathVariable String id) {
        return boardService.getBoardById(id);
    }

    // Belirtilen board'daki belirtilen listeye yeni bir kart ekler
    @PostMapping("/{boardId}/lists/{listName}/cards")
    public Board addCardToList(@PathVariable String boardId, @PathVariable String listName, @Valid @RequestBody CardRequest request) {
        return boardService.addCardToList(boardId, listName, request.getTitle());
    }

    // Belirtilen board'daki belirtilen listeden, id'si eşleşen kartı siler
    @DeleteMapping("/{boardId}/lists/{listName}/cards/{cardId}")
    public Board deleteCardFromList(@PathVariable String boardId, @PathVariable String listName,
            @PathVariable String cardId) {
        return boardService.deleteCardFromList(boardId, listName, cardId);
    }

    // Bir kartı başka bir listeye taşır veya aynı liste içinde sırasını değiştirir
    @PatchMapping("/{boardId}/cards/{cardId}")
    public Board moveCard(@PathVariable String boardId, @PathVariable String cardId,
            @RequestBody MoveCardRequest request) {
        return boardService.moveCard(boardId, cardId, request.getTargetListName(), request.getNewOrder());
    }
}