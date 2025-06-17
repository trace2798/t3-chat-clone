// import { tool } from "ai";
// import { z } from "zod";

// export const getSearchResultsTool = tool({
//   description: "Get Search Results from the Internet (top 6 only)",
//   parameters: z.object({
//     query: z.string(),
//   }),
//   execute: async ({ query }) => {
//     console.log("INSIDE TOOL, query:", query);

//     const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
//     const url = `${base}/api/search?q=${encodeURIComponent(query)}`;

//     // 2) Fetch…
//     const resp = await fetch(url);
//     if (!resp.ok) {
//       console.error(
//         "Search API returned error status",
//         resp.status,
//         await resp.text()
//       );
//       return []; // still return something
//     }

//     // 3) Parse & slice
//     const data: Array<{
//       title: string;
//       url: string;
//       snippet: string;
//     }> = await resp.json();
//     console.log("DATA SEARCH:", data);

//     return data.slice(0, 6);
//   },
// });
import { tool } from "ai";
import { z } from "zod";

export const getSearchResultsTool = tool({
  description: "Get Search Results from the Internet (top 6 only)",
  parameters: z.object({
    query: z.string(),
  }),
  execute: async ({ query }) => {
    console.log("INSIDE TOOL, query:", query);

    // 1) Build the URL
    let base: string;
    let url: string;
    try {
      base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
      url = `${base}/api/search?q=${encodeURIComponent(query)}`;
    } catch (err) {
      console.error("✖️ [URL BUILD ERROR]", err);
      return [];
    }

    // 2) Fetch
    let resp: Response;
    try {
      resp = await fetch(url);
      if (!resp.ok) {
        const text = await resp.text().catch(() => "<no body>");
        throw new Error(`status ${resp.status}, body: ${text}`);
      }
    } catch (err) {
      console.error("✖️ [FETCH ERROR]", err);
      return [];
    }

    // 3) Parse JSON
    let data: Array<{ title: string; url: string; snippet: string }>;
    try {
      data = await resp.json();
    } catch (err) {
      console.error("✖️ [JSON PARSE ERROR]", err);
      return [];
    }
    console.log("DATA SEARCH:", data);
    // 4) Slice top 6
    try {
      return data.slice(0, 6);
    } catch (err) {
      console.error("✖️ [SLICE ERROR]", err);
      return [];
    }
  },
});
