import styles from "./ArticleCard.module.css"

export default function articleCard({ article }: { article: any }) {
    return (

        <div key={article.id} className={styles.articleCardContainer}>
            <img
                src={article.image}
                alt="news article"
                className={`rounded-lg ${styles.articleImage}`}
            />
            <div>
                <h2 className={`text-xl font-bold ${styles.articleTitle} pb-2 pr-3`}>{article.title}</h2>
                <div className="flex space-x-0.5 text-gray-500">
                    <p>{new Date(article.date).toLocaleDateString()}</p>
                    <p>|</p>
                    <p>{article.author}</p>
                </div>
            </div>
        </div>
    )
};