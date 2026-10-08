package com.example.readapi.controller;

import com.example.readapi.dto.AnalyticsDto;
import com.example.readapi.service.AnalyticsComputeService;
import com.example.readapi.service.AnalyticsService;
import com.example.readapi.service.CacheMetrics;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final AnalyticsComputeService computeService;
    private final CacheMetrics metrics;

    public AnalyticsController(AnalyticsService analyticsService,
                               AnalyticsComputeService computeService,
                               CacheMetrics metrics) {
        this.analyticsService = analyticsService;
        this.computeService = computeService;
        this.metrics = metrics;
    }

    /** Dashboard numbers from the cache (computed once, reused until the entry expires). */
    @GetMapping
    public AnalyticsDto getAnalytics(HttpServletResponse response) {
        metrics.recordRequest(CacheMetrics.ANALYTICS);
        AnalyticsDto analytics = analyticsService.getAnalytics();
        metrics.tagResponse(response);
        return analytics;
    }

    /** Recomputed on every call. Baseline for the before/after comparison. */
    @GetMapping("/uncached")
    public AnalyticsDto getAnalyticsUncached(HttpServletResponse response) {
        response.setHeader("X-Cache", "BYPASS");
        return computeService.compute();
    }
}
