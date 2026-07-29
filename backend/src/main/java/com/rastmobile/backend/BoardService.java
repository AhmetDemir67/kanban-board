package com.rastmobile.backend;

import org.springframework.stereotype.Service;

@Service
public class BoardService {

    public String createGreeting(String name) {
        return "Merhaba, " + name.toUpperCase() + "! Board'un başarıyla işlendi.";
    }
}