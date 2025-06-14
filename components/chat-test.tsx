// app/chat/demo/page.tsx
"use client";

import { useChat } from "@ai-sdk/react";

export default function DemoChat() {
  const { messages, input, handleInputChange, handleSubmit, status, stop } =
    useChat({

      onFinish: (message) => {
        console.log(message);
      },
    });

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        {messages.map((m) => (
          <div key={m.id}>
            <strong>{m.role === "user" ? "You" : "AI"}:</strong> {m.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1"
          value={input}
          onChange={handleInputChange}
          placeholder="Say something…"
        />
        <button
          type="submit"
          disabled={status !== "ready" && status !== "error"}
          className="px-4 py-1 bg-blue-600 text-white rounded"
        >
          {status === "streaming" ? "…thinking" : "Send"}
        </button>
        {(status === "streaming" || status === "submitted") && (
          <button
            type="button"
            onClick={stop}
            className="px-2 py-1 bg-red-500 text-white rounded"
          >
            Stop
          </button>
        )}
      </form>
    </div>
  );
}
