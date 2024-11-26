import Link from "next/link";
import Image from "next/image";
import styles from "./ArticleHighlight.module.css";

interface ArticleHighlightProps {
  url: string;
  imageUrl?: string;
  title: string;
  author: string;
  date: string;
}

export default function ArticleHighlight({
  url,
  imageUrl,
  title,
  author,
  date,
}: ArticleHighlightProps) {
  return (
    <div>
      <Link href={url} className={`${styles.articleHighlight} mt-6`}>
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={title}
            width={400}
            height={251}
            className={`rounded-lg ${styles.articleHighlightImage}`}
          />
        )}
        <div className="indent-6">
          <h5
            className={`${styles.articleHighlightTitle} text-xl font-bold m-auto p-3`}
          >
            {title}
          </h5>
          <div className="flex pb-3 text-gray-500">
            <p>{author}</p>
            <p>{new Date(date).toLocaleDateString()}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
