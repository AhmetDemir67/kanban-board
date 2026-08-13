package com.rastmobile.backend;

import jakarta.validation.constraints.NotBlank;

// Yeni board oluşturma isteğinde sadece isim bilgisini taşıyan istek modeli
public class BoardRequest {

    @NotBlank
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}