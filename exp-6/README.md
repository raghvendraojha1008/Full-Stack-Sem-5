# Experiment 6 - Scalable Read APIs with Caching and Optimization

A read-heavy post feed and analytics dashboard built to match the experiment sheet.

```
scalable-read-api/
  backend/    Spring Boot 3, Java 17+, H2 in-memory database, Ehcache 3
  frontend/   React + Vite
  start-backend.bat    double-click to start the API on port 8080
  start-frontend.bat   double-click to start the UI on port 5173
```

## What maps to what in the experiment

| Experiment section | Where it is |
|---|---|
| 1. Pagination and sorting (`Pageable`) | `PostController.getPosts`, `PostRepository.findAll(Pageable)`, Post feed page |
| 2. JPQL and query optimization | `PostRepository` (`findPageByAuthorId`, aggregate queries) |
| 3. N+1 problem and JOIN FETCH | `NPlusOneDemoService`, `PostRepository.findAllWithComments`, Query lab page |
| 4. Caching with Ehcache | `CachedPostService`, `AnalyticsService`, `ehcache.xml`, Dashboard page |
| 5. Native SQL | `PostRepository.findTopPostRows` (top posts by likes) |
| 6. Benchmarking | Benchmark page and `backend/jmeter/read-api-benchmark.jmx` |
| 7. Performance tuning | indexes on `Post`/`Comment`, small `PostSummary` payload, caching |

Assignments 1 to 5 are all covered: paginated and sorted `GET /api/posts`, the N+1 fix, cached analytics,
the native top-posts query, and a before/after caching benchmark.

## Run it on Windows 11

1. Install **JDK 17 or newer** (for example Eclipse Temurin from https://adoptium.net).
   Check in a new terminal: `java -version`
2. Install **Node.js 20 or newer (LTS)** from https://nodejs.org. Check: `node -v`
3. Open two terminals (or double-click the two `.bat` files).

Backend (terminal 1):

    cd backend
    mvnw.cmd spring-boot:run

Wait for `Seeded 25 authors, 2000 posts and ... comments` and `Started ReadApiApplication`.
Maven is downloaded automatically by the wrapper, nothing else to install.

Frontend (terminal 2):

    cd frontend
    npm install
    npm run dev

Open http://localhost:5173

## API

| Request | What it does |
|---|---|
| `GET /api/posts?page=0&size=10&sort=likes,desc` | paginated, sorted feed, cached. Optional `authorId`. Sort fields: `id`, `title`, `likes`, `views`, `createdAt` |
| `GET /api/posts/uncached` | same, but skips the cache |
| `GET /api/posts/top?limit=5` | top posts by likes (native SQL), cached |
| `GET /api/posts/{id}` | one post with comments (JOIN FETCH) |
| `POST /api/posts` | create a post, clears the caches |
| `GET /api/analytics` and `/api/analytics/uncached` | dashboard totals, cached and uncached |
| `GET /api/demo/n-plus-one/lazy` and `/join-fetch` | N+1 demo with SQL statement counts |
| `GET /api/cache/stats`, `DELETE /api/cache` | cache hit/miss counters, clear caches |

Responses carry an `X-Cache` header: `HIT`, `MISS` or `BYPASS`.

## Benchmarking with Apache JMeter

1. Download JMeter from https://jmeter.apache.org/download_jmeter.cgi and unzip it. It needs Java too.
2. With the backend running, start JMeter: `bin\jmeter.bat`
3. File, Open, `backend/jmeter/read-api-benchmark.jmx`, then press Start.
   Compare the rows in the Summary Report: "Analytics - uncached" against "Analytics - cached",
   and "Posts page - uncached" against "Posts page - cached".

Command line version (run from the JMeter folder, adjust the path):

    bin\jmeter -n -t C:\path\to\backend\jmeter\read-api-benchmark.jmx -Jthreads=20 -Jloops=30 -l results.jtl -e -o report

## Settings you can change

`backend/src/main/resources/application.properties`

- `app.seed.posts` how many posts to generate (default 2000)
- `app.analytics.simulated-load-ms` extra delay inside the analytics computation (default 200).
  It imitates a heavy report so the caching gain is visible on a tiny in-memory database.
  Set it to 0 to measure only the real queries.
- `server.port` backend port. If you change it, also change the proxy target in `frontend/vite.config.js`.

Cache sizes and expiry times are in `backend/src/main/resources/ehcache.xml`.

## Troubleshooting

- **Port 8080 or 5173 already in use**: close the other program, or change the port as above.
- **`java` is not recognized**: reopen the terminal after installing the JDK, or add its `bin` folder to PATH.
- **Frontend says it cannot reach the backend**: start the backend first and wait for "Started ReadApiApplication".
- **H2 console**: http://localhost:8080/h2-console, JDBC URL `jdbc:h2:mem:feeddb`, user `sa`, empty password.
- Data lives in memory and is regenerated on every backend start.
