package com.rastmobile.backend;

import java.util.ArrayList;
import java.util.List;

public class TaskList {
    private String name;
    private List<Card> cards = new ArrayList<>();

    public TaskList() {}

    public TaskList(String name) {
        this.name = name;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public List<Card> getCards() { return cards; }
    public void setCards(List<Card> cards) { this.cards = cards; }
}