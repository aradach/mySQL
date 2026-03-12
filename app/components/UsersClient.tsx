"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
};

export default function UsersClient() {
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
      // CREATE
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
    } else {
      // UPDATE
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
    setEditingId(user.id);   // 👈 บอกว่าแก้คนนี้
    setName(user.name);
    setEmail(user.email);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <main>
      <h2>{editingId ? "Edit User" : "Add User"}</h2>

      <form onSubmit={submit}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">
          {editingId ? "Update" : "Add"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setName("");
              setEmail("");
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <hr />

      <h2>User List</h2>

      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.name} ({u.email})
            <button onClick={() => edit(u)}>Edit</button>
            <button onClick={() => remove(u.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  );
}