import { createSelector } from "@reduxjs/toolkit";
import { postsSelectors } from "./postsSlice";
import { selectPlatformFilter, selectShowOnlyShort } from "../ui/uiSlice";

// Base selectors (cheap, no computation)
export const selectAllPosts = postsSelectors.selectAll;

// ---------------------------------------------------------------------------
// Assignment 4: Selector Optimization with createSelector
// ---------------------------------------------------------------------------
// selectVisiblePosts only recomputes when posts, the platform filter, or the
// "short posts only" toggle actually change - not on every store update.
// This powers filtered views like the calendar/analytics screens described
// in the experiment brief.
export const selectVisiblePosts = createSelector(
  [selectAllPosts, selectPlatformFilter, selectShowOnlyShort],
  (posts, platformFilter, showOnlyShort) => {
    let result = posts;

    if (platformFilter !== "all") {
      result = result.filter((post) => post.platformId === platformFilter);
    }

    if (showOnlyShort) {
      result = result.filter((post) => post.content.length < 100);
    }

    return result;
  }
);

// Simple analytics-style derived state: post count per platform.
export const selectPostCountByPlatform = createSelector(
  [selectAllPosts],
  (posts) => {
    return posts.reduce((counts, post) => {
      counts[post.platformId] = (counts[post.platformId] ?? 0) + 1;
      return counts;
    }, {});
  }
);
