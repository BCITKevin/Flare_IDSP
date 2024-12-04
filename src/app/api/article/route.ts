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
    // 저작권 보호가 필요한 뉴스 사이트들
    const protectedDomains = ["msn.com", "ctvnews.ca", "bellmedia.ca"];

    // 도메인 체크
    const isProtectedContent = protectedDomains.some((domain) =>
      articleUrl.includes(domain)
    );

    if (isProtectedContent) {
      // 메타 태그에서 이미지 URL 추출 시도
      const response = await axios.get(articleUrl);
      const dom = new JSDOM(response.data);
      const metaImage =
        dom.window.document
          .querySelector('meta[property="og:image"]')
          ?.getAttribute("content") ||
        dom.window.document
          .querySelector('meta[name="twitter:image"]')
          ?.getAttribute("content");

      return new Response(
        JSON.stringify({
          title: "Copyright Protected Content",
          content:
            "This article cannot be accessed directly due to copyright protection. Please read the original article through the link below.",
          url: articleUrl,
          isProtected: true,
          date: new Date().toISOString(),
          author: "See original article",
          source: new URL(articleUrl).hostname,
          image: metaImage || "",
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 다른 뉴스 사이트의 경우 기존 로직 사용
    console.log("Attempting to fetch article from:", articleUrl);

    const response = await axios.get(articleUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        Referer: "https://www.msn.com",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "cross-site",
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
      },
      timeout: 5000,
      maxRedirects: 5,
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    console.log("Response HTML preview:", response.data.substring(0, 500));

    const dom = new JSDOM(response.data, {
      url: articleUrl,
      contentType: "text/html",
      runScripts: "outside-only",
      resources: "usable",
      pretendToBeVisual: true,
    });

    console.log(
      "Main content elements:",
      dom.window.document.body.innerHTML.substring(0, 500)
    );

    const reader = new Readability(dom.window.document);
    const article = reader.parse();

    if (!article) {
      console.log("Failed to parse article - no content extracted");

      const mainContent =
        dom.window.document.querySelector("article") ||
        dom.window.document.querySelector(".article-content") ||
        dom.window.document.querySelector("main");

      // Extract image URL from meta tags
      const metaImage =
        dom.window.document
          .querySelector('meta[property="og:image"]')
          ?.getAttribute("content") ||
        dom.window.document
          .querySelector('meta[name="twitter:image"]')
          ?.getAttribute("content");

      if (mainContent) {
        return new Response(
          JSON.stringify({
            title: dom.window.document.title,
            content: mainContent.textContent,
            byline: "",
            siteName: "MSN",
            image: metaImage || "",
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

    // Extract image URL from meta tags for successful parse as well
    const metaImage =
      dom.window.document
        .querySelector('meta[property="og:image"]')
        ?.getAttribute("content") ||
      dom.window.document
        .querySelector('meta[name="twitter:image"]')
        ?.getAttribute("content");

    return new Response(
      JSON.stringify({
        title: article.title,
        content: article.textContent,
        byline: article.byline,
        siteName: article.siteName,
        image: metaImage || "",
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: unknown) {
    console.error("Error fetching article:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(`Failed to fetch article: ${errorMessage}`, {
      status: 400,
    });
  }
}
