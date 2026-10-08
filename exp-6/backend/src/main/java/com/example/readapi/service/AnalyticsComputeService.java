package com.example.readapi.service;

import com.example.readapi.dto.AnalyticsDto;
import com.example.readapi.dto.AuthorStat;
import com.example.readapi.repository.AuthorRepository;
import com.example.readapi.repository.CommentRepository;
import com.example.readapi.repository.PostRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

/** Does the real (uncached) work behind the dashboard. */
@Service
public class AnalyticsComputeService {

    private final PostRepository postRepository;
    private final AuthorRepository authorRepository;
    private final CommentRepository commentRepository;

    @Value("${app.analytics.simulated-load-ms:0}")
    private long simulatedLoadMs;

    public AnalyticsComputeService(PostRepository postRepository,
                                   AuthorRepository authorRepository,
                                   CommentRepository commentRepository) {
        this.postRepository = postRepository;
        this.authorRepository = authorRepository;
        this.commentRepository = commentRepository;
    }

    public AnalyticsDto compute() {
        if (simulatedLoadMs > 0) {
            try {
                Thread.sleep(simulatedLoadMs);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }

        long authors = authorRepository.count();
        long posts = postRepository.count();
        long comments = commentRepository.count();
        Long likes = postRepository.sumLikes();
        Long views = postRepository.sumViews();
        Double avgLikes = postRepository.averageLikes();

        List<AuthorStat> topAuthors = postRepository.topAuthors(PageRequest.of(0, 5)).stream()
                .map(s -> new AuthorStat(s.getAuthorId(), s.getAuthorName(),
                        s.getPostCount() == null ? 0 : s.getPostCount(),
                        s.getTotalLikes() == null ? 0 : s.getTotalLikes()))
                .toList();

        return new AnalyticsDto(
                authors,
                posts,
                comments,
                likes == null ? 0 : likes,
                views == null ? 0 : views,
                avgLikes == null ? 0.0 : Math.round(avgLikes * 10.0) / 10.0,
                topAuthors,
                Instant.now());
    }
}
