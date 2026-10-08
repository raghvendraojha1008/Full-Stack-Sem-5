package com.example.readapi.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class InfoController {

    @GetMapping("/")
    public Map<String, Object> info() {
        Map<String, Object> info = new LinkedHashMap<>();
        info.put("service", "Scalable Read API (Experiment 6)");
        info.put("status", "running");
        info.put("frontend", "http://localhost:5173");
        info.put("h2Console", "http://localhost:8080/h2-console  (JDBC URL: jdbc:h2:mem:feeddb, user: sa, empty password)");
        Map<String, String> endpoints = new LinkedHashMap<>();
        endpoints.put("GET /api/posts?page=0&size=10&sort=likes,desc", "paginated + sorted feed (cached)");
        endpoints.put("GET /api/posts/uncached", "same feed without the cache");
        endpoints.put("GET /api/posts/top?limit=5", "top posts by likes (native SQL, cached)");
        endpoints.put("GET /api/posts/{id}", "one post with comments (JOIN FETCH)");
        endpoints.put("POST /api/posts", "create a post (clears the caches)");
        endpoints.put("GET /api/analytics", "dashboard numbers (cached)");
        endpoints.put("GET /api/analytics/uncached", "dashboard numbers, recomputed every time");
        endpoints.put("GET /api/demo/n-plus-one/lazy", "N+1 problem");
        endpoints.put("GET /api/demo/n-plus-one/join-fetch", "N+1 fixed with JOIN FETCH");
        endpoints.put("GET /api/cache/stats", "cache hit/miss counters");
        endpoints.put("DELETE /api/cache", "clear all caches");
        info.put("endpoints", endpoints);
        return info;
    }
}
