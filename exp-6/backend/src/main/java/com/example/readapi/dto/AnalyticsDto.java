package com.example.readapi.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

/** computedAt stays the same while the value is served from the cache, which makes cache hits easy to see. */
public record AnalyticsDto(
        long totalAuthors,
        long totalPosts,
        long totalComments,
        long totalLikes,
        long totalViews,
        double averageLikesPerPost,
        List<AuthorStat> topAuthors,
        Instant computedAt) implements Serializable {
}
