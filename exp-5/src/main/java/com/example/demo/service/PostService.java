package com.example.demo.service;

import com.example.demo.dto.PostRequest;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Post;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class PostService {

    private static final Logger log = LoggerFactory.getLogger(PostService.class);

    // Simple in-memory store standing in for a real repository/database
    private final Map<Long, Post> postStore = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(0);

    public Post createPost(PostRequest request) {
        long id = idGenerator.incrementAndGet();
        Post post = new Post(id, request.getContent(), request.getText(), request.getScheduledAt());
        postStore.put(id, post);
        log.info("Created post with ID: {}", id);
        return post;
    }

    public List<Post> getAllPosts() {
        log.info("Fetching all posts, count={}", postStore.size());
        return postStore.values().stream()
                .sorted((a, b) -> Long.compare(a.getId(), b.getId()))
                .collect(Collectors.toList());
    }

    public Post getPostById(Long id) {
        log.info("Fetching post with ID: {}", id);
        Post post = postStore.get(id);
        if (post == null) {
            throw new ResourceNotFoundException("Post not found with id: " + id);
        }
        return post;
    }

    public Post updatePost(Long id, PostRequest request) {
        Post existing = getPostById(id);
        existing.setContent(request.getContent());
        existing.setText(request.getText());
        existing.setScheduledAt(request.getScheduledAt());
        log.info("Updated post with ID: {}", id);
        return existing;
    }

    public void deletePost(Long id) {
        Post existing = getPostById(id);
        postStore.remove(existing.getId());
        log.info("Deleted post with ID: {}", id);
    }

    public Post schedulePost(Long id, PostRequest request) {
        Post existing = getPostById(id);
        existing.setScheduledAt(request.getScheduledAt());
        log.info("Scheduled post with ID: {} at {}", id, request.getScheduledAt());
        return existing;
    }
}
