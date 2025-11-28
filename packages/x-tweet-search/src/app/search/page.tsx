"use client";
import { useState } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>(null);

  async function search(q: string) {
      setQuery(q);
      if (q.trim() === "") return setResults(null);

      const res = await fetch(`/api/search?q=${q}`);
      const data = await res.json();
      setResults(data);
  }

  return (
    <div style={{ padding: 20 }}>
      <input
        placeholder="Search users or tweets..."
        value={query}
        onChange={(e) => search(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 8,
          border: "1px solid #ccc",
        }}
      />

      {results && (
        <div style={{ marginTop: 20 }}>
          <h3>Users</h3>
          {results.users?.map((u: any) => (
            <p key={u.username}>@{u.username} — {u.name}</p>
          ))}

          <h3>Tweets</h3>
          {results.tweets?.map((t: any) => (
            <p key={t.id}>{t.text}</p>
          ))}
        </div>
      )}
    </div>
  );
}
