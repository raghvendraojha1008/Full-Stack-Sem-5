package com.example.readapi.dto;

import java.io.Serializable;

public record TopPost(Long id, String title, int likes, int views, String authorName) implements Serializable {

    /** Maps one row of the native query: id, title, likes, views, author name. */
    public static TopPost fromRow(Object[] row) {
        return new TopPost(
                ((Number) row[0]).longValue(),
                (String) row[1],
                ((Number) row[2]).intValue(),
                ((Number) row[3]).intValue(),
                (String) row[4]);
    }
}
