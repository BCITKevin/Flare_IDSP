// path: src/app/news/page.tsx

"use client";

import { useState, useEffect, FormEvent } from "react";
import ArticleCard from "../../components/news/ArticleCard";
import BottomNavBar from "@/components/BottomNavBar";
import styles from "./news.module.css";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

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
  const [query, setQuery] = useState<string>("wildfires near me"); // 초기 키워드 변경
  const [articles, setArticles] = useState<BingNewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tabState, setTabState] = useState<Category>("Local");
  const [currentQuery, setCurrentQuery] = useState<string>(""); // 현재 쿼리를 저장할 상태 추가

  useEffect(() => {
    const savedQuery = localStorage.getItem("lastQuery");
    if (savedQuery) setQuery(savedQuery);
  }, []);

  useEffect(() => {
    // 탭이 변경될 때마다 쿼리 업데이트
    let newQuery = "";
    switch (tabState) {
      case "Local":
        newQuery = "Wildfires near me";
        break;
      case "Regional":
        newQuery = "Wildfire B.C.";
        break;
      case "National":
        newQuery = "Wildfire Canada";
        break;
      case "Global":
        newQuery = "Wildfire";
        break;
      default:
        newQuery = "BC wildfires";
    }
    setQuery(newQuery);
    setCurrentQuery(newQuery); // 현재 쿼리 업데이트
  }, [tabState]);

  useEffect(() => {
    if (query) localStorage.setItem("lastQuery", query);

    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/news/?query=${encodeURIComponent(query)}&mkt=en-CA`
        ); // mkt 파라미터 추가
        console.log("Client fetched from API"); // 추가된 로그
        if (!res.ok) {
          throw new Error(`API 요청 실패: ${res.statusText}`);
        }
        const data: { value: BingNewsArticle[] } = await res.json();
        console.log("Client received data:", data); // 추가된 로그
        setArticles(data.value || []);
      } catch (err: unknown) {
        console.error("Client error:", err); // 추가된 로그
        setError("Failed to fetch news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [query]);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get("search") as string;
    setQuery(searchQuery);
    setCurrentQuery(searchQuery); // 검색 쿼리도 현재 쿼리로 업데이트
  };

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

  return (
    <div>
      <div className="newsLayout">
        <header>
          <h1 className={`${styles.newsHeading}`}>News</h1>
          <h4 className={`${styles.newsSubHeading} mt-5`}>
            Get the latest Information about &ldquo;{currentQuery}&rdquo;
          </h4>
          <form onSubmit={handleSearch} className="mb-5">
            <input
              type="text"
              name="search"
              placeholder="Search news..."
              defaultValue={query}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              Search
            </button>
          </form>
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
                        <Link
                          href={highlighted.url}
                          className={`${styles.articleHighlight}`}
                        >
                          {highlighted.image?.thumbnail?.contentUrl && (
                            <Image
                              src={highlighted.image.thumbnail.contentUrl}
                              alt={highlighted.name}
                              width={400}
                              height={251}
                              className={`rounded-lg ${styles.articleHighlightImage}`}
                            />
                          )}
                          <div className="indent-6">
                            <h5
                              className={`${styles.articleHighlightTitle} text-xl font-bold m-auto p-3`}
                            >
                              {highlighted.name}
                            </h5>
                            <div className="flex pb-3 text-gray-500">
                              <p>
                                {highlighted.provider[0]?.name ||
                                  "Unknown Source"}
                              </p>
                              <p>
                                {isNaN(
                                  new Date(highlighted.datePublished).getTime()
                                )
                                  ? "Invalid Date"
                                  : new Date(
                                      highlighted.datePublished
                                    ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </Link>
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
                            <Link key={index} href={article.url} passHref>
                              <ArticleCard article={transformedArticle} />
                            </Link>
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
