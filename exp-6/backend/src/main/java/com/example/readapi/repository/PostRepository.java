package com.example.readapi.repository;

import com.example.readapi.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {

    // ---- 1. Pagination and sorting (Pageable) -------------------------------------------

    /** Same as the experiment's findAll(pageable), but loads the author in the same query. */
    @Override
    @EntityGraph(attributePaths = "author")
    Page<Post> findAll(Pageable pageable);

    // ---- 2. JPQL ---------------------------------------------------------------------------

    @Query(value = "SELECT p FROM Post p JOIN FETCH p.author WHERE p.author.id = :authorId",
            countQuery = "SELECT COUNT(p) FROM Post p WHERE p.author.id = :authorId")
    Page<Post> findPageByAuthorId(@Param("authorId") Long authorId, Pageable pageable);

    // ---- 3. N+1 fix: JOIN FETCH ------------------------------------------------------------

    /** One SQL statement for posts + authors + comments. */
    @Query("SELECT DISTINCT p FROM Post p JOIN FETCH p.author LEFT JOIN FETCH p.comments")
    List<Post> findAllWithComments();

    @Query("SELECT p FROM Post p JOIN FETCH p.author LEFT JOIN FETCH p.comments WHERE p.id = :id")
    Optional<Post> findDetailById(@Param("id") Long id);

    // ---- 5. Native SQL ---------------------------------------------------------------------

    /**
     * Native query: top posts by likes, with the author name joined in a single statement.
     * Columns: id, title, likes, views, author name.
     */
    @Query(value = "SELECT p.id, p.title, p.likes, p.views, a.name "
            + "FROM posts p JOIN authors a ON a.id = p.author_id "
            + "ORDER BY p.likes DESC, p.id ASC LIMIT :limit",
            nativeQuery = true)
    List<Object[]> findTopPostRows(@Param("limit") int limit);

    // ---- Aggregates for the analytics dashboard ----------------------------------------

    @Query("SELECT SUM(p.likes) FROM Post p")
    Long sumLikes();

    @Query("SELECT SUM(p.views) FROM Post p")
    Long sumViews();

    @Query("SELECT AVG(p.likes) FROM Post p")
    Double averageLikes();

    @Query("SELECT a.id AS authorId, a.name AS authorName, COUNT(p) AS postCount, SUM(p.likes) AS totalLikes "
            + "FROM Post p JOIN p.author a "
            + "GROUP BY a.id, a.name "
            + "ORDER BY SUM(p.likes) DESC")
    List<AuthorStats> topAuthors(Pageable pageable);
}
