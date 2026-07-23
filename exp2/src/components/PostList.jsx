import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectVisiblePosts } from "../features/posts/postsSelectors";
import { selectAllPlatforms } from "../features/platforms/platformsSlice";
import { deletePost } from "../features/posts/postsSlice";

// ---------------------------------------------------------------------------
// Assignment 5: Performance Optimization and Avoiding Re-renders
// ---------------------------------------------------------------------------
// PostItem is wrapped in React.memo so it only re-renders when its own props
// (the specific post + platform name + callbacks) change, not whenever a
// sibling post changes or an unrelated part of the store updates.
const PostItem = React.memo(function PostItem({ post, platformName, onDelete }) {
  // Uncomment to visually verify re-render behavior in the console:
  // console.log("Rendering post:", post.id);
  return (
    <li className="post-item">
      <div className="post-item__header">
        <strong>{post.author}</strong>
        <span className="post-item__platform">{platformName}</span>
      </div>
      <p className="post-item__content">{post.content}</p>
      <div className="post-item__footer">
        <span className="post-item__date">
          {new Date(post.createdAt).toLocaleString()}
        </span>
        <button onClick={() => onDelete(post.id)}>Delete</button>
      </div>
    </li>
  );
});

export default function PostList() {
  const dispatch = useDispatch();
  const posts = useSelector(selectVisiblePosts);
  const platforms = useSelector(selectAllPlatforms);
  const loading = useSelector((state) => state.posts.loading);
  const error = useSelector((state) => state.posts.error);

  // useMemo: avoid rebuilding the id->name lookup table on every render.
  const platformNameById = React.useMemo(() => {
    return platforms.reduce((map, platform) => {
      map[platform.id] = platform.name;
      return map;
    }, {});
  }, [platforms]);

  // useCallback: keep a stable function reference so PostItem's React.memo
  // doesn't see a "new" prop (and re-render) on every parent render.
  const handleDelete = React.useCallback(
    (id) => {
      dispatch(deletePost(id));
    },
    [dispatch]
  );

  if (loading === "pending") {
    return <p className="status">Loading posts…</p>;
  }

  if (loading === "failed") {
    return <p className="status status--error">Error: {error}</p>;
  }

  if (posts.length === 0) {
    return <p className="status">No posts match the current filters.</p>;
  }

  return (
    <ul className="post-list">
      {posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          platformName={platformNameById[post.platformId] ?? "Unknown"}
          onDelete={handleDelete}
        />
      ))}
    </ul>
  );
}
