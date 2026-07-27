package com.rastmobile.backend;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
public class TestController {

    @PostMapping("/test")
    public String createTest(@RequestBody BoardRequest request) {
        return "Board ismi: " + request.getName() + ", Açıklama: " + request.getDescription();
    }

    @GetMapping("/test/{id}")
    public String getTest(@PathVariable String id) {
        return "İstenen test ID'si: " + id;
    }

    @GetMapping("/test/{boardId}/cards/{cardId}")
    public String getCard(@PathVariable String boardId, @PathVariable String cardId) {
        return "Board: " + boardId + ", Kart: " + cardId;
    }
}