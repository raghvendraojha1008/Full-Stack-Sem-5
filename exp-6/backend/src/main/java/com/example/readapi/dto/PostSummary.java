package com.example.readapi.dto;

import com.example.readapi.entity.Post;

import java.io.Serializable;
import java.time.Instant;

/** Light payload for feeds: the excerpt replaces the full text (Section 7 - "Reducing payload size"). */
public record PostSummary(
        Long id,
        String title,
        String excerpt,
        int likes,
        int views,
        Instant createdAt,
        Long authorId,
        String authorName) implements Serializable {

    private static final int EXCERPT_LENGTH = 140;

    public static PostSummary from(Post post) {
        String content = post.getContent();
        String excerpt = content.length() > EXCERPT_LENGTH
                ? content.substring(0, EXCERPT_LENGTH).trim() + "..."
                : content;
        return new PostSummary(
                post.getId(),
                post.getTitle(),
                excerpt,
                post.getLikes(),
                post.getViews(),
                post.getCreatedAt(),
                post.getAuthor().getId(),
                post.getAuthor().getName());
    }
}
