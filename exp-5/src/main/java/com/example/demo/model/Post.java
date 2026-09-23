package com.example.demo.model;

import java.time.LocalDateTime;

public class Post {

    private Long id;
    private String content;
    private String text;
    private LocalDateTime scheduledAt;
    private LocalDateTime createdAt;

    public Post() {
    }

    public Post(Long id, String content, String text, LocalDateTime scheduledAt) {
        this.id = id;
        this.content = content;
        this.text = text;
        this.scheduledAt = scheduledAt;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public LocalDateTime getScheduledAt() {
        return scheduledAt;
    }

    public void setScheduledAt(LocalDateTime scheduledAt) {
        this.scheduledAt = scheduledAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
