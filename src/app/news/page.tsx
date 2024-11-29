// path: src/app/news/page.tsx

"use client";

import { useState, useEffect } from "react";
import ArticleCard from "../../components/news/ArticleCard";
import BottomNavBar from "@/components/BottomNavBar/BottomNavBar";
import styles from "./news.module.css";
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
  content?: string;
  isProtected?: boolean;
}

type Category = "Local" | "Regional" | "National" | "Global";

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
        return "Wildfires vancouver";
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

  useEffect(() => {
    const newQuery = getQueryForTab(tabState);
    setQuery(newQuery);
  }, [tabState]);

  useEffect(() => {
    if (!query) return;

    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      console.log('Fetching news with query:', query);

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

  const handleArticleClick = async (url: string) => {
    try {
      const response = await fetch(
        `/api/article?url=${encodeURIComponent(url)}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch article: HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // localStorage에 저장할 때 모든 필요한 데이터를 포함
      const articleData = {
        title: data.title,
        content: data.content,
        date: new Date().toISOString(),  // 또는 data.date
        author: data.author || "Unknown",
        image: data.image || "",
        source: new URL(url).hostname,
        isProtected: data.isProtected,  // 추가
        url: data.url                   // 추가
      };

      localStorage.setItem('articleData', JSON.stringify(articleData));
      router.push('/article');
    } catch (error) {
      console.error('Error:', error);
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
                          onClick={() => handleArticleClick(highlighted.url)}
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
                              onClick={() => handleArticleClick(article.url)}
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
