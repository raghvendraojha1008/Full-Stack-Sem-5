package com.example.readapi.dto;

import com.example.readapi.entity.Comment;

import java.io.Serializable;
import java.time.Instant;

public record CommentDto(Long id, String commenter, String body, Instant createdAt) implements Serializable {

    public static CommentDto from(Comment comment) {
        return new CommentDto(comment.getId(), comment.getCommenter(), comment.getBody(), comment.getCreatedAt());
    }
}
