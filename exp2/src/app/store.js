import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "../features/posts/postsSlice";
import platformsReducer from "../features/platforms/platformsSlice";
import uiReducer from "../features/ui/uiSlice";

// Assignment / Theory section 1 & 4: Single store, domain-based slices,
// separation of data state (posts, platforms) from UI state (ui).
export const store = configureStore({
  reducer: {
    posts: postsReducer,
    platforms: platformsReducer,
    ui: uiReducer,
  },
});
