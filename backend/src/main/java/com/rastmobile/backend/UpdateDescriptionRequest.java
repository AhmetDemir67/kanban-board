package com.rastmobile.backend;

// Bir kartın description alanını güncellerken kullanılan istek modeli
public class UpdateDescriptionRequest {
    private String description;

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
