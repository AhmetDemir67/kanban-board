package com.rastmobile.backend;

// Kart oluşturma isteğinde sadece başlık bilgisini taşıyan basit istek modeli
public class CardRequest {
    private String title;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
