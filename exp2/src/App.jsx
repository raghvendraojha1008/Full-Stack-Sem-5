import React from "react";
import { useDispatch } from "react-redux";
import { fetchPosts } from "./features/posts/postsSlice";
import { fetchPlatforms } from "./features/platforms/platformsSlice";
import AddPostForm from "./components/AddPostForm";
import FilterBar from "./components/FilterBar";
import PostList from "./components/PostList";
import "./App.css";

export default function App() {
  const dispatch = useDispatch();

  // Kick off the initial async data load (Assignment 2) once, on mount.
  React.useEffect(() => {
    dispatch(fetchPlatforms());
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <div className="app">
      <header className="app__header">
        <h1>Redux Toolkit Content State Manager</h1>
        <p className="app__subtitle">
          Unit 1 · Experiment 2 — Posts &amp; Platforms state management
        </p>
      </header>

      <main className="app__main">
        <section className="app__panel">
          <AddPostForm />
        </section>

        <section className="app__panel">
          <FilterBar />
          <PostList />
        </section>
      </main>
    </div>
  );
}
