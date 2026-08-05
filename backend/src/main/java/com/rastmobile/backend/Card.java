package com.rastmobile.backend;

public class Card {
    private String id;
    private String title;
    private int order;

    // Kart oluşturulurken benzersiz bir id atanması için constructor
    public Card() {
        this.id = java.util.UUID.randomUUID().toString(); // id yi elle üretiyoruz
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public int getOrder() { return order; }
    public void setOrder(int order) { this.order = order; }
}