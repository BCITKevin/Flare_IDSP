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
    <div className="appLayout flex-col">
      <div className="flex-col max-w-[850px] mx-auto w-full">
        <ArticleNavigation />
        <ArticleInfo 
          title={articleData.title}
          date={articleData.date}
          author={articleData.author}
          source={articleData.source}
        />
        <ArticleHero imageUrl={articleData.image} />
        <ArticleContent content={articleData.content} />
      </div>
      <BottomNavBar />
    </div>
  );
}