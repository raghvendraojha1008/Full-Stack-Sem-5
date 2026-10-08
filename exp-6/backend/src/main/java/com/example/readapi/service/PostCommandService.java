package com.example.readapi.service;

import com.example.readapi.dto.CreatePostRequest;
import com.example.readapi.dto.PostSummary;
import com.example.readapi.entity.Author;
import com.example.readapi.entity.Post;
import com.example.readapi.repository.AuthorRepository;
import com.example.readapi.repository.PostRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;

/** Writes are rare in a read-heavy system, but they must clear the caches so readers never see stale pages. */
@Service
public class PostCommandService {

    private final PostRepository postRepository;
    private final AuthorRepository authorRepository;

    public PostCommandService(PostRepository postRepository, AuthorRepository authorRepository) {
        this.postRepository = postRepository;
        this.authorRepository = authorRepository;
    }

    @Transactional
    @CacheEvict(cacheNames = {"posts", "topPosts", "analytics"}, allEntries = true)
    public PostSummary create(CreatePostRequest request) {
        if (request == null || request.title() == null || request.title().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Title is required");
        }
        if (request.content() == null || request.content().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Content is required");
        }
        if (request.title().length() > 200 || request.content().length() > 2000) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Title can have up to 200 characters and content up to 2000");
        }
        if (request.authorId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose an author");
        }
        Author author = authorRepository.findById(request.authorId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Author not found"));

        Post saved = postRepository.save(
                new Post(request.title().trim(), request.content().trim(), 0, 0, Instant.now(), author));
        return PostSummary.from(saved);
    }
}
