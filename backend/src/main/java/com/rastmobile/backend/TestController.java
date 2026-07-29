package com.rastmobile.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    private final BoardService boardService; //Controller'ın bir BoardService'e ihtiyacı olduğunu söyler

    public TestController(BoardService boardService) {  //CONSTRUCTOR(Dependency injectionun gerçeklşetiği yer)
        this.boardService = boardService;
    }

    @PostMapping("/test")
    public String createTest(@RequestBody BoardRequest request) {
        return boardService.createGreeting(request.getName());
    }

    @GetMapping("/test/{id}")
    public String getTest(@PathVariable String id) {
        return "İstenen test ID'si: " + id;
    }
}