package com.example.readapi.service;

import com.example.readapi.dto.PageResponse;
import com.example.readapi.dto.PostSummary;
import com.example.readapi.dto.TopPost;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * The cached face of PostQueryService (Section 4 - Caching with Ehcache).
 * First call for a key hits the database, later calls are answered from memory.
 * It is a separate bean on purpose: Spring's cache annotations only work when the call
 * comes from another bean, not from a method of the same class.
 */
@Service
public class CachedPostService {

    private final PostQueryService queryService;
    private final CacheMetrics metrics;

    public CachedPostService(PostQueryService queryService, CacheMetrics metrics) {
        this.queryService = queryService;
        this.metrics = metrics;
    }

    @Cacheable(cacheNames = "posts",
            key = "(#authorId == null ? 'all' : #authorId.toString()) + ':' + #pageable.pageNumber"
                    + " + ':' + #pageable.pageSize + ':' + #pageable.sort.toString()")
    public PageResponse<PostSummary> getPage(Long authorId, Pageable pageable) {
        metrics.recordMiss(CacheMetrics.POSTS);
        return queryService.loadPage(authorId, pageable);
    }

    @Cacheable(cacheNames = "topPosts", key = "#limit")
    public List<TopPost> getTop(int limit) {
        metrics.recordMiss(CacheMetrics.TOP_POSTS);
        return queryService.loadTop(limit);
    }
}
