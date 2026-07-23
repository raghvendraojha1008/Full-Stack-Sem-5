import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../features/posts/postsSlice";
import { selectAllPlatforms } from "../features/platforms/platformsSlice";

export default function AddPostForm() {
  const dispatch = useDispatch();
  const platforms = useSelector(selectAllPlatforms);

  const [content, setContent] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [platformId, setPlatformId] = React.useState("");

  const canSubmit = content.trim() && author.trim() && platformId;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    dispatch(addPost({ content, author, platformId }));
    setContent("");
    setAuthor("");
  };

  return (
    <form className="add-post-form" onSubmit={handleSubmit}>
      <h3>Add a new post</h3>
      <div className="form-row">
        <label>
          Author
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name"
          />
        </label>
        <label>
          Platform
          <select
            value={platformId}
            onChange={(e) => setPlatformId(e.target.value)}
          >
            <option value="">Select platform…</option>
            {platforms.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label>
        Content
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder="What's on your mind?"
        />
      </label>
      <button type="submit" disabled={!canSubmit}>
        Add Post
      </button>
    </form>
  );
}
