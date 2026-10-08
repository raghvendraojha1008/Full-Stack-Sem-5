package com.example.readapi.dto;

import java.util.List;

public record NPlusOneResult(
        String strategy,
        int posts,
        int comments,
        long sqlStatements,
        long durationMs,
        List<SamplePost> sample) {

    public record SamplePost(String title, String authorName, int comments) {
    }
}
