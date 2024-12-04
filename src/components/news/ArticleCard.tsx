import Image from "next/image";
import styles from "./ArticleCard.module.css";

// Define an interface for the article type
interface Article {
  id: string;
  image: string;
  title: string;
  date: string;
  author: string;
}

export default function articleCard({ article }: { article: Article }) {
  // 이미지 URL 유효성 검사
  const imageUrl =
    article.image && article.image !== ""
      ? article.image
      : "/images/logo_Flare.png";

  return (
    <div key={article.id} className={styles.articleCardContainer}>
      <Image
        src={imageUrl}
        alt={article.title}
        width={120}
        height={80}
        className={`rounded-lg ${styles.articleImage}`}
        unoptimized={imageUrl.startsWith("http")} // 외부 이미지 최적화 비활성화
        onError={(e) => {
          // 이미지 로드 실패시 로고로 대체
          const target = e.target as HTMLImageElement;
          target.src = "/images/logo_Flare.png";
        }}
      />
      <div>
        <h2 className={`text-xl font-bold ${styles.articleTitle} pb-2 pr-3`}>
          {article.title}
        </h2>
        <div className="flex space-x-0.5 text-gray-500">
          <p>{new Date(article.date).toLocaleDateString()}</p>
          <p>|</p>
          <p>{article.author}</p>
        </div>
      </div>
    </div>
  );
}
