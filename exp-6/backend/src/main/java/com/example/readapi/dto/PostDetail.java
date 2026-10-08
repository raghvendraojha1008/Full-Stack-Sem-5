package com.example.readapi.dto;

import com.example.readapi.entity.Comment;
import com.example.readapi.entity.Post;

import java.io.Serializable;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;

public record PostDetail(
        Long id,
        String title,
        String content,
        int likes,
        int views,
        Instant createdAt,
        Long authorId,
        String authorName,
        List<CommentDto> comments) implements Serializable {

    public static PostDetail from(Post post) {
        List<CommentDto> comments = post.getComments().stream()
                .sorted(Comparator.comparing(Comment::getCreatedAt).reversed())
                .map(CommentDto::from)
                .toList();
        return new PostDetail(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getLikes(),
                post.getViews(),
                post.getCreatedAt(),
                post.getAuthor().getId(),
                post.getAuthor().getName(),
                comments);
    }
}
