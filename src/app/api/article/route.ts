import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import axios from "axios";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const articleUrl = url.searchParams.get("url");

  if (!articleUrl) {
    return new Response("URL is required", { status: 400 });
  }

  try {
    const response = await axios.get(articleUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const dom = new JSDOM(response.data);
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) {
      return new Response("Failed to parse article", { status: 400 });
    }

    return new Response(
      JSON.stringify({
        title: article.title,
        content: article.textContent,
        byline: article.byline,
        siteName: article.siteName,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: unknown) {
    console.error(
      "Failed to fetch article:",
      error instanceof Error ? error.message : error
    );
    return new Response(
      JSON.stringify({
        error: "Failed to fetch article",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
