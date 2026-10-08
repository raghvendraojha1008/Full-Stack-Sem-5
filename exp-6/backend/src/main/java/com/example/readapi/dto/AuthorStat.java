package com.example.readapi.dto;

import java.io.Serializable;

public record AuthorStat(Long authorId, String authorName, long postCount, long totalLikes) implements Serializable {
}
