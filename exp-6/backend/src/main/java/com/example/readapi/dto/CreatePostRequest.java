package com.example.readapi.dto;

public record CreatePostRequest(String title, String content, Long authorId) {
}
