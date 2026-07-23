// Simulates a real backend call with network delay.
// Used by createAsyncThunk in postsSlice (Assignment 2 - Async Data Handling).

const MOCK_POSTS = [
  {
    id: "p1",
    platformId: "pl1",
    content: "Excited to launch our new product line today!",
    author: "Alice",
    createdAt: "2026-07-01T09:00:00.000Z",
  },
  {
    id: "p2",
    platformId: "pl2",
    content: "Behind the scenes photo from our office.",
    author: "Bob",
    createdAt: "2026-07-02T10:30:00.000Z",
  },
  {
    id: "p3",
    platformId: "pl1",
    content: "Quick tip of the day: always test your reducers.",
    author: "Alice",
    createdAt: "2026-07-03T12:15:00.000Z",
  },
  {
    id: "p4",
    platformId: "pl3",
    content:
      "A longer post explaining our roadmap for the next quarter in detail, including feature plans, timelines and the team responsible for each milestone.",
    author: "Charlie",
    createdAt: "2026-07-04T08:45:00.000Z",
  },
];

const MOCK_PLATFORMS = [
  { id: "pl1", name: "Twitter / X" },
  { id: "pl2", name: "Instagram" },
  { id: "pl3", name: "LinkedIn" },
];

// Simulate network latency and an occasional failure path (never triggered by
// default, but the flag makes it easy to test the "rejected" thunk state).
export function fetchPostsFromServer({ shouldFail = false } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Failed to fetch posts from server"));
      } else {
        resolve(MOCK_POSTS);
      }
    }, 800);
  });
}

export function fetchPlatformsFromServer() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_PLATFORMS), 400);
  });
}
