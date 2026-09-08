package com.rastmobile.backend;

// Bir kartı taşırken hedef liste ve yeni sıra bilgisini taşıyan istek modeli
public class MoveCardRequest {
    private String targetListName;
    private int newOrder;

    public String getTargetListName() {
        return targetListName;
    }

    public void setTargetListName(String targetListName) {
        this.targetListName = targetListName;
    }

    public int getNewOrder() {
        return newOrder;
    }

    public void setNewOrder(int newOrder) {
        this.newOrder = newOrder;
    }
}
