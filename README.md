## Overview

This repository is my submission for T3 chat cloneathon, it is a real-time AI-powered chat application built on the  Nextjs and powered by Convex for realtime backend/database and OpenRouter’s unified AI gateway for LLM streaming, web search, and image-generation tools.

## Features

* **Realtime Messaging**
  Instantly syncs chat messages using Convex live queries and the Next.js App Router.

* **AI-Assisted Chat**
  Streams responses token-by-token through OpenRouter’s AI SDK provider, enabling high-throughput LLM access.

* **Web-Search Tool**
  On-demand `getSearchResultsTool` integration to ground answers in current web data.

* **Image Generation**
  `generateImageTool` for creating illustrations on user request, never colliding with search calls.

* **Type-Safe**
  Fully authored in TypeScript for end-to-end type safety across frontend, backend, and AI integrations.

* **Utility-First UI**
  Styled with Tailwind CSS and shadcn/ui components for a responsive, modern look.

## Tech Stack

* **Next.js 15 (App Router)**
  File-based routing, SSR/SSG, and React Server Components.

* **TypeScript**
  Static typing throughout client, server, and AI-tool codebases.

* **Tailwind CSS**
  Rapid utility-first styling without leaving markup.

* **Convex**
  Managed realtime backend and database with live query subscriptions.

* **OpenRouter AI SDK**
  Unified gateway to hundreds of LLMs and structured function-calling tools (search, image).

## Getting Started

1. **Clone the repo**

   ```bash
   git clone https://github.com/trace2798/t3-chat-clone.git
   cd t3-chat-clone
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. **Configure environment**
   Copy and fill in your `.env.local` file (see below).

4. **Run Convex locally**

   ```bash
   pnpm dlx convex dev
   # or
   npx convex dev
   ```

5. **Start the Next.js server**

   ```bash
   pnpm dev
   # or
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to start chatting.

## Environment Variables

| Variable                     | Description                                                  |
| ---------------------------- | ------------------------------------------------------------ |
| `NEXT_PUBLIC_CONVEX_URL`     | Your Convex project URL (from `npx convex dev`)              |
| `OPENROUTER_API_KEY`         | API key for OpenRouter’s unified AI gateway                  |
| *(Optional)* other auth keys | e.g. Clerk or Auth.js secrets if you add user authentication |

## Project Structure

```
├── app/                   # Next.js App Router pages & layouts
├── components/            # Reusable React and UI components
├── convex/                # Convex backend functions & queries (TypeScript)
├── lib/                   # AI prompts, tool definitions, utilities
├── public/                # Static assets (icons, images)
├── .env.example           # Sample environment config
├── next.config.ts         # Next.js configuration
└── package.json           # Dependencies & scripts
```

## Contributing

Contributions and issues are welcome! Please open a pull request or issue on GitHub to propose changes or request features.

## License

This project is open-source under the **MIT License**.
