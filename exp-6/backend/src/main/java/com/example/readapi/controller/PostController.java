package com.example.readapi.controller;

import com.example.readapi.dto.CreatePostRequest;
import com.example.readapi.dto.PageResponse;
import com.example.readapi.dto.PostDetail;
import com.example.readapi.dto.PostSummary;
import com.example.readapi.dto.TopPost;
import com.example.readapi.service.CacheMetrics;
import com.example.readapi.service.CachedPostService;
import com.example.readapi.service.PostCommandService;
import com.example.readapi.service.PostQueryService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    /** Only these fields can be used in ?sort=... (unknown fields would otherwise end in a 500). */
    private static final Set<String> SORTABLE_FIELDS = Set.of("id", "title", "likes", "views", "createdAt");

    private final CachedPostService cachedPostService;
    private final PostQueryService postQueryService;
    private final PostCommandService postCommandService;
    private final CacheMetrics metrics;

    public PostController(CachedPostService cachedPostService,
                          PostQueryService postQueryService,
                          PostCommandService postCommandService,
                          CacheMetrics metrics) {
        this.cachedPostService = cachedPostService;
        this.postQueryService = postQueryService;
        this.postCommandService = postCommandService;
        this.metrics = metrics;
    }

    /** Paginated + sorted feed, served through the cache. Example: /api/posts?page=0&size=10&sort=likes,desc */
    @GetMapping
    public PageResponse<PostSummary> getPosts(
            @RequestParam(required = false) Long authorId,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            HttpServletResponse response) {
        Pageable stable = withTieBreaker(pageable);
        metrics.recordRequest(CacheMetrics.POSTS);
        PageResponse<PostSummary> page = cachedPostService.getPage(authorId, stable);
        metrics.tagResponse(response);
        return page;
    }

    /** Same query, never cached. Used as the baseline when benchmarking. */
    @GetMapping("/uncached")
    public PageResponse<PostSummary> getPostsUncached(
            @RequestParam(required = false) Long authorId,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            HttpServletResponse response) {
        response.setHeader("X-Cache", "BYPASS");
        return postQueryService.loadPage(authorId, withTieBreaker(pageable));
    }

    /** Top posts by likes (native SQL), cached. */
    @GetMapping("/top")
    public List<TopPost> getTopPosts(@RequestParam(defaultValue = "5") int limit, HttpServletResponse response) {
        int safeLimit = Math.max(1, Math.min(limit, 50));
        metrics.recordRequest(CacheMetrics.TOP_POSTS);
        List<TopPost> top = cachedPostService.getTop(safeLimit);
        metrics.tagResponse(response);
        return top;
    }

    /** One post with its author and all comments (a single JOIN FETCH query). */
    @GetMapping("/{id}")
    public PostDetail getPost(@PathVariable Long id) {
        return postQueryService.loadDetail(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PostSummary createPost(@RequestBody CreatePostRequest request) {
        return postCommandService.create(request);
    }

    /**
     * Validates the sort fields and appends "id" as a last sort key.
     * Without it, posts with equal likes could swap places between page 1 and page 2.
     */
    private Pageable withTieBreaker(Pageable pageable) {
        Sort sort = pageable.getSort();
        for (Sort.Order order : sort) {
            if (!SORTABLE_FIELDS.contains(order.getProperty())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Cannot sort by '" + order.getProperty() + "'. Use one of: "
                                + String.join(", ", new java.util.TreeSet<>(SORTABLE_FIELDS)));
            }
        }
        if (sort.getOrderFor("id") == null) {
            sort = sort.and(Sort.by(Sort.Direction.DESC, "id"));
        }
        return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
    }
}
