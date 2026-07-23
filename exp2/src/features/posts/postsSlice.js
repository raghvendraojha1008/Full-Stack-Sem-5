import { createSlice, createAsyncThunk, createEntityAdapter, nanoid } from "@reduxjs/toolkit";
import { fetchPostsFromServer } from "../../api/mockApi";

// ---------------------------------------------------------------------------
// Assignment 3: State Normalization using createEntityAdapter
// ---------------------------------------------------------------------------
// Instead of storing posts as a raw array (items: []), we normalize them into
// { ids: [...], entities: { id: post } }. This avoids duplication, gives O(1)
// lookups by id, and keeps updates cheap even with large datasets.
const postsAdapter = createEntityAdapter({
  // Keep the list sorted by newest first.
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

const initialState = postsAdapter.getInitialState({
  loading: "idle", // 'idle' | 'pending' | 'succeeded' | 'failed'
  error: null,
});

// ---------------------------------------------------------------------------
// Assignment 2: Async Data Handling with createAsyncThunk
// ---------------------------------------------------------------------------
// createAsyncThunk automatically dispatches pending / fulfilled / rejected
// actions around the async request, which we handle in extraReducers below.
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const posts = await fetchPostsFromServer();
  return posts;
});

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // Assignment 1: add / update / delete actions
    addPost: {
      reducer(state, action) {
        postsAdapter.addOne(state, action.payload);
      },
      // "prepare" callback lets callers pass just the fields they care about,
      // while the reducer always receives a fully-formed post object.
      prepare({ content, author, platformId }) {
        return {
          payload: {
            id: nanoid(),
            content,
            author,
            platformId,
            createdAt: new Date().toISOString(),
          },
        };
      },
    },
    updatePost: (state, action) => {
      // action.payload = { id, changes: { content, platformId, ... } }
      postsAdapter.updateOne(state, action.payload);
    },
    deletePost: (state, action) => {
      // action.payload = id
      postsAdapter.removeOne(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = "succeeded";
        // setAll replaces the whole normalized collection with fresh data.
        postsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message ?? "Unknown error";
      });
  },
});

export const { addPost, updatePost, deletePost } = postsSlice.actions;
export default postsSlice.reducer;

// Entity adapter ships with pre-built, already-memoized selectors.
export const postsSelectors = postsAdapter.getSelectors((state) => state.posts);
