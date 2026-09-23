package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.PostRequest;
import com.example.demo.model.Post;
import com.example.demo.service.PostService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    // POST /api/posts - Create a new post
    @PostMapping
    public ResponseEntity<ApiResponse<Post>> createPost(@Valid @RequestBody PostRequest request) {
        Post post = postService.createPost(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Post created", post));
    }

    // GET /api/posts - Retrieve all posts
    @GetMapping
    public ResponseEntity<ApiResponse<List<Post>>> getAllPosts() {
        List<Post> posts = postService.getAllPosts();
        return ResponseEntity.ok(ApiResponse.success("Posts retrieved", posts));
    }

    // GET /api/posts/{id} - Retrieve a single post
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Post>> getPostById(@PathVariable Long id) {
        Post post = postService.getPostById(id);
        return ResponseEntity.ok(ApiResponse.success("Post retrieved", post));
    }

    // PUT /api/posts/{id} - Update an existing post
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Post>> updatePost(@PathVariable Long id,
                                                          @Valid @RequestBody PostRequest request) {
        Post updated = postService.updatePost(id, request);
        return ResponseEntity.ok(ApiResponse.success("Post updated", updated));
    }

    // DELETE /api/posts/{id} - Remove a post
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.ok(ApiResponse.success("Post deleted", null));
    }

    // POST /api/posts/{id}/schedule - Scheduling endpoint (Assignment 1)
    @PostMapping("/{id}/schedule")
    public ResponseEntity<ApiResponse<Post>> schedulePost(@PathVariable Long id,
                                                            @Valid @RequestBody PostRequest request) {
        Post scheduled = postService.schedulePost(id, request);
        return ResponseEntity.ok(ApiResponse.success("Post scheduled", scheduled));
    }
}
