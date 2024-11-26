// src/components/news/ArticleCard.tsx

import React from "react";
import styles from "./articleCard.module.css";

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

interface ArticleCardProps {
  article: BingNewsArticle;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <div className={styles.card}>
      {article.image && article.image.thumbnail && (
        <img
          src={article.image.thumbnail.contentUrl}
          alt={article.name}
          className={styles.thumbnail}
        />
      )}
      <div className={styles.content}>
        <h2 className={styles.title}>
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            {article.name}
          </a>
        </h2>
        <p className={styles.description}>{article.description}</p>
        {article.content && (
          <div className={styles.fullContent}>
            <h3>Full Article</h3>
            <p>{article.content}</p>
          </div>
        )}
        <div className={styles.provider}>
          <span>Source: {article.provider.map((p) => p.name).join(", ")}</span>
          <span>
            Published: {new Date(article.datePublished).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
