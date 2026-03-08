import React, { useState } from "react";
import { Copy, Trash } from "lucide-react";

export default function App() {
  const [text, setText] = useState("");

  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const characters = text.length;
  const readingTime = Math.ceil(words / 200);

  const copyText = () => {
    navigator.clipboard.writeText(text);
    alert("✨ Text copied!");
  };

  const clearText = () => {
    setText("");
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3] text-black flex flex-col font-serif">
      {/* Header */}
      <header className="p-4 border-b flex justify-between items-center bg-white shadow">
        <h1 className="text-2xl font-bold tracking-wide">Zen Writing Dashboard</h1>
        <div className="flex gap-4">
          <button
            onClick={copyText}
            className="flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-700 rounded-full hover:scale-105 transition"
          >
            <Copy size={18} /> Copy
          </button>
          <button
            onClick={clearText}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full hover:scale-105 transition"
          >
            <Trash size={18} /> Clear
          </button>
        </div>
      </header>

      {/* Text Area */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 p-8 text-lg outline-none resize-none bg-white shadow-inner rounded-lg leading-relaxed"
        placeholder="🪷 Let your thoughts flow..."
      />

      {/* Analytics */}
      <footer className="p-4 border-t flex justify-center gap-6 bg-white shadow-inner">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
          ✍️ Characters: {characters}
        </span>
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
          📖 Words: {words}
        </span>
        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full">
          ⏱ Reading Time: {readingTime} min
        </span>
      </footer>
    </div>
  );
}
