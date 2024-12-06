// path: src/app/news/page.tsx

"use client";

import { useState, useEffect } from "react";
import ArticleCard from "../../components/news/ArticleCard";
import BottomNavBar from "@/components/BottomNavBar/BottomNavBar";
import styles from "./news.module.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { demoArticles } from "@/data/demoArticles";
//import { Loader2 } from "lucide-react";

interface BingNewsArticle {
  name: string;
  url: string;
  image?: {
    thumbnail?: {
      contentUrl: string;
      width?: number;
      height?: number;
    };
  };
  description: string;
  provider: { name: string }[];
  datePublished: string;
  content?: string;
  isProtected?: boolean;
}

interface DemoArticle {
  title: string;
  image: string;
  imageDescription?: string;
  author: string;
  publisher?: string;
  puplisher?: string;
  date: string;
  link: string;
  content: {
    paragraphs: string[];
  };
}

type Category = "Local" | "Regional" | "National" | "Global";

// 타입 가드 함수 추가
// function isDemoArticle(article: any): article is DemoArticle {
//   return "title" in article && "author" in article && "date" in article;
// }

export default function News() {
  const [query, setQuery] = useState<string>("");
  const [articles, setArticles] = useState<BingNewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tabState, setTabState] = useState<Category>("Local");
  const router = useRouter();

  // 탭 변경시 쿼리 업데이트 함수
  const getQueryForTab = (tab: Category): string => {
    switch (tab) {
      case "Local":
        return '"wildfire" vancouver';
      case "Regional":
        return '"wildfire" in BC';
      case "National":
        return '"wildfire" in Canada';
      case "Global":
        return '"wildfire"';
      default:
        return "active wildfire vancouver british columbia current";
    }
  };

  useEffect(() => {
    const newQuery = getQueryForTab(tabState);
    setQuery(newQuery);
  }, [tabState]);

  useEffect(() => {
    if (!query) return;

    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/news/?query=${encodeURIComponent(
            query
          )}&mkt=en-CA&freshness=Day`
        );
        if (!res.ok) {
          // API 에러 발생시 데모 기사만 표시
          console.warn("API error - showing demo articles only");
          setArticles([]);
          return;
        }
        const data: { value: BingNewsArticle[] } = await res.json();
        setArticles(data.value || []);
      } catch (err) {
        console.error("Client error:", err);
        // 에러 발생시 데모 기사만 표시
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [query]);

  // Categorize articles based on query match
  const categorizeArticles = (
    articles: BingNewsArticle[]
  ): Record<Category, BingNewsArticle[]> => {
    const categories: Record<Category, BingNewsArticle[]> = {
      Local: [],
      Regional: [],
      National: [],
      Global: [],
    };

    // 현재 탭에 모든 기사를 할당
    categories[tabState] = articles;

    return categories;
  };

  const categorizedArticles = categorizeArticles(articles);

  const filterArticlesByCategory = (category: Category) =>
    categorizedArticles[category] || [];

  const handleArticleClick = async (url: string) => {
    try {
      const response = await fetch(
        `/api/article?url=${encodeURIComponent(url)}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch article: HTTP error! status: ${response.status}`
        );
      }
      const data = await response.json();

      // localStorage에 저장할 때 모든 필요한 데이터를 포함
      const articleData = {
        title: data.title,
        content: data.content,
        date: new Date().toISOString(), // 또는 data.date
        author: data.author || "Unknown",
        image: data.image || "",
        source: new URL(url).hostname,
        isProtected: data.isProtected, // 추가
        url: data.url, // 추가
      };

      localStorage.setItem("articleData", JSON.stringify(articleData));
      router.push("/article");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Demo articles를 카테고리별로 분류
  const getDemoArticles = (category: Category): DemoArticle[] => {
    switch (category) {
      case "Local":
        return demoArticles.LocalArticles as DemoArticle[];
      case "Regional":
        return demoArticles.RegionalArticles as DemoArticle[];
      case "National":
        return demoArticles.NationalArticles as DemoArticle[];
      case "Global":
        return demoArticles.InternationalArticles as DemoArticle[];
      default:
        return [];
    }
  };

  // Demo article 클릭 핸들러
  const handleDemoArticleClick = (article: DemoArticle) => {
    // 단락을 더 읽기 쉽게 처리
    const formattedContent = article.content.paragraphs
      .map((paragraph) => paragraph.trim()) // 공백 제거
      .filter((paragraph) => paragraph.length > 0) // 빈 단락 제거
      .map((paragraph) => {
        // 인용문 처리 (따옴표로 시작하는 텍스트)
        if (paragraph.startsWith('"') || paragraph.startsWith('"')) {
          return `\n${paragraph}\n`;
        }
        // 목록 항목 처리 (불릿 또는 숫자로 시작하는 텍스트)
        if (paragraph.match(/^[•\-\d.]/)) {
          return `  ${paragraph}`; // 들여쓰기 추가
        }
        // 일반 단락
        return paragraph;
      })
      .join("\n\n"); // 단락 사이에 빈 줄 추가

    const articleData = {
      title: article.title,
      content: formattedContent,
      date: article.date,
      author: article.author,
      image: article.image,
      source: article.publisher,
      imageDescription: article.imageDescription || "",
    };

    localStorage.setItem("articleData", JSON.stringify(articleData));
    router.push("/demoArticle");
  };

  return (
    <>
      <div className="newsLayout h-full overflow-y-auto mb-44">
        <header>
          <h1 className={`${styles.newsHeading}`}>News</h1>
          {/* <h4 className={`${styles.newsSubHeading}`}>
            Get the latest Information
          </h4> */}
          <p className={styles.newsDate}>
            {new Date().toLocaleDateString("en-CA", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </header>
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          width="404"
          height="4"
          viewBox="0 0 404 4"
          fill="none"
        >
          <path
            d="M2 2H402"
            stroke="#00838F"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg> */}
        {/* this causing problems with page moving left and right */}
        <div className="mt-2">
          <Tabs
            defaultValue="Local"
            onValueChange={(value) => setTabState(value as Category)}
          >
            <TabsList className={`${styles.tabMenu}`}>
              <TabsTrigger
                value="Local"
                className={`w-full ${styles.tabDefault} ${
                  tabState === "Local" ? styles.activeTab : ""
                }`}
              >
                Local
              </TabsTrigger>
              <TabsTrigger
                value="Regional"
                className={`w-full ${styles.tabDefault} ${
                  tabState === "Regional" ? styles.activeTab : ""
                }`}
              >
                Regional
              </TabsTrigger>
              <TabsTrigger
                value="National"
                className={`w-full ${styles.tabDefault} ${
                  tabState === "National" ? styles.activeTab : ""
                }`}
              >
                National
              </TabsTrigger>
              <TabsTrigger
                value="Global"
                className={`w-full ${styles.tabDefault} ${
                  tabState === "Global" ? styles.activeTab : ""
                }`}
              >
                Global
              </TabsTrigger>
            </TabsList>
            <h2 className={`mt-3 ${styles.newsHeading}`}>{tabState}</h2>
            <TabsContent value={tabState}>
              {loading ? (
                <div className={styles.loadingContainer}>
                  <div className={styles.loadingWheel} />
                </div>
              ) : error ? (
                <p className={styles.error}>Error: {error}</p>
              ) : (
                <>
                  {(() => {
                    const demoArticles = getDemoArticles(tabState);
                    const bingArticles = filterArticlesByCategory(tabState);

                    // Bing 기사들을 날짜순으로 정렬 (최신순)
                    const sortedBingArticles = [...bingArticles].sort(
                      (a, b) =>
                        new Date(b.datePublished).getTime() -
                        new Date(a.datePublished).getTime()
                    );

                    // 모든 기사를 하나의 배열로 합치기 (정렬된 Bing 기사 사용)
                    const allArticles = [
                      ...demoArticles.map((article) => ({
                        isDemo: true as const,
                        data: article,
                      })),
                      ...sortedBingArticles.map((article) => ({
                        isDemo: false as const,
                        data: article,
                      })),
                    ];

                    // 첫 번째 기사는 하이라이트로, 나머지는 일반 카드로 표시
                    const [firstArticle, ...otherArticles] = allArticles;

                    return (
                      <>
                        {/* 첫 번째 기사 하이라이트 */}
                        {firstArticle && (
                          <div
                            className={`${styles.articleHighlight}`}
                            onClick={() => {
                              if (firstArticle.isDemo) {
                                handleDemoArticleClick(firstArticle.data);
                              } else {
                                handleArticleClick(firstArticle.data.url);
                              }
                            }}
                          >
                            <Image
                              src={
                                firstArticle.isDemo
                                  ? firstArticle.data.image
                                  : firstArticle.data.image?.thumbnail
                                      ?.contentUrl || "/images/logo_Flare.png"
                              }
                              alt={
                                firstArticle.isDemo
                                  ? firstArticle.data.title
                                  : firstArticle.data.name
                              }
                              width={400}
                              height={251}
                              className={`rounded-lg ${styles.articleHighlightImage}`}
                            />
                            <div>
                              <h5
                                className={`${styles.articleHighlightTitle} text-xl font-bold m-auto p-3`}
                              >
                                {firstArticle.isDemo
                                  ? firstArticle.data.title
                                  : firstArticle.data.name}
                              </h5>
                              <div className="flex p-3 text-[color:--l-grey]">
                                <p className="pr-6">
                                  {firstArticle.isDemo
                                    ? firstArticle.data.author
                                    : firstArticle.data.provider[0]?.name ||
                                      "Unknown Source"}
                                </p>
                                <p>
                                  {new Date(
                                    firstArticle.isDemo
                                      ? firstArticle.data.date
                                      : firstArticle.data.datePublished
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 나머지 기사들 */}
                        <div className={`mt-4 ${styles.articles}`}>
                          {otherArticles.map((article, index) => {
                            if (article.isDemo) {
                              return (
                                <div
                                  key={`demo-${index}`}
                                  onClick={() =>
                                    handleDemoArticleClick(article.data)
                                  }
                                >
                                  <ArticleCard
                                    article={{
                                      id: `demo-${index}`,
                                      image: article.data.image,
                                      title: article.data.title,
                                      date: article.data.date,
                                      author: article.data.author,
                                    }}
                                  />
                                </div>
                              );
                            } else {
                              return (
                                <div
                                  key={`bing-${index}`}
                                  onClick={() =>
                                    handleArticleClick(article.data.url)
                                  }
                                >
                                  <ArticleCard
                                    article={{
                                      id: index.toString(),
                                      image:
                                        article.data.image?.thumbnail
                                          ?.contentUrl ||
                                        "/images/logo_Flare.png",
                                      title: article.data.name,
                                      date: article.data.datePublished,
                                      author:
                                        article.data.provider[0]?.name ||
                                        "Unknown Author",
                                    }}
                                  />
                                </div>
                              );
                            }
                          })}
                        </div>
                      </>
                    );
                  })()}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <BottomNavBar />
    </>
  );
}
