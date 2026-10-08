package com.example.readapi.seed;

import com.example.readapi.entity.Author;
import com.example.readapi.entity.Comment;
import com.example.readapi.entity.Post;
import com.example.readapi.repository.AuthorRepository;
import com.example.readapi.repository.CommentRepository;
import com.example.readapi.repository.PostRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/** Fills the in-memory database on every start so there is enough data for paging and benchmarking. */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private static final String[] FIRST_NAMES = {
            "Aarav", "Diya", "Kabir", "Meera", "Rohan", "Isha", "Arjun", "Naina", "Vihaan", "Tara",
            "Dev", "Anaya", "Kiran", "Zoya", "Ishaan", "Riya", "Neel", "Sara", "Aditya", "Mira",
            "Yash", "Pooja", "Rahul", "Simran", "Karan"};
    private static final String[] LAST_NAMES = {
            "Sharma", "Gill", "Verma", "Kaur", "Singh", "Mehta", "Rao", "Nair", "Bose", "Khan"};

    private static final String[] TOPICS = {
            "Spring Boot", "database indexes", "caching", "REST design", "pagination", "JPA",
            "load testing", "latency", "microservices", "API versioning", "Redis", "SQL joins",
            "connection pools", "observability", "query plans"};
    private static final String[] TITLE_FORMATS = {
            "What I learned about %s this week", "Five mistakes with %s", "Why %s matters at scale",
            "A practical guide to %s", "Rethinking %s", "%s: notes from production",
            "Getting started with %s", "Stop guessing about %s"};
    private static final String[] SENTENCES = {
            "We measured the endpoint before touching any code, and the numbers surprised us.",
            "The first version worked fine with a few hundred rows and fell over at fifty thousand.",
            "Adding one index cut the slowest query from seconds to a few milliseconds.",
            "Caching helped, but only after we decided how long stale data was acceptable.",
            "Every extra round trip to the database showed up directly in the response time.",
            "Returning less data per request turned out to be the cheapest optimization of all.",
            "A small benchmark script saved us from arguing about performance in meetings.",
            "Sorting on an unindexed column looked harmless until the table grew.",
            "Fetching related rows in a loop is easy to write and expensive to run.",
            "Keep payloads small, keep pages small, and let the client ask for more."};
    private static final String[] COMMENT_TEXTS = {
            "Great write-up, the before and after numbers are convincing.",
            "We hit the same N+1 problem last month, JOIN FETCH fixed it.",
            "How long do you keep the cache entries?",
            "Did you try this with a larger dataset?",
            "Bookmarked, this will help our team.",
            "Would love a follow-up on index selection.",
            "Cursor-based pagination might be worth a mention too.",
            "Clear and to the point, thanks for sharing."};

    private final AuthorRepository authorRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    @Value("${app.seed.authors:25}")
    private int authorCount;

    @Value("${app.seed.posts:2000}")
    private int postCount;

    public DataSeeder(AuthorRepository authorRepository,
                      PostRepository postRepository,
                      CommentRepository commentRepository) {
        this.authorRepository = authorRepository;
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (authorRepository.count() > 0) {
            return;
        }
        long start = System.currentTimeMillis();
        Random random = new Random(42);
        Instant now = Instant.now();

        List<Author> authors = new ArrayList<>();
        for (int i = 0; i < authorCount; i++) {
            String name = FIRST_NAMES[i % FIRST_NAMES.length] + " " + LAST_NAMES[(i * 3) % LAST_NAMES.length];
            String email = name.toLowerCase().replace(' ', '.') + i + "@example.com";
            authors.add(new Author(name, email));
        }
        authorRepository.saveAll(authors);

        List<Post> posts = new ArrayList<>();
        for (int i = 0; i < postCount; i++) {
            Author author = authors.get(random.nextInt(authors.size()));
            String title = String.format(TITLE_FORMATS[random.nextInt(TITLE_FORMATS.length)],
                    TOPICS[random.nextInt(TOPICS.length)]);
            StringBuilder content = new StringBuilder();
            int sentences = 3 + random.nextInt(4);
            for (int s = 0; s < sentences; s++) {
                content.append(SENTENCES[random.nextInt(SENTENCES.length)]).append(' ');
            }
            // Skewed numbers: most posts are quiet, a few are popular.
            int likes = (int) (Math.pow(random.nextDouble(), 3) * 5000);
            int views = likes * (3 + random.nextInt(8)) + random.nextInt(200);
            Instant createdAt = now.minus(random.nextInt(90 * 24 * 60), ChronoUnit.MINUTES);
            posts.add(new Post(title, content.toString().trim(), likes, views, createdAt, author));
        }
        postRepository.saveAll(posts);

        List<Comment> comments = new ArrayList<>();
        for (Post post : posts) {
            int count = random.nextInt(7); // 0 to 6 comments per post
            for (int c = 0; c < count; c++) {
                Author commenter = authors.get(random.nextInt(authors.size()));
                Instant createdAt = post.getCreatedAt().plus(1 + random.nextInt(60 * 24 * 5), ChronoUnit.MINUTES);
                comments.add(new Comment(commenter.getName(),
                        COMMENT_TEXTS[random.nextInt(COMMENT_TEXTS.length)], createdAt, post));
            }
        }
        commentRepository.saveAll(comments);

        log.info("Seeded {} authors, {} posts and {} comments in {} ms",
                authors.size(), posts.size(), comments.size(), System.currentTimeMillis() - start);
    }
}
