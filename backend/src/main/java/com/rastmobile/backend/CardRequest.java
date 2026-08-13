package com.rastmobile.backend;

import jakarta.validation.constraints.NotBlank;

// Kart oluşturma isteğinde sadece başlık bilgisini taşıyan basit istek modeli
public class CardRequest {

    @NotBlank
    private String title;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}