// components/news/ArticleCard.tsx

import React from 'react';
import styles from './ArticleCard.module.css';

interface BingNewsArticle {
  name: string;
  url: string;
  image?: {
    thumbnail?: {
      contentUrl: string;
    };
  };
  description: string;
  provider: { name: string }[];
  datePublished: string;
}

interface ArticleCardProps {
  article: BingNewsArticle;
}

const bArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <div className={styles.card}>
      {article.image && article.image.thumbnail && (
        <img
          src={article.image.thumbnail.contentUrl}
          alt={article.name}
          className={styles.image}
        />
      )}
      <div className={styles.content}>
        <h2>{article.name}</h2>
        <p>{article.description}</p>
        <p><strong>Source:</strong> {article.provider.map(p => p.name).join(", ")}</p>
        <p><strong>Published:</strong> {new Date(article.datePublished).toLocaleDateString()}</p>
        <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
      </div>
    </div>
  );
};

export default bArticleCard;
