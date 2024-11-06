import Link from 'next/link';
import styles from "./ArticleHighlight.module.css"

export default function ArticleHighlight({ article }) {
  return (
    <div>
      <Link href="/article" key={article.id} className={`${styles.articleHighlight} mt-6`}>
        <img
          src={'https://picsum.photos/200/300'}
          alt="news article"
          className={`rounded-lg ${styles.articleHighlightImage}`}
        />
        <div className="indent-6">
          <h5 className={`${styles.articleHighlightTitle} text-xl font-bold m-auto p-3`}>{article.title}</h5>
          <div className="flex pb-3 text-gray-500">
            <p>{article.author}</p>
            <p>{new Date(article.date).toLocaleDateString()}</p>
            <Link href="https://vancouversun.com">Coastal Daily News</Link>
          </div>
        </div>
      </Link>
    </div>
  );
}
