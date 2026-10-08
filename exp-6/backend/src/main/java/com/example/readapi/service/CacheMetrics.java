package com.example.readapi.service;

import com.example.readapi.dto.CacheStat;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.LongAdder;

/**
 * Tiny hit/miss counter so the UI can show how well the caches work.
 * A cached method body only runs on a miss, so "requests - misses" = hits.
 */
@Component
public class CacheMetrics {

    public static final String POSTS = "posts";
    public static final String TOP_POSTS = "topPosts";
    public static final String ANALYTICS = "analytics";

    private static final String MISS_ATTRIBUTE = CacheMetrics.class.getName() + ".miss";

    private static final List<String> CACHES = List.of(POSTS, TOP_POSTS, ANALYTICS);

    private final Map<String, LongAdder> requests = new ConcurrentHashMap<>();
    private final Map<String, LongAdder> misses = new ConcurrentHashMap<>();

    public void recordRequest(String cache) {
        requests.computeIfAbsent(cache, k -> new LongAdder()).increment();
    }

    /** Runs only when a cached method body executes, i.e. the value was not in the cache. */
    public void recordMiss(String cache) {
        misses.computeIfAbsent(cache, k -> new LongAdder()).increment();
        RequestAttributes attributes = RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            attributes.setAttribute(MISS_ATTRIBUTE, Boolean.TRUE, RequestAttributes.SCOPE_REQUEST);
        }
    }

    /** Adds X-Cache: HIT or MISS so the browser can show where an answer came from. */
    public void tagResponse(HttpServletResponse response) {
        RequestAttributes attributes = RequestContextHolder.getRequestAttributes();
        boolean miss = attributes != null
                && attributes.getAttribute(MISS_ATTRIBUTE, RequestAttributes.SCOPE_REQUEST) != null;
        response.setHeader("X-Cache", miss ? "MISS" : "HIT");
    }

    public List<CacheStat> snapshot() {
        List<CacheStat> result = new ArrayList<>();
        for (String cache : CACHES) {
            long req = requests.getOrDefault(cache, new LongAdder()).sum();
            long miss = Math.min(req, misses.getOrDefault(cache, new LongAdder()).sum());
            long hits = req - miss;
            double ratio = req == 0 ? 0.0 : (double) hits / req;
            result.add(new CacheStat(cache, req, hits, miss, ratio));
        }
        return result;
    }

    public void reset() {
        requests.clear();
        misses.clear();
    }
}
