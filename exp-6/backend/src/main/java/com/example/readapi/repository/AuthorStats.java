package com.example.readapi.repository;

/** Interface projection for the "top authors" aggregate query. */
public interface AuthorStats {

    Long getAuthorId();

    String getAuthorName();

    Long getPostCount();

    Long getTotalLikes();
}
