package com.rastmobile.backend;

import java.util.UUID;

public class Card {
    private String id;
    private String title;
    private int order;
    private String description;
    private String color;

    // Kart oluşturulurken benzersiz bir id atanması için constructor
    public Card() {
        this.id = UUID.randomUUID().toString();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public int getOrder() { return order; }
    public void setOrder(int order) { this.order = order; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
}