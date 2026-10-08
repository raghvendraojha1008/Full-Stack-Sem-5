package com.example.readapi.service;

import com.example.readapi.dto.PageResponse;
import com.example.readapi.dto.PostDetail;
import com.example.readapi.dto.PostSummary;
import com.example.readapi.dto.TopPost;
import com.example.readapi.entity.Post;
import com.example.readapi.repository.PostRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/** Reads straight from the database. No caching here, so it doubles as the "uncached" baseline. */
@Service
public class PostQueryService {

    private final PostRepository postRepository;

    public PostQueryService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<PostSummary> loadPage(Long authorId, Pageable pageable) {
        Page<Post> page = (authorId == null)
                ? postRepository.findAll(pageable)
                : postRepository.findPageByAuthorId(authorId, pageable);
        return PageResponse.from(page.map(PostSummary::from));
    }

    @Transactional(readOnly = true)
    public PostDetail loadDetail(Long id) {
        Post post = postRepository.findDetailById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post " + id + " not found"));
        return PostDetail.from(post);
    }

    @Transactional(readOnly = true)
    public List<TopPost> loadTop(int limit) {
        return postRepository.findTopPostRows(limit).stream()
                .map(TopPost::fromRow)
                .toList();
    }
}
