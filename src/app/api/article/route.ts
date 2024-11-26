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
    console.log('Attempting to fetch article from:', articleUrl);

    const response = await axios.get(articleUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Referer": "https://www.msn.com",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "cross-site",
        "Pragma": "no-cache",
        "Cache-Control": "no-cache"
      },
      timeout: 5000,
      maxRedirects: 5
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    console.log('Response HTML preview:', response.data.substring(0, 500));

    const dom = new JSDOM(response.data, {
      url: articleUrl,
      contentType: "text/html",
      runScripts: "dangerously",
      resources: "usable",
      pretendToBeVisual: true
    });
    
    console.log('Main content elements:', dom.window.document.body.innerHTML.substring(0, 500));
    
    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) {
      console.log('Failed to parse article - no content extracted');
      
      const mainContent = dom.window.document.querySelector('article') || 
                         dom.window.document.querySelector('.article-content') ||
                         dom.window.document.querySelector('main');
      
      if (mainContent) {
        return new Response(
          JSON.stringify({
            title: dom.window.document.title,
            content: mainContent.textContent,
            byline: "",
            siteName: "MSN",
          }),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
      
      return new Response("Failed to parse article", { status: 400 });
    }

    console.log('Successfully parsed article:', {
      title: article.title,
      byline: article.byline,
      siteName: article.siteName,
      contentLength: article.textContent?.length
    });

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
    console.error("Detailed error:", {
      message: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined,
    });

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
