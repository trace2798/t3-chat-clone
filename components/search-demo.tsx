// app/components/SearchDemo.tsx
"use client";

import * as React from "react";

export function SearchDemo() {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<any[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      //console.log("DATA SEARCH:", data)
      setResults(data);
    } catch (err: any) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <form onSubmit={handleSearch} className="flex space-x-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search DuckDuckGo…"
          className="flex-1 border px-3 py-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "…searching" : "Search"}
        </button>
      </form>

      {error && (
        <p className="mt-4 text-red-600">Error: {error}</p>
      )}

      {!error && results.length > 0 && (
        <ul className="mt-4 list-disc list-inside space-y-2">
          {JSON.stringify(results, null, 2)}
          {/* {results.map((item, i) => (
            <li key={i}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {item.title || item.url}
              </a>
              {item.snippet && <p className="text-sm">{item.snippet}</p>}
            </li>
          ))} */}
        </ul>
      )}
    </div>
);
}
