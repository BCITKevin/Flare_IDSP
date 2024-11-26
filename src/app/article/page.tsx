//path: src/app/article/page.tsx
"use client";

import { useEffect, useState } from 'react';
import "./page.css";
import ArticleNavigation from "./articleNavigation";
import ArticleInfo from "./articleInfo";
import ArticleHero from "./articleHero";
import ArticleContent from "./articleContent";
import BottomNavBar from "@/components/BottomNavBar";

interface ArticleData {
  title: string;
  date: string;
  author: string;
  content: string;
  image: string;
  source: string;
  isProtected?: boolean;
  url?: string;
}

export default function Article() {
  const [articleData, setArticleData] = useState<ArticleData | null>(null);

  useEffect(() => {
    const savedArticle = localStorage.getItem('articleData');
    if (savedArticle) {
      setArticleData(JSON.parse(savedArticle));
    }
  }, []);

  if (!articleData) return <div>Loading...</div>;

  return (
    <div>
      <div className="appLayout flex-col">
        <div className="flex-col max-w-[850px] mx-auto w-full">
          <ArticleNavigation 
            source={articleData.source}
          />
          <ArticleInfo 
            title={articleData.title}
            date={articleData.date}
            author={articleData.author}
            source={articleData.source}
          />
          {articleData.isProtected ? (
            <div className="p-4 text-center text-white">
              <p className="mb-4">{articleData.content}</p>
              <a 
                href={articleData.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 underline"
              >
                View Original Article
              </a>
            </div>
          ) : (
            <div className='flex flex-col'>
              <ArticleHero imageUrl={articleData.image} />
              <div>
                <ArticleContent content={articleData.content} />
              </div>
            </div>
          )}
        </div>
      </div>
      <BottomNavBar />
    </div>

  );
}