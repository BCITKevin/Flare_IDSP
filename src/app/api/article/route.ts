import { Readability } from "@mozilla/readability";
import { JSDOM, VirtualConsole } from "jsdom";
import axios from "axios";

// 불필요한 컨텐츠를 필터링하는 함수 추가
function cleanArticleContent(content: string): string {
  if (!content) return '';
  
  return content
    // 여러 줄 공백을 한 줄로
    .replace(/\n\s*\n/g, '\n')
    // 네비게이션 메뉴 관련 텍스트 제거
    .replace(/^(Skip to |Subscribe |FAQ |My Account |Manage |Our |News |Local |Sports |Arts ).*$/gm, '')
    .replace(/^(Vancouver |BC |NHL |NFL |NBA |MLB |MLS |Golf |Tennis |Auto Racing).*$/gm, '')
    // 구독 관련 문구 제거
    .replace(/Subscribe to.*$/gm, '')
    .replace(/^Subscribe.*$/gm, '')
    // 광고 관련 문구 제거
    .replace(/^(Advertisement|Advertising|Sponsored Content|광고).*$/gm, '')
    // 소셜 미디어 관련 문구 제거
    .replace(/Follow us on (Twitter|Facebook|Instagram|LinkedIn).*$/gm, '')
    .replace(/Share on.*$/gm, '')
    // 저작권 관련 문구 제거
    .replace(/©.*$/gm, '')
    .replace(/All rights reserved.*$/gm, '')
    // 이메일 주소 제거
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '')
    // 네비게이션/메뉴 관련 텍스트 제거
    .replace(/^(Home|Menu|Navigation|Search).*$/gm, '')
    // 불필요한 공백 제거
    .replace(/\s{2,}/g, ' ')
    .trim()
    // 빈 줄이 연속으로 있는 경우 하나로 통일
    .replace(/\n{3,}/g, '\n\n');
}

function setupJSDOM(html: string, url: string): JSDOM {
  return new JSDOM(html, {
    url: url,
    contentType: "text/html",
    runScripts: "outside-only",
    resources: "usable",
    pretendToBeVisual: true,
    virtualConsole: new VirtualConsole().sendTo(console, { omitJSDOMErrors: true })
  });
}

function extractMainContent(dom: JSDOM): string | null {
  // 일반적인 기사 본문 컨테이너 선택자들
  const contentSelectors = [
    'article[class*="article"]',
    'div[class*="article-content"]',
    'div[class*="story-content"]',
    'div[class*="post-content"]',
    'div[class*="entry-content"]',
    'div[itemprop="articleBody"]',
    'div[class*="content-body"]',
    'div[class*="article-body"]',
    'main',
  ];

  for (const selector of contentSelectors) {
    const element = dom.window.document.querySelector(selector);
    if (element) {
      // 불필요한 요소들 제거
      const elementsToRemove = element.querySelectorAll(
        'script, style, iframe, .advertisement, .social-share, .newsletter-signup, nav, header, footer'
      );
      elementsToRemove.forEach(el => el.remove());
      
      return element.textContent;
    }
  }
  return null;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const articleUrl = url.searchParams.get("url");

  if (!articleUrl) {
    return new Response("URL is required", { status: 400 });
  }

  try {
    // Add more protected/problematic domains
    const protectedDomains = [
      'msn.com',
      'ctvnews.ca',
      'bellmedia.ca',
      'lakelandtoday.ca', // Add this domain
    ];

    // Check if the URL is from a protected/problematic domain
    const isProtectedContent = protectedDomains.some(domain => 
      articleUrl.includes(domain)
    );

    if (isProtectedContent) {
      try {
        // Try to get basic metadata even for protected content
        const response = await axios.get(articleUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          },
          validateStatus: (status) => status < 500, // Accept any status < 500
        });

        const dom = new JSDOM(response.data);
        const metaImage = dom.window.document.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
                         dom.window.document.querySelector('meta[name="twitter:image"]')?.getAttribute('content');
        const metaTitle = dom.window.document.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
                         dom.window.document.title;

        return new Response(JSON.stringify({
          title: metaTitle || "Protected Content",
          content: "This article cannot be accessed directly. Please visit the original source to read the full content.",
          url: articleUrl,
          isProtected: true,
          date: new Date().toISOString(),
          author: "See original article",
          source: new URL(articleUrl).hostname,
          image: metaImage || ""
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch {  // Remove the error parameter completely
        // If metadata fetch fails, return a generic protected content response
        return new Response(JSON.stringify({
          title: "Protected Content",
          content: "This article cannot be accessed directly. Please visit the original source to read the full content.",
          url: articleUrl,
          isProtected: true,
          date: new Date().toISOString(),
          author: "See original article",
          source: new URL(articleUrl).hostname,
          image: ""
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // 다른 뉴스 사이트의 경우 기존 로직 사용
    console.log('Attempting to fetch article from:', articleUrl);

    const response = await axios.get(articleUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      timeout: 5000,
      maxRedirects: 5
    });

    const dom = setupJSDOM(response.data, articleUrl);
    
    // 메타데이터 추출
    const metaImage = dom.window.document.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
                     dom.window.document.querySelector('meta[name="twitter:image"]')?.getAttribute('content');
    
    const metaTitle = dom.window.document.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
                     dom.window.document.querySelector('title')?.textContent;
    
    const metaDescription = dom.window.document.querySelector('meta[name="description"]')?.getAttribute('content') ||
                           dom.window.document.querySelector('meta[property="og:description"]')?.getAttribute('content');

    // 본문 추출 시도
    let content = extractMainContent(dom);
    
    if (!content) {
      // Readability 사용 시도
      const reader = new Readability(dom.window.document);
      const article = reader.parse();
      content = article?.textContent || '';
    }

    // 컨텐츠 정제
    const cleanedContent = cleanArticleContent(content || '');

    return new Response(
      JSON.stringify({
        title: metaTitle || "Article",
        content: cleanedContent,
        description: metaDescription,
        image: metaImage || "",
        date: new Date().toISOString(),
        source: new URL(articleUrl).hostname
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );

  } catch (error: unknown) {
    console.error('Error fetching article:', error);
    
    // Return a more graceful error response
    return new Response(JSON.stringify({
      title: "Unable to Load Article",
      content: "This article is currently unavailable. Please try visiting the original source.",
      url: articleUrl,
      isProtected: true,
      date: new Date().toISOString(),
      author: "See original article",
      source: new URL(articleUrl).hostname,
      image: ""
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200 // Return 200 instead of 400 to handle error gracefully
    });
  }
}
