package com.rastmobile.backend;

// Bir kartın color alanını güncellerken kullanılan istek modeli
public class UpdateColorRequest {
    private String color;

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
