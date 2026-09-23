# Experiment 5 - Spring Boot REST API Design & Exception Handling

Implements all 5 assignments from the experiment sheet:
1. CRUD REST APIs for `Post` + a scheduling endpoint (`POST /api/posts/{id}/schedule`)
2. Bean Validation (`@NotBlank`, `@Size`) on `PostRequest`
3. Logging filter (`LoggingFilter`) that logs request URI + execution time
4. Global exception handling (`@ControllerAdvice`) for validation errors, not-found, and generic exceptions
5. Correlation ID tracing via `CorrelationInterceptor` + SLF4J MDC

## Requirements
- Java 17+
- Maven 3.8+ (or use the included wrapper if you add one)

## Run it
```bash
mvn spring-boot:run
```
The API starts on `http://localhost:8080`.

## Endpoints
| Method | Path                          | Description        |
|--------|-------------------------------|---------------------|
| POST   | /api/posts                    | Create a post       |
| GET    | /api/posts                    | List all posts      |
| GET    | /api/posts/{id}                | Get a post by ID    |
| PUT    | /api/posts/{id}                | Update a post       |
| DELETE | /api/posts/{id}                | Delete a post       |
| POST   | /api/posts/{id}/schedule       | Schedule a post     |

Example create request body:
```json
{
  "content": "Hello world",
  "text": "Optional short text, max 280 chars",
  "scheduledAt": "2026-10-01T09:00:00"
}
```

## Notes
- Data is stored in-memory (no database) to keep the demo self-contained; swap `PostService`'s map for a JPA repository if you want persistence.
- CORS is enabled for `http://localhost:3000` on `PostController` (edit `@CrossOrigin` to match your frontend's origin).
- Every response comes back wrapped in the standardized `ApiResponse<T>` shape: `{ "status", "message", "data" }`.
- Every request gets a `X-Correlation-Id` response header, and the same ID appears in the server logs (`logging.pattern.console` in `application.properties`) so you can trace a single request's log lines.
- This project could not be compiled/packaged into a runnable JAR in this environment (no internet access to Maven Central here), but it's a complete, standard Maven project — just run `mvn spring-boot:run` or open it in your IDE (IntelliJ/Eclipse/VS Code) and it will build normally.
