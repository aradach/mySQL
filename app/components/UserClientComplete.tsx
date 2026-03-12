"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
};

export default function UsersClientComplete() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  async function loadUsers() {
    const res = await fetch("/api/users");
    setUsers(await res.json());
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (editingId === null) {
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
    } else {
      await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          name,
          email,
        }),
      });
    }

    setName("");
    setEmail("");
    setEditingId(null);
    loadUsers();
  }

  async function remove(id: number) {
    await fetch("/api/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadUsers();
  }

  function edit(user: User) {
    setEditingId(user.id);
    setName(user.name);
    setEmail(user.email);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Card */}
        <div className="bg-white shadow-xl rounded-2xl p-8">

          <h2 className="text-2xl font-bold mb-6 text-center">
            {editingId ? "✏️ Edit User" : "➕ Add User"}
          </h2>

          {/* Form */}
          <form onSubmit={submit} className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Name
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-2 
                           focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-2 
                           focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className={`flex-1 py-2 rounded-lg text-white font-medium transition
                  ${
                    editingId
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                {editingId ? "Update User" : "Add User"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setName("");
                    setEmail("");
                  }}
                  className="flex-1 py-2 rounded-lg bg-gray-400 hover:bg-gray-500 text-white transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <hr className="my-8" />

          {/* User List */}
          <h2 className="text-xl font-semibold mb-4">User List</h2>

          <ul className="space-y-3">
            {users.map((u) => (
              <li
                key={u.id}
                className="flex justify-between items-center bg-gray-50 
                           border rounded-xl p-4 hover:shadow-md transition"
              >
                <div>
                  <p className="font-semibold text-gray-800">{u.name}</p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => edit(u)}
                    className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 
                               text-white rounded-lg text-sm transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => remove(u.id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 
                               text-white rounded-lg text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

        </div>
      </div>
    </div>
  );
}