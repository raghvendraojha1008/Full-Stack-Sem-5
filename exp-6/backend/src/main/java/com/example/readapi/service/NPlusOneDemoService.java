package com.example.readapi.service;

import com.example.readapi.dto.NPlusOneResult;
import com.example.readapi.dto.NPlusOneResult.SamplePost;
import com.example.readapi.entity.Post;
import com.example.readapi.repository.PostRepository;
import jakarta.persistence.EntityManagerFactory;
import org.hibernate.SessionFactory;
import org.hibernate.stat.Statistics;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Section 3 - the N+1 query problem, side by side.
 * Both methods read every post with its author and comments; they differ only in how they load them.
 * Statement counts come from Hibernate statistics, which are global, so run one demo at a time.
 */
@Service
public class NPlusOneDemoService {

    private final PostRepository postRepository;
    private final EntityManagerFactory entityManagerFactory;

    public NPlusOneDemoService(PostRepository postRepository, EntityManagerFactory entityManagerFactory) {
        this.postRepository = postRepository;
        this.entityManagerFactory = entityManagerFactory;
    }

    /** 1 query for the posts, then one more per post for its comments and one per new author. */
    @Transactional(readOnly = true)
    public NPlusOneResult runLazy() {
        Statistics stats = statistics();
        stats.clear();
        long start = System.nanoTime();

        List<Post> posts = postRepository.findAll();
        return summarize("Lazy loading (N+1)", posts, stats, start);
    }

    /** A single JOIN FETCH query returns posts, authors and comments together. */
    @Transactional(readOnly = true)
    public NPlusOneResult runJoinFetch() {
        Statistics stats = statistics();
        stats.clear();
        long start = System.nanoTime();

        List<Post> posts = postRepository.findAllWithComments();
        return summarize("JOIN FETCH", posts, stats, start);
    }

    private NPlusOneResult summarize(String strategy, List<Post> posts, Statistics stats, long start) {
        int totalComments = 0;
        List<SamplePost> sample = new ArrayList<>();
        for (Post post : posts) {
            int commentCount = post.getComments().size();      // lazy: triggers a query per post
            String authorName = post.getAuthor().getName();     // lazy: triggers a query per new author
            totalComments += commentCount;
            if (sample.size() < 5) {
                sample.add(new SamplePost(post.getTitle(), authorName, commentCount));
            }
        }
        long durationMs = (System.nanoTime() - start) / 1_000_000;
        return new NPlusOneResult(strategy, posts.size(), totalComments,
                stats.getPrepareStatementCount(), durationMs, sample);
    }

    private Statistics statistics() {
        return entityManagerFactory.unwrap(SessionFactory.class).getStatistics();
    }
}
