"use client";
import { useEffect, useState } from "react";

type Post = {
  id: number;
  title: string;
  content: string;
  published: boolean | number;
  authorId: number;
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  async function loadPosts() {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { title, content, authorId: 1 };

    if (editingId) {
      await fetch("/api/posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...payload }),
      });
    } else {
      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    reset();
    loadPosts();
  }

  async function remove(id: number) {
    if (!confirm("Are you sure?")) return;
    await fetch("/api/posts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadPosts();
  }

  const reset = () => {
    setTitle("");
    setContent("");
    setEditingId(null);
  };

  useEffect(() => { loadPosts(); }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 font-sans text-slate-800 bg-white min-h-screen">
      <h1 className="text-3xl font-black mb-8 text-indigo-700">POST MANAGER</h1>

      {/* Form with colored border */}
      <form onSubmit={submit} className="border-t-4 border-indigo-600 shadow-lg p-6 rounded-lg mb-12 bg-slate-50">
        <h2 className="text-lg font-bold mb-4 text-slate-700 uppercase tracking-wide">
          {editingId ? "✏️ Edit Mode" : "➕ New Entry"}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block font-bold text-xs text-slate-500 uppercase mb-1">Title</label>
            <input 
              className="w-full border-2 border-slate-200 p-2 rounded outline-none focus:border-indigo-500 transition-all"
              placeholder="Post title..."
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required 
            />
          </div>
          
          <div>
            <label className="block font-bold text-xs text-slate-500 uppercase mb-1">Content</label>
            <textarea 
              className="w-full border-2 border-slate-200 p-2 rounded outline-none focus:border-indigo-500 transition-all min-h-[100px]"
              placeholder="Write something..."
              value={content} 
              onChange={e => setContent(e.target.value)} 
              required 
            />
          </div>

          <div className="flex gap-3">
            <button type="submit" className="bg-indigo-600 text-white px-8 py-2 rounded-md font-bold hover:bg-indigo-700 active:bg-indigo-800 transition-all">
              {editingId ? "SAVE CHANGES" : "CREATE POST"}
            </button>
            {editingId && (
              <button type="button" onClick={reset} className="bg-slate-200 text-slate-600 px-6 py-2 rounded-md font-bold hover:bg-slate-300 transition-all">
                CANCEL
              </button>
            )}
          </div>
        </div>
      </form>

      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="w-8 h-1 bg-indigo-600"></span> 
        RECENT POSTS
      </h2>

      {/* List with light color accents */}
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="group border border-slate-200 p-5 rounded-lg hover:bg-indigo-50 transition-colors">
            <h3 className="text-lg font-extrabold text-slate-800 mb-1">{post.title}</h3>
            <p className="text-slate-600 mb-4">{post.content}</p>
            
            <div className="flex gap-6">
              <button 
                onClick={() => { setEditingId(post.id); setTitle(post.title); setContent(post.content); }} 
                className="text-xs font-black text-indigo-600 hover:text-indigo-800 uppercase"
              >
                [ Edit ]
              </button>
              <button 
                onClick={() => remove(post.id)} 
                className="text-xs font-black text-rose-500 hover:text-rose-700 uppercase"
              >
                [ Delete ]
              </button>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <p className="text-center text-slate-400 py-10 border-2 border-dashed border-slate-200 rounded-lg">
            No posts available.
          </p>
        )}
      </div>
    </div>
  );
}