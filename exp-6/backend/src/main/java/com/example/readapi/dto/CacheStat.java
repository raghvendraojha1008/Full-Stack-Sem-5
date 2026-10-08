package com.example.readapi.dto;

public record CacheStat(String cache, long requests, long hits, long misses, double hitRatio) {
}
