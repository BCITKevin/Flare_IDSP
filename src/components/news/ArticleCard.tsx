import styles from "./ArticleCard.module.css";

// Define an interface for the article type
interface Article {
  id: string;
  image: string;
  title: string;
  date: string;
  author: string;
  // publisher: string;
}

export default function articleCard({ article }: { article: Article }) {
  return (
    <div key={article.id} className={styles.articleCardContainer}>
      <img
        src={article.image}
        alt="news article"
        className={`rounded-lg ${styles.articleImage}`}
      />
      <div>
        <h2 className={`text-xl font-semibold ${styles.articleTitle}`}>
          {article.title}
        </h2>
        <div className={`flex justify-between space-x-0.5 ${styles.articleDescription}`}>
          <p>{article.author}   |</p>
          <p>{new Date(article.date).toLocaleDateString('en-US')}</p>
        </div>
      </div>
    </div>
  );
}
