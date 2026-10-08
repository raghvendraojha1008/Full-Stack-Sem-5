package com.example.readapi.controller;

import com.example.readapi.dto.CacheStat;
import com.example.readapi.service.CacheMetrics;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cache")
public class CacheController {

    private final CacheManager cacheManager;
    private final CacheMetrics metrics;

    public CacheController(CacheManager cacheManager, CacheMetrics metrics) {
        this.cacheManager = cacheManager;
        this.metrics = metrics;
    }

    @GetMapping("/stats")
    public List<CacheStat> stats() {
        return metrics.snapshot();
    }

    /** Empties every cache and resets the counters, so a benchmark can start from a cold cache. */
    @DeleteMapping
    public ResponseEntity<Void> clear() {
        for (String name : cacheManager.getCacheNames()) {
            Cache cache = cacheManager.getCache(name);
            if (cache != null) {
                cache.clear();
            }
        }
        metrics.reset();
        return ResponseEntity.noContent().build();
    }
}
