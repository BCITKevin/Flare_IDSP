// path: src/app/news/page.tsx

"use client";

import { useState, useEffect } from "react";
import ArticleCard from "../../components/news/ArticleCard";
import BottomNavBar from "@/components/BottomNavBar";
import styles from "./news.module.css";
//import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  content?: string; // 전체 기사 내용
}

type Category = "Local" | "Regional" | "National" | "Global";

export default function News() {
  const [query, setQuery] = useState<string>(""); // 빈 문자열로 초기화
  const [articles, setArticles] = useState<BingNewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tabState, setTabState] = useState<Category>("Local");
  const router = useRouter();

  // 탭 변경시 쿼리 업데이트 함수
  const getQueryForTab = (tab: Category): string => {
    switch (tab) {
      case "Local":
        return "Wildfires near me";
      case "Regional":
        return "Wildfire B.C.";
      case "National":
        return "Wildfire Canada";
      case "Global":
        return "Wildfire";
      default:
        return "BC wildfires";
    }
  };

  // 초기 로딩 및 탭 변경시 쿼리 업데이트
  useEffect(() => {
    const newQuery = getQueryForTab(tabState);
    setQuery(newQuery);
  }, [tabState]);

  // 쿼리 변경시 뉴스 fetch
  useEffect(() => {
    if (!query) return;

    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      console.log('Fetching news with query:', query); // 쿼리 로깅

      try {
        const res = await fetch(
          `/api/news/?query=${encodeURIComponent(query)}&mkt=en-CA`
        );
        if (!res.ok) {
          throw new Error(`API 요청 실패: ${res.statusText}`);
        }
        const data: { value: BingNewsArticle[] } = await res.json();
        console.log('Fetched news articles:', data.value); // 뉴스 데이터 로깅
        setArticles(data.value || []);
      } catch (err) {
        console.error(
          "Client error:",
          err instanceof Error ? err.message : err
        );
        setError("Failed to fetch news. Please try again later.");
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

  // Helper to get the highlighted article and the rest
  const getHighlightedAndOthers = (category: Category) => {
    const articles = filterArticlesByCategory(category);
    const [highlighted, ...others] = articles;
    return { highlighted, others };
  };

  const handleArticleClick = async (article: BingNewsArticle) => {
    try {
      const response = await fetch(
        `/api/article?url=${encodeURIComponent(article.url)}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const fullArticle = await response.json();
      
      if (!fullArticle || !fullArticle.content) {
        throw new Error('Invalid article data received');
      }

      localStorage.setItem(
        "articleData",
        JSON.stringify({
          title: article.name,
          date: new Date(article.datePublished).toLocaleDateString(),
          author: article.provider[0]?.name || "Unknown Author",
          content: fullArticle.content || "No content available",
          image: article.image?.thumbnail?.contentUrl || "/images/logo_Flare.png",
          source: article.provider[0]?.name,
        })
      );

      router.push("/article");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Failed to fetch article:", errorMessage);
      // 사용자에게 에러 표시 (선택사항)
      alert("Failed to load the article. Please try again later.");
    }
  };

  return (
    <div>
      <div className="newsLayout">
        <header>
          <h1 className={`${styles.newsHeading}`}>News</h1>
          <h4 className={`${styles.newsSubHeading} mt-5`}>
            Get the latest Information
          </h4>
          <p className={styles.newsDate}>
            {new Date().toLocaleDateString("en-CA", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </header>
        <svg
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
        </svg>

        <Tabs
          defaultValue="Local"
          className="w-full flex flex-col"
          onValueChange={(value) => setTabState(value as Category)}
        >
          <TabsList className={`grid-cols-4 ${styles.tabTriggerContainer}`}>
            <TabsTrigger value="Local" className={styles.tabTrigger}>
              Local
            </TabsTrigger>
            <TabsTrigger value="Regional" className={styles.tabTrigger}>
              Regional
            </TabsTrigger>
            <TabsTrigger value="National" className={styles.tabTrigger}>
              National
            </TabsTrigger>
            <TabsTrigger value="Global" className={styles.tabTrigger}>
              Global
            </TabsTrigger>
          </TabsList>
          <h2 className={`mt-3 ${styles.newsHeading}`}>{tabState}</h2>
          <TabsContent value={tabState}>
            {loading && <p className={styles.loading}>Loading...</p>}
            {error && <p className={styles.error}>Error: {error}</p>}

            {!loading && !error && (
              <>
                {(() => {
                  const { highlighted, others } =
                    getHighlightedAndOthers(tabState);
                  return (
                    <>
                      {highlighted && (
                        <div
                          className={`${styles.articleHighlight}`}
                          onClick={() => handleArticleClick(highlighted)}
                        >
                          <Image
                            src={highlighted.image?.thumbnail?.contentUrl || "/images/logo_Flare.png"}
                            alt={highlighted.name}
                            width={400}
                            height={251}
                            className={`rounded-lg ${styles.articleHighlightImage}`}
                          />
                          <div className="indent-6">
                            <h5
                              className={`${styles.articleHighlightTitle} text-xl font-bold m-auto p-3`}
                            >
                              {highlighted.name}
                            </h5>
                            <div className="flex pb-3 text-gray-500">
                              <p>{highlighted.provider[0]?.name || "Unknown Source"}</p>
                              <p>
                                {isNaN(new Date(highlighted.datePublished).getTime())
                                  ? "Invalid Date"
                                  : new Date(highlighted.datePublished).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="mt-4">
                        {others.map((article, index) => {
                          const transformedArticle = {
                            id: index.toString(),
                            image:
                              article.image?.thumbnail?.contentUrl ||
                              "/images/logo_Flare.png",
                            title: article.name,
                            date: article.datePublished,
                            author:
                              article.provider[0]?.name || "Unknown Author",
                          };
                          return (
                            <div
                              key={index}
                              onClick={() => handleArticleClick(article)}
                            >
                              <ArticleCard article={transformedArticle} />
                            </div>
                          );
                        })}
                        {others.length === 0 && (
                          <p className={styles.noResults}>
                            No {tabState.toLowerCase()} news articles found.
                          </p>
                        )}
                      </div>
                    </>
                  );
                })()}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <BottomNavBar />
    </div>
  );
}
