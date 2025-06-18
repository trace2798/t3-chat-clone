import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function GET(request: Request) {
  const { q } = Object.fromEntries(new URL(request.url).searchParams);
  if (!q) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  try {
    const resp = await axios.get(
      `https://duckduckgo.com/html/?q=${encodeURIComponent(q)}`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );
    const html = resp.data as string;
    const $ = cheerio.load(html);
    const results: Array<{ title: string; url: string; snippet: string }> = [];
    $(".result").each((_, el) => {
      const anchor = $(el).find(".result__a");
      const title = anchor.text().trim();
      const href = anchor.attr("href") || "";
      const parsed = new URL(href, "https://duckduckgo.com");
      const uddg = parsed.searchParams.get("uddg");
      const realUrl = uddg ? decodeURIComponent(uddg) : href;
      const snippet = $(el).find(".result__snippet").text().trim();
      if (title && realUrl) {
        results.push({ title, url: realUrl, snippet });
      }
    });
    return NextResponse.json(results);
  } catch (err: any) {
    //console.error("DuckDuckGo scrape error:", err);
    return NextResponse.json(
      { error: "Failed to fetch search results" },
      { status: 500 }
    );
  }
}
