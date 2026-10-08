package com.example.readapi.service;

import com.example.readapi.dto.AnalyticsDto;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

/** Cached dashboard numbers - this is the "Caching Analytics Data" example from the experiment. */
@Service
public class AnalyticsService {

    private final AnalyticsComputeService computeService;
    private final CacheMetrics metrics;

    public AnalyticsService(AnalyticsComputeService computeService, CacheMetrics metrics) {
        this.computeService = computeService;
        this.metrics = metrics;
    }

    @Cacheable(cacheNames = "analytics", key = "'dashboard'")
    public AnalyticsDto getAnalytics() {
        metrics.recordMiss(CacheMetrics.ANALYTICS);
        return computeService.compute();
    }
}
