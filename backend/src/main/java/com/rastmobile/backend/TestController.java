package com.rastmobile.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
public class TestController {

    private final BoardService boardService; //Controller'ın bir BoardService'e ihtiyacı olduğunu söyler

    public TestController(BoardService boardService) {  //CONSTRUCTOR(Dependency injectionun gerçeklşetiği yer)
        this.boardService = boardService;
    }

    // Yeni bir board oluşturma isteği 
    @PostMapping("/test")
    public Board createTest(@RequestBody BoardRequest request) {
    return boardService.createBoard(request.getName());
    }

    // URL'den gelen id değerini yakalayıp geri döndüren basit test endpoint'i
    @GetMapping("/test/{id}")
    public String getTest(@PathVariable String id) {
        return "İstenen test ID'si: " + id;
    }

    // Tüm board kayıtlarını listeleyen endpoint
    @GetMapping("/test/all")
    public List<Board> getAllTests() {
        return boardService.getAllBoards();
    }
    
}